<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { goto, invalidateAll } from '$app/navigation';
	import QuestionItem from '$lib/components/questions/QuestionItem.svelte';
	import SearchQuestion from '$lib/components/questions/SearchQuestion.svelte';
	import type { PageData } from './$types';
	import { browser } from '$app/environment';

	export let data: PageData;

	// Memoize categories processing to prevent unnecessary recalculations
	$: categories = processQuestionsAndTags(data.questionsAndTags);
	$: totalQuestions = categories ? Object.values(categories).flat().length : 0;
	$: totalAnswers = categories
		? Object.values(categories)
				.flat()
				.reduce((sum, q) => sum + (q?.comment_count || 0), 0)
		: 0;

	function processQuestionsAndTags(questionsAndTags) {
		if (!questionsAndTags) return {};

		const questionUrls = new Set();
		return questionsAndTags.reduce((acc, curr) => {
			if (!questionUrls.has(curr.url)) {
				const key = curr.tag_name;
				questionUrls.add(curr.url);
				if (!acc[key]) acc[key] = [];
				acc[key].push(curr);
			}
			return acc;
		}, {});
	}

	function goToCreateQuestionPage(detail: string) {
		if (!data?.session?.user?.id) {
			goto('/register', { invalidateAll: true });
			return;
		}
		const url = detail
			? `/questions/create/?question=${encodeURIComponent(detail)}`
			: '/questions/create/';
		goto(url, { invalidateAll: true });
	}

	// Set initial animation value only for client-side rendering
	const transitionEnabled =
		browser && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const duration = transitionEnabled ? 300 : 0;
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
			"@type": "WebPage",
			"name": "Ask Questions Anonymously & Get Answers",
			"description": "A platform for asking personal questions anonymously and receiving answers based on personality types.",
			"mainEntity": {
				"@type": "QAPage",
				"mainEntity": {
					"@type": "Question",
					"name": "How can I ask questions anonymously on 9takes?",
					"acceptedAnswer": {
						"@type": "Answer",
						"text": "On 9takes, you can ask questions anonymously by creating an account using your Enneagram personality type as your identity. This allows you to maintain privacy while engaging in meaningful discussions."
					}
				}
			}
		}
	</script>
</svelte:head>

<div
	class="background-area-box-tint"
	class:no-animation={!transitionEnabled}
	in:fade={{ duration }}
>
	{#if data?.session?.user?.id}
		<h1 in:fly={{ y: -20, duration, delay: 150 }} class="page-title">Question List</h1>
	{:else}
		<h1 in:fly={{ y: -20, duration, delay: 150 }} class="page-title centered">
			Ask Questions Anonymously & Get Answers
		</h1>

		<div class="intro" in:fly={{ y: 20, duration, delay: 300 }}>
			<p>
				Welcome to 9takes, where you can ask personal questions anonymously and receive answers from
				diverse perspectives. Our unique platform allows you to explore life's questions through the
				lens of personality types, ensuring a rich and varied discussion.
			</p>
			<div class="stats">
				<p><strong>{totalQuestions}</strong> questions asked</p>
				<p><strong>{totalAnswers}</strong> answers shared</p>
			</div>
		</div>
	{/if}

	<div in:fly={{ y: 20, duration, delay: 450 }}>
		<SearchQuestion
			{data}
			on:createQuestion={({ detail }) => goToCreateQuestionPage(detail)}
			on:questionSelected={({ detail }) => goto(`/questions/${detail.url}`)}
		/>
	</div>

	<section class="question-category-section" in:fly={{ y: 20, duration, delay: 600 }}>
		<h2>Explore Questions by Category</h2>
		<div class="big-tags scrollable-div">
			{#each data.subcategoryTags as category}
				{#if category}
					<a
						href={`/questions/categories/${category.category_name.split(' ').join('-')}`}
						class="tag shimmer-button"
						data-sveltekit-preload-data="tap"
					>
						{category.category_name}
					</a>
				{/if}
			{/each}
		</div>
	</section>

	<section class="recent-questions" in:fly={{ y: 20, duration, delay: 750 }}>
		<h2>Recent Questions</h2>
		{#each data.subcategoryTags as category}
			{#if categories[category.category_name]?.length}
				<div class="category-section" in:fly={{ y: 20, duration, delay: 600 }}>
					<h3 id={category.category_name.split(' ').join('-')}>{category.category_name}</h3>
					<div class="question-list">
						{#each categories[category.category_name] as questionData (questionData.id)}
							<QuestionItem {questionData} on:questionRemoved={() => invalidateAll()} />
						{/each}
					</div>
				</div>
			{/if}
		{/each}
	</section>

	{#if !data?.session?.user?.id}
		<section class="how-it-works" in:fly={{ y: 20, duration, delay: 900 }}>
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

<style lang="scss">
	/* Base variables */
	$spacing-xs: 0.25rem;
	$spacing-sm: 0.5rem;
	$spacing-md: 1rem;
	$spacing-lg: 1.5rem;
	$spacing-xl: 2rem;

	$breakpoint-sm: 576px;
	$breakpoint-md: 768px;
	$breakpoint-lg: 992px;
	$breakpoint-xl: 1200px;

	$transition-duration: 0.3s;
	$border-radius: var(--base-border-radius, 3px);

	/* Mixins */
	@mixin section-container {
		margin: $spacing-md 0;
		padding: $spacing-md;
		border: 1px solid var(--color-border);
		border-radius: $border-radius;
		background-color: var(--color-background-secondary);
		transition: box-shadow $transition-duration ease;

		@media (max-width: $breakpoint-md) {
			margin: $spacing-sm 0;
			padding: $spacing-sm;
		}
	}

	@mixin flex-center {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* Utility classes */
	.no-animation * {
		animation: none !important;
		transition: none !important;
	}

	.centered {
		text-align: center;
	}

	/* Page elements */
	.page-title {
		margin: $spacing-md 0 $spacing-sm;
		padding: 0;

		&.centered {
			text-align: center;
		}
	}

	.intro {
		margin-bottom: $spacing-lg;
		text-align: center;

		p {
			margin: $spacing-sm 0;
			max-width: 800px;
			margin-left: auto;
			margin-right: auto;
		}

		.stats {
			display: flex;
			justify-content: center;
			gap: $spacing-lg;
			margin: $spacing-md 0;

			@media (max-width: $breakpoint-sm) {
				gap: $spacing-md;
				flex-direction: column;

				p {
					margin: $spacing-xs 0;
				}
			}
		}
	}

	.question-category-section,
	.recent-questions,
	.how-it-works {
		@include section-container;

		&:hover {
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
		}
	}

	.big-tags {
		display: flex;
		flex-wrap: wrap;
		max-height: 150px;
		overflow-y: auto;
		scrollbar-width: thin;
		overscroll-behavior-y: contain;
		padding: $spacing-sm 0;
		gap: $spacing-xs;

		&::-webkit-scrollbar {
			width: 6px;
			height: 6px;
		}

		&::-webkit-scrollbar-thumb {
			background-color: rgba(0, 0, 0, 0.2);
			border-radius: 3px;
		}
	}

	.tag {
		@include flex-center;
		border-radius: $border-radius;
		font-size: 0.8rem;
		font-weight: bold;
		margin: $spacing-xs;
		padding: $spacing-xs $spacing-sm;
		background-color: var(--accent);
		color: white;
		transition: all $transition-duration ease;

		&:hover {
			background-color: var(--color-accent-hover);
			transform: translateY(-2px);
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		}
	}

	.category-section {
		margin: $spacing-md 0;

		h3 {
			margin: $spacing-md 0 $spacing-sm;
			padding: 0;
			scroll-margin-top: $spacing-xl;
		}
	}

	.question-list {
		display: flex;
		flex-direction: column;
		gap: $spacing-xs;
	}

	.cta-button {
		@include flex-center;
		background-color: var(--accent);
		color: white;
		margin: $spacing-md auto;
		border: none;
		border-radius: $border-radius;
		padding: $spacing-md;
		font-size: 1.1rem;
		font-weight: bold;
		cursor: pointer;
		transition: all $transition-duration ease;

		&:hover {
			background-color: var(--color-accent-hover);
			transform: translateY(-2px);
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		}

		&:focus {
			outline: 2px solid var(--color-accent-hover);
			outline-offset: 2px;
		}
	}

	.how-it-works {
		ol {
			padding-left: $spacing-lg;
			margin: $spacing-md 0;

			li {
				margin-bottom: $spacing-sm;
			}
		}
	}

	/* Media Queries */
	@media (prefers-reduced-motion: reduce) {
		* {
			animation: none !important;
			transition: none !important;
		}
	}

	@media (max-width: $breakpoint-md) {
		.cta-button {
			width: 100%;
			padding: $spacing-sm $spacing-md;
		}
	}
</style>
