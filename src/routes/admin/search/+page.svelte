<!-- src/routes/admin/search/+page.svelte -->
<script lang="ts">
	interface SearchResult {
		id: number;
		source: 'content' | 'famous_people';
		slug: string;
		title: string;
		description: string;
		enneagram: number | null;
		type: string[];
		tags: string[];
		category: string | null;
		lastmod: string | null;
		rank: number;
		url: string;
	}

	interface SearchResponse {
		results: SearchResult[];
		query: string;
		filters: {
			enneagram: number | null;
			category: string | null;
			type: string | null;
		};
		total: number;
		error?: string;
	}

	let query = $state('');
	let enneagramFilter = $state('');
	let categoryFilter = $state('');
	let typeFilter = $state('');

	let results = $state<SearchResult[]>([]);
	let isLoading = $state(false);
	let error = $state('');
	let totalResults = $state(0);
	let searchPerformed = $state(false);

	const enneagramTypes = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	const categories = [
		'enneagram',
		'mental-health',
		'community',
		'guides',
		'pop-culture',
		'topical',
		'life-situations',
		'generational',
		'historical',
		'situational',
		'overview',
		'life-style'
	];
	const contentTypes = [
		'situational',
		'overview',
		'nine-types',
		'development',
		'relationships',
		'workplace',
		'mental-health',
		'resources',
		'leadership',
		'communication',
		'dating',
		'career',
		'stress',
		'growth',
		'anxiety',
		'depression',
		'therapy',
		'trauma',
		'family',
		'compatibility'
	];

	let debounceTimer: ReturnType<typeof setTimeout>;

	async function search() {
		if (query.trim().length < 2) {
			error = 'Please enter at least 2 characters';
			results = [];
			totalResults = 0;
			searchPerformed = false;
			return;
		}

		isLoading = true;
		error = '';
		searchPerformed = true;
		totalResults = 0;

		try {
			const params = new URLSearchParams({ q: query });
			if (enneagramFilter) params.set('enneagram', enneagramFilter);
			if (categoryFilter) params.set('category', categoryFilter);
			if (typeFilter) params.set('type', typeFilter);

			const response = await fetch(`/api/blog/search?${params.toString()}`);
			const data: SearchResponse = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Search failed');
			}

			if (data.error) {
				error = data.error;
				results = [];
				totalResults = 0;
			} else {
				const safeResults = data.results || [];
				results = safeResults;
				totalResults = data.total ?? safeResults.length;
			}
		} catch (err) {
			console.error('Search error:', err);
			error = 'Search failed. Please try again.';
			results = [];
			totalResults = 0;
		} finally {
			isLoading = false;
		}
	}

	function debounceSearch() {
		clearTimeout(debounceTimer);
		if (query.trim().length < 2) {
			results = [];
			totalResults = 0;
			error = '';
			searchPerformed = false;
			return;
		}
		debounceTimer = setTimeout(() => {
			if (query.length >= 2) {
				search();
			}
		}, 300);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			clearTimeout(debounceTimer);
			search();
		}
	}

	function clearFilters() {
		enneagramFilter = '';
		categoryFilter = '';
		typeFilter = '';
		if (query.length >= 2) {
			search();
		}
	}

	function formatDate(dateStr: string | null): string {
		if (!dateStr) return 'N/A';
		return new Date(dateStr).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function getSourceBadgeClass(source: string): string {
		return source === 'famous_people' ? 'badge-famous' : 'badge-content';
	}

	function getEnneagramColor(type: number | null): string {
		const colors: Record<number, string> = {
			1: '#E74C3C',
			2: '#E91E63',
			3: '#9C27B0',
			4: '#673AB7',
			5: '#3F51B5',
			6: '#2196F3',
			7: '#FFC107',
			8: '#FF5722',
			9: '#4CAF50'
		};
		return type ? colors[type] || '#6B7280' : '#6B7280';
	}
</script>

<svelte:head>
	<title>Blog Search | Admin</title>
</svelte:head>

<div class="search-tabs">
	<a href="/admin/search" class="tab active">Full Search</a>
	<a href="/admin/search/typeahead" class="tab">Quick Search</a>
</div>

<h1>Blog Content Search</h1>
<p class="subtitle">Search across all enneagram content and celebrity analyses</p>

<!-- Search Input -->
<div class="search-box">
	<input
		type="text"
		bind:value={query}
		oninput={debounceSearch}
		onkeydown={handleKeydown}
		placeholder="Search for topics, types, celebrities..."
		class="search-input"
	/>
	<button onclick={search} disabled={isLoading || query.length < 2} class="search-button">
		{isLoading ? 'Searching...' : 'Search'}
	</button>
</div>

<!-- Filters -->
<div class="filters">
	<div class="filter-group">
		<label for="enneagram">Enneagram Type</label>
		<select
			id="enneagram"
			bind:value={enneagramFilter}
			onchange={() => query.length >= 2 && search()}
		>
			<option value="">All Types</option>
			{#each enneagramTypes as type}
				<option value={type.toString()}>Type {type}</option>
			{/each}
		</select>
	</div>

	<div class="filter-group">
		<label for="category">Category</label>
		<select
			id="category"
			bind:value={categoryFilter}
			onchange={() => query.length >= 2 && search()}
		>
			<option value="">All Categories</option>
			{#each categories as cat}
				<option value={cat}>{cat}</option>
			{/each}
		</select>
	</div>

	<div class="filter-group">
		<label for="type">Content Type</label>
		<select id="type" bind:value={typeFilter} onchange={() => query.length >= 2 && search()}>
			<option value="">All Content Types</option>
			{#each contentTypes as t}
				<option value={t}>{t}</option>
			{/each}
		</select>
	</div>

	{#if enneagramFilter || categoryFilter || typeFilter}
		<button onclick={clearFilters} class="clear-button">Clear Filters</button>
	{/if}
</div>

<!-- Error Display -->
{#if error}
	<div class="error-message">{error}</div>
{/if}

<!-- Results -->
{#if isLoading}
	<div class="loading">
		<div class="spinner"></div>
		<p>Searching...</p>
	</div>
{:else if searchPerformed}
	<div class="results-header">
		<h2>
			{#if results.length > 0}
				Found {totalResults} result{totalResults !== 1 ? 's' : ''} for "{query}"
			{:else}
				No results found for "{query}"
			{/if}
		</h2>
	</div>

	<div class="results-grid">
		{#each results as result}
			<a href={result.url} class="result-card" target="_blank" rel="noopener">
				<div class="result-header">
					<span class="source-badge {getSourceBadgeClass(result.source)}">
						{result.source === 'famous_people' ? 'Celebrity' : 'Article'}
					</span>
					{#if result.enneagram}
						<span
							class="enneagram-badge"
							style="background-color: {getEnneagramColor(result.enneagram)}"
						>
							Type {result.enneagram}
						</span>
					{/if}
				</div>

				<h3 class="result-title">{result.title}</h3>

				{#if result.description}
					<p class="result-description">
						{result.description.length > 150
							? result.description.slice(0, 150) + '...'
							: result.description}
					</p>
				{/if}

				<div class="result-meta">
					{#if result.category}
						<span class="meta-item category">{result.category}</span>
					{/if}
					{#if result.type?.length > 0}
						{#each result.type.slice(0, 3) as t}
							<span class="meta-item type">{t}</span>
						{/each}
					{/if}
				</div>

				<div class="result-footer">
					<span class="date">Updated: {formatDate(result.lastmod)}</span>
					<span class="url">{result.url}</span>
				</div>
			</a>
		{/each}
	</div>
{:else}
	<div class="empty-state">
		<p>Enter a search query to find content across your blog</p>
		<p class="hint">Try searching for: "anxiety", "relationships", "type 4", or a celebrity name</p>
	</div>
{/if}

<style lang="scss">
	h1 {
		font-size: 1.75rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
		color: var(--text-primary);
	}

	.subtitle {
		color: var(--text-secondary);
		margin-bottom: 1.5rem;
	}

	.search-box {
		display: flex;
		gap: 0.75rem;
		margin-bottom: 1.25rem;
	}

	.search-input {
		flex: 1;
		padding: 0.625rem 0.875rem;
		font-size: 0.95rem;
		border: 1px solid var(--bg-elevated);
		border-radius: 8px;
		background: var(--bg-surface);
		color: var(--text-primary);
		transition: border-color 0.15s ease;

		&:focus {
			outline: none;
			border-color: var(--primary);
		}
	}

	.search-button {
		padding: 0.625rem 1.25rem;
		font-size: 0.875rem;
		font-weight: 600;
		background: var(--primary);
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition: opacity 0.15s ease;

		&:hover:not(:disabled) {
			opacity: 0.85;
		}

		&:disabled {
			opacity: 0.4;
			cursor: not-allowed;
		}
	}

	.filters {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		align-items: flex-end;
		margin-bottom: 1.5rem;
		padding: 0.875rem;
		background: var(--bg-deep);
		border: 1px solid var(--bg-elevated);
		border-radius: 8px;
	}

	.filter-group {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;

		label {
			font-size: 0.8rem;
			font-weight: 500;
			color: var(--text-secondary);
		}

		select {
			padding: 0.4rem 0.625rem;
			font-size: 0.8rem;
			border: 1px solid var(--bg-elevated);
			border-radius: 6px;
			background: var(--bg-surface);
			color: var(--text-primary);
			min-width: 150px;
		}
	}

	.clear-button {
		padding: 0.4rem 0.875rem;
		font-size: 0.8rem;
		background: #ef4444;
		color: white;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		transition: opacity 0.15s ease;

		&:hover {
			opacity: 0.85;
		}
	}

	.error-message {
		padding: 0.875rem;
		background: rgba(239, 68, 68, 0.1);
		color: #ef4444;
		border: 1px solid rgba(239, 68, 68, 0.2);
		border-radius: 8px;
		margin-bottom: 1rem;
		font-size: 0.875rem;
	}

	.loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 3rem;
		color: var(--text-secondary);
	}

	.spinner {
		width: 32px;
		height: 32px;
		border: 3px solid var(--bg-elevated);
		border-top-color: var(--primary);
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.results-header h2 {
		font-size: 1.1rem;
		color: var(--text-primary);
		margin-bottom: 1.25rem;
	}

	.results-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
		gap: 1rem;
	}

	.result-card {
		display: block;
		padding: 1.25rem;
		background: var(--bg-surface);
		border: 1px solid var(--bg-elevated);
		border-radius: 12px;
		text-decoration: none;
		color: inherit;
		transition: all 0.15s ease;

		&:hover {
			border-color: var(--primary);
			box-shadow: var(--glow-sm);
			transform: translateY(-1px);
		}
	}

	.result-header {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 0.625rem;
	}

	.source-badge {
		padding: 0.2rem 0.5rem;
		font-size: 0.7rem;
		font-weight: 600;
		border-radius: 4px;
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	.badge-famous {
		background: rgba(245, 158, 11, 0.12);
		color: #f59e0b;
	}

	.badge-content {
		background: rgba(251, 113, 133, 0.12);
		color: #3b82f6;
	}

	.enneagram-badge {
		padding: 0.2rem 0.5rem;
		font-size: 0.7rem;
		font-weight: 600;
		border-radius: 4px;
		color: white;
	}

	.result-title {
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 0.375rem;
		line-height: 1.4;
	}

	.result-description {
		font-size: 0.8rem;
		color: var(--text-secondary);
		line-height: 1.5;
		margin-bottom: 0.75rem;
	}

	.result-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
		margin-bottom: 0.75rem;
	}

	.meta-item {
		padding: 0.2rem 0.5rem;
		font-size: 0.7rem;
		border-radius: 4px;

		&.category {
			background: rgba(139, 92, 246, 0.1);
			color: var(--accent);
		}

		&.type {
			background: rgba(16, 185, 129, 0.1);
			color: #10b981;
		}
	}

	.result-footer {
		display: flex;
		justify-content: space-between;
		font-size: 0.7rem;
		color: var(--text-secondary);
	}

	.empty-state {
		text-align: center;
		padding: 3rem 1.5rem;
		color: var(--text-secondary);

		.hint {
			font-size: 0.8rem;
			margin-top: 0.5rem;
			font-style: italic;
		}
	}

	.search-tabs {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1.25rem;
	}

	.tab {
		padding: 0.4rem 0.875rem;
		font-size: 0.8rem;
		font-weight: 500;
		text-decoration: none;
		color: var(--text-secondary);
		border: 1px solid var(--bg-elevated);
		border-radius: 8px;
		background: var(--bg-surface);
		transition: all 0.15s ease;

		&:hover {
			color: var(--primary);
			border-color: var(--primary);
		}

		&.active {
			background: var(--primary);
			color: white;
			border-color: var(--primary);
		}
	}

	@media (max-width: 640px) {
		.search-box {
			flex-direction: column;
		}

		.filters {
			flex-direction: column;
		}

		.filter-group select {
			width: 100%;
		}

		.results-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
