<!-- src/lib/components/molecules/Comment.svelte -->
<script lang="ts">
	import { browser } from '$app/environment';
	import { createEventDispatcher, onMount } from 'svelte';
	import { deserialize } from '$app/forms';
	import { fade, slide } from 'svelte/transition';
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
	export let parentData: QuestionPageData;
	export let questionId: number;

	// State variables
	let likes: CommentLike[] = [];
	let loadingComments = false;
	let loading = false;

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

	// Constants
	const COMMENT_TRUNCATE_LENGTH = 136;

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

	// Check if comment needs to be truncated (either exceeds length limit or contains newlines)
	$: shouldTruncate =
		(_commentComment?.comment?.length ?? 0) > COMMENT_TRUNCATE_LENGTH ||
		_commentComment?.comment?.includes('\n');

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
		if (!newcomment.trim()) {
			notifications.info('Comment cannot be empty', 3000);
			return;
		}

		loading = true;

		try {
			// Dynamically import FingerprintJS to avoid bundling in main chunk
			const FingerprintJS = (await import('@fingerprintjs/fingerprintjs')).default;
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
</script>

{#if _commentComment}
	<div
		class="group relative rounded-lg border border-slate-700/30 bg-[#1a1a2e] transition-all duration-200 hover:border-purple-500/30 hover:shadow-[0_0_15px_rgba(124,58,237,0.15)]"
	>
		<div
			class="flex flex-col"
			itemprop="suggestedAnswer acceptedAnswer"
			itemscope
			itemtype="https://schema.org/Answer"
		>
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
									class="inline-flex h-8 items-center justify-center rounded-md bg-[#252538] px-3 text-xs font-medium text-slate-400"
								>
									Anonymous
								</span>
							{/if}

							<!-- Timestamp -->
							<span class="flex items-center gap-1.5 text-xs text-slate-500">
								{#if _commentComment.modified_at}
									<span
										class="inline-flex h-3.5 w-3.5 items-center justify-center rounded bg-purple-500/20 text-[9px] font-bold text-purple-400"
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
								: 'max-h-[4.5em] overflow-hidden'} relative whitespace-pre-line text-sm leading-relaxed text-slate-200 transition-all duration-200"
							itemprop="text"
						>
							{_commentComment.comment}
						</div>

						{#if shouldTruncate && !isExpanded}
							<button
								type="button"
								class="mt-1 text-sm font-medium text-purple-400 transition-all duration-200 hover:text-purple-300"
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
								? 'bg-purple-500/20 text-purple-400'
								: 'text-slate-400 hover:bg-[#252538]'}"
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
							class="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-slate-400 transition-all duration-200 hover:bg-[#252538]"
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
										class="flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200 hover:bg-[#252538]"
									>
										<SettingsIcon className="w-4 h-4 text-slate-500" />
									</div>
								</svelte:fragment>

								<svelte:fragment slot="popoverValue">
									<div class="flex flex-col gap-1">
										{#if user?.id === _commentComment.author_id}
											<button
												type="button"
												class="w-full rounded-md px-3 py-2 text-left text-sm text-slate-300 transition-colors duration-200 hover:bg-purple-500/20 hover:text-slate-100"
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
				class="border-t border-slate-700/30 bg-[#12121a] p-4 sm:p-3"
				transition:slide={{ duration: 300 }}
			>
				<div class="mb-3">
					<textarea
						placeholder="Write your reply..."
						class="w-full resize-y rounded-xl border border-slate-700/30 bg-[#252538] p-3 text-sm text-slate-200 placeholder-slate-500 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
						bind:value={newcomment}
						rows="3"
					></textarea>
				</div>
				<div class="flex justify-end gap-2 sm:flex-row">
					<button
						class="rounded-xl border border-slate-700/30 bg-transparent px-4 py-2 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-[#252538] hover:text-slate-200 active:scale-[0.98] sm:px-3 sm:py-1.5"
						type="button"
						on:click={() => {
							commenting = false;
							newcomment = '';
						}}
					>
						Cancel
					</button>
					<button
						class="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:shadow-[0_0_15px_rgba(124,58,237,0.4)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 sm:px-3 sm:py-1.5"
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

		<!-- Nested comments -->
		{#if _commentComment?.comments?.length}
			<div class="ml-8 border-l-2 border-purple-500/30 pb-2 pl-6 sm:ml-4 sm:pl-3">
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
				class="flex w-full items-center justify-center gap-2 border-t border-slate-700/30 bg-[#12121a] px-4 py-3 text-sm font-medium text-slate-400 transition-colors duration-200 hover:bg-[#252538] hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
				on:click={loadNestedComments}
				disabled={loadingComments}
			>
				{#if loadingComments}
					<div
						class="h-4 w-4 animate-spin rounded-full border-2 border-purple-500/30 border-t-purple-500"
					></div>
				{:else}
					<span
						>View {_commentComment.comment_count}
						{_commentComment.comment_count === 1 ? 'reply' : 'replies'}</span
					>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 9l-7 7-7-7"
						/>
					</svg>
				{/if}
			</button>
		{/if}
	</div>
{/if}

<!-- Edit Comment Modal -->
<Modal2 id={`edit-modal-${_commentComment?.id}`}>
	<div
		class="w-full max-w-lg rounded-lg border border-slate-700/30 bg-[#12121a] p-6 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
	>
		<h2 class="mb-5 mt-0 text-xl text-slate-100">Edit Comment</h2>
		<div class="mb-6">
			<textarea
				rows="5"
				bind:value={commentEdit}
				class="font-inherit min-h-[100px] w-full resize-y rounded-lg border border-slate-700/30 bg-[#252538] p-3 text-sm text-slate-200 placeholder-slate-500 focus:border-purple-500/50 focus:shadow-[0_0_10px_rgba(124,58,237,0.3)] focus:outline-none"
				placeholder="Edit your comment..."
			></textarea>
		</div>
		<div class="flex justify-end gap-3 sm:flex-col">
			<button
				class="cursor-pointer rounded-lg border border-slate-700/30 bg-transparent px-5 py-3 font-medium text-slate-400 transition-all duration-200 hover:bg-[#252538] hover:text-slate-200"
				type="button"
				on:click={() => getModal(`edit-modal-${_commentComment?.id}`).close()}
			>
				Cancel
			</button>
			<button
				class="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-none bg-gradient-to-r from-purple-600 to-purple-700 px-5 py-3 font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] disabled:cursor-not-allowed disabled:opacity-70"
				type="button"
				on:click={saveEdit}
				disabled={loading || !commentEdit.trim()}
			>
				{#if loading}
					<div
						class="h-5 w-5 animate-spin rounded-full border-2 border-purple-300/30 border-t-white"
					></div>
				{:else}
					Save Changes
				{/if}
			</button>
		</div>
	</div>
</Modal2>

<!-- Flag Comment Modal -->
<Modal2 id={`flag-comment-modal-${_commentComment?.id}`}>
	<div
		class="w-full max-w-lg rounded-lg border border-slate-700/30 bg-[#12121a] p-6 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
		role="dialog"
		aria-labelledby={`flag-modal-title-${_commentComment?.id}`}
	>
		<h2 id={`flag-modal-title-${_commentComment?.id}`} class="mb-5 mt-0 text-xl text-slate-100">
			Flag Comment
		</h2>
		<form on:submit|preventDefault={submitFlag} novalidate>
			<fieldset disabled={loading} class="m-0 border-0 p-0">
				{#if flagError}
					<div
						class="mb-4 rounded-lg border-l-4 border-red-500 bg-red-500/10 p-2 text-red-400"
						role="alert"
					>
						{flagError}
					</div>
				{/if}

				{#if parentData?.flagReasons?.length > 0}
					<div class="mb-4">
						<label
							for={`flag-reason-${_commentComment?.id}`}
							class="mb-2 block font-medium text-slate-200"
						>
							Reason <span class="text-red-400" aria-hidden="true">*</span>
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
							class="font-inherit w-full rounded-lg border border-slate-700/30 bg-[#252538] p-3 text-sm text-slate-200 {flagError &&
							!flaggingReasonId
								? 'border-red-500'
								: ''} focus:border-purple-500/50 focus:shadow-[0_0_10px_rgba(124,58,237,0.3)] focus:outline-none"
						>
							<option value="" disabled selected>Select a reason</option>
							{#each parentData.flagReasons as reason}
								<option value={reason.id}>{reason.reason}</option>
							{/each}
						</select>
						{#if flagError && !flaggingReasonId}
							<div
								id={`flag-reason-error-${_commentComment?.id}`}
								class="mt-1 text-xs text-red-400"
								role="alert"
							>
								Please select a reason
							</div>
						{/if}
					</div>
				{:else}
					<div
						class="mb-4 rounded-lg border-l-4 border-blue-500 bg-blue-500/10 p-2 text-blue-400"
						role="status"
					>
						No flag reasons available. Please contact an administrator.
					</div>
				{/if}

				<div class="mb-4">
					<label
						for={`flag-description-${_commentComment?.id}`}
						class="mb-2 block font-medium text-slate-200"
					>
						Description <span class="text-sm font-normal text-slate-500">(optional)</span>
					</label>
					<textarea
						id={`flag-description-${_commentComment?.id}`}
						rows="4"
						bind:value={flaggingReasonDescription}
						class="font-inherit min-h-[100px] w-full resize-y rounded-lg border border-slate-700/30 bg-[#252538] p-3 text-sm text-slate-200 placeholder-slate-500 focus:border-purple-500/50 focus:shadow-[0_0_10px_rgba(124,58,237,0.3)] focus:outline-none"
						placeholder="Please provide details about why you're flagging this comment..."
					></textarea>
				</div>
			</fieldset>
			<div class="mt-6 flex justify-end gap-3 sm:flex-col">
				<button
					class="cursor-pointer rounded-lg border border-slate-700/30 bg-transparent px-5 py-3 font-medium text-slate-400 transition-all duration-200 hover:bg-[#252538] hover:text-slate-200"
					type="button"
					on:click={closeFlagModal}
				>
					Cancel
				</button>
				<button
					class="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-none bg-gradient-to-r from-purple-600 to-purple-700 px-5 py-3 font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] disabled:cursor-not-allowed disabled:opacity-70"
					type="submit"
					disabled={loading || !flaggingReasonId || !parentData?.flagReasons?.length}
					aria-busy={loading}
				>
					{#if loading}
						<div
							class="h-5 w-5 animate-spin rounded-full border-2 border-purple-300/30 border-t-white"
							aria-hidden="true"
						></div>
						<span class="sr-only">Submitting...</span>
					{:else}
						Submit
					{/if}
				</button>
			</div>
		</form>
	</div>
</Modal2>
