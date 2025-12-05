<!-- src/routes/admin/search/typeahead/+page.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { navigating } from '$app/stores';

	interface TypeaheadResult {
		id: number;
		source: 'content' | 'famous_people';
		title: string;
		slug: string;
		url: string;
		enneagram: number | null;
		category: string | null;
		headline: string;
		rank: number;
	}

	let query = '';
	let results: TypeaheadResult[] = [];
	let isLoading = false;
	let selectedIndex = -1;
	let showResults = false;
	let inputElement: HTMLInputElement;
	let navigatingToId: number | null = null;

	let debounceTimer: ReturnType<typeof setTimeout>;

	// Watch for navigation completion to reset state
	$: if (!$navigating && navigatingToId !== null) {
		navigatingToId = null;
	}

	/**
	 * Clean up and render text snippets for display
	 * Preserves <mark> highlight tags while stripping other HTML and rendering basic markdown
	 */
	function renderMarkdown(text: string): string {
		if (!text) return '';

		// Step 1: Extract and preserve <mark> tags with unique tokens
		const markMatches: string[] = [];
		let processed = text.replace(/<mark>([\s\S]*?)<\/mark>/gi, (_, content) => {
			const token = `\u0000MARK${markMatches.length}\u0000`;
			markMatches.push(content);
			return token;
		});

		// Step 2: Strip all other HTML tags (from markdown source)
		processed = processed.replace(/<[^>]+>/g, ' ');

		// Step 3: Clean up whitespace
		processed = processed.replace(/\s+/g, ' ').trim();

		// Step 4: Escape HTML entities for safety
		processed = processed.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

		// Step 5: Convert basic markdown to HTML
		processed = processed
			// Bold: **text**
			.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
			// Italic: *text* (not ** which is bold)
			.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>')
			// Inline code: `code`
			.replace(/`([^`]+)`/g, '<code>$1</code>')
			// Links: [text](url) - just show the text
			.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

		// Step 6: Restore <mark> tags
		markMatches.forEach((content, index) => {
			const token = `\u0000MARK${index}\u0000`;
			// Also escape the content inside mark tags
			const safeContent = content
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;');
			processed = processed.replace(token, `<mark>${safeContent}</mark>`);
		});

		return processed;
	}

	async function search() {
		if (query.length < 2) {
			results = [];
			showResults = false;
			return;
		}

		isLoading = true;

		try {
			const response = await fetch(`/api/blog/typeahead?q=${encodeURIComponent(query)}`);
			const data = await response.json();
			results = data.results || [];
			showResults = results.length > 0;
			selectedIndex = -1;
		} catch (err) {
			console.error('Search error:', err);
			results = [];
		} finally {
			isLoading = false;
		}
	}

	function debounceSearch() {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(search, 150);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!showResults) return;

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				selectedIndex = Math.min(selectedIndex + 1, results.length - 1);
				break;
			case 'ArrowUp':
				e.preventDefault();
				selectedIndex = Math.max(selectedIndex - 1, -1);
				break;
			case 'Enter':
				e.preventDefault();
				if (selectedIndex >= 0 && results[selectedIndex]) {
					navigateToResult(results[selectedIndex]);
				}
				break;
			case 'Escape':
				showResults = false;
				selectedIndex = -1;
				break;
		}
	}

	async function navigateToResult(result: TypeaheadResult) {
		navigatingToId = result.id;
		showResults = false;
		await goto(result.url);
	}

	function handleFocus() {
		if (results.length > 0) {
			showResults = true;
		}
	}

	function handleBlur(e: FocusEvent) {
		// Delay hiding to allow click events on results
		setTimeout(() => {
			if (!navigatingToId) {
				showResults = false;
			}
		}, 200);
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

	function getSourceIcon(source: string): string {
		return source === 'famous_people' ? '👤' : '📄';
	}
</script>

<svelte:head>
	<title>Blog Typeahead Search | Admin</title>
</svelte:head>

<div class="typeahead-container">
	<div class="search-tabs">
		<a href="/admin/search" class="tab">Full Search</a>
		<a href="/admin/search/typeahead" class="tab active">Quick Search</a>
	</div>

	<div class="header">
		<h1>Blog Search</h1>
		<p class="subtitle">Quick search with live results - click to navigate to the blog</p>
	</div>

	<div class="search-wrapper">
		<div class="search-box">
			<svg
				class="search-icon"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<circle cx="11" cy="11" r="8"></circle>
				<path d="M21 21l-4.35-4.35"></path>
			</svg>

			<input
				bind:this={inputElement}
				bind:value={query}
				on:input={debounceSearch}
				on:keydown={handleKeydown}
				on:focus={handleFocus}
				on:blur={handleBlur}
				type="text"
				placeholder="Search blogs, articles, celebrities..."
				class="search-input"
				autocomplete="off"
				spellcheck="false"
			/>

			{#if isLoading}
				<div class="spinner"></div>
			{/if}

			{#if query.length > 0}
				<button
					class="clear-btn"
					on:click={() => {
						query = '';
						results = [];
						showResults = false;
						inputElement?.focus();
					}}
				>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M18 6L6 18M6 6l12 12"></path>
					</svg>
				</button>
			{/if}
		</div>

		{#if showResults || navigatingToId}
			<div class="results-dropdown">
				{#each results as result, index}
					<button
						class="result-item"
						class:selected={selectedIndex === index}
						class:navigating={navigatingToId === result.id}
						on:click={() => navigateToResult(result)}
						on:mouseenter={() => (selectedIndex = index)}
						disabled={navigatingToId !== null}
					>
						<div class="result-left">
							{#if navigatingToId === result.id}
								<div class="nav-spinner"></div>
							{:else}
								<span class="source-icon">{getSourceIcon(result.source)}</span>
							{/if}
							{#if result.enneagram}
								<span
									class="enneagram-dot"
									style="background-color: {getEnneagramColor(result.enneagram)}"
									title="Type {result.enneagram}"
								></span>
							{/if}
						</div>

						<div class="result-content">
							<div class="result-title">{result.title}</div>
							<div class="result-headline">
								{@html renderMarkdown(result.headline)}
							</div>
							<div class="result-meta">
								<span class="source-label">
									{result.source === 'famous_people' ? 'Celebrity' : 'Article'}
								</span>
								{#if result.category}
									<span class="category-label">{result.category}</span>
								{/if}
							</div>
						</div>

						<div class="result-arrow">
							{#if navigatingToId === result.id}
								<span class="loading-text">Loading...</span>
							{:else}
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M9 18l6-6-6-6"></path>
								</svg>
							{/if}
						</div>
					</button>
				{/each}

				{#if results.length === 0 && query.length >= 2 && !isLoading}
					<div class="no-results">
						No results found for "{query}"
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<div class="hints">
		<p>
			<kbd>↑</kbd> <kbd>↓</kbd> to navigate
			<kbd>Enter</kbd> to select
			<kbd>Esc</kbd> to close
		</p>
	</div>
</div>

<style>
	.typeahead-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	.search-tabs {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
	}

	.tab {
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		font-weight: 500;
		text-decoration: none;
		color: #6b7280;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		background: white;
		transition: all 0.2s ease;
	}

	.tab:hover {
		color: #6366f1;
		border-color: #6366f1;
	}

	.tab.active {
		background: #6366f1;
		color: white;
		border-color: #6366f1;
	}

	.header {
		text-align: center;
		margin-bottom: 2rem;
	}

	h1 {
		font-size: 2.5rem;
		font-weight: 700;
		color: #1f2937;
		margin-bottom: 0.5rem;
	}

	.subtitle {
		color: #6b7280;
		font-size: 1rem;
	}

	.search-wrapper {
		position: relative;
	}

	.search-box {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 1.25rem;
		background: white;
		border: 2px solid #e5e7eb;
		border-radius: 16px;
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -2px rgba(0, 0, 0, 0.1);
		transition: all 0.2s ease;
	}

	.search-box:focus-within {
		border-color: #6366f1;
		box-shadow:
			0 4px 6px -1px rgba(99, 102, 241, 0.2),
			0 2px 4px -2px rgba(99, 102, 241, 0.2);
	}

	.search-icon {
		width: 24px;
		height: 24px;
		color: #9ca3af;
		flex-shrink: 0;
	}

	.search-input {
		flex: 1;
		border: none;
		outline: none;
		font-size: 1.125rem;
		color: #1f2937;
		background: transparent;
	}

	.search-input::placeholder {
		color: #9ca3af;
	}

	.spinner {
		width: 20px;
		height: 20px;
		border: 2px solid #e5e7eb;
		border-top-color: #6366f1;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.clear-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		padding: 0;
		border: none;
		background: #f3f4f6;
		border-radius: 50%;
		cursor: pointer;
		color: #6b7280;
		transition: all 0.15s ease;
	}

	.clear-btn:hover {
		background: #e5e7eb;
		color: #374151;
	}

	.clear-btn svg {
		width: 14px;
		height: 14px;
	}

	.results-dropdown {
		position: absolute;
		top: calc(100% + 8px);
		left: 0;
		right: 0;
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		box-shadow:
			0 10px 25px -5px rgba(0, 0, 0, 0.1),
			0 8px 10px -6px rgba(0, 0, 0, 0.1);
		max-height: 480px;
		overflow-y: auto;
		z-index: 50;
	}

	.result-item {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		width: 100%;
		padding: 1rem 1.25rem;
		border: none;
		background: transparent;
		text-align: left;
		cursor: pointer;
		border-bottom: 1px solid #f3f4f6;
		transition: background-color 0.1s ease;
	}

	.result-item:last-child {
		border-bottom: none;
	}

	.result-item:hover,
	.result-item.selected {
		background: #f9fafb;
	}

	.result-item.selected {
		background: #eef2ff;
	}

	.result-left {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding-top: 2px;
	}

	.source-icon {
		font-size: 1.25rem;
	}

	.enneagram-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
	}

	.result-content {
		flex: 1;
		min-width: 0;
	}

	.result-title {
		font-weight: 600;
		font-size: 1rem;
		color: #1f2937;
		margin-bottom: 0.25rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.result-headline {
		font-size: 0.875rem;
		color: #6b7280;
		line-height: 1.5;
		margin-bottom: 0.5rem;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.result-headline :global(mark) {
		background: #fef08a;
		color: #1f2937;
		padding: 0 2px;
		border-radius: 2px;
		font-weight: 500;
	}

	/* Markdown styling in headlines */
	.result-headline :global(strong) {
		font-weight: 600;
		color: #374151;
	}

	.result-headline :global(em) {
		font-style: italic;
	}

	.result-headline :global(code) {
		background: #f3f4f6;
		padding: 0.125rem 0.25rem;
		border-radius: 3px;
		font-family: ui-monospace, monospace;
		font-size: 0.8em;
	}

	.result-headline :global(.md-link) {
		color: #6366f1;
		text-decoration: underline;
	}

	.result-meta {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.source-label,
	.category-label {
		font-size: 0.75rem;
		padding: 0.125rem 0.5rem;
		border-radius: 4px;
	}

	.source-label {
		background: #dbeafe;
		color: #1e40af;
	}

	.category-label {
		background: #f3e8ff;
		color: #7c3aed;
	}

	.result-arrow {
		display: flex;
		align-items: center;
		padding-top: 2px;
		color: #9ca3af;
	}

	.result-arrow svg {
		width: 20px;
		height: 20px;
	}

	.result-item:hover .result-arrow,
	.result-item.selected .result-arrow {
		color: #6366f1;
	}

	/* Navigation loading state */
	.result-item.navigating {
		background: #eef2ff;
		pointer-events: none;
	}

	.result-item:disabled {
		opacity: 0.6;
		cursor: wait;
	}

	.result-item.navigating:not(:disabled) {
		opacity: 1;
	}

	.nav-spinner {
		width: 20px;
		height: 20px;
		border: 2px solid #e5e7eb;
		border-top-color: #6366f1;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	.loading-text {
		font-size: 0.75rem;
		color: #6366f1;
		font-weight: 500;
		animation: pulse 1s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	.no-results {
		padding: 2rem;
		text-align: center;
		color: #6b7280;
	}

	.hints {
		margin-top: 1.5rem;
		text-align: center;
		color: #9ca3af;
		font-size: 0.875rem;
	}

	.hints kbd {
		display: inline-block;
		padding: 0.125rem 0.375rem;
		font-size: 0.75rem;
		font-family: inherit;
		background: #f3f4f6;
		border: 1px solid #d1d5db;
		border-radius: 4px;
		margin: 0 0.125rem;
	}

	/* Scrollbar styling */
	.results-dropdown::-webkit-scrollbar {
		width: 8px;
	}

	.results-dropdown::-webkit-scrollbar-track {
		background: #f3f4f6;
		border-radius: 0 12px 12px 0;
	}

	.results-dropdown::-webkit-scrollbar-thumb {
		background: #d1d5db;
		border-radius: 4px;
	}

	.results-dropdown::-webkit-scrollbar-thumb:hover {
		background: #9ca3af;
	}
</style>
