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
		color: var(--text-secondary);
		border: 1px solid var(--void-elevated);
		border-radius: 8px;
		background: var(--void-surface);
		transition: all 0.15s ease;

		&:hover {
			color: var(--shadow-monarch);
			border-color: var(--shadow-monarch);
		}

		&.active {
			background: var(--shadow-monarch);
			color: white;
			border-color: var(--shadow-monarch);
		}
	}

	.header {
		text-align: center;
		margin-bottom: 1.5rem;

		h1 {
			font-size: 2rem;
			font-weight: 700;
			color: var(--text-primary);
			margin-bottom: 0.5rem;
		}
	}

	.subtitle {
		color: var(--text-secondary);
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
		background: var(--void-surface);
		border: 2px solid var(--void-elevated);
		border-radius: 12px;
		transition: all 0.15s ease;

		&:focus-within {
			border-color: var(--shadow-monarch);
			box-shadow: var(--glow-sm);
		}
	}

	.search-icon {
		width: 22px;
		height: 22px;
		color: var(--text-secondary);
		flex-shrink: 0;
	}

	.search-input {
		flex: 1;
		border: none;
		outline: none;
		font-size: 1rem;
		color: var(--text-primary);
		background: transparent;

		&::placeholder {
			color: var(--text-secondary);
		}
	}

	.spinner {
		width: 20px;
		height: 20px;
		border: 2px solid var(--void-elevated);
		border-top-color: var(--shadow-monarch);
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
		background: var(--void-elevated);
		border-radius: 50%;
		cursor: pointer;
		color: var(--text-secondary);
		transition: all 0.15s ease;

		&:hover {
			background: var(--void-deep);
			color: var(--text-primary);
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
		background: var(--void-surface);
		border: 1px solid var(--void-elevated);
		border-radius: 12px;
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
		border-bottom: 1px solid var(--void-deep);
		transition: background-color 0.1s ease;
		font-family: inherit;
		color: inherit;

		&:last-child {
			border-bottom: none;
		}

		&:hover,
		&.selected {
			background: var(--void-deep);
		}

		&.selected {
			background: var(--void-elevated);
		}

		&.navigating {
			background: var(--void-elevated);
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
		color: var(--text-primary);
		margin-bottom: 0.25rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.result-headline {
		font-size: 0.8rem;
		color: var(--text-secondary);
		line-height: 1.5;
		margin-bottom: 0.375rem;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;

		:global(mark) {
			background: rgba(245, 158, 11, 0.3);
			color: var(--text-primary);
			padding: 0 2px;
			border-radius: 2px;
			font-weight: 500;
		}

		:global(strong) {
			font-weight: 600;
			color: var(--text-primary);
		}

		:global(em) {
			font-style: italic;
		}

		:global(code) {
			background: var(--void-elevated);
			padding: 0.125rem 0.25rem;
			border-radius: 3px;
			font-family: var(--font-mono);
			font-size: 0.8em;
		}

		:global(.md-link) {
			color: var(--shadow-monarch);
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
		background: rgba(59, 130, 246, 0.12);
		color: #3b82f6;
	}

	.category-label {
		background: rgba(139, 92, 246, 0.1);
		color: #8b5cf6;
	}

	.result-arrow {
		display: flex;
		align-items: center;
		padding-top: 2px;
		color: var(--text-secondary);

		svg {
			width: 20px;
			height: 20px;
		}
	}

	.result-item:hover .result-arrow,
	.result-item.selected .result-arrow {
		color: var(--shadow-monarch);
	}

	.nav-spinner {
		width: 20px;
		height: 20px;
		border: 2px solid var(--void-elevated);
		border-top-color: var(--shadow-monarch);
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	.loading-text {
		font-size: 0.7rem;
		color: var(--shadow-monarch);
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
		color: var(--text-secondary);
		font-size: 0.875rem;
	}

	.hints {
		margin-top: 1.25rem;
		text-align: center;
		color: var(--text-secondary);
		font-size: 0.8rem;

		kbd {
			display: inline-block;
			padding: 0.125rem 0.375rem;
			font-size: 0.7rem;
			font-family: inherit;
			background: var(--void-elevated);
			border: 1px solid var(--void-deep);
			border-radius: 4px;
			margin: 0 0.125rem;
			color: var(--text-primary);
		}
	}

	.results-dropdown::-webkit-scrollbar {
		width: 8px;
	}

	.results-dropdown::-webkit-scrollbar-track {
		background: var(--void-deep);
		border-radius: 0 12px 12px 0;
	}

	.results-dropdown::-webkit-scrollbar-thumb {
		background: var(--void-elevated);
		border-radius: 4px;

		&:hover {
			background: var(--text-secondary);
		}
	}
</style>
