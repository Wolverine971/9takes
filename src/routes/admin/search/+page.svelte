<!-- src/routes/admin/search/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';

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

	let query = '';
	let enneagramFilter: string = '';
	let categoryFilter: string = '';
	let typeFilter: string = '';

	let results: SearchResult[] = [];
	let isLoading = false;
	let error = '';
	let totalResults = 0;
	let searchPerformed = false;

	// Available filter options
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
		if (query.length < 2) {
			error = 'Please enter at least 2 characters';
			return;
		}

		isLoading = true;
		error = '';
		searchPerformed = true;

		try {
			const params = new URLSearchParams({ q: query });
			if (enneagramFilter) params.set('enneagram', enneagramFilter);
			if (categoryFilter) params.set('category', categoryFilter);
			if (typeFilter) params.set('type', typeFilter);

			const response = await fetch(`/api/blog/search?${params.toString()}`);
			const data: SearchResponse = await response.json();

			if (data.error) {
				error = data.error;
				results = [];
			} else {
				results = data.results;
				totalResults = data.total;
			}
		} catch (err) {
			console.error('Search error:', err);
			error = 'Search failed. Please try again.';
			results = [];
		} finally {
			isLoading = false;
		}
	}

	function debounceSearch() {
		clearTimeout(debounceTimer);
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

<div class="search-container">
	<h1>Blog Content Search</h1>
	<p class="subtitle">Search across all enneagram content and celebrity analyses</p>

	<!-- Search Input -->
	<div class="search-box">
		<input
			type="text"
			bind:value={query}
			on:input={debounceSearch}
			on:keydown={handleKeydown}
			placeholder="Search for topics, types, celebrities..."
			class="search-input"
		/>
		<button on:click={search} disabled={isLoading || query.length < 2} class="search-button">
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
				on:change={() => query.length >= 2 && search()}
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
				on:change={() => query.length >= 2 && search()}
			>
				<option value="">All Categories</option>
				{#each categories as cat}
					<option value={cat}>{cat}</option>
				{/each}
			</select>
		</div>

		<div class="filter-group">
			<label for="type">Content Type</label>
			<select id="type" bind:value={typeFilter} on:change={() => query.length >= 2 && search()}>
				<option value="">All Content Types</option>
				{#each contentTypes as t}
					<option value={t}>{t}</option>
				{/each}
			</select>
		</div>

		{#if enneagramFilter || categoryFilter || typeFilter}
			<button on:click={clearFilters} class="clear-button">Clear Filters</button>
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
			<p class="hint">
				Try searching for: "anxiety", "relationships", "type 4", or a celebrity name
			</p>
		</div>
	{/if}
</div>

<style>
	.search-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	h1 {
		font-size: 2rem;
		margin-bottom: 0.5rem;
		color: var(--color-text, #1a1a1a);
	}

	.subtitle {
		color: #6b7280;
		margin-bottom: 2rem;
	}

	.search-box {
		display: flex;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.search-input {
		flex: 1;
		padding: 0.75rem 1rem;
		font-size: 1rem;
		border: 2px solid #e5e7eb;
		border-radius: 8px;
		transition: border-color 0.2s;
	}

	.search-input:focus {
		outline: none;
		border-color: #6366f1;
	}

	.search-button {
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
		font-weight: 600;
		background: #6366f1;
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.search-button:hover:not(:disabled) {
		background: #4f46e5;
	}

	.search-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.filters {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		align-items: flex-end;
		margin-bottom: 2rem;
		padding: 1rem;
		background: #f9fafb;
		border-radius: 8px;
	}

	.filter-group {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.filter-group label {
		font-size: 0.875rem;
		font-weight: 500;
		color: #4b5563;
	}

	.filter-group select {
		padding: 0.5rem 0.75rem;
		font-size: 0.875rem;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		background: white;
		min-width: 150px;
	}

	.clear-button {
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		background: #ef4444;
		color: white;
		border: none;
		border-radius: 6px;
		cursor: pointer;
	}

	.error-message {
		padding: 1rem;
		background: #fef2f2;
		color: #dc2626;
		border-radius: 8px;
		margin-bottom: 1rem;
	}

	.loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 3rem;
		color: #6b7280;
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 3px solid #e5e7eb;
		border-top-color: #6366f1;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.results-header h2 {
		font-size: 1.25rem;
		color: #374151;
		margin-bottom: 1.5rem;
	}

	.results-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
		gap: 1.5rem;
	}

	.result-card {
		display: block;
		padding: 1.5rem;
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		text-decoration: none;
		color: inherit;
		transition:
			box-shadow 0.2s,
			transform 0.2s;
	}

	.result-card:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		transform: translateY(-2px);
	}

	.result-header {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.source-badge {
		padding: 0.25rem 0.5rem;
		font-size: 0.75rem;
		font-weight: 600;
		border-radius: 4px;
		text-transform: uppercase;
	}

	.badge-famous {
		background: #fef3c7;
		color: #92400e;
	}

	.badge-content {
		background: #dbeafe;
		color: #1e40af;
	}

	.enneagram-badge {
		padding: 0.25rem 0.5rem;
		font-size: 0.75rem;
		font-weight: 600;
		border-radius: 4px;
		color: white;
	}

	.result-title {
		font-size: 1.125rem;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 0.5rem;
		line-height: 1.4;
	}

	.result-description {
		font-size: 0.875rem;
		color: #6b7280;
		line-height: 1.5;
		margin-bottom: 1rem;
	}

	.result-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.meta-item {
		padding: 0.25rem 0.5rem;
		font-size: 0.75rem;
		border-radius: 4px;
	}

	.meta-item.category {
		background: #f3e8ff;
		color: #7c3aed;
	}

	.meta-item.type {
		background: #ecfdf5;
		color: #059669;
	}

	.result-footer {
		display: flex;
		justify-content: space-between;
		font-size: 0.75rem;
		color: #9ca3af;
	}

	.empty-state {
		text-align: center;
		padding: 4rem 2rem;
		color: #6b7280;
	}

	.empty-state .hint {
		font-size: 0.875rem;
		margin-top: 0.5rem;
		font-style: italic;
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
