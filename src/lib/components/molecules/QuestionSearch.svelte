<!-- src/lib/components/molecules/QuestionSearch.svelte -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let placeholder = 'Search...';
	export let loading = false;
	export let options = [];

	let searchTerm = '';
	let activeIndex = -1;
	let isOpen = false;
	let inputElement;
	let timer;

	const dispatch = createEventDispatcher();

	function handleInput(e) {
		searchTerm = e.target.value;
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

	function handleKeydown(e) {
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

	function selectOption(option) {
		searchTerm = option.text;
		isOpen = false;
		dispatch('selection', option.value);
	}

	function handleClickOutside(e) {
		if (inputElement && !inputElement.contains(e.target)) {
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
		border: 1px solid var(--bg-elevated, var(--bg-elevated));
		border-radius: var(--border-radius, 0.5rem);
		font-size: 1rem;
		background-color: var(--bg-surface, var(--bg-surface));
		color: var(--text-primary, var(--text-primary));

		&:focus {
			outline: none;
			border-color: var(--primary, var(--primary-dark));
			box-shadow: 0 0 0 2px rgba(45, 212, 191, 0.2);
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
		border: 2px solid var(--bg-elevated, var(--bg-elevated));
		border-top-color: var(--primary, var(--primary-dark));
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
		color: var(--text-tertiary, var(--text-tertiary));
		font-size: 1.25rem;

		&:hover {
			color: var(--text-primary, var(--text-primary));
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
		background: var(--bg-surface, var(--bg-surface));
		border: 1px solid var(--bg-elevated, var(--bg-elevated));
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
		color: var(--text-primary, var(--text-primary));

		&:hover {
			background-color: var(--bg-elevated, var(--bg-elevated));
		}
	}

	.result-item.active .result-button {
		background-color: var(--bg-elevated, var(--bg-elevated));
	}

	.no-results {
		padding: 0.75rem 1rem;
		color: var(--text-tertiary, var(--text-tertiary));
		background: var(--bg-surface, var(--bg-surface));
		border: 1px solid var(--bg-elevated, var(--bg-elevated));
		border-radius: var(--border-radius, 0.5rem);
		margin-top: 0.25rem;
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.3),
			0 2px 4px -1px rgba(0, 0, 0, 0.2);
	}
</style>
