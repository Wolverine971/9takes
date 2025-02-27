<script lang="ts">
	import { browser } from '$app/environment';
	import { createEventDispatcher, onMount } from 'svelte';
	import { deserialize } from '$app/forms';
	import { fade, slide } from 'svelte/transition';
	import FingerprintJS from '@fingerprintjs/fingerprintjs';
	import { notifications } from '$lib/components/molecules/notifications';
	import Card from '$lib/components/atoms/card.svelte';
	import Comments from '$lib/components/molecules/Comments.svelte';
	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';
	import Popover from '$lib/components/atoms/Popover.svelte';
	import DownIcon from '$lib/components/icons/downIcon.svelte';
	import MasterCommentIcon from '$lib/components/icons/masterCommentIcon.svelte';
	import RightIcon from '$lib/components/icons/rightIcon.svelte';
	import ThumbsUpIcon from '$lib/components/icons/thumbsUpIcon.svelte';
	import SettingsIcon from '$lib/components/icons/settingsIcon.svelte';

	const dispatch = createEventDispatcher();

	export let user: any;
	export let comment: any;
	export let parentData: any;
	export let questionId: number;

	// State variables
	let likes: any[] = [];
	let loadingComments = false;
	let loading = false;
	let innerWidth = 0;
	let newcomment = '';
	let commenting = false;
	let anonymousComment = false;
	let commentEdit = '';
	let flaggingReasonDescription = '';
	let flaggingReasonId = '';
	let isHovered = false;
	let isExpanded = false;

	// Create a deep copy of the comment to avoid mutation issues
	$: _commentComment = comment ? JSON.parse(JSON.stringify(comment)) : null;

	// Reactive variables
	$: lastDate = _commentComment?.comments?.length
		? _commentComment.comments[_commentComment.comments.length - 1]?.created_at || null
		: null;

	$: createdOrModifiedAt = _commentComment
		? new Date(_commentComment.modified_at || _commentComment.created_at).toLocaleDateString(
				'en-US'
			)
		: '';

	// Update local state when comment changes
	$: if (_commentComment) {
		likes = _commentComment?.comment_like || [];
		commentEdit = _commentComment.comment;
	}

	// Check if comment needs to be truncated
	$: shouldTruncate =
		_commentComment?.comment?.length > 136 || _commentComment?.comment?.includes('\n');

	// Handle comment expansion
	function toggleExpandText() {
		isExpanded = true;
	}

	// Load nested comments
	async function loadNestedComments() {
		if (!user) {
			notifications.info('Must register or login to see nested comments', 3000);
			return;
		}

		loadingComments = true;

		try {
			const response = await fetch(
				`/comments?type=comment&parentId=${_commentComment.id}&lastDate=${lastDate}&range=${
					_commentComment?.comments?.length || 0
				}`
			);

			const newComments = await response.json();

			if (!_commentComment.comments) {
				_commentComment.comments = [];
			}

			_commentComment.comments = [..._commentComment.comments, ...newComments];

			// Update the parent comment data to keep in sync
			comment.comments = _commentComment.comments;
			comment.comment_count = _commentComment.comment_count;
		} catch (error) {
			console.error('Error loading comments:', error);
			notifications.danger('Error loading comments', 3000);
		} finally {
			loadingComments = false;
		}
	}

	// Handle like/unlike
	async function toggleLike() {
		if (!user) {
			notifications.info('Must register or login to like comments', 3000);
			return;
		}

		const isLiked = likes.some((e) => e.user_id === user.id);
		const operation = isLiked ? 'remove' : 'add';

		try {
			const body = new FormData();
			body.append('parent_id', _commentComment.id);
			body.append('user_id', user.id);
			body.append('es_id', _commentComment.es_id);
			body.append('operation', operation);

			const resp = await fetch('?/likeComment', { method: 'POST', body });
			const result: any = deserialize(await resp.text());

			notifications.info(operation === 'add' ? 'Like Added' : 'Like Removed', 3000);

			if (operation === 'add' && result?.data) {
				likes = [result.data, ...likes];
			} else {
				likes = likes.filter((c) => c.user_id !== user.id);
			}

			_commentComment.comment_like = likes;
			dispatch('commentUpdated', _commentComment);
		} catch (error) {
			console.error('Error liking comment:', error);
			notifications.danger('Error processing like', 3000);
		}
	}

	// Add reply to comment
	async function createReply() {
		if (!canComment()) return;
		loading = true;

		try {
			const fp = await FingerprintJS.load();
			const fpval = await fp.get();

			const body = new FormData();
			body.append('comment', newcomment);
			body.append('parent_id', _commentComment.id);
			body.append('author_id', user?.id);
			body.append('parent_type', 'comment');
			body.append('es_id', _commentComment.es_id);
			body.append('question_id', questionId.toString());
			body.append('fingerprint', fpval?.visitorId?.toString());

			const resp = await fetch('?/createCommentRando', { method: 'POST', body });
			const result: any = deserialize(await resp.text());

			if (result.error) {
				throw new Error(result.error);
			}

			notifications.info('Reply Added', 3000);
			dispatch('commentAdded', result?.data);
			dispatch('commentUpdated', _commentComment);
			newcomment = '';
			commenting = false;
		} catch (error) {
			console.error('Error adding reply:', error);
			notifications.danger('Error adding reply', 3000);
		} finally {
			loading = false;
		}
	}

	// Check if user can comment
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

	// Edit comment
	async function saveEdit() {
		loading = true;

		try {
			const body = new FormData();
			body.append('comment', commentEdit);
			body.append('comment_id', _commentComment.id);

			const resp = await fetch('/comments', { method: 'POST', body });
			const result: any = deserialize(await resp.text());

			if (result?.success) {
				notifications.info('Comment Updated', 3000);
				_commentComment.comment = commentEdit;
				dispatch('commentUpdated', _commentComment);
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

	// Flag comment
	async function submitFlag() {
		if (!flaggingReasonId) {
			notifications.info('Please select a reason', 3000);
			return;
		}

		loading = true;

		try {
			const body = new FormData();
			body.append('description', flaggingReasonDescription);
			body.append('comment_id', _commentComment.id);
			body.append('reason_id', flaggingReasonId);

			const resp = await fetch('?/flagComment', { method: 'POST', body });
			const result: any = deserialize(await resp.text());

			if (result?.type === 'success') {
				notifications.info('Comment Flagged', 3000);
				flaggingReasonDescription = '';
				flaggingReasonId = '';
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

	// Initialize on mount
	onMount(() => {
		innerWidth = window.innerWidth;
	});
</script>

<svelte:window bind:innerWidth />

{#if _commentComment}
	<Card class="comment-card">
		<div
			class="user-comment"
			itemprop="suggestedAnswer acceptedAnswer"
			itemscope
			itemtype="https://schema.org/Answer"
		>
			<div class="comment-content">
				<div class="comment-box" id="comment-box{_commentComment.id}">
					<div class="comment-main">
						{#if _commentComment?.profiles?.enneagram && _commentComment?.profiles?.external_id}
							<a
								title="View profile"
								class="profile-avatar active"
								href={`/users/${_commentComment.profiles.external_id}`}
							>
								{_commentComment?.profiles?.enneagram || 'Rando'}
							</a>
						{:else}
							<span
								class="profile-avatar {_commentComment?.profiles?.external_id ? '' : 'disabled'}"
							>
								Rando
							</span>
						{/if}

						<div class="comment-text-wrapper">
							<div class="comment-text {isExpanded ? 'expanded' : ''}" itemprop="text">
								{_commentComment.comment}
							</div>

							{#if shouldTruncate && !isExpanded}
								<button type="button" class="read-more-btn" on:click={toggleExpandText}>
									Read More
								</button>
							{/if}
						</div>
					</div>

					<div
						class="comment-actions"
						on:mouseenter={() => (isHovered = true)}
						on:mouseleave={() => (isHovered = false)}
					>
						<div class="action-buttons" class:hovered={isHovered}>
							<button title="Reply" class="action-btn" on:click={() => (commenting = !commenting)}>
								<MasterCommentIcon
									className="action-icon"
									type={_commentComment.comments?.length ? 'full' : 'empty'}
								/>
								{#if innerWidth > 576}
									<span class="btn-text">Reply</span>
								{/if}
							</button>

							<button
								title={likes.some((e) => e.user_id === user?.id) ? 'Unlike' : 'Like'}
								class="action-btn"
								class:liked={likes.some((e) => e.user_id === user?.id)}
								on:click={toggleLike}
							>
								<ThumbsUpIcon className="action-icon" />
								{#if likes.length}
									<span itemprop="upvoteCount" class="like-count">
										{likes.length}
									</span>
								{:else if innerWidth > 576}
									<span class="btn-text">Like</span>
								{/if}
							</button>

							<div class="settings-dropdown">
								<Popover>
									<div slot="icon">
										<SettingsIcon className="action-icon" />
									</div>

									<div slot="popoverValue" class="popover-content">
										<div class="popover-header">
											<span class="comment-date">
												{#if _commentComment.modified_at}
													<span class="modified-indicator" title="Modified">M</span>
												{/if}
												<time itemprop="dateCreated" datetime={createdOrModifiedAt}>
													{createdOrModifiedAt}
												</time>
											</span>
										</div>

										{#if user?.id === _commentComment.author_id}
											<button
												class="popover-btn"
												on:click={() => getModal(`edit-modal-${_commentComment.id}`).open()}
											>
												Edit Comment
											</button>
										{/if}

										<button
											class="popover-btn flag-btn"
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
		</div>

		<!-- Reply form -->
		{#if commenting}
			<div class="reply-form" transition:slide={{ duration: 200 }}>
				<div class="textarea-container">
					<textarea
						placeholder="Write your reply..."
						class="reply-textarea"
						bind:value={newcomment}
						rows="3"
					></textarea>
				</div>
				<div class="button-group">
					<button
						class="cancel-btn"
						type="button"
						on:click={() => {
							commenting = false;
							newcomment = '';
						}}
					>
						Cancel
					</button>
					<button
						class="submit-btn"
						type="button"
						on:click={createReply}
						disabled={!newcomment?.length}
					>
						{#if loading}
							<div class="loader"></div>
						{:else}
							Submit
							<RightIcon className="submit-icon" />
						{/if}
					</button>
				</div>
			</div>
		{/if}

		<!-- Nested comments -->
		{#if _commentComment?.comments?.length}
			<div class="nested-comments">
				<Comments
					{questionId}
					comments={_commentComment.comments}
					comment_count={_commentComment.comment_count}
					parentData={_commentComment}
					parentType={'comment'}
					{user}
					onCommentsUpdate={(updatedComments) => {
						_commentComment.comments = updatedComments;
						comment.comments = updatedComments;
					}}
				/>
			</div>
		{/if}

		<!-- Load more comments button -->
		{#if _commentComment.comment_count > 0 && !_commentComment?.comments?.length}
			<button
				type="button"
				class="load-more-btn"
				on:click={loadNestedComments}
				disabled={loadingComments}
			>
				{#if loadingComments}
					<div class="loader" />
				{:else}
					<span
						>Show {_commentComment.comment_count}
						{_commentComment.comment_count === 1 ? 'reply' : 'replies'}</span
					>
					<div class="icon-group">
						<MasterCommentIcon className="action-icon" type="multiple" />
						<DownIcon className="action-icon" />
					</div>
				{/if}
			</button>
		{/if}
	</Card>
{/if}

<!-- Edit Comment Modal -->
<Modal2 id={`edit-modal-${_commentComment?.id}`}>
	<div class="modal-content">
		<h2>Edit Comment</h2>
		<div class="modal-body">
			<textarea
				rows="5"
				bind:value={commentEdit}
				class="modal-textarea"
				placeholder="Edit your comment..."
			></textarea>
		</div>
		<div class="modal-actions">
			<button
				class="cancel-btn"
				type="button"
				on:click={() => getModal(`edit-modal-${_commentComment?.id}`).close()}
			>
				Cancel
			</button>
			<button
				class="submit-btn"
				type="button"
				on:click={saveEdit}
				disabled={loading || !commentEdit.trim()}
			>
				{#if loading}
					<div class="loader"></div>
				{:else}
					Save Changes
				{/if}
			</button>
		</div>
	</div>
</Modal2>

<!-- Flag Comment Modal -->
<Modal2 id={`flag-comment-modal-${_commentComment?.id}`}>
	<div class="modal-content">
		<h2>Flag Comment</h2>
		<div class="modal-body">
			{#if parentData?.flagReasons?.length > 0}
				<div class="form-group">
					<label for="flag-reason">Reason</label>
					<select id="flag-reason" bind:value={flaggingReasonId} class="select-input">
						<option value="" disabled selected>Select a reason</option>
						{#each parentData.flagReasons as reason}
							<option value={reason.id}>{reason.reason}</option>
						{/each}
					</select>
				</div>
			{/if}
			<div class="form-group">
				<label for="flag-description">Description</label>
				<textarea
					id="flag-description"
					rows="4"
					bind:value={flaggingReasonDescription}
					class="modal-textarea"
					placeholder="Please provide details about why you're flagging this comment..."
				></textarea>
			</div>
		</div>
		<div class="modal-actions">
			<button
				class="cancel-btn"
				type="button"
				on:click={() => getModal(`flag-comment-modal-${_commentComment?.id}`).close()}
			>
				Cancel
			</button>
			<button
				class="submit-btn"
				type="button"
				on:click={submitFlag}
				disabled={loading || !flaggingReasonId}
			>
				{#if loading}
					<div class="loader"></div>
				{:else}
					Submit
				{/if}
			</button>
		</div>
	</div>
</Modal2>

<style lang="scss">
	/* Import shared styles for comments */
	@import './comment.scss';

	/* Additional component-specific styles can go here if needed */
</style>
