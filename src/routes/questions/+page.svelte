<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import QuestionItem from '$lib/components/questions/QuestionItem.svelte';
	import SearchQuestion from '$lib/components/questions/SearchQuestion.svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';

	export let data: PageData;

	$: categories = processQuestionsAndTags(data.questionsAndTags);

	function processQuestionsAndTags(questionsAndTags) {
		const questionUrls = new Set();
		return questionsAndTags.reduce((acc, curr) => {
			if (!questionUrls.has(curr.url)) {
				const key = curr.tag_name;
				questionUrls.add(curr.url);
				acc[key] = acc[key] || [];
				acc[key].push(curr);
			}
			return acc;
		}, {});
	}

	function goToCreateQuestionPage({ detail }: { detail: string }) {
		if (!data?.session?.user?.id) {
			goto(`/register`, { invalidateAll: true });
			return;
		}
		const url =
			typeof detail === 'string' ? `/questions/create/?question=${detail}` : '/questions/create/';
		goto(url, { invalidateAll: true });
	}
</script>

<svelte:head>
	<title>Question List</title>
	<meta
		name="description"
		content="Questions on every topic with unbiased answers- sort comments by Enneagram personality type 😉"
	/>
	<link rel="canonical" href="https://9takes.com/questions" />
</svelte:head>

<div class="background-area-box-tint" in:fade={{ duration: 300 }}>
	<h1 in:fly={{ y: -20, duration: 300, delay: 150 }}>Question List</h1>

	<div in:fly={{ y: 20, duration: 300, delay: 300 }}>
		<SearchQuestion
			{data}
			on:createQuestion={goToCreateQuestionPage}
			on:questionSelected={({ detail }) => goto(`/questions/${detail.url}`, {})}
		/>
	</div>

	<div class="question-category-div" in:fly={{ y: 20, duration: 300, delay: 450 }}>
		<h2>Categories</h2>
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

<style lang="scss">
	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		padding: 0;
		margin: 0.5rem 0 0.25rem 0;
	}

	.question-category-div {
		margin: 1rem 0;
		padding: 1rem;
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
		padding: 0.5rem 0;
	}

	.tag {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--base-border-radius);
		font-size: 0.8rem;
		font-weight: bolder;
		margin: 0.25rem;
		padding: 0.5rem 1rem;
		background-color: var(--accent);
		color: var(--color-text-inverse);
		transition: all 0.3s ease;

		&:hover {
			background-color: var(--color-accent-hover);
			transform: translateY(-2px);
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		}
	}
</style>
