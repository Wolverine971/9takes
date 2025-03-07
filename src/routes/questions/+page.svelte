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
	class="rounded-lg border border-gray-200 bg-white bg-opacity-90 p-4 shadow-sm backdrop-blur-sm md:p-6"
	class:no-animation={!transitionEnabled}
	in:fade={{ duration }}
>
	{#if data?.session?.user?.id}
		<h1 in:fly={{ y: -20, duration, delay: 150 }} class="my-4 mb-2 text-2xl font-bold md:text-3xl">
			Explore your psychology and those around you
		</h1>
	{:else}
		<h1
			in:fly={{ y: -20, duration, delay: 150 }}
			class="my-4 mb-2 text-center text-2xl font-bold md:text-3xl"
		>
			Explore your psychology and those around you
		</h1>

		<div class="mb-6 text-center" in:fly={{ y: 20, duration, delay: 300 }}>
			<p class="mx-auto my-2 max-w-3xl">
				Welcome to 9takes, where you can ask personal questions anonymously and receive answers from
				diverse perspectives. Our unique platform allows you to explore life's questions through the
				lens of personality types, ensuring a rich and varied discussion.
			</p>
			<div class="xs:gap-4 my-4 flex flex-col justify-center gap-6 md:flex-row">
				<p><strong class="font-semibold">{totalQuestions}</strong> questions asked</p>
				<p><strong class="font-semibold">{totalAnswers}</strong> answers shared</p>
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

	<section
		class="my-4 rounded border border-gray-200 bg-white p-4 transition-shadow duration-300 hover:shadow-md md:my-6"
		in:fly={{ y: 20, duration, delay: 600 }}
	>
		<h2 class="mb-3 text-xl font-semibold">Categories of Questions</h2>
		<div class="scrollbar-thin flex max-h-[150px] flex-wrap gap-1 overflow-y-auto py-2">
			{#each data.subcategoryTags as category}
				{#if category}
					<a
						href={`/questions/categories/${category.category_name.split(' ').join('-')}`}
						class="shimmer-button m-1 inline-flex items-center justify-center rounded bg-indigo-600 px-2 py-1 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md"
						data-sveltekit-preload-data="tap"
					>
						{category.category_name}
					</a>
				{/if}
			{/each}
		</div>
	</section>

	<section
		class="my-4 rounded border border-gray-200 bg-white p-4 transition-shadow duration-300 hover:shadow-md md:my-6"
		in:fly={{ y: 20, duration, delay: 750 }}
	>
		<!-- <h2 class="text-xl font-semibold mb-3">Recent Questions</h2> -->
		{#each data.subcategoryTags as category}
			{#if categories[category.category_name]?.length}
				<div class="my-4 md:my-6" in:fly={{ y: 20, duration, delay: 600 }}>
					<h3
						class="my-4 mb-2 scroll-mt-8 text-lg font-semibold"
						id={category.category_name.split(' ').join('-')}
					>
						{category.category_name}
					</h3>
					<div class="flex flex-col gap-1">
						{#each categories[category.category_name] as questionData (questionData.id)}
							<QuestionItem {questionData} on:questionRemoved={() => invalidateAll()} />
						{/each}
					</div>
				</div>
			{/if}
		{/each}
	</section>

	{#if !data?.session?.user?.id}
		<section
			class="my-4 rounded border border-gray-200 bg-white p-4 transition-shadow duration-300 hover:shadow-md md:my-6"
			in:fly={{ y: 20, duration, delay: 900 }}
		>
			<h2 class="mb-3 text-xl font-semibold">How It Works</h2>
			<ol class="my-4 list-decimal pl-6">
				<li class="mb-2">Anonymously answer questions to see other answers</li>
				<li class="mb-2">
					<strong class="font-semibold">Sign up to ask your questions anonymously</strong>
				</li>
				<li class="mb-2">Receive answers from diverse perspectives</li>
				<li class="mb-2">Sort comments by personality type and learn yours</li>
			</ol>
			<button
				class="mx-auto my-4 flex w-full cursor-pointer items-center justify-center rounded border-none bg-indigo-600 px-4 py-4 text-lg font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md focus:outline-offset-2 focus:outline-indigo-700 md:w-auto"
				on:click={() => goToCreateQuestionPage('')}
				aria-label="Ask your question now"
			>
				Ask Your Question Now
			</button>
		</section>
	{/if}
</div>

<style>
	/* Only adding styles that might be hard to implement with pure Tailwind */
	.no-animation * {
		animation: none !important;
		transition: none !important;
	}

	/* Custom scrollbar styles */
	.scrollbar-thin::-webkit-scrollbar {
		width: 6px;
		height: 6px;
	}

	.scrollbar-thin::-webkit-scrollbar-thumb {
		background-color: rgba(0, 0, 0, 0.2);
		border-radius: 3px;
	}

	.scrollbar-thin {
		scrollbar-width: thin;
		overscroll-behavior-y: contain;
	}

	/* Adding extra small screen breakpoint */
	@media (max-width: 576px) {
		.xs\:gap-4 {
			gap: 1rem;
		}
	}

	/* Accessibility */
	@media (prefers-reduced-motion: reduce) {
		* {
			animation: none !important;
			transition: none !important;
		}
	}
</style>
