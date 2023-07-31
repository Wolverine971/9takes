<script lang="ts">
	import Card from '../atoms/card.svelte';
	import Comments from './Comments.svelte';
	import Interact from './Interact.svelte';
	import DownIcon from '../icons/downIcon.svelte';
	import { notifications } from './notifications';
	import MasterCommentIcon from '../icons/masterCommentIcon.svelte';

	export let user: any;
	export let comment: any;
	export let questionId: number;
	let _commentComment: any = null;
	if (comment?.id) {
		_commentComment = Object.assign({}, comment);
	}

	let _commentData = Object.assign({}, comment);

	$: comment, matchData();

	const matchData = () => {
		_commentComment = Object.assign({}, comment);
		_commentData = Object.assign({}, comment);
	};

	let loading: boolean = false;

	const lastDate = comment?.comments?.length
		? comment?.comments[comment?.comments?.length - 1]?.created_at || null
		: null;

	const loadMore = async () => {
		if (!user) {
			notifications.info('Must register or login to see nested comments', 3000);
			return;
		}
		loading = true;
		await fetch(`/comments/?type=${'comment'}&parentId=${comment.id}&lastDate=${lastDate}`)
			.then((response) => response.json())
			.then((newcommentData) => {
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

<Card style="margin: .5rem 0; padding: .5rem;">
	<span class="user-comment">
		<a
			class="profile-avatar {_commentComment?.profiles?.external_id ? '' : 'disabled'}"
			href={_commentComment?.profiles?.external_id
				? `/users/${_commentComment.profiles.external_id}`
				: ''}
		>
			{_commentComment?.profiles?.enneagram || 'Rando'}
		</a>

		<input class="comment-box" type="text" bind:value={_commentComment.comment} readonly />
	</span>

	<!-- <p>ParentId: {comment?.parent_id}</p> -->
	<Interact
		{questionId}
		data={_commentData}
		parentType={'comment'}
		{user}
		on:commentAdded={({ detail }) => addComment(detail)}
	/>
	{#if _commentComment?.comments?.length}
		<div style="margin-left:10px;">
			<Comments {questionId} data={_commentComment} nested={true} parentType={'comment'} {user} />
		</div>
	{/if}
	{#if _commentComment.comment_count && !_commentComment?.comments?.length}
		<button type="button" class="drop-down" on:click={loadMore} title="Load more comments">
			{comment.comment_count}
			<MasterCommentIcon
				iconStyle={'padding: 0.25rem;'}
				height={'1rem'}
				fill={'#5407d9'}
				type={'multiple'}
			/>
			{#if !loading}
				<DownIcon iconStyle={'padding: 0.25rem;'} height={'1rem'} fill={''} />
			{/if}
		</button>
	{/if}
</Card>

<style lang="scss">
	.drop-down {
		width: 100%;
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

	.user-comment {
		display: flex;
		// gap: 0.5rem;
		position: relative;
	}
	.profile-avatar {
		display: flex;
		justify-content: center;
		align-items: center;
		// background: red;
		border: 1px solid var(--color-p-origin-v);
		width: 3rem;
		height: 3rem;
		font-weight: bolder;
		aspect-ratio: 1/1;
		margin: 0.5rem;
		-webkit-border-radius: 50%;
		-moz-border-radius: 50%;
		border-radius: 50%;
		transition: all 0.5s;
		-moz-transition: all 0.5s; /* Firefox 4 */
		-webkit-transition: all 0.5s; /* Safari and Chrome */
		-o-transition: all 0.5s; /* Opera */
		cursor: pointer;
		word-break: keep-all;

		&:hover {
			border: 1px solid var(--color-p-origin);
		}
	}
</style>
