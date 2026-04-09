<!-- src/lib/components/molecules/HeaderSearch.svelte -->
<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onDestroy } from 'svelte';
	import { onClickOutside } from '$lib/components/molecules/Context.svelte';

	export let mobile = false;
	export let placeholder = 'Search questions, people, and blog topics';

	type SearchSource = 'blog' | 'personality_analysis' | 'question';

	interface SearchResult {
		id: number;
		source: SearchSource;
		title: string;
		description: string;
		headline: string;
		url: string;
		category: string | null;
		comment_count: number | null;
	}

	const MIN_QUERY_LENGTH = 2;
	const SEARCH_SCOPE = 'all';

	let query = '';
	let routeQuery = '';
	let trimmedQuery = '';
	let activeIndex = -1;
	let isFocused = false;
	let isOpen = false;
	let isLoading = false;
	let results: SearchResult[] = [];
	let showResultsPanel = false;
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;
	let activeRequest = 0;
	let abortController: AbortController | null = null;

	$: routeQuery =
		$page.url.pathname === '/search' ? ($page.url.searchParams.get('q') || '').trim() : '';
	$: trimmedQuery = query.trim();
	$: showResultsPanel = isOpen && trimmedQuery.length >= MIN_QUERY_LENGTH;

	$: if (!isFocused && !isOpen && query !== routeQuery) {
		query = routeQuery;
	}

	afterNavigate(() => {
		isFocused = false;
		isOpen = false;
		isLoading = false;
		activeIndex = -1;
		results = [];
		query = routeQuery;
		cancelPendingRequest();
	});

	onDestroy(() => {
		cancelPendingRequest();
		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}
	});

	function cancelPendingRequest() {
		abortController?.abort();
		abortController = null;
	}

	function escapeHtml(value: string): string {
		return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}

	function renderHighlight(html: string): string {
		const normalized = html
			.replace(/<mark>/gi, '\x00MARK_OPEN\x00')
			.replace(/<\/mark>/gi, '\x00MARK_CLOSE\x00');

		return escapeHtml(normalized)
			.replace(/\x00MARK_OPEN\x00/g, '<mark>')
			.replace(/\x00MARK_CLOSE\x00/g, '</mark>');
	}

	function normalizeText(value: string): string {
		return value
			.replace(/<[^>]+>/g, ' ')
			.replace(/\s+/g, ' ')
			.trim()
			.toLowerCase();
	}

	function getResultContext(result: SearchResult): string {
		if (result.source === 'question') {
			const commentCount = result.comment_count ?? 0;
			if (commentCount > 0) {
				return commentCount === 1 ? '1 reply' : `${commentCount} replies`;
			}
			return 'Community question';
		}

		if (result.source === 'personality_analysis') {
			return 'Personality analysis';
		}

		switch (result.category) {
			case 'pop-culture':
				return 'Pop culture analysis';
			case 'community':
				return '9takes opinion';
			case 'guides':
				return 'How-to guide';
			case 'mental-health':
				return 'Mental health';
			default:
				return 'Library article';
		}
	}

	function getResultHeadline(result: SearchResult): string {
		if (result.headline && normalizeText(result.headline) !== normalizeText(result.title)) {
			return result.headline;
		}

		if (result.description && normalizeText(result.description) !== normalizeText(result.title)) {
			return result.description;
		}

		return '';
	}

	function closeResults() {
		isOpen = false;
		activeIndex = -1;
	}

	function handleOutsideClick() {
		isFocused = false;
		closeResults();
	}

	function scheduleTypeahead(nextQuery = query) {
		const normalizedQuery = nextQuery.trim();

		if (debounceTimer) {
			clearTimeout(debounceTimer);
			debounceTimer = null;
		}

		if (normalizedQuery.length < MIN_QUERY_LENGTH) {
			cancelPendingRequest();
			isLoading = false;
			results = [];
			closeResults();
			return;
		}

		isOpen = true;
		isLoading = true;
		debounceTimer = setTimeout(() => {
			void fetchTypeahead(normalizedQuery);
		}, 180);
	}

	async function fetchTypeahead(searchQuery: string) {
		const normalizedQuery = searchQuery.trim();
		if (normalizedQuery.length < MIN_QUERY_LENGTH) {
			results = [];
			isLoading = false;
			return;
		}

		const requestId = ++activeRequest;
		cancelPendingRequest();
		abortController = new AbortController();
		isLoading = true;

		try {
			const params = new URLSearchParams({
				q: normalizedQuery,
				scope: SEARCH_SCOPE,
				limit: mobile ? '6' : '8'
			});

			const response = await fetch(`/api/search/typeahead?${params.toString()}`, {
				signal: abortController.signal
			});
			const payload = await response.json();

			if (requestId !== activeRequest) {
				return;
			}

			results = Array.isArray(payload?.results) ? payload.results : [];
			isOpen = true;
			activeIndex = -1;
		} catch (error) {
			if ((error as Error)?.name !== 'AbortError') {
				console.error('Header typeahead failed', error);
				results = [];
			}
		} finally {
			if (requestId === activeRequest) {
				isLoading = false;
			}
		}
	}

	function goToSearch(targetQuery = query.trim()) {
		const params = new URLSearchParams();
		if (targetQuery) {
			params.set('q', targetQuery);
		}
		closeResults();
		void goto(params.toString() ? `/search?${params.toString()}` : '/search');
	}

	function navigateToResult(result: SearchResult) {
		query = result.title;
		closeResults();
		void goto(result.url);
	}

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (activeIndex >= 0 && results[activeIndex]) {
			navigateToResult(results[activeIndex]);
			return;
		}

		goToSearch();
	}

	function handleInput(event: Event) {
		const target = event.currentTarget as HTMLInputElement;
		query = target.value;
		activeIndex = -1;
		scheduleTypeahead(target.value);
	}

	function handleFocus() {
		isFocused = true;
		if (query.trim().length >= MIN_QUERY_LENGTH) {
			if (results.length > 0) {
				isOpen = true;
			} else {
				scheduleTypeahead(query);
			}
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeResults();
			return;
		}

		if (!isOpen || results.length === 0) {
			return;
		}

		if (event.key === 'ArrowDown') {
			event.preventDefault();
			activeIndex = activeIndex < results.length - 1 ? activeIndex + 1 : 0;
			return;
		}

		if (event.key === 'ArrowUp') {
			event.preventDefault();
			activeIndex = activeIndex > 0 ? activeIndex - 1 : results.length - 1;
		}
	}

	function clearQuery() {
		query = '';
		results = [];
		activeIndex = -1;
		isLoading = false;
		closeResults();
		cancelPendingRequest();
	}
</script>

<form
	class:mobile
	class:is-focused={isFocused}
	class="header-search"
	role="search"
	action="/search"
	method="GET"
	use:onClickOutside={handleOutsideClick}
	on:submit={handleSubmit}
>
	<div class="search-field">
		<span class="search-icon" aria-hidden="true">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
				<circle cx="11" cy="11" r="7"></circle>
				<path d="m20 20-3.5-3.5"></path>
			</svg>
		</span>

		<label class="sr-only" for={mobile ? 'mobile-header-search' : 'desktop-header-search'}>
			Search
		</label>
		<input
			id={mobile ? 'mobile-header-search' : 'desktop-header-search'}
			type="search"
			name="q"
			bind:value={query}
			{placeholder}
			autocomplete="off"
			enterkeyhint="search"
			aria-label="Search 9takes"
			aria-autocomplete="list"
			on:input={handleInput}
			on:focus={handleFocus}
			on:blur={() => (isFocused = false)}
			on:keydown={handleKeydown}
		/>

		{#if isLoading}
			<span class="search-status loading" aria-hidden="true"></span>
		{:else if query}
			<button type="button" class="clear-button" on:click={clearQuery} aria-label="Clear search">
				<span aria-hidden="true">&times;</span>
			</button>
		{/if}
	</div>

	{#if showResultsPanel}
		<div class="results-panel" role="listbox" aria-label="Search suggestions">
			{#if isLoading}
				<div class="results-state">Searching…</div>
			{:else if results.length === 0}
				<button type="button" class="results-state state-button" on:click={() => goToSearch()}>
					Search for "{trimmedQuery}"
				</button>
			{:else}
				<ul class="results-list">
					{#each results as result, index}
						<li>
							<button
								type="button"
								class="result-item"
								class:is-active={index === activeIndex}
								role="option"
								aria-selected={index === activeIndex}
								on:click={() => navigateToResult(result)}
							>
								<div class="result-meta">
									<span class="result-source">{getResultContext(result)}</span>
								</div>
								<span class="result-title">{result.title}</span>
								{#if getResultHeadline(result)}
									<span class="result-headline">
										{@html renderHighlight(getResultHeadline(result))}
									</span>
								{/if}
							</button>
						</li>
					{/each}
				</ul>

				<button type="button" class="results-footer" on:click={() => goToSearch()}>
					View all results
				</button>
			{/if}
		</div>
	{/if}
</form>

<style lang="scss">
	.header-search {
		position: relative;
		width: 100%;
		min-width: 0;
	}

	.search-field {
		position: relative;
		display: flex;
		align-items: center;
		min-height: 3rem;
		border: 1px solid color-mix(in srgb, var(--primary) 18%, var(--glass-border));
		border-radius: 999px;
		background:
			linear-gradient(
				180deg,
				color-mix(in srgb, var(--bg-surface) 94%, transparent),
				var(--bg-surface)
			),
			var(--bg-surface);
		box-shadow:
			0 10px 30px color-mix(in srgb, var(--bg-deep) 35%, transparent),
			inset 0 1px 0 color-mix(in srgb, white 6%, transparent);
		transition:
			border-color 0.18s ease,
			box-shadow 0.18s ease,
			transform 0.18s ease;
	}

	.header-search.is-focused .search-field {
		border-color: color-mix(in srgb, var(--primary) 58%, var(--glass-border));
		box-shadow:
			0 14px 34px color-mix(in srgb, var(--primary) 14%, transparent),
			0 0 0 4px color-mix(in srgb, var(--primary) 12%, transparent);
		transform: translateY(-1px);
	}

	.search-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.75rem;
		color: color-mix(in srgb, var(--text-secondary) 92%, var(--primary));
		flex-shrink: 0;
	}

	.search-icon svg {
		width: 1rem;
		height: 1rem;
	}

	input {
		width: 100%;
		min-width: 0;
		padding: 0.9rem 0.25rem 0.9rem 0;
		border: 0;
		background: transparent;
		color: var(--text-primary);
		font-size: 0.98rem;
		line-height: 1.2;
	}

	input::placeholder {
		color: color-mix(in srgb, var(--text-secondary) 80%, transparent);
	}

	input:focus {
		outline: none;
	}

	.search-status,
	.clear-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		margin-right: 0.35rem;
		border-radius: 999px;
		flex-shrink: 0;
	}

	.loading {
		position: relative;
	}

	.loading::after {
		content: '';
		width: 1rem;
		height: 1rem;
		border-radius: 999px;
		border: 2px solid color-mix(in srgb, var(--text-secondary) 25%, transparent);
		border-top-color: var(--primary);
		animation: header-search-spin 0.8s linear infinite;
	}

	.clear-button {
		border: 0;
		background: transparent;
		color: var(--text-secondary);
		cursor: pointer;
		font-size: 1.25rem;
		transition:
			background-color 0.18s ease,
			color 0.18s ease;
	}

	.clear-button:hover {
		background: var(--primary-subtle);
		color: var(--primary);
	}

	.clear-button:focus {
		outline: 2px solid var(--primary);
		outline-offset: 2px;
	}

	.results-panel {
		position: absolute;
		left: 0;
		right: 0;
		top: calc(100% + 0.65rem);
		z-index: 80;
		overflow: hidden;
		border: 1px solid color-mix(in srgb, var(--primary) 16%, var(--glass-border));
		border-radius: 1.1rem;
		background:
			linear-gradient(
				180deg,
				color-mix(in srgb, var(--bg-surface) 96%, transparent),
				var(--bg-surface)
			),
			var(--bg-surface);
		box-shadow:
			0 26px 54px color-mix(in srgb, var(--bg-deep) 30%, transparent),
			0 0 0 1px color-mix(in srgb, var(--primary) 6%, transparent);
		backdrop-filter: blur(18px);
	}

	.results-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.result-item,
	.results-footer,
	.state-button {
		width: 100%;
		border: 0;
		background: transparent;
		text-align: left;
		cursor: pointer;
	}

	.result-item {
		display: flex;
		flex-direction: column;
		gap: 0.28rem;
		padding: 0.9rem 1rem;
		border-bottom: 1px solid color-mix(in srgb, var(--glass-border) 85%, transparent);
		transition:
			background-color 0.16s ease,
			transform 0.16s ease;
	}

	.result-item:hover,
	.result-item.is-active {
		background: color-mix(in srgb, var(--primary-subtle) 82%, transparent);
	}

	.result-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.result-source {
		display: inline-flex;
		align-items: center;
		padding: 0.22rem 0.55rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--primary) 10%, transparent);
		color: color-mix(in srgb, var(--primary-light) 86%, var(--text-secondary));
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.result-title {
		color: var(--text-primary);
		font-size: 0.98rem;
		font-weight: 600;
		line-height: 1.35;
	}

	.result-headline {
		color: var(--text-secondary);
		font-size: 0.84rem;
		line-height: 1.45;
	}

	.result-headline :global(mark) {
		background: color-mix(in srgb, var(--accent) 42%, transparent);
		color: var(--text-primary);
		padding: 0 0.12rem;
		border-radius: 0.25rem;
	}

	.results-state,
	.results-footer {
		padding: 0.95rem 1rem;
		font-size: 0.92rem;
		color: var(--text-secondary);
	}

	.state-button:hover,
	.results-footer:hover {
		background: color-mix(in srgb, var(--primary-subtle) 78%, transparent);
		color: var(--primary-light);
	}

	.results-footer {
		border-top: 1px solid color-mix(in srgb, var(--glass-border) 85%, transparent);
		font-weight: 600;
	}

	.mobile .search-field {
		min-height: 2.85rem;
	}

	.mobile input {
		font-size: 0.94rem;
	}

	.mobile .results-panel {
		top: calc(100% + 0.5rem);
		border-radius: 1rem;
	}

	@keyframes header-search-spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (max-width: 767px) {
		.search-icon {
			width: 2.5rem;
		}

		.result-item {
			padding: 0.85rem 0.9rem;
		}
	}
</style>
