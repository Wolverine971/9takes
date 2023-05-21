<script lang="ts">
	import Comment from './Comment.svelte';
	import type { Database } from 'src/schema';

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
	let comments: Database['public']['Tables']['comments']['Row'][] = _data?.comments || [];

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
				comments = [...comments, ...commentData];
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
			<Comment {comment} {user} />
		{/each}
	</div>
	{#if comments?.length < comment_count}
		<button class="btn btn-secondary" on:click={() => loadMore}>Load More</button>
	{/if}
{/if}

<style lang="scss">
</style>
