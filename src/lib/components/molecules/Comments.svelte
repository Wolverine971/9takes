<script lang="ts">
	import { browser } from '$app/environment';
	import { createEventDispatcher } from 'svelte';
	import Comment from './Comment.svelte';
	const dispatch = createEventDispatcher();

	let loading = false;

	// export let nested: boolean = false;
	export let parentType: string = 'comment';

	export let user: any;
	export let questionId: number;
	export let comments: any[];
	export let comment_count: number;
	export let parentData: any;

	// Database['public']['Tables']['comments']['Row'][]
	// let comments: any[] = parentData?.comments || [];

	const lastDate = comments?.length ? comments[comments?.length - 1]?.created_at || null : null;

	const loadMore = async () => {
		loading = true;
		await fetch(
			`/comments?type=${parentType}&parentId=${
				parentType === 'question' ? questionId : parentData.id
			}&lastDate=${lastDate}&range=${comments?.length || 0}`
		)
			.then((response) => response.json())
			.then((commentData) => {
				if (!commentData?.message) {
					comments = [...comments, ...commentData];
					loading = false;
				}
			});
	};

	const refreshComments = async (data: any) => {
		if (parentType !== 'question') {
			return;
		}
		dispatch('commentAdded');
		loading = true;
		await fetch(
			`/comments?type=${parentType}&parentId=${
				parentType === 'question' ? questionId : parentData.id
			}&lastDate=${lastDate}`
		)
			.then((response) => response.json())
			.then((commentData) => {
				if (!commentData?.message) {
					comments = [...commentData];
					comment_count += 1;
					loading = false;
				}
			});
	};
</script>

{#if comment_count > 0 && comments?.length === 0 && parentType === 'question' && parentData?.flags?.userHasAnswered}
	<button class="btn btn-secondary" type="button" on:click={loadMore}>See Comments</button>
{/if}

{#if !browser || (comments?.length && parentType === 'question' && parentData?.flags?.userHasAnswered) || (comments?.length && parentType === 'comment')}
	<!-- <h3>Renders for SEO, removed if not answered</h3> -->
	{#if comments?.length}
			{#each comments as comment}
				<Comment
					{questionId}
					{comment}
					{user}
					{parentData}
					on:commentAdded={({ detail }) => refreshComments(detail)}
				/>
			{/each}
		{#if comments?.length < comment_count && parentData?.flags?.userHasAnswered}
			<button class="btn btn-secondary" on:click={loadMore}>
				{#if loading}
					<div class="loader" />
				{:else}
					Load More
				{/if}
			</button>
		{/if}
	{:else}
		<p>nothing right now</p>
	{/if}
{/if}

<style lang="scss">
</style>
