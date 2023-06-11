<script lang="ts">
	import { browser } from '$app/environment';
	import Comment from './Comment.svelte';
	// import type { Database } from 'src/schema';

	let loading = false;

	export let nested: boolean = false;
	export let parentType: string = 'question';

	export let data: any;
	export let user: any;

	let _data: any = data;

	$: data, matchData();

	const matchData = () => {
		console.log('matchy');
		_data = Object.assign({}, data);
		comments = [..._data?.comments];
	};
	// export let comments: any[];
	// Database['public']['Tables']['comments']['Row'][]
	let comments: any[] = _data?.comments || [];

	const lastDate = comments?.length ? comments[comments?.length - 1]?.created_at || null : null;
	let comment_count: number = _data?.comment_count;

	const loadMore = async () => {
		loading = true;
		console.log('load comments');
		await fetch(
			`/comments/?type=${parentType}&parentId=${
				parentType === 'question' ? _data.question.id : _data.id
			}&lastDate=${lastDate}`
		)
			.then((response) => response.json())
			.then((commentData) => {
				if (!commentData?.message) {
					comments = [...comments, ...commentData];
					loading = false;
				}
			});
	};
</script>

<p>
	Count: {comment_count}
	{#if comment_count > 0 && comments?.length === 0 && _data.flags.userHasAnswered}
		<button class="btn btn-secondary" type="button" on:click={loadMore}>See Comments</button>
	{/if}

	{#if !_data.flags.userHasAnswered}
		<p>Must answer question first</p>
	{/if}
</p>
{#if loading}
	<div>Loading comments...</div>
{:else if !browser || _data.flags.userHasAnswered}
	<!-- <h3>Renders for SEO, removed if not answered</h3> -->
	{#if comments?.length}
		<div>
			{#each comments as comment}
				<Comment {comment} {user} />
			{/each}
		</div>
		{#if comments?.length < comment_count}
			<button class="btn btn-secondary" on:click={() => loadMore}>Load More</button>
		{/if}
	{:else}
		<p>nothing right now</p>
	{/if}
	{#if _data.flags.userHasAnswered && !browser}
		<h3>Renders only if answered</h3>
		<h1>Comments</h1>
		<!-- Renders only if answered -->
		<li>Answer Two</li>
		<li>Answer Three</li>
		<!-- only load first or top comment -->
		{#if _data.comments.length}
			<!-- <Comments data={_data} nested={false} parentType={'question'} {user} /> -->
			<Comment comment={comments[0]} {user} />
		{/if}
	{/if}
	{#if !_data?.comments?.length}
		<p>nothing right now</p>
	{/if}
{/if}

<style lang="scss">
</style>
