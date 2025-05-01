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
	let flagError = '';

	// Create a deep copy of the comment to avoid mutation issues
	$: _commentComment = comment ? structuredClone(comment) : null;

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

	// Reset flag modal state
	function resetFlagModal() {
		flaggingReasonDescription = '';
		flaggingReasonId = '';
		flagError = '';
	}

	// Open flag modal
	function openFlagModal() {
		resetFlagModal();
		getModal(`flag-comment-modal-${_commentComment.id}`).open();
	}

	// Close flag modal
	function closeFlagModal() {
		resetFlagModal();
		getModal(`flag-comment-modal-${_commentComment.id}`).close();
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

			if (!response.ok) {
				throw new Error(`Server responded with status: ${response.status}`);
			}

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

			if (!resp.ok) {
				throw new Error(`Server responded with status: ${resp.status}`);
			}

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
		if (!newcomment.trim()) {
			notifications.info('Comment cannot be empty', 3000);
			return;
		}

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

			if (!resp.ok) {
				throw new Error(`Server responded with status: ${resp.status}`);
			}

			const result: any = deserialize(await resp.text());

			if (result.error) {
				throw new Error(result.error);
			}

			notifications.info('Reply Added', 3000);

			// Update comment count
			_commentComment.comment_count = (_commentComment.comment_count || 0) + 1;

			// If comments is undefined, initialize it
			if (!_commentComment.comments) {
				_commentComment.comments = [];
			}

			// Add the new comment to the list
			if (result?.data) {
				_commentComment.comments = [result.data, ..._commentComment.comments];
			}

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
		if (!commentEdit.trim()) {
			notifications.info('Comment cannot be empty', 3000);
			return;
		}

		loading = true;

		try {
			const body = new FormData();
			body.append('comment', commentEdit);
			body.append('comment_id', _commentComment.id);

			const resp = await fetch('/comments', { method: 'POST', body });

			if (!resp.ok) {
				throw new Error(`Server responded with status: ${resp.status}`);
			}

			const result: any = deserialize(await resp.text());

			if (result?.success) {
				notifications.info('Comment Updated', 3000);
				_commentComment.comment = commentEdit;
				_commentComment.modified_at = new Date().toISOString();
				dispatch('commentUpdated', _commentComment);
				getModal(`edit-modal-${_commentComment.id}`).close();
			} else {
				throw new Error(result.error || 'Failed to update comment');
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
		// Reset previous error
		flagError = '';

		// Validate flag reason
		if (!flaggingReasonId) {
			flagError = 'Please select a reason';
			notifications.info(flagError, 3000);
			return;
		}

		loading = true;

		try {
			const body = new FormData();
			body.append('description', flaggingReasonDescription);
			body.append('comment_id', _commentComment.id);
			body.append('reason_id', flaggingReasonId);

			// Add user information if logged in
			if (user?.id) {
				body.append('user_id', user.id);
			}

			const resp = await fetch('?/flagComment', { method: 'POST', body });

			if (!resp.ok) {
				throw new Error(`Server responded with status: ${resp.status}`);
			}

			const result: any = deserialize(await resp.text());

			// Check for success - handle multiple possible response formats
			if (result?.type === 'success' || result?.success === true) {
				notifications.info('Comment Flagged', 3000);
				notifications.info('Will be reviewed by admins', 5000);
				resetFlagModal();
				closeFlagModal();
			} else if (result?.error) {
				flagError = result.error;
				throw new Error(result.error);
			} else {
				flagError = 'Failed to flag comment';
				throw new Error('Failed to flag comment');
			}
		} catch (error) {
			console.error('Error flagging comment:', error);
			notifications.danger(flagError || 'Error flagging comment', 3000);
		} finally {
			loading = false;
		}
	}

	// Initialize on mount
	onMount(() => {
		innerWidth = window.innerWidth;

		// Add resize event listener
		const handleResize = () => {
			innerWidth = window.innerWidth;
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
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
						<div class="action-buttons hovered">
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

										<button class="popover-btn flag-btn" on:click={openFlagModal}>
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
						disabled={loading || !newcomment?.trim()}
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
			{#if flagError}
				<div class="error-message">{flagError}</div>
			{/if}

			{#if parentData?.flagReasons?.length > 0}
				<div class="form-group">
					<label for="flag-reason">Reason <span class="required">*</span></label>
					<select
						id="flag-reason"
						bind:value={flaggingReasonId}
						class="select-input"
						class:error={flagError && !flaggingReasonId}
					>
						<option value="" disabled selected>Select a reason</option>
						{#each parentData.flagReasons as reason}
							<option value={reason.id}>{reason.reason}</option>
						{/each}
					</select>
					{#if flagError && !flaggingReasonId}
						<div class="field-error">Please select a reason</div>
					{/if}
				</div>
			{:else}
				<div class="info-message">No flag reasons available. Please contact an administrator.</div>
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
			<button class="cancel-btn" type="button" on:click={closeFlagModal}> Cancel </button>
			<button
				class="submit-btn"
				type="button"
				on:click={submitFlag}
				disabled={loading || !flaggingReasonId || !parentData?.flagReasons?.length}
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
	@use './comment.scss' as *;

	/* Additional component-specific styles */
	.error-message {
		padding: 0.5rem;
		margin-bottom: 1rem;
		background-color: rgba(255, 0, 0, 0.1);
		border-left: 3px solid red;
		color: #d32f2f;
		border-radius: 4px;
	}

	.info-message {
		padding: 0.5rem;
		margin-bottom: 1rem;
		background-color: rgba(33, 150, 243, 0.1);
		border-left: 3px solid #2196f3;
		color: #1976d2;
		border-radius: 4px;
	}

	.field-error {
		color: #d32f2f;
		font-size: 0.8rem;
		margin-top: 0.2rem;
	}

	.required {
		color: #d32f2f;
	}

	.form-group {
		margin-bottom: 1rem;
	}

	select.error {
		border-color: #d32f2f;
	}

	label {
		display: block;
		margin-bottom: 0.3rem;
		font-weight: 500;
	}
</style>
