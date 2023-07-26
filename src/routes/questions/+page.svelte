<!-- // Get all questions -->
<script lang="ts">
	import QuestionItem from '$lib/components/questions/QuestionItem.svelte';
	import { supabase } from '$lib/supabase';

	import type { PageData } from '../$types';
	import SearchQuestion from '$lib/components/questions/SearchQuestion.svelte';

	interface QuestionsData extends PageData {
		questions: any[];
		count: number;
	}

	export let data: QuestionsData;
	let questions: any[] = data?.questions;
	const loadQuestions = async () => {
		const { data: moreQuestions, error } = await supabase
			.from('questions')
			.select(`question, id, url`, { count: 'planned' })
			.limit(10);
		if (moreQuestions) {
			questions = [...questions, ...moreQuestions];
		}
	};
</script>

<svelte:head>
	<title>9takes | Questions Page</title>
	<meta name="description" content="User generated questions with comments sorted by personality" />
	<link rel="canonical" href="https://9takes.com/questions" />
</svelte:head>

<div>
	<h1>Asked questions</h1>

	<SearchQuestion {data} />
	<p>Count {data.count}</p>

	{#each questions as questionData}
		<QuestionItem {questionData} />
	{/each}
	{#if data.count > questions.length}
		<button class="btn btn-primary" on:click={() => loadQuestions()} aria-label="Load More">
			Load More
		</button>
	{/if}
</div>

<style lang="scss">
	h1 {
		// padding: var(--card-padding);
		// margin: var(--card-margin);
	}
</style>
