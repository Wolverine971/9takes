<!-- src/lib/components/molecules/Comment.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { deserialize } from '$app/forms';
	import { resolve } from '$app/paths';
	import { ChevronRight, EllipsisVertical, MessageCircle, ThumbsUp } from '@lucide/svelte';
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import {
		captureCommentCreated,
		captureCommentFailed,
		captureCommentStarted,
		normalizeServerCommentAnalytics,
		type CommentFailureCategory,
		type CommentFailureStage
	} from '$lib/analytics/commentEvents';
	import { getOrCreateVisitorId } from '$lib/analytics/visitorIdentity';
	import { extractPageViewAttribution } from '$lib/analytics/attribution';
	import { notifications } from '$lib/components/molecules/notifications';
	import Comments from '$lib/components/molecules/Comments.svelte';
	import Modal, { getModal } from '$lib/components/atoms/Modal.svelte';
	import Popover from '$lib/components/atoms/Popover.svelte';
	import {
		getCommentViewObserver,
		type CommentViewObserver
	} from '$lib/components/questions/commentViewContext';
	import type {
		User,
		Comment as CommentType,
		CommentLike,
		QuestionPageData
	} from '$lib/types/questions';

	interface Props {
		user: User | null;
		comment: CommentType;
		parentData: QuestionPageData | CommentType;
		questionId: number;
		// Deep links (?reply=<id>) need the thread open on first paint: show
		// pre-loaded replies immediately, otherwise run the same load the toggle does.
		autoExpandReplies?: boolean;
		/** The viewer wrote this take (anonymous own takes can't be matched by user id). */
		own?: boolean;
		/** Defaults to the question page's view observer (set by QuestionContent). */
		observeTake?: CommentViewObserver;
		/** A reply to this take was posted (payload: the created reply). */
		oncommentAdded?: (reply: CommentType) => void;
		/** This take changed locally (like, edit, replies); payload is the updated take. */
		oncommentUpdated?: (comment: CommentType) => void;
	}

	// Read during initialisation: context is unavailable once the prop default is
	// first read from the attachment below.
	const contextObserveTake = getCommentViewObserver();

	let {
		user,
		comment,
		parentData,
		questionId,
		autoExpandReplies = false,
		own = false,
		observeTake = contextObserveTake,
		oncommentAdded,
		oncommentUpdated
	}: Props = $props();

	// State variables
	let loadingComments = $state(false);
	let loading = $state(false);

	// Cached visitor id for replies
	let cachedFingerprint: string | null = null;

	let newcomment = $state('');
	let replyStartedTracked = false;
	let replyError = $state('');
	let commenting = $state(false);
	let anonymousComment = false;
	let flaggingReasonDescription = $state('');
	let flaggingReasonId = $state('');
	let isExpanded = $state(false);
	let flagError = $state('');
	let showReplies = $state(false);
	let reduceMotion = $state(false);

	// Constants
	const COMMENT_TRUNCATE_LENGTH = 136;

	// The card's own editable copy of the take: likes, edits and replies apply
	// here first and are reported up through oncommentUpdated. A new `comment`
	// from the parent replaces the copy.
	let _commentComment = $derived.by(() => {
		const copy = $state($state.snapshot(comment) as CommentType);
		return copy;
	});

	function snapshotTake(): CommentType {
		return $state.snapshot(_commentComment) as CommentType;
	}

	// Reactive variables
	let questionPageData = $derived(
		parentData && 'flags' in parentData ? (parentData as QuestionPageData) : null
	);
	let flagReasons = $derived(questionPageData?.flagReasons ?? []);
	// A reply's parent is a take, not the question page.
	let isNested = $derived(!questionPageData);
	let isOwn = $derived(own || (!!user?.id && user.id === _commentComment.author_id));
	let takeType = $derived.by(() => {
		const profile = _commentComment.profiles ?? _commentComment.profiles_demo;
		const type = Number(profile?.enneagram);
		return Number.isInteger(type) && type >= 1 && type <= 9 ? type : null;
	});

	let lastDate = $derived(
		_commentComment.comments?.length
			? _commentComment.comments[_commentComment.comments.length - 1]?.created_at || null
			: null
	);

	function formatCommentDate(timestamp: string) {
		return new Date(timestamp).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	let createdAtLabel = $derived(formatCommentDate(_commentComment.created_at));
	let modifiedAtLabel = $derived(
		_commentComment.modified_at ? formatCommentDate(_commentComment.modified_at) : null
	);

	let likes: CommentLike[] = $derived(_commentComment.comment_like || []);
	let isLiked = $derived(likes.some((like) => like.user_id === user?.id));
	// Edit-modal draft: follows the saved text until the reader types.
	let commentEdit = $derived(_commentComment.comment);

	// Check if comment needs to be truncated (either exceeds length limit or contains newlines)
	let shouldTruncate = $derived(
		(_commentComment.comment?.length ?? 0) > COMMENT_TRUNCATE_LENGTH ||
			_commentComment.comment?.includes('\n')
	);

	// The character count is only a first-paint guess: on a phone a much
	// shorter take still wraps past the three-line clamp. Once mounted, the
	// measured overflow decides, so clipped text always gets "Read more".
	let measuredOverflow: boolean | null = $state(null);
	function observeClamp(node: HTMLElement) {
		if (typeof ResizeObserver === 'undefined') return;
		const measureClamp = () => {
			measuredOverflow = node.scrollHeight - node.clientHeight > 2;
		};
		const observer = new ResizeObserver(measureClamp);
		observer.observe(node);
		// An edit changes the text without resizing the clamped box: re-measure.
		$effect(() => {
			void _commentComment.comment;
			measureClamp();
		});
		return () => observer.disconnect();
	}
	let showReadMore = $derived(!isExpanded && (measuredOverflow ?? shouldTruncate));

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

			// Keep the parent's copy in sync
			oncommentUpdated?.(snapshotTake());

			// Show replies after loading
			showReplies = true;
		} catch (error) {
			console.error('Error loading comments:', error);
			notifications.danger('Error loading comments', 3000);
		} finally {
			loadingComments = false;
		}
	}

	onMount(() => {
		reduceMotion =
			typeof window.matchMedia === 'function' &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (!autoExpandReplies || !(_commentComment.comment_count > 0)) return;
		if (_commentComment.comments?.length) {
			showReplies = true;
		} else {
			void loadNestedComments();
		}
	});

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

		const operation = likes.some((e) => e.user_id === user.id) ? 'remove' : 'add';

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

			const nextLikes: CommentLike[] =
				operation === 'add' && result?.data
					? [result.data, ...likes]
					: likes.filter((c) => c.user_id !== user.id);

			_commentComment.comment_like = nextLikes;
			_commentComment.like_count = nextLikes.length;
			oncommentUpdated?.(snapshotTake());
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

		let failureStage: CommentFailureStage = 'request';
		let errorCategory: CommentFailureCategory = 'network_error';

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
				errorCategory = 'http_error';
				throw new Error(`Server responded with status: ${resp.status}`);
			}

			failureStage = 'response';
			errorCategory = 'invalid_response';
			const result: any = deserialize(await resp.text());

			if (result.error || result.type === 'error' || result.type === 'failure') {
				failureStage = 'server_action';
				errorCategory = 'action_failure';
				throw new Error(
					typeof result.error === 'string'
						? result.error
						: (result.data?.message ?? 'Could not add reply')
				);
			}

			notifications.success('Reply Added', 3000);
			const createdReply = Array.isArray(result?.data) ? (result.data[0] ?? null) : result?.data;
			const serverAnalytics = normalizeServerCommentAnalytics(createdReply);
			void captureCommentCreated({
				commentId: createdReply?.id,
				questionId,
				questionUrl: questionPageData?.question.url,
				parentType: 'comment',
				commentKind: 'reply',
				surface: 'question_page',
				sourcePath: window.location.pathname,
				campaign: getCurrentUtmCampaign(),
				isAnonymous: false,
				...serverAnalytics
			});

			// Update comment count
			_commentComment.comment_count = (_commentComment.comment_count || 0) + 1;

			// If comments is undefined, initialize it
			if (!_commentComment.comments) {
				_commentComment.comments = [];
			}

			// Add the new comment to the list
			if (result?.data) {
				_commentComment.comments = [..._commentComment.comments, createdReply].sort(
					(a, b) => a.created_at.localeCompare(b.created_at) || a.id - b.id
				);
			}

			oncommentAdded?.(result?.data);
			oncommentUpdated?.(snapshotTake());
			newcomment = '';
			replyStartedTracked = false;
			commenting = false;
			showReplies = true; // Show replies so user can see their new reply
		} catch (error) {
			console.error('Error adding reply:', error);
			void captureCommentFailed({
				...getReplyEventContext(),
				failureStage,
				errorCategory
			});
			replyError = 'We could not add your reply. Please try again.';
			notifications.danger('Error adding reply', 3000);
		} finally {
			loading = false;
		}
	}

	function getReplyEventContext() {
		return {
			questionId,
			questionUrl: questionPageData?.question.url,
			commentKind: 'reply' as const,
			surface: 'question_page' as const,
			sourcePath: typeof window === 'undefined' ? undefined : window.location.pathname,
			campaign: getCurrentUtmCampaign(),
			isAnonymous: false
		};
	}

	function getCurrentUtmCampaign(): string | undefined {
		if (typeof window === 'undefined') return undefined;
		return extractPageViewAttribution(new URL(window.location.href)).utm_campaign ?? undefined;
	}

	function handleReplyInput(event: Event) {
		replyError = '';
		const value = (event.currentTarget as HTMLTextAreaElement).value;
		if (replyStartedTracked || !value.trim()) return;
		replyStartedTracked = true;
		void captureCommentStarted(getReplyEventContext());
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
				oncommentUpdated?.(snapshotTake());
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
	<article
		class={['comment-card', isOwn && 'comment-card--own', isNested && 'comment-card--nested']}
	>
		<div
			class="comment-card__main"
			id="comment-box{_commentComment.id}"
			{@attach (node) => observeTake?.(node, comment)}
		>
			<!-- The chip repeats the meta line's type for sighted readers; the meta line carries it for screen readers. -->
			<span
				class={['take-chip', isOwn && 'take-chip--you', !isOwn && !takeType && 'take-chip--none']}
				aria-hidden="true">{isOwn ? 'You' : (takeType ?? '–')}</span
			>

			<div class="comment-card__body">
				<!-- Like the /questions index, the answer is the row's primary content. -->
				<div
					class={[
						'comment-copy',
						!isExpanded && 'comment-copy--collapsed',
						showReadMore && 'comment-copy--clamped'
					]}
					itemprop="text"
					{@attach observeClamp}
				>
					{_commentComment.comment}
				</div>

				{#if showReadMore}
					<button type="button" class="comment-read-more" onclick={toggleExpandText}>
						Read more
					</button>
				{/if}

				<footer class="comment-footer">
					<div class="comment-meta">
						{#if _commentComment?.profiles?.enneagram && _commentComment?.profiles?.external_id}
							<a
								title="View profile"
								class="comment-author comment-author--link"
								href={resolve(
									`/users/${_commentComment.profiles.external_id}` as `/users/${string}`
								)}
								itemprop="author"
							>
								Type {_commentComment?.profiles?.enneagram}
							</a>
						{:else}
							<span class="comment-author" itemprop="author">Anonymous</span>
						{/if}
						{#if _commentComment.modified_at}
							<span class="comment-meta__separator" aria-hidden="true">·</span>
							<span class="comment-meta__edited">Edited</span>
						{/if}
					</div>

					<div class="comment-actions" role="group" aria-label="Comment actions">
						<button
							type="button"
							title={isLiked ? 'Unlike' : 'Like'}
							aria-label={isLiked
								? `Unlike this comment (${likes.length} ${likes.length === 1 ? 'like' : 'likes'})`
								: `Like this comment${likes.length > 0 ? ` (${likes.length} ${likes.length === 1 ? 'like' : 'likes'})` : ''}`}
							aria-pressed={isLiked}
							class={['comment-action', isLiked && 'comment-action--on']}
							onclick={toggleLike}
						>
							<ThumbsUp size={16} strokeWidth={1.75} aria-hidden="true" />
							<span>Like</span>
							{#if likes.length}
								<span class="comment-action__count" itemprop="upvoteCount">
									{likes.length}
								</span>
							{/if}
						</button>

						<button
							type="button"
							title="Reply to this comment"
							aria-label={commenting ? 'Hide reply form' : 'Reply to this comment'}
							aria-expanded={commenting}
							class="comment-action"
							onclick={() => (commenting = !commenting)}
						>
							<MessageCircle size={16} strokeWidth={1.75} aria-hidden="true" />
							<span>Reply</span>
						</button>

						<div class="comment-overflow">
							<Popover position="bottom-right" label="Comment options">
								{#snippet icon()}
									<span class="comment-overflow__trigger" title="Comment options">
										<EllipsisVertical size={16} strokeWidth={1.75} aria-hidden="true" />
									</span>
								{/snippet}

								{#snippet popoverValue()}
									<div class="comment-menu">
										<div class="comment-menu__dates" aria-label="Comment dates">
											<p class="comment-menu__date">
												<span>Posted</span>
												<time itemprop="dateCreated" datetime={_commentComment.created_at}>
													{createdAtLabel}
												</time>
											</p>
											{#if _commentComment.modified_at && modifiedAtLabel}
												<p class="comment-menu__date">
													<span>Edited</span>
													<time itemprop="dateModified" datetime={_commentComment.modified_at}>
														{modifiedAtLabel}
													</time>
												</p>
											{/if}
										</div>

										<div class="comment-menu__items">
											{#if user?.id === _commentComment.author_id}
												<button
													type="button"
													class="comment-menu__item"
													onclick={() => getModal(`edit-modal-${_commentComment.id}`).open()}
												>
													Edit Comment
												</button>
											{/if}

											<button
												type="button"
												class="comment-menu__item comment-menu__item--danger"
												onclick={openFlagModal}
											>
												Flag Comment
											</button>
										</div>
									</div>
								{/snippet}
							</Popover>
						</div>
					</div>
				</footer>
			</div>
		</div>

		<!-- Reply form -->
		{#if commenting}
			<div
				class="comment-composer"
				transition:slide={{ duration: reduceMotion ? 0 : 200, easing: cubicOut }}
			>
				<label for={`reply-comment-${_commentComment.id}`} class="comment-field-label">
					Your reply
				</label>
				<textarea
					id={`reply-comment-${_commentComment.id}`}
					placeholder="Share your perspective — what's your experience with this? The more detail, the better the conversation."
					class="comment-field"
					bind:value={newcomment}
					oninput={handleReplyInput}
					rows="3"
					aria-invalid={replyError ? 'true' : 'false'}
					aria-describedby={replyError ? `reply-error-${_commentComment.id}` : undefined}
				></textarea>
				{#if replyError}
					<p id={`reply-error-${_commentComment.id}`} class="comment-error" role="alert">
						{replyError}
					</p>
				{/if}
				<div class="comment-composer__actions">
					<button
						class="comment-button comment-button--quiet"
						type="button"
						onclick={() => {
							commenting = false;
							newcomment = '';
							replyStartedTracked = false;
							replyError = '';
						}}
					>
						Cancel
					</button>
					<button
						class="comment-button comment-button--primary"
						type="button"
						onclick={createReply}
						disabled={loading || !newcomment?.trim()}
					>
						{#if loading}
							<span class="comment-spinner" aria-hidden="true"></span>
						{:else}
							Reply
						{/if}
					</button>
				</div>
			</div>
		{/if}

		<!-- Replies toggle and nested comments -->
		{#if _commentComment.comment_count > 0}
			<div class="comment-thread">
				<button
					type="button"
					class="reply-toggle"
					onclick={toggleReplies}
					disabled={loadingComments}
					aria-expanded={showReplies}
					aria-label={showReplies ? 'Hide replies' : 'Show replies'}
				>
					<span class="reply-toggle__icon" aria-hidden="true">
						{#if loadingComments}
							<span class="comment-spinner comment-spinner--small"></span>
						{:else}
							<ChevronRight
								size={16}
								strokeWidth={1.75}
								class={['reply-chevron', showReplies && 'reply-chevron--open']}
							/>
						{/if}
					</span>
					<span>
						{_commentComment.comment_count}
						{_commentComment.comment_count === 1 ? 'reply' : 'replies'}
					</span>
				</button>

				{#if showReplies && _commentComment?.comments?.length}
					<div
						class="nested-comments"
						transition:slide={{
							duration: reduceMotion ? 0 : 200,
							easing: cubicOut
						}}
					>
						<Comments
							{questionId}
							comments={_commentComment.comments}
							comment_count={_commentComment.comment_count}
							parentData={_commentComment}
							parentType="comment"
							{user}
							onCommentsUpdate={(updatedComments) => {
								_commentComment.comments = updatedComments;
								oncommentUpdated?.(snapshotTake());
							}}
						/>
					</div>
				{/if}
			</div>
		{/if}
	</article>
{/if}

<!-- Edit Comment Modal -->
<Modal id={`edit-modal-${_commentComment?.id}`} name="Edit comment" maxWidth="480px">
	<div class="comment-modal">
		<h2 class="comment-modal__title">Edit Comment</h2>
		<p class="comment-modal__copy">Make changes to your comment below.</p>

		<label for="edit-comment-{_commentComment?.id}" class="comment-field-label">
			Your comment
		</label>
		<textarea
			id="edit-comment-{_commentComment?.id}"
			rows="6"
			bind:value={commentEdit}
			class="comment-field comment-field--roomy"
			placeholder="Edit your comment..."></textarea>

		<div class="comment-modal__actions">
			<button
				class="comment-button comment-button--quiet comment-button--lg"
				type="button"
				onclick={() => getModal(`edit-modal-${_commentComment?.id}`).close()}
			>
				Cancel
			</button>
			<button
				class="comment-button comment-button--primary comment-button--lg"
				type="button"
				onclick={saveEdit}
				disabled={loading || !commentEdit.trim()}
			>
				{#if loading}
					<span class="comment-spinner" aria-hidden="true"></span>
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
	<div class="comment-modal">
		<h2 id={`flag-modal-title-${_commentComment?.id}`} class="comment-modal__title">
			Flag Comment
		</h2>
		<p class="comment-modal__copy">
			Help us keep the community safe by reporting inappropriate content.
		</p>

		<form
			onsubmit={(event) => {
				event.preventDefault();
				submitFlag();
			}}
			novalidate
		>
			<fieldset disabled={loading} class="comment-modal__fieldset">
				{#if flagError}
					<div class="comment-notice comment-notice--error" role="alert">
						<svg class="comment-notice__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
					<div class="comment-modal__group">
						<label for={`flag-reason-${_commentComment?.id}`} class="comment-field-label">
							Reason for flagging <span class="comment-required" aria-hidden="true">*</span>
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
							class={['comment-field', flagError && !flaggingReasonId && 'comment-field--invalid']}
						>
							<option value="" disabled selected>Select a reason...</option>
							{#each flagReasons as reason (reason.id)}
								<option value={reason.id}>{reason.reason}</option>
							{/each}
						</select>
						{#if flagError && !flaggingReasonId}
							<div
								id={`flag-reason-error-${_commentComment?.id}`}
								class="comment-error"
								role="alert"
							>
								Please select a reason
							</div>
						{/if}
					</div>
				{:else}
					<div class="comment-notice" role="status">
						<svg class="comment-notice__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

				<div class="comment-modal__group">
					<label for={`flag-description-${_commentComment?.id}`} class="comment-field-label">
						Additional details <span class="comment-optional">(optional)</span>
					</label>
					<textarea
						id={`flag-description-${_commentComment?.id}`}
						rows="4"
						bind:value={flaggingReasonDescription}
						class="comment-field comment-field--roomy"
						placeholder="Provide any additional context that might help us review this comment..."
					></textarea>
				</div>
			</fieldset>

			<div class="comment-modal__actions">
				<button
					class="comment-button comment-button--quiet comment-button--lg"
					type="button"
					onclick={closeFlagModal}
				>
					Cancel
				</button>
				<button
					class="comment-button comment-button--danger comment-button--lg"
					type="submit"
					disabled={loading || !flaggingReasonId || !flagReasons.length}
					aria-busy={loading}
				>
					{#if loading}
						<span class="comment-spinner" aria-hidden="true"></span>
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
	/* A take is a line in the conversation, not a card: chip, words, quiet meta,
	   a rule underneath. Your own take gets the one tinted frame. */
	.comment-card {
		--chip: 32px;
		--chip-gap: 14px;
		min-width: 0;
		border-bottom: 1px solid var(--rule);
		/* The global `article` rule (index.scss) adds margin, padding and a radius. */
		margin: 0;
		padding: 0;
		border-radius: 0;
	}
	.comment-card--nested {
		--chip: 26px;
		--chip-gap: 12px;
	}
	.comment-card--own {
		border: 1px solid color-mix(in srgb, var(--highlight) 24%, transparent);
		border-radius: var(--border-radius-lg);
		background: color-mix(in srgb, var(--highlight) 7%, transparent);
	}

	.comment-card__main {
		display: grid;
		grid-template-columns: var(--chip) minmax(0, 1fr);
		align-items: start;
		gap: var(--chip-gap);
		padding: 20px 0 12px;
	}
	.comment-card--nested .comment-card__main {
		padding-top: 14px;
	}
	.comment-card--own .comment-card__main {
		padding: 18px 16px 10px;
	}

	.take-chip {
		display: grid;
		place-items: center;
		width: var(--chip);
		height: var(--chip);
		margin-top: 2px;
		border-radius: 50%;
		background: var(--accent-deep);
		color: var(--highlight);
		font-family: var(--font-voice);
		font-style: italic;
		font-size: var(--font-size-base);
		line-height: 1;
	}
	.comment-card--nested .take-chip {
		font-size: var(--font-size-sm);
	}
	.take-chip--none {
		border: 1px dashed color-mix(in srgb, var(--highlight) 35%, transparent);
		background: transparent;
		color: var(--text-faint);
		font-family: var(--font-talk);
		font-style: normal;
		font-size: var(--font-size-sm);
	}
	.take-chip--you {
		background: var(--highlight);
		color: var(--bg);
		font-family: var(--font-talk);
		font-style: normal;
		font-size: var(--font-size-xs);
		font-weight: 700;
	}

	.comment-card__body {
		min-width: 0;
	}

	.comment-copy {
		position: relative;
		color: var(--text);
		font-family: var(--font-talk);
		font-size: calc(var(--font-size-base) + 1px);
		line-height: 1.55;
		white-space: pre-line;
		overflow-wrap: anywhere;
	}
	.comment-card--nested .comment-copy {
		font-size: var(--font-size-base);
	}
	.comment-copy--collapsed {
		max-height: 4.65em;
		overflow: hidden;
	}
	/* Clipped takes fade out on their last visible line instead of ending mid-word. */
	.comment-copy--clamped {
		-webkit-mask-image: linear-gradient(to bottom, black calc(100% - 1.5em), transparent);
		mask-image: linear-gradient(to bottom, black calc(100% - 1.5em), transparent);
	}

	.comment-read-more {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		margin-top: 2px;
		padding: 0;
		border: 0;
		background: none;
		color: var(--highlight);
		font-size: var(--font-size-sm);
		font-weight: 600;
		text-decoration: underline;
		text-underline-offset: 3px;
		cursor: pointer;
	}

	.comment-footer {
		display: flex;
		align-items: center;
		gap: 12px;
		min-width: 0;
		margin-top: 6px;
	}

	.comment-meta {
		display: flex;
		align-items: center;
		gap: 7px;
		min-width: 0;
		color: var(--text-faint);
		font-size: var(--font-size-sm);
	}
	.comment-author {
		overflow: hidden;
		color: var(--text-muted);
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.comment-author--link {
		text-decoration: underline;
		text-decoration-color: color-mix(in srgb, var(--highlight) 40%, transparent);
		text-underline-offset: 3px;
	}
	.comment-author--link:hover {
		color: var(--highlight);
	}
	.comment-meta__separator {
		flex: 0 0 auto;
		opacity: 0.6;
	}
	.comment-meta__edited {
		flex: 0 0 auto;
	}

	.comment-actions {
		display: flex;
		align-items: center;
		gap: 2px;
		margin-left: auto;
	}
	.comment-action {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		min-height: 44px;
		padding: 0 10px;
		border: 0;
		border-radius: var(--border-radius-md);
		background: none;
		color: var(--text-faint);
		font-size: var(--font-size-sm);
		font-weight: 500;
		cursor: pointer;
		transition:
			color 0.2s,
			background-color 0.2s;
	}
	.comment-action:hover {
		background: color-mix(in srgb, var(--highlight) 8%, transparent);
		color: var(--text);
	}
	.comment-action--on {
		color: var(--highlight);
	}
	.comment-action__count {
		font-variant-numeric: tabular-nums;
	}
	.comment-overflow__trigger {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		border-radius: var(--border-radius-md);
		color: var(--text-faint);
		transition:
			color 0.2s,
			background-color 0.2s;
	}
	.comment-overflow__trigger:hover {
		background: color-mix(in srgb, var(--highlight) 8%, transparent);
		color: var(--text);
	}

	.comment-menu {
		display: flex;
		flex-direction: column;
	}
	.comment-menu__dates {
		margin-bottom: 6px;
		padding: 4px 12px 8px;
		border-bottom: 1px solid var(--rule);
	}
	.comment-menu__date {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		margin: 0;
		color: var(--text-faint);
		font-size: var(--font-size-xs);
	}
	.comment-menu__date + .comment-menu__date {
		margin-top: 4px;
	}
	.comment-menu__date time {
		color: var(--text-muted);
		font-family: var(--font-mono, monospace);
	}
	.comment-menu__items {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.comment-menu__item {
		width: 100%;
		padding: 8px 12px;
		border: 0;
		border-radius: var(--border-radius-md);
		background: none;
		color: var(--text-muted);
		font-size: var(--font-size-sm);
		text-align: left;
		cursor: pointer;
	}
	.comment-menu__item:hover {
		background: color-mix(in srgb, var(--highlight) 8%, transparent);
		color: var(--text);
	}
	.comment-menu__item--danger {
		color: var(--error-text);
	}
	.comment-menu__item--danger:hover {
		background: color-mix(in srgb, var(--error-text) 12%, transparent);
		color: var(--error-text);
	}

	/* Reply form and nested replies line up with the take's words, not its chip. */
	.comment-composer,
	.comment-thread {
		margin-left: calc(var(--chip) + var(--chip-gap));
	}
	.comment-card--own .comment-composer,
	.comment-card--own .comment-thread {
		margin-right: 16px;
		margin-left: calc(16px + var(--chip) + var(--chip-gap));
	}
	.comment-composer {
		display: grid;
		gap: 8px;
		padding: 4px 0 16px;
	}
	.comment-composer__actions {
		display: flex;
		justify-content: flex-end;
		gap: 8px;
	}

	.comment-field-label {
		display: block;
		color: var(--highlight);
		font-size: var(--font-size-sm);
		font-weight: 600;
	}
	.comment-field {
		width: 100%;
		padding: 12px;
		border: 1px solid var(--accent);
		border-radius: 10px;
		background: var(--bg);
		color: var(--text);
		font: inherit;
		font-size: var(--font-size-base);
		line-height: 1.5;
		resize: vertical;
	}
	.comment-field::placeholder {
		color: var(--text-faint);
	}
	.comment-field:focus {
		outline: none;
		border-color: var(--highlight);
		box-shadow: 0 0 0 1px var(--highlight);
	}
	.comment-field--roomy {
		padding: 14px;
	}
	.comment-field--invalid {
		border-color: var(--error-text);
	}
	.comment-error {
		margin: 0;
		color: var(--error-text);
		font-size: var(--font-size-sm);
		font-weight: 500;
	}

	.comment-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		min-height: 40px;
		padding: 0 16px;
		border: 1px solid transparent;
		border-radius: 999px;
		font-size: var(--font-size-sm);
		font-weight: 600;
		cursor: pointer;
		transition:
			background-color 0.2s,
			border-color 0.2s,
			color 0.2s;
	}
	.comment-button:disabled {
		cursor: not-allowed;
		opacity: 0.45;
	}
	.comment-button--lg {
		min-height: 48px;
		padding: 0 24px;
		font-size: var(--font-size-base);
	}
	.comment-button--quiet {
		border-color: var(--rule);
		background: transparent;
		color: var(--text-muted);
	}
	.comment-button--quiet:hover:not(:disabled) {
		border-color: color-mix(in srgb, var(--highlight) 35%, transparent);
		color: var(--text);
	}
	.comment-button--primary {
		border-color: var(--highlight);
		background: var(--highlight);
		color: var(--bg);
	}
	.comment-button--primary:hover:not(:disabled) {
		background: color-mix(in srgb, var(--highlight) 85%, var(--text));
	}
	.comment-button--danger {
		border-color: var(--danger-surface);
		background: var(--danger-surface);
		color: var(--text-on-danger);
	}
	.comment-button--danger:hover:not(:disabled) {
		background: var(--danger-surface-hover);
	}

	.comment-spinner {
		width: 16px;
		height: 16px;
		border: 2px solid color-mix(in srgb, currentColor 30%, transparent);
		border-top-color: currentColor;
		border-radius: 50%;
		animation: comment-spin 0.7s linear infinite;
	}
	.comment-spinner--small {
		width: 14px;
		height: 14px;
		color: var(--highlight);
	}
	@keyframes comment-spin {
		to {
			transform: rotate(360deg);
		}
	}

	.comment-thread {
		padding-bottom: 12px;
	}
	.reply-toggle {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		min-height: 44px;
		padding: 0 8px 0 2px;
		border: 0;
		border-radius: var(--border-radius-md);
		background: transparent;
		color: var(--highlight);
		font-size: var(--font-size-sm);
		font-weight: 600;
		cursor: pointer;
	}
	.reply-toggle:hover {
		background: color-mix(in srgb, var(--highlight) 8%, transparent);
	}
	.reply-toggle__icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
	}
	.reply-toggle :global(.reply-chevron) {
		transition: transform 0.2s;
	}
	.reply-toggle :global(.reply-chevron--open) {
		transform: rotate(90deg);
	}
	.nested-comments {
		margin-top: 4px;
		padding-left: 16px;
		border-left: 1px solid color-mix(in srgb, var(--highlight) 22%, transparent);
	}

	.comment-read-more:focus-visible,
	.comment-action:focus-visible,
	.reply-toggle:focus-visible,
	.comment-button:focus-visible,
	.comment-menu__item:focus-visible,
	.comment-author--link:focus-visible,
	:global(.comment-overflow button:focus-visible) {
		outline: 2px solid var(--focus);
		outline-offset: 2px;
	}

	.comment-modal {
		width: 100%;
	}
	.comment-modal__title {
		margin: 0 0 8px;
		color: var(--text);
		font-size: calc(var(--font-size-xl) * 1.2);
		font-weight: 600;
	}
	.comment-modal__copy {
		margin: 0 0 24px;
		color: var(--text-muted);
		font-size: var(--font-size-sm);
	}
	.comment-modal__fieldset {
		margin: 0;
		padding: 0;
		border: 0;
	}
	.comment-modal__group {
		display: grid;
		gap: 10px;
		margin-bottom: 24px;
	}
	.comment-modal .comment-field--roomy {
		margin-top: 8px;
	}
	.comment-modal__group .comment-field--roomy {
		margin-top: 0;
	}
	.comment-modal__actions {
		display: flex;
		flex-direction: column-reverse;
		gap: 12px;
		margin-top: 28px;
	}
	.comment-required {
		color: var(--error-text);
	}
	.comment-optional {
		color: var(--text-faint);
		font-weight: 400;
	}
	.comment-notice {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 24px;
		padding: 14px 16px;
		border: 1px solid color-mix(in srgb, var(--highlight) 24%, transparent);
		border-radius: var(--border-radius-lg);
		background: color-mix(in srgb, var(--highlight) 8%, transparent);
		color: var(--text);
	}
	.comment-notice--error {
		border-color: color-mix(in srgb, var(--error-text) 35%, transparent);
		background: color-mix(in srgb, var(--error-text) 10%, transparent);
		color: var(--error-text);
	}
	.comment-notice__icon {
		flex-shrink: 0;
		width: 20px;
		height: 20px;
	}

	@media (min-width: 640px) {
		.comment-modal__actions {
			flex-direction: row;
			justify-content: flex-end;
		}
	}
	@media (max-width: 639px) {
		.comment-modal__actions .comment-button {
			width: 100%;
		}
	}

	@media (max-width: 520px) {
		.comment-card {
			--chip: 28px;
			--chip-gap: 12px;
		}
		.comment-card--nested {
			--chip: 24px;
			--chip-gap: 10px;
		}
		.comment-card--own .comment-card__main {
			padding-inline: 12px;
		}
		.comment-card--own .comment-composer,
		.comment-card--own .comment-thread {
			margin-right: 12px;
			margin-left: 12px;
		}
		.comment-footer {
			flex-wrap: wrap;
			align-items: flex-start;
			gap: 0 12px;
		}
		.comment-meta {
			min-height: 28px;
		}
		.comment-actions {
			flex: 1 0 100%;
			margin-left: -10px;
		}
		.comment-composer,
		.comment-thread {
			margin-left: 0;
		}
		.nested-comments {
			padding-left: 12px;
		}
	}

	@media (max-width: 380px) {
		.comment-action {
			padding-inline: 8px;
		}
	}
</style>
