<!-- src/lib/components/molecules/Interact.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { deserialize } from '$app/forms';
	import { slide } from 'svelte/transition';
	import { notifications } from '$lib/components/molecules/notifications';
	import BellIcon from '$lib/components/icons/bellIcon.svelte';
	import MasterCommentIcon from '$lib/components/icons/masterCommentIcon.svelte';
	import RightIcon from '$lib/components/icons/rightIcon.svelte';
	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';
	import type {
		User,
		Comment as CommentType,
		CommentLike,
		Subscription,
		QuestionPageData
	} from '$lib/types/questions';
	import { getOrCreateVisitorId } from '$lib/analytics/visitorIdentity';
	import { viewportWidth } from '$lib/stores/viewport';

	// Component props
	interface Props {
		parentType: 'question' | 'comment';
		data: QuestionPageData | CommentType;
		user: User | null;
		questionId: number;
		qrCodeUrl: string;
		oncommentAdded?: (comment: CommentType) => void;
	}

	let { parentType, data, user, questionId, qrCodeUrl, oncommentAdded }: Props = $props();

	// State variables
	let likes = $state<CommentLike[]>([]);
	let subscriptions = $state<Subscription[]>([]);
	let comment = $state('');
	let commenting = $state(false);
	let loading = $state(false);
	let subscriptionLoading = $state(false);
	let anonymousComment = $state(false);
	let textareaHeight = $state('auto');
	let shortAnswerNudge = $state(false);
	let confirmShortSubmit = $state(false);

	const SHORT_ANSWER_THRESHOLD = 100;

	const depthPrompts = [
		'What personal experience shaped your view on this?',
		'Can you share a specific example or story?',
		'What would someone who disagrees with you say?',
		'How has your perspective on this changed over time?',
		'What emotion comes up first when you think about this?'
	];

	let currentPromptIndex = $state(Math.floor(Math.random() * 5));

	// Cached visitor id - loaded once on mount
	let cachedFingerprint = $state<string | null>(null);

	// Type guard to check if data is QuestionPageData
	const isQuestionPageData = (d: QuestionPageData | CommentType): d is QuestionPageData => {
		return 'question' in d && d.question !== undefined;
	};

	// Use shared viewport store
	let innerWidth = $derived($viewportWidth);

	// Derived flag for whether user has answered (only relevant for QuestionPageData)
	let userHasAnswered = $derived(
		isQuestionPageData(data) ? data?.flags?.userHasAnswered || false : false
	);

	// Update likes and subscription state from data
	$effect(() => {
		likes = isQuestionPageData(data) ? [] : (data as CommentType)?.comment_like || [];
		subscriptions = isQuestionPageData(data) ? data?.question?.subscriptions || [] : [];

		// Auto-show comment box for first-time answerers
		if (isQuestionPageData(data) && !data?.flags?.userHasAnswered && parentType === 'question') {
			commenting = true;
		}
	});

	// Handle QR code modal opening
	const openQRModal = () => {
		getModal('qr-modal').open();
	};

	const getCommentFingerprint = (): string => {
		if (cachedFingerprint) return cachedFingerprint;
		cachedFingerprint = getOrCreateVisitorId();
		return cachedFingerprint;
	};

	const isAnonymousQuestionCommenter = () => {
		const flags = isQuestionPageData(data) ? data.flags : null;
		return parentType === 'question' && !flags?.userSignedIn && !user?.id;
	};

	// Create a new comment
	const createComment = async () => {
		if (!canComment()) return;
		if (!comment.trim()) {
			notifications.info('Comment cannot be empty', 3000);
			return;
		}

		// Nudge for short answers on questions (not replies)
		if (
			parentType === 'question' &&
			comment.trim().length < SHORT_ANSWER_THRESHOLD &&
			!confirmShortSubmit
		) {
			shortAnswerNudge = true;
			confirmShortSubmit = true;
			return;
		}

		shortAnswerNudge = false;
		confirmShortSubmit = false;
		loading = true;

		try {
			const body = new FormData();
			appendCommonFormData(body, getCommentFingerprint());

			const result = await submitComment(body);
			handleCommentResult(result);
		} catch (error) {
			console.error('Error creating comment:', error);
			notifications.danger('Failed to create comment', 3000);
		} finally {
			loading = false;
		}
	};

	// Check if user can comment
	const canComment = () => {
		const flags = isQuestionPageData(data) ? data.flags : null;
		if (!flags?.userSignedIn && !user?.id) {
			if (flags?.userHasAnswered || anonymousComment) {
				notifications.info('Must register or login to comment multiple times', 3000);
				return false;
			} else if (parentType === 'comment') {
				notifications.info('Must register or login to comment on other comments', 3000);
				return false;
			}
		}
		return true;
	};

	// Prepare form data for comment submission
	const appendCommonFormData = (body: FormData, fingerprint: string) => {
		body.append('comment', comment);

		// Get parent_id and es_id based on parent type
		let parentId: number;
		let esId: string;
		if (parentType === 'comment' && !isQuestionPageData(data)) {
			parentId = data.id;
			esId = data.es_id ?? '';
		} else if (isQuestionPageData(data)) {
			parentId = data.question.id;
			esId = data.question.es_id ?? '';
		} else {
			// Fallback - should not happen with proper typing
			parentId = questionId;
			esId = '';
		}

		body.append('parent_id', parentId.toString());
		body.append('author_id', user?.id ?? '');
		body.append('parent_type', parentType);
		body.append('es_id', esId);
		body.append('question_id', questionId.toString());
		body.append('fingerprint', fingerprint);
	};

	// Submit comment to the server
	const submitComment = async (body: FormData) => {
		const resp = await fetch('?/createCommentRando', {
			method: 'POST',
			body
		});
		return deserialize(await resp.text());
	};

	// Handle comment submission result
	const handleCommentResult = (result: any) => {
		if (result.error || result.type === 'error' || result.type === 'failure') {
			notifications.danger('Error adding comment', 3000);
			console.error(result.error || result.data);
		} else {
			notifications.success('Comment Added', 3000);
			if (isAnonymousQuestionCommenter()) {
				anonymousComment = true;
			}
			// Normalize result: RPC might return array, single object, or null
			let commentData = result?.data;
			if (Array.isArray(commentData)) {
				commentData = commentData[0] ?? null;
			}
			oncommentAdded?.(commentData);
			comment = '';
			textareaHeight = 'auto';
			shortAnswerNudge = false;
			confirmShortSubmit = false;

			// Hide comment box after submitting for non-first-time users
			if (userHasAnswered) {
				commenting = false;
			}
		}
	};

	// Toggle subscription status
	const toggleSubscription = async () => {
		if (!user) {
			notifications.info('Must register or login to subscribe to questions', 3000);
			return;
		}

		const isSubscribed = subscriptions.some((e) => e.user_id === user.id);
		const operation = isSubscribed ? 'remove' : 'add';

		subscriptionLoading = true;

		try {
			// Only allow subscriptions on questions (QuestionPageData)
			if (!isQuestionPageData(data)) {
				notifications.danger('Cannot subscribe to comments', 3000);
				return;
			}

			const body = new FormData();
			body.append('parent_id', data.question.id.toString());
			body.append('user_id', user.id);
			body.append('es_id', data.question.es_id ?? '');
			body.append('operation', operation);

			const resp = await fetch('?/subscribe', {
				method: 'POST',
				body
			});

			const result: any = deserialize(await resp.text());

			notifications.success(
				operation === 'add' ? 'Subscription Added' : 'Subscription Removed',
				3000
			);

			updateSubscriptions(result?.data, operation);
		} catch (error) {
			console.error('Error toggling subscription:', error);
			notifications.danger('Failed to update subscription', 3000);
		} finally {
			subscriptionLoading = false;
		}
	};

	// Update subscription state
	const updateSubscriptions = (newSubscription: any, operation: string) => {
		if (operation === 'add') {
			subscriptions = [newSubscription, ...subscriptions];
		} else {
			subscriptions = subscriptions.filter((c) => c.user_id !== user?.id);
		}
	};

	// Handle textarea auto-growth
	const handleTextareaInput = (e: Event) => {
		const target = e.target as HTMLTextAreaElement;

		// Reset nudge when user keeps typing
		if (shortAnswerNudge && target.value.trim().length >= SHORT_ANSWER_THRESHOLD) {
			shortAnswerNudge = false;
			confirmShortSubmit = false;
		}

		// Reset height temporarily to get the right scrollHeight
		target.style.height = 'auto';
		// Set new height based on scrollHeight (with a small buffer)
		target.style.height = `${target.scrollHeight + 2}px`;

		// Update the data attribute for the container
		const container = target.parentNode as HTMLElement;
		if (container) {
			container.dataset.replicatedValue = target.value;
		}
	};

	// Handle keyboard shortcuts
	const handleKeydown = (e: KeyboardEvent) => {
		// Submit comment with Ctrl+Enter or Cmd+Enter
		if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && comment.trim()) {
			e.preventDefault();
			createComment();
		}
	};

	// Initialize on mount
	onMount(() => {
		// Parse any escaped newlines in placeholders
		document.querySelectorAll('textarea').forEach((elem) => {
			elem.placeholder = elem.placeholder.replace(/\\n/g, '\n');
		});

		cachedFingerprint = getOrCreateVisitorId();
	});
</script>

<div class="interact-shell">
	<div class="interaction-toolbar">
		<div class="flex flex-wrap gap-2 sm:gap-3">
			<button
				title="Comment"
				class="interaction-button interaction-button-primary"
				onclick={() => (commenting = !commenting)}
				aria-label={commenting ? 'Hide comment box' : 'Write a comment'}
			>
				<MasterCommentIcon
					iconStyle={'padding: 0;'}
					height={'1.25rem'}
					fill={'currentColor'}
					type={comment?.length ? 'full' : 'empty'}
				/>
				<span class="whitespace-nowrap">Comment</span>
			</button>

			{#if parentType === 'question'}
				<button
					title={subscriptions.some((e) => e.user_id === user?.id) ? 'Unsubscribe' : 'Subscribe'}
					class="interaction-button {subscriptions.some((e) => e.user_id === user?.id)
						? 'interaction-button-active'
						: 'interaction-button-secondary'}"
					onclick={toggleSubscription}
					disabled={subscriptionLoading}
					aria-label={subscriptions.some((e) => e.user_id === user?.id)
						? 'Unsubscribe from this question'
						: 'Subscribe to this question'}
					aria-busy={subscriptionLoading}
				>
					{#if subscriptionLoading}
						<div
							class="border-current/30 h-5 w-5 animate-spin rounded-full border-2 border-t-current"
						></div>
					{:else}
						<BellIcon iconStyle={'padding: 0;'} height={'1.25rem'} fill={'currentColor'} />
					{/if}
					<span class="whitespace-nowrap">
						{subscriptions.some((e) => e.user_id === user?.id) ? 'Subscribed' : 'Subscribe'}
					</span>
				</button>

				{#if qrCodeUrl}
					<button
						title="Share via QR Code"
						class="interaction-button interaction-button-secondary"
						onclick={openQRModal}
						aria-label="Share via QR Code"
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M18 8a3 3 0 100-6 3 3 0 000 6zM6 15a3 3 0 100-6 3 3 0 000 6zM18 22a3 3 0 100-6 3 3 0 000 6zM8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"
							/>
						</svg>
						<span class="whitespace-nowrap">Share</span>
					</button>
				{/if}
			{/if}
		</div>
	</div>

	{#if commenting}
		<div class="composer-surface" in:slide={{ duration: 300 }}>
			<div class="composer-body">
				{#if parentType === 'question' && comment.length === 0}
					<p class="depth-prompt">
						<span class="font-medium text-[var(--primary)]">Dig deeper:</span>
						{depthPrompts[currentPromptIndex]}
					</p>
				{/if}
				<div
					class="textarea-container"
					data-replicated-value={comment}
					style="--text-height: {textareaHeight};"
				>
					<textarea
						placeholder={parentType === 'question'
							? 'Say something real. Share what happened, give an example, or explain why you see it that way.\n\nThe best comments are honest and specific.'
							: 'Write your reply...'}
						class="composer-textarea bg-[var(--bg-deep)]/80 w-full resize-none overflow-y-auto rounded-md border border-[var(--bg-elevated)] px-3 py-2 text-sm leading-relaxed text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
						bind:value={comment}
						id="comment-box"
						rows="4"
						oninput={handleTextareaInput}
						onkeydown={handleKeydown}
					></textarea>
				</div>
				{#if shortAnswerNudge}
					<div
						class="mt-2 flex items-start gap-2 rounded-md border border-amber-500/20 bg-amber-500/5 px-3 py-2"
						in:slide={{ duration: 200 }}
					>
						<span class="mt-0.5 text-amber-400">&#9997;</span>
						<p class="text-xs leading-relaxed text-amber-300/90">
							<span class="font-medium">Your take could go deeper.</span> Try adding a personal
							story, a specific example, or what shaped your perspective. You can still
							<button
								class="inline font-medium text-amber-200 underline underline-offset-2 hover:text-amber-100"
								type="button"
								onclick={createComment}
							>
								post as-is
							</button>.
						</p>
					</div>
				{/if}
			</div>
			<div class="composer-footer">
				<span class="text-xs text-[var(--text-muted)]">
					{#if parentType === 'question' && comment.length > 0 && comment.length < SHORT_ANSWER_THRESHOLD}
						<span class="text-amber-500/80"
							>{comment.length} chars. Keep going and add some detail.</span
						>
					{:else if comment.length > 0}
						{comment.length} characters
					{:else}
						Press Ctrl+Enter to submit
					{/if}
				</span>
				<div class="flex gap-2">
					{#if userHasAnswered}
						<button
							class="interaction-button interaction-button-muted"
							type="button"
							onclick={() => {
								commenting = false;
								comment = '';
							}}
						>
							Cancel
						</button>
					{/if}
					<button
						class="interaction-button interaction-button-primary interaction-button-submit"
						type="button"
						onclick={createComment}
						disabled={!comment.trim() || loading}
						id="comment-button"
					>
						{#if loading}
							<div
								class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white"
							></div>
						{:else if confirmShortSubmit}
							Post Anyway
						{:else}
							{parentType === 'question' ? 'Post Comment' : 'Reply'}
						{/if}
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>

<!-- QR Code Modal -->
<Modal2 id="qr-modal">
	<div class="mx-auto flex max-w-sm flex-col items-center py-2 text-center">
		<h2 class="mb-1 text-xl font-semibold text-[var(--text-primary)]">Share This Question</h2>
		<p class="mb-5 text-sm text-[var(--text-secondary)]">Scan the QR code to share with others</p>

		<div class="mb-5 rounded-xl border border-[var(--primary-subtle)] bg-[var(--bg-deep)] p-4">
			<img src={qrCodeUrl} alt="Share question QR code" class="h-[180px] w-[180px]" />
		</div>

		<p class="text-xs text-[var(--text-muted)]">Share and explore different perspectives</p>
	</div>
</Modal2>

<style>
	.interact-shell {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
	}

	.interaction-toolbar {
		padding: 0.8rem;
		border: 1px solid color-mix(in srgb, var(--primary) 16%, var(--border-color));
		border-radius: 1rem;
		background:
			linear-gradient(
				180deg,
				color-mix(in srgb, var(--primary-subtle) 32%, transparent) 0%,
				transparent 100%
			),
			color-mix(in srgb, var(--bg-surface) 92%, transparent);
		box-shadow: var(--shadow-sm);
		backdrop-filter: blur(12px);
	}

	.interaction-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.7rem 1rem;
		border-radius: 0.9rem;
		border: 1px solid color-mix(in srgb, var(--primary) 14%, var(--border-color));
		font-size: 0.92rem;
		font-weight: 600;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease,
			border-color 0.2s ease,
			background-color 0.2s ease,
			color 0.2s ease;
	}

	.interaction-button:hover:not(:disabled) {
		transform: translateY(-1px);
		box-shadow: var(--shadow-sm);
	}

	.interaction-button:disabled {
		cursor: not-allowed;
		opacity: 0.55;
	}

	.interaction-button-primary {
		border-color: color-mix(in srgb, var(--primary) 26%, transparent);
		background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%);
		color: var(--text-on-primary);
		box-shadow: var(--glow-sm);
	}

	.interaction-button-primary:hover:not(:disabled) {
		background: linear-gradient(135deg, var(--primary-darker) 0%, var(--primary-dark) 100%);
		box-shadow: var(--glow-md);
	}

	.interaction-button-secondary {
		background: color-mix(in srgb, var(--bg-surface) 92%, transparent);
		color: var(--text-secondary);
	}

	.interaction-button-secondary:hover:not(:disabled),
	.interaction-button-muted:hover:not(:disabled) {
		border-color: color-mix(in srgb, var(--primary) 22%, var(--border-color));
		color: var(--primary);
		background: color-mix(in srgb, var(--primary-subtle) 50%, transparent);
	}

	.interaction-button-active {
		border-color: color-mix(in srgb, var(--primary) 30%, transparent);
		background: var(--primary-subtle);
		color: var(--primary);
	}

	.interaction-button-muted {
		background: color-mix(in srgb, var(--bg-surface) 92%, transparent);
		color: var(--text-secondary);
	}

	.interaction-button-submit {
		min-width: 9.5rem;
	}

	.composer-surface {
		border: 1px solid color-mix(in srgb, var(--primary) 18%, var(--border-color));
		border-radius: 1.15rem;
		background:
			linear-gradient(
				180deg,
				color-mix(in srgb, var(--primary-subtle) 36%, transparent) 0%,
				transparent 30%
			),
			color-mix(in srgb, var(--bg-surface) 94%, transparent);
		box-shadow: var(--shadow-sm);
		backdrop-filter: blur(14px);
	}

	.composer-body {
		padding: 1rem;
	}

	.depth-prompt {
		margin: 0 0 0.75rem;
		padding: 0.6rem 0.8rem;
		border: 1px solid color-mix(in srgb, var(--primary) 18%, transparent);
		border-radius: 0.85rem;
		background: color-mix(in srgb, var(--primary-subtle) 42%, transparent);
		color: color-mix(in srgb, var(--primary) 72%, var(--text-secondary));
		font-size: 0.78rem;
		line-height: 1.5;
	}

	.composer-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 0.9rem 1rem;
		border-top: 1px solid color-mix(in srgb, var(--primary) 16%, var(--border-color));
		border-radius: 0 0 1.15rem 1.15rem;
		background: color-mix(in srgb, var(--bg-deep) 74%, transparent);
	}

	/* Custom textarea auto-grow grid technique - complex layout that doesn't translate well to utilities */
	.textarea-container {
		position: relative;
		display: grid;
	}

	.textarea-container::after {
		content: attr(data-replicated-value) ' ';
		white-space: pre-wrap;
		visibility: hidden;
	}

	.textarea-container::after,
	.textarea-container > textarea {
		min-height: 80px;
		padding: 1rem;
		font: inherit;
		font-size: 16px;
		line-height: 1.5;
		grid-area: 1 / 1 / 2 / 2;
	}

	.composer-textarea::placeholder {
		color: var(--text-secondary);
		opacity: 1;
	}

	@media (max-width: 640px) {
		.interaction-toolbar {
			padding: 0.7rem;
		}

		.interaction-button {
			flex: 1 1 0;
			min-width: 0;
			padding: 0.7rem 0.8rem;
		}

		.composer-footer {
			flex-direction: column;
			align-items: stretch;
		}

		.composer-footer > .flex {
			justify-content: stretch;
		}

		.composer-footer > .flex > .interaction-button {
			flex: 1 1 0;
		}
	}
</style>
