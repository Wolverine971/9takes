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

	let query = $state('');
	let results = $state<TypeaheadResult[]>([]);
	let isLoading = $state(false);
	let selectedIndex = $state(-1);
	let showResults = $state(false);
	let inputElement = $state<HTMLInputElement | null>(null);
	let navigatingToId = $state<number | null>(null);

	let debounceTimer: ReturnType<typeof setTimeout>;

	$effect(() => {
		if (!$navigating && navigatingToId !== null) {
			navigatingToId = null;
		}
	});

	function renderMarkdown(text: string): string {
		if (!text) return '';

		const markMatches: string[] = [];
		let processed = text.replace(/<mark>([\s\S]*?)<\/mark>/gi, (_, content) => {
			const token = `\u0000MARK${markMatches.length}\u0000`;
			markMatches.push(content);
			return token;
		});

		processed = processed.replace(/<[^>]+>/g, ' ');
		processed = processed.replace(/\s+/g, ' ').trim();
		processed = processed.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

		processed = processed
			.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
			.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>')
			.replace(/`([^`]+)`/g, '<code>$1</code>')
			.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

		markMatches.forEach((content, index) => {
			const token = `\u0000MARK${index}\u0000`;
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

	function handleBlur() {
		setTimeout(() => {
			if (!navigatingToId) {
				showResults = false;
			}
		}, 200);
	}

	function getEnneagramColor(type: number | null): string {
		const colors: Record<number, string> = {
			1: 'var(--type-1-color)',
			2: 'var(--type-2-color)',
			3: 'var(--type-3-color)',
			4: 'var(--type-4-color)',
			5: 'var(--type-5-color)',
			6: 'var(--type-6-color)',
			7: 'var(--type-7-color)',
			8: 'var(--type-8-color)',
			9: 'var(--type-9-color)'
		};
		return type ? colors[type] || 'var(--ink-dim)' : 'var(--ink-dim)';
	}

	function getSourceIcon(source: string): string {
		return source === 'famous_people' ? '👤' : '📄';
	}
</script>

<svelte:head>
	<title>Blog Typeahead Search | Admin</title>
</svelte:head>

<div class="typeahead-page">
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
				oninput={debounceSearch}
				onkeydown={handleKeydown}
				onfocus={handleFocus}
				onblur={handleBlur}
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
					aria-label="Clear search"
					onclick={() => {
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
						onclick={() => navigateToResult(result)}
						onmouseenter={() => (selectedIndex = index)}
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

<style lang="scss">
	.typeahead-page {
		max-width: 800px;
		margin: 0 auto;
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
		color: var(--ink-mid);
		border: 1px solid var(--stone-warm);
		border-radius: 0.625rem;
		background: var(--stone-warm);
		transition: all 0.15s ease;

		&:hover {
			color: var(--lamp-glow);
			border-color: var(--lamp-glow);
		}

		&.active {
			background: var(--lamp-glow);
			color: white;
			border-color: var(--lamp-glow);
		}
	}

	.header {
		text-align: center;
		margin-bottom: 1.5rem;

		h1 {
			font-size: 2rem;
			font-weight: 700;
			color: var(--ink-bright);
			margin-bottom: 0.5rem;
		}
	}

	.subtitle {
		color: var(--ink-mid);
		font-size: 0.9rem;
	}

	.search-wrapper {
		position: relative;
	}

	.search-box {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.875rem 1rem;
		background: var(--stone-warm);
		border: 2px solid var(--stone-warm);
		border-radius: 0.625rem;
		transition: all 0.15s ease;

		&:focus-within {
			border-color: var(--lamp-glow);
			box-shadow: var(--glow-sm);
		}
	}

	.search-icon {
		width: 22px;
		height: 22px;
		color: var(--ink-mid);
		flex-shrink: 0;
	}

	.search-input {
		flex: 1;
		border: none;
		outline: none;
		font-size: 1rem;
		color: var(--ink-bright);
		background: transparent;

		&::placeholder {
			color: var(--ink-mid);
		}
	}

	.spinner {
		width: 20px;
		height: 20px;
		border: 2px solid var(--stone-warm);
		border-top-color: var(--lamp-glow);
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
		background: var(--stone-warm);
		border-radius: 50%;
		cursor: pointer;
		color: var(--ink-mid);
		transition: all 0.15s ease;

		&:hover {
			background: var(--night-deep);
			color: var(--ink-bright);
		}

		svg {
			width: 14px;
			height: 14px;
		}
	}

	.results-dropdown {
		position: absolute;
		top: calc(100% + 8px);
		left: 0;
		right: 0;
		background: var(--stone-warm);
		border: 1px solid var(--stone-warm);
		border-radius: 0.625rem;
		box-shadow: var(--glow-md);
		max-height: 480px;
		overflow-y: auto;
		z-index: 50;
	}

	.result-item {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		width: 100%;
		padding: 0.875rem 1rem;
		border: none;
		background: transparent;
		text-align: left;
		cursor: pointer;
		border-bottom: 1px solid var(--night-deep);
		transition: background-color 0.1s ease;
		font-family: inherit;
		color: inherit;

		&:last-child {
			border-bottom: none;
		}

		&:hover,
		&.selected {
			background: var(--night-deep);
		}

		&.selected {
			background: var(--stone-warm);
		}

		&.navigating {
			background: var(--stone-warm);
			pointer-events: none;
		}

		&:disabled {
			opacity: 0.6;
			cursor: wait;
		}

		&.navigating:not(:disabled) {
			opacity: 1;
		}
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
		font-size: 0.95rem;
		color: var(--ink-bright);
		margin-bottom: 0.25rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.result-headline {
		font-size: 0.8rem;
		color: var(--ink-mid);
		line-height: 1.5;
		margin-bottom: 0.375rem;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;

		:global(mark) {
			background: rgba(245, 158, 11, 0.3);
			color: var(--ink-bright);
			padding: 0 2px;
			border-radius: 0.25rem;
			font-weight: 500;
		}

		:global(strong) {
			font-weight: 600;
			color: var(--ink-bright);
		}

		:global(em) {
			font-style: italic;
		}

		:global(code) {
			background: var(--stone-warm);
			padding: 0.125rem 0.25rem;
			border-radius: 0.25rem;
			font-family: var(--font-mono);
			font-size: 0.8em;
		}

		:global(.md-link) {
			color: var(--lamp-glow);
			text-decoration: underline;
		}
	}

	.result-meta {
		display: flex;
		gap: 0.375rem;
		flex-wrap: wrap;
	}

	.source-label,
	.category-label {
		font-size: 0.7rem;
		padding: 0.125rem 0.5rem;
		border-radius: 4px;
	}

	.source-label {
		background: color-mix(in srgb, var(--data-teal) 14%, transparent);
		color: var(--data-cyan);
	}

	.category-label {
		background: rgba(139, 92, 246, 0.1);
		color: var(--lamp-glow);
	}

	.result-arrow {
		display: flex;
		align-items: center;
		padding-top: 2px;
		color: var(--ink-mid);

		svg {
			width: 20px;
			height: 20px;
		}
	}

	.result-item:hover .result-arrow,
	.result-item.selected .result-arrow {
		color: var(--lamp-glow);
	}

	.nav-spinner {
		width: 20px;
		height: 20px;
		border: 2px solid var(--stone-warm);
		border-top-color: var(--lamp-glow);
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	.loading-text {
		font-size: 0.7rem;
		color: var(--lamp-glow);
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
		padding: 1.5rem;
		text-align: center;
		color: var(--ink-mid);
		font-size: 0.875rem;
	}

	.hints {
		margin-top: 1.25rem;
		text-align: center;
		color: var(--ink-mid);
		font-size: 0.8rem;

		kbd {
			display: inline-block;
			padding: 0.125rem 0.375rem;
			font-size: 0.7rem;
			font-family: inherit;
			background: var(--stone-warm);
			border: 1px solid var(--night-deep);
			border-radius: 4px;
			margin: 0 0.125rem;
			color: var(--ink-bright);
		}
	}

	.results-dropdown::-webkit-scrollbar {
		width: 8px;
	}

	.results-dropdown::-webkit-scrollbar-track {
		background: var(--night-deep);
		border-radius: 0 0.625rem 0.625rem 0;
	}

	.results-dropdown::-webkit-scrollbar-thumb {
		background: var(--stone-warm);
		border-radius: 4px;

		&:hover {
			background: var(--ink-mid);
		}
	}
</style>
