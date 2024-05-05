<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { QuestionItem } from '$lib/components';
	import SearchQuestion from '$lib/components/questions/SearchQuestion.svelte';

	/** @type {import('./$types').PageData} */
	export let data: any;
</script>

<svelte:head>
	<title>{`9takes Question Categories | ${data.questionTag?.tag_name}`}</title>
	<meta name="description" content={`9takes Question | ${data.questionTag?.tag_name}`} />
	<link
		rel="canonical"
		href={`https://9takes.com/questions/categories/${data.questionTag?.tag_name
			.split(' ')
			.join('-')}`}
	/>
</svelte:head>

<div>
	<SearchQuestion {data} />
	<h1 class="question-box" id="question-box" itemprop="name">
		{data?.questionTag?.tag_name}
	</h1>

	<div>
		{#each data.questionCategories as questionData}
			<QuestionItem {questionData} on:questionRemoved={() => invalidateAll()} />
		{/each}
	</div>
</div>

<style lang="scss">
	.question-box {
		width: -webkit-fill-available;
		border-radius: 5px;
		// height: 24px;
		// padding: 0.5rem 1rem;
		color: hsl(222, 15%, 19%);
		font-size: 1.2rem;
		// box-sizing: content-box;

		margin: 0.25rem;
	}
</style>
