<script>
	import { uid, onClickOutside } from './Context.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let disabled = undefined;
	export let error = undefined;
	export let expand = true;
	export let id = uid();
	export let label = '';
	export let loading = false;
	export let name;
	export let options = [];
	export let placeholder = undefined;
	export let readonly = undefined;
	export let required = undefined;
	export let value = '';

	$: if (options?.length) {
		const val = document.getElementById(id)?.value;
		showList(val);
	}

	export let filter = (text) => {
		const sanitized = text.trim().toLowerCase();

		return options.reduce((a, o) => {
			let match;

			if (o.options) {
				const options = o.options.filter((o) => o.text.toLowerCase().includes(sanitized));

				if (options.length) {
					match = { ...o, options };
				}
			} else if (o.text.toLowerCase().includes(sanitized)) {
				match = o;
			}

			match && a.push(match);

			return a;
		}, []);
	};

	let listElement;
	let inputElement;
	let list = [];
	let isListOpen = false;
	let selectedOption;

	async function onInputKeyup(event) {
		switch (event.key) {
			case 'Escape':
			case 'ArrowUp':
			case 'ArrowLeft':
			case 'ArrowRight':
			case 'Enter':
			// dispatch('inputChange', {
			// 	text: event.target.value
			// });
			case 'Tab':
			case 'Shift':
				break;
			case 'ArrowDown':
				await showList(event.target.value);
				listElement.querySelector(`[role="option"]:not([aria-disabled="true"])`)?.focus();

				event.preventDefault();
				event.stopPropagation();
				break;

			default:
				dispatch('inputChange', {
					text: event.target.value
				});
				await showList(event.target.value);
		}
	}

	function onInputKeydown(event) {
		let flag = false;

		switch (event.key) {
			case 'Escape':
				hideList();
				flag = true;
				break;
			case 'Enter': {
				dispatch('createQuestion', {
					text: event.target.value
				});
				break;
			}

			case 'Tab':
				hideList();
				break;
		}

		if (flag) {
			event.preventDefault();
			event.stopPropagation();
		}
	}

	async function onInputClick(event) {
		await showList(event.target.value);
		// Scroll selected option into view.
		listElement.querySelector(`[role="option"][data-value="${value}"]`)?.scrollIntoView();
	}

	function onOptionClick(event) {
		if (!event.target.matches(`[role="option"]:not([aria-disabled="true"])`)) return;

		selectOption(event.target);
		hideList();
	}

	function onListKeyDown(event) {
		let flag = false;

		switch (event.key) {
			case 'ArrowUp':
				let prevOptionElement = event.target.previousElementSibling;

				while (prevOptionElement) {
					if (prevOptionElement.matches(`[role="option"]:not([aria-disabled="true"])`)) break;
					prevOptionElement = prevOptionElement.previousElementSibling;
				}

				prevOptionElement?.focus();
				flag = true;
				break;

			case 'ArrowDown':
				let nextOptionElement = event.target.nextElementSibling;

				while (nextOptionElement) {
					if (nextOptionElement.matches(`[role="option"]:not([aria-disabled="true"])`)) break;
					nextOptionElement = nextOptionElement.nextElementSibling;
				}

				nextOptionElement?.focus();
				flag = true;
				break;

			case 'Enter':
				selectOption(event.target);
				hideList();
				flag = true;
				break;

			case 'Escape':
				hideList();
				flag = true;
				break;

			case 'Tab':
				hideList();
				break;

			default:
				inputElement.focus();
		}

		if (flag) {
			event.preventDefault();
			event.stopPropagation();
		}
	}

	async function showList(inputValue) {
		const isExactMatch = options.some((o) =>
			o.options ? o.options.some((o) => o.text === inputValue) : o.text === inputValue
		);

		list = inputValue === '' || isExactMatch ? options : await filter(inputValue);
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
		value = optionElement.dataset.value;

		selectedOption = {
			text: optionElement.dataset.text,
			value: optionElement.dataset.value
		};
		const selection = options[optionElement.value]?.value;
		// .find((o) => {
		// 	o.text === selectedOption.text;
		// });
		dispatch('selection', selection);
	}
</script>

<div class="combobox">
	{#if label}
		<label class="combobox__label label" for={id}>
			{label}
			{#if error}
				<span class="form-validation-error">
					{error}
				</span>
			{/if}
		</label>
	{/if}

	<div class="input-container" use:onClickOutside={hideList}>
		<slot name="icon-start" />

		<input
			bind:this={inputElement}
			on:focus
			on:blur
			on:input
			on:keyup={onInputKeyup}
			on:keydown={onInputKeydown}
			on:mousedown={onInputClick}
			class="combobox__input"
			{id}
			{name}
			type="text"
			{disabled}
			autocapitalize="none"
			autocomplete="off"
			{readonly}
			{placeholder}
			spellcheck="false"
			role="combobox"
			aria-autocomplete="list"
			aria-expanded={isListOpen}
			aria-required={required ? 'true' : undefined}
		/>

		<ul
			class="combobox__list"
			role="listbox"
			aria-label={label}
			hidden={!isListOpen}
			on:click={onOptionClick}
			on:keydown={onListKeyDown}
			bind:this={listElement}
		>
			{#each list as option (option)}
				{#if option.options}
					<li class="list__option-heading">
						<slot name="group" group={option}>
							{option.text}
						</slot>
					</li>
					{#each option.options as option (option)}
						<li
							class="list__option"
							class:--disabled={option.disabled}
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
								<svg viewBox="0 0 24 24" class="icon">
									<polyline points="20 6 9 17 4 12" />
								</svg>
							{/if}
						</li>
					{/each}
				{:else}
					<li
						class="list__option"
						class:--disabled={option.disabled}
						role="option"
						tabindex={option.disabled === true ? undefined : '-1'}
						data-text={option.text}
						data-value={option.value}
						aria-selected={value === option.value}
						aria-disabled={option.disabled}
					>
						<slot name="option" {option}>
							{option.text}
						</slot>
						{#if option.value === value}
							<svg viewBox="0 0 24 24" class="icon">
								<polyline points="20 6 9 17 4 12" />
							</svg>
						{/if}
					</li>
				{/if}
			{:else}
				<li class="list__no-results">No results available</li>
			{/each}
		</ul>

		<div class="visually-hidden" role="status" aria-live="polite">
			{list.length} results available.
		</div>
	</div>
</div>

<style>
	.combobox {
		--accent-color: #06113c;
		--background-color: white;
		--border-radius: 1em;

		--option-border: ;
		--option-padding: ;

		display: flex;
		flex-direction: column;
		gap: 0.5em;
	}

	.input-container {
		position: relative;
	}

	.combobox__input {
		margin: 0;
		width: 100%;
		padding: 0.8rem 1rem;
		border: 0.175rem solid gray;
		border-radius: 0.3rem;
	}

	.combobox__input:focus {
		outline: none;
	}

	.combobox:focus-within .combobox__input {
		border-color: var(--accent-color);
	}

	.combobox__list {
		/* Reset */
		list-style: none;
		margin: 0;
		padding: 0.3rem;
		/* Position and Size */
		position: absolute;
		inset-inline-start: 0;
		inset-block-start: calc(100% + 0.3rem);
		min-width: 100%;
		max-height: 40vh;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
		z-index: 100;

		background-color: var(--background-color);
		border-radius: 0.3em;
		border: 0.175rem solid var(--accent-color);
		box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
	}

	.list__option-heading {
		font-size: 0.9em;
		padding-inline: 1rem;
		padding-block-start: 0.4rem;
		color: gray;
	}

	.list__no-results {
		padding: 0.8rem 1rem;
	}

	.list__option {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.8rem 1rem;
		border: 0.2rem solid transparent;
		border-radius: 0.3rem;
	}

	.list__option > :global(*) {
		pointer-events: none;
	}

	.list__option.--disabled {
		pointer-events: none;
		opacity: 0.4;
	}

	.list__option:focus,
	.list__option:not([aria-disabled='true']):hover {
		outline: none;
		cursor: pointer;
		background-color: rgba(0, 0, 0, 0.1);
	}

	.list__option:active {
		cursor: pointer;
		outline: none;
		color: white;
		background-color: var(--accent-color) !important;
	}

	.list__option:focus :global(svg),
	.list__option:hover :global(svg) {
		--icon-color: white !important;
	}
</style>
