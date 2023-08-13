<script lang="ts">
	import { browser } from '$app/environment';
	import Comment from './Comment.svelte';
	// import type { Database } from 'src/schema';

	let loading = false;

	export let nested: boolean = false;
	export let parentType: string = 'question';

	export let data: any;
	export let user: any;
	export let questionId: number;

	let _data: any;
	let comment_count: number;

	$: data, matchData();

	const matchData = () => {
		// console.log('comments', data);
		_data = Object.assign({}, data);
		comments = [..._data?.comments];
		comment_count = _data?.comment_count;
	};
	// export let comments: any[];
	// Database['public']['Tables']['comments']['Row'][]
	let comments: any[] = _data?.comments || [];

	const lastDate = comments?.length ? comments[comments?.length - 1]?.created_at || null : null;

	const loadMore = async () => {
		loading = true;
		console.log('load comments');
		await fetch(
			`/comments/?type=${parentType}&parentId=${
				parentType === 'question' ? questionId : _data.id
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

	const addComment = async (data: any) => {
		if (parentType !== 'question') {
			return;
		}
		loading = true;
		console.log('load comments');
		await fetch(
			`/comments/?type=${parentType}&parentId=${
				parentType === 'question' ? questionId : _data.id
			}&lastDate=${lastDate}`
		)
			.then((response) => response.json())
			.then((commentData) => {
				if (!commentData?.message) {
					_data = Object.assign({}, data);
					comments = [..._data?.comments];
					comment_count = _data?.comment_count;
				}
			});
	};
</script>

{#if comment_count > 0 && comments?.length === 0 && parentType === 'question' && _data?.flags?.userHasAnswered}
	<button class="btn btn-secondary" type="button" on:click={loadMore}>See Comments</button>
{/if}

{#if comment_count > 0 && parentType === 'question' && !_data?.flags?.userHasAnswered}
	<p>Must answer question first</p>
{/if}
{#if loading}
	<div>Loading comments...</div>
{:else if !browser || (comments?.length && parentType === 'question' && _data?.flags?.userHasAnswered)}
	<!-- <h3>Renders for SEO, removed if not answered</h3> -->
	{#if comments?.length}
		<div>
			{#each comments as comment}
				<Comment
					{questionId}
					{comment}
					{user}
					on:commentAdded={({ detail }) => addComment(detail)}
				/>
			{/each}
		</div>
		{#if comments?.length < comment_count}
			<button class="btn btn-secondary" on:click={loadMore}>Load More</button>
		{/if}
	{:else}
		<p>nothing right now</p>
	{/if}
{:else if !browser || (comments?.length && parentType === 'comment')}
	<div>
		{#each comments as comment}
			<Comment {questionId} {comment} {user} on:commentAdded={({ detail }) => addComment(detail)} />
		{/each}
	</div>
	{#if comments?.length < comment_count}
		<button class="btn btn-secondary" on:click={loadMore}>Load More</button>
	{/if}
{/if}

<style lang="scss">
</style>
