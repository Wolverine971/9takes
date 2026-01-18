<!-- src/lib/components/molecules/ComboBox.svelte -->
<script>
	import { createEventDispatcher } from 'svelte';
	import { onClickOutside } from '$lib/components/molecules/Context.svelte';
	import { tick } from 'svelte';

	const dispatch = createEventDispatcher();

	// Props with defaults
	export let disabled = false;
	export let error = undefined;
	export let id = crypto.randomUUID();
	export let label = '';
	export let loading = false;
	export let name;
	export let options = [];
	export let placeholder = undefined;
	export let readonly = false;
	export let required = false;
	export let value = '';

	// Custom filter function
	export let filter = (text) => {
		if (!text) return options;
		const sanitized = text.trim().toLowerCase();
		return options.reduce((acc, option) => {
			if (option.options) {
				const filteredOptions = option.options.filter((o) =>
					o.text.toLowerCase().includes(sanitized)
				);
				if (filteredOptions.length) acc.push({ ...option, options: filteredOptions });
			} else if (option.text.toLowerCase().includes(sanitized)) {
				acc.push(option);
			}
			return acc;
		}, []);
	};

	// Component state
	let listElement;
	let inputElement;
	let list = [];
	let isListOpen = false;
	let selectedOption;
	let activeIndex = -1;
	let debounceTimer;
	let cachedResults = new Map();

	// Handle options changes
	$: if (options?.length) {
		const val = inputElement?.value;
		showList(val);
	}

	// Handle keyboard navigation and input events
	async function handleInputEvent(event) {
		const { type, key } = event;

		if (type === 'keyup') {
			if (['Escape', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Enter', 'Tab', 'Shift'].includes(key)) {
				return;
			}

			if (key === 'ArrowDown') {
				event.preventDefault();
				await showList(event.target.value);
				const firstOption = listElement?.querySelector(
					`[role="option"]:not([aria-disabled="true"])`
				);
				if (firstOption) {
					firstOption.focus();
					activeIndex = 0;
				}
				return;
			}

			// Debounce input change to avoid excessive filtering
			clearTimeout(debounceTimer);
			debounceTimer = setTimeout(() => {
				dispatch('inputChange', { text: event.target.value });
				showList(event.target.value);
			}, 150);
		} else if (type === 'keydown') {
			if (key === 'Escape') {
				hideList();
			} else if (key === 'Enter') {
				event.preventDefault();
				loading = true;
				dispatch('selectQuestion', { text: event.target.value });
			} else if (key === 'Tab') {
				hideList();
			}
		}
	}

	// Handle option click
	function handleOptionClick(event) {
		if (!event.target.closest(`[role="option"]:not([aria-disabled="true"])`)) return;
		selectOption(event.target.closest(`[role="option"]`));
		hideList();
	}

	// Handle keyboard navigation in list
	function handleListKeyDown(event) {
		const { key } = event;
		const options = Array.from(
			listElement.querySelectorAll(`[role="option"]:not([aria-disabled="true"])`)
		);

		if (options.length === 0) return;

		if (key === 'ArrowUp' || key === 'ArrowDown') {
			event.preventDefault();

			// Calculate new index
			let newIndex = activeIndex;
			if (key === 'ArrowUp') {
				newIndex = activeIndex <= 0 ? options.length - 1 : activeIndex - 1;
			} else {
				newIndex = activeIndex >= options.length - 1 ? 0 : activeIndex + 1;
			}

			// Update active option
			activeIndex = newIndex;
			options[newIndex].focus();
		} else if (key === 'Enter') {
			event.preventDefault();
			if (document.activeElement.matches(`[role="option"]`)) {
				selectOption(document.activeElement);
				hideList();
			}
		} else if (key === 'Escape') {
			event.preventDefault();
			hideList();
		} else if (key === 'Tab') {
			hideList();
		} else if (key === 'Home') {
			event.preventDefault();
			if (options.length > 0) {
				activeIndex = 0;
				options[0].focus();
			}
		} else if (key === 'End') {
			event.preventDefault();
			if (options.length > 0) {
				activeIndex = options.length - 1;
				options[options.length - 1].focus();
			}
		} else {
			inputElement.focus();
		}
	}

	// Deduplicate options based on value
	function deduplicateOptions(optionsList) {
		const seen = new Set();
		const deduped = [];

		for (const option of optionsList) {
			if (option.options) {
				// Handle grouped options
				const dedupedSubOptions = [];
				const subSeen = new Set();

				for (const subOption of option.options) {
					const key = subOption.value || subOption.text;
					if (!subSeen.has(key)) {
						subSeen.add(key);
						dedupedSubOptions.push(subOption);
					}
				}

				if (dedupedSubOptions.length > 0) {
					deduped.push({ ...option, options: dedupedSubOptions });
				}
			} else {
				// Handle regular options
				const key = option.value || option.text;
				if (!seen.has(key)) {
					seen.add(key);
					deduped.push(option);
				}
			}
		}

		return deduped;
	}

	// Show dropdown list with filtered options
	async function showList(inputValue) {
		// Check cache first
		const cacheKey = inputValue || '';
		if (cachedResults.has(cacheKey)) {
			list = cachedResults.get(cacheKey);
		} else {
			const filteredList = inputValue === '' ? options : await filter(inputValue);
			list = deduplicateOptions(filteredList);
			cachedResults.set(cacheKey, list);

			// Limit cache size to prevent memory issues
			if (cachedResults.size > 50) {
				const firstKey = cachedResults.keys().next().value;
				cachedResults.delete(firstKey);
			}
		}

		isListOpen = true;
		activeIndex = -1;

		// Ensure DOM is updated before attempting to focus
		await tick();
	}

	// Hide dropdown list
	function hideList() {
		if (!isListOpen) return;
		if (selectedOption) {
			inputElement.value = selectedOption.text;
		}
		isListOpen = false;
		activeIndex = -1;
		inputElement.focus();
	}

	// Select an option
	function selectOption(optionElement) {
		loading = true;
		const searchText = optionElement.dataset.text;
		const selection = options.find((o) => o.text === searchText);
		if (selection) {
			value = selection.value;
			selectedOption = selection;
			inputElement.value = selection.text;
			dispatch('selection', value);
		}
	}
</script>

<div class="combobox" class:error class:disabled>
	{#if label}
		<label class="combobox__label" for={id}>
			{label}
			{#if error}
				<span class="combobox__error" aria-live="polite">{error}</span>
			{/if}
		</label>
	{/if}

	<div class="combobox__input-container" use:onClickOutside={hideList}>
		<slot name="icon-start" />

		<input
			bind:this={inputElement}
			on:focus
			on:blur
			on:input
			on:keyup={handleInputEvent}
			on:keydown={handleInputEvent}
			on:mousedown={() => showList(inputElement?.value || '')}
			class="combobox__input"
			class:loading
			{id}
			{name}
			type="text"
			{disabled}
			{readonly}
			{placeholder}
			{required}
			autocapitalize="none"
			autocomplete="off"
			spellcheck="false"
			role="combobox"
			aria-autocomplete="list"
			aria-expanded={isListOpen}
			aria-controls="combobox-list-{id}"
			aria-describedby={error ? `${id}-error` : undefined}
		/>

		{#if loading}
			<div class="combobox__loading-indicator" aria-hidden="true"></div>
		{/if}

		{#if isListOpen}
			<ul
				id="combobox-list-{id}"
				class="combobox__list"
				role="listbox"
				aria-label={label || 'Options'}
				on:click={handleOptionClick}
				on:keydown={handleListKeyDown}
				bind:this={listElement}
				tabindex="-1"
			>
				{#each list as option, i (`${option?.value || option?.text || ''}_${i}`)}
					{#if option.options}
						<li class="combobox__group-heading" role="presentation">
							<slot name="group" {option}>
								{option.text}
							</slot>
						</li>
						{#each option.options as subOption, j (`${option?.text || i}_${subOption?.value || subOption?.text || ''}_${j}`)}
							<li
								class="combobox__option"
								class:disabled={subOption.disabled}
								class:selected={value === subOption.value}
								role="option"
								tabindex={subOption.disabled ? undefined : '-1'}
								data-text={subOption.text}
								data-value={subOption.value}
								aria-selected={value === subOption.value}
								aria-disabled={subOption.disabled}
							>
								<slot name="option" option={subOption}>
									{subOption.text}
								</slot>
								{#if subOption.value === value}
									<svg
										class="combobox__check-icon"
										viewBox="0 0 24 24"
										aria-hidden="true"
										focusable="false"
									>
										<polyline points="20 6 9 17 4 12" />
									</svg>
								{/if}
							</li>
						{/each}
					{:else}
						<li
							class="combobox__option"
							class:disabled={option.disabled}
							class:selected={value === option.value}
							role="option"
							tabindex={option.disabled ? undefined : '-1'}
							data-text={option.text}
							data-value={option.value}
							aria-selected={value === option.value}
							aria-disabled={option.disabled}
						>
							<slot name="option" {option}>
								{option.text}
							</slot>
							{#if option.value === value}
								<svg
									class="combobox__check-icon"
									viewBox="0 0 24 24"
									aria-hidden="true"
									focusable="false"
								>
									<polyline points="20 6 9 17 4 12" />
								</svg>
							{/if}
						</li>
					{/if}
				{:else}
					<li class="combobox__no-results" role="alert">No results available</li>
				{/each}
			</ul>
		{/if}

		<div class="visually-hidden" role="status" aria-live="polite">
			{list.length} results available.
		</div>

		{#if error}
			<div id="{id}-error" class="visually-hidden">{error}</div>
		{/if}
	</div>
</div>

<style lang="scss">
	// Core variables
	$base-spacing: 0.25rem;
	$font-size-base: 1rem;
	$transition-duration: 0.2s;
	$border-radius: 0.375rem;
	$breakpoint-sm: 576px;

	// Colors with fallbacks
	$text-color: var(--primary, #333);
	$background-color: var(--background-light, #f9f9f9);
	$border-color: var(--secondary, #ccc);
	$hover-color: var(--background-dark, #f0f0f0);
	$selected-color: var(--accent, #6200ee);
	$disabled-color: var(--secondary-dark, #999);
	$error-color: var(--error, #ff6b6b);

	// Component layout
	.combobox {
		display: flex;
		flex-direction: column;
		gap: $base-spacing * 2;
		font-family: var(--font-family);
		color: $text-color;
		width: 100%;
		contain: layout style; // CSS containment for performance

		&.disabled {
			opacity: 0.7;
			cursor: not-allowed;
		}

		&__label {
			font-weight: 500;
			font-size: $font-size-base * 0.875;
			margin-bottom: $base-spacing;
			display: flex;
			align-items: center;
			gap: $base-spacing * 2;
		}

		&__error {
			color: $error-color;
			font-size: $font-size-base * 0.75;
			font-weight: normal;
		}

		&__input-container {
			position: relative;
			display: flex;
			align-items: center;
		}

		&__input {
			width: 100%;
			padding: $base-spacing * 3 $base-spacing * 4;
			font-size: $font-size-base;
			line-height: 1.5;
			color: $text-color;
			background-color: $background-color;
			border: 1px solid $border-color;
			border-radius: $border-radius;
			transition:
				border-color $transition-duration ease-in-out,
				box-shadow $transition-duration ease-in-out;

			&:focus {
				outline: none;
				border-color: $selected-color;
				box-shadow: 0 0 0 3px rgba($selected-color, 0.1);
			}

			&:disabled {
				background-color: rgba($disabled-color, 0.1);
				cursor: not-allowed;
			}

			&::placeholder {
				color: $disabled-color;
			}
		}

		&__loading-indicator {
			position: absolute;
			right: $base-spacing * 3;
			top: 50%;
			transform: translateY(-50%);
			width: $base-spacing * 5;
			height: $base-spacing * 5;
			border: 2px solid $selected-color;
			border-top-color: transparent;
			border-radius: 50%;
			animation: spin 0.8s linear infinite;
			pointer-events: none; // Prevent interference with clicks
		}

		&__list {
			position: absolute;
			z-index: 10;
			top: 100%;
			left: 0;
			width: 100%;
			margin-top: $base-spacing;
			padding: $base-spacing * 2 0;
			list-style: none;
			background-color: $background-color;
			border: 1px solid $border-color;
			border-radius: $border-radius;
			box-shadow:
				0 10px 15px -3px rgba(0, 0, 0, 0.1),
				0 4px 6px -2px rgba(0, 0, 0, 0.05);
			max-height: 15rem;
			overflow-y: auto;
			overscroll-behavior: contain; // Prevents page scrolling when reaching list boundaries
			scroll-behavior: smooth;
			scrollbar-width: thin;
		}

		&__group-heading {
			padding: $base-spacing * 2 $base-spacing * 4;
			font-size: $font-size-base * 0.75;
			font-weight: 600;
			color: $selected-color;
			text-transform: uppercase;
			letter-spacing: 0.5px;
		}

		&__option {
			padding: $base-spacing * 2 $base-spacing * 4;
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: space-between;
			transition: background-color $transition-duration ease-in-out;
			user-select: none; // Prevent text selection

			&:hover:not(.disabled),
			&:focus:not(.disabled) {
				background-color: $hover-color;
				outline: none;
			}

			&.selected {
				background-color: rgba($selected-color, 0.1);
				color: $selected-color;
				font-weight: 500;
			}

			&.disabled {
				opacity: 0.5;
				cursor: not-allowed;
			}
		}

		&__check-icon {
			width: $base-spacing * 5;
			height: $base-spacing * 5;
			stroke: $selected-color;
			stroke-width: 2;
			fill: none;
			flex-shrink: 0;
		}

		&__no-results {
			padding: $base-spacing * 2 $base-spacing * 4;
			color: $disabled-color;
			font-style: italic;
			text-align: center;
		}
	}

	// Error state
	.combobox.error {
		.combobox__input {
			border-color: $error-color;

			&:focus {
				box-shadow: 0 0 0 3px rgba($error-color, 0.1);
			}
		}
	}

	// Loading animation
	@keyframes spin {
		0% {
			transform: translateY(-50%) rotate(0deg);
		}
		100% {
			transform: translateY(-50%) rotate(360deg);
		}
	}

	// Accessibility helper
	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		padding: 0;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}

	// Improved scrollbar styling
	.combobox__list::-webkit-scrollbar {
		width: 8px;
	}

	.combobox__list::-webkit-scrollbar-track {
		background: rgba($background-color, 0.5);
	}

	.combobox__list::-webkit-scrollbar-thumb {
		background-color: rgba($selected-color, 0.5);
		border-radius: 4px;
		border: 2px solid $background-color;

		&:hover {
			background-color: $selected-color;
		}
	}

	// Responsive adjustments
	@media (max-width: $breakpoint-sm) {
		.combobox {
			&__input {
				padding: $base-spacing * 2 $base-spacing * 3;
				font-size: $font-size-base * 0.9;
			}

			&__list {
				max-height: 12rem;
			}

			&__option,
			&__group-heading,
			&__no-results {
				padding: $base-spacing * 2 $base-spacing * 3;
			}
		}
	}

	// Reduce animations for users who prefer reduced motion
	@media (prefers-reduced-motion: reduce) {
		.combobox__input,
		.combobox__option {
			transition: none;
		}

		.combobox__loading-indicator {
			animation-duration: 1.5s;
		}

		.combobox__list {
			scroll-behavior: auto;
		}
	}
</style>
