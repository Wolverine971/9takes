<script lang="ts">
	import QuestionItem from '$lib/components/questions/QuestionItem.svelte';
	import type { PageData } from './$types';
	import SearchQuestion from '$lib/components/questions/SearchQuestion.svelte';
	import { goto, invalidateAll } from '$app/navigation';

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
	<title>Get different takes on any Questions</title>
	<meta
		name="description"
		content="User generated questions and answers, can sort by Enneagram personality type but cannot see comments until you comment 😉"
	/>
	<link rel="canonical" href="https://9takes.com/questions" />
</svelte:head>

<div class="background-area-box-tint">
	<h1>Questions</h1>

	<SearchQuestion
		{data}
		on:createQuestion={goToCreateQuestionPage}
		on:questionSelected={({ detail }) => goto(`/questions/${detail.url}`, {})}
	/>

	<div class="question-category-div">
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
			<div>
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
		border: 1px solid white;
		border-radius: var(--base-border-radius);
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
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--base-border-radius);
		font-size: 0.8rem;
		margin: 0.25rem;
		padding: 0.25rem;
		background-color: var(--accent);
		width: fit-content;
		cursor: pointer;

		&:hover {
			background-color: var(--base-white-outline);
		}
	}
</style>
