<!-- src/routes/admin/consulting/resources/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';

	type ResourceRow = PageData['resources'][number];

	let { data }: { data: PageData } = $props();

	const categoryInfo = {
		playbook: {
			label: 'Playbooks',
			description: 'High-frequency coaching flows and session guides',
			icon: '📋'
		},
		framework: {
			label: 'Frameworks',
			description: 'Mental models and reusable structures',
			icon: '🧠'
		},
		script: {
			label: 'Scripts',
			description: 'Language you can use in-session or in follow-ups',
			icon: '💬'
		},
		reference: {
			label: 'Reference',
			description: 'Fast lookup material for calls and prep',
			icon: '📚'
		},
		exercise: {
			label: 'Exercises',
			description: 'Prompts, homework, and structured activities',
			icon: '✏️'
		}
	} as const;

	type CategoryKey = keyof typeof categoryInfo;
	type CategoryEntry = [CategoryKey, (typeof categoryInfo)[CategoryKey]];

	const categoryEntries = Object.entries(categoryInfo) as CategoryEntry[];
	const blogLinks = [
		{
			title: 'Personality Maxing',
			description: 'Core philosophy and consulting positioning',
			href: '/enneagram-corner/personality-maxing'
		},
		{
			title: '90-Day Blueprint',
			description: 'Published version of the program structure',
			href: '/enneagram-corner/90-day-personality-maxing-blueprint'
		},
		{
			title: 'Enneagram Typing Guide',
			description: 'Fast reference for type discovery conversations',
			href: '/enneagram-corner/beginners-guide-to-determining-your-enneagram-type'
		},
		{
			title: 'Emotions Crash Course',
			description: 'Useful support content to send after sessions',
			href: '/guides/the-crash-course-on-emotions-that-we-missed-in-kindergarten'
		},
		{
			title: 'Active Listening Guide',
			description: 'Published supplement for coaching communication work',
			href: '/guides/ultimate-guide-to-active-listening'
		}
	] as const;

	let query = $state('');
	let activeCategory = $state<'all' | CategoryKey>('all');
	let sortMode = $state<'manual' | 'recent'>('manual');

	let normalizedQuery = $derived(query.trim().toLowerCase());
	let sortedResources = $derived.by(() => {
		const items = [...data.resources];

		if (sortMode === 'recent') {
			return items.sort((left, right) => {
				const leftTime = left.updated_at ? new Date(left.updated_at).getTime() : 0;
				const rightTime = right.updated_at ? new Date(right.updated_at).getTime() : 0;

				return rightTime - leftTime || left.title.localeCompare(right.title);
			});
		}

		return items;
	});

	let filteredResources = $derived.by(() =>
		sortedResources.filter((resource) => {
			if (activeCategory !== 'all' && resource.category !== activeCategory) {
				return false;
			}

			if (!normalizedQuery) {
				return true;
			}

			const haystack = [
				resource.title,
				resource.slug,
				resource.description,
				resource.content,
				categoryInfo[resource.category as CategoryKey]?.label
			]
				.filter(Boolean)
				.join(' ')
				.toLowerCase();

			return haystack.includes(normalizedQuery);
		})
	);

	let categorySections = $derived.by(() =>
		categoryEntries
			.map(([category, info]) => ({
				category,
				info,
				resources: filteredResources.filter((resource) => resource.category === category)
			}))
			.filter((section) => section.resources.length > 0)
	);

	let pinnedResources = $derived.by(() =>
		filteredResources.filter((resource) => resource.is_pinned)
	);
	let showPinnedSection = $derived(activeCategory === 'all' && normalizedQuery.length === 0);
	let recentResources = $derived.by(() =>
		[...data.resources]
			.sort((left, right) => {
				const leftTime = left.updated_at ? new Date(left.updated_at).getTime() : 0;
				const rightTime = right.updated_at ? new Date(right.updated_at).getTime() : 0;
				return rightTime - leftTime;
			})
			.slice(0, 6)
	);
	let priorityResource = $derived(
		data.resources.find((resource) => resource.is_pinned) ?? data.resources[0]
	);
	let recentlyUpdatedCount = $derived.by(() => {
		const cutoff = Date.now() - 1000 * 60 * 60 * 24 * 14;
		return data.resources.filter((resource) => {
			const updatedTime = resource.updated_at ? new Date(resource.updated_at).getTime() : 0;
			return updatedTime >= cutoff;
		}).length;
	});
	let playbookCount = $derived(
		data.resources.filter((resource) => resource.category === 'playbook').length
	);

	function formatDate(value: string | null | undefined): string {
		if (!value) return '—';
		return new Date(value).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function excerpt(text: string | null | undefined): string {
		const normalized = text?.trim() ?? '';
		if (!normalized) return 'No description yet.';
		if (normalized.length <= 150) return normalized;
		return `${normalized.slice(0, 147).trimEnd()}...`;
	}
</script>

<svelte:head>
	<title>Consulting Resources | Admin</title>
</svelte:head>

<div class="resources-page">
	<header class="hero-card">
		<div class="hero-copy">
			<p class="page-kicker">Consulting Resource Library</p>
			<h1>Refreshable playbooks, not dead documents.</h1>
			<p class="hero-text">
				Search the library, filter by resource type, and jump straight into editing the playbooks
				you update most often.
			</p>
		</div>

		<div class="hero-actions">
			{#if priorityResource}
				<a href="/admin/consulting/resources/{priorityResource.slug}" class="hero-cta">
					Edit priority resource
				</a>
			{/if}
			<p class="hero-note">
				Once inside a resource, save changes with the header button or `Cmd/Ctrl+S`.
			</p>
		</div>
	</header>

	<section class="stats-grid">
		<article class="stat-card">
			<span class="stat-label">Total Resources</span>
			<strong>{data.resources.length}</strong>
			<span>Full consulting library in one place</span>
		</article>
		<article class="stat-card">
			<span class="stat-label">Playbooks</span>
			<strong>{playbookCount}</strong>
			<span>Session flows and repeatable coaching scripts</span>
		</article>
		<article class="stat-card">
			<span class="stat-label">Pinned</span>
			<strong>{data.resources.filter((resource) => resource.is_pinned).length}</strong>
			<span>Quick-access items at the top of the library</span>
		</article>
		<article class="stat-card">
			<span class="stat-label">Updated 14 Days</span>
			<strong>{recentlyUpdatedCount}</strong>
			<span>Recently touched and likely still in motion</span>
		</article>
	</section>

	<section class="toolbar-card">
		<div class="search-shell">
			<input
				type="search"
				value={query}
				oninput={(event) => (query = (event.currentTarget as HTMLInputElement).value)}
				placeholder="Search title, slug, description, or markdown content..."
			/>
		</div>

		<div class="toolbar-row">
			<div class="pill-row">
				<button
					type="button"
					class="filter-pill"
					class:active={activeCategory === 'all'}
					onclick={() => (activeCategory = 'all')}
				>
					All ({data.resources.length})
				</button>
				{#each categoryEntries as [category, info]}
					<button
						type="button"
						class="filter-pill"
						class:active={activeCategory === category}
						onclick={() => (activeCategory = category)}
					>
						{info.label} ({data.resources.filter((resource) => resource.category === category)
							.length})
					</button>
				{/each}
			</div>

			<div class="pill-row">
				<button
					type="button"
					class="filter-pill"
					class:active={sortMode === 'manual'}
					onclick={() => (sortMode = 'manual')}
				>
					Manual Sort
				</button>
				<button
					type="button"
					class="filter-pill"
					class:active={sortMode === 'recent'}
					onclick={() => (sortMode = 'recent')}
				>
					Recently Updated
				</button>
			</div>
		</div>
	</section>

	<div class="dashboard-grid">
		<div class="library-column">
			{#if showPinnedSection && pinnedResources.length > 0}
				<section class="panel">
					<div class="panel-head">
						<div>
							<h2>Priority Edits</h2>
							<p>Pinned resources you probably want within one click.</p>
						</div>
					</div>

					<div class="priority-grid">
						{#each pinnedResources as resource}
							<a href="/admin/consulting/resources/{resource.slug}" class="priority-card">
								<div class="priority-card__top">
									<span class="category-chip"
										>{categoryInfo[resource.category as CategoryKey]?.icon}
										{categoryInfo[resource.category as CategoryKey]?.label}</span
									>
									<span class="mini-meta">Updated {formatDate(resource.updated_at)}</span>
								</div>
								<h3>{resource.title}</h3>
								<p>{excerpt(resource.description)}</p>
								<span class="priority-action">Open editor →</span>
							</a>
						{/each}
					</div>
				</section>
			{/if}

			{#if categorySections.length === 0}
				<section class="panel empty-panel">
					<h2>No matching resources</h2>
					<p>Try a broader search term or switch back to all categories.</p>
				</section>
			{/if}

			{#each categorySections as section}
				<section class="panel">
					<div class="panel-head">
						<div>
							<h2>{section.info.icon} {section.info.label}</h2>
							<p>{section.info.description}</p>
						</div>
						<span class="section-count">{section.resources.length}</span>
					</div>

					<div class="resource-list">
						{#each section.resources as resource}
							<a href="/admin/consulting/resources/{resource.slug}" class="resource-row">
								<div class="resource-row__meta">
									<span>Updated {formatDate(resource.updated_at)}</span>
									<span>Order {resource.sort_order ?? 0}</span>
									{#if resource.is_pinned}
										<span class="mini-badge mini-badge--pinned">Pinned</span>
									{/if}
									{#if resource.related_blog_slug}
										<span class="mini-badge">Linked blog</span>
									{/if}
								</div>

								<div class="resource-row__title">
									<h3>{resource.title}</h3>
									<span class="resource-action">Edit</span>
								</div>

								<p>{excerpt(resource.description)}</p>
								<code>{resource.slug}</code>
							</a>
						{/each}
					</div>
				</section>
			{/each}
		</div>

		<aside class="sidebar-column">
			<section class="panel">
				<div class="panel-head">
					<div>
						<h2>Recently Updated</h2>
						<p>Fast jump list for whatever is actively changing.</p>
					</div>
				</div>

				<div class="recent-list">
					{#each recentResources as resource}
						<a href="/admin/consulting/resources/{resource.slug}" class="recent-item">
							<div>
								<strong>{resource.title}</strong>
								<span>{categoryInfo[resource.category as CategoryKey]?.label}</span>
							</div>
							<small>{formatDate(resource.updated_at)}</small>
						</a>
					{/each}
				</div>
			</section>

			<section class="panel">
				<div class="panel-head">
					<div>
						<h2>Published Support Content</h2>
						<p>External references you may want while editing consulting resources.</p>
					</div>
				</div>

				<div class="blog-links">
					{#each blogLinks as link}
						<a href={link.href} target="_blank" rel="noreferrer" class="blog-link">
							<strong>{link.title}</strong>
							<span>{link.description}</span>
						</a>
					{/each}
				</div>
			</section>
		</aside>
	</div>
</div>

<style lang="scss">
	.resources-page {
		--resource-accent: var(--primary);
		--resource-accent-strong: color-mix(in srgb, var(--primary) 26%, var(--bg-elevated));
		--resource-accent-soft: color-mix(in srgb, var(--primary) 12%, transparent);
		--resource-surface: color-mix(in srgb, var(--bg-surface) 94%, var(--bg-deep));
		--resource-surface-muted: color-mix(in srgb, var(--bg-surface) 84%, var(--bg-deep));
		--resource-hero-top: color-mix(in srgb, var(--bg-surface) 92%, var(--bg-deep));
		--resource-hero-bottom: color-mix(in srgb, var(--bg-surface) 78%, var(--bg-deep));
		--resource-border: color-mix(in srgb, var(--primary) 12%, var(--bg-elevated));
		--resource-border-strong: color-mix(in srgb, var(--primary) 22%, var(--bg-elevated));
		--resource-shadow: 0 22px 44px color-mix(in srgb, var(--bg-deep) 16%, transparent);
		--resource-warning: var(--warning, #f59e0b);
		display: flex;
		flex-direction: column;
		gap: 1.1rem;
		max-width: 1280px;
		margin: 0 auto;
	}

	.hero-card,
	.panel,
	.toolbar-card,
	.stat-card {
		background: var(--resource-surface);
		border: 1px solid var(--resource-border);
		border-radius: 20px;
		box-shadow: var(--resource-shadow);
	}

	.hero-card {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1.5rem;
		padding: 1.6rem;
		background:
			radial-gradient(
				circle at top right,
				color-mix(in srgb, var(--resource-accent) 16%, transparent),
				transparent 30%
			),
			linear-gradient(180deg, var(--resource-hero-top), var(--resource-hero-bottom));
	}

	.page-kicker,
	.stat-label {
		margin: 0 0 0.35rem;
		color: var(--resource-accent);
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	h1 {
		margin: 0;
		font-size: clamp(1.9rem, 3vw, 2.6rem);
		line-height: 1.02;
	}

	.hero-text,
	.hero-note {
		margin: 0.55rem 0 0;
		color: var(--text-secondary);
		max-width: 42rem;
	}

	.hero-actions {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.9rem;
		min-width: min(22rem, 100%);
	}

	.hero-cta,
	.filter-pill {
		border-radius: 999px;
		font-weight: 600;
		transition:
			transform 0.2s ease,
			border-color 0.2s ease,
			background 0.2s ease,
			color 0.2s ease;
	}

	.hero-cta {
		border: none;
		background: linear-gradient(135deg, var(--primary), var(--primary-dark));
		color: white;
		padding: 0.82rem 1.15rem;
		text-decoration: none;

		&:hover {
			transform: translateY(-1px);
			box-shadow: 0 12px 24px color-mix(in srgb, var(--primary) 24%, transparent);
		}
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0.9rem;
	}

	.stat-card {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 1rem 1.1rem;

		strong {
			font-size: 1.28rem;
		}

		span:last-child {
			color: var(--text-secondary);
			font-size: 0.86rem;
		}
	}

	.toolbar-card {
		padding: 1rem;
	}

	.search-shell input {
		width: 100%;
		border: 1px solid var(--resource-border);
		border-radius: 14px;
		background: var(--resource-surface-muted);
		color: var(--text-primary);
		padding: 0.95rem 1rem;
		font: inherit;
	}

	.search-shell input:focus {
		outline: none;
		border-color: var(--resource-border-strong);
		box-shadow: 0 0 0 0.18rem color-mix(in srgb, var(--primary) 14%, transparent);
	}

	.toolbar-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 0.9rem;
		flex-wrap: wrap;
	}

	.pill-row {
		display: flex;
		gap: 0.55rem;
		flex-wrap: wrap;
	}

	.filter-pill {
		border: 1px solid var(--resource-border);
		background: var(--resource-surface-muted);
		color: var(--text-secondary);
		padding: 0.62rem 0.88rem;
		cursor: pointer;

		&:hover {
			transform: translateY(-1px);
			color: var(--text-primary);
		}

		&.active {
			border-color: var(--resource-border-strong);
			background: var(--resource-accent-soft);
			color: var(--text-primary);
		}
	}

	.dashboard-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 320px;
		gap: 1rem;
		align-items: start;
	}

	.library-column,
	.sidebar-column {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.panel {
		padding: 1.1rem;
	}

	.panel-head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1rem;

		h2 {
			margin: 0 0 0.25rem;
			font-size: 1.08rem;
		}

		p {
			margin: 0;
			color: var(--text-secondary);
			font-size: 0.9rem;
		}
	}

	.section-count {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 2rem;
		height: 2rem;
		padding: 0 0.65rem;
		border-radius: 999px;
		background: var(--resource-accent-soft);
		color: var(--resource-accent);
		font-weight: 700;
	}

	.priority-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 0.85rem;
	}

	.priority-card,
	.resource-row,
	.recent-item,
	.blog-link {
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
		padding: 1rem;
		border-radius: 16px;
		border: 1px solid var(--resource-border);
		background: var(--resource-surface-muted);
		text-decoration: none;
		color: inherit;
		transition:
			transform 0.2s ease,
			border-color 0.2s ease,
			background 0.2s ease;

		&:hover {
			transform: translateY(-2px);
			border-color: var(--resource-border-strong);
			background: color-mix(in srgb, var(--resource-accent-soft) 55%, var(--resource-surface));
		}
	}

	.priority-card__top,
	.resource-row__meta,
	.resource-row__title,
	.recent-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.7rem;
	}

	.priority-card h3,
	.resource-row h3 {
		margin: 0;
		font-size: 1rem;
	}

	.priority-card p,
	.resource-row p,
	.blog-link span,
	.recent-item span {
		margin: 0;
		color: var(--text-secondary);
	}

	.priority-card p,
	.resource-row p {
		font-size: 0.9rem;
		line-height: 1.55;
	}

	.category-chip,
	.mini-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.32rem 0.6rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--bg-surface) 82%, var(--bg-deep));
		color: var(--text-secondary);
		font-size: 0.78rem;
		font-weight: 600;
	}

	.mini-badge--pinned {
		background: color-mix(in srgb, var(--resource-warning) 14%, transparent);
		color: color-mix(in srgb, var(--resource-warning) 72%, var(--text-primary));
	}

	.mini-meta,
	.resource-row__meta span,
	.resource-row code,
	.recent-item small {
		color: var(--text-secondary);
		font-size: 0.8rem;
	}

	.resource-list,
	.recent-list,
	.blog-links {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.resource-row {
		align-items: stretch;
	}

	.resource-row__meta {
		flex-wrap: wrap;
		justify-content: flex-start;
	}

	.resource-row__title {
		align-items: baseline;
	}

	.resource-action,
	.priority-action {
		color: var(--resource-accent);
		font-weight: 600;
	}

	.resource-row code {
		font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace;
	}

	.recent-item {
		flex-direction: row;
		align-items: flex-start;
	}

	.recent-item strong,
	.blog-link strong {
		display: block;
		margin-bottom: 0.2rem;
	}

	.empty-panel {
		text-align: center;

		h2 {
			margin: 0 0 0.35rem;
		}

		p {
			margin: 0;
			color: var(--text-secondary);
		}
	}

	@media (max-width: 1100px) {
		.stats-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.dashboard-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 768px) {
		.resources-page {
			gap: 1rem;
		}

		.hero-card {
			flex-direction: column;
			padding: 1.2rem;
		}

		.hero-actions,
		.hero-cta {
			width: 100%;
		}

		.hero-cta {
			text-align: center;
		}

		.stats-grid {
			grid-template-columns: 1fr;
		}

		.panel,
		.toolbar-card {
			padding: 0.95rem;
		}

		.priority-grid {
			grid-template-columns: 1fr;
		}

		.priority-card__top,
		.resource-row__title,
		.recent-item {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
