<!-- src/lib/components/molecules/Comment.svelte -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { deserialize } from '$app/forms';
	import { slide } from 'svelte/transition';
	import { getOrCreateVisitorId } from '$lib/analytics/visitorIdentity';
	import { notifications } from '$lib/components/molecules/notifications';
	import Comments from '$lib/components/molecules/Comments.svelte';
	import Modal, { getModal } from '$lib/components/atoms/Modal.svelte';
	import Popover from '$lib/components/atoms/Popover.svelte';
	import MasterCommentIcon from '$lib/components/icons/masterCommentIcon.svelte';
	import ThumbsUpIcon from '$lib/components/icons/thumbsUpIcon.svelte';
	import SettingsIcon from '$lib/components/icons/settingsIcon.svelte';
	import type {
		User,
		Comment as CommentType,
		CommentLike,
		QuestionPageData
	} from '$lib/types/questions';

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

	let newcomment = '';
	let replyError = '';
	let commenting = false;
	let anonymousComment = false;
	let commentEdit = '';
	let flaggingReasonDescription = '';
	let flaggingReasonId = '';
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
			notifications.info('Sign up or log in to see nested comments.', 3000);
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
			notifications.info('Sign up or log in to like comments.', 3000);
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
			replyError = 'Sign up or log in to reply.';
			notifications.info('Sign up or log in to reply.', 3000);
			return;
		}
		if (!newcomment.trim()) {
			replyError = 'Write a reply before posting.';
			notifications.info('Comment cannot be empty', 3000);
			return;
		}

		replyError = '';
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
			replyError = 'We could not add your reply. Please try again.';
			notifications.danger('Error adding reply', 3000);
		} finally {
			loading = false;
		}
	}

	// Check if user can comment
	function canComment() {
		if (!questionPageData?.flags?.userSignedIn && !user?.id) {
			if (questionPageData?.flags?.userHasAnswered || anonymousComment) {
				replyError = 'Sign up or log in to comment more than once.';
				notifications.info('Sign up or log in to comment multiple times.', 3000);
				return false;
			} else {
				replyError = 'Sign up or log in to reply to another comment.';
				notifications.info('Sign up or log in to comment on other comments.', 3000);
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
	<!-- The type-colored left stripe is the "9 takes" payoff: each comment is
	     visually attributed to its Enneagram type via --type-N-color (data-only
	     palette). Anonymous comments fall back to the neutral stone edge. -->
	<div
		class="comment-card group relative rounded-xl border border-[var(--stone-edge)] bg-[var(--stone-warm)] transition-all duration-200 hover:border-[var(--lamp-soft)] hover:shadow-[var(--glow-sm)]"
		style="--comment-type-color: var(--type-{_commentComment?.profiles?.enneagram ??
			0}-color, var(--stone-edge))"
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
									class="comment-type-badge inline-flex h-7 items-center justify-center rounded-md px-2.5 text-xs font-semibold transition-colors duration-200"
									href={`/users/${_commentComment.profiles.external_id}`}
								>
									Type {_commentComment?.profiles?.enneagram}
								</a>
							{:else}
								<span
									class="inline-flex h-7 items-center justify-center rounded-md border border-[var(--stone-edge)] bg-[var(--stone-mid)] px-2.5 text-xs font-medium text-[var(--ink-mid)]"
								>
									Anonymous
								</span>
							{/if}

							<!-- Timestamp -->
							<span class="flex items-center gap-1.5 text-xs text-[var(--ink-dim)]">
								<time itemprop="dateCreated" datetime={createdOrModifiedAt}>
									{createdOrModifiedAt}
								</time>
								{#if _commentComment.modified_at}
									<span class="italic text-[var(--ink-dim)]" title="Edited">· edited</span>
								{/if}
							</span>
						</div>
					</div>

					<!-- Comment Text -->
					<div class="relative mb-3 w-full">
						<div
							class="block {isExpanded
								? ''
								: 'max-h-[4.5em] overflow-hidden'} relative whitespace-pre-line break-words text-sm leading-relaxed text-[var(--ink-bright)] transition-all duration-200"
							itemprop="text"
						>
							{_commentComment.comment}
						</div>

						{#if shouldTruncate && !isExpanded}
							<button
								type="button"
								class="mt-1 text-sm font-medium text-[var(--lamp-glow)] transition-colors duration-200 hover:text-[var(--lamp-light)]"
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
							class="flex min-h-11 items-center gap-1.5 rounded-md px-3 py-2 text-sm transition-colors duration-200 {likes.some(
								(e) => e.user_id === user?.id
							)
								? 'bg-[var(--lamp-soft)] text-[var(--lamp-glow)]'
								: 'text-[var(--ink-mid)] hover:bg-[var(--stone-mid)] hover:text-[var(--ink-bright)]'}"
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
							class="flex min-h-11 items-center gap-1.5 rounded-md px-3 py-2 text-sm text-[var(--ink-mid)] transition-colors duration-200 hover:bg-[var(--stone-mid)] hover:text-[var(--ink-bright)]"
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
										class="flex h-11 w-11 items-center justify-center rounded-md transition-colors duration-200 hover:bg-[var(--stone-mid)]"
									>
										<SettingsIcon className="w-4 h-4 text-[var(--ink-dim)]" />
									</div>
								</svelte:fragment>

								<svelte:fragment slot="popoverValue">
									<div class="flex flex-col gap-1">
										{#if user?.id === _commentComment.author_id}
											<button
												type="button"
												class="w-full rounded-md px-3 py-2 text-left text-sm text-[var(--ink-mid)] transition-colors duration-200 hover:bg-[var(--lamp-soft)] hover:text-[var(--ink-bright)]"
												on:click={() => getModal(`edit-modal-${_commentComment.id}`).open()}
											>
												Edit Comment
											</button>
										{/if}

										<button
											type="button"
											class="w-full rounded-md px-3 py-2 text-left text-sm text-[var(--error-text)] transition-colors duration-200 hover:bg-error-500/20"
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
				class="border-t border-[var(--stone-edge)] bg-[var(--night-deep)] p-3"
				transition:slide={{ duration: 300 }}
			>
				<div class="mb-3">
					<label
						for={`reply-comment-${_commentComment.id}`}
						class="mb-2 block text-sm font-medium text-[var(--ink-mid)]"
					>
						Your reply
					</label>
					<textarea
						id={`reply-comment-${_commentComment.id}`}
						placeholder="Share your perspective — what's your experience with this? The more detail, the better the conversation."
						class="w-full resize-y rounded-md border border-[var(--stone-edge)] bg-[var(--stone-warm)] p-3 text-base text-[var(--ink-bright)] placeholder-[var(--ink-dim)] focus:border-[var(--lamp-glow)] focus:outline-none focus:ring-2 focus:ring-[var(--lamp-soft)]"
						bind:value={newcomment}
						on:input={() => (replyError = '')}
						rows="3"
						aria-invalid={replyError ? 'true' : 'false'}
						aria-describedby={replyError ? `reply-error-${_commentComment.id}` : undefined}
					></textarea>
					{#if replyError}
						<p
							id={`reply-error-${_commentComment.id}`}
							class="mt-2 text-sm font-medium text-[var(--error-text)]"
							role="alert"
						>
							{replyError}
						</p>
					{/if}
				</div>
				<div class="flex justify-end gap-2">
					<button
						class="rounded-md border border-[var(--stone-edge)] bg-transparent px-3 py-1.5 text-sm font-medium text-[var(--ink-mid)] transition-colors duration-200 hover:bg-[var(--stone-mid)] hover:text-[var(--ink-bright)] active:scale-[0.98]"
						type="button"
						on:click={() => {
							commenting = false;
							newcomment = '';
							replyError = '';
						}}
					>
						Cancel
					</button>
					<button
						class="flex items-center justify-center gap-2 rounded-md bg-[var(--lamp-glow)] px-3 py-1.5 text-sm font-semibold text-[var(--night-deep)] transition-colors duration-200 hover:bg-[var(--lamp-light)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
						type="button"
						on:click={createReply}
						disabled={loading || !newcomment?.trim()}
					>
						{#if loading}
							<div
								class="h-4 w-4 animate-spin rounded-full border-2 border-[color-mix(in_srgb,var(--night-deep)_30%,transparent)] border-t-[var(--night-deep)]"
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
			<div class="border-t border-[var(--stone-edge)]">
				<!-- Reply thread toggle -->
				<button
					type="button"
					class="group/toggle flex w-full items-center gap-2 px-3 py-2 text-left transition-colors duration-200 hover:bg-[var(--stone-mid)]"
					on:click={toggleReplies}
					disabled={loadingComments}
					aria-expanded={showReplies}
					aria-label={showReplies ? 'Hide replies' : 'Show replies'}
				>
					<!-- Thread line indicator -->
					<div class="flex h-5 w-5 items-center justify-center">
						{#if loadingComments}
							<div
								class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[var(--lamp-soft)] border-t-[var(--lamp-glow)]"
							></div>
						{:else}
							<svg
								class="h-4 w-4 text-[var(--ink-dim)] transition-all duration-200 group-hover/toggle:text-[var(--lamp-glow)] {showReplies
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
						class="text-sm font-medium text-[var(--ink-mid)] transition-colors duration-200 group-hover/toggle:text-[var(--ink-bright)]"
					>
						{_commentComment.comment_count}
						{_commentComment.comment_count === 1 ? 'reply' : 'replies'}
					</span>
				</button>

				<!-- Nested comments container -->
				{#if showReplies && _commentComment?.comments?.length}
					<div
						class="relative ml-3 border-l-2 border-[var(--lamp-soft)] pb-2 pl-4 pt-2 sm:ml-2 sm:pl-3"
						transition:slide={{ duration: 200 }}
					>
						<!-- Thread connector dot -->
						<div
							class="absolute -left-[5px] top-0 h-2 w-2 rounded-full bg-[var(--lamp-glow)] shadow-[var(--glow-sm)]"
						></div>

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
<Modal id={`edit-modal-${_commentComment?.id}`} name="Edit comment" maxWidth="480px">
	<div class="w-full">
		<h2 class="mb-2 mt-0 text-2xl font-semibold text-[var(--ink-bright)]">Edit Comment</h2>
		<p class="mb-6 text-sm text-[var(--ink-mid)]">Make changes to your comment below.</p>

		<div class="mb-8">
			<label
				for="edit-comment-{_commentComment?.id}"
				class="mb-2 block text-sm font-medium text-[var(--ink-mid)]"
			>
				Your comment
			</label>
			<textarea
				id="edit-comment-{_commentComment?.id}"
				rows="6"
				bind:value={commentEdit}
				class="w-full resize-y rounded-md border border-[var(--stone-edge)] bg-[var(--stone-warm)] p-4 text-base leading-relaxed text-[var(--ink-bright)] placeholder-[var(--ink-dim)] transition-colors duration-200 focus:border-[var(--lamp-glow)] focus:outline-none focus:ring-2 focus:ring-[var(--lamp-soft)]"
				placeholder="Edit your comment..."></textarea>
		</div>

		<div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
			<button
				class="w-full cursor-pointer rounded-md border border-[var(--stone-edge)] bg-transparent px-6 py-3 text-base font-medium text-[var(--ink-mid)] transition-colors duration-200 hover:bg-[var(--stone-mid)] hover:text-[var(--ink-bright)] sm:w-auto"
				type="button"
				on:click={() => getModal(`edit-modal-${_commentComment?.id}`).close()}
			>
				Cancel
			</button>
			<button
				class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border-none bg-[var(--lamp-glow)] px-6 py-3 text-base font-semibold text-[var(--night-deep)] transition-colors duration-200 hover:bg-[var(--lamp-light)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
				type="button"
				on:click={saveEdit}
				disabled={loading || !commentEdit.trim()}
			>
				{#if loading}
					<div
						class="h-5 w-5 animate-spin rounded-full border-2 border-[color-mix(in_srgb,var(--night-deep)_30%,transparent)] border-t-[var(--night-deep)]"
					></div>
				{:else}
					Save Changes
				{/if}
			</button>
		</div>
	</div>
</Modal>

<!-- Flag Comment Modal -->
<Modal
	id={`flag-comment-modal-${_commentComment?.id}`}
	labelledBy={`flag-modal-title-${_commentComment?.id}`}
	maxWidth="480px"
>
	<div class="w-full">
		<div class="mb-6">
			<h2
				id={`flag-modal-title-${_commentComment?.id}`}
				class="mb-2 mt-0 text-2xl font-semibold text-[var(--ink-bright)]"
			>
				Flag Comment
			</h2>
			<p class="text-sm text-[var(--ink-mid)]">
				Help us keep the community safe by reporting inappropriate content.
			</p>
		</div>

		<form on:submit|preventDefault={submitFlag} novalidate>
			<fieldset disabled={loading} class="m-0 border-0 p-0">
				{#if flagError}
					<div
						class="mb-6 flex items-center gap-3 rounded-xl border border-error-500/30 bg-error-500/10 p-4 text-[var(--error-text)]"
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
							class="mb-3 block text-sm font-medium text-[var(--ink-mid)]"
						>
							Reason for flagging <span class="text-[var(--error-text)]" aria-hidden="true">*</span>
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
							class="w-full cursor-pointer rounded-md border bg-[var(--stone-warm)] p-4 text-base text-[var(--ink-bright)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--lamp-soft)] {flagError &&
							!flaggingReasonId
								? 'border-error-500'
								: 'border-[var(--stone-edge)] focus:border-[var(--lamp-glow)]'}"
						>
							<option value="" disabled selected>Select a reason...</option>
							{#each flagReasons as reason}
								<option value={reason.id}>{reason.reason}</option>
							{/each}
						</select>
						{#if flagError && !flaggingReasonId}
							<div
								id={`flag-reason-error-${_commentComment?.id}`}
								class="mt-2 text-sm text-[var(--error-text)]"
								role="alert"
							>
								Please select a reason
							</div>
						{/if}
					</div>
				{:else}
					<div
						class="mb-6 flex items-center gap-3 rounded-xl border border-[var(--lamp-soft)] bg-[var(--lamp-soft)] p-4 text-[var(--lamp-light)]"
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
						class="mb-3 block text-sm font-medium text-[var(--ink-mid)]"
					>
						Additional details <span class="font-normal text-[var(--ink-dim)]">(optional)</span>
					</label>
					<textarea
						id={`flag-description-${_commentComment?.id}`}
						rows="4"
						bind:value={flaggingReasonDescription}
						class="w-full resize-y rounded-md border border-[var(--stone-edge)] bg-[var(--stone-warm)] p-4 text-base leading-relaxed text-[var(--ink-bright)] placeholder-[var(--ink-dim)] transition-colors duration-200 focus:border-[var(--lamp-glow)] focus:outline-none focus:ring-2 focus:ring-[var(--lamp-soft)]"
						placeholder="Provide any additional context that might help us review this comment..."
					></textarea>
				</div>
			</fieldset>

			<div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
				<button
					class="w-full cursor-pointer rounded-md border border-[var(--stone-edge)] bg-transparent px-6 py-3 text-base font-medium text-[var(--ink-mid)] transition-colors duration-200 hover:bg-[var(--stone-mid)] hover:text-[var(--ink-bright)] sm:w-auto"
					type="button"
					on:click={closeFlagModal}
				>
					Cancel
				</button>
				<button
					class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border-none bg-error-700 px-6 py-3 text-base font-medium text-white transition-colors duration-200 hover:bg-error-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
					type="submit"
					disabled={loading || !flaggingReasonId || !flagReasons.length}
					aria-busy={loading}
				>
					{#if loading}
						<div
							class="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
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
</Modal>

<style>
	/* Type-colored stripe: makes the Enneagram type visible per take.
	   --comment-type-color is set inline from --type-N-color (data palette);
	   anonymous comments fall back to the neutral stone edge. */
	.comment-card {
		border-left: 3px solid var(--comment-type-color, var(--stone-edge));
	}

	/* Type badge: tinted chip in the comment's type color. Text is mixed
	   toward white (dark mode) / black (light mode) so every type color
	   stays legible on the card surface. */
	.comment-type-badge {
		background: color-mix(in srgb, var(--comment-type-color) 16%, transparent);
		border: 1px solid color-mix(in srgb, var(--comment-type-color) 38%, transparent);
		color: color-mix(in srgb, var(--comment-type-color) 65%, white);
	}

	.comment-type-badge:hover {
		background: color-mix(in srgb, var(--comment-type-color) 28%, transparent);
		border-color: color-mix(in srgb, var(--comment-type-color) 55%, transparent);
	}

	:global(:root.light) .comment-type-badge {
		color: color-mix(in srgb, var(--comment-type-color) 72%, black);
	}
</style>
