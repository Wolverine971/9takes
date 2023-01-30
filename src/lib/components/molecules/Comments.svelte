<script lang="ts">
	import { onMount } from 'svelte';
	import Comment from './Comment.svelte';
	import type { Database } from 'src/schema';
	let page = 0;

	let loading = false;

	export let nested: boolean = false;

	export let parentType: string = 'question';

	export let parentData: any;
	let comments: Database['public']['Tables']['comments']['Row'][] = parentData?.comments || [];

	const lastDate = comments?.length ? comments[comments?.length - 1]?.created_at || null : null;
	let comment_count: number = parentData.comment_count;

	const loadMore = async () => {
		loading = true;
		console.log('load comments');
		await fetch(
			`/comments/?type=${parentType}&parentId=${
				parentType === 'question' ? parentData.question.id : parentData.id
			}&lastDate=${lastDate}`
		)
			.then((response) => response.json())
			.then((data) => {
				comments = [...comments, ...data];
				loading = false;
			});
	};

</script>

<p>
	Count: {comment_count}
	{#if comment_count > 0 && comments?.length === 0}
		<button class="btn btn-secondary" type="button" on:click={loadMore}>See Comments</button>
	{/if}
</p>
{#if loading}
	<div>Loading comments...</div>
{:else if comments?.length}
	
	<div>
		{#each comments as comment}
			<Comment {comment} />
		{/each}
	</div>
	{#if comments?.length < comment_count}
		<button class="btn btn-secondary" on:click={() => loadMore}>Load More</button>
	{/if}
{/if}



<style lang="scss">

	</style>