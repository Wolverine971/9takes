<!-- src/lib/components/molecules/Comment.svelte -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { deserialize } from '$app/forms';
	import { fade, slide } from 'svelte/transition';
	import { getOrCreateVisitorId } from '$lib/analytics/visitorIdentity';
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
	import type {
		User,
		Comment as CommentType,
		CommentLike,
		QuestionPageData
	} from '$lib/types/questions';
	import { viewportWidth } from '$lib/stores/viewport';

	const dispatch = createEventDispatcher<{
		commentAdded: CommentType;
		commentUpdated: CommentType;
	}>();

	export let user: User | null;
	export let comment: CommentType;
	export let parentData: QuestionPageData | CommentType;
	export let questionId: number;

	// State variables
	let likes: CommentLike[] = [];
	let loadingComments = false;
	let loading = false;

	// Cached visitor id for replies
	let cachedFingerprint: string | null = null;

	// Use shared viewport store
	$: innerWidth = $viewportWidth;
	let newcomment = '';
	let commenting = false;
	let anonymousComment = false;
	let commentEdit = '';
	let flaggingReasonDescription = '';
	let flaggingReasonId = '';
	let isHovered = false;
	let isExpanded = false;
	let flagError = '';
	let showReplies = false;

	// Constants
	const COMMENT_TRUNCATE_LENGTH = 136;

	// Create a deep copy of the comment to avoid mutation issues
	let _commentComment: CommentType = structuredClone(comment);
	$: _commentComment = structuredClone(comment);

	// Reactive variables
	$: questionPageData =
		parentData && 'flags' in parentData ? (parentData as QuestionPageData) : null;
	$: flagReasons = questionPageData?.flagReasons ?? [];

	$: lastDate = _commentComment.comments?.length
		? _commentComment.comments[_commentComment.comments.length - 1]?.created_at || null
		: null;

	$: createdOrModifiedAt = new Date(
		_commentComment.modified_at || _commentComment.created_at
	).toLocaleDateString('en-US');

	// Update local state when comment changes
	$: likes = _commentComment.comment_like || [];
	$: commentEdit = _commentComment.comment;

	// Check if comment needs to be truncated (either exceeds length limit or contains newlines)
	$: shouldTruncate =
		(_commentComment.comment?.length ?? 0) > COMMENT_TRUNCATE_LENGTH ||
		_commentComment.comment?.includes('\n');

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

			// Show replies after loading
			showReplies = true;
		} catch (error) {
			console.error('Error loading comments:', error);
			notifications.danger('Error loading comments', 3000);
		} finally {
			loadingComments = false;
		}
	}

	// Toggle replies visibility
	function toggleReplies() {
		if (_commentComment.comments?.length) {
			// Already loaded, just toggle visibility
			showReplies = !showReplies;
		} else if (_commentComment.comment_count > 0) {
			// Need to load first
			loadNestedComments();
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
			body.append('parent_id', _commentComment.id.toString());
			body.append('user_id', user.id);
			body.append('es_id', _commentComment.es_id ?? '');
			body.append('operation', operation);

			const resp = await fetch('?/likeComment', { method: 'POST', body });

			if (!resp.ok) {
				throw new Error(`Server responded with status: ${resp.status}`);
			}

			const result: any = deserialize(await resp.text());

			notifications.success(operation === 'add' ? 'Like Added' : 'Like Removed', 3000);

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
		if (!user?.id) {
			notifications.info('Must register or login to reply', 3000);
			return;
		}
		if (!newcomment.trim()) {
			notifications.info('Comment cannot be empty', 3000);
			return;
		}

		loading = true;

		try {
			const fingerprint = cachedFingerprint || getOrCreateVisitorId();
			cachedFingerprint = fingerprint;

			const body = new FormData();
			body.append('comment', newcomment);
			body.append('parent_id', _commentComment.id.toString());
			body.append('author_id', user.id);
			body.append('parent_type', 'comment');
			body.append('es_id', _commentComment.es_id ?? '');
			body.append('question_id', questionId.toString());
			body.append('fingerprint', fingerprint);

			const resp = await fetch('?/createCommentRando', { method: 'POST', body });

			if (!resp.ok) {
				throw new Error(`Server responded with status: ${resp.status}`);
			}

			const result: any = deserialize(await resp.text());

			if (result.error) {
				throw new Error(result.error);
			}

			notifications.success('Reply Added', 3000);

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
			showReplies = true; // Show replies so user can see their new reply
		} catch (error) {
			console.error('Error adding reply:', error);
			notifications.danger('Error adding reply', 3000);
		} finally {
			loading = false;
		}
	}

	// Check if user can comment
	function canComment() {
		if (!questionPageData?.flags?.userSignedIn && !user?.id) {
			if (questionPageData?.flags?.userHasAnswered || anonymousComment) {
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
			body.append('comment_id', _commentComment.id.toString());

			const resp = await fetch('/comments', { method: 'POST', body });

			if (!resp.ok) {
				throw new Error(`Server responded with status: ${resp.status}`);
			}

			const result: any = deserialize(await resp.text());

			if (result?.success) {
				notifications.success('Comment Updated', 3000);
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
			body.append('comment_id', _commentComment.id.toString());
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
</script>

{#if _commentComment}
	<div
		class="group relative rounded-lg border border-[var(--bg-elevated)] bg-[var(--bg-surface)] transition-all duration-200 hover:border-[var(--primary-subtle)] hover:shadow-[var(--glow-sm)]"
	>
		<div class="flex flex-col">
			<div class="flex w-full flex-col">
				<!-- Comment Header and Content -->
				<div class="p-3" id="comment-box{_commentComment.id}">
					<!-- User Badge and Timestamp -->
					<div class="mb-2 flex items-start justify-between">
						<div class="flex items-center gap-3">
							{#if _commentComment?.profiles?.enneagram && _commentComment?.profiles?.external_id}
								<a
									title="View profile"
									class="inline-flex h-8 items-center justify-center rounded-md bg-primary-600 px-3 text-xs font-semibold text-white transition-all duration-200 hover:bg-primary-700"
									href={`/users/${_commentComment.profiles.external_id}`}
								>
									Type {_commentComment?.profiles?.enneagram || 'Rando'}
								</a>
							{:else}
								<span
									class="inline-flex h-8 items-center justify-center rounded-md bg-[var(--bg-elevated)] px-3 text-xs font-medium text-[var(--text-secondary)]"
								>
									Anonymous
								</span>
							{/if}

							<!-- Timestamp -->
							<span class="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)]">
								{#if _commentComment.modified_at}
									<span
										class="inline-flex h-3.5 w-3.5 items-center justify-center rounded bg-[var(--primary-subtle)] text-[9px] font-bold text-[var(--primary)]"
										title="Modified">M</span
									>
								{/if}
								<time itemprop="dateCreated" datetime={createdOrModifiedAt}>
									{createdOrModifiedAt}
								</time>
							</span>
						</div>
					</div>

					<!-- Comment Text -->
					<div class="relative mb-3 w-full">
						<div
							class="block {isExpanded
								? ''
								: 'max-h-[4.5em] overflow-hidden'} relative whitespace-pre-line text-sm leading-relaxed text-[var(--text-primary)] transition-all duration-200"
							itemprop="text"
						>
							{_commentComment.comment}
						</div>

						{#if shouldTruncate && !isExpanded}
							<button
								type="button"
								class="mt-1 text-sm font-medium text-[var(--primary)] transition-all duration-200 hover:text-[var(--primary-light)]"
								on:click={toggleExpandText}
							>
								Read more
							</button>
						{/if}
					</div>

					<!-- Interaction Buttons -->
					<div
						class="-ml-2 -mr-2 flex items-center gap-1"
						role="group"
						aria-label="Comment actions"
					>
						<button
							title={likes.some((e) => e.user_id === user?.id) ? 'Unlike' : 'Like'}
							aria-label={likes.some((e) => e.user_id === user?.id)
								? `Unlike this comment (${likes.length} likes)`
								: `Like this comment${likes.length > 0 ? ` (${likes.length} likes)` : ''}`}
							aria-pressed={likes.some((e) => e.user_id === user?.id)}
							class="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm transition-all duration-200 {likes.some(
								(e) => e.user_id === user?.id
							)
								? 'bg-[var(--primary-subtle)] text-[var(--primary)]'
								: 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'}"
							on:click={toggleLike}
						>
							<ThumbsUpIcon className="w-3.5 h-3.5" />
							{#if likes.length}
								<span itemprop="upvoteCount">
									{likes.length}
								</span>
							{:else}
								<span>Like</span>
							{/if}
						</button>

						<button
							title="Reply to this comment"
							aria-label={commenting ? 'Hide reply form' : 'Reply to this comment'}
							aria-expanded={commenting}
							class="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-[var(--text-secondary)] transition-all duration-200 hover:bg-[var(--bg-elevated)]"
							on:click={() => (commenting = !commenting)}
						>
							<MasterCommentIcon
								className="w-3.5 h-3.5"
								type={_commentComment.comments?.length ? 'full' : 'empty'}
							/>
							<span>Reply</span>
						</button>

						<div class="ml-auto">
							<Popover position="bottom-right">
								<svelte:fragment slot="icon">
									<div
										class="flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200 hover:bg-[var(--bg-elevated)]"
									>
										<SettingsIcon className="w-4 h-4 text-[var(--text-tertiary)]" />
									</div>
								</svelte:fragment>

								<svelte:fragment slot="popoverValue">
									<div class="flex flex-col gap-1">
										{#if user?.id === _commentComment.author_id}
											<button
												type="button"
												class="w-full rounded-md px-3 py-2 text-left text-sm text-[var(--text-secondary)] transition-colors duration-200 hover:bg-[var(--primary-subtle)] hover:text-[var(--text-primary)]"
												on:click={() => getModal(`edit-modal-${_commentComment.id}`).open()}
											>
												Edit Comment
											</button>
										{/if}

										<button
											type="button"
											class="w-full rounded-md px-3 py-2 text-left text-sm text-red-400 transition-colors duration-200 hover:bg-red-500/20 hover:text-red-300"
											on:click={openFlagModal}
										>
											Flag Comment
										</button>
									</div>
								</svelte:fragment>
							</Popover>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Reply form -->
		{#if commenting}
			<div
				class="border-t border-[var(--bg-elevated)] bg-[var(--bg-deep)] p-4 sm:p-3"
				transition:slide={{ duration: 300 }}
			>
				<div class="mb-3">
					<textarea
						placeholder="Share your perspective — what's your experience with this? The more detail, the better the conversation."
						class="w-full resize-y rounded-xl border border-[var(--bg-elevated)] bg-[var(--bg-elevated)] p-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-subtle)]"
						bind:value={newcomment}
						rows="3"
					></textarea>
				</div>
				<div class="flex justify-end gap-2 sm:flex-row">
					<button
						class="rounded-full border border-[var(--bg-elevated)] bg-transparent px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-all duration-200 hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] active:scale-[0.98] sm:px-3 sm:py-1.5"
						type="button"
						on:click={() => {
							commenting = false;
							newcomment = '';
						}}
					>
						Cancel
					</button>
					<button
						class="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[var(--primary-dark)] to-[var(--primary-darker)] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:shadow-[var(--glow-md)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 sm:px-3 sm:py-1.5"
						type="button"
						on:click={createReply}
						disabled={loading || !newcomment?.trim()}
					>
						{#if loading}
							<div
								class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
							></div>
						{:else}
							Reply
						{/if}
					</button>
				</div>
			</div>
		{/if}

		<!-- Replies toggle and nested comments -->
		{#if _commentComment.comment_count > 0}
			<div class="border-t border-[var(--bg-elevated)]">
				<!-- Reply thread toggle -->
				<button
					type="button"
					class="group/toggle hover:bg-[var(--bg-elevated)]/50 flex w-full items-center gap-2 px-3 py-2 text-left transition-colors duration-200"
					on:click={toggleReplies}
					disabled={loadingComments}
					aria-expanded={showReplies}
					aria-label={showReplies ? 'Hide replies' : 'Show replies'}
				>
					<!-- Thread line indicator -->
					<div class="flex h-5 w-5 items-center justify-center">
						{#if loadingComments}
							<div
								class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[var(--primary-subtle)] border-t-[var(--primary)]"
							></div>
						{:else}
							<svg
								class="h-4 w-4 text-[var(--text-tertiary)] transition-transform duration-200 group-hover/toggle:text-[var(--primary)] {showReplies
									? 'rotate-90'
									: ''}"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 5l7 7-7 7"
								/>
							</svg>
						{/if}
					</div>

					<!-- Reply count -->
					<span
						class="text-sm font-medium text-[var(--text-secondary)] transition-colors duration-200 group-hover/toggle:text-[var(--text-primary)]"
					>
						{_commentComment.comment_count}
						{_commentComment.comment_count === 1 ? 'reply' : 'replies'}
					</span>

					<!-- Visual indicator of nested content -->
					{#if !showReplies && _commentComment?.comments?.length}
						<span class="text-xs text-[var(--text-tertiary)]">(loaded)</span>
					{/if}
				</button>

				<!-- Nested comments container -->
				{#if showReplies && _commentComment?.comments?.length}
					<div
						class="relative ml-3 border-l-2 border-[var(--primary-subtle)] pl-4 pt-1 sm:ml-2 sm:pl-3"
						transition:slide={{ duration: 200 }}
					>
						<!-- Thread connector dot -->
						<div class="absolute -left-[5px] top-0 h-2 w-2 rounded-full bg-[var(--primary)]"></div>

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
			</div>
		{/if}
	</div>
{/if}

<!-- Edit Comment Modal -->
<Modal2 id={`edit-modal-${_commentComment?.id}`} maxWidth="480px">
	<div class="w-full">
		<h2 class="mb-2 mt-0 text-2xl font-semibold text-[var(--text-primary)]">Edit Comment</h2>
		<p class="mb-6 text-sm text-[var(--text-secondary)]">Make changes to your comment below.</p>

		<div class="mb-8">
			<label
				for="edit-comment-{_commentComment?.id}"
				class="mb-2 block text-sm font-medium text-[var(--text-secondary)]"
			>
				Your comment
			</label>
			<textarea
				id="edit-comment-{_commentComment?.id}"
				rows="6"
				bind:value={commentEdit}
				class="w-full resize-y rounded-xl border border-[var(--bg-elevated)] bg-[var(--bg-elevated)] p-4 text-base leading-relaxed text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-all duration-200 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-subtle)]"
				placeholder="Edit your comment..."
			></textarea>
		</div>

		<div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
			<button
				class="w-full cursor-pointer rounded-full border border-[var(--bg-elevated)] bg-transparent px-6 py-3 text-base font-medium text-[var(--text-secondary)] transition-all duration-200 hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] sm:w-auto"
				type="button"
				on:click={() => getModal(`edit-modal-${_commentComment?.id}`).close()}
			>
				Cancel
			</button>
			<button
				class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border-none bg-gradient-to-r from-[var(--primary-dark)] to-[var(--primary-darker)] px-6 py-3 text-base font-medium text-white transition-all duration-200 hover:shadow-[var(--glow-md)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
				type="button"
				on:click={saveEdit}
				disabled={loading || !commentEdit.trim()}
			>
				{#if loading}
					<div
						class="border-[var(--primary-light)]/30 h-5 w-5 animate-spin rounded-full border-2 border-t-white"
					></div>
				{:else}
					Save Changes
				{/if}
			</button>
		</div>
	</div>
</Modal2>

<!-- Flag Comment Modal -->
<Modal2 id={`flag-comment-modal-${_commentComment?.id}`} maxWidth="480px">
	<div class="w-full" role="dialog" aria-labelledby={`flag-modal-title-${_commentComment?.id}`}>
		<div class="mb-6">
			<h2
				id={`flag-modal-title-${_commentComment?.id}`}
				class="mb-2 mt-0 text-2xl font-semibold text-[var(--text-primary)]"
			>
				Flag Comment
			</h2>
			<p class="text-sm text-[var(--text-secondary)]">
				Help us keep the community safe by reporting inappropriate content.
			</p>
		</div>

		<form on:submit|preventDefault={submitFlag} novalidate>
			<fieldset disabled={loading} class="m-0 border-0 p-0">
				{#if flagError}
					<div
						class="mb-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400"
						role="alert"
					>
						<svg
							class="h-5 w-5 flex-shrink-0"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span>{flagError}</span>
					</div>
				{/if}

				{#if flagReasons.length > 0}
					<div class="mb-6">
						<label
							for={`flag-reason-${_commentComment?.id}`}
							class="mb-3 block text-sm font-medium text-[var(--text-secondary)]"
						>
							Reason for flagging <span class="text-red-400" aria-hidden="true">*</span>
							<span class="sr-only">(required)</span>
						</label>
						<select
							id={`flag-reason-${_commentComment?.id}`}
							bind:value={flaggingReasonId}
							required
							aria-required="true"
							aria-invalid={flagError && !flaggingReasonId ? 'true' : undefined}
							aria-describedby={flagError && !flaggingReasonId
								? `flag-reason-error-${_commentComment?.id}`
								: undefined}
							class="w-full cursor-pointer rounded-xl border bg-[var(--bg-elevated)] p-4 text-base text-[var(--text-primary)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-subtle)] {flagError &&
							!flaggingReasonId
								? 'border-red-500'
								: 'border-[var(--bg-elevated)] focus:border-[var(--primary)]'}"
						>
							<option value="" disabled selected>Select a reason...</option>
							{#each flagReasons as reason}
								<option value={reason.id}>{reason.reason}</option>
							{/each}
						</select>
						{#if flagError && !flaggingReasonId}
							<div
								id={`flag-reason-error-${_commentComment?.id}`}
								class="mt-2 text-sm text-red-400"
								role="alert"
							>
								Please select a reason
							</div>
						{/if}
					</div>
				{:else}
					<div
						class="mb-6 flex items-center gap-3 rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 text-blue-400"
						role="status"
					>
						<svg
							class="h-5 w-5 flex-shrink-0"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span>No flag reasons available. Please contact an administrator.</span>
					</div>
				{/if}

				<div class="mb-8">
					<label
						for={`flag-description-${_commentComment?.id}`}
						class="mb-3 block text-sm font-medium text-[var(--text-secondary)]"
					>
						Additional details <span class="font-normal text-[var(--text-tertiary)]"
							>(optional)</span
						>
					</label>
					<textarea
						id={`flag-description-${_commentComment?.id}`}
						rows="4"
						bind:value={flaggingReasonDescription}
						class="w-full resize-y rounded-xl border border-[var(--bg-elevated)] bg-[var(--bg-elevated)] p-4 text-base leading-relaxed text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-all duration-200 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-subtle)]"
						placeholder="Provide any additional context that might help us review this comment..."
					></textarea>
				</div>
			</fieldset>

			<div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
				<button
					class="w-full cursor-pointer rounded-full border border-[var(--bg-elevated)] bg-transparent px-6 py-3 text-base font-medium text-[var(--text-secondary)] transition-all duration-200 hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] sm:w-auto"
					type="button"
					on:click={closeFlagModal}
				>
					Cancel
				</button>
				<button
					class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border-none bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 text-base font-medium text-white transition-all duration-200 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
					type="submit"
					disabled={loading || !flaggingReasonId || !flagReasons.length}
					aria-busy={loading}
				>
					{#if loading}
						<div
							class="h-5 w-5 animate-spin rounded-full border-2 border-red-300/30 border-t-white"
							aria-hidden="true"
						></div>
						<span class="sr-only">Submitting...</span>
					{:else}
						Submit Report
					{/if}
				</button>
			</div>
		</form>
	</div>
</Modal2>
