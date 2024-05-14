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
	import SettingsIcon from '$lib/components/icons/settingsIcon.svelte';

	import FingerprintJS from '@fingerprintjs/fingerprintjs';
	import EditIcon from '../icons/editIcon.svelte';
	import Modal2, { getModal } from '../atoms/Modal2.svelte';
	import Popover from '../atoms/Popover.svelte';
	const dispatch = createEventDispatcher();

	export let user: any;
	export let comment: any;
	export let parentData: any;
	export let questionId: number;

	$: comment, matchData();

	let likes: any[] = comment?.comment_like ? [...comment.comment_like] : [];
	let loadingComments: boolean = false;
	let loading: boolean = false;
	let innerWidth = 0;
	let newcomment: string = '';
	let _commentComment: any = null;
	let commenting: boolean = false;
	let anonymousComment: boolean = false;
	let commentEdit: string = comment.comment;
	let flaggingReasonDescription: string = '';
	let flaggingReasonId: string = '';

	const lastDate = comment?.comments?.length
		? comment?.comments[comment?.comments?.length - 1]?.created_at || null
		: null;

	if (comment?.id) {
		_commentComment = Object.assign({}, comment);
	}
	const createdOrModifiedAt = new Date(
		_commentComment.modified_at || _commentComment.created_at
	).toLocaleDateString('en-US');

	const matchData = () => {
		_commentComment = Object.assign({}, comment);
		likes = comment?.comment_like ? [...comment.comment_like] : [];
	};

	const loadMore = async () => {
		if (!user) {
			notifications.info('Must register or login to see nested comments', 3000);
			return;
		}
		loadingComments = true;
		await fetch(
			`/comments?type=${'comment'}&parentId=${comment.id}&lastDate=${lastDate}&range=${
				comment?.comments?.length || 0
			}`
		)
			.then((response) => response.json())
			.then((newcommentData) => {
				if (!_commentComment.comments) {
					_commentComment.comments = [];
				}
				_commentComment.comments = [..._commentComment.comments, ...newcommentData];
			});
		loadingComments = false;
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

	const createComment = async () => {
		if (!parentData?.flags?.userSignedIn && !user?.id) {
			if (parentData?.flags?.userHasAnswered || anonymousComment) {
				notifications.info('Must register or login to comment multiple times', 3000);
				return;
			} else {
				notifications.info('Must register or login to comment on other comments', 3000);
				return;
			}
		}
		loading = true;

		const fp = await FingerprintJS.load();
		const fpval = await fp.get();

		let body = new FormData();
		body.append('comment', newcomment);
		body.append('parent_id', comment.id);
		body.append('author_id', user.id);
		body.append('parent_type', 'comment');
		body.append('es_id', comment.es_id);
		body.append('question_id', questionId.toString());
		body.append('fingerprint', fpval?.visitorId?.toString());

		const resp = await fetch('?/createCommentRando', {
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
			newcomment = '';
			commenting = false;
		}
		loading = false;
	};

	const expandText = () => {
		const container: any = document.querySelector(`#comment-box${comment.id}`);
		if (container) {
			container.classList.add('expanded');
			container.style.maxHeight = 'none';
		}

		const readMore: any = document.querySelector(`#read-more-btn${comment.id}`);
		if (readMore) {
			readMore.style.display = 'none';
		}
	};

	const save = async () => {
		loading = true;

		let body = new FormData();
		body.append('comment', commentEdit);
		body.append('comment_id', _commentComment.id);

		const resp = await fetch('/comments', {
			method: 'POST',
			body
		});

		const result: any = deserialize(await resp.text());

		if (result?.success) {
			notifications.info('Comment Updated', 3000);
			_commentComment.comment = commentEdit;
			getModal(`edit-modal-${_commentComment.id}`).close();
		} else {
			notifications.danger('Error updating comment', 3000);
			console.log(result.error);
		}
		loading = false;
	};

	const submitFlag = async () => {
		loading = true;

		let body = new FormData();
		body.append('description', flaggingReasonDescription);
		body.append('comment_id', _commentComment.id);
		body.append('reason_id', flaggingReasonId);

		const resp = await fetch('?/flagComment', {
			method: 'POST',
			body
		});

		const result: any = deserialize(await resp.text());

		if (result?.type === 'success') {
			notifications.info('Comment Flagged', 3000);
			flaggingReasonDescription = '';
		} else {
			notifications.danger('Error flagging comment', 3000);
			console.log(result.error);
		}
		loading = false;
		getModal(`flag-comment-modal-${_commentComment.id}`).close();
	};
</script>

<svelte:window bind:innerWidth />

<Card style="margin: .3rem 0; padding: .2rem" className="neumo-card">
	<div
		class="user-comment"
		itemprop="suggestedAnswer acceptedAnswer"
		itemscope
		itemtype="https://schema.org/Answer"
	>
		<div
			style="display: flex; {innerWidth > 500
				? 'width: 95%;'
				: 'flex-direction: column; width: 100%;'}"
		>
			<div style="display: flex; flex-direction: column; width: 100%}">
				<p class="comment-box" id="comment-box{comment.id}">
					{#if _commentComment?.profiles?.enneagram && _commentComment?.profiles?.external_id}
						<a
							title="View profile"
							class="profile-avatar {_commentComment?.profiles?.external_id
								? 'hoverable'
								: 'disabled'}"
							href={_commentComment?.profiles?.external_id
								? `/users/${_commentComment.profiles.external_id}`
								: ''}>{_commentComment?.profiles?.enneagram || 'Rando'}</a
						>:
					{:else}
						<span class="profile-avatar {_commentComment?.profiles?.external_id ? '' : 'disabled'}">
							Rando
						</span>:
					{/if}
					{#if user?.id === _commentComment?.author_id}
						<button
							type="button"
							class="comment-edit"
							itemprop="text"
							title="Edit"
							on:click={async () => {
								getModal(`edit-modal-${_commentComment.id}`).open();
							}}
							on:keydown={(e) => {
								if (e?.key === 'Enter') getModal(`edit-modal-${_commentComment.id}`).open();
							}}
						>
							<EditIcon height={'1rem'} fill={'#5407d9'} />
						</button>
					{/if}

					<span class="comment-text" itemprop="text">{_commentComment.comment} </span>
				</p>
				{#if _commentComment?.comment?.length > 136}
					<span
						role="button"
						tabindex="0"
						id="read-more-btn{comment.id}"
						class="read-more-btn"
						on:click={() => expandText()}
						on:keydown={(e) => {
							if (e?.key === 'Enter') expandText();
						}}>Read More</span
					>
				{/if}
			</div>
			{#if innerWidth < 500}
				<div style="display: flex; justify-content: space-between; align-items: center;">
					<div style="display: flex; align-items: center; gap: 0.5rem;">
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
								<span itemprop="upvoteCount">
									{likes.length}
								</span>
							{/if}
							<ThumbsUpIcon
								iconStyle={'padding: 0.25rem;'}
								height={'1.5rem'}
								fill={(likes &&
									user?.id &&
									likes.some((e) => e.user_id === user?.id) &&
									'#5407d9') ||
									'#444'}
							/>
						</button>
					</div>
					<Popover>
						<SettingsIcon
							slot="icon"
							iconStyle={'padding: 0.25rem;'}
							height={'1.5rem'}
							fill={'#5407d9'}
						/>

						<div slot="popoverValue">
							<div style="display: flex; flex-direction: column">
								<div class="comment-meta">
									<span style="min-width:30px; display:flex; gap: .5rem; padding: .5rem">
										{#if _commentComment.modified_at}
											<span style="color: #5407d9" title="modified">M</span>
										{/if}
										<time itemprop="dateCreated" datetime={createdOrModifiedAt}
											>{createdOrModifiedAt}</time
										>
									</span>
								</div>
								<button
									title="settings"
									class="btn btn-primary"
									style="padding: 0.25rem; height: 45px;"
									on:click={() => getModal(`flag-comment-modal-${_commentComment.id}`).open()}
								>
									Flag Comment
								</button>
							</div>
						</div>
					</Popover>
				</div>
			{/if}
		</div>

		{#if innerWidth >= 500}
			<div
				style="display: flex;
			flex-direction: column; justify-content: center; align-items: flex-end;"
			>
				<div style="display: flex; align-items: center;">
					<button
						title="Comment"
						class="btn"
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
						class="btn"
						style="{'padding: 0.25rem;'} color: {likes &&
						user?.id &&
						likes.some((e) => e.user_id === user?.id)
							? '#5407d9'
							: '#444'}"
						on:click={likeComment}
					>
						{#if likes.length}
							<span itemprop="upvoteCount">
								{likes.length}
							</span>
						{/if}
						<ThumbsUpIcon
							iconStyle={'padding: 0.25rem;'}
							height={'1.5rem'}
							fill={(likes && user?.id && likes.some((e) => e.user_id === user.id)
								? '#5407d9'
								: '#444') || ''}
						/>
					</button>
					<Popover>
						<SettingsIcon
							slot="icon"
							iconStyle={'padding: 0.25rem;'}
							height={'1.5rem'}
							fill={'#5407d9'}
						/>

						<div slot="popoverValue">
							<div style="display: flex; flex-direction: column">
								<span style="min-width:30px; display:flex; gap: .5rem">
									{#if _commentComment.modified_at}
										<span style="color: #5407d9" title="modified">M</span>
									{/if}
									<time itemprop="dateCreated" datetime={createdOrModifiedAt}
										>{createdOrModifiedAt}</time
									>
								</span>
								<button
									title="settings"
									class="btn btn-primary"
									style="padding: 0.25rem; height: 45px;"
									on:click={() => getModal(`flag-comment-modal-${_commentComment.id}`).open()}
								>
									Flag Comment
								</button>
							</div>
						</div>
					</Popover>
				</div>
			</div>
		{/if}
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
			Submit
			{#if loading === true}
				<div class="loader" />
			{:else if newcomment?.length > 1}
				<RightIcon
					iconStyle={'margin-left: .5rem; padding: 0.25rem;'}
					height={'1.5rem'}
					fill={'#5407d9'}
				/>
			{/if}
		</button>
	{/if}

	{#if _commentComment?.comments?.length}
		<div style="margin-left:10px;">
			<Comments
				{questionId}
				comments={_commentComment.comments}
				comment_count={_commentComment.comment_count}
				parentData={_commentComment}
				parentType={'comment'}
				{user}
			/>
		</div>
	{/if}
	{#if _commentComment.comment_count && !_commentComment?.comments?.length}
		<button type="button" class="drop-down" on:click={loadMore} title="Load more comments">
			{comment.comment_count}
			{#if loadingComments}
				<div class="loader" />
			{:else}
				<MasterCommentIcon
					iconStyle={'padding: 0.25rem;'}
					height={'1rem'}
					fill={'#5407d9'}
					type={'multiple'}
				/>
				<DownIcon iconStyle={'padding: 0.25rem;'} height={'1rem'} fill={''} />
			{/if}
		</button>
	{/if}
</Card>

<Modal2 id={`edit-modal-${_commentComment.id}`}>
	<div style="max-height: 500px; min-width: 350px">
		<h1>Edit Comment</h1>
		<textarea rows="5" bind:value={commentEdit} />

		<button
			class="btn btn-primary save-btn"
			type="button"
			style="padding: 0.25rem; display: flex;"
			on:click={async () => {
				await save();
			}}
		>
			Save
		</button>
	</div>
</Modal2>

<Modal2 id={`flag-comment-modal-${_commentComment.id}`}>
	<div style="max-height: 500px; min-width: 350px">
		<h1>Flag Comment</h1>
		{#if parentData?.flagReasons?.length < 1}
			<p>Reason</p>

			<select bind:value={flaggingReasonId}>
				{#each parentData?.flagReasons as reason}
					<option value={reason?.id}>{reason?.reason}</option>
				{/each}
				<!-- <option value="newest">Newest</option>
			<option value="oldest">Oldest</option>
			<option value="likes">Likes</option> -->
			</select>
		{/if}

		<p>Description</p>
		<textarea rows="5" bind:value={flaggingReasonDescription} />

		<button
			class="btn btn-primary save-btn"
			type="button"
			style="padding: 0.25rem; display: flex;"
			on:click={async () => {
				await submitFlag();
			}}
		>
			Send
		</button>
	</div>
</Modal2>

<style lang="scss">
	.rounded {
		border-radius: 5px;
		width: 80%;
	}

	.comment-text {
		max-height: 3em;
		overflow: hidden;
	}

	.expanded .comment-text {
		max-height: none;
	}
	.comment-edit {
		display: inline !important;
		cursor: pointer;
		display: inline;
		transition: 0.3s;
		border: none;
		border-radius: 0;
		min-width: 0 !important;
		padding: 0 !important;
	}

	.read-more-btn {
		background-color: var(--base-grey-1);
		padding: 5px 10px;
		cursor: pointer;
		border-left: 1px solid;
		border-bottom: 1px solid;
		border-bottom-left-radius: 5px;
    	border-bottom-right-radius: 5px;
	}

	.profile-avatar {
		min-width: 30px;
		padding: 0.2rem;
		align-self: center;
		align-items: center;
		border: 1px solid var(--color-paladin-3-v);
		font-weight: bolder;
		min-width: 3rem;
		text-align: center;
		aspect-ratio: 1/1;
		border-radius: 5px;
		transition: all 0.5s;
		-moz-transition: all 0.5s; /* Firefox 4 */
		-webkit-transition: all 0.5s; /* Safari and Chrome */
		-o-transition: all 0.5s; /* Opera */
		word-break: keep-all;
	}
	.hoverable::hover {
		border: 1px solid var(--color-paladin-3);
	}
</style>
