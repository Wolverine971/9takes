<!-- // Get all questions -->
<script lang="ts">
	import QuestionItem from '$lib/components/questions/QuestionItem.svelte';
	// import { supabase } from '$lib/supabase';

	import type { PageData } from './$types';
	import SearchQuestion from '$lib/components/questions/SearchQuestion.svelte';
	import { deserialize } from '$app/forms';

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
	const loadQuestions = async () => {
		let body = new FormData();
		body.append('count', count.toString());

		const resp = await fetch('/questions?/getMoreQuestions', {
			method: 'POST',
			body
		});

		const result: any = deserialize(await resp.text());

		if (result.error) {
			console.log(result.error);
		} else if (result.data) {
			// questions = [...questions, ...result.data];
			count = count + 10;
		}
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
	<h1>Asked questions</h1>

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
							<QuestionItem questionData={questionData.questions} />
						{/each}
					</div>
				</div>
			{/if}
		{/each}
	{/if}
</div>

<style lang="scss">
</style>
