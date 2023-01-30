<!-- // Get all questions -->
<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import QuestionItem from '$lib/components/molecules/QuestionItem.svelte';
	import { supabase } from '$lib/supabase';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	import type { PageData } from '../$types';
	export let data: PageData;
	//get all questions

	let questions: any[] = [];
	const loadQuestions = async () => {
		const { data, error } = await supabase
			.from('questions')
			.select(`question, id, url`, { count: 'planned' })
			.limit(10);
		if (data) {
			questions = [...questions, ...data];
		}
	};
	onMount(async () => {
		loadQuestions();
	});

	const goToCreateQuestionPage = () => {
		if (data?.session?.user.id) {
			goto(`/questions/create`, {});
		} else {
			alert('must be logged in');
		}
	};
</script>

<main>
	<h1>Questions</h1>

	<button class="btn btn-primary" on:click={goToCreateQuestionPage}> Create Question </button>
	{#each questions as questionData}
		<QuestionItem {questionData} />
	{/each}
	<button class="btn btn-primary" on:click={() => loadQuestions()} aria-label="Load More"> Load More </button>
</main>



<style lang="scss">


</style>