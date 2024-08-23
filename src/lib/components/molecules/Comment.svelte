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

<Card className="neumo-card comment-card">
	<div
		class="user-comment"
		itemprop="suggestedAnswer acceptedAnswer"
		itemscope
		itemtype="https://schema.org/Answer"
	>
		<div class="comment-content">
			<div class="comment-box" id="comment-box{comment.id}">
				<div class="comment-main">
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
					<div class="comment-text-wrapper">
						<span class="comment-text" itemprop="text">
							{_commentComment.comment}
						</span>
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
				</div>
				<div class="comment-actions">
					<div class="action-buttons">
						<button
							title="Comment"
							class="btn action-btn"
							on:click={() => (commenting = !commenting)}
						>
							<MasterCommentIcon
								class="action-icon"
								type={_commentComment.comments?.length ? 'full' : 'empty'}
							/>
						</button>
						<button
							title="Like"
							class="btn action-btn"
							class:liked={likes && user?.id && likes.some((e) => e.user_id === user?.id)}
							on:click={likeComment}
						>
							{#if likes.length}
								<span itemprop="upvoteCount" class="like-count">
									{likes.length}
								</span>
							{/if}
							<ThumbsUpIcon class="action-icon" />
						</button>
						<Popover>
							<SettingsIcon slot="icon" class="action-icon" />
							<div slot="popoverValue" class="popover-content">
								<span class="comment-date">
									{#if _commentComment.modified_at}
										<span class="modified-indicator" title="modified">M</span>
									{/if}
									<time itemprop="dateCreated" datetime={createdOrModifiedAt}>
										{createdOrModifiedAt}
									</time>
								</span>
								<button
									title="Flag Comment"
									class="btn btn-primary flag-btn"
									on:click={() => getModal(`flag-comment-modal-${_commentComment.id}`).open()}
								>
									Flag Comment
								</button>
							</div>
						</Popover>
					</div>
				</div>
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
				<RightIcon class="submit-icon" />
			{/if}
		</button>
	{/if}

	{#if _commentComment?.comments?.length}
		<div class="nested-comments">
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
		<button type="button" class="drop-down" on:click={loadMore} title="Load more comments" style="width: 93%;">
			{comment.comment_count}
			{#if loadingComments}
				<div class="loader" />
			{:else}
				<MasterCommentIcon class="action-icon" type={'multiple'} />
				<DownIcon class="action-icon" />
			{/if}
		</button>
	{/if}
</Card>

<Modal2 id={`edit-modal-${_commentComment.id}`}>
	<div class="modal-content">
		<h1>Edit Comment</h1>
		<textarea rows="5" bind:value={commentEdit} />
		<button
			class="btn btn-primary save-btn"
			type="button"
			on:click={save}
		>
			Save
		</button>
	</div>
</Modal2>

<Modal2 id={`flag-comment-modal-${_commentComment.id}`}>
	<div class="modal-content">
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
			on:click={submitFlag}
		>
			Send
		</button>
	</div>
</Modal2>

<style lang="scss">
	@import './comment.scss';

</style>