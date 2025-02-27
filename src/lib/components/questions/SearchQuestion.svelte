<script lang="ts">
	import { deserialize } from '$app/forms';
	import { goto } from '$app/navigation';
	import ComboBox from '$lib/components/molecules/ComboBox.svelte';
	import Context from '$lib/components/molecules/Context.svelte';
	import { createEventDispatcher, onDestroy } from 'svelte';

	const dispatch = createEventDispatcher();
	export let data: any;

	let question: string = '';
	let options: { text: string; value: any }[] = [];
	let timer: ReturnType<typeof setTimeout> | null = null;
	let isSearching = false;
	let abortController: AbortController | null = null;

	// Clean up resources on component destruction
	onDestroy(() => {
		if (timer) clearTimeout(timer);
		if (abortController) abortController.abort();
	});

	const goToCreateQuestionPage = () => {
		if (!data?.session?.user?.id) {
			goto(`/register`, { invalidateAll: true });
			return;
		}
		const url = question
			? `/questions/create/?question=${encodeURIComponent(question)}`
			: '/questions/create/';
		goto(url, { invalidateAll: true });
	};

	// Enhanced search with abort controller for cancellable requests
	const searchES = async (searchString: string) => {
		if (!searchString.trim()) {
			options = [];
			isSearching = false;
			return;
		}

		// Cancel any pending request
		if (abortController) {
			abortController.abort();
		}

		// Create new abort controller for this request
		abortController = new AbortController();
		isSearching = true;

		try {
			let body = new FormData();
			body.append('searchString', searchString);
			const response = await fetch('/questions?/typeahead', {
				method: 'POST',
				body,
				signal: abortController.signal
			});

			const resp: any = deserialize(await response.text());
			options =
				resp?.data?.map((o: any) => ({
					text: o?._source?.question,
					value: o?._source
				})) || [];
		} catch (error) {
			// Only log real errors, not aborted requests
			if (!(error instanceof DOMException && error.name === 'AbortError')) {
				console.error('Search error:', error);
			}
			options = [];
		} finally {
			isSearching = false;
		}
	};

	// Optimized debounce function for search
	const debounce = (value: string) => {
		question = value;
		if (timer) clearTimeout(timer);

		// For empty searches, clear immediately without delay
		if (!value.trim()) {
			options = [];
			return;
		}

		timer = setTimeout(() => searchES(value), 300);
	};

	// Memoized button properties
	$: buttonText = getButtonText(data);
	$: buttonDisabled = !data?.canAskQuestion && data?.session?.user?.id;
	$: placeholder = data?.session?.user?.id ? 'Put question here' : 'Search questions...';

	function getButtonText(data: any): string {
		if (!data?.session?.user?.id) return 'Sign up to ask';
		return data?.canAskQuestion ? 'Ask question' : 'Limit reached';
	}
</script>

<form class="search-form" on:submit|preventDefault={goToCreateQuestionPage}>
	<div class="search-container" class:is-searching={isSearching}>
		<Context>
			<ComboBox
				label=""
				name="question"
				{placeholder}
				on:inputChange={({ detail: { text } }) => debounce(text)}
				on:selectQuestion={() => dispatch('createQuestion', question)}
				{options}
				on:selection={({ detail }) => dispatch('questionSelected', detail)}
			/>
		</Context>
		{#if isSearching}
			<div class="search-indicator" aria-hidden="true"></div>
		{/if}
	</div>

	<button
		class="search-button"
		type="button"
		on:click={goToCreateQuestionPage}
		title={buttonText}
		disabled={buttonDisabled}
		aria-label={buttonText}
	>
		{buttonText}
	</button>
</form>

<style lang="scss">
	/* Variables for consistent styling */
	$spacing-xs: 0.25rem;
	$spacing-sm: 0.5rem;
	$spacing-md: 1rem;
	$spacing-lg: 1.5rem;
	$transition-standard: 0.3s ease;
	$border-radius: var(--base-border-radius, 3px);
	$breakpoint-sm: 576px;
	$breakpoint-md: 768px;
	$breakpoint-lg: 992px;

	.search-form {
		display: flex;
		gap: $spacing-md;
		margin-bottom: $spacing-md;
		align-items: stretch;
		width: 100%;
		position: relative;
	}

	.search-container {
		flex: 1;
		width: 100%;
		min-width: 0;
		position: relative;

		&.is-searching {
			.search-indicator {
				opacity: 1;
			}
		}
	}

	.search-indicator {
		position: absolute;
		top: 50%;
		right: $spacing-lg;
		transform: translateY(-50%);
		width: 16px;
		height: 16px;
		border: 2px solid rgba(0, 0, 0, 0.1);
		border-top: 2px solid var(--color-primary);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
		opacity: 0;
		transition: opacity 0.2s ease;
		pointer-events: none;
	}

	@keyframes spin {
		0% {
			transform: translateY(-50%) rotate(0deg);
		}
		100% {
			transform: translateY(-50%) rotate(360deg);
		}
	}

	.search-button {
		padding: $spacing-sm $spacing-lg;
		height: auto;
		align-self: stretch;
		border: none;
		border-radius: $border-radius;
		background-color: var(--color-primary);
		color: var(--color-text-inverse);
		font-size: 1rem;
		font-weight: 600;
		white-space: nowrap;
		cursor: pointer;
		transition: all $transition-standard;

		&:hover:not(:disabled) {
			background-color: var(--color-primary-hover);
			transform: translateY(-2px);
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		}

		&:disabled {
			opacity: 0.6;
			cursor: not-allowed;
		}

		&:focus {
			outline: 2px solid var(--color-primary-hover);
			outline-offset: 2px;
		}
	}

	/* Responsive adjustments */
	@media (max-width: $breakpoint-md) {
		.search-form {
			flex-direction: column;
			gap: $spacing-sm;
		}

		.search-button {
			width: 100%;
			margin-top: $spacing-xs;
			padding: $spacing-md;
		}
	}

	@media (min-width: $breakpoint-md) and (max-width: $breakpoint-lg) {
		.search-button {
			padding: $spacing-sm;
			font-size: 0.9rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.search-button,
		.search-indicator {
			transition: none;
			animation: none;
		}
	}
</style>
