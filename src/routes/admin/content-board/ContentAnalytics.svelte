<!-- src/routes/admin/content-board/ContentAnalytics.svelte -->
<script lang="ts">
	import { slide } from 'svelte/transition';

	interface AnalyticsItem {
		id: number;
		person: string;
		title: string;
		enneagram: string;
		published: boolean;
		lastmod: string;
		date: string;
		outgoingCount: number;
		incomingCount: number;
		wordCount: number;
		charCount: number;
		// SEO fields
		titleLength: number;
		descriptionLength: number;
		metaTitleLength: number;
		hasImage: boolean;
		hasSocial: boolean;
		hasWikipedia: boolean;
		seoScore: number;
		// Classification
		category: string | null;
		// Social fields
		hasTwitter: boolean;
		hasInstagram: boolean;
		hasTiktok: boolean;
		socialCount: number;
		// Health score
		healthScore: number;
	}

	interface Props {
		data: App.BlogPost[];
		onSelectBlog?: (blog: App.BlogPost) => void;
	}

	let { data, onSelectBlog }: Props = $props();

	// Tab state
	let activeTab = $state<'crosslinks' | 'length' | 'recency' | 'seo' | 'distribution'>(
		'crosslinks'
	);

	// Sort state per tab
	let crosslinkSort = $state<{ field: string; order: 'asc' | 'desc' }>({
		field: 'totalLinks',
		order: 'desc'
	});
	let lengthSort = $state<{ field: string; order: 'asc' | 'desc' }>({
		field: 'wordCount',
		order: 'desc'
	});
	let recencySort = $state<{ field: string; order: 'asc' | 'desc' }>({
		field: 'daysSinceUpdate',
		order: 'desc'
	});
	let seoSort = $state<{ field: string; order: 'asc' | 'desc' }>({
		field: 'seoScore',
		order: 'asc' // Show worst first for actionability
	});

	// Filter state
	let includeDrafts = $state(false); // Default: exclude drafts

	// Distribution section expand state
	let expandedTypes = $state<Set<string>>(new Set());

	// Analytics data from API
	let analyticsData = $state<AnalyticsItem[]>([]);
	let loading = $state(false);

	// Map blog IDs to original blog objects for click handling
	let blogMap = $derived.by(() => {
		const map = new Map<number, App.BlogPost>();
		for (const blog of data) {
			const id = (blog as any).id;
			if (id) map.set(id, blog);
		}
		return map;
	});

	// Fetch analytics data
	async function fetchAnalytics() {
		loading = true;
		try {
			const res = await fetch('/api/admin/content/analytics');
			if (res.ok) {
				const result = await res.json();
				analyticsData = result.data || [];
			}
		} catch (e) {
			console.error('Failed to fetch analytics:', e);
		} finally {
			loading = false;
		}
	}

	// Fetch on mount
	$effect(() => {
		fetchAnalytics();
	});

	// Filter analytics data to match filtered blog list and draft filter
	let filteredIds = $derived(new Set(data.map((b) => (b as any).id).filter(Boolean)));

	let filteredAnalytics = $derived(
		analyticsData.filter((item) => {
			const matchesIds = filteredIds.has(item.id);
			const matchesDraftFilter = includeDrafts || item.published;
			return matchesIds && matchesDraftFilter;
		})
	);

	// Derived: Content length data
	let contentLengthData = $derived.by(() => {
		return filteredAnalytics
			.map((item) => ({
				...item,
				wordCount: item.wordCount,
				charCount: item.charCount
			}))
			.sort((a, b) => {
				const field = lengthSort.field as 'wordCount' | 'charCount';
				const aVal = a[field];
				const bVal = b[field];
				return lengthSort.order === 'desc' ? bVal - aVal : aVal - bVal;
			});
	});

	// Derived: Recency data
	let recencyData = $derived.by(() => {
		const now = new Date();
		return filteredAnalytics
			.map((item) => {
				const lastmodDate = new Date(item.lastmod || item.date || 0);
				const daysSince = Math.floor(
					(now.getTime() - lastmodDate.getTime()) / (1000 * 60 * 60 * 24)
				);
				return {
					...item,
					daysSinceUpdate: daysSince,
					lastmodTimestamp: lastmodDate.getTime(),
					freshnessStatus:
						daysSince < 30
							? 'fresh'
							: daysSince < 90
								? 'recent'
								: daysSince < 180
									? 'aging'
									: 'stale'
				};
			})
			.sort((a, b) => {
				if (recencySort.field === 'daysSinceUpdate') {
					return recencySort.order === 'desc'
						? b.daysSinceUpdate - a.daysSinceUpdate
						: a.daysSinceUpdate - b.daysSinceUpdate;
				} else if (recencySort.field === 'lastmod') {
					return recencySort.order === 'desc'
						? b.lastmodTimestamp - a.lastmodTimestamp
						: a.lastmodTimestamp - b.lastmodTimestamp;
				}
				return 0;
			});
	});

	// Derived: Cross-link data with computed totals
	let crosslinkTableData = $derived.by(() => {
		return filteredAnalytics
			.map((item) => ({
				...item,
				outgoingLinks: item.outgoingCount,
				incomingLinks: item.incomingCount,
				totalLinks: item.outgoingCount + item.incomingCount
			}))
			.sort((a, b) => {
				const field = crosslinkSort.field as 'totalLinks' | 'incomingLinks' | 'outgoingLinks';
				const aVal = a[field];
				const bVal = b[field];
				return crosslinkSort.order === 'desc' ? bVal - aVal : aVal - bVal;
			});
	});

	// Derived: SEO data with status
	let seoData = $derived.by(() => {
		return filteredAnalytics
			.map((item) => ({
				...item,
				seoStatus: item.seoScore >= 80 ? 'good' : item.seoScore >= 50 ? 'moderate' : 'poor'
			}))
			.sort((a, b) => {
				if (seoSort.field === 'seoScore') {
					return seoSort.order === 'desc' ? b.seoScore - a.seoScore : a.seoScore - b.seoScore;
				} else if (seoSort.field === 'titleLength') {
					return seoSort.order === 'desc'
						? b.titleLength - a.titleLength
						: a.titleLength - b.titleLength;
				}
				return 0;
			});
	});

	// Derived: Enneagram type distribution with people lists
	let enneagramDistribution = $derived.by(() => {
		const distribution = new Map<
			string,
			{
				total: number;
				published: number;
				healthSum: number;
				publishedItems: AnalyticsItem[];
				draftItems: AnalyticsItem[];
			}
		>();

		// Initialize all 9 types
		for (let i = 1; i <= 9; i++) {
			distribution.set(String(i), {
				total: 0,
				published: 0,
				healthSum: 0,
				publishedItems: [],
				draftItems: []
			});
		}

		// Use all analytics data (not filtered by draft setting) for distribution
		const allMatchingItems = analyticsData.filter((item) => filteredIds.has(item.id));

		for (const item of allMatchingItems) {
			const type = item.enneagram || '?';
			if (distribution.has(type)) {
				const entry = distribution.get(type)!;
				entry.total++;
				if (item.published) {
					entry.published++;
					entry.publishedItems.push(item);
				} else {
					entry.draftItems.push(item);
				}
				entry.healthSum += item.healthScore || 0;
			}
		}

		return Array.from(distribution.entries()).map(([type, data]) => ({
			type,
			total: data.total,
			published: data.published,
			drafts: data.draftItems.length,
			avgHealth: data.total > 0 ? Math.round(data.healthSum / data.total) : 0,
			publishedItems: data.publishedItems.sort((a, b) =>
				formatPersonName(a.person || '').localeCompare(formatPersonName(b.person || ''))
			),
			draftItems: data.draftItems.sort((a, b) =>
				formatPersonName(a.person || '').localeCompare(formatPersonName(b.person || ''))
			)
		}));
	});

	// Toggle expanded type
	function toggleTypeExpanded(type: string) {
		if (expandedTypes.has(type)) {
			expandedTypes.delete(type);
			expandedTypes = new Set(expandedTypes);
		} else {
			expandedTypes.add(type);
			expandedTypes = new Set(expandedTypes);
		}
	}

	// Derived: Category distribution
	let categoryDistribution = $derived.by(() => {
		const distribution = new Map<
			string,
			{ total: number; published: number; types: Set<string> }
		>();

		for (const item of filteredAnalytics) {
			const cat = item.category || 'Uncategorized';
			if (!distribution.has(cat)) {
				distribution.set(cat, { total: 0, published: 0, types: new Set() });
			}
			const entry = distribution.get(cat)!;
			entry.total++;
			if (item.published) entry.published++;
			if (item.enneagram) entry.types.add(item.enneagram);
		}

		return Array.from(distribution.entries())
			.map(([category, data]) => ({
				category,
				total: data.total,
				published: data.published,
				typesCovered: data.types.size,
				typesMissing: 9 - data.types.size
			}))
			.sort((a, b) => b.total - a.total);
	});

	// Summary stats
	let stats = $derived.by(() => {
		const total = filteredAnalytics.length;
		const published = filteredAnalytics.filter((b) => b.published).length;
		const avgWordCount = Math.round(
			filteredAnalytics.reduce((sum, b) => sum + b.wordCount, 0) / (total || 1)
		);
		const freshCount = recencyData.filter((b) => b.freshnessStatus === 'fresh').length;
		const staleCount = recencyData.filter((b) => b.freshnessStatus === 'stale').length;
		const orphanCount = crosslinkTableData.filter((b) => b.totalLinks === 0).length;
		const avgLinks =
			Math.round(
				(crosslinkTableData.reduce((sum, b) => sum + b.totalLinks, 0) / (total || 1)) * 10
			) / 10;
		const avgHealth = Math.round(
			filteredAnalytics.reduce((sum, b) => sum + (b.healthScore || 0), 0) / (total || 1)
		);
		const avgSeo = Math.round(
			filteredAnalytics.reduce((sum, b) => sum + (b.seoScore || 0), 0) / (total || 1)
		);

		return {
			total,
			published,
			avgWordCount,
			freshCount,
			staleCount,
			orphanCount,
			avgLinks,
			avgHealth,
			avgSeo
		};
	});

	// Sort handlers
	function toggleSort(tab: 'crosslinks' | 'length' | 'recency' | 'seo', field: string) {
		if (tab === 'crosslinks') {
			if (crosslinkSort.field === field) {
				crosslinkSort.order = crosslinkSort.order === 'desc' ? 'asc' : 'desc';
			} else {
				crosslinkSort = { field, order: 'desc' };
			}
		} else if (tab === 'length') {
			if (lengthSort.field === field) {
				lengthSort.order = lengthSort.order === 'desc' ? 'asc' : 'desc';
			} else {
				lengthSort = { field, order: 'desc' };
			}
		} else if (tab === 'recency') {
			if (recencySort.field === field) {
				recencySort.order = recencySort.order === 'desc' ? 'asc' : 'desc';
			} else {
				recencySort = { field, order: 'desc' };
			}
		} else if (tab === 'seo') {
			if (seoSort.field === field) {
				seoSort.order = seoSort.order === 'desc' ? 'asc' : 'desc';
			} else {
				seoSort = { field, order: 'asc' }; // Default ascending for SEO (show worst first)
			}
		}
	}

	function getSortIndicator(
		tab: 'crosslinks' | 'length' | 'recency' | 'seo',
		field: string
	): string {
		let sort;
		if (tab === 'crosslinks') sort = crosslinkSort;
		else if (tab === 'length') sort = lengthSort;
		else if (tab === 'seo') sort = seoSort;
		else sort = recencySort;
		if (sort.field !== field) return '';
		return sort.order === 'desc' ? ' ↓' : ' ↑';
	}

	function formatDate(dateStr: string): string {
		if (!dateStr) return 'N/A';
		return new Date(dateStr).toLocaleDateString();
	}

	function formatPersonName(person: string): string {
		if (!person) return 'Unknown';
		return person.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
	}

	function handleRowClick(item: { id: number }) {
		const blog = blogMap.get(item.id);
		if (blog) {
			onSelectBlog?.(blog);
		}
	}
</script>

<div class="analytics-container">
	<!-- Summary Stats -->
	<div class="stats-grid">
		<div class="stat-card">
			<div class="stat-value">{stats.total}</div>
			<div class="stat-label">Total Blogs</div>
			<div class="stat-sub">{stats.published} published</div>
		</div>
		<div
			class="stat-card"
			class:healthy={stats.avgHealth >= 70}
			class:warning={stats.avgHealth < 50 && stats.avgHealth > 0}
		>
			<div class="stat-value">{stats.avgHealth}</div>
			<div class="stat-label">Avg Health</div>
			<div class="stat-sub">/100</div>
		</div>
		<div class="stat-card">
			<div class="stat-value">{stats.avgSeo}</div>
			<div class="stat-label">Avg SEO</div>
			<div class="stat-sub">/100</div>
		</div>
		<div class="stat-card fresh">
			<div class="stat-value">{stats.freshCount}</div>
			<div class="stat-label">Fresh</div>
			<div class="stat-sub">&lt;30 days</div>
		</div>
		<div class="stat-card stale">
			<div class="stat-value">{stats.staleCount}</div>
			<div class="stat-label">Stale</div>
			<div class="stat-sub">&gt;180 days</div>
		</div>
		<div class="stat-card orphan">
			<div class="stat-value">{stats.orphanCount}</div>
			<div class="stat-label">Orphans</div>
			<div class="stat-sub">0 links</div>
		</div>
	</div>

	<!-- Filter Controls -->
	<div class="filter-controls">
		<label class="filter-checkbox">
			<input type="checkbox" bind:checked={includeDrafts} />
			<span>Include drafts</span>
		</label>
	</div>

	<!-- Tab Switcher -->
	<div class="tab-container">
		<button
			class="tab-btn"
			class:active={activeTab === 'crosslinks'}
			onclick={() => (activeTab = 'crosslinks')}
		>
			Links
			{#if loading}
				<span class="loading-indicator"></span>
			{/if}
		</button>
		<button
			class="tab-btn"
			class:active={activeTab === 'length'}
			onclick={() => (activeTab = 'length')}
		>
			Length
		</button>
		<button
			class="tab-btn"
			class:active={activeTab === 'recency'}
			onclick={() => (activeTab = 'recency')}
		>
			Recency
		</button>
		<button class="tab-btn" class:active={activeTab === 'seo'} onclick={() => (activeTab = 'seo')}>
			SEO
		</button>
		<button
			class="tab-btn"
			class:active={activeTab === 'distribution'}
			onclick={() => (activeTab = 'distribution')}
		>
			Distribution
		</button>
	</div>

	<!-- Data Tables -->
	<div class="table-wrapper">
		{#if activeTab === 'crosslinks'}
			<div class="data-table-container" transition:slide={{ duration: 200 }}>
				<table class="analytics-table">
					<thead>
						<tr>
							<th>Person</th>
							<th class="hide-mobile">Type</th>
							<th
								class="sortable numeric"
								onclick={() => toggleSort('crosslinks', 'incomingLinks')}
							>
								Incoming{getSortIndicator('crosslinks', 'incomingLinks')}
							</th>
							<th
								class="sortable numeric"
								onclick={() => toggleSort('crosslinks', 'outgoingLinks')}
							>
								Outgoing{getSortIndicator('crosslinks', 'outgoingLinks')}
							</th>
							<th class="sortable numeric" onclick={() => toggleSort('crosslinks', 'totalLinks')}>
								Total{getSortIndicator('crosslinks', 'totalLinks')}
							</th>
							<th class="actions-col">Action</th>
						</tr>
					</thead>
					<tbody>
						{#each crosslinkTableData as blog}
							<tr
								class="table-row"
								class:orphan={blog.totalLinks === 0}
								onclick={() => handleRowClick(blog)}
							>
								<td class="person-cell">
									<span class="person-name">{formatPersonName(blog.person || '')}</span>
									{#if !blog.published}
										<span class="draft-badge">Draft</span>
									{/if}
								</td>
								<td class="hide-mobile">
									<span class="type-badge">{blog.enneagram || '?'}</span>
								</td>
								<td class="numeric">{blog.incomingLinks}</td>
								<td class="numeric">{blog.outgoingLinks}</td>
								<td class="numeric">
									<span class="total-badge" class:zero={blog.totalLinks === 0}>
										{blog.totalLinks}
									</span>
								</td>
								<td class="actions-col">
									<button
										class="edit-btn"
										onclick={(e) => {
											e.stopPropagation();
											handleRowClick(blog);
										}}
									>
										Edit
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else if activeTab === 'length'}
			<div class="data-table-container" transition:slide={{ duration: 200 }}>
				<table class="analytics-table">
					<thead>
						<tr>
							<th>Person</th>
							<th class="hide-mobile">Type</th>
							<th class="sortable numeric" onclick={() => toggleSort('length', 'wordCount')}>
								Words{getSortIndicator('length', 'wordCount')}
							</th>
							<th
								class="sortable numeric hide-mobile-sm"
								onclick={() => toggleSort('length', 'charCount')}
							>
								Chars{getSortIndicator('length', 'charCount')}
							</th>
							<th class="hide-tablet">Quality</th>
							<th class="actions-col">Action</th>
						</tr>
					</thead>
					<tbody>
						{#each contentLengthData as blog}
							{@const quality =
								blog.wordCount < 1500
									? 'thin'
									: blog.wordCount < 3000
										? 'standard'
										: blog.wordCount < 5000
											? 'long'
											: 'comprehensive'}
							<tr
								class="table-row"
								class:thin={quality === 'thin'}
								onclick={() => handleRowClick(blog)}
							>
								<td class="person-cell">
									<span class="person-name">{formatPersonName(blog.person || '')}</span>
									{#if !blog.published}
										<span class="draft-badge">Draft</span>
									{/if}
								</td>
								<td class="hide-mobile">
									<span class="type-badge">{blog.enneagram || '?'}</span>
								</td>
								<td class="numeric">{blog.wordCount.toLocaleString()}</td>
								<td class="numeric hide-mobile-sm">{blog.charCount.toLocaleString()}</td>
								<td class="hide-tablet">
									<span class="quality-badge {quality}">{quality}</span>
								</td>
								<td class="actions-col">
									<button
										class="edit-btn"
										onclick={(e) => {
											e.stopPropagation();
											handleRowClick(blog);
										}}
									>
										Edit
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else if activeTab === 'recency'}
			<div class="data-table-container" transition:slide={{ duration: 200 }}>
				<table class="analytics-table">
					<thead>
						<tr>
							<th>Person</th>
							<th class="hide-mobile">Type</th>
							<th class="sortable hide-mobile-sm" onclick={() => toggleSort('recency', 'lastmod')}>
								Last Modified{getSortIndicator('recency', 'lastmod')}
							</th>
							<th class="sortable numeric" onclick={() => toggleSort('recency', 'daysSinceUpdate')}>
								Days Ago{getSortIndicator('recency', 'daysSinceUpdate')}
							</th>
							<th>Status</th>
							<th class="actions-col">Action</th>
						</tr>
					</thead>
					<tbody>
						{#each recencyData as blog}
							<tr
								class="table-row"
								class:stale={blog.freshnessStatus === 'stale'}
								onclick={() => handleRowClick(blog)}
							>
								<td class="person-cell">
									<span class="person-name">{formatPersonName(blog.person || '')}</span>
									{#if !blog.published}
										<span class="draft-badge">Draft</span>
									{/if}
								</td>
								<td class="hide-mobile">
									<span class="type-badge">{blog.enneagram || '?'}</span>
								</td>
								<td class="hide-mobile-sm">{formatDate(blog.lastmod || blog.date || '')}</td>
								<td class="numeric">{blog.daysSinceUpdate}</td>
								<td>
									<span class="freshness-badge {blog.freshnessStatus}">
										{blog.freshnessStatus}
									</span>
								</td>
								<td class="actions-col">
									<button
										class="edit-btn"
										onclick={(e) => {
											e.stopPropagation();
											handleRowClick(blog);
										}}
									>
										Edit
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else if activeTab === 'seo'}
			<div class="data-table-container" transition:slide={{ duration: 200 }}>
				<table class="analytics-table">
					<thead>
						<tr>
							<th>Person</th>
							<th class="hide-mobile">Type</th>
							<th
								class="sortable hide-mobile-sm numeric"
								onclick={() => toggleSort('seo', 'titleLength')}
							>
								Title{getSortIndicator('seo', 'titleLength')}
							</th>
							<th class="hide-tablet numeric">Desc</th>
							<th class="hide-mobile-sm">Social</th>
							<th class="hide-tablet">Wiki</th>
							<th class="sortable numeric" onclick={() => toggleSort('seo', 'seoScore')}>
								Score{getSortIndicator('seo', 'seoScore')}
							</th>
							<th class="actions-col">Action</th>
						</tr>
					</thead>
					<tbody>
						{#each seoData as blog}
							<tr
								class="table-row"
								class:poor={blog.seoStatus === 'poor'}
								onclick={() => handleRowClick(blog)}
							>
								<td class="person-cell">
									<span class="person-name">{formatPersonName(blog.person || '')}</span>
									{#if !blog.published}
										<span class="draft-badge">Draft</span>
									{/if}
								</td>
								<td class="hide-mobile">
									<span class="type-badge">{blog.enneagram || '?'}</span>
								</td>
								<td class="hide-mobile-sm numeric">
									<span
										class="len-badge"
										class:optimal={blog.titleLength >= 30 && blog.titleLength <= 60}
									>
										{blog.titleLength}
									</span>
								</td>
								<td class="hide-tablet numeric">
									<span
										class="len-badge"
										class:optimal={blog.descriptionLength >= 120 && blog.descriptionLength <= 160}
									>
										{blog.descriptionLength}
									</span>
								</td>
								<td class="hide-mobile-sm">
									<span class="check-badge" class:yes={blog.hasSocial}
										>{blog.hasSocial ? '✓' : '✗'}</span
									>
								</td>
								<td class="hide-tablet">
									<span class="check-badge" class:yes={blog.hasWikipedia}
										>{blog.hasWikipedia ? '✓' : '✗'}</span
									>
								</td>
								<td class="numeric">
									<span class="seo-badge {blog.seoStatus}">
										{blog.seoScore}
									</span>
								</td>
								<td class="actions-col">
									<button
										class="edit-btn"
										onclick={(e) => {
											e.stopPropagation();
											handleRowClick(blog);
										}}
									>
										Edit
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else if activeTab === 'distribution'}
			<div class="distribution-container" transition:slide={{ duration: 200 }}>
				<!-- Enneagram Type Grid -->
				<div class="distribution-section">
					<h3 class="section-title">Enneagram Types</h3>
					<div class="enneagram-list">
						{#each enneagramDistribution as item}
							<div
								class="type-row"
								class:empty={item.total === 0}
								class:expanded={expandedTypes.has(item.type)}
							>
								<button
									class="type-header"
									onclick={() => toggleTypeExpanded(item.type)}
									disabled={item.total === 0}
								>
									<div class="type-number">{item.type}</div>
									<div class="type-info">
										<span class="type-count">{item.total} total</span>
										<span class="type-breakdown"
											>{item.published} published · {item.drafts} drafts</span
										>
									</div>
									{#if item.total > 0}
										<span
											class="type-health"
											class:healthy={item.avgHealth >= 70}
											class:warning={item.avgHealth < 50}
										>
											{item.avgHealth}
										</span>
									{/if}
									<span class="expand-icon">{expandedTypes.has(item.type) ? '▼' : '▶'}</span>
								</button>
								{#if expandedTypes.has(item.type) && item.total > 0}
									<div class="type-details" transition:slide={{ duration: 150 }}>
										<div class="people-columns">
											<div class="people-column">
												<h4 class="column-title published">
													Published ({item.publishedItems.length})
												</h4>
												{#if item.publishedItems.length > 0}
													<ul class="people-list">
														{#each item.publishedItems as person}
															<li>
																<button class="person-link" onclick={() => handleRowClick(person)}>
																	{formatPersonName(person.person || '')}
																</button>
															</li>
														{/each}
													</ul>
												{:else}
													<p class="no-people">None</p>
												{/if}
											</div>
											<div class="people-column">
												<h4 class="column-title drafts">Drafts ({item.draftItems.length})</h4>
												{#if item.draftItems.length > 0}
													<ul class="people-list">
														{#each item.draftItems as person}
															<li>
																<button class="person-link" onclick={() => handleRowClick(person)}>
																	{formatPersonName(person.person || '')}
																</button>
															</li>
														{/each}
													</ul>
												{:else}
													<p class="no-people">None</p>
												{/if}
											</div>
										</div>
									</div>
								{/if}
							</div>
						{/each}
					</div>
				</div>

				<!-- Category Distribution -->
				<div class="distribution-section">
					<h3 class="section-title">Categories</h3>
					<table class="analytics-table category-table">
						<thead>
							<tr>
								<th>Category</th>
								<th class="numeric">Total</th>
								<th class="numeric hide-mobile">Published</th>
								<th class="numeric">Types</th>
								<th class="hide-mobile">Missing</th>
							</tr>
						</thead>
						<tbody>
							{#each categoryDistribution as cat}
								<tr class="table-row">
									<td class="category-name">{cat.category}</td>
									<td class="numeric">{cat.total}</td>
									<td class="numeric hide-mobile">{cat.published}</td>
									<td class="numeric">
										<span class="types-badge" class:complete={cat.typesCovered === 9}>
											{cat.typesCovered}/9
										</span>
									</td>
									<td class="hide-mobile">
										{#if cat.typesMissing > 0}
											<span class="missing-count">{cat.typesMissing} missing</span>
										{:else}
											<span class="complete-badge">Complete</span>
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.analytics-container {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	/* Stats Grid */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		gap: 12px;
	}

	.stat-card {
		background: var(--void-surface);
		border: 1px solid var(--void-elevated);
		border-radius: 10px;
		padding: 16px;
		text-align: center;
	}

	.stat-card.fresh {
		border-color: var(--success);
		background: rgba(34, 197, 94, 0.05);
	}

	.stat-card.stale {
		border-color: var(--error);
		background: rgba(239, 68, 68, 0.05);
	}

	.stat-card.orphan {
		border-color: var(--warning);
		background: rgba(245, 158, 11, 0.05);
	}

	.stat-value {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--text-primary);
		line-height: 1.2;
	}

	.stat-card.fresh .stat-value {
		color: var(--success);
	}

	.stat-card.stale .stat-value {
		color: var(--error);
	}

	.stat-card.orphan .stat-value {
		color: var(--warning);
	}

	.stat-label {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-secondary);
		margin-top: 4px;
	}

	.stat-sub {
		font-size: 0.6875rem;
		color: var(--text-muted);
		margin-top: 2px;
	}

	/* Tabs */
	.tab-container {
		display: flex;
		gap: 4px;
		background: var(--void-surface);
		border: 1px solid var(--void-elevated);
		border-radius: 10px;
		padding: 4px;
	}

	.tab-btn {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		padding: 10px 16px;
		font-size: 0.875rem;
		font-weight: 500;
		background: transparent;
		color: var(--text-secondary);
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.tab-btn:hover {
		background: var(--void-elevated);
		color: var(--text-primary);
	}

	.tab-btn.active {
		background: var(--shadow-monarch);
		color: white;
	}

	.loading-indicator {
		width: 12px;
		height: 12px;
		border: 2px solid transparent;
		border-top-color: currentColor;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* Table */
	.table-wrapper {
		background: var(--void-surface);
		border: 1px solid var(--void-elevated);
		border-radius: 12px;
		overflow: hidden;
	}

	.data-table-container {
		overflow-x: auto;
		max-height: calc(100vh - 420px);
		overflow-y: auto;
	}

	.analytics-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.8125rem;
	}

	.analytics-table thead {
		position: sticky;
		top: 0;
		background: var(--void-deep);
		z-index: 1;
	}

	.analytics-table th {
		padding: 12px 16px;
		text-align: left;
		font-weight: 600;
		color: var(--text-secondary);
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		border-bottom: 1px solid var(--void-elevated);
		white-space: nowrap;
	}

	.analytics-table th.sortable {
		cursor: pointer;
		user-select: none;
	}

	.analytics-table th.sortable:hover {
		color: var(--shadow-monarch-light);
	}

	.analytics-table th.numeric,
	.analytics-table td.numeric {
		text-align: right;
	}

	.analytics-table td {
		padding: 12px 16px;
		border-bottom: 1px solid var(--void-elevated);
		color: var(--text-primary);
	}

	.table-row {
		cursor: pointer;
		transition: background 0.15s ease;
	}

	.table-row:hover {
		background: var(--void-elevated);
	}

	.table-row.orphan {
		background: rgba(245, 158, 11, 0.05);
	}

	.table-row.thin {
		background: rgba(239, 68, 68, 0.05);
	}

	.table-row.stale {
		background: rgba(239, 68, 68, 0.05);
	}

	/* Cells */
	.person-cell {
		display: flex;
		align-items: center;
		gap: 8px;
		max-width: 250px;
	}

	.person-name {
		font-weight: 500;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.draft-badge {
		flex-shrink: 0;
		padding: 2px 6px;
		font-size: 0.625rem;
		font-weight: 600;
		background: var(--warning-light);
		color: var(--warning);
		border-radius: 4px;
	}

	.type-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		font-size: 0.75rem;
		font-weight: 600;
		background: var(--void-elevated);
		color: var(--shadow-monarch-light);
		border-radius: 6px;
	}

	.total-badge {
		display: inline-flex;
		padding: 4px 10px;
		font-size: 0.75rem;
		font-weight: 600;
		background: var(--void-elevated);
		color: var(--text-primary);
		border-radius: 12px;
	}

	.total-badge.zero {
		background: var(--warning-light);
		color: var(--warning);
	}

	.quality-badge {
		display: inline-flex;
		padding: 4px 10px;
		font-size: 0.6875rem;
		font-weight: 600;
		border-radius: 12px;
		text-transform: capitalize;
	}

	.quality-badge.thin {
		background: rgba(239, 68, 68, 0.15);
		color: var(--error);
	}

	.quality-badge.standard {
		background: rgba(59, 130, 246, 0.15);
		color: #3b82f6;
	}

	.quality-badge.long {
		background: rgba(34, 197, 94, 0.15);
		color: var(--success);
	}

	.quality-badge.comprehensive {
		background: rgba(139, 92, 246, 0.15);
		color: #8b5cf6;
	}

	.freshness-badge {
		display: inline-flex;
		padding: 4px 10px;
		font-size: 0.6875rem;
		font-weight: 600;
		border-radius: 12px;
		text-transform: capitalize;
	}

	.freshness-badge.fresh {
		background: rgba(34, 197, 94, 0.15);
		color: var(--success);
	}

	.freshness-badge.recent {
		background: rgba(59, 130, 246, 0.15);
		color: #3b82f6;
	}

	.freshness-badge.aging {
		background: rgba(245, 158, 11, 0.15);
		color: var(--warning);
	}

	.freshness-badge.stale {
		background: rgba(239, 68, 68, 0.15);
		color: var(--error);
	}

	.actions-col {
		text-align: right;
		white-space: nowrap;
	}

	.edit-btn {
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--shadow-monarch-light);
		background: transparent;
		border: none;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.edit-btn:hover {
		color: var(--awakening-cyan);
		text-shadow: var(--glow-sm);
	}

	/* Responsive */
	.hide-mobile {
		display: table-cell;
	}
	.hide-mobile-sm {
		display: table-cell;
	}
	.hide-tablet {
		display: table-cell;
	}

	@media (max-width: 1024px) {
		.hide-tablet {
			display: none;
		}
	}

	@media (max-width: 768px) {
		.hide-mobile {
			display: none;
		}

		.stats-grid {
			grid-template-columns: repeat(3, 1fr);
		}

		.stat-card {
			padding: 12px;
		}

		.stat-value {
			font-size: 1.25rem;
		}

		.tab-btn {
			padding: 8px 12px;
			font-size: 0.8125rem;
		}
	}

	@media (max-width: 640px) {
		.hide-mobile-sm {
			display: none;
		}

		.stats-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.person-cell {
			max-width: 150px;
		}

		.tab-btn {
			padding: 8px 8px;
			font-size: 0.75rem;
		}
	}

	/* Health Card Styles */
	.stat-card.healthy {
		border-color: var(--success);
		background: rgba(34, 197, 94, 0.05);
	}

	.stat-card.healthy .stat-value {
		color: var(--success);
	}

	.stat-card.warning {
		border-color: var(--warning);
		background: rgba(245, 158, 11, 0.05);
	}

	.stat-card.warning .stat-value {
		color: var(--warning);
	}

	/* SEO Badge Styles */
	.seo-badge {
		display: inline-flex;
		padding: 4px 10px;
		font-size: 0.75rem;
		font-weight: 600;
		border-radius: 12px;
	}

	.seo-badge.good {
		background: rgba(34, 197, 94, 0.15);
		color: var(--success);
	}

	.seo-badge.moderate {
		background: rgba(245, 158, 11, 0.15);
		color: var(--warning);
	}

	.seo-badge.poor {
		background: rgba(239, 68, 68, 0.15);
		color: var(--error);
	}

	.table-row.poor {
		background: rgba(239, 68, 68, 0.05);
	}

	/* Length Badge for SEO */
	.len-badge {
		display: inline-flex;
		padding: 2px 6px;
		font-size: 0.6875rem;
		font-weight: 500;
		background: rgba(239, 68, 68, 0.1);
		color: var(--error);
		border-radius: 4px;
	}

	.len-badge.optimal {
		background: rgba(34, 197, 94, 0.1);
		color: var(--success);
	}

	/* Check Badge for SEO */
	.check-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		font-size: 0.6875rem;
		background: rgba(239, 68, 68, 0.15);
		color: var(--error);
		border-radius: 50%;
	}

	.check-badge.yes {
		background: rgba(34, 197, 94, 0.15);
		color: var(--success);
	}

	/* Distribution Container */
	.distribution-container {
		padding: 16px;
	}

	.distribution-section {
		margin-bottom: 24px;
	}

	.distribution-section:last-child {
		margin-bottom: 0;
	}

	.section-title {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		margin: 0 0 12px 0;
	}

	/* Enneagram List (Expandable) */
	.enneagram-list {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.type-row {
		background: var(--void-elevated);
		border: 1px solid var(--void-highlight);
		border-radius: 8px;
		overflow: hidden;
		transition: all 0.2s ease;
	}

	.type-row:hover:not(.empty) {
		border-color: var(--shadow-monarch);
	}

	.type-row.empty {
		opacity: 0.5;
	}

	.type-row.expanded {
		border-color: var(--shadow-monarch);
	}

	.type-header {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 16px;
		background: transparent;
		border: none;
		cursor: pointer;
		text-align: left;
		color: var(--text-primary);
		transition: background 0.15s ease;
	}

	.type-header:hover:not(:disabled) {
		background: var(--void-highlight);
	}

	.type-header:disabled {
		cursor: default;
	}

	.type-number {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--shadow-monarch-light);
		min-width: 28px;
	}

	.type-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.type-count {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.type-breakdown {
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	.type-health {
		font-size: 0.6875rem;
		font-weight: 600;
		padding: 2px 8px;
		background: var(--void-highlight);
		border-radius: 4px;
		color: var(--text-secondary);
	}

	.type-health.healthy {
		background: rgba(34, 197, 94, 0.15);
		color: var(--success);
	}

	.type-health.warning {
		background: rgba(245, 158, 11, 0.15);
		color: var(--warning);
	}

	.expand-icon {
		font-size: 0.625rem;
		color: var(--text-muted);
		transition: transform 0.2s ease;
	}

	/* Expanded Details */
	.type-details {
		padding: 0 16px 16px;
		border-top: 1px solid var(--void-highlight);
		background: var(--void-deep);
	}

	.people-columns {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
		padding-top: 12px;
	}

	.people-column {
		min-width: 0;
	}

	.column-title {
		font-size: 0.6875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		margin: 0 0 8px 0;
		padding-bottom: 4px;
		border-bottom: 1px solid var(--void-elevated);
	}

	.column-title.published {
		color: var(--success);
	}

	.column-title.drafts {
		color: var(--warning);
	}

	.people-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 4px;
		max-height: 200px;
		overflow-y: auto;
	}

	.people-list li {
		margin: 0;
	}

	.person-link {
		display: block;
		width: 100%;
		padding: 6px 8px;
		background: var(--void-surface);
		border: 1px solid var(--void-elevated);
		border-radius: 4px;
		color: var(--text-primary);
		font-size: 0.8125rem;
		text-align: left;
		cursor: pointer;
		transition: all 0.15s ease;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.person-link:hover {
		background: var(--void-elevated);
		border-color: var(--shadow-monarch);
		color: var(--shadow-monarch-light);
	}

	.no-people {
		font-size: 0.75rem;
		color: var(--text-muted);
		font-style: italic;
		margin: 0;
	}

	@media (max-width: 640px) {
		.people-columns {
			grid-template-columns: 1fr;
			gap: 12px;
		}

		.type-header {
			padding: 10px 12px;
		}

		.type-number {
			font-size: 1rem;
			min-width: 24px;
		}
	}

	/* Filter Controls */
	.filter-controls {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 8px 12px;
		background: var(--void-surface);
		border: 1px solid var(--void-elevated);
		border-radius: 8px;
	}

	.filter-checkbox {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 0.8125rem;
		color: var(--text-secondary);
		cursor: pointer;
	}

	.filter-checkbox input {
		width: 16px;
		height: 16px;
		accent-color: var(--shadow-monarch);
	}

	.filter-checkbox:hover {
		color: var(--text-primary);
	}

	/* Category Table */
	.category-table {
		background: var(--void-elevated);
		border-radius: 8px;
		overflow: hidden;
	}

	.category-name {
		font-weight: 500;
		text-transform: capitalize;
	}

	.types-badge {
		display: inline-flex;
		padding: 2px 6px;
		font-size: 0.6875rem;
		font-weight: 600;
		background: var(--void-highlight);
		color: var(--text-secondary);
		border-radius: 4px;
	}

	.types-badge.complete {
		background: rgba(34, 197, 94, 0.15);
		color: var(--success);
	}

	.missing-count {
		font-size: 0.6875rem;
		color: var(--warning);
	}

	.complete-badge {
		font-size: 0.6875rem;
		font-weight: 500;
		color: var(--success);
	}

	@media (max-width: 768px) {
		.enneagram-grid {
			gap: 6px;
		}

		.type-cell {
			padding: 10px 8px;
		}

		.type-number {
			font-size: 1rem;
		}

		.type-count {
			font-size: 1.25rem;
		}

		.distribution-container {
			padding: 12px;
		}
	}
</style>
