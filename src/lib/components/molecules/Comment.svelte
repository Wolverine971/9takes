<!-- lib/components/molecules/Comment.svelte -->
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
	<Card
		className="bg-white rounded-lg shadow-md border border-neutral-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 md:mb-3"
	>
		<div
			class="flex flex-col"
			itemprop="suggestedAnswer acceptedAnswer"
			itemscope
			itemtype="https://schema.org/Answer"
		>
			<div class="flex w-full flex-col">
				<!-- Comment Header and Content -->
				<div class="p-4 pb-2" id="comment-box{_commentComment.id}">
					<!-- User Badge and Timestamp -->
					<div class="mb-3 flex items-start justify-between">
						<div class="flex items-center gap-3">
							{#if _commentComment?.profiles?.enneagram && _commentComment?.profiles?.external_id}
								<a
									title="View profile"
									class="inline-flex h-9 min-w-[90px] items-center justify-center rounded-sm bg-gradient-to-br from-primary-700 to-primary-800 text-center text-sm font-semibold text-white no-underline transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm sm:h-8 sm:min-w-[70px] sm:text-xs"
									href={`/users/${_commentComment.profiles.external_id}`}
								>
									{_commentComment?.profiles?.enneagram || 'Rando'}
								</a>
							{:else}
								<span
									class="inline-flex h-9 min-w-[90px] items-center justify-center sm:h-8 sm:min-w-[70px] {_commentComment
										?.profiles?.external_id
										? ''
										: 'opacity-70'} rounded-sm bg-neutral-200 text-center text-sm font-semibold text-neutral-600 sm:text-xs"
								>
									Rando
								</span>
							{/if}

							<!-- Timestamp -->
							<span class="flex items-center gap-1 text-xs text-neutral-600">
								{#if _commentComment.modified_at}
									<span
										class="inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-800"
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
								: 'max-h-[4.5em] overflow-hidden'} relative whitespace-pre-line leading-6 text-neutral-900 transition-all duration-300"
							itemprop="text"
						>
							{_commentComment.comment}
						</div>

						{#if shouldTruncate && !isExpanded}
							<button
								type="button"
								class="z-10 mt-1 cursor-pointer rounded border border-neutral-300 px-2 py-1 text-xs text-primary-700 transition-all duration-200 hover:text-primary-800 hover:underline"
								on:click={toggleExpandText}
							>
								Read More
							</button>
						{/if}
					</div>

					<!-- Interaction Buttons -->
					<div class="-ml-2 -mr-2 flex items-center gap-1">
						<button
							title={likes.some((e) => e.user_id === user?.id) ? 'Unlike' : 'Like'}
							class="flex items-center gap-2 border-none bg-transparent px-3 py-2 {likes.some(
								(e) => e.user_id === user?.id
							)
								? 'bg-primary-50 text-primary-600'
								: 'text-neutral-600'} cursor-pointer rounded text-sm transition-all duration-200 hover:bg-neutral-100 hover:text-neutral-900"
							on:click={toggleLike}
						>
							<ThumbsUpIcon className="w-4 h-4" />
							{#if likes.length}
								<span itemprop="upvoteCount" class="font-medium">
									{likes.length}
								</span>
							{:else}
								<span>Like</span>
							{/if}
						</button>

						<button
							title="Reply"
							class="flex cursor-pointer items-center gap-2 rounded border-none bg-transparent px-3 py-2 text-sm text-neutral-600 transition-all duration-200 hover:bg-neutral-100 hover:text-neutral-900"
							on:click={() => (commenting = !commenting)}
						>
							<MasterCommentIcon
								className="w-4 h-4"
								type={_commentComment.comments?.length ? 'full' : 'empty'}
							/>
							<span>Reply</span>
						</button>

						<div class="ml-auto">
							<Popover>
								<div
									slot="icon"
									class="flex h-8 w-8 cursor-pointer items-center justify-center rounded transition-colors duration-200 hover:bg-neutral-100"
								>
									<SettingsIcon className="w-4 h-4 text-neutral-600" />
								</div>

								<div
									slot="popoverValue"
									class="left-auto right-0 z-[100] min-w-[180px] p-2 md:right-0 md:w-[200px]"
								>
									{#if user?.id === _commentComment.author_id}
										<button
											class="w-full cursor-pointer rounded border-none bg-transparent p-2 text-left text-sm text-neutral-900 transition-colors duration-200 hover:bg-neutral-100"
											on:click={() => getModal(`edit-modal-${_commentComment.id}`).open()}
										>
											Edit Comment
										</button>
									{/if}

									<button
										class="w-full cursor-pointer rounded border-none bg-transparent p-2 text-left text-sm text-error-500 transition-colors duration-200 hover:bg-neutral-100"
										on:click={openFlagModal}
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

		<!-- Reply form -->
		{#if commenting}
			<div
				class="border-t border-neutral-200 bg-neutral-50 p-4"
				transition:slide={{ duration: 200 }}
			>
				<div class="mb-3">
					<textarea
						placeholder="Write your reply..."
						class="font-inherit w-full resize-y rounded border border-neutral-400 p-3 text-sm focus:border-primary-500 focus:shadow-[0_0_0_2px_rgba(140,122,230,0.1)] focus:outline-none"
						bind:value={newcomment}
						rows="3"
					></textarea>
				</div>
				<div class="flex justify-end gap-3 sm:flex-col">
					<button
						class="cursor-pointer rounded border border-neutral-400 bg-transparent px-4 py-2 font-medium text-neutral-600 transition-all duration-200 hover:bg-neutral-100 hover:text-neutral-900"
						type="button"
						on:click={() => {
							commenting = false;
							newcomment = '';
						}}
					>
						Cancel
					</button>
					<button
						class="flex cursor-pointer items-center justify-center gap-2 rounded border-none bg-primary-500 px-4 py-2 font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-70"
						type="button"
						on:click={createReply}
						disabled={loading || !newcomment?.trim()}
					>
						{#if loading}
							<div
								class="h-5 w-5 animate-spin rounded-full border-2 border-primary-200 border-t-white"
							></div>
						{:else}
							Submit
							<RightIcon className="w-4 h-4" />
						{/if}
					</button>
				</div>
			</div>
		{/if}

		<!-- Nested comments -->
		{#if _commentComment?.comments?.length}
			<div class="ml-6 border-l-2 border-neutral-200 pb-2 pl-4 sm:ml-3 sm:pl-2">
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
				class="flex w-full cursor-pointer items-center justify-center gap-2 border-t border-none border-neutral-400 bg-neutral-100 p-3 text-sm text-neutral-900 transition-colors duration-200 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-70"
				on:click={loadNestedComments}
				disabled={loadingComments}
			>
				{#if loadingComments}
					<div
						class="h-5 w-5 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600"
					/>
				{:else}
					<span
						>Show {_commentComment.comment_count}
						{_commentComment.comment_count === 1 ? 'reply' : 'replies'}</span
					>
					<div class="flex items-center gap-1">
						<MasterCommentIcon className="w-5 h-5" type="multiple" />
						<DownIcon className="w-5 h-5" />
					</div>
				{/if}
			</button>
		{/if}
	</Card>
{/if}

<!-- Edit Comment Modal -->
<Modal2 id={`edit-modal-${_commentComment?.id}`}>
	<div class="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
		<h2 class="mb-5 mt-0 text-xl text-neutral-900">Edit Comment</h2>
		<div class="mb-6">
			<textarea
				rows="5"
				bind:value={commentEdit}
				class="font-inherit min-h-[100px] w-full resize-y rounded border border-neutral-400 p-3 text-sm focus:border-primary-500 focus:shadow-[0_0_0_2px_rgba(140,122,230,0.1)] focus:outline-none"
				placeholder="Edit your comment..."
			></textarea>
		</div>
		<div class="flex justify-end gap-3 sm:flex-col">
			<button
				class="cursor-pointer rounded border border-neutral-400 bg-transparent px-5 py-3 font-medium text-neutral-600 transition-all duration-200 hover:bg-neutral-100 hover:text-neutral-900"
				type="button"
				on:click={() => getModal(`edit-modal-${_commentComment?.id}`).close()}
			>
				Cancel
			</button>
			<button
				class="flex cursor-pointer items-center justify-center gap-2 rounded border-none bg-primary-500 px-5 py-3 font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-70"
				type="button"
				on:click={saveEdit}
				disabled={loading || !commentEdit.trim()}
			>
				{#if loading}
					<div
						class="h-5 w-5 animate-spin rounded-full border-2 border-primary-200 border-t-white"
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
	<div class="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
		<h2 class="mb-5 mt-0 text-xl text-neutral-900">Flag Comment</h2>
		<div class="mb-6">
			{#if flagError}
				<div class="mb-4 rounded border-l-4 border-error-500 bg-error-50 p-2 text-error-700">
					{flagError}
				</div>
			{/if}

			{#if parentData?.flagReasons?.length > 0}
				<div class="mb-4">
					<label for="flag-reason" class="mb-2 block font-medium text-neutral-900">
						Reason <span class="text-error-500">*</span>
					</label>
					<select
						id="flag-reason"
						bind:value={flaggingReasonId}
						class="font-inherit w-full rounded border border-neutral-400 p-3 text-sm {flagError &&
						!flaggingReasonId
							? 'border-error-500'
							: ''} focus:border-primary-500 focus:shadow-[0_0_0_2px_rgba(140,122,230,0.1)] focus:outline-none"
					>
						<option value="" disabled selected>Select a reason</option>
						{#each parentData.flagReasons as reason}
							<option value={reason.id}>{reason.reason}</option>
						{/each}
					</select>
					{#if flagError && !flaggingReasonId}
						<div class="mt-1 text-xs text-error-500">Please select a reason</div>
					{/if}
				</div>
			{:else}
				<div class="mb-4 rounded border-l-4 border-info-500 bg-info-50 p-2 text-info-700">
					No flag reasons available. Please contact an administrator.
				</div>
			{/if}

			<div class="mb-4">
				<label for="flag-description" class="mb-2 block font-medium text-neutral-900"
					>Description</label
				>
				<textarea
					id="flag-description"
					rows="4"
					bind:value={flaggingReasonDescription}
					class="font-inherit min-h-[100px] w-full resize-y rounded border border-neutral-400 p-3 text-sm focus:border-primary-500 focus:shadow-[0_0_0_2px_rgba(140,122,230,0.1)] focus:outline-none"
					placeholder="Please provide details about why you're flagging this comment..."
				></textarea>
			</div>
		</div>
		<div class="flex justify-end gap-3 sm:flex-col">
			<button
				class="cursor-pointer rounded border border-neutral-400 bg-transparent px-5 py-3 font-medium text-neutral-600 transition-all duration-200 hover:bg-neutral-100 hover:text-neutral-900"
				type="button"
				on:click={closeFlagModal}
			>
				Cancel
			</button>
			<button
				class="flex cursor-pointer items-center justify-center gap-2 rounded border-none bg-primary-500 px-5 py-3 font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-70"
				type="button"
				on:click={submitFlag}
				disabled={loading || !flaggingReasonId || !parentData?.flagReasons?.length}
			>
				{#if loading}
					<div
						class="h-5 w-5 animate-spin rounded-full border-2 border-primary-200 border-t-white"
					></div>
				{:else}
					Submit
				{/if}
			</button>
		</div>
	</div>
</Modal2>
