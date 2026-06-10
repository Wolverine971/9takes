<!-- src/lib/components/molecules/QuestionSearch.svelte -->
<script lang="ts" context="module">
	export interface QuestionSearchValue {
		id: number;
		url: string;
		question: string;
		comment_count: number;
		question_formatted?: string;
		created_at?: string;
	}

	export interface QuestionSearchOption {
		text: string;
		value: QuestionSearchValue;
	}
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let placeholder = 'Search...';
	export let loading = false;
	export let options: QuestionSearchOption[] = [];

	let searchTerm = '';
	let activeIndex = -1;
	let isOpen = false;
	let inputElement: HTMLDivElement;
	let timer: ReturnType<typeof setTimeout> | undefined;

	const dispatch = createEventDispatcher<{
		search: { text: string };
		selection: QuestionSearchValue;
	}>();

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement | null;
		searchTerm = target?.value ?? '';
		if (searchTerm.length > 1) {
			isOpen = true;
			clearTimeout(timer);
			timer = setTimeout(() => {
				dispatch('search', { text: searchTerm });
			}, 300);
		} else {
			isOpen = false;
		}
		activeIndex = -1;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!isOpen) return;

		// Down arrow
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			activeIndex = (activeIndex + 1) % options.length;
		}
		// Up arrow
		else if (e.key === 'ArrowUp') {
			e.preventDefault();
			activeIndex = activeIndex <= 0 ? options.length - 1 : activeIndex - 1;
		}
		// Enter
		else if (e.key === 'Enter' && activeIndex >= 0) {
			e.preventDefault();
			selectOption(options[activeIndex]);
		}
		// Escape
		else if (e.key === 'Escape') {
			isOpen = false;
		}
	}

	function selectOption(option: QuestionSearchOption) {
		searchTerm = option.text;
		isOpen = false;
		dispatch('selection', option.value);
	}

	function handleClickOutside(e: MouseEvent) {
		if (inputElement && e.target instanceof Node && !inputElement.contains(e.target)) {
			isOpen = false;
		}
	}
</script>

<svelte:window on:click={handleClickOutside} />

<div class="search-container" bind:this={inputElement}>
	<div class="input-wrapper">
		<input
			type="text"
			bind:value={searchTerm}
			on:input={handleInput}
			on:keydown={handleKeydown}
			on:focus={() => searchTerm && searchTerm.length > 1 && (isOpen = true)}
			{placeholder}
			class="search-input"
		/>

		{#if loading}
			<div class="loading-indicator">
				<span class="loading-spinner"></span>
			</div>
		{:else if searchTerm}
			<button
				type="button"
				class="clear-button"
				on:click={() => {
					searchTerm = '';
					isOpen = false;
				}}
				aria-label="Clear search"
			>
				×
			</button>
		{/if}
	</div>

	{#if isOpen && options.length > 0}
		<ul class="results-list">
			{#each options as option, i}
				<li class="result-item" class:active={i === activeIndex}>
					<button type="button" class="result-button" on:click={() => selectOption(option)}>
						{option.text}
					</button>
				</li>
			{/each}
		</ul>
	{:else if isOpen && searchTerm && searchTerm.length > 1 && !loading && options.length === 0}
		<div class="no-results">No results found</div>
	{/if}
</div>

<style lang="scss">
	.search-container {
		position: relative;
		width: 100%;
	}

	.input-wrapper {
		position: relative;
		display: flex;
		align-items: center;
	}

	.search-input {
		width: 100%;
		padding: 0.75rem 1rem;
		border: 1px solid var(--stone-warm, var(--stone-warm));
		border-radius: var(--border-radius, 0.5rem);
		font-size: 1rem;
		background-color: var(--stone-warm, var(--stone-warm));
		color: var(--ink-bright, var(--ink-bright));

		&:focus {
			outline: none;
			border-color: var(--lamp-glow, var(--lamp-glow));
			box-shadow: 0 0 0 2px color-mix(in srgb, var(--lamp-glow) 20%, transparent);
		}
	}

	.loading-indicator,
	.clear-button {
		position: absolute;
		right: 0.75rem;
	}

	.loading-spinner {
		display: inline-block;
		width: 1rem;
		height: 1rem;
		border: 2px solid var(--stone-warm, var(--stone-warm));
		border-top-color: var(--lamp-glow, var(--lamp-glow));
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.clear-button {
		background: none;
		border: none;
		cursor: pointer;
		color: var(--ink-dim);
		font-size: 1.25rem;

		&:hover {
			color: var(--ink-bright, var(--ink-bright));
		}
	}

	.results-list {
		position: absolute;
		z-index: 10;
		top: 100%;
		left: 0;
		right: 0;
		max-height: 300px;
		overflow-y: auto;
		background: var(--stone-warm, var(--stone-warm));
		border: 1px solid var(--stone-warm, var(--stone-warm));
		border-radius: var(--border-radius, 0.5rem);
		margin-top: 0.25rem;
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.3),
			0 2px 4px -1px rgba(0, 0, 0, 0.2);
		padding: 0;
		list-style-type: none;
	}

	.result-item {
	}

	.result-button {
		display: block;
		width: 100%;
		padding: 0.75rem 1rem;
		background: none;
		border: none;
		text-align: left;
		cursor: pointer;
		color: var(--ink-bright, var(--ink-bright));

		&:hover {
			background-color: var(--stone-warm, var(--stone-warm));
		}
	}

	.result-item.active .result-button {
		background-color: var(--stone-warm, var(--stone-warm));
	}

	.no-results {
		padding: 0.75rem 1rem;
		color: var(--ink-dim);
		background: var(--stone-warm, var(--stone-warm));
		border: 1px solid var(--stone-warm, var(--stone-warm));
		border-radius: var(--border-radius, 0.5rem);
		margin-top: 0.25rem;
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.3),
			0 2px 4px -1px rgba(0, 0, 0, 0.2);
	}
</style>
