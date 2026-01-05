<!-- src/routes/questions/+page.svelte -->
<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { enhance, deserialize } from '$app/forms';
	import { onMount, onDestroy } from 'svelte';
	import QuestionItem from '$lib/components/questions/QuestionItem.svelte';
	import SearchQuestion from '$lib/components/questions/SearchQuestion.svelte';
	import QuestionItemSkeleton from '$lib/components/questions/QuestionItemSkeleton.svelte';
	import ErrorBoundary from '$lib/components/error/ErrorBoundary.svelte';
	import AsyncErrorHandler from '$lib/components/error/AsyncErrorHandler.svelte';
	import Spinner from '$lib/components/atoms/Spinner.svelte';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import type { PageData } from './$types';
	import type { QuestionWithTag, QuestionCategory } from '$lib/types/questions';

	export let data: PageData;

	// State management
	let loading = false;
	let loadingMore = false;
	let isNavigating = false; // Prevents reactive URL handler from interfering during programmatic navigation
	let selectedCategory: number | null = null;
	let allQuestions = [...(data.questionsAndTags || [])];
	let currentPage = data.currentPage || 1;
	let hasMore = data.hasMore;
	let observer: IntersectionObserver | null = null;
	let loadMoreTrigger: HTMLElement;
	let errorMessage = '';

	// Memoized calculations
	$: categories = processQuestionsAndTags(allQuestions);
	$: filteredQuestions = selectedCategory
		? allQuestions.filter((q) => q.tag_id === selectedCategory)
		: allQuestions;
	$: displayedCategories =
		data.subcategoryTags?.filter((cat: QuestionCategory) =>
			allQuestions.some((q: QuestionWithTag) => q.tag_id === cat.id)
		) || [];

	// Animation settings
	const transitionEnabled =
		browser && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const duration = transitionEnabled ? 300 : 0;

	function processQuestionsAndTags(
		questions: QuestionWithTag[]
	): Record<string, QuestionWithTag[]> {
		if (!questions || questions.length === 0) return {};

		const grouped: Record<string, QuestionWithTag[]> = {};
		const seen = new Set<number>();

		for (const question of questions) {
			if (!seen.has(question.id)) {
				seen.add(question.id);
				const key = question.tag_name || 'Uncategorized';
				if (!grouped[key]) grouped[key] = [];
				grouped[key].push(question);
			}
		}

		return grouped;
	}

	async function loadMore() {
		if (loadingMore || !hasMore) return;

		loadingMore = true;
		errorMessage = '';

		try {
			const formData = new FormData();
			formData.append('page', String(currentPage + 1));
			if (selectedCategory) {
				formData.append('categoryId', String(selectedCategory));
			}

			const response = await fetch('?/loadMore', {
				method: 'POST',
				body: formData
			});

			// Properly deserialize SvelteKit action response
			const text = await response.text();
			const result = deserialize(text);

			if (result.type === 'success' && result.data) {
				const responseData = result.data as {
					questions: typeof allQuestions;
					page: number;
					hasMore: boolean;
				};
				allQuestions = [...allQuestions, ...(responseData.questions || [])];
				currentPage = responseData.page;
				hasMore = responseData.hasMore;
			}
		} catch (error) {
			console.error('Error loading more questions:', error);
			errorMessage = 'Failed to load more questions. Please try again.';
		} finally {
			loadingMore = false;
		}
	}

	// Helper to convert category name to URL slug
	function toSlug(name: string): string {
		return name.toLowerCase().replace(/\s+/g, '-');
	}

	// Helper to find category by slug
	function findCategoryBySlug(slug: string): QuestionCategory | undefined {
		return displayedCategories.find(
			(c: QuestionCategory) => toSlug(c.category_name) === slug.toLowerCase()
		);
	}

	async function filterByCategory(
		categoryId: number | null,
		categoryName: string | null = null,
		updateUrl = true
	) {
		if (selectedCategory === categoryId) return;

		loading = true;
		selectedCategory = categoryId;
		currentPage = 1;
		errorMessage = '';

		// Prevent reactive statement from interfering during programmatic navigation
		if (updateUrl) {
			isNavigating = true;
		}

		try {
			if (categoryId === null) {
				// Reset to all questions - update URL and reload data
				if (updateUrl && browser) {
					const url = new URL($page.url);
					url.searchParams.delete('category');
					await goto(url.toString(), { replaceState: true, invalidateAll: true });
				} else {
					await invalidateAll();
				}
				// Restore original data
				allQuestions = [...(data.questionsAndTags || [])];
				hasMore = data.hasMore;
			} else {
				// Update URL to reflect category selection (use slug for readable URLs)
				if (updateUrl && browser && categoryName) {
					const url = new URL($page.url);
					url.searchParams.set('category', toSlug(categoryName));
					await goto(url.toString(), { replaceState: true, noScroll: true });
				}

				// Filter by category
				const formData = new FormData();
				formData.append('categoryId', String(categoryId));

				const response = await fetch('?/filterByCategory', {
					method: 'POST',
					body: formData
				});

				// Properly deserialize SvelteKit action response
				const text = await response.text();
				const result = deserialize(text);

				if (result.type === 'success' && result.data) {
					allQuestions = (result.data as { questions: typeof allQuestions }).questions || [];
					hasMore = false; // Filtered results don't paginate
				} else if (result.type === 'failure') {
					throw new Error('Failed to filter questions');
				}
			}
		} catch (error) {
			console.error('Error filtering questions:', error);
			errorMessage = 'Failed to filter questions. Please try again.';
		} finally {
			loading = false;
			isNavigating = false;
		}
	}

	function goToCreateQuestionPage(detail: string) {
		if (!data?.user?.id) {
			goto('/register', { invalidateAll: true });
			return;
		}
		const url = detail
			? `/questions/create/?question=${encodeURIComponent(detail)}`
			: '/questions/create/';
		goto(url, { invalidateAll: true });
	}

	// Set up infinite scroll
	onMount(() => {
		if (browser && hasMore) {
			observer = new IntersectionObserver(
				(entries) => {
					if (entries[0].isIntersecting && !loadingMore && hasMore) {
						loadMore();
					}
				},
				{ threshold: 0.1, rootMargin: '100px' }
			);

			if (loadMoreTrigger) {
				observer.observe(loadMoreTrigger);
			}
		}
	});

	onDestroy(() => {
		if (observer) {
			observer.disconnect();
		}
	});

	// Handle URL changes (e.g., browser back/forward) - only for external navigation
	$: if (browser && !isNavigating) {
		const catParam = $page.url.searchParams.get('category');
		if (catParam) {
			// Try to find category by slug (name-based URL)
			const category = findCategoryBySlug(catParam);
			if (category && category.id !== selectedCategory) {
				filterByCategory(category.id, category.category_name, false); // Don't update URL since it's already updated
			}
		} else if (selectedCategory !== null && !loading) {
			// URL has no category param but we have a selection - reset
			// Only reset if we're not currently loading (to avoid race conditions)
			filterByCategory(null, null, false);
		}
	}
</script>

<SEOHead
	title="Ask Questions Anonymously & Get Answers | 9takes"
	description="Join 9takes to ask personal questions anonymously and get answers from diverse perspectives. Explore life's questions through the lens of personality types."
	canonical="https://9takes.com/questions"
	twitterCardType="summary_large_image"
	ogImage="https://9takes.com/questions-default.webp"
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: 'Ask Questions Anonymously & Get Answers | 9takes',
		description:
			"Join 9takes to ask personal questions anonymously and get answers from diverse perspectives. Explore life's questions through the lens of personality types.",
		url: 'https://9takes.com/questions',
		isPartOf: {
			'@type': 'WebSite',
			name: '9takes',
			url: 'https://9takes.com'
		},
		breadcrumb: {
			'@type': 'BreadcrumbList',
			itemListElement: [
				{
					'@type': 'ListItem',
					position: 1,
					name: 'Home',
					item: 'https://9takes.com'
				},
				{
					'@type': 'ListItem',
					position: 2,
					name: 'Questions',
					item: 'https://9takes.com/questions'
				}
			]
		},
		mainEntity: {
			'@type': 'FAQPage',
			name: 'Frequently Asked Questions about 9takes',
			mainEntity: [
				{
					'@type': 'Question',
					name: 'How can I ask questions anonymously on 9takes?',
					acceptedAnswer: {
						'@type': 'Answer',
						text: 'On 9takes, you can ask questions anonymously by creating an account using your Enneagram personality type as your identity. This allows you to maintain privacy while engaging in meaningful discussions.'
					}
				},
				{
					'@type': 'Question',
					name: 'What is the give-first commenting system?',
					acceptedAnswer: {
						'@type': 'Answer',
						text: "The give-first system requires you to share your own perspective before viewing others' responses. This encourages authentic participation and reduces bias from seeing other answers first."
					}
				},
				{
					'@type': 'Question',
					name: 'How do personality types work on 9takes?',
					acceptedAnswer: {
						'@type': 'Answer',
						text: '9takes uses the Enneagram personality system (types 1-9). Each user identifies with a type, allowing you to see how different personality types respond to the same questions.'
					}
				}
			]
		}
	}}
	additionalMeta={[
		{
			name: 'keywords',
			content:
				'anonymous questions, personality types, enneagram, Q&A platform, diverse perspectives, give-first system'
		},
		{ name: 'twitter:label1', content: 'Active Questions' },
		{ name: 'twitter:data1', content: `${data.questionsAndTags?.length || 0}+` }
	]}
/>

<ErrorBoundary onError={(error) => console.error('Questions page error:', error)}>
	<div
		class="mx-auto max-w-6xl overflow-x-hidden rounded-lg border border-neutral-200 bg-white p-2 shadow-md sm:overflow-visible sm:p-4"
		in:fade={{ duration }}
	>
		<!-- Header Section -->
		<header class="mb-6 px-2 text-center sm:mb-8 sm:px-4">
			{#if data?.user?.id}
				<h1
					class="mb-3 break-words text-xl font-bold text-neutral-800 sm:mb-4 sm:text-2xl"
					in:fly={{ y: -20, duration, delay: 150 }}
				>
					Explore your psychology and those around you
				</h1>
			{:else}
				<h1
					class="mb-3 break-words text-xl font-bold text-neutral-800 sm:mb-4 sm:text-2xl"
					in:fly={{ y: -20, duration, delay: 150 }}
				>
					Explore your psychology and those around you
				</h1>

				<div class="mt-4 sm:mt-6" in:fly={{ y: 20, duration, delay: 300 }}>
					<p
						class="mx-auto mb-4 max-w-4xl text-sm leading-relaxed text-neutral-600 sm:mb-6 sm:text-base"
					>
						Welcome to 9takes, where you can ask personal questions anonymously and receive answers
						from diverse perspectives. Our unique platform allows you to explore life's questions
						through the lens of personality types, ensuring a rich and varied discussion.
					</p>
					<div class="flex justify-center gap-6 sm:gap-8 md:gap-12">
						<div class="flex flex-col items-center gap-0.5 sm:gap-1">
							<strong class="text-lg text-primary-700 sm:text-xl md:text-2xl"
								>{data.totalQuestions || 0}</strong
							>
							<span class="text-xs text-neutral-600 sm:text-sm">questions asked</span>
						</div>
						<div class="flex flex-col items-center gap-0.5 sm:gap-1">
							<strong class="text-lg text-primary-700 sm:text-xl md:text-2xl"
								>{data.totalAnswers || 0}</strong
							>
							<span class="text-xs text-neutral-600 sm:text-sm">answers shared</span>
						</div>
					</div>
				</div>
			{/if}
		</header>

		<!-- Search Section -->
		<div class="relative z-20 mb-6 px-2 sm:mb-8 sm:px-0" in:fly={{ y: 20, duration, delay: 450 }}>
			<SearchQuestion
				{data}
				on:createQuestion={({ detail }) => goToCreateQuestionPage(detail)}
				on:questionSelected={({ detail }) => {
					if (detail?.url) {
						goto(`/questions/${detail.url}`);
					}
				}}
			/>
		</div>

		<!-- Categories Section -->
		<section
			class="mx-2 mb-4 rounded-xl border border-neutral-200 bg-gradient-to-b from-neutral-50 to-white p-3 shadow-sm sm:mx-0 sm:mb-6 sm:p-4"
			in:fly={{ y: 20, duration, delay: 600 }}
		>
			<div class="mb-2 flex items-center justify-between sm:mb-3">
				<h2 class="text-sm font-semibold text-neutral-800 sm:text-base">Browse by Category</h2>
				<span class="text-xs text-neutral-600">{displayedCategories.length} categories</span>
			</div>
			<div
				class="sm:max-h-30 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-400 scrollbar-thumb-rounded flex max-h-32 flex-wrap gap-1 overflow-y-auto overflow-x-hidden p-0.5 sm:gap-1.5 sm:p-1"
			>
				<button
					class="flex-shrink-0 whitespace-nowrap rounded-full border border-neutral-300 bg-white px-2.5 py-1 text-xs font-medium text-neutral-800 transition-all duration-150 hover:border-primary-700 hover:bg-primary-50 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60 sm:px-3.5 sm:py-1.5 sm:text-sm"
					class:!bg-primary-700={selectedCategory === null}
					class:!text-white={selectedCategory === null}
					class:!border-primary-700={selectedCategory === null}
					on:click={() => filterByCategory(null, null)}
					disabled={loading}
				>
					All Questions
				</button>
				{#each displayedCategories as category (category.id)}
					<button
						class="flex-shrink-0 whitespace-nowrap rounded-full border border-neutral-300 bg-white px-2.5 py-1 text-xs font-medium text-neutral-800 transition-all duration-150 hover:border-primary-700 hover:bg-primary-50 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60 sm:px-3.5 sm:py-1.5 sm:text-sm"
						class:!bg-primary-700={selectedCategory === category.id}
						class:!text-white={selectedCategory === category.id}
						class:!border-primary-700={selectedCategory === category.id}
						on:click={() => filterByCategory(category.id, category.category_name)}
						disabled={loading}
					>
						{category.category_name}
					</button>
				{/each}
			</div>
		</section>

		<!-- Error Handler -->
		<AsyncErrorHandler
			error={errorMessage}
			{loading}
			on:retry={() => {
				errorMessage = '';
				if (selectedCategory) {
					filterByCategory(selectedCategory);
				} else {
					invalidateAll();
				}
			}}
			on:dismiss={() => (errorMessage = '')}
		/>

		<!-- Questions List -->
		<section
			class="min-h-75 mx-2 rounded-lg border border-neutral-200 bg-white p-3 sm:mx-0 sm:p-5"
			in:fly={{ y: 20, duration, delay: 750 }}
		>
			{#if loading}
				<!-- Loading skeletons -->
				<div class="flex flex-col gap-2">
					{#each Array(5) as _, i}
						<QuestionItemSkeleton />
					{/each}
				</div>
			{:else if selectedCategory}
				<!-- Filtered view -->
				<div class="flex flex-col gap-1.5">
					<!-- Back button and category header -->
					<div class="mb-2 flex items-center gap-3 border-b border-neutral-100 pb-2">
						<button
							on:click={() => filterByCategory(null, null)}
							class="flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 transition-all hover:border-primary-500 hover:bg-primary-50 hover:text-primary-700"
							aria-label="Back to all questions"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
							</svg>
							All Questions
						</button>
						<h3 class="text-sm font-semibold text-neutral-800 sm:text-base">
							{displayedCategories.find((c) => c.id === selectedCategory)?.category_name ||
							'Category'}
						</h3>
						<span class="ml-auto text-xs text-neutral-500">
							{filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''}
						</span>
					</div>
					{#if filteredQuestions.length === 0}
						<p class="py-8 text-center text-neutral-600">No questions found in this category.</p>
					{:else}
						{#each filteredQuestions as questionData (questionData.id)}
							<QuestionItem {questionData} on:questionRemoved={() => invalidateAll()} />
						{/each}
					{/if}
				</div>
			{:else}
				<!-- Grouped by category view -->
				{#each Object.entries(categories) as [categoryName, questions]}
					<div class="mb-6 last:mb-0">
						<h3
							class="scroll-mt-4 border-b border-neutral-100 pb-1 text-sm font-semibold text-neutral-800 sm:text-base"
							id={categoryName.replace(/\s+/g, '-')}
						>
							{categoryName}
						</h3>
						<div class="flex flex-col gap-1.5">
							{#each questions as questionData (questionData.id)}
								<QuestionItem {questionData} on:questionRemoved={() => invalidateAll()} />
							{/each}
						</div>
					</div>
				{/each}
			{/if}

			<!-- Load more trigger -->
			{#if hasMore && !selectedCategory}
				<div
					bind:this={loadMoreTrigger}
					class="mt-4 flex h-20 items-center justify-center"
					class:loading={loadingMore}
				>
					{#if loadingMore}
						<div class="flex justify-center py-8">
							<Spinner size="md" color="primary">Loading more questions...</Spinner>
						</div>
					{/if}
				</div>
			{/if}
		</section>

		<!-- How It Works Section (for non-users) -->
		{#if !data?.user?.id}
			<section
				class="mx-2 mt-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4 sm:mx-0 sm:mt-8 sm:p-6"
				in:fly={{ y: 20, duration, delay: 900 }}
			>
				<h2 class="mb-3 text-lg font-semibold text-neutral-800 sm:mb-4 sm:text-xl">How It Works</h2>
				<ol
					class="mb-4 ml-4 space-y-1.5 text-sm text-neutral-600 sm:mb-6 sm:ml-6 sm:space-y-2 sm:text-base"
				>
					<li>Anonymously answer questions to see other answers</li>
					<li><strong>Sign up to ask your questions anonymously</strong></li>
					<li>Receive answers from diverse perspectives</li>
					<li>Sort comments by personality type and learn yours</li>
				</ol>
				<button
					class="w-full rounded-lg bg-primary-700 px-4 py-3 text-base font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-700 focus:ring-offset-2 sm:px-6 sm:py-4 sm:text-lg"
					on:click={() => goToCreateQuestionPage('')}
					aria-label="Ask your question now"
				>
					Ask Your Question Now
				</button>
			</section>
		{/if}
	</div>
</ErrorBoundary>
