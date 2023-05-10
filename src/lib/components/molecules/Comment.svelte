<script lang="ts">
	// import type { Database } from 'src/schema';
	import Card from '../atoms/card.svelte';
	import Comments from './Comments.svelte';
	import Interact from './Interact.svelte';
	// export let comment: any; //: Database['public']['Tables']['comments']['Row'];
	export let data: any;
	export let comment: any;
	let commentComment: any = null;
	if (comment?.id) {
		commentComment = Object.assign({}, comment);
	}

	const commentData = Object.assign({}, comment, data);
</script>

<Card>
	<!-- <p>Comment: {comment?.comment}</p> -->
	<input class="comment-box" type="text" bind:value={comment.comment} />

	<!-- <p>ParentId: {comment?.parent_id}</p> -->
	<Interact data={commentData} parentType={'comment'} />
	{#if comment?.length}
		<div style="margin-left:10px;">
			<Comments {data} nested={false} parentType={'comment'} />
		</div>
	{/if}
</Card>

<style lang="scss">
	.comment-box {
		width: -webkit-fill-available;
		background-color: var(--color-bg-0);
		border: 1px solid var(--color-bg-0);
		border-radius: 5px;
		// margin-bottom: 0;
		margin: 0.25rem;
	}
</style>
