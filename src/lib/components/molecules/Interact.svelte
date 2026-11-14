<!-- src/lib/components/molecules/Interact.svelte -->
<script lang="ts" module>
	/** Composer collapse after a first answer; the page waits this long before
	 * scrolling to the reveal so the scroll target has stopped moving. */
	export const COMPOSER_COLLAPSE_MS = 220;
</script>

<script lang="ts">
	import { onMount, untrack, type Snippet } from 'svelte';
	import { deserialize } from '$app/forms';
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { notifications } from '$lib/components/molecules/notifications';
	import BellIcon from '$lib/components/icons/bellIcon.svelte';
	import MasterCommentIcon from '$lib/components/icons/masterCommentIcon.svelte';
	import { Button } from '$lib/components/atoms';
	import VoiceRecorder from '$lib/components/molecules/VoiceRecorder.svelte';
	import type {
		User,
		Comment as CommentType,
		Subscription,
		QuestionPageData
	} from '$lib/types/questions';
	import {
		captureCommentCreated,
		captureCommentFailed,
		captureCommentStarted,
		normalizeServerCommentAnalytics,
		type CommentCreatedKind
	} from '$lib/analytics/commentEvents';
	import { capture } from '$lib/analytics/posthog';
	import { extractPageViewAttribution } from '$lib/analytics/attribution';
	import type { ReplyOptInOffer } from '$lib/components/questions/ReplyOptInTray.svelte';
	import {
		getRecipientQuestionInviteId,
		recordQuestionInviteCreated,
		shareQuestionInvite,
		shouldUseNativeQuestionShare
	} from '$lib/analytics/questionInvites';
	import { getOrCreateVisitorId } from '$lib/analytics/visitorIdentity';

	// Component props
	interface Props {
		parentType: 'question' | 'comment';
		data: QuestionPageData | CommentType;
		user: User | null;
		questionId: number;
		isDemo?: boolean;
		oncommentAdded?: (comment: CommentType) => void;
		/** An eligible anonymous first answer earns the optional reply-email tray,
		 * which the page renders in the thread under the visitor's own take. */
		onreplyOptIn?: (offer: ReplyOptInOffer) => void;
		/** Question pages: the meta line (take count, gate state) that shares a row
		 * with the quiet Subscribe / Share controls. */
		meta?: Snippet;
	}

	let {
		parentType,
		data,
		user,
		questionId,
		isDemo = false,
		oncommentAdded,
		onreplyOptIn,
		meta
	}: Props = $props();

	// Type guard to check if data is QuestionPageData
	const isQuestionPageData = (d: QuestionPageData | CommentType): d is QuestionPageData => {
		return 'question' in d && d.question !== undefined;
	};
	// Derived flag for whether user has answered (only relevant for QuestionPageData)
	let userHasAnswered = $derived(
		isQuestionPageData(data) ? data?.flags?.userHasAnswered || false : false
	);

	// Subscriptions follow `data`; subscribe/unsubscribe override them optimistically.
	let subscriptions = $derived<Subscription[]>(
		isQuestionPageData(data) ? data?.question?.subscriptions || [] : []
	);

	// SvelteKit reuses this component on client-side question -> question
	// navigation. The draft and the give-first open state below reset when the
	// question changes (each reads only `questionId`); answered-state flips leave
	// the reader's toggles alone.
	let comment = $derived.by(() => {
		void questionId;
		return '';
	});
	// Give-first: on a question the user has not yet answered, the composer is
	// the main event — open by default instead of hiding it behind a button.
	// Replies and post-answer comments stay collapsed until asked for.
	let commenting = $derived.by(() => {
		void questionId;
		return untrack(() => parentType === 'question' && !userHasAnswered);
	});
	let shareLoading = $derived.by(() => {
		void questionId;
		return false;
	});
	let shortAnswerNudge = $derived.by(() => {
		void questionId;
		return false;
	});
	let confirmShortSubmit = $derived.by(() => {
		void questionId;
		return false;
	});
	let commentError = $derived.by(() => {
		void questionId;
		return '';
	});
	// Not rendered; resets with the question so the next draft is tracked again.
	let commentStartedTracked = $derived.by(() => {
		void questionId;
		return false;
	});

	// State variables
	let loading = $state(false);
	let subscriptionLoading = $state(false);
	let anonymousComment = $state(false);
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
	let composerSurfaceId = $derived(`comment-composer-${composerId}`);

	const SHORT_ANSWER_THRESHOLD = 100;
	const TEXTAREA_MAX_HEIGHT_PX = 320;
	const REPLY_OPT_IN_DISMISSED_KEY = '9t-reply-opt-in-dismissed';

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

	let isSubscribed = $derived(subscriptions.some((e) => e.user_id === user?.id));
	let questionCommentActionLabel = $derived(userHasAnswered ? 'Add another take' : 'Add your take');
	let questionCommentActionAria = $derived(
		userHasAnswered ? 'Add another take' : 'Add your take to reveal the other answers'
	);
	let commentActionLabel = $derived(
		parentType === 'question' ? questionCommentActionLabel : 'Reply'
	);
	let commentActionAria = $derived(
		parentType === 'question' ? questionCommentActionAria : 'Write a reply'
	);
	let composerKind: CommentCreatedKind = $derived(
		parentType === 'comment' ? 'reply' : userHasAnswered ? 'comment' : 'answer'
	);

	let isQuestion = $derived(parentType === 'question');
	let signedIn = $derived(
		Boolean(user?.id) || (isQuestionPageData(data) && Boolean(data.flags?.userSignedIn))
	);
	let takeCount = $derived(
		isQuestionPageData(data) ? Math.max(Number(data.comment_count) || 0, 0) : 0
	);
	// The question page's one mint action names what posting buys.
	let answerSubmitLabel = $derived(
		takeCount > 0 ? `Post & see all ${takeCount.toLocaleString('en-US')}` : 'Post your take'
	);
	// Mint marks the next step: the empty answer box first, then the Post button once there's text.
	let answerInvite = $derived(isQuestion && composerKind === 'answer');
	let answerReady = $derived(comment.trim().length > 0);
	let composerLabel = $derived(
		composerKind === 'answer'
			? 'Your take'
			: composerKind === 'comment'
				? 'Another take'
				: `Your ${composerKind}`
	);

	let composerKindTitle = $derived(
		`${composerKind.charAt(0).toUpperCase()}${composerKind.slice(1)}`
	);
	let textareaDescribedBy = $derived(
		[shortAnswerNudge ? nudgeId : null, commentError ? errorId : null].filter(Boolean).join(' ') ||
			undefined
	);

	function getShareableQuestion() {
		return isQuestionPageData(data) ? data.question : null;
	}

	async function shareQuestionFromToolbar() {
		const question = getShareableQuestion();
		if (!question || shareLoading) return;
		shareLoading = true;

		try {
			const useNativeShare = shouldUseNativeQuestionShare({
				canNativeShare: typeof navigator.share === 'function',
				coarsePointer:
					typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches,
				viewportWidth: window.innerWidth
			});
			const result = await shareQuestionInvite({
				baseUrl: `https://9takes.com/questions/${question.url}`,
				title: 'A question from 9takes',
				text: `${question.question_formatted || question.question}\n\nI think you might answer this differently.`,
				share: useNativeShare ? navigator.share.bind(navigator) : undefined,
				writeClipboard: navigator.clipboard?.writeText?.bind(navigator.clipboard)
			});

			if (result.status !== 'shared') {
				if (result.status === 'failed') {
					notifications.danger('Could not share this question. Copy the page URL instead.', 4000);
				}
				return;
			}

			void recordQuestionInviteCreated({
				inviteId: result.inviteId,
				questionId,
				questionUrl: question.url,
				source: 'question-toolbar',
				method: result.method
			});
			void capture('question_shared_from_toolbar', {
				invite_id: result.inviteId,
				question_id: questionId,
				question_url: question.url,
				source: 'question-toolbar',
				method: result.method
			});
			notifications.success(
				result.method === 'native' ? 'Share opened' : 'Invite link copied',
				3000
			);
		} finally {
			shareLoading = false;
		}
	}

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
			void captureCommentFailed({
				...getCommentEventContext(),
				failureStage: 'request',
				errorCategory: 'network_error'
			});
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
				commentError = 'Sign up or log in to comment more than once.';
				notifications.info('Sign up or log in to comment multiple times.', 3000);
				return false;
			} else if (parentType === 'comment') {
				commentError = 'Sign up or log in to reply to another comment.';
				notifications.info('Sign up or log in to comment on other comments.', 3000);
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
			void captureCommentFailed({
				...getCommentEventContext(),
				failureStage: 'server_action',
				errorCategory: 'action_failure'
			});
			commentError = getActionErrorMessage(result);
			notifications.danger(commentError, 5000);
			console.error(result.error || result.data);
		} else {
			commentError = '';
			const submittedKind = composerKind;
			const wasAnonymousQuestionCommenter = isAnonymousQuestionCommenter();
			// A first answer's confirmation is the reveal itself (the page moves to
			// the unlocked thread), so only later comments get a toast.
			if (submittedKind !== 'answer') {
				notifications.success(`${composerKindTitle} posted`, 3000);
			}
			if (wasAnonymousQuestionCommenter) {
				anonymousComment = true;
			}
			// Normalize result: RPC might return array, single object, or null
			let commentData = result?.data;
			if (Array.isArray(commentData)) {
				commentData = commentData[0] ?? null;
			}
			const serverAnalytics = normalizeServerCommentAnalytics(commentData);
			const inviteId =
				submittedKind === 'answer' && parentType === 'question'
					? getRecipientQuestionInviteId()
					: null;
			void captureCommentCreated({
				commentId: commentData?.id,
				questionId,
				questionUrl: isQuestionPageData(data) ? data.question.url : undefined,
				parentType,
				commentKind: submittedKind,
				surface: 'question_page',
				sourcePath: window.location.pathname,
				campaign: getCurrentUtmCampaign(),
				inviteId,
				isAnonymous: !user?.id,
				...serverAnalytics
			});
			maybeShowReplyOptIn({
				commentData,
				serverAnalytics,
				submittedKind,
				wasAnonymousQuestionCommenter
			});
			oncommentAdded?.(commentData);
			comment = '';
			commentStartedTracked = false;
			shortAnswerNudge = false;
			confirmShortSubmit = false;
			queueMicrotask(() => {
				if (textareaElement) resizeTextarea(textareaElement);
			});

			// Collapse the composer after an answer so the unlocked room and
			// one-person comparison invitation become the immediate next step.
			if (submittedKind === 'answer' || userHasAnswered) {
				commenting = false;
			}
		}
	};

	function replyOptInWasDismissed(): boolean {
		try {
			return sessionStorage.getItem(REPLY_OPT_IN_DISMISSED_KEY) === '1';
		} catch {
			return false;
		}
	}

	function maybeShowReplyOptIn(input: {
		commentData: any;
		serverAnalytics: { isFirstCommentEver?: boolean };
		submittedKind: CommentCreatedKind;
		wasAnonymousQuestionCommenter: boolean;
	}) {
		const commentId = Number(input.commentData?.id);
		const questionUrl = isQuestionPageData(data) ? data.question.url : '';
		if (
			isDemo ||
			parentType !== 'question' ||
			input.submittedKind !== 'answer' ||
			!input.wasAnonymousQuestionCommenter ||
			input.serverAnalytics.isFirstCommentEver !== true ||
			!Number.isFinite(commentId) ||
			!questionUrl ||
			replyOptInWasDismissed()
		) {
			return;
		}

		onreplyOptIn?.({
			fingerprint: getCommentFingerprint(),
			context: {
				questionId,
				questionUrl,
				commentId,
				surface: 'question_page',
				isFirstCommentEver: true
			}
		});
	}

	function getCommentEventContext() {
		return {
			questionId,
			questionUrl: isQuestionPageData(data) ? data.question.url : undefined,
			commentKind: composerKind,
			surface: 'question_page' as const,
			sourcePath: typeof window === 'undefined' ? undefined : window.location.pathname,
			campaign: getCurrentUtmCampaign(),
			isAnonymous: !user?.id
		};
	}

	function getCurrentUtmCampaign(): string | undefined {
		if (typeof window === 'undefined') return undefined;
		return extractPageViewAttribution(new URL(window.location.href)).utm_campaign ?? undefined;
	}

	function trackCommentStarted(value: string) {
		if (commentStartedTracked || !value.trim()) return;
		commentStartedTracked = true;
		void captureCommentStarted(getCommentEventContext());
	}

	function toggleComposer() {
		if (commenting) {
			commenting = false;
			return;
		}
		// Anonymous visitors get one take per question: say so before they type
		// a second one instead of after they press Post.
		if (!canComment()) {
			commentError = '';
			return;
		}
		commenting = true;
	}

	// Toggle subscription status
	const toggleSubscription = async () => {
		if (!user) {
			notifications.info('Sign up or log in to subscribe to questions.', 3000);
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
		trackCommentStarted(target.value);
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
		trackCommentStarted(comment);
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
		iconStyle="padding: 0;"
		height="1.25rem"
		fill="currentColor"
		type={comment?.length ? 'full' : 'empty'}
	/>
{/snippet}

{#snippet subscriptionIcon()}
	<BellIcon iconStyle="padding: 0;" height="1.25rem" fill="currentColor" />
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

{#snippet composer()}
	<div
		class={['composer-surface', isQuestion && 'composer-surface--flat']}
		id={composerSurfaceId}
		transition:slide={{ duration: reduceMotion ? 0 : COMPOSER_COLLAPSE_MS, easing: cubicOut }}
	>
		<div class="composer-body">
			{#if isQuestion && comment.length === 0}
				<p class="depth-prompt">
					<span class="depth-prompt__lead">Dig deeper:</span>
					{depthPrompts[currentPromptIndex]}
				</p>
			{/if}
			<label class="composer-label" for={textareaId}>{composerLabel}</label>
			<textarea
				bind:this={textareaElement}
				placeholder={isQuestion
					? 'Share what happened, give an example, or explain what shaped your view.'
					: 'Share what you want to add.'}
				class={[
					'composer-textarea resize-none overflow-y-auto',
					answerInvite && !answerReady && 'composer-textarea--invite'
				]}
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
				label={`Record your ${composerKind === 'answer' ? 'take' : composerKind}`}
				disabled={loading}
				onbeforestart={rememberCommentSelection}
				ontranscript={insertVoiceTranscript}
				onbusychange={(busy) => (voiceBusy = busy)}
			/>
			{#if !voiceBusy}
				<div class="composer-footer__actions">
					{#if isQuestion && composerKind === 'answer'}
						<p class="composer-note">
							{#if signedIn}
								<b>Public.</b> Posts from your account.
							{:else}
								<b>Anonymous.</b> No account needed.
							{/if}
						</p>
					{/if}
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
						class={[
							'composer-action-button composer-action-button--submit',
							answerInvite && 'composer-action-button--answer'
						].join(' ')}
						variant={answerInvite ? (answerReady ? 'action' : 'secondary') : 'primary'}
						size="md"
						type="button"
						onclick={createComment}
						disabled={(composerKind !== 'answer' && !comment.trim()) || loading}
						{loading}
						id={commentButtonId}
					>
						{#if confirmShortSubmit}
							Post anyway
						{:else if composerKind === 'answer'}
							{answerSubmitLabel}
						{:else}
							Post {composerKind === 'comment' ? 'take' : composerKind}
						{/if}
					</Button>
				</div>
			{/if}
		</div>
	</div>
{/snippet}

{#if isQuestion}
	<!-- Question page: one quiet row (meta + Subscribe / Share), then the composer.
	     Before the visitor answers, the composer is the page's main event: always
	     open, with the Post button as the one mint action in view. -->
	<div class="interact-shell interact-shell--question">
		<div class="question-actions">
			{#if meta}
				<div class="question-actions__meta">{@render meta()}</div>
			{/if}
			<div class="question-actions__buttons">
				{#if userHasAnswered}
					<Button
						title={commenting ? `Hide ${composerKind} box` : commentActionLabel}
						class="question-action"
						variant="ghost"
						size="sm"
						onclick={toggleComposer}
						disabled={voiceBusy}
						aria-label={commenting ? `Hide ${composerKind} box` : commentActionAria}
						aria-expanded={commenting}
						aria-controls={commenting ? composerSurfaceId : undefined}
						aria-busy={voiceBusy || undefined}
						icon={commentIcon}
					>
						{commenting ? 'Hide' : commentActionLabel}
					</Button>
				{/if}
				<Button
					title={isSubscribed ? 'Unsubscribe' : 'Subscribe'}
					class="question-action"
					variant="ghost"
					size="sm"
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
					title="Share this question"
					class="question-action"
					variant="ghost"
					size="sm"
					onclick={shareQuestionFromToolbar}
					disabled={shareLoading}
					loading={shareLoading}
					aria-label="Share this question"
					aria-busy={shareLoading || undefined}
					icon={shareIcon}
				>
					Share
				</Button>
			</div>
		</div>

		{#if commenting}
			{@render composer()}
		{/if}
	</div>
{:else}
	<div class="interact-shell">
		<div class="interaction-toolbar">
			<div class="toolbar-buttons">
				<Button
					title={commenting ? `Hide ${composerKind} box` : commentActionLabel}
					class="interaction-toolbar-button"
					variant={commenting ? 'secondary' : 'primary'}
					size="md"
					onclick={toggleComposer}
					disabled={voiceBusy}
					aria-label={commenting ? `Hide ${composerKind} box` : commentActionAria}
					aria-expanded={commenting}
					aria-controls={commenting ? composerSurfaceId : undefined}
					aria-busy={voiceBusy || undefined}
					icon={commentIcon}
				>
					{commenting ? `Hide ${composerKind} box` : commentActionLabel}
				</Button>
			</div>
		</div>

		{#if commenting}
			{@render composer()}
		{/if}
	</div>
{/if}

<style>
	.interact-shell {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
	}

	/* ---------- question page: quiet row + flat composer ---------- */
	.interact-shell--question {
		gap: 1.25rem;
	}

	.question-actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem 1rem;
		min-width: 0;
	}

	.question-actions__meta {
		min-width: 0;
		flex: 1 1 18rem;
	}

	.question-actions__buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
		margin-right: -0.5rem;
	}

	:global(.question-action.btn) {
		min-height: 44px;
		color: var(--text-muted);
		font-weight: 500;
	}

	:global(.question-action.btn:hover:not(:disabled)) {
		color: var(--highlight);
	}

	/* Phone: the meta and the two quiet icons share one line; names stay in aria-label. */
	@media (max-width: 520px) {
		.question-actions {
			flex-wrap: nowrap;
			align-items: flex-start;
		}

		.question-actions__meta {
			flex: 1 1 auto;
		}

		.question-actions__buttons {
			flex: 0 0 auto;
			flex-wrap: nowrap;
			margin-top: -10px;
		}

		:global(.question-action.btn) {
			min-width: 44px;
			padding-inline: 10px;
		}

		:global(.question-action.btn .btn-label) {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip-path: inset(50%);
			white-space: nowrap;
		}
	}

	/* ---------- reply / legacy toolbar ---------- */
	.interaction-toolbar {
		padding: 0.8rem;
		border: 1px solid var(--rule);
		border-radius: 1rem;
		background: var(--surface);
	}

	.toolbar-buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
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

	/* ---------- composer ---------- */
	.composer-surface {
		border: 1px solid var(--rule);
		border-radius: 1rem;
		background: var(--surface);
	}

	/* On the question page the composer sits straight on the page: no box in a box. */
	.composer-surface--flat {
		border: 0;
		border-radius: 0;
		background: transparent;
	}

	.composer-body {
		padding: 1rem 1rem 0.75rem;
	}

	.composer-surface--flat .composer-body {
		padding: 0 0 0.75rem;
	}

	.composer-label {
		display: block;
		margin: 0 0 0.5rem;
		color: var(--highlight);
		font-size: var(--font-size-sm);
		font-weight: 600;
	}

	.depth-prompt {
		margin: 0 0 0.85rem;
		color: var(--highlight);
		font-family: var(--font-voice);
		font-style: italic;
		font-size: var(--font-size-lg);
		line-height: 1.4;
	}

	.depth-prompt__lead {
		color: var(--text-muted);
	}

	.composer-footer {
		display: grid;
		min-width: 0;
		grid-template-columns: minmax(0, auto) minmax(0, 1fr);
		align-items: center;
		gap: 1rem;
		padding: 0 1rem 1rem;
	}

	.composer-surface--flat .composer-footer {
		padding: 0;
	}

	.composer-footer--voice-active {
		grid-template-columns: minmax(0, 1fr);
		align-items: stretch;
	}

	.composer-footer__actions {
		display: flex;
		flex-wrap: wrap;
		min-width: 0;
		align-items: center;
		justify-content: flex-end;
		gap: 0.75rem 1rem;
		justify-self: end;
	}

	.composer-note {
		margin: 0;
		color: var(--text-muted);
		font-size: var(--font-size-sm);
	}

	.composer-note b {
		color: var(--text);
		font-weight: 600;
	}

	:global(.composer-action-button--answer) {
		min-height: 48px;
		padding-inline: 1.4rem;
		border-radius: 999px;
		font-weight: 700;
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease,
			color 0.2s ease,
			box-shadow 0.2s ease,
			transform 0.2s ease;
	}

	.composer-textarea {
		display: block;
		width: 100%;
		min-height: 80px;
		max-height: 20rem;
		padding: 1rem;
		border: 1px solid var(--accent);
		border-radius: var(--border-radius-md);
		background: var(--bg);
		color: var(--text);
		font: inherit;
		font-size: var(--font-size-base);
		line-height: 1.5;
		transition:
			border-color 0.15s ease,
			box-shadow 0.15s ease;
	}

	.composer-surface--flat .composer-textarea {
		min-height: 7.5rem;
	}

	.composer-textarea:focus {
		border-color: var(--highlight);
		outline: none;
		box-shadow: 0 0 0 1px var(--highlight);
	}

	/* Empty answer box: mint says "start here". Typing hands mint to the Post button. */
	.composer-textarea--invite {
		border-color: var(--action);
	}

	.composer-textarea--invite:focus {
		border-color: var(--action);
		box-shadow: 0 0 0 1px var(--action);
	}

	.composer-textarea::placeholder {
		color: var(--text-faint);
		opacity: 1;
	}

	.short-answer-nudge {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		margin-top: 0.5rem;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--rule);
		border-radius: 0.625rem;
		background: color-mix(in srgb, var(--highlight) 6%, transparent);
	}

	.short-answer-nudge__icon {
		margin-top: 0.125rem;
		color: var(--highlight);
	}

	.short-answer-nudge__copy {
		margin: 0;
		font-size: var(--font-size-sm);
		line-height: 1.55;
		color: var(--text-muted);
	}

	.short-answer-nudge__action {
		display: inline;
		padding: 0;
		border: 0;
		background: transparent;
		color: var(--highlight);
		font: inherit;
		font-weight: 600;
		text-decoration: underline;
		text-underline-offset: 2px;
		cursor: pointer;
	}

	:global(.short-answer-nudge__action:focus-visible) {
		outline: 2px solid var(--focus);
		outline-offset: 2px;
	}

	.composer-error {
		margin: 0.6rem 0 0;
		color: var(--error-text);
		font-size: var(--font-size-sm);
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
	}

	@media (max-width: 520px) {
		.depth-prompt {
			font-size: var(--font-size-base);
		}

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
			justify-content: stretch;
		}

		.composer-note {
			flex: 1 1 100%;
		}

		:global(.composer-action-button) {
			flex: 1 1 0;
			min-width: 0;
		}
	}
</style>
