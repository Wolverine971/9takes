<!-- // Get all questions -->
<script lang="ts">
	import QuestionItem from '$lib/components/questions/QuestionItem.svelte';
	// import { supabase } from '$lib/supabase';

	import type { PageData } from './$types';
	import SearchQuestion from '$lib/components/questions/SearchQuestion.svelte';
	import { deserialize } from '$app/forms';
	import { notifications } from '$lib/components/molecules/notifications';
	import { goto } from '$app/navigation';
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
	{#if categories}
		{#each data.subcategoryTags as category}
			{#if categories[category.tag_name]?.length}
				<div>
					<h3>{category.tag_name}</h3>
					<div>
						{#each categories[category.tag_name] as questionData}
							<QuestionItem
								questionData={questionData.questions}
								isAdmin={data?.session?.user?.id}
							/>
						{/each}
					</div>
				</div>
			{/if}
		{/each}
	{/if}
</div>

<style lang="scss">
</style>
