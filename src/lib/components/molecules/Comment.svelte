<script lang="ts">
	// import type { Database } from 'src/schema';
	import Card from '../atoms/card.svelte';
	import Comments from './Comments.svelte';
	import Interact from './Interact.svelte';
	import DownIcon from '../icons/downIcon.svelte';
	// export let comment: any; //: Database['public']['Tables']['comments']['Row'];
	export let data: any;
	export let comment: any;
	let commentComment: any = null;
	if (comment?.id) {
		commentComment = Object.assign({}, comment);
	}

	let loading: boolean = false;

	const commentData = Object.assign({}, comment, data);
	console.log(comment);

	const lastDate = comment?.comments?.length
		? comment?.comments[comment?.comments?.length - 1]?.created_at || null
		: null;

	const loadMore = async () => {
		loading = true;
		await fetch(`/comments/?type=${'comment'}&parentId=${comment.id}&lastDate=${lastDate}`)
			.then((response) => response.json())
			.then((commentData) => {
				console.log(commentData);
				if (!commentComment.comments) {
					commentComment.comments = [];
				}
				commentComment.comments = [...commentComment.comments, ...commentData];
				loading = false;
			});
	};
</script>

<Card>
	<!-- <p>Comment: {comment?.comment}</p> -->
	<input class="comment-box" type="text" bind:value={commentComment.comment} readonly />

	<!-- <p>ParentId: {comment?.parent_id}</p> -->
	<Interact data={commentData} parentType={'comment'} />
	{#if commentComment?.comments?.length}
		<div style="margin-left:10px;">
			<Comments data={commentComment} nested={false} parentType={'comment'} />
		</div>
	{/if}
	{#if commentComment.comment_count && !commentComment?.comments?.length}
		<div
			class="drop-down"
			on:click={() => {
				loadMore();
			}}
		>
			<span>Comment Count: {comment.comment_count}</span>
			{#if !loading}
				<DownIcon iconStyle={'padding: 0.25rem;'} height={'1.5rem'} fill={''} />
			{/if}
		</div>
	{/if}
</Card>

<style lang="scss">
	.drop-down {
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		cursor: pointer;

		background-color: var(--color-bg-0);
		border-radius: 5px;
		border: 1px solid var(--color-bg-2);

		&:hover {
			background-color: var(--color-bg-2);
		}
	}
	.comment-box {
		width: -webkit-fill-available;
		background-color: var(--color-bg-0);
		border: 1px solid var(--color-bg-0);
		border-radius: 5px;
		// margin-bottom: 0;
		margin: 0.25rem;
	}
</style>
