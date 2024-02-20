<script lang="ts">
	import QuestionItem from '$lib/components/questions/QuestionItem.svelte';

	import type { PageData } from './$types';
	import SearchQuestion from '$lib/components/questions/SearchQuestion.svelte';
	import { notifications } from '$lib/components/molecules/notifications';
	import { goto, invalidateAll } from '$app/navigation';
	import RightIcon from '$lib/components/icons/rightIcon.svelte';

	// interface QuestionsData extends PageData {
	// 	questions: any[];
	// 	count: number;
	// }

	export let data: PageData;

	const questionUrls: any = {};
	const questionCategories: any = {};
	let count = 20;

	const categories = data.questionsAndTags?.reduce((acc: any, curr: any) => {
		if (!questionUrls[curr.url]) {
			const key = curr.tag_name;
			const subcategoryId = curr.subcategory_id;
			questionCategories[subcategoryId] =
				questionCategories[subcategoryId] && questionCategories[subcategoryId].length
					? [...questionCategories[subcategoryId], curr]
					: [curr];

			acc[key] = acc[key] || [];
			acc[key].push(curr);
			questionUrls[curr.url] = 1;
		}

		return acc;
	}, {});

	const goToCreateQuestionPage = () => {
		// cannot create question if you are not logged in
		if (!data?.session?.user?.id) {
			// notifications.warning('Must be logged in to ask a question', 3000);
			goto(`/register`, { invalidateAll: true });
		}

		setTimeout(() => {
			goto(`/questions/create/`, { invalidateAll: true });
		}, 0);
	};
	// const findParent = (qTag) => {
	// 	const subcategory = data.categories.find((c) => c.id === qTag.question_tag.subcategory_id);
	// 	const parentSubcategory = data.categories.find((c) => c.id === subcategory.parent_id);
	// 	return parentSubcategory.subcategory_name;
	// };
</script>

<svelte:head>
	<title>9takes | Questions</title>
	<meta name="description" content="User generated questions with comments sorted by personality" />
	<link rel="canonical" href="https://9takes.com/questions" />
</svelte:head>

<div>
	<h1 style="display: flex; justify-content: space-between; align-content: center">
		<span>{data?.session?.user?.id ? 'Search or ask a question' : 'Search Questions'} </span>
	</h1>

	<SearchQuestion {data} />

	<div class="question-category-div">
		<h2 style="margin-top: 0;">Question categories</h2>
		<div class="big-tags">
			{#each data.subcategoryTags as category}
				{#if category}
					<a
						href={`/questions/categories/${category?.tag_name.split(' ').join('-')}`}
						class="tag"
						data-sveltekit-preload-data="tap"
						>{category?.tag_name}
					</a>
				{/if}
			{/each}
		</div>
	</div>

	{#if categories}
		{#each data.subcategoryTags as category}
			{#if categories[category.tag_name]?.length}
				<div>
					<h3 id={category.tag_name} style="margin: 0.5rem 0 .25rem 0">{category.tag_name}</h3>
					<div>
						{#each categories[category.tag_name] as questionData}
							<QuestionItem {questionData} on:questionRemoved={() => invalidateAll()} />
						{/each}
					</div>
				</div>
			{/if}
		{/each}
	{/if}
</div>

<style lang="scss">
	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		padding: 0;
	}

	.question-category-div {
		margin: 1rem 0;
		padding: 1rem;
		// border: 1px solid var(--color-theme-purple-v);
		border: var(--classic-border);
		border-radius: 5px;
	}
	.tags-div {
		margin: 0.5rem;
		padding: 0.5rem;
		display: flex;
		flex-direction: column;
		max-height: 100px;
		overflow-y: scroll;
	}
	.big-tags {
		display: flex;
		flex-wrap: wrap;
		max-height: 150px;
		overflow-y: auto;
		overscroll-behavior-y: contain;
	}

	.tag {
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 5px;
		font-size: 0.8rem;
		margin: 0.25rem;
		padding: 0.25rem;
		border: var(--classic-border);
		width: fit-content;
		cursor: pointer;
		&:hover {
			background-color: var(--color-paladin-1);
		}
	}
</style>
