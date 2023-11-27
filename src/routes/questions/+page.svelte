<!-- // Get all questions -->
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

	let count = 20;

	export let data: PageData;

	const questionUrls: any = {};

	const categories = data.questionsAndTags?.reduce((acc: any, curr: any) => {
		if (!questionUrls[curr.questions.url]) {
			const key = curr.question_tag.tag_name;

			acc[key] = acc[key] || [];
			acc[key].push(curr);
			questionUrls[curr.questions.url] = 1;
		}

		return acc;
	}, {});

	const goToCreateQuestionPage = () => {
		// cannot create question if you are not logged in
		if (!data?.session?.user?.id) {
			notifications.warning('Must be logged in to ask a question', 3000);
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
		<span>{data?.session?.user?.id ? 'Search and ask questions' : 'Search Questions'} </span>
		{#if !data?.session?.user?.id}
			<button
				class="btn btn-primary"
				style="display: flex; 
			justify-content: space-between; 
			align-items: center"
				type="button"
				on:click={() => {
					goToCreateQuestionPage();
				}}
				title={data?.session?.user?.id ? 'Create a question' : 'Register to ask a question'}
			>
				{data?.session?.user?.id ? 'Create question' : 'Register to ask a question'}
				<RightIcon iconStyle={'margin-left: .5rem;'} height={'1rem'} fill={'#5407d9'} />
			</button>
		{/if}
	</h1>

	<SearchQuestion {data} />
	<!-- <p>Count {data.count}</p> -->

	<!-- <QuestionTags /> -->

	<div class="question-category-div">
		<h2 style="margin-top: 0;">Question categories</h2>
		<div class="big-tags">
			{#each data.subcategoryTags as category}
				{#if category}
					<!-- <div>
				<h3 id={category.subcategory_name}>{category.subcategory_name}</h3>
				<div>
					{#each categories[category.subcategory_name] as questionData} -->
					<a href="#{category.tag_name}" class="tag">{category.tag_name} </a>
					<!-- {/each} -->
					<!-- </div>
			</div> -->
				{/if}
			{/each}
		</div>
	</div>

	{#if categories}
		{#each data.subcategoryTags as category}
			{#if categories[category.tag_name]?.length}
				<div>
					<h3 id={category.tag_name}>{category.tag_name}</h3>
					<div>
						{#each categories[category.tag_name] as questionData}
							<QuestionItem
								questionData={questionData.questions}
								on:questionRemoved={() => invalidateAll()}
							/>
						{/each}
					</div>
				</div>
			{/if}
		{/each}
	{/if}
</div>

<style lang="scss">
	.question-category-div {
		margin: 1rem 0;
		padding: 1rem;
		// border: 1px solid var(--color-p-light);
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
		max-width: 800px;
		max-height: 500px;
		overflow-y: scroll;
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
