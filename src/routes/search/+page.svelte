<script lang="ts">
	import SEOHead from '$lib/components/SEOHead.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	type Scope = 'all' | 'library' | 'questions';

	const scopeOptions: Array<{ value: Scope; label: string; subtitle: string }> = [
		{ value: 'all', label: 'All', subtitle: 'Library + questions' },
		{ value: 'library', label: 'Library', subtitle: 'Blogs and personality analysis' },
		{ value: 'questions', label: 'Questions', subtitle: 'Community answers and threads' }
	];

	const enneagramOptions = [
		{ value: '', label: 'All types' },
		...Array.from({ length: 9 }, (_, index) => ({
			value: String(index + 1),
			label: `Type ${index + 1}`
		}))
	];

	let pageTitle = $derived(
		data.query
		? `Search results for "${data.query}" | 9takes`
		: 'Search the 9takes library | 9takes'
	);

	let pageDescription = $derived(
		data.query
		? `Search 9takes for ${data.query} across blogs, personality analysis, and questions.`
		: 'Search across 9takes blogs, personality analysis, and community questions.'
	);

	let showingFrom = $derived(
		data.total > 0 ? Math.min((data.currentPage - 1) * data.resultsPerPage + 1, data.total) : 0
	);
	let showingTo = $derived(
		data.total > 0 ? Math.min(data.currentPage * data.resultsPerPage, data.total) : 0
	);

	function normalizeComparisonText(value: string): string {
		return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
	}

	function buildSearchHref(overrides: Partial<{
		q: string;
		scope: Scope;
		page: number;
		category: string;
		type: string;
		enneagram: string;
	}> = {}): string {
		const params = new URLSearchParams();
		const nextQuery = overrides.q ?? data.query;
		const nextScope = overrides.scope ?? data.scope;
		const nextPage = overrides.page ?? data.currentPage;

		if (nextQuery) {
			params.set('q', nextQuery);
		}

		if (nextScope !== 'all') {
			params.set('scope', nextScope);
		}

		if (nextPage > 1) {
			params.set('page', String(nextPage));
		}

		if (nextScope !== 'questions') {
			const nextCategory = overrides.category ?? data.filters.category;
			const nextType = overrides.type ?? data.filters.type;
			const nextEnneagram = overrides.enneagram ?? data.filters.enneagram;

			if (nextCategory) {
				params.set('category', nextCategory);
			}
			if (nextType) {
				params.set('type', nextType);
			}
			if (nextEnneagram) {
				params.set('enneagram', nextEnneagram);
			}
		}

		const queryString = params.toString();
		return queryString ? `/search?${queryString}` : '/search';
	}

	function formatScopeLabel(scope: Scope): string {
		switch (scope) {
			case 'library':
				return 'library';
			case 'questions':
				return 'questions';
			default:
				return 'all content';
		}
	}

	function getSourceLabel(source: PageData['results'][number]['source'], category: string | null): string {
		if (source === 'question') {
			return 'Question';
		}
		if (source === 'personality_analysis') {
			return 'Personality Analysis';
		}

		switch (category) {
			case 'community':
				return 'Opinion Piece';
			case 'guides':
				return 'How-to Guide';
			case 'pop-culture':
				return 'Pop Culture';
			case 'mental-health':
				return 'Mental Health';
			default:
				return 'Library Article';
		}
	}

	function getCategoryLabel(category: string | null): string {
		if (!category) {
			return '';
		}

		const match = data.categoryOptions.find((option) => option.value === category);
		return match?.label ?? category.replace(/-/g, ' ');
	}

	function getBadgeClass(source: PageData['results'][number]['source']): string {
		if (source === 'question') return 'badge-question';
		if (source === 'personality_analysis') return 'badge-personality';
		return 'badge-library';
	}

	function renderHighlight(html: string): string {
		let safe = html
			.replace(/<mark>/gi, '\x00MARK_OPEN\x00')
			.replace(/<\/mark>/gi, '\x00MARK_CLOSE\x00');
		safe = safe.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		return safe
			.replace(/\x00MARK_OPEN\x00/g, '<mark>')
			.replace(/\x00MARK_CLOSE\x00/g, '</mark>');
	}

	function resultKey(result: PageData['results'][number]): string {
		return `${result.source}:${result.id}:${result.url}`;
	}

	function shouldShowDescription(result: PageData['results'][number]): boolean {
		if (!result.description) {
			return false;
		}

		return (
			normalizeComparisonText(result.description) !== normalizeComparisonText(result.headline) &&
			normalizeComparisonText(result.description) !== normalizeComparisonText(result.title)
		);
	}
</script>

<SEOHead
	title={pageTitle}
	description={pageDescription}
	canonical="https://9takes.com/search"
	noindex={true}
/>

<div class="search-page">
	<section class="search-hero">
		<div class="hero-copy">
			<p class="eyebrow">Universal search</p>
			<h1>Search the library and the conversations around it.</h1>
			<p class="hero-description">
				Find enneagram deep dives, personality analysis, practical guides, and questions in one
				place.
			</p>
		</div>

		<div class="search-shell">
			<div class="scope-row" role="tablist" aria-label="Search scope">
				{#each scopeOptions as option}
					<a
						href={buildSearchHref({ scope: option.value, page: 1 })}
						class="scope-pill"
						class:is-active={data.scope === option.value}
						aria-current={data.scope === option.value ? 'page' : undefined}
					>
						<span>{option.label}</span>
						<small>{option.subtitle}</small>
					</a>
				{/each}
			</div>

			<form method="GET" action="/search" class="search-form">
				{#if data.scope !== 'all'}
					<input type="hidden" name="scope" value={data.scope} />
				{/if}

				<div class="query-row">
					<label class="sr-only" for="search-query">Search query</label>
					<input
						id="search-query"
						type="search"
						name="q"
						value={data.query}
						placeholder="Search blogs, personalities, and questions..."
						autocomplete="off"
					/>
					<button type="submit">Search</button>
				</div>

				{#if data.scope !== 'questions'}
					<div class="filter-grid">
						<label>
							<span>Enneagram</span>
							<select name="enneagram">
								{#each enneagramOptions as option}
									<option value={option.value} selected={data.filters.enneagram === option.value}>
										{option.label}
									</option>
								{/each}
							</select>
						</label>

						<label>
							<span>Category</span>
							<select name="category">
								<option value="" selected={!data.filters.category}>All categories</option>
								{#each data.categoryOptions as option}
									<option value={option.value} selected={data.filters.category === option.value}>
										{option.label}
									</option>
								{/each}
							</select>
						</label>

						<label>
							<span>Topic</span>
							<select name="type">
								<option value="" selected={!data.filters.type}>All topics</option>
								{#each data.typeOptions as option}
									<option value={option.value} selected={data.filters.type === option.value}>
										{option.label}
									</option>
								{/each}
							</select>
						</label>
					</div>
				{/if}
			</form>

			{#if data.query}
				<div class="active-query-row">
					<p>
						Searching <strong>{formatScopeLabel(data.scope)}</strong>
						for <strong>"{data.query}"</strong>
					</p>
					<a href="/search" class="clear-link">Clear</a>
				</div>
			{/if}
		</div>
	</section>

	<section class="results-shell">
		{#if data.errorMessage}
			<div class="message-card message-error">
				<h2>Search needs a little more input</h2>
				<p>{data.errorMessage}</p>
			</div>
		{:else if !data.searchPerformed}
			<div class="message-card">
				<h2>Start with a name, a topic, or a question.</h2>
				<p>
					Try a person like “Cillian Murphy”, a concept like “attachment styles”, or a question
					like “How do I stop overthinking?”
				</p>
				<div class="sample-query-row">
					{#each data.sampleQueries as sample}
						<a href={buildSearchHref({ q: sample, page: 1 })} class="sample-chip">{sample}</a>
					{/each}
				</div>
			</div>
		{:else if data.total === 0}
			<div class="message-card">
				<h2>No matches yet.</h2>
				<p>
					Try a broader phrase, remove a filter, or switch scopes to search across more of the
					site.
				</p>
				<div class="sample-query-row">
					{#each data.sampleQueries as sample}
						<a href={buildSearchHref({ q: sample, page: 1 })} class="sample-chip">{sample}</a>
					{/each}
				</div>
			</div>
		{:else}
			<div class="results-header">
				<div>
					<p class="results-eyebrow">Search results</p>
					<h2>{data.total} matches for “{data.query}”</h2>
				</div>
				<p class="results-summary">Showing {showingFrom}-{showingTo} of {data.total}</p>
			</div>

			<div class="results-list">
				{#each data.results as result (resultKey(result))}
					<a href={result.url} class="result-card">
						<div class="result-topline">
							<span class={`source-badge ${getBadgeClass(result.source)}`}>
								{getSourceLabel(result.source, result.category)}
							</span>
							{#if result.category}
								<span class="meta-chip">{getCategoryLabel(result.category)}</span>
							{/if}
							{#if result.enneagram}
								<span class="meta-chip">Type {result.enneagram}</span>
							{/if}
							{#if result.comment_count}
								<span class="meta-chip">{result.comment_count} comments</span>
							{/if}
						</div>

						<h3>{result.title}</h3>

						{#if shouldShowDescription(result)}
							<p class="result-description">{result.description}</p>
						{/if}

						<p class="result-headline">
							{@html renderHighlight(result.headline)}
						</p>

						{#if result.tags.length > 0}
							<div class="tag-row">
								{#each result.tags.slice(0, 4) as tag}
									<span class="tag-pill">{tag}</span>
								{/each}
							</div>
						{/if}
					</a>
				{/each}
			</div>

			{#if data.totalPages > 1}
				<nav class="pagination" aria-label="Search results pagination">
					{#if data.currentPage > 1}
						<a href={buildSearchHref({ page: data.currentPage - 1 })} class="page-link">
							Previous
						</a>
					{:else}
						<span class="page-link is-disabled">Previous</span>
					{/if}

					<span class="page-status">Page {data.currentPage} of {data.totalPages}</span>

					{#if data.currentPage < data.totalPages}
						<a href={buildSearchHref({ page: data.currentPage + 1 })} class="page-link">
							Next
						</a>
					{:else}
						<span class="page-link is-disabled">Next</span>
					{/if}
				</nav>
			{/if}
		{/if}
	</section>
</div>

<style lang="scss">
	:global(.sr-only) {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	.search-page {
		min-height: 100vh;
		background:
			radial-gradient(circle at top, rgba(45, 212, 191, 0.1), transparent 32%),
			linear-gradient(180deg, var(--bg-base) 0%, var(--bg-deep) 100%);
		padding: 1.5rem 1rem 4rem;
	}

	.search-hero,
	.results-shell {
		max-width: 1080px;
		margin: 0 auto;
	}

	.search-hero {
		padding-top: 1rem;
	}

	.hero-copy {
		max-width: 680px;
		margin-bottom: 1.5rem;
	}

	.eyebrow,
	.results-eyebrow {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.74rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--accent-light);
		margin: 0 0 0.7rem;
	}

	.hero-copy h1,
	.results-header h2 {
		margin: 0;
		font-size: clamp(2rem, 4vw, 3.25rem);
		line-height: 1.04;
		letter-spacing: -0.03em;
		color: var(--text-primary);
	}

	.hero-description {
		margin: 1rem 0 0;
		font-size: 1.05rem;
		line-height: 1.7;
		color: var(--text-secondary);
		max-width: 60ch;
	}

	.search-shell,
	.message-card,
	.result-card {
		background: rgba(10, 16, 22, 0.74);
		border: 1px solid rgba(125, 211, 252, 0.12);
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
		backdrop-filter: blur(18px);
	}

	.search-shell {
		border-radius: 28px;
		padding: 1.15rem;
	}

	.scope-row {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.scope-pill {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 0.9rem 1rem;
		border-radius: 18px;
		text-decoration: none;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid transparent;
		color: var(--text-secondary);
		transition:
			transform 180ms ease,
			border-color 180ms ease,
			background 180ms ease;
	}

	.scope-pill span {
		font-weight: 600;
		color: var(--text-primary);
	}

	.scope-pill small {
		font-size: 0.82rem;
	}

	.scope-pill:hover,
	.scope-pill.is-active {
		transform: translateY(-1px);
		border-color: rgba(125, 211, 252, 0.22);
		background: rgba(45, 212, 191, 0.08);
	}

	.search-form {
		display: grid;
		gap: 0.9rem;
	}

	.query-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 0.75rem;
	}

	.query-row input,
	.filter-grid select {
		width: 100%;
		border-radius: 16px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(255, 255, 255, 0.04);
		color: var(--text-primary);
		font: inherit;
	}

	.query-row input {
		padding: 1rem 1.1rem;
		font-size: 1.05rem;
	}

	.query-row button {
		border: none;
		border-radius: 16px;
		padding: 0 1.2rem;
		font: inherit;
		font-weight: 700;
		background: linear-gradient(135deg, var(--accent-light), #8be9d5);
		color: #08202a;
		cursor: pointer;
	}

	.filter-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.75rem;
	}

	.filter-grid label {
		display: grid;
		gap: 0.45rem;
	}

	.filter-grid span {
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--text-secondary);
	}

	.filter-grid select {
		padding: 0.85rem 0.95rem;
	}

	.active-query-row {
		margin-top: 0.85rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		font-size: 0.95rem;
		color: var(--text-secondary);
	}

	.active-query-row p {
		margin: 0;
	}

	.clear-link,
	.sample-chip,
	.page-link {
		text-decoration: none;
	}

	.clear-link {
		color: var(--accent-light);
		font-weight: 600;
	}

	.results-shell {
		padding-top: 1.5rem;
	}

	.message-card {
		border-radius: 24px;
		padding: 1.5rem;
	}

	.message-card h2 {
		margin: 0 0 0.65rem;
		font-size: 1.45rem;
		color: var(--text-primary);
	}

	.message-card p {
		margin: 0;
		color: var(--text-secondary);
		line-height: 1.7;
	}

	.message-error {
		border-color: rgba(248, 113, 113, 0.18);
	}

	.sample-query-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.65rem;
		margin-top: 1rem;
	}

	.sample-chip,
	.meta-chip,
	.tag-pill {
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background: rgba(255, 255, 255, 0.04);
		color: var(--text-secondary);
	}

	.sample-chip {
		padding: 0.55rem 0.85rem;
		font-size: 0.92rem;
	}

	.results-header {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.results-header h2 {
		font-size: clamp(1.6rem, 3vw, 2.4rem);
	}

	.results-summary {
		margin: 0;
		color: var(--text-secondary);
	}

	.results-list {
		display: grid;
		gap: 1rem;
	}

	.result-card {
		display: grid;
		gap: 0.9rem;
		padding: 1.35rem 1.4rem;
		border-radius: 22px;
		text-decoration: none;
		transition:
			transform 180ms ease,
			border-color 180ms ease,
			background 180ms ease;
	}

	.result-card:hover {
		transform: translateY(-2px);
		border-color: rgba(125, 211, 252, 0.24);
		background: rgba(13, 22, 30, 0.82);
	}

	.result-topline,
	.tag-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.55rem;
		align-items: center;
	}

	.source-badge,
	.meta-chip,
	.tag-pill {
		font-size: 0.78rem;
		padding: 0.35rem 0.65rem;
	}

	.source-badge {
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.badge-library {
		background: rgba(59, 130, 246, 0.12);
		color: #a5c8ff;
		border: 1px solid rgba(59, 130, 246, 0.24);
	}

	.badge-personality {
		background: rgba(244, 114, 182, 0.12);
		color: #f9a8d4;
		border: 1px solid rgba(244, 114, 182, 0.24);
	}

	.badge-question {
		background: rgba(250, 204, 21, 0.12);
		color: #fde68a;
		border: 1px solid rgba(250, 204, 21, 0.24);
	}

	.result-card h3 {
		margin: 0;
		font-size: 1.35rem;
		line-height: 1.25;
		color: var(--text-primary);
	}

	.result-description,
	.result-headline {
		margin: 0;
		line-height: 1.7;
	}

	.result-description {
		color: var(--text-secondary);
	}

	.result-headline {
		color: var(--text-primary);
	}

	.result-headline :global(mark) {
		background: rgba(45, 212, 191, 0.18);
		color: var(--text-primary);
		padding: 0.05rem 0.22rem;
		border-radius: 0.3rem;
	}

	.pagination {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		margin-top: 1.5rem;
	}

	.page-link,
	.page-status {
		padding: 0.85rem 1rem;
		border-radius: 14px;
	}

	.page-link {
		background: rgba(255, 255, 255, 0.05);
		color: var(--text-primary);
		font-weight: 600;
	}

	.page-link.is-disabled {
		opacity: 0.45;
	}

	.page-status {
		color: var(--text-secondary);
	}

	@media (max-width: 820px) {
		.scope-row,
		.filter-grid,
		.query-row,
		.results-header,
		.pagination,
		.active-query-row {
			grid-template-columns: 1fr;
			flex-direction: column;
			align-items: stretch;
		}

		.query-row button {
			min-height: 3.2rem;
		}

		.results-header {
			align-items: start;
		}

		.pagination {
			align-items: stretch;
		}
	}

	@media (max-width: 640px) {
		.search-page {
			padding-inline: 0.85rem;
		}

		.search-shell,
		.message-card,
		.result-card {
			border-radius: 22px;
		}

		.hero-copy h1,
		.results-header h2 {
			font-size: 1.85rem;
		}
	}
</style>
