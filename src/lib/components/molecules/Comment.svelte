<script lang="ts">
	import Card from '$lib/components/atoms/card.svelte';
	import Comments from '$lib/components/molecules//Comments.svelte';
	import DownIcon from '$lib/components/icons/downIcon.svelte';
	import { notifications } from '$lib/components/molecules/notifications';
	import MasterCommentIcon from '$lib/components/icons/masterCommentIcon.svelte';
	import { createEventDispatcher } from 'svelte';
	import { deserialize } from '$app/forms';
	import RightIcon from '$lib/components/icons/rightIcon.svelte';
	import ThumbsUpIcon from '$lib/components/icons/thumbsUpIcon.svelte';
	const dispatch = createEventDispatcher();

	export let user: any;
	export let comment: any;

	export let data: any;
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
		dispatch('commentAdded', newComment);

		if (_commentComment.comments) {
			_commentComment.comments = [newComment, ..._commentComment.comments];
		} else {
			_commentComment.comments = [];
			_commentComment.comments.push(newComment);
		}
		// _commentComment.comments = [newComment, ..._commentComment.comments];
		_commentComment.comment_count += 1;
	};

	const likeComment = async () => {
		if (!user) {
			notifications.info('Must register or login to like comments', 3000);
			return;
		}
		const operation = likes && likes.some((e) => e.user_id === user.id) ? 'remove' : 'add';
		let body = new FormData();
		body.append('parent_id', comment.id);
		body.append('user_id', user.id);
		body.append('es_id', comment.es_id);
		body.append('operation', operation);

		const resp = await fetch('?/likeComment', {
			method: 'POST',
			body
		});

		const result: any = deserialize(await resp.text());

		notifications.info(operation === 'add' ? 'Like Added' : 'Like Removed', 3000);
		const newLike = result?.data;
		if (newLike) {
			likes = [newLike, ...likes];
		} else {
			likes = likes.filter((c) => {
				c.user_id !== user.id;
			});
		}
	};

	let newcomment: string = '';
	let commenting: boolean = false;

	$: comment, watchData();

	let anonymousComment = false;

	const watchData = () => {
		// if (!data?.flags?.userHasAnswered && parentType === 'question') {
		// 	commenting = true;
		// }
		likes = comment?.comment_like ? [...comment.comment_like] : [];
	};

	let likes: any[] = comment?.comment_like ? [...comment.comment_like] : [];

	const createComment = async () => {
		if (!data?.flags?.userSignedIn && !user?.id) {
			if (data?.flags?.userHasAnswered || anonymousComment) {
				notifications.info('Must register or login to comment multiple times', 3000);
				return;
			} else {
				notifications.info('Must register or login to comment on other comments', 3000);
				return;
			}
		}

		let body = new FormData();
		console.log('send comment');
		body.append('comment', newcomment);
		body.append('parent_id', comment.id);
		body.append('author_id', user.id);
		body.append('parent_type', 'comment');
		body.append('es_id', comment.es_id);
		body.append('question_id', questionId.toString());

		const resp = await fetch('?/createComment', {
			method: 'POST',
			body
		});

		const result: any = deserialize(await resp.text());

		if (result.error) {
			notifications.danger('Error adding comment', 3000);
			console.log(result.error);
		} else {
			notifications.info('Comment Added', 3000);
			dispatch('commentAdded', result?.data);
			comment = '';
		}
	};

	let innerWidth = 0;
</script>

<svelte:window bind:innerWidth />

<Card style="margin: .5rem 0; padding: .5rem;">
	{#if innerWidth > 500}
		<div class="comment-meta">
			<span style="min-width:30px"
				>{new Date(_commentComment.created_at).toLocaleDateString('en-US')}
			</span>
		</div>
	{/if}
	<div class="user-comment">
		<div
			style="display: flex; {innerWidth > 500
				? 'width: 95%;'
				: 'flex-direction: column; width: 100%'}"
		>
			<!-- {#if innerWidth > 500}
				<a
					class="profile-avatar {_commentComment?.profiles?.external_id ? '' : 'disabled'}"
					href={_commentComment?.profiles?.external_id
						? `/users/${_commentComment.profiles.external_id}`
						: ''}
				>
					{_commentComment?.profiles?.enneagram || 'Rando'}
				</a>
			{/if} -->

			<p class="comment-box">
				<a
					class="profile-avatar {_commentComment?.profiles?.external_id ? '' : 'disabled'}"
					href={_commentComment?.profiles?.external_id
						? `/users/${_commentComment.profiles.external_id}`
						: ''}>{_commentComment?.profiles?.enneagram || 'Rando'}</a
				>: {_commentComment.comment}
			</p>
			{#if innerWidth < 500}
				<hr class="rounded" />
				<div style="display: flex; align-items: center; gap: 0.5rem;">
					<div class="comment-meta">
						<span style="min-width:30px"
							>{new Date(_commentComment.created_at).toLocaleDateString('en-US')}
						</span>
					</div>
					<button
						title="Comment"
						class=""
						style="padding: 0.25rem; height: 45px;"
						on:click={() => (commenting = !commenting)}
					>
						<MasterCommentIcon
							iconStyle={'padding: 0.25rem;'}
							height={'1.5rem'}
							fill={'#5407d9'}
							type={comment.length ? 'full' : 'empty'}
						/>
					</button>
					<button
						title="Like"
						class=""
						style="{'padding: 0.25rem; height: 45px;'} color: {likes &&
							user?.id &&
							likes.some((e) => e.user_id === user?.id) &&
							'#5407d9'}"
						on:click={likeComment}
					>
						{#if likes.length}
							{likes.length}
						{/if}
						<ThumbsUpIcon
							iconStyle={'padding: 0.25rem;'}
							height={'1.5rem'}
							fill={(likes && user?.id && likes.some((e) => e.user_id === user.id) && '#5407d9') ||
								''}
						/>
					</button>
				</div>
			{/if}
		</div>

		{#if innerWidth > 500}
			<div class="interaction-div-display ">
				<button
					title="Comment"
					class=""
					style="padding: 0.25rem;"
					on:click={() => (commenting = !commenting)}
				>
					<MasterCommentIcon
						iconStyle={'padding: 0.25rem;'}
						height={'1.5rem'}
						fill={'#5407d9'}
						type={comment.length ? 'full' : 'empty'}
					/>
				</button>
				<button
					title="Like"
					class=""
					style="{'padding: 0.25rem;'} color: {likes &&
						user?.id &&
						likes.some((e) => e.user_id === user?.id) &&
						'#5407d9'}"
					on:click={likeComment}
				>
					{#if likes.length}
						{likes.length}
					{/if}
					<ThumbsUpIcon
						iconStyle={'padding: 0.25rem;'}
						height={'1.5rem'}
						fill={(likes && user?.id && likes.some((e) => e.user_id === user.id) && '#5407d9') ||
							''}
					/>
				</button>
			</div>
		{/if}
		<!-- <Interact
			{questionId}
			data={_commentData}
			parentType={'comment'}
			stack={true}
			{user}
			on:commentAdded={({ detail }) => addComment(detail)}
		/> -->
	</div>
	{#if commenting}
		<div class="interact-text-container">
			<textarea placeholder="Speak your mind" class="interact-textbox" bind:value={newcomment} />
		</div>
		<button
			class="btn btn-primary sub-comment"
			type="button"
			on:click={createComment}
			disabled={newcomment?.length < 1}
		>
			Send it
			{#if newcomment?.length > 1}
				<!-- <ArrowRight /> -->
				<RightIcon
					iconStyle={'margin-left: .5rem; padding: 0.25rem;'}
					height={'1.5rem'}
					fill={'#5407d9'}
				/>
			{/if}
		</button>
	{/if}

	<!-- <p>ParentId: {comment?.parent_id}</p> -->

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
	.rounded {
		border-radius: 5px;
		width: 80%;
	}
	.drop-down {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		cursor: pointer;

		background-color: var(--color-paladin-1);
		border-radius: 5px;
		border: 1px solid var(--color-paladin-2);

		&:hover {
			background-color: var(--color-paladin-2);
		}
	}
	.comment-box {
		width: -webkit-fill-available;
		// background-color: var(--color-paladin-1);
		// border: 1px solid var(--color-theme-purple-v);
		border-radius: 5px;
		// margin-bottom: 0;
		margin: 0.25rem;
		padding: 0.5rem;
	}

	.user-comment {
		display: flex;
		// gap: 0.5rem;
		position: relative;
	}
	.user-comment button {
		border: none;

		transition: 0.3s;
		border-radius: 5px;
		display: flex;
		justify-content: center;
		align-items: center;
		min-width: 35px;
	}
	.comment-meta {
		display: flex;
		justify-content: flex-end;
		margin: -0.5rem auto;
		gap: 1rem;
		margin-right: 4rem;
	}
	.profile-avatar {
		// position: absolute;
		// top: 0;
		// left: 0;

		min-width: 30px;
		padding: 0.2rem;

		align-self: center;
		// display: flex;
		// justify-content: center;
		align-items: center;
		// background: red;
		border: 1px solid var(--color-paladin-3-v);
		// width: 3rem;
		// height: 3rem;
		font-weight: bolder;
		min-width: 3rem;
		text-align: center;
		aspect-ratio: 1/1;
		// -webkit-border-radius: 50%;
		// -moz-border-radius: 50%;
		border-radius: 5px;
		transition: all 0.5s;
		-moz-transition: all 0.5s; /* Firefox 4 */
		-webkit-transition: all 0.5s; /* Safari and Chrome */
		-o-transition: all 0.5s; /* Opera */
		cursor: pointer;
		word-break: keep-all;

		&:hover {
			border: 1px solid var(--color-paladin-3);
		}
	}
	.top-right-corner {
		// position: absolute;
		// top: 0;
		// right: 0;
		display: flex;
		align-items: center;
		margin: 0.25rem;
		margin-left: auto;
		// gap: 0.25rem;
	}
	.corner-btn {
		background: transparent;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		margin: 0.25rem;
		padding: 0.1rem;
		border-radius: 5px;
		padding: 0.25rem;

		&:hover {
			background: var(--color-paladin-1);
		}
	}
	.sub-comment {
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		&:disabled {
			background-color: var(--color-paladin-1, white);
			color: grey;
			border: 1px solid grey;
			opacity: 1;
			cursor: auto;
		}
	}
	textarea {
		width: 100%;
		border: hsl(212, 15%, 48%) 2px solid;
		border-radius: 5px;
		padding: 10px 20px;
		color: hsl(222, 15%, 19%);
		font-size: 16px;
		margin-bottom: 20px;
	}
	.interaction-div-display {
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.interaction-div-display button {
		background-color: var(--color-paladin-1);
		// float: left;
		border: none;
		outline: none;
		cursor: pointer;
		transition: 0.3s;
		font-size: 0.75rem;
		border-radius: 5px;
		display: flex;
		margin: 0 0 0.25rem 0.25rem;
		justify-content: center;
		align-items: center;
		min-width: 35px;
	}

	/* Change background color of buttons on hover */
	.interaction-div-display button:hover {
		background-color: var(--color-paladin-1);
		border-radius: 5px;
		border: 1px solid var(--color-paladin-2);
	}

	.interact-text-container {
		position: relative;
		width: 100%;
		height: 100px;
	}
	.interact-textbox {
		border-radius: 5px;
		box-sizing: border-box;
		padding: 1rem;
		width: 100%;
		/* max-width: 900px; */

		position: relative;
	}
	.interact-expand {
		z-index: 10;
		position: absolute;
		top: 5px;
		left: calc(100% - 73px);
	}

	@media all and (max-width: 576px) {
		.interaction-div-display {
			gap: 0.25rem;
			margin: 0.25rem;
			min-width: 8%;
		}

		.interaction-div-display button {
			flex: 1;
			margin: 0;
		}
	}
</style>
