<!-- src/lib/components/molecules/Interact.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { deserialize } from '$app/forms';
	import { slide } from 'svelte/transition';
	import { notifications } from '$lib/components/molecules/notifications';
	import BellIcon from '$lib/components/icons/bellIcon.svelte';
	import MasterCommentIcon from '$lib/components/icons/masterCommentIcon.svelte';
	import { Button } from '$lib/components/atoms';
	import Modal, { getModal } from '$lib/components/atoms/Modal.svelte';
	import VoiceRecorder from '$lib/components/molecules/VoiceRecorder.svelte';
	import type {
		User,
		Comment as CommentType,
		CommentLike,
		Subscription,
		QuestionPageData
	} from '$lib/types/questions';
	import { getOrCreateVisitorId } from '$lib/analytics/visitorIdentity';

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

	// Type guard to check if data is QuestionPageData
	const isQuestionPageData = (d: QuestionPageData | CommentType): d is QuestionPageData => {
		return 'question' in d && d.question !== undefined;
	};

	// State variables
	let likes = $state<CommentLike[]>([]);
	let subscriptions = $state<Subscription[]>([]);
	let comment = $state('');
	let commenting = $state(false);
	let loading = $state(false);
	let subscriptionLoading = $state(false);
	let anonymousComment = $state(false);
	let shortAnswerNudge = $state(false);
	let confirmShortSubmit = $state(false);
	let commentError = $state('');
	let reduceMotion = $state(false);
	let voiceBusy = $state(false);
	let textareaElement = $state<HTMLTextAreaElement | null>(null);
	let voiceInsertionRange = { start: 0, end: 0 };
	let composerId = $derived(
		parentType === 'question'
			? `question-${questionId}`
			: `comment-${isQuestionPageData(data) ? questionId : data.id}`
	);
	let textareaId = $derived(`comment-box-${composerId}`);
	let nudgeId = $derived(`comment-composer-nudge-${composerId}`);
	let errorId = $derived(`comment-composer-error-${composerId}`);
	let commentButtonId = $derived(`comment-button-${composerId}`);
	let qrModalId = $derived(`qr-modal-${composerId}`);

	const SHORT_ANSWER_THRESHOLD = 100;
	const TEXTAREA_MAX_HEIGHT_PX = 320;

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

	// Derived flag for whether user has answered (only relevant for QuestionPageData)
	let userHasAnswered = $derived(
		isQuestionPageData(data) ? data?.flags?.userHasAnswered || false : false
	);
	let isSubscribed = $derived(subscriptions.some((e) => e.user_id === user?.id));
	let questionCommentActionLabel = $derived(userHasAnswered ? 'Comment' : 'Answer to unlock');
	let questionCommentActionAria = $derived(
		userHasAnswered ? 'Write a comment' : 'Answer this question to unlock comments'
	);
	let commentActionLabel = $derived(
		parentType === 'question' ? questionCommentActionLabel : 'Reply'
	);
	let commentActionAria = $derived(
		parentType === 'question' ? questionCommentActionAria : 'Write a reply'
	);
	let composerKind = $derived(
		parentType === 'comment' ? 'reply' : userHasAnswered ? 'comment' : 'answer'
	);
	let composerKindTitle = $derived(
		`${composerKind.charAt(0).toUpperCase()}${composerKind.slice(1)}`
	);
	let textareaDescribedBy = $derived(
		[shortAnswerNudge ? nudgeId : null, commentError ? errorId : null].filter(Boolean).join(' ') ||
			undefined
	);
	let shareReady = $derived(Boolean(qrCodeUrl));

	// Update likes and subscription state from data
	$effect(() => {
		likes = isQuestionPageData(data) ? [] : (data as CommentType)?.comment_like || [];
		subscriptions = isQuestionPageData(data) ? data?.question?.subscriptions || [] : [];
	});

	// Handle QR code modal opening
	const openQRModal = () => {
		if (!shareReady) return;
		getModal(qrModalId).open();
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
		if (voiceBusy) {
			notifications.info('Finish your voice recording before posting.', 3000);
			return;
		}
		if (!canComment()) return;
		if (!comment.trim()) {
			commentError = `Write your ${composerKind} before posting.`;
			notifications.info(`${composerKindTitle} cannot be empty`, 3000);
			return;
		}
		commentError = '';

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
			commentError = 'Failed to create comment. Please try again.';
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
				commentError = 'Register or log in to comment more than once.';
				notifications.info('Must register or login to comment multiple times', 3000);
				return false;
			} else if (parentType === 'comment') {
				commentError = 'Register or log in to reply to another comment.';
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

	function getActionErrorMessage(result: any): string {
		const candidate =
			result?.error?.message ?? result?.data?.message ?? result?.data?.error ?? result?.error;

		return typeof candidate === 'string' && candidate.trim() ? candidate : 'Error adding comment';
	}

	// Handle comment submission result
	const handleCommentResult = (result: any) => {
		if (result.error || result.type === 'error' || result.type === 'failure') {
			commentError = getActionErrorMessage(result);
			notifications.danger(commentError, 5000);
			console.error(result.error || result.data);
		} else {
			commentError = '';
			notifications.success(`${composerKindTitle} posted`, 3000);
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
			shortAnswerNudge = false;
			confirmShortSubmit = false;
			queueMicrotask(() => {
				if (textareaElement) resizeTextarea(textareaElement);
			});

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

	function resizeTextarea(target: HTMLTextAreaElement) {
		target.style.height = 'auto';
		target.style.height = `${Math.min(target.scrollHeight + 2, TEXTAREA_MAX_HEIGHT_PX)}px`;
	}

	// Handle textarea auto-growth
	const handleTextareaInput = (e: Event) => {
		const target = e.target as HTMLTextAreaElement;
		commentError = '';
		rememberCommentSelection();

		// Reset nudge when user keeps typing
		if (shortAnswerNudge && target.value.trim().length >= SHORT_ANSWER_THRESHOLD) {
			shortAnswerNudge = false;
			confirmShortSubmit = false;
		}

		resizeTextarea(target);
	};

	// Handle keyboard shortcuts
	const handleKeydown = (e: KeyboardEvent) => {
		// Submit comment with Ctrl+Enter or Cmd+Enter
		if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && comment.trim()) {
			e.preventDefault();
			if (voiceBusy) return;
			createComment();
		}
	};

	function rememberCommentSelection() {
		if (!textareaElement) return;
		voiceInsertionRange = {
			start: textareaElement.selectionStart ?? comment.length,
			end: textareaElement.selectionEnd ?? comment.length
		};
	}

	function insertVoiceTranscript(transcript: string) {
		const trimmedTranscript = transcript.trim();
		if (!trimmedTranscript) return;

		const start = Math.min(voiceInsertionRange.start, comment.length);
		const end = Math.min(Math.max(voiceInsertionRange.end, start), comment.length);
		const replacingSelection = start !== end;
		const needsSpaceBefore =
			!replacingSelection && start > 0 && !/\s/.test(comment[start - 1] ?? '');
		const needsSpaceAfter =
			!replacingSelection && end < comment.length && !/\s/.test(comment[end] ?? '');
		const insertedText = `${needsSpaceBefore ? ' ' : ''}${trimmedTranscript}${needsSpaceAfter ? ' ' : ''}`;

		comment = `${comment.slice(0, start)}${insertedText}${comment.slice(end)}`;
		commentError = '';
		if (comment.trim().length >= SHORT_ANSWER_THRESHOLD) {
			shortAnswerNudge = false;
			confirmShortSubmit = false;
		}

		const cursorPosition = start + insertedText.length;
		voiceInsertionRange = { start: cursorPosition, end: cursorPosition };
		queueMicrotask(() => {
			if (!textareaElement) return;
			resizeTextarea(textareaElement);
			textareaElement.focus();
			textareaElement.setSelectionRange(cursorPosition, cursorPosition);
		});
	}

	// Initialize on mount
	onMount(() => {
		reduceMotion =
			typeof window.matchMedia === 'function' &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		cachedFingerprint = getOrCreateVisitorId();
	});
</script>

{#snippet commentIcon()}
	<MasterCommentIcon
		iconStyle={'padding: 0;'}
		height={'1.25rem'}
		fill={'currentColor'}
		type={comment?.length ? 'full' : 'empty'}
	/>
{/snippet}

{#snippet subscriptionIcon()}
	<BellIcon iconStyle={'padding: 0;'} height={'1.25rem'} fill={'currentColor'} />
{/snippet}

{#snippet shareIcon()}
	<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M18 8a3 3 0 100-6 3 3 0 000 6zM6 15a3 3 0 100-6 3 3 0 000 6zM18 22a3 3 0 100-6 3 3 0 000 6zM8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"
		/>
	</svg>
{/snippet}

<div class="interact-shell">
	<div class="interaction-toolbar">
		<div class="toolbar-buttons">
			<Button
				title={commentActionLabel}
				class="interaction-toolbar-button"
				variant="primary"
				size="md"
				onclick={() => (commenting = !commenting)}
				disabled={voiceBusy}
				aria-label={commenting ? `Hide ${composerKind} composer` : commentActionAria}
				aria-busy={voiceBusy || undefined}
				icon={commentIcon}
			>
				{commenting ? `Hide ${composerKind}` : commentActionLabel}
			</Button>

			{#if parentType === 'question'}
				<Button
					title={isSubscribed ? 'Unsubscribe' : 'Subscribe'}
					class="interaction-toolbar-button"
					variant={isSubscribed ? 'ghost' : 'secondary'}
					size="md"
					onclick={toggleSubscription}
					disabled={subscriptionLoading}
					loading={subscriptionLoading}
					aria-label={isSubscribed
						? 'Unsubscribe from this question'
						: 'Subscribe to this question'}
					aria-busy={subscriptionLoading}
					icon={subscriptionIcon}
				>
					{isSubscribed ? 'Subscribed' : 'Subscribe'}
				</Button>

				<Button
					title={shareReady ? 'Share via QR Code' : 'Preparing share code'}
					class="interaction-toolbar-button"
					variant="secondary"
					size="md"
					onclick={openQRModal}
					disabled={!shareReady}
					aria-label={shareReady ? 'Share via QR Code' : 'Preparing share QR code'}
					aria-busy={!shareReady || undefined}
					icon={shareIcon}
				>
					Share
				</Button>
			{/if}
		</div>
	</div>

	{#if commenting}
		<div class="composer-surface" in:slide={{ duration: reduceMotion ? 0 : 300 }}>
			<div class="composer-body">
				{#if parentType === 'question' && comment.length === 0}
					<p class="depth-prompt">
						<span class="font-medium text-[var(--lamp-glow)]">Dig deeper:</span>
						{depthPrompts[currentPromptIndex]}
					</p>
				{/if}
				<label class="composer-label" for={textareaId}>
					Your {composerKind}
				</label>
				<textarea
					bind:this={textareaElement}
					placeholder={parentType === 'question'
						? 'Share what happened, give an example, or explain what shaped your view.'
						: 'Share what you want to add.'}
					class="composer-textarea bg-[var(--night-deep)]/80 w-full resize-none overflow-y-auto rounded-md border border-[var(--stone-warm)] px-3 py-2 text-sm leading-relaxed text-[var(--ink-bright)] focus:border-[var(--lamp-glow)] focus:outline-none focus:ring-1 focus:ring-[var(--lamp-glow)]"
					bind:value={comment}
					id={textareaId}
					aria-invalid={commentError ? 'true' : 'false'}
					aria-describedby={textareaDescribedBy}
					rows="4"
					oninput={handleTextareaInput}
					onkeydown={handleKeydown}
					onselect={rememberCommentSelection}
					onclick={rememberCommentSelection}
					onkeyup={rememberCommentSelection}></textarea>
				{#if shortAnswerNudge}
					<div
						class="short-answer-nudge"
						id={nudgeId}
						role="status"
						in:slide={{ duration: reduceMotion ? 0 : 200 }}
					>
						<span class="short-answer-nudge__icon">&#9997;</span>
						<p class="short-answer-nudge__copy">
							<span class="font-medium">Your {composerKind} could go deeper.</span> Try adding a
							personal story, a specific example, or what shaped your perspective. You can still
							<button class="short-answer-nudge__action" type="button" onclick={createComment}>
								post as-is
							</button>.
						</p>
					</div>
				{/if}
				{#if commentError}
					<p class="composer-error" id={errorId} role="alert">
						{commentError}
					</p>
				{/if}
			</div>
			<div
				class={['composer-footer', voiceBusy && 'composer-footer--voice-active']}
				aria-busy={voiceBusy || undefined}
			>
				<VoiceRecorder
					id={`${composerId}-voice-recorder`}
					label={`Record your ${composerKind}`}
					disabled={loading}
					onbeforestart={rememberCommentSelection}
					ontranscript={insertVoiceTranscript}
					onbusychange={(busy) => (voiceBusy = busy)}
				/>
				{#if !voiceBusy}
					<div class="composer-footer__actions">
						{#if userHasAnswered}
							<Button
								class="composer-action-button"
								variant="secondary"
								size="md"
								type="button"
								onclick={() => {
									commenting = false;
									comment = '';
								}}
								disabled={loading}
							>
								Cancel
							</Button>
						{/if}
						<Button
							class="composer-action-button composer-action-button--submit"
							variant="primary"
							size="md"
							type="button"
							onclick={createComment}
							disabled={!comment.trim() || loading}
							{loading}
							id={commentButtonId}
						>
							{#if confirmShortSubmit}
								Post anyway
							{:else}
								Post {composerKind}
							{/if}
						</Button>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

<!-- QR Code Modal -->
{#if parentType === 'question'}
	<Modal id={qrModalId} name="Share this question">
		<div class="mx-auto flex max-w-sm flex-col items-center py-2 text-center">
			<h2 class="mb-1 text-xl font-semibold text-[var(--ink-bright)]">Share This Question</h2>
			<p class="mb-5 text-sm text-[var(--ink-mid)]">Scan the QR code to share with others</p>

			<div class="mb-5 rounded-xl border border-[var(--lamp-soft)] bg-[var(--night-deep)] p-4">
				{#if shareReady}
					<img
						src={qrCodeUrl}
						alt="Share question QR code"
						width="180"
						height="180"
						class="h-[180px] w-[180px]"
					/>
				{/if}
			</div>

			<p class="text-xs text-[var(--ink-dim)]">Share and explore different perspectives</p>
		</div>
	</Modal>
{/if}

<style>
	.interact-shell {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
	}

	.interaction-toolbar {
		padding: 0.8rem;
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 16%, var(--stone-edge));
		border-radius: 1rem;
		background:
			linear-gradient(
				180deg,
				color-mix(in srgb, var(--lamp-soft) 32%, transparent) 0%,
				transparent 100%
			),
			color-mix(in srgb, var(--stone-warm) 96%, var(--night-deep));
		box-shadow: var(--shadow-sm);
	}

	.toolbar-buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	@media (min-width: 640px) {
		.toolbar-buttons {
			gap: 0.75rem;
		}
	}

	:global(.interaction-toolbar-button) {
		flex: 1 1 11rem;
		min-width: 0;
	}

	:global(.interaction-toolbar-button .btn-label),
	:global(.composer-action-button .btn-label) {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.composer-surface {
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 18%, var(--stone-edge));
		border-radius: 1rem;
		background:
			linear-gradient(
				180deg,
				color-mix(in srgb, var(--lamp-soft) 36%, transparent) 0%,
				transparent 30%
			),
			color-mix(in srgb, var(--stone-warm) 97%, var(--night-deep));
		box-shadow: var(--shadow-sm);
	}

	.composer-body {
		padding: 1rem 1rem 0.75rem;
	}

	.composer-label {
		display: block;
		margin: 0 0 0.45rem;
		color: var(--ink-bright);
		font-size: 0.875rem;
		font-weight: 600;
	}

	.depth-prompt {
		margin: 0 0 0.75rem;
		padding: 0.6rem 0.8rem;
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 18%, transparent);
		border-radius: 0.625rem;
		background: color-mix(in srgb, var(--lamp-soft) 42%, transparent);
		color: color-mix(in srgb, var(--lamp-glow) 72%, var(--ink-mid));
		font-size: 0.78rem;
		line-height: 1.5;
	}

	.composer-footer {
		display: grid;
		min-width: 0;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: 1rem;
		padding: 0 1rem 1rem;
	}

	.composer-footer--voice-active {
		grid-template-columns: minmax(0, 1fr);
		align-items: stretch;
	}

	.composer-footer__actions {
		display: flex;
		min-width: 0;
		align-items: center;
		justify-content: flex-end;
		gap: 0.75rem;
		justify-self: end;
	}

	.composer-textarea {
		display: block;
		min-height: 80px;
		max-height: 20rem;
		padding: 1rem;
		font: inherit;
		font-size: 16px;
		line-height: 1.5;
	}

	.composer-textarea::placeholder {
		color: var(--ink-mid);
		opacity: 1;
	}

	.short-answer-nudge {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		margin-top: 0.5rem;
		padding: 0.5rem 0.75rem;
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 22%, var(--stone-edge));
		border-radius: 0.625rem;
		background: var(--lamp-soft);
	}

	.short-answer-nudge__icon {
		margin-top: 0.125rem;
		color: var(--lamp-glow);
	}

	.short-answer-nudge__copy {
		margin: 0;
		font-size: 0.75rem;
		line-height: 1.55;
		color: var(--ink-mid);
	}

	.short-answer-nudge__action {
		display: inline;
		padding: 0;
		border: 0;
		background: transparent;
		color: var(--lamp-glow);
		font: inherit;
		font-weight: 600;
		text-decoration: underline;
		text-underline-offset: 2px;
		cursor: pointer;
	}

	.short-answer-nudge__action:hover,
	:global(.short-answer-nudge__action:focus-visible) {
		color: var(--lamp-light);
		outline: 2px solid var(--lamp-glow);
		outline-offset: 2px;
	}

	.composer-error {
		margin: 0.6rem 0 0;
		color: var(--error-text);
		font-size: 0.875rem;
		font-weight: 600;
		line-height: 1.45;
	}

	@media (max-width: 640px) {
		.interaction-toolbar {
			padding: 0.7rem;
		}

		:global(.interaction-toolbar-button) {
			flex: 1 1 calc(50% - 0.5rem);
			min-width: 0;
		}

		.composer-footer {
			gap: 0.75rem;
		}

		.composer-footer__actions {
			flex: 1 1 auto;
			gap: 0.5rem;
		}

		:global(.composer-action-button) {
			flex: 1 1 0;
			min-width: 0;
		}
	}

	@media (max-width: 520px) {
		.composer-textarea {
			max-height: 16rem;
		}

		.composer-footer {
			grid-template-columns: minmax(0, 1fr);
			align-items: stretch;
		}

		.composer-footer__actions {
			width: 100%;
			justify-self: stretch;
		}
	}

	@media (max-width: 380px) {
		:global(.interaction-toolbar-button) {
			font-size: 0.85rem;
		}
	}
</style>
