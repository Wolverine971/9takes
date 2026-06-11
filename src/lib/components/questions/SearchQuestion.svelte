<!-- src/lib/components/questions/SearchQuestion.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import ComboBox from '$lib/components/molecules/ComboBox.svelte';
	import Context from '$lib/components/molecules/Context.svelte';
	import { createEventDispatcher, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import type { User } from '$lib/types/questions';
	import type { ComboBoxOption, ComboBoxSelectableOption } from '$lib/types/combobox';

	// Type for search result item from API
	interface SearchResultItem {
		question: string;
		highlighted?: string;
		url: string;
		id?: number;
		comment_count?: number;
	}

	// Type for category suggestion from API
	interface CategoryResultItem {
		id: number;
		name: string;
		slug: string | null;
		url: string;
		highlighted?: string;
	}

	// Type for the page data prop
	interface SearchQuestionData {
		user: User | null;
		canAskQuestion: boolean;
	}

	const dispatch = createEventDispatcher();
	let { data }: { data: SearchQuestionData } = $props();

	let question = $state('');
	let options = $state<ComboBoxOption[]>([]);
	let timer: ReturnType<typeof setTimeout> | null = null;
	let isSearching = $state(false);
	let abortController: AbortController | null = null;
	let searchError = $state('');
	let isMobile = $state(false);

	$effect(() => {
		if (!browser) return;
		isMobile = window.innerWidth < 768;
	});

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

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		void goToCreateQuestionPage();
	}

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
			const categoryResults = data.categories || [];

			const questionItems = searchResults
				.map((item: SearchResultItem) => {
					return {
						text: item.question, // Use plain text for the text property
						displayText: item.highlighted || item.question, // HTML for display
						value: `/questions/${item.url}`, // Full path so navigation is uniform
						commentCount: item.comment_count ?? 0
					};
				})
				.filter((opt: ComboBoxSelectableOption) => opt.text && opt.value);

			// Partition: questions whose text contains the query are direct
			// matches; the rest matched via their category names or context.
			const lowerQuery = searchString.trim().toLowerCase();
			const directMatches = questionItems.filter((opt: ComboBoxSelectableOption) =>
				opt.text.toLowerCase().includes(lowerQuery)
			);
			const categoryMatches = questionItems.filter(
				(opt: ComboBoxSelectableOption) => !opt.text.toLowerCase().includes(lowerQuery)
			);

			const categoryItems = categoryResults
				.map((item: CategoryResultItem) => {
					return {
						text: item.name,
						displayText: item.highlighted || item.name,
						value: item.url,
						isCategory: true
					};
				})
				.filter((opt: ComboBoxSelectableOption) => opt.text && opt.value);

			// Priority: direct question matches, then category pages, then
			// questions that belong to a matching category.
			const groups: ComboBoxOption[] = [];
			if (directMatches.length) {
				groups.push({ text: 'Matching questions', options: directMatches.slice(0, 5) });
			}
			if (categoryItems.length) {
				groups.push({ text: 'Categories', options: categoryItems });
			}
			if (categoryMatches.length) {
				groups.push({ text: 'In matching categories', options: categoryMatches.slice(0, 3) });
			}
			options = groups;
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
	let buttonText = $derived(getButtonText(data, isMobile));
	let buttonDisabled = $derived(Boolean(!data?.canAskQuestion && data?.user?.id));
	let placeholder = $derived(
		data?.user?.id
			? isMobile
				? 'Search questions...'
				: 'Search questions — or ask a new one'
			: 'Search questions...'
	);

	function getButtonText(pageData: SearchQuestionData, mobile: boolean): string {
		if (!pageData?.user?.id) return mobile ? 'Sign up' : 'Sign up to ask';
		return pageData?.canAskQuestion
			? mobile
				? 'Ask'
				: 'Ask question'
			: mobile
				? 'Limit'
				: 'Limit reached';
	}

	// Handle suggestion selection (question or category page)
	async function handleQuestionSelected(detail: string | null) {
		question = '';
		options = [];

		if (detail) {
			const path = detail.startsWith('/') ? detail : `/questions/${detail}`;
			try {
				await goto(path);
			} catch (error) {
				console.error('Navigation error:', error);
				// For backward compatibility, wrap in object
				dispatch('questionSelected', { url: path });
			}
		}
	}
</script>

<form class="search-form" role="search" aria-label="Search questions and categories" onsubmit={handleSubmit}>
	<div class="search-wrapper">
		<div class="search-container" class:is-searching={isSearching}>
			<Context>
				<ComboBox
					label=""
					ariaLabel="Search questions and categories"
					name="question"
					{placeholder}
					onInputChange={({ text }) => debounce(text)}
					onSelectQuestion={() => dispatch('createQuestion', question)}
					{options}
					onSelection={handleQuestionSelected}
					loading={isSearching}
					value={question}
					filter={() => options}
				>
					{#snippet option(option)}
						<!-- Single wrapper keeps the highlighted HTML as one flex item;
						     without it the <mark> splits the text into scattered columns. -->
						<span class="result-option">
							<span class="result-question">{@html option.displayText || option.text}</span>
							{#if option.isCategory}
								<span class="result-meta result-meta--category">BROWSE CATEGORY →</span>
							{:else}
								<span class="result-meta">
									{Number(option.commentCount ?? 0)}
									{Number(option.commentCount ?? 0) === 1 ? 'TAKE' : 'TAKES'}
								</span>
							{/if}
						</span>
					{/snippet}
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
		z-index: 10;
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
		border: 2px solid var(--lamp-soft);
		border-top-color: var(--lamp-glow);
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
		background-color: color-mix(in srgb, var(--error) 15%, transparent);
		color: var(--error);
		border: 1px solid color-mix(in srgb, var(--error) 30%, transparent);
		border-radius: 0.625rem;
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
		color: var(--text-on-primary);
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
		background-color: var(--lamp-glow);
		color: var(--text-on-primary);
		border: none;
		border-radius: 0.625rem;
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
			background-color: var(--lamp-glow);
			transform: translateY(-2px);
			box-shadow: 0 0 20px var(--lamp-glow-rgba);

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

		&:focus {
			outline: 2px solid var(--lamp-glow);
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

	/* Custom input styling - Ethereal dark theme
	   Note: !important needed to override Flowbite ComboBox internal styles */
	:global(.search-container input) {
		padding-right: 3rem !important;
		font-size: 1rem !important;
		height: 2.75rem !important;
		border-radius: var(--border-radius-lg) !important;
		border: 1px solid var(--lamp-soft) !important;
		background-color: var(--stone-warm) !important;
		backdrop-filter: blur(8px);
		color: var(--ink-bright) !important;
		transition: all $transition-fast !important;

		&:focus {
			border-color: var(--lamp-glow) !important;
			box-shadow: 0 0 0 3px var(--lamp-soft) !important;
		}

		&::placeholder {
			color: var(--ink-dim) !important;
		}
	}

	/* Highlighted text in search results */
	:global(.search-container .combobox__list em),
	:global(.search-container .combobox__list mark) {
		font-style: normal;
		font-weight: 600;
		color: var(--lamp-glow);
		background-color: var(--lamp-soft);
		padding: 0 2px;
		border-radius: 0.25rem;
	}

	/* Dropdown styling - Ethereal dark theme */
	:global(.search-container .combobox__list) {
		margin-top: 0.5rem !important;
		border-radius: var(--border-radius-lg) !important;
		box-shadow:
			0 4px 24px rgba(0, 0, 0, 0.15),
			0 0 20px var(--lamp-soft) !important;
		border: 1px solid var(--lamp-soft) !important;
		max-height: 320px !important;
		overflow-y: auto !important;
		z-index: 1000 !important;
		background-color: var(--night-deep) !important;
		backdrop-filter: blur(12px);
	}

	:global(.search-container .combobox__list li.combobox__option) {
		padding: 0.625rem 1rem !important;
		transition: background-color $transition-fast !important;
		cursor: pointer;
		border-bottom: 1px solid var(--lamp-soft);
		color: var(--ink-bright) !important;

		&:last-child {
			border-bottom: none;
		}

		&:hover {
			background-color: var(--lamp-soft) !important;
		}

		&:focus {
			background-color: var(--lamp-soft) !important;
			outline: none;
		}
	}

	/* "Matching questions" scope label at the top of the dropdown */
	:global(.search-container .combobox__list li.combobox__group-heading) {
		padding: 0.625rem 1rem 0.375rem !important;
		font-family: var(--font-mono);
		font-size: 0.6875rem !important;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--lamp-glow) !important;
		border-bottom: 1px solid var(--lamp-soft);
		cursor: default;
	}

	/* Structured result rows */
	.result-option {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
		width: 100%;
	}

	.result-question {
		font-size: 0.9375rem;
		line-height: 1.4;
		color: var(--ink-bright);
		overflow-wrap: anywhere;
	}

	.result-meta {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.06em;
		color: var(--ink-dim);
	}

	.result-meta--category {
		color: var(--lamp-glow);
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
