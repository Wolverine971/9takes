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
	const TYPEAHEAD_DEBOUNCE_MS = 100;
	const TYPEAHEAD_CACHE_TTL_MS = 60_000;
	const MAX_TYPEAHEAD_CACHE_SIZE = 40;

	let query = '';
	let routeQuery = '';
	let trimmedQuery = '';
	let resultsQuery = '';
	let activeIndex = -1;
	let isFocused = false;
	let isOpen = false;
	let isLoading = false;
	let results: SearchResult[] = [];
	let showResultsPanel = false;
	let showResultList = false;
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;
	let activeRequest = 0;
	let abortController: AbortController | null = null;
	const typeaheadCache = new Map<string, { timestamp: number; results: SearchResult[] }>();

	$: routeQuery =
		$page.url.pathname === '/search' ? ($page.url.searchParams.get('q') || '').trim() : '';
	$: trimmedQuery = query.trim();
	$: showResultsPanel = isOpen && trimmedQuery.length >= MIN_QUERY_LENGTH;
	$: showResultList =
		results.length > 0 &&
		(trimmedQuery === resultsQuery ||
			trimmedQuery.startsWith(resultsQuery) ||
			resultsQuery.startsWith(trimmedQuery));

	$: if (!isFocused && !isOpen && query !== routeQuery) {
		query = routeQuery;
	}

	// ARIA combobox wiring: stable ids tie the input to its listbox + active
	// option so screen readers announce arrow-key navigation.
	$: inputId = mobile ? 'mobile-header-search' : 'desktop-header-search';
	$: listboxId = `${inputId}-listbox`;
	$: activeDescendantId =
		showResultList && activeIndex >= 0 ? `${inputId}-option-${activeIndex}` : undefined;
	$: searchStatusMessage = !showResultsPanel
		? ''
		: isLoading
			? 'Searching…'
			: showResultList
				? `${results.length} ${results.length === 1 ? 'result' : 'results'} available.`
				: 'No results found.';

	afterNavigate(() => {
		isFocused = false;
		isOpen = false;
		isLoading = false;
		activeIndex = -1;
		results = [];
		resultsQuery = '';
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

	function getCacheKey(searchQuery: string): string {
		return `${SEARCH_SCOPE}:${mobile ? '6' : '8'}:${searchQuery.toLowerCase()}`;
	}

	function readCachedResults(searchQuery: string): SearchResult[] | null {
		const key = getCacheKey(searchQuery);
		const cached = typeaheadCache.get(key);

		if (!cached) {
			return null;
		}

		if (Date.now() - cached.timestamp > TYPEAHEAD_CACHE_TTL_MS) {
			typeaheadCache.delete(key);
			return null;
		}

		return cached.results;
	}

	function writeCachedResults(searchQuery: string, nextResults: SearchResult[]) {
		if (typeaheadCache.size >= MAX_TYPEAHEAD_CACHE_SIZE) {
			const oldestKey = typeaheadCache.keys().next().value;
			if (oldestKey) {
				typeaheadCache.delete(oldestKey);
			}
		}

		typeaheadCache.set(getCacheKey(searchQuery), {
			timestamp: Date.now(),
			results: nextResults
		});
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
			resultsQuery = '';
			closeResults();
			return;
		}

		isOpen = true;
		const cachedResults = readCachedResults(normalizedQuery);
		if (cachedResults) {
			cancelPendingRequest();
			results = cachedResults;
			resultsQuery = normalizedQuery;
			activeIndex = -1;
			isLoading = false;
			return;
		}

		isLoading = true;
		debounceTimer = setTimeout(() => {
			void fetchTypeahead(normalizedQuery);
		}, TYPEAHEAD_DEBOUNCE_MS);
	}

	async function fetchTypeahead(searchQuery: string) {
		const normalizedQuery = searchQuery.trim();
		if (normalizedQuery.length < MIN_QUERY_LENGTH) {
			results = [];
			resultsQuery = '';
			isLoading = false;
			return;
		}

		const cachedResults = readCachedResults(normalizedQuery);
		if (cachedResults) {
			results = cachedResults;
			resultsQuery = normalizedQuery;
			isLoading = false;
			isOpen = true;
			activeIndex = -1;
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
			resultsQuery = normalizedQuery;
			writeCachedResults(normalizedQuery, results);
			isOpen = true;
			activeIndex = -1;
		} catch (error) {
			if ((error as Error)?.name !== 'AbortError') {
				console.error('Header typeahead failed', error);
				results = [];
				resultsQuery = normalizedQuery;
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

		if (showResultList && activeIndex >= 0 && results[activeIndex]) {
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

		if (!isOpen || !showResultList) {
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
		resultsQuery = '';
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

		<label class="sr-only" for={inputId}> Search </label>
		<input
			id={inputId}
			type="search"
			name="q"
			bind:value={query}
			{placeholder}
			autocomplete="off"
			inputmode="search"
			enterkeyhint="search"
			role="combobox"
			aria-label="Search 9takes"
			aria-autocomplete="list"
			aria-expanded={showResultsPanel}
			aria-controls={showResultList ? listboxId : undefined}
			aria-activedescendant={activeDescendantId}
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
		<div class="results-panel">
			{#if showResultList}
				<ul
					id={listboxId}
					class="results-list"
					role="listbox"
					aria-label="Search suggestions"
					aria-busy={isLoading}
				>
					{#each results as result, index}
						<li role="presentation">
							<button
								type="button"
								id={`${inputId}-option-${index}`}
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
					View all results for "{trimmedQuery}"
				</button>
			{:else if isLoading}
				<div class="results-state">Searching…</div>
			{:else}
				<button type="button" class="results-state state-button" on:click={() => goToSearch()}>
					Search for "{trimmedQuery}"
				</button>
			{/if}
		</div>
	{/if}

	<!-- Persistent live region: announces result counts / state to screen
	     readers as the user types and arrows through suggestions. -->
	<div class="sr-only" role="status" aria-live="polite">{searchStatusMessage}</div>
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
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 18%, var(--glass-border));
		border-radius: 999px;
		background:
			linear-gradient(
				180deg,
				color-mix(in srgb, var(--stone-warm) 94%, transparent),
				var(--stone-warm)
			),
			var(--stone-warm);
		box-shadow:
			0 10px 30px color-mix(in srgb, var(--night-deep) 35%, transparent),
			inset 0 1px 0 color-mix(in srgb, white 6%, transparent);
		transition:
			border-color 0.18s ease,
			box-shadow 0.18s ease,
			transform 0.18s ease;
	}

	.header-search.is-focused .search-field {
		border-color: color-mix(in srgb, var(--lamp-glow) 58%, var(--glass-border));
		box-shadow:
			0 14px 34px color-mix(in srgb, var(--lamp-glow) 14%, transparent),
			0 0 0 4px color-mix(in srgb, var(--lamp-glow) 12%, transparent);
		transform: translateY(-1px);
	}

	.search-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.75rem;
		color: color-mix(in srgb, var(--ink-mid) 92%, var(--lamp-glow));
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
		color: var(--ink-bright);
		font-size: max(16px, 0.98rem);
		line-height: 1.2;
		appearance: none;
		-webkit-appearance: none;
	}

	/* The global input[type='search'] rules in scss/index.scss add a background,
	   border-radius, and an amber focus glow to the inner input, which renders as
	   a boxed shadow inside the pill. Higher-specificity reset so only the pill
	   (.search-field) carries the visual treatment. */
	.search-field input,
	.search-field input:focus {
		background: transparent;
		border: 0;
		border-radius: 0;
		box-shadow: none;
	}

	/* Kill native search-field chrome (inner border/shadow + built-in clear button)
	   so only our custom icon and clear button render. */
	input::-webkit-search-decoration,
	input::-webkit-search-cancel-button,
	input::-webkit-search-results-button,
	input::-webkit-search-results-decoration {
		-webkit-appearance: none;
		display: none;
	}

	input::placeholder {
		color: color-mix(in srgb, var(--ink-mid) 80%, transparent);
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
		border: 2px solid color-mix(in srgb, var(--ink-mid) 25%, transparent);
		border-top-color: var(--lamp-glow);
		animation: header-search-spin 0.8s linear infinite;
	}

	.clear-button {
		border: 0;
		background: transparent;
		color: var(--ink-mid);
		cursor: pointer;
		font-size: 1.25rem;
		transition:
			background-color 0.18s ease,
			color 0.18s ease;
	}

	.clear-button:hover {
		background: var(--lamp-soft);
		color: var(--lamp-glow);
	}

	.clear-button:focus {
		outline: 2px solid var(--lamp-glow);
		outline-offset: 2px;
	}

	.results-panel {
		position: absolute;
		left: 0;
		right: 0;
		top: calc(100% + 0.65rem);
		z-index: 80;
		overflow: hidden;
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 16%, var(--glass-border));
		border-radius: 1rem;
		background:
			linear-gradient(
				180deg,
				color-mix(in srgb, var(--stone-warm) 96%, transparent),
				var(--stone-warm)
			),
			var(--stone-warm);
		box-shadow:
			0 26px 54px color-mix(in srgb, var(--night-deep) 30%, transparent),
			0 0 0 1px color-mix(in srgb, var(--lamp-glow) 6%, transparent);
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
		background: color-mix(in srgb, var(--lamp-soft) 82%, transparent);
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
		background: color-mix(in srgb, var(--lamp-glow) 10%, transparent);
		color: color-mix(in srgb, var(--lamp-glow) 86%, var(--ink-mid));
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.result-title {
		color: var(--ink-bright);
		font-size: 0.98rem;
		font-weight: 600;
		line-height: 1.35;
	}

	.result-headline {
		color: var(--ink-mid);
		font-size: 0.84rem;
		line-height: 1.45;
	}

	.result-headline :global(mark) {
		background: color-mix(in srgb, var(--lamp-glow) 42%, transparent);
		color: var(--ink-bright);
		padding: 0 0.12rem;
		border-radius: 0.25rem;
	}

	.results-state,
	.results-footer {
		padding: 0.95rem 1rem;
		font-size: 0.92rem;
		color: var(--ink-mid);
	}

	.state-button:hover,
	.results-footer:hover {
		background: color-mix(in srgb, var(--lamp-soft) 78%, transparent);
		color: var(--lamp-glow);
	}

	.results-footer {
		border-top: 1px solid color-mix(in srgb, var(--glass-border) 85%, transparent);
		font-weight: 600;
	}

	.mobile .search-field {
		min-height: 2.85rem;
	}

	.mobile input {
		font-size: 16px;
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
