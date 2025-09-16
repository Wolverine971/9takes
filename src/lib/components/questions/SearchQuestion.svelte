<!-- src/lib/components/questions/SearchQuestion.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import ComboBox from '$lib/components/molecules/ComboBox.svelte';
	import Context from '$lib/components/molecules/Context.svelte';
	import { createEventDispatcher, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	const dispatch = createEventDispatcher();
	export let data: any;

	let question: string = '';
	let options: { text: string; value: any }[] = [];
	let timer: ReturnType<typeof setTimeout> | null = null;
	let isSearching = false;
	let abortController: AbortController | null = null;
	let searchError = '';
	let isMobile = false;

	// Check if mobile
	$: if (browser) {
		isMobile = window.innerWidth < 768;
	}

	// Clean up resources on component destruction
	onDestroy(() => {
		if (timer) clearTimeout(timer);
		if (abortController) abortController.abort();
	});

	const goToCreateQuestionPage = async () => {
		try {
			if (!data?.user?.id) {
				await goto(`/register`, { invalidateAll: true });
				return;
			}
			const url = question
				? `/questions/create/?question=${encodeURIComponent(question)}`
				: '/questions/create/';
			await goto(url, { invalidateAll: true });
		} catch (error) {
			console.error('Navigation error:', error);
			searchError = 'Failed to navigate. Please try again.';
		}
	};

	// Enhanced search with abort controller for cancellable requests
	const searchES = async (searchString: string) => {
		searchError = '';

		if (!searchString.trim() || searchString.length < 2) {
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
			// Use the new JSON API endpoint
			const response = await fetch(
				`/api/questions/typeahead?q=${encodeURIComponent(searchString)}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					},
					signal: abortController.signal
				}
			);

			if (!response.ok) {
				throw new Error('Search failed');
			}

			const data = await response.json();

			// Handle the JSON response
			const searchResults = data.results || [];

			options = searchResults
				.map((item: any) => {
					return {
						text: item.question, // Use plain text for the text property
						displayText: item.highlighted || item.question, // HTML for display
						value: item.url // Use URL as the value for simpler handling
					};
				})
				.filter((opt) => opt.text && opt.value);
		} catch (error) {
			// Only show error for real failures, not aborted requests
			if (!(error instanceof DOMException && error.name === 'AbortError')) {
				console.error('Search error:', error);
				// More specific error messages
				if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
					searchError = 'Network error. Check your connection and try again.';
				} else if (error instanceof Error && error.message.includes('Search failed')) {
					searchError = 'Search service is currently unavailable.';
				} else {
					searchError = 'Search temporarily unavailable. Please try again.';
				}
				options = [];
			}
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
			searchError = '';
			return;
		}

		// Slightly longer delay to reduce server load
		timer = setTimeout(() => searchES(value), 400);
	};

	// Memoized button properties
	$: buttonText = getButtonText(data, isMobile);
	$: buttonDisabled = !data?.canAskQuestion && data?.user?.id;
	$: placeholder = data?.user?.id
		? isMobile
			? 'Ask a question...'
			: 'Ask a question here'
		: isMobile
			? 'Search...'
			: 'Search questions...';

	function getButtonText(data: any, mobile: boolean): string {
		if (!data?.user?.id) return mobile ? 'Sign up' : 'Sign up to ask';
		return data?.canAskQuestion
			? mobile
				? 'Ask'
				: 'Ask question'
			: mobile
				? 'Limit'
				: 'Limit reached';
	}

	// Handle question selection
	async function handleQuestionSelected(detail: any) {
		question = '';
		options = [];

		// Detail is now the URL directly
		if (detail) {
			try {
				await goto(`/questions/${detail}`);
			} catch (error) {
				console.error('Navigation error:', error);
				// For backward compatibility, wrap in object
				dispatch('questionSelected', { url: detail });
			}
		}
	}
</script>

<form class="search-form" on:submit|preventDefault={goToCreateQuestionPage}>
	<div class="search-wrapper">
		<div class="search-container" class:is-searching={isSearching}>
			<Context>
				<ComboBox
					label=""
					name="question"
					{placeholder}
					on:inputChange={({ detail: { text } }) => debounce(text)}
					on:selectQuestion={() => dispatch('createQuestion', question)}
					{options}
					on:selection={({ detail }) => handleQuestionSelected(detail)}
					loading={isSearching}
					value={question}
					filter={() => options}
				>
					<span slot="option" let:option>
						{@html option.displayText || option.text}
					</span>
				</ComboBox>
			</Context>
			{#if isSearching}
				<div class="search-indicator" aria-hidden="true">
					<span class="spinner"></span>
				</div>
			{/if}
		</div>

		{#if searchError}
			<div class="search-error" role="alert">
				<span class="error-icon">!</span>
				{searchError}
			</div>
		{/if}
	</div>

	<button
		class="search-button"
		type="submit"
		title={buttonText}
		disabled={buttonDisabled}
		aria-label={buttonText}
	>
		<span class="button-text">{buttonText}</span>
		{#if !data?.user?.id}
			<svg
				class="button-icon"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<path d="M18 8L22 12L18 16" />
				<path d="M2 12H22" />
			</svg>
		{/if}
	</button>
</form>

<style lang="scss">
	/* Variables for consistent styling */
	$breakpoint-mobile: 640px;
	$transition-fast: 0.2s ease;
	$transition-standard: 0.3s ease;

	.search-form {
		display: flex;
		gap: 0.75rem;
		width: 100%;
		align-items: flex-start;

		@media (min-width: $breakpoint-mobile) {
			gap: 1rem;
		}
	}

	.search-wrapper {
		width: 100%;
		flex: 1;
		min-width: 0;
	}

	.search-container {
		position: relative;
		width: 100%;
		z-index: 50;
	}

	.search-indicator {
		position: absolute;
		top: 50%;
		right: 1rem;
		transform: translateY(-50%);
		pointer-events: none;
		z-index: 10;
	}

	.spinner {
		display: block;
		width: 20px;
		height: 20px;
		border: 2px solid rgba(108, 92, 231, 0.2);
		border-top-color: var(--primary);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.search-error {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.5rem;
		padding: 0.5rem 0.75rem;
		background-color: var(--error-light, #fee);
		color: var(--error, #e84393);
		border-radius: 0.375rem;
		font-size: 0.875rem;
		animation: slideIn 0.2s ease-out;
	}

	.error-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 18px;
		height: 18px;
		background-color: var(--error);
		color: white;
		border-radius: 50%;
		font-size: 0.75rem;
		font-weight: bold;
		flex-shrink: 0;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(-0.5rem);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.search-button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		background-color: var(--primary);
		color: white;
		border: none;
		border-radius: 0.5rem;
		font-weight: 600;
		font-size: 1rem;
		white-space: nowrap;
		cursor: pointer;
		transition: all $transition-standard;
		position: relative;
		overflow: hidden;
		flex-shrink: 0;

		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: -100%;
			width: 100%;
			height: 100%;
			background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
			transition: left 0.5s ease;
		}

		&:hover:not(:disabled) {
			background-color: var(--primary-dark);
			transform: translateY(-2px);
			box-shadow: 0 4px 12px rgba(108, 92, 231, 0.25);

			&::before {
				left: 100%;
			}
		}

		&:active:not(:disabled) {
			transform: translateY(0);
		}

		&:disabled {
			opacity: 0.6;
			cursor: not-allowed;
		}

		&:focus-visible {
			outline: 2px solid var(--primary);
			outline-offset: 2px;
		}
	}

	.button-text {
		font-weight: 600;
	}

	.button-icon {
		width: 16px;
		height: 16px;
		transition: transform $transition-fast;
	}

	.search-button:hover:not(:disabled) .button-icon {
		transform: translateX(2px);
	}

	/* Custom input styling */
	:global(.search-container input) {
		padding-right: 3rem !important; // Space for spinner
		font-size: 1rem !important;
		height: 2.75rem !important;
		border-radius: 0.5rem !important;
		border: 2px solid var(--border-color) !important;
		transition: all $transition-fast !important;

		&:focus {
			border-color: var(--primary) !important;
			box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.1) !important;
		}

		&::placeholder {
			color: var(--text-tertiary);
		}
	}

	/* Highlighted text in search results */
	:global(.search-container .combo-list em) {
		font-style: normal;
		font-weight: 600;
		color: var(--primary);
		background-color: var(--primary-light, rgba(108, 92, 231, 0.1));
		padding: 0 2px;
		border-radius: 2px;
	}

	/* Dropdown styling */
	:global(.search-container .combobox__list) {
		margin-top: 0.5rem !important;
		border-radius: 0.5rem !important;
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1) !important;
		border: 1px solid var(--border-color) !important;
		max-height: 320px !important;
		overflow-y: auto !important;
		z-index: 1000 !important;
		background-color: white !important;
	}

	:global(.search-container .combobox__list li) {
		padding: 0.75rem 1rem !important;
		transition: background-color $transition-fast !important;
		cursor: pointer;
		border-bottom: 1px solid var(--lightest-gray);

		&:last-child {
			border-bottom: none;
		}

		&:hover {
			background-color: var(--primary-light) !important;
		}

		&:focus {
			background-color: var(--primary-light) !important;
			outline: none;
		}
	}

	/* Mobile styles */
	@media (max-width: $breakpoint-mobile) {
		.search-form {
			flex-direction: column;
			gap: 0.5rem;
		}

		.search-button {
			width: 100%;
			padding: 0.75rem 1rem;
			font-size: 0.9375rem;
		}

		:global(.search-container input) {
			font-size: 16px !important; // Prevent zoom on iOS
		}

		.search-error {
			font-size: 0.8125rem;
		}
	}

	/* Reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.search-button,
		.button-icon,
		.spinner,
		.search-error {
			animation: none !important;
			transition: none !important;
		}

		.search-button::before {
			display: none;
		}
	}
</style>
