<!-- routes/questions/+page.svelte -->
<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { onMount, onDestroy } from 'svelte';
	import QuestionItem from '$lib/components/questions/QuestionItem.svelte';
	import SearchQuestion from '$lib/components/questions/SearchQuestion.svelte';
	import QuestionItemSkeleton from '$lib/components/questions/QuestionItemSkeleton.svelte';
	import ErrorBoundary from '$lib/components/error/ErrorBoundary.svelte';
	import AsyncErrorHandler from '$lib/components/error/AsyncErrorHandler.svelte';
	import Spinner from '$lib/components/atoms/Spinner.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	// State management
	let loading = false;
	let loadingMore = false;
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
		? allQuestions.filter(q => q.tag_id === selectedCategory)
		: allQuestions;
	$: displayedCategories = data.subcategoryTags?.filter(cat => 
		allQuestions.some(q => q.tag_id === cat.id)
	) || [];

	// Animation settings
	const transitionEnabled = browser && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const duration = transitionEnabled ? 300 : 0;

	function processQuestionsAndTags(questions) {
		if (!questions || questions.length === 0) return {};
		
		const grouped = {};
		const seen = new Set();
		
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
			
			const result = await response.json();
			
			if (result.data) {
				allQuestions = [...allQuestions, ...(result.data.questions || [])];
				currentPage = result.data.page;
				hasMore = result.data.hasMore;
			}
		} catch (error) {
			console.error('Error loading more questions:', error);
			errorMessage = 'Failed to load more questions. Please try again.';
		} finally {
			loadingMore = false;
		}
	}

	async function filterByCategory(categoryId: number | null) {
		if (selectedCategory === categoryId) return;
		
		loading = true;
		selectedCategory = categoryId;
		currentPage = 1;
		errorMessage = '';
		
		try {
			if (categoryId === null) {
				// Reset to all questions
				await invalidateAll();
			} else {
				// Filter by category
				const formData = new FormData();
				formData.append('categoryId', String(categoryId));
				
				const response = await fetch('?/filterByCategory', {
					method: 'POST',
					body: formData
				});
				
				const result = await response.json();
				
				if (result.data) {
					allQuestions = result.data.questions || [];
					hasMore = false; // Filtered results don't paginate
				}
			}
		} catch (error) {
			console.error('Error filtering questions:', error);
			errorMessage = 'Failed to filter questions. Please try again.';
		} finally {
			loading = false;
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

	// Handle URL changes
	$: if (browser && $page.url.searchParams.get('category')) {
		const catId = parseInt($page.url.searchParams.get('category') || '');
		if (!isNaN(catId) && catId !== selectedCategory) {
			filterByCategory(catId);
		}
	}
</script>

<svelte:head>
	<title>Ask Questions Anonymously & Get Answers | 9takes</title>
	<meta
		name="description"
		content="Join 9takes to ask personal questions anonymously and get answers from diverse perspectives. Explore life's questions through the lens of personality types."
	/>
	<link rel="canonical" href="https://9takes.com/questions" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "CollectionPage",
			"name": "Ask Questions Anonymously & Get Answers | 9takes",
			"description": "Join 9takes to ask personal questions anonymously and get answers from diverse perspectives. Explore life's questions through the lens of personality types.",
			"url": "https://9takes.com/questions",
			"isPartOf": {
				"@type": "WebSite",
				"name": "9takes",
				"url": "https://9takes.com"
			},
			"breadcrumb": {
				"@type": "BreadcrumbList",
				"itemListElement": [
					{
						"@type": "ListItem",
						"position": 1,
						"name": "Home",
						"item": "https://9takes.com"
					},
					{
						"@type": "ListItem",
						"position": 2,
						"name": "Questions",
						"item": "https://9takes.com/questions"
					}
				]
			},
			"mainEntity": {
				"@type": "FAQPage",
				"name": "Frequently Asked Questions about 9takes",
				"mainEntity": [
					{
						"@type": "Question",
						"name": "How can I ask questions anonymously on 9takes?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "On 9takes, you can ask questions anonymously by creating an account using your Enneagram personality type as your identity. This allows you to maintain privacy while engaging in meaningful discussions."
						}
					},
					{
						"@type": "Question",
						"name": "What is the give-first commenting system?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "The give-first system requires you to share your own perspective before viewing others' responses. This encourages authentic participation and reduces bias from seeing other answers first."
						}
					},
					{
						"@type": "Question",
						"name": "How do personality types work on 9takes?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "9takes uses the Enneagram personality system (types 1-9). Each user identifies with a type, allowing you to see how different personality types respond to the same questions."
						}
					}
				]
			}
		}
	</script>
</svelte:head>

<ErrorBoundary onError={(error) => console.error('Questions page error:', error)}>
<div
	class="questions-container"
	class:no-animation={!transitionEnabled}
	in:fade={{ duration }}
>
	<!-- Header Section -->
	<header class="questions-header">
		{#if data?.user?.id}
			<h1 in:fly={{ y: -20, duration, delay: 150 }}>
				Explore your psychology and those around you
			</h1>
		{:else}
			<h1 in:fly={{ y: -20, duration, delay: 150 }}>
				Explore your psychology and those around you
			</h1>
			
			<div class="header-content" in:fly={{ y: 20, duration, delay: 300 }}>
				<p class="header-description">
					Welcome to 9takes, where you can ask personal questions anonymously and receive answers from
					diverse perspectives. Our unique platform allows you to explore life's questions through the
					lens of personality types, ensuring a rich and varied discussion.
				</p>
				<div class="stats-row">
					<div class="stat">
						<strong>{data.totalQuestions || 0}</strong>
						<span>questions asked</span>
					</div>
					<div class="stat">
						<strong>{data.totalAnswers || 0}</strong>
						<span>answers shared</span>
					</div>
				</div>
			</div>
		{/if}
	</header>

	<!-- Search Section -->
	<div class="search-section" in:fly={{ y: 20, duration, delay: 450 }}>
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
		class="categories-section"
		in:fly={{ y: 20, duration, delay: 600 }}
	>
		<div class="categories-header">
			<h2>Browse by Category</h2>
			<span class="category-count">{displayedCategories.length} categories</span>
		</div>
		<div class="categories-container">
			<button
				class="category-pill"
				class:active={selectedCategory === null}
				on:click={() => filterByCategory(null)}
				disabled={loading}
			>
				All Questions
			</button>
			{#each displayedCategories as category (category.id)}
				<button
					class="category-pill"
					class:active={selectedCategory === category.id}
					on:click={() => filterByCategory(category.id)}
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
		on:dismiss={() => errorMessage = ''}
	/>

	<!-- Questions List -->
	<section
		class="questions-section"
		in:fly={{ y: 20, duration, delay: 750 }}
	>
		{#if loading}
			<!-- Loading skeletons -->
			<div class="skeleton-list">
				{#each Array(5) as _, i}
					<QuestionItemSkeleton />
				{/each}
			</div>
		{:else if selectedCategory}
			<!-- Filtered view -->
			<div class="questions-list">
				<h3 class="category-title">
					{displayedCategories.find(c => c.id === selectedCategory)?.category_name || 'Category'}
				</h3>
				{#if filteredQuestions.length === 0}
					<p class="no-questions">No questions found in this category.</p>
				{:else}
					{#each filteredQuestions as questionData (questionData.id)}
						<QuestionItem {questionData} on:questionRemoved={() => invalidateAll()} />
					{/each}
				{/if}
			</div>
		{:else}
			<!-- Grouped by category view -->
			{#each Object.entries(categories) as [categoryName, questions]}
				<div class="category-group">
					<h3 class="category-title" id={categoryName.replace(/\s+/g, '-')}>
						{categoryName}
					</h3>
					<div class="questions-list">
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
				class="load-more-trigger"
				class:loading={loadingMore}
			>
				{#if loadingMore}
					<div class="flex justify-center py-8">
						<Spinner size="md" color="primary">
							Loading more questions...
						</Spinner>
					</div>
				{/if}
			</div>
		{/if}
	</section>

	<!-- How It Works Section (for non-users) -->
	{#if !data?.user?.id}
		<section
			class="how-it-works"
			in:fly={{ y: 20, duration, delay: 900 }}
		>
			<h2>How It Works</h2>
			<ol>
				<li>Anonymously answer questions to see other answers</li>
				<li><strong>Sign up to ask your questions anonymously</strong></li>
				<li>Receive answers from diverse perspectives</li>
				<li>Sort comments by personality type and learn yours</li>
			</ol>
			<button
				class="cta-button"
				on:click={() => goToCreateQuestionPage('')}
				aria-label="Ask your question now"
			>
				Ask Your Question Now
			</button>
		</section>
	{/if}
</div>
</ErrorBoundary>

<style>
	.questions-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem;
		background-color: white;
		border-radius: 0.5rem;
		box-shadow: var(--shadow-md);
		border: 1px solid var(--border-color);
	}

	.questions-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.questions-header h1 {
		font-size: 2rem;
		font-weight: 700;
		margin: 1rem 0;
		color: var(--text-primary);
	}

	.header-content {
		margin-top: 1.5rem;
	}

	.header-description {
		max-width: 48rem;
		margin: 0 auto 1.5rem;
		color: var(--text-secondary);
		line-height: 1.6;
	}

	.stats-row {
		display: flex;
		justify-content: center;
		gap: 3rem;
		margin: 1.5rem 0;
	}

	.stat {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
	}

	.stat strong {
		font-size: 1.5rem;
		color: var(--primary);
	}

	.stat span {
		font-size: 0.875rem;
		color: var(--text-secondary);
	}

	.search-section {
		margin-bottom: 2rem;
		position: relative;
		z-index: 20;
	}

	.categories-section {
		background: linear-gradient(to bottom, #f8f9fa, #ffffff);
		border-radius: 0.75rem;
		padding: 1rem;
		margin-bottom: 1.5rem;
		border: 1px solid var(--border-color);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	}
	

	.categories-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.75rem;
	}

	.categories-section h2 {
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0;
	}

	.category-count {
		font-size: 0.75rem;
		color: var(--text-secondary);
	}

	.categories-container {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
		max-height: 120px;
		overflow-y: auto;
		padding: 0.25rem;
		scrollbar-width: thin;
		scrollbar-color: var(--medium-gray) transparent;
	}
	
	.categories-container::-webkit-scrollbar {
		width: 6px;
	}
	
	.categories-container::-webkit-scrollbar-track {
		background: transparent;
	}
	
	.categories-container::-webkit-scrollbar-thumb {
		background-color: var(--medium-gray);
		border-radius: 3px;
	}
	
	.categories-container::-webkit-scrollbar-thumb:hover {
		background-color: var(--dark-gray);
	}

	.category-pill {
		flex-shrink: 0;
		padding: 0.375rem 0.875rem;
		border: 1px solid #e2e8f0;
		border-radius: 20px;
		background-color: white;
		color: var(--text-primary);
		font-size: 0.8125rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s ease;
		white-space: nowrap;
		line-height: 1.3;
	}

	.category-pill:hover:not(:disabled) {
		background-color: #f0f4ff;
		border-color: var(--primary);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
	}

	.category-pill:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.category-pill.active {
		background-color: var(--primary);
		color: white;
		border-color: var(--primary);
	}

	.questions-section {
		background-color: white;
		border-radius: 0.5rem;
		padding: 1.25rem;
		border: 1px solid var(--border-color);
		min-height: 300px;
	}

	.skeleton-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.category-group {
		margin-bottom: 1.5rem;
	}

	.category-group:last-child {
		margin-bottom: 0;
	}

	.category-title {
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: var(--text-primary);
		scroll-margin-top: 1rem;
		padding: 0.25rem 0;
		border-bottom: 1px solid #f0f0f0;
	}

	.questions-list {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.no-questions {
		text-align: center;
		color: var(--text-secondary);
		padding: 2rem;
	}

	.load-more-trigger {
		height: 80px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 1rem;
	}

	.loading-spinner {
		width: 32px;
		height: 32px;
		border: 3px solid var(--light-gray);
		border-top-color: var(--primary);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.how-it-works {
		background-color: var(--lightest-gray);
		border-radius: 0.5rem;
		padding: 1.5rem;
		margin-top: 2rem;
		border: 1px solid var(--border-color);
	}

	.how-it-works h2 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: var(--text-primary);
	}

	.how-it-works ol {
		margin: 1rem 0 1.5rem 1.5rem;
		color: var(--text-secondary);
	}

	.how-it-works li {
		margin-bottom: 0.5rem;
		line-height: 1.6;
	}

	.cta-button {
		width: 100%;
		padding: 1rem 1.5rem;
		background-color: var(--primary);
		color: white;
		border: none;
		border-radius: 0.5rem;
		font-size: 1.125rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.cta-button:hover {
		background-color: var(--primary-dark);
		transform: translateY(-2px);
		box-shadow: var(--shadow-md);
	}

	.cta-button:focus {
		outline: 2px solid var(--primary);
		outline-offset: 2px;
	}

	/* Mobile Styles */
	@media (max-width: 768px) {
		.questions-container {
			padding: 0.5rem;
			border-radius: 0;
		}

		.questions-header h1 {
			font-size: 1.5rem;
		}

		.header-description {
			font-size: 0.875rem;
		}

		.stats-row {
			gap: 1.5rem;
		}

		.stat strong {
			font-size: 1.25rem;
		}

		.categories-section {
			padding: 0.75rem;
			margin-bottom: 1rem;
		}
		
		.categories-header {
			margin-bottom: 0.5rem;
		}
		
		.categories-section h2 {
			font-size: 0.9375rem;
		}
		
		.category-count {
			font-size: 0.6875rem;
		}
		
		.categories-container {
			max-height: 100px;
			gap: 0.25rem;
		}
		
		.questions-section,
		.how-it-works {
			padding: 1rem;
		}

		.category-pill {
			padding: 0.3125rem 0.75rem;
			font-size: 0.75rem;
		}
		
		.category-title {
			font-size: 0.9375rem;
			margin-bottom: 0.375rem;
		}
		
		.category-group {
			margin-bottom: 1rem;
		}

		.cta-button {
			font-size: 1rem;
		}
	}

	@media (max-width: 576px) {
		.stats-row {
			flex-direction: column;
			gap: 1rem;
		}
	}

	/* Reduced motion */
	.no-animation * {
		animation: none !important;
		transition: none !important;
	}

	@media (prefers-reduced-motion: reduce) {
		* {
			animation: none !important;
			transition: none !important;
		}
	}
</style>