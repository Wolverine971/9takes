<script lang="ts">
	import { browser } from '$app/environment';
	import { createEventDispatcher } from 'svelte';
	import Comment from './Comment.svelte';
	const dispatch = createEventDispatcher();

	let loading = false;

	// export let nested: boolean = false;
	export let parentType: string = 'comment';

	export let data: any;
	export let user: any;
	export let questionId: number;

	let _data: any;
	let comment_count: number;

	$: data, matchData();

	const matchData = () => {
		_data = Object.assign({}, data);
		comments = _data?.comments?.length ? [..._data?.comments] : [];
		comment_count = _data?.comment_count;
	};

	// Database['public']['Tables']['comments']['Row'][]
	let comments: any[] = _data?.comments || [];

	const lastDate = data.comments?.length
		? data.comments[data.comments?.length - 1]?.created_at || null
		: null;

	const loadMore = async () => {
		loading = true;
		await fetch(
			`/comments/?type=${parentType}&parentId=${
				parentType === 'question' ? questionId : _data.id
			}&lastDate=${lastDate}&range=${data?.comments?.length || 0}`
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
			`/comments/?type=${parentType}&parentId=${
				parentType === 'question' ? questionId : _data.id
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

{#if comment_count > 0 && comments?.length === 0 && parentType === 'question' && _data?.flags?.userHasAnswered}
	<button class="btn btn-secondary" type="button" on:click={loadMore}>See Comments</button>
{/if}

{#if !browser || (comments?.length && parentType === 'question' && _data?.flags?.userHasAnswered)}
	<!-- <h3>Renders for SEO, removed if not answered</h3> -->
	{#if comments?.length}
		<div>
			{#each comments as comment}
				<Comment
					{questionId}
					{comment}
					{user}
					{data}
					on:commentAdded={({ detail }) => refreshComments(detail)}
				/>
			{/each}
		</div>
		{#if comments?.length < comment_count}
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
{:else}
	<p>no comments</p>
{/if}

<style lang="scss">
</style>
