<script>
	import { createEventDispatcher } from 'svelte';
	import { onClickOutside } from '$lib/components/molecules/Context.svelte';

	const dispatch = createEventDispatcher();

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

	let listElement;
	let inputElement;
	let list = [];
	let isListOpen = false;
	let selectedOption;

	$: if (options?.length) {
		const val = inputElement?.value;
		showList(val);
	}

	async function handleInputEvent(event) {
		const { type, key } = event;
		if (type === 'keyup') {
			if (['Escape', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Enter', 'Tab', 'Shift'].includes(key))
				return;
			if (key === 'ArrowDown') {
				event.preventDefault();
				await showList(event.target.value);
				listElement.querySelector(`[role="option"]:not([aria-disabled="true"])`)?.focus();
				return;
			}
			dispatch('inputChange', { text: event.target.value });
			await showList(event.target.value);
		} else if (type === 'keydown') {
			if (key === 'Escape') hideList();
			else if (key === 'Enter') {
				event.preventDefault();
				loading = true;
				dispatch('selectQuestion', { text: event.target.value });
			} else if (key === 'Tab') hideList();
		}
	}

	function handleOptionClick(event) {
		if (!event.target.matches(`[role="option"]:not([aria-disabled="true"])`)) return;
		selectOption(event.target);
		hideList();
	}

	function handleListKeyDown(event) {
		const { key, target } = event;
		if (key === 'ArrowUp' || key === 'ArrowDown') {
			event.preventDefault();
			const direction = key === 'ArrowUp' ? 'previousElementSibling' : 'nextElementSibling';
			let nextOption = target[direction];
			while (nextOption) {
				if (nextOption.matches(`[role="option"]:not([aria-disabled="true"])`)) {
					nextOption.focus();
					break;
				}
				nextOption = nextOption[direction];
			}
		} else if (key === 'Enter') {
			event.preventDefault();
			selectOption(target);
			hideList();
		} else if (key === 'Escape') {
			event.preventDefault();
			hideList();
		} else if (key === 'Tab') {
			hideList();
		} else {
			inputElement.focus();
		}
	}

	async function showList(inputValue) {
		list = inputValue === '' ? options : await filter(inputValue);
		isListOpen = true;
	}

	function hideList() {
		if (!isListOpen) return;
		if (selectedOption) {
			inputElement.value = selectedOption.text;
		}
		isListOpen = false;
		inputElement.focus();
	}

	function selectOption(optionElement) {
		loading = true;
		const selection = options.find((o) => o.text === optionElement.dataset.text);
		value = selection.value;
		selectedOption = selection;
		dispatch('selection', value);
	}
</script>

<div class="combobox" class:error>
	{#if label}
		<label class="combobox__label" for={id}>
			{label}
			{#if error}
				<span class="combobox__error">{error}</span>
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
			on:mousedown={() => showList(inputElement.value)}
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
			aria-controls="combobox__list"
		/>
		{#if loading}
			<div class="combobox__loading-indicator" />
		{/if}

		{#if isListOpen}
			<ul
				id="combobox__list"
				class="combobox__list"
				role="listbox"
				aria-label={label}
				on:click={handleOptionClick}
				on:keydown={handleListKeyDown}
				bind:this={listElement}
			>
				{#each list as option (option)}
					{#if option.options}
						<li class="combobox__group-heading">
							<slot name="group" {option}>
								{option.text}
							</slot>
						</li>
						{#each option.options as subOption (subOption)}
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
									<svg class="combobox__check-icon" viewBox="0 0 24 24" aria-hidden="true">
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
								<svg class="combobox__check-icon" viewBox="0 0 24 24" aria-hidden="true">
									<polyline points="20 6 9 17 4 12" />
								</svg>
							{/if}
						</li>
					{/if}
				{:else}
					<li class="combobox__no-results">No results available</li>
				{/each}
			</ul>
		{/if}

		<div class="visually-hidden" role="status" aria-live="polite">
			{list.length} results available.
		</div>
	</div>
</div>

<style lang="scss">
	// --info: #f0f0f0

	$text-color: var(primary);
	$background-color: darken(#f0f0f0, 5%);
	$border-color: var(--secondary);
	$hover-color: darken(#f0f0f0, 10%);
	$selected-color: var(--accent);
	$disabled-color: var(--secondary-dark);
	$error-color: #ff6b6b;
	$transition-duration: 0.2s;

	.combobox {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
			sans-serif;
		color: $text-color;

		&__label {
			font-weight: 500;
			font-size: 0.875rem;
			margin-bottom: 0.25rem;
		}

		&__error {
			color: $error-color;
			font-size: 0.75rem;
			margin-left: 0.5rem;
		}

		&__input-container {
			position: relative;
		}

		&__input {
			width: 100%;
			padding: 0.625rem 1rem;
			font-size: 1rem;
			line-height: 1.5;
			color: $text-color;
			background-color: $background-color;
			border: 1px solid $border-color;
			border-radius: 0.375rem;
			transition: border-color $transition-duration ease-in-out,
				box-shadow $transition-duration ease-in-out;

			&:focus {
				outline: none;
				border-color: var(--accent);
				box-shadow: 0 0 0 3px rgba(var(--accent), 0.1);
			}

			&:disabled {
				background-color: var(--primary);
				cursor: not-allowed;
			}

			&::placeholder {
				color: $disabled-color;
			}
		}

		&__loading-indicator {
			position: absolute;
			right: 0.75rem;
			top: 50%;
			transform: translateY(-50%);
			width: 1.25rem;
			height: 1.25rem;
			border: 2px solid var(--accent);
			border-top-color: transparent;
			border-radius: 50%;
			animation: spin 0.8s linear infinite;
		}

		&__list {
			position: absolute;
			z-index: 10;
			width: 100%;
			margin-top: 0.25rem;
			padding: 0.5rem 0;
			list-style: none;
			background-color: $background-color;
			border: 1px solid $border-color;
			border-radius: 0.375rem;
			box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
			max-height: 15rem;
			overflow-y: auto;
		}

		&__group-heading {
			padding: 0.5rem 1rem;
			font-size: 0.75rem;
			font-weight: 600;
			color: var(--accent);
			text-transform: uppercase;
		}

		&__option {
			padding: 0.5rem 1rem;
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: space-between;
			transition: background-color $transition-duration ease-in-out;

			&:hover:not(.disabled),
			&:focus:not(.disabled) {
				background-color: $hover-color;
				outline: none;
			}

			&.selected {
				background-color: var(--accent);
				color: var(--primary);
				font-weight: 500;
			}

			&.disabled {
				opacity: 0.5;
				cursor: not-allowed;
			}
		}

		&__check-icon {
			width: 1.25rem;
			height: 1.25rem;
			stroke: var(--primary);
			stroke-width: 2;
			fill: none;
		}

		&__no-results {
			padding: 0.5rem 1rem;
			color: $disabled-color;
			font-style: italic;
		}
	}

	.combobox.error {
		.combobox__input {
			border-color: $error-color;

			&:focus {
				box-shadow: 0 0 0 3px rgba($error-color, 0.1);
			}
		}
	}

	@keyframes spin {
		0% {
			transform: translateY(-50%) rotate(0deg);
		}
		100% {
			transform: translateY(-50%) rotate(360deg);
		}
	}

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

	// Custom scrollbar styles for webkit browsers
	.combobox__list::-webkit-scrollbar {
		width: 8px;
	}

	.combobox__list::-webkit-scrollbar-track {
		background: var(--primary-dark);
	}

	.combobox__list::-webkit-scrollbar-thumb {
		background-color: var(--accent);
		border-radius: 4px;
		border: 2px solid var(--primary-dark);
	}
</style>
