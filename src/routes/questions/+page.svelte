<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { goto, invalidateAll } from '$app/navigation';
	import QuestionItem from '$lib/components/questions/QuestionItem.svelte';
	import SearchQuestion from '$lib/components/questions/SearchQuestion.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: categories = processQuestionsAndTags(data.questionsAndTags);

	function processQuestionsAndTags(questionsAndTags) {
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
	let totalQuestions;
	let totalAnswers;

	$: if (categories) {
		console.log(categories);
		totalQuestions = Object.values(categories).flat().length;
		totalAnswers = Object.values(categories)
			.flat()
			.reduce((sum, q) => sum + q?.comment_count, 0);
	}
</script>

<svelte:head>
	<title>Ask Questions Anonymously & Get Answers | 9takes</title>
	<meta
		name="description"
		content="Join 9takes to ask personal questions anonymously and get answers from diverse perspectives. Explore life's questions through the lens of personality types."
	/>
	<link rel="canonical" href="https://9takes.com/questions" />
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

<div class="background-area-box-tint" in:fade={{ duration: 300 }}>
	{#if data?.session?.user?.id}
		<h1 in:fly={{ y: -20, duration: 300, delay: 150 }} style="margin-top: 1rem;">Question List</h1>
	{:else}
		<h1
			in:fly={{ y: -20, duration: 300, delay: 150 }}
			style="text-align: center; margin-top: 1rem;"
		>
			Ask Questions Anonymously & Get Answers
		</h1>

		<div class="intro" in:fly={{ y: 20, duration: 300, delay: 300 }}>
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

	<div in:fly={{ y: 20, duration: 300, delay: 450 }}>
		<SearchQuestion
			{data}
			on:createQuestion={({ detail }) => goToCreateQuestionPage(detail)}
			on:questionSelected={({ detail }) => goto(`/questions/${detail.url}`)}
		/>
	</div>

	<div class="question-category-div" in:fly={{ y: 20, duration: 300, delay: 600 }}>
		<h2>Explore Questions by Category</h2>
		<div class="big-tags scrollable-div">
			{#each data.subcategoryTags as category}
				{#if category}
					<a
						href={`/questions/categories/${category.tag_name.split(' ').join('-')}`}
						class="tag shimmer-button"
						data-sveltekit-preload-data="tap"
					>
						{category.tag_name}
					</a>
				{/if}
			{/each}
		</div>
	</div>

	<div class="recent-questions" in:fly={{ y: 20, duration: 300, delay: 750 }}>
		<h2>Recent Questions</h2>
		{#each data.subcategoryTags as category}
			{#if categories[category.tag_name]?.length}
				<div in:fly={{ y: 20, duration: 300, delay: 600 }}>
					<h3 id={category.tag_name}>{category.tag_name}</h3>
					<div>
						{#each categories[category.tag_name] as questionData}
							<QuestionItem {questionData} on:questionRemoved={() => invalidateAll()} />
						{/each}
					</div>
				</div>
			{/if}
		{/each}
	</div>

	{#if !data?.session?.user?.id}
		<div class="how-it-works" in:fly={{ y: 20, duration: 300, delay: 900 }}>
			<h2>How It Works</h2>
			<ol>
				<li>Anonymously answer questions to see other answers</li>
				<li><strong>Sign up to ask your questions anonymously</strong></li>
				<li>Receive answers from diverse perspectives</li>
				<li>Sort comments by personality type and learn yours</li>
			</ol>
			<button class="cta-button" on:click={() => goToCreateQuestionPage('')}
				>Ask Your Question Now</button
			>
		</div>
	{/if}

	<!-- <div class="testimonials" in:fly={{ y: 20, duration: 300, delay: 1050 }}>
		<h2>What Our Users Say</h2>
		<blockquote>
			"9takes has given me a safe space to ask questions I've always been afraid to ask. The diverse
			perspectives I receive are invaluable." - Anonymous User
		</blockquote>
		<blockquote>
			"I love how I can explore different viewpoints on complex issues. It's truly eye-opening!" -
			Happy 9takes Member
		</blockquote>
	</div> -->
</div>

<style lang="scss">
	$base-margin: 0.5rem;
	$base-padding: 1rem;
	$transition-duration: 0.3s;

	%reset-spacing {
		padding: 0;
		margin: $base-margin 0 $base-margin / 2 0;
	}

	%flex-center {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		@extend %reset-spacing;
	}

	.intro {
		margin-bottom: $base-margin * 2;
		text-align: center;

		.stats {
			display: flex;
			justify-content: center;
			gap: $base-margin * 2;
			margin: $base-margin 0;
		}
	}

	.cta-button {
		@extend %flex-center;
		background-color: var(--accent);
		color: var(--color-text-inverse);
		margin: auto;
		border: none;
		border-radius: var(--base-border-radius);
		padding: $base-padding;
		font-size: 1.1rem;
		font-weight: bold;
		cursor: pointer;
		transition: all $transition-duration ease;

		&:hover {
			background-color: var(--color-accent-hover);
			transform: translateY(-2px);
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		}
	}

	.question-category-div,
	.recent-questions,
	.how-it-works,
	.testimonials {
		margin: $base-margin * 2 0;
		padding: $base-padding;
		border: 1px solid var(--color-border);
		border-radius: var(--base-border-radius);
		background-color: var(--color-background-secondary);
	}

	.big-tags {
		display: flex;
		flex-wrap: wrap;
		max-height: 150px;
		overflow-y: auto;
		overscroll-behavior-y: contain;
		padding: $base-padding / 2 0;
	}

	.tag {
		@extend %flex-center;
		border-radius: var(--base-border-radius);
		font-size: 0.8rem;
		font-weight: bolder;
		margin: $base-margin / 2;
		padding: $base-padding / 2 $base-padding;
		background-color: var(--accent);
		color: var(--color-text-inverse);
		transition: all $transition-duration ease;

		&:hover {
			background-color: var(--color-accent-hover);
			transform: translateY(-2px);
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		}
	}

	.how-it-works ol {
		padding-left: $base-padding * 1.5;
	}

	.testimonials blockquote {
		font-style: italic;
		margin: $base-margin 0;
		padding-left: $base-padding;
		border-left: 3px solid var(--accent);
	}

	@media (max-width: 768px) {
		.question-category-div,
		.recent-questions,
		.how-it-works,
		.testimonials {
			margin: $base-margin * 1 0;
			padding: 0;
		}
	}
</style>
