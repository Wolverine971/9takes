<script lang="ts">
	import Card from '../atoms/card.svelte';
	import Comments from './Comments.svelte';
	import Interact from './Interact.svelte';
	import DownIcon from '../icons/downIcon.svelte';

	export let user: any;
	export let comment: any;
	let _commentComment: any = null;
	if (comment?.id) {
		_commentComment = Object.assign({}, comment);
	}

	let _commentData = Object.assign({}, comment);

	$: comment, matchData();

	const matchData = () => {
		console.log('data change');
		_commentComment = Object.assign({}, comment);
		_commentData = Object.assign({}, comment);
	};

	let loading: boolean = false;

	console.log(comment);

	const lastDate = comment?.comments?.length
		? comment?.comments[comment?.comments?.length - 1]?.created_at || null
		: null;

	const loadMore = async () => {
		loading = true;
		await fetch(`/comments/?type=${'comment'}&parentId=${comment.id}&lastDate=${lastDate}`)
			.then((response) => response.json())
			.then((newcommentData) => {
				console.log(newcommentData);
				if (!_commentComment.comments) {
					_commentComment.comments = [];
				}
				_commentComment.comments = [..._commentComment.comments, ...newcommentData];
				loading = false;
			});
	};

	const addComment = async (newComment: any) => {
		if (_commentComment.comments) {
			_commentComment.comments = [newComment, ..._commentComment.comments];
		} else {
			_commentComment.comments = [];
			_commentComment.comments.push(newComment);
		}
		// _commentComment.comments = [newComment, ..._commentComment.comments];
		_commentComment.comment_count += 1;
	};
</script>

<Card>
	<!-- <p>Comment: {comment?.comment}</p> -->
	<input class="comment-box" type="text" bind:value={_commentComment.comment} readonly />

	<!-- <p>ParentId: {comment?.parent_id}</p> -->
	<Interact
		data={_commentData}
		parentType={'comment'}
		{user}
		on:commentAdded={({ detail }) => addComment(detail)}
	/>
	{#if _commentComment?.comments?.length}
		<div style="margin-left:10px;">
			<Comments data={_commentComment} nested={true} parentType={'comment'} {user} />
		</div>
	{/if}
	{#if _commentComment.comment_count && !_commentComment?.comments?.length}
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
