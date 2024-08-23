<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { deserialize } from '$app/forms';
	import FingerprintJS from '@fingerprintjs/fingerprintjs';
	import { notifications } from '$lib/components/molecules/notifications';
	import Card from '$lib/components/atoms/card.svelte';
	import Comments from '$lib/components/molecules//Comments.svelte';
	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';
	import Popover from '$lib/components/atoms/Popover.svelte';
	import DownIcon from '$lib/components/icons/downIcon.svelte';
	import MasterCommentIcon from '$lib/components/icons/masterCommentIcon.svelte';
	import RightIcon from '$lib/components/icons/rightIcon.svelte';
	import ThumbsUpIcon from '$lib/components/icons/thumbsUpIcon.svelte';
	import SettingsIcon from '$lib/components/icons/settingsIcon.svelte';
	import EditIcon from '$lib/components/icons/editIcon.svelte';

	const dispatch = createEventDispatcher();

	export let user: any;
	export let comment: any;
	export let parentData: any;
	export let questionId: number;

	let likes: any[] = [];
	let loadingComments = false;
	let loading = false;
	let innerWidth = 0;
	let newcomment = '';
	let _commentComment: any = null;
	let commenting = false;
	let anonymousComment = false;
	let commentEdit = '';
	let flaggingReasonDescription = '';
	let flaggingReasonId = '';

	$: lastDate = comment?.comments?.length
		? comment.comments[comment.comments.length - 1]?.created_at || null
		: null;

	$: createdOrModifiedAt = new Date(
		comment.modified_at || comment.created_at
	).toLocaleDateString('en-US');

	onMount(() => {
		updateCommentData();
	});

	$: if (comment) {
		updateCommentData();
	}

	function updateCommentData() {
		_commentComment = { ...comment };
		likes = comment?.comment_like ? [...comment.comment_like] : [];
		commentEdit = comment.comment;
	}

	async function loadMore() {
		if (!user) {
			notifications.info('Must register or login to see nested comments', 3000);
			return;
		}
		loadingComments = true;
		try {
			const response = await fetch(
				`/comments?type=comment&parentId=${comment.id}&lastDate=${lastDate}&range=${
					comment?.comments?.length || 0
				}`
			);
			const newcommentData = await response.json();
			if (!_commentComment.comments) {
				_commentComment.comments = [];
			}
			_commentComment.comments = [..._commentComment.comments, ...newcommentData];
		} catch (error) {
			console.error('Error loading comments:', error);
			notifications.danger('Error loading comments', 3000);
		} finally {
			loadingComments = false;
		}
	}

	async function likeComment() {
		if (!user) {
			notifications.info('Must register or login to like comments', 3000);
			return;
		}
		const operation = likes && likes.some((e) => e.user_id === user.id) ? 'remove' : 'add';
		const body = new FormData();
		body.append('parent_id', comment.id);
		body.append('user_id', user.id);
		body.append('es_id', comment.es_id);
		body.append('operation', operation);

		try {
			const resp = await fetch('?/likeComment', { method: 'POST', body });
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
		} catch (error) {
			console.error('Error liking comment:', error);
			notifications.danger('Error processing like', 3000);
		}
	}

	async function createComment() {
		if (!canComment()) return;
		loading = true;

		try {
			const fp = await FingerprintJS.load();
			const fpval = await fp.get();

			const body = new FormData();
			body.append('comment', newcomment);
			body.append('parent_id', comment.id);
			body.append('author_id', user.id);
			body.append('parent_type', 'comment');
			body.append('es_id', comment.es_id);
			body.append('question_id', questionId.toString());
			body.append('fingerprint', fpval?.visitorId?.toString());

			const resp = await fetch('?/createCommentRando', { method: 'POST', body });
			const result: any = deserialize(await resp.text());

			if (result.error) {
				throw new Error(result.error);
			}

			notifications.info('Comment Added', 3000);
			dispatch('commentAdded', result?.data);
			newcomment = '';
			commenting = false;
		} catch (error) {
			console.error('Error adding comment:', error);
			notifications.danger('Error adding comment', 3000);
		} finally {
			loading = false;
		}
	}

	function canComment() {
		if (!parentData?.flags?.userSignedIn && !user?.id) {
			if (parentData?.flags?.userHasAnswered || anonymousComment) {
				notifications.info('Must register or login to comment multiple times', 3000);
				return false;
			} else {
				notifications.info('Must register or login to comment on other comments', 3000);
				return false;
			}
		}
		return true;
	}

	function expandText() {
		const container = document.querySelector(`#comment-box${comment.id}`);
		const readMore = document.querySelector(`#read-more-btn${comment.id}`);
		if (container instanceof HTMLElement) {
			container.classList.add('expanded');
			container.style.maxHeight = 'none';
		}
		if (readMore instanceof HTMLElement) {
			readMore.style.display = 'none';
		}
	}

	async function save() {
		loading = true;
		const body = new FormData();
		body.append('comment', commentEdit);
		body.append('comment_id', _commentComment.id);

		try {
			const resp = await fetch('/comments', { method: 'POST', body });
			const result: any = deserialize(await resp.text());

			if (result?.success) {
				notifications.info('Comment Updated', 3000);
				_commentComment.comment = commentEdit;
				getModal(`edit-modal-${_commentComment.id}`).close();
			} else {
				throw new Error(result.error);
			}
		} catch (error) {
			console.error('Error updating comment:', error);
			notifications.danger('Error updating comment', 3000);
		} finally {
			loading = false;
		}
	}

	async function submitFlag() {
		loading = true;
		const body = new FormData();
		body.append('description', flaggingReasonDescription);
		body.append('comment_id', _commentComment.id);
		body.append('reason_id', flaggingReasonId);

		try {
			const resp = await fetch('?/flagComment', { method: 'POST', body });
			const result: any = deserialize(await resp.text());

			if (result?.type === 'success') {
				notifications.info('Comment Flagged', 3000);
				flaggingReasonDescription = '';
				getModal(`flag-comment-modal-${_commentComment.id}`).close();
			} else {
				throw new Error(result.error);
			}
		} catch (error) {
			console.error('Error flagging comment:', error);
			notifications.danger('Error flagging comment', 3000);
		} finally {
			loading = false;
		}
	}
</script>

<svelte:window bind:innerWidth />

<Card style="margin: .3rem 0; padding: .2rem" className="neumo-card">
	<div
		class="user-comment"
		itemprop="suggestedAnswer acceptedAnswer"
		itemscope
		itemtype="https://schema.org/Answer"
	>
		<div style="display: flex; {innerWidth > 500 ? 'width: 95%;' : 'flex-direction: column; width: 100%;'}">
			<div style="display: flex; flex-direction: column; width: 100%">
				<p class="comment-box" id="comment-box{comment.id}">
					{#if _commentComment?.profiles?.enneagram && _commentComment?.profiles?.external_id}
						<a
							title="View profile"
							class="profile-avatar active"
							href={_commentComment?.profiles?.external_id
								? `/users/${_commentComment.profiles.external_id}`
								: ''}
						>
							{_commentComment?.profiles?.enneagram || 'Rando'}
						</a>
					{:else}
						<span class="profile-avatar {_commentComment?.profiles?.external_id ? '' : 'disabled'}">
							Rando
						</span>
					{/if}
					{#if user?.id === _commentComment?.author_id}
						<button
							type="button"
							class="comment-edit"
							itemprop="text"
							title="Edit"
							on:click={() => getModal(`edit-modal-${_commentComment.id}`).open()}
						>
							<EditIcon height={'1rem'} fill={'var(--accent)'} />
						</button>
					{/if}
					<span class="comment-text" itemprop="text" style="white-space: pre-line">
						{_commentComment.comment}
					</span>
				</p>
				{#if _commentComment?.comment?.length > 136}
					<span
						role="button"
						tabindex="0"
						id="read-more-btn{comment.id}"
						class="read-more-btn"
						on:click={expandText}
						on:keydown={(e) => e.key === 'Enter' && expandText()}
					>
						Read More
					</span>
				{/if}
			</div>
			<div class:mobile={innerWidth < 500} style="display: flex; justify-content: space-between; align-items: center;">
				<div style="display: flex; align-items: center; gap: 0.5rem;">
					<button
						title="Comment"
						class="btn"
						style="padding: 0.25rem;"
						on:click={() => (commenting = !commenting)}
					>
						<MasterCommentIcon
							iconStyle={'padding: 0.25rem;'}
							height={'1.5rem'}
							fill={'var(--accent)'}
							type={_commentComment.comments?.length ? 'full' : 'empty'}
						/>
					</button>
					<button
						title="Like"
						class="btn"
						style="padding: 0.25rem; color: {likes &&
						user?.id &&
						likes.some((e) => e.user_id === user?.id)
							? 'var(--primary)'
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
							fill={likes && user?.id && likes.some((e) => e.user_id === user?.id)
								? 'var(--primary)'
								: '#444'}
						/>
					</button>
				</div>
				<Popover>
					<SettingsIcon
						slot="icon"
						iconStyle={'padding: 0.25rem;'}
						height={'1.5rem'}
						fill={'var(--accent)'}
					/>
					<div slot="popoverValue">
						<div style="display: flex; flex-direction: column">
							<span style="min-width:30px; display:flex; gap: .5rem">
								{#if _commentComment.modified_at}
									<span style="color: var(--primary)" title="modified">M</span>
								{/if}
								<time itemprop="dateCreated" datetime={createdOrModifiedAt}>
									{createdOrModifiedAt}
								</time>
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
			{#if loading}
				<div class="loader" />
			{:else if newcomment?.length > 1}
				<RightIcon
					iconStyle={'margin-left: .5rem; padding: 0.25rem;'}
					height={'1.5rem'}
					fill={'var(--accent)'}
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
					fill={'var(--accent)'}
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
			on:click={save}
			>
			Save
		</button>
	</div>
</Modal2>

<Modal2 id={`flag-comment-modal-${_commentComment.id}`}>
	<div style="max-height: 500px; min-width: 350px">
		<h1>Flag Comment</h1>
		{#if parentData?.flagReasons?.length > 0}
			<p>Reason</p>
			<select bind:value={flaggingReasonId}>
				{#each parentData.flagReasons as reason}
					<option value={reason.id}>{reason.reason}</option>
				{/each}
			</select>
		{/if}
		<p>Description</p>
		<textarea rows="5" bind:value={flaggingReasonDescription} />
		<button
			class="btn btn-primary save-btn"
			type="button"
			style="padding: 0.25rem; display: flex;"
			on:click={submitFlag}
		>
			Send
		</button>
	</div>
</Modal2>

<style lang="scss">
	.rounded {
		border-radius: var(--base-border-radius);
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
		display: inline-block;
		min-width: 78px;
		padding: 0.2rem;
		color: var(--color-theme-purple-light);
		border: 1px solid var(--color-theme-purple-light);
		font-weight: bolder;
		text-align: center;
		border-radius: var(--base-border-radius);
		-moz-transition: all 0.5s; /* Firefox 4 */
		-webkit-transition: all 0.5s; /* Safari and Chrome */
		-o-transition: all 0.5s; /* Opera */
		word-break: keep-all;
	}
	.active {
		border: 1px solid var(--color-theme-purple-light);
		color: var(--primary);
	}
	.active:hover {
		border: 1px solid var(--primary);
	}
</style>