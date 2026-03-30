<!-- src/lib/components/molecules/ComboBox.svelte -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { tick } from 'svelte';
	import { onClickOutside } from '$lib/components/molecules/Context.svelte';
	import type {
		ComboBoxFilter,
		ComboBoxGroupOption,
		ComboBoxOption,
		ComboBoxSelectableOption
	} from '$lib/types/combobox';

	interface Props {
		disabled?: boolean;
		error?: string;
		id?: string;
		label?: string;
		loading?: boolean;
		name?: string;
		options?: ComboBoxOption[];
		placeholder?: string;
		readonly?: boolean;
		required?: boolean;
		value?: string;
		filter?: ComboBoxFilter;
		onInputChange?: (detail: { text: string }) => void;
		onSelectQuestion?: (detail: { text: string }) => void;
		onSelection?: (value: string) => void;
		iconStart?: Snippet;
		group?: Snippet<[ComboBoxGroupOption]>;
		option?: Snippet<[ComboBoxSelectableOption]>;
	}

	let {
		disabled = false,
		error,
		id = crypto.randomUUID(),
		label = '',
		loading = false,
		name,
		options = [],
		placeholder,
		readonly = false,
		required = false,
		value = '',
		filter = defaultFilter,
		onInputChange,
		onSelectQuestion,
		onSelection,
		iconStart,
		group: groupTemplate,
		option: optionTemplate
	}: Props = $props();

	function isGroupOption(option: ComboBoxOption): option is ComboBoxGroupOption {
		return 'options' in option && Array.isArray(option.options);
	}

	function defaultFilter(text: string): ComboBoxOption[] {
		if (!text) return options;
		const sanitized = text.trim().toLowerCase();
		return options.reduce<ComboBoxOption[]>((acc, option) => {
			if (isGroupOption(option)) {
				const filteredOptions = option.options.filter((subOption) =>
					subOption.text.toLowerCase().includes(sanitized)
				);
				if (filteredOptions.length) {
					acc.push({ ...option, options: filteredOptions });
				}
			} else if (option.text.toLowerCase().includes(sanitized)) {
				acc.push(option);
			}
			return acc;
		}, []);
	}

	function flattenOptions(optionList: ComboBoxOption[]): ComboBoxSelectableOption[] {
		return optionList.flatMap((option) => (isGroupOption(option) ? option.options : option));
	}

	function findSelectableOption(searchText: string): ComboBoxSelectableOption | undefined {
		return flattenOptions(options).find((option) => option.text === searchText);
	}

	let listElement = $state<HTMLUListElement | null>(null);
	let inputElement = $state<HTMLInputElement | null>(null);
	let list = $state<ComboBoxOption[]>([]);
	let isListOpen = $state(false);
	let selectedOption = $state<ComboBoxSelectableOption | null>(null);
	let selectedValue = $state('');
	let activeIndex = $state(-1);
	let debounceTimer = $state<ReturnType<typeof setTimeout> | null>(null);
	let internalLoading = $state(false);
	const cachedResults = new Map<string, ComboBoxOption[]>();

	let isLoading = $derived(loading || internalLoading);

	$effect(() => {
		selectedValue = value;
	});

	$effect(() => {
		if (!options.length) {
			list = [];
			cachedResults.clear();
			return;
		}

		cachedResults.clear();
		void showList(inputElement?.value ?? '');
	});

	// Handle keyboard navigation and input events
	async function handleInputEvent(event: KeyboardEvent) {
		const { type, key } = event;
		const input = event.currentTarget;

		if (!(input instanceof HTMLInputElement)) {
			return;
		}

		if (type === 'keyup') {
			if (['Escape', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Enter', 'Tab', 'Shift'].includes(key)) {
				return;
			}

			if (key === 'ArrowDown') {
				event.preventDefault();
				await showList(input.value);
				const firstOption = listElement?.querySelector<HTMLElement>(
					`[role="option"]:not([aria-disabled="true"])`
				);
				if (firstOption) {
					firstOption.focus();
					activeIndex = 0;
				}
				return;
			}

			internalLoading = false;
			if (debounceTimer) {
				clearTimeout(debounceTimer);
			}
			debounceTimer = setTimeout(() => {
				onInputChange?.({ text: input.value });
				void showList(input.value);
			}, 150);
		} else if (type === 'keydown') {
			if (key === 'Escape') {
				hideList();
			} else if (key === 'Enter') {
				event.preventDefault();
				internalLoading = true;
				onSelectQuestion?.({ text: input.value });
			} else if (key === 'Tab') {
				hideList();
			}
		}
	}

	// Handle option click
	function handleOptionClick(event: MouseEvent) {
		const target = event.target;
		if (!(target instanceof Element)) return;

		const optionElement = target.closest<HTMLElement>(
			`[role="option"]:not([aria-disabled="true"])`
		);
		if (!optionElement) return;

		selectOption(optionElement);
		hideList();
	}

	// Handle keyboard navigation in list
	function handleListKeyDown(event: KeyboardEvent) {
		if (!listElement) return;

		const { key } = event;
		const selectableOptions = Array.from(
			listElement.querySelectorAll<HTMLElement>(`[role="option"]:not([aria-disabled="true"])`)
		);

		if (selectableOptions.length === 0) return;

		if (key === 'ArrowUp' || key === 'ArrowDown') {
			event.preventDefault();

			let newIndex = activeIndex;
			if (key === 'ArrowUp') {
				newIndex = activeIndex <= 0 ? selectableOptions.length - 1 : activeIndex - 1;
			} else {
				newIndex = activeIndex >= selectableOptions.length - 1 ? 0 : activeIndex + 1;
			}

			activeIndex = newIndex;
			selectableOptions[newIndex]?.focus();
		} else if (key === 'Enter') {
			event.preventDefault();
			const activeElement = document.activeElement;
			if (activeElement instanceof HTMLElement && activeElement.matches(`[role="option"]`)) {
				selectOption(activeElement);
				hideList();
			}
		} else if (key === 'Escape') {
			event.preventDefault();
			hideList();
		} else if (key === 'Tab') {
			hideList();
		} else if (key === 'Home') {
			event.preventDefault();
			activeIndex = 0;
			selectableOptions[0]?.focus();
		} else if (key === 'End') {
			event.preventDefault();
			activeIndex = selectableOptions.length - 1;
			selectableOptions[selectableOptions.length - 1]?.focus();
		} else {
			inputElement?.focus();
		}
	}

	function deduplicateOptions(optionsList: ComboBoxOption[]): ComboBoxOption[] {
		const seen = new Set<string>();
		const deduped: ComboBoxOption[] = [];

		for (const option of optionsList) {
			if (isGroupOption(option)) {
				const dedupedSubOptions: ComboBoxSelectableOption[] = [];
				const subSeen = new Set<string>();

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
				const key = option.value || option.text;
				if (!seen.has(key)) {
					seen.add(key);
					deduped.push(option);
				}
			}
		}

		return deduped;
	}

	async function showList(inputValue: string) {
		const cacheKey = inputValue || '';
		if (cachedResults.has(cacheKey)) {
			list = cachedResults.get(cacheKey) ?? [];
		} else {
			const filteredList = inputValue === '' ? options : await filter(inputValue);
			list = deduplicateOptions(filteredList);
			cachedResults.set(cacheKey, list);

			if (cachedResults.size > 50) {
				const firstKey = cachedResults.keys().next().value;
				if (firstKey) {
					cachedResults.delete(firstKey);
				}
			}
		}

		isListOpen = true;
		activeIndex = -1;
		await tick();
	}

	function hideList() {
		if (!isListOpen) return;
		if (selectedOption && inputElement) {
			inputElement.value = selectedOption.text;
		}
		isListOpen = false;
		activeIndex = -1;
		inputElement?.focus();
	}

	function selectOption(optionElement: HTMLElement) {
		internalLoading = true;
		const searchText = optionElement.dataset.text;
		if (!searchText) return;

		const selection = findSelectableOption(searchText);
		if (!selection) return;

		selectedValue = selection.value ?? '';
		selectedOption = selection;
		if (inputElement) {
			inputElement.value = selection.text;
		}
		onSelection?.(selectedValue);
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
		{@render iconStart?.()}

		<input
			bind:this={inputElement}
			onkeyup={handleInputEvent}
			onkeydown={handleInputEvent}
			onmousedown={() => showList(inputElement?.value || '')}
			class="combobox__input"
			class:loading={isLoading}
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

		{#if isLoading}
			<div class="combobox__loading-indicator" aria-hidden="true"></div>
		{/if}

		{#if isListOpen}
			<ul
				id="combobox-list-{id}"
				class="combobox__list"
				role="listbox"
				aria-label={label || 'Options'}
				onclick={handleOptionClick}
				onkeydown={handleListKeyDown}
				bind:this={listElement}
				tabindex="-1"
			>
				{#each list as option, i (`${option?.value || option?.text || ''}_${i}`)}
					{#if isGroupOption(option)}
						<li class="combobox__group-heading" role="presentation">
							{#if groupTemplate}
								{@render groupTemplate(option)}
							{:else}
								{option.text}
							{/if}
						</li>
						{#each option.options as subOption, j (`${option?.text || i}_${subOption?.value || subOption?.text || ''}_${j}`)}
							<li
								class="combobox__option"
								class:disabled={subOption.disabled}
								class:selected={selectedValue === subOption.value}
								role="option"
								tabindex={subOption.disabled ? undefined : -1}
								data-text={subOption.text}
								data-value={subOption.value}
								aria-selected={selectedValue === subOption.value}
								aria-disabled={subOption.disabled ?? undefined}
							>
								{#if optionTemplate}
									{@render optionTemplate(subOption)}
								{:else}
									{subOption.text}
								{/if}
								{#if subOption.value === selectedValue}
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
							class:selected={selectedValue === option.value}
							role="option"
							tabindex={option.disabled ? undefined : -1}
							data-text={option.text}
							data-value={option.value}
							aria-selected={selectedValue === option.value}
							aria-disabled={option.disabled ?? undefined}
						>
							{#if optionTemplate}
								{@render optionTemplate(option)}
							{:else}
								{option.text}
							{/if}
							{#if option.value === selectedValue}
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
