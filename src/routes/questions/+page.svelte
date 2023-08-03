<!-- // Get all questions -->
<script lang="ts">
	import QuestionItem from '$lib/components/questions/QuestionItem.svelte';
	import { supabase } from '$lib/supabase';

	import type { PageData } from '../$types';
	import SearchQuestion from '$lib/components/questions/SearchQuestion.svelte';
	import { deserialize } from '$app/forms';

	interface QuestionsData extends PageData {
		questions: any[];
		count: number;
	}

	let count = 10;

	export let data: QuestionsData;
	let questions: any[] = data?.questions;
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
			questions = [...questions, ...result.data];
			count = count + 10;
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
