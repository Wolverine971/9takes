<!-- src/lib/components/molecules/Interact.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { deserialize } from '$app/forms';
	import { slide } from 'svelte/transition';
	import { notifications } from '$lib/components/molecules/notifications';
	import BellIcon from '$lib/components/icons/bellIcon.svelte';
	import MasterCommentIcon from '$lib/components/icons/masterCommentIcon.svelte';
	import { Button } from '$lib/components/atoms';
	import VoiceRecorder from '$lib/components/molecules/VoiceRecorder.svelte';
	import type {
		User,
		Comment as CommentType,
		CommentLike,
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
	import {
		captureReplyOptInDismissed,
		captureReplyOptInFailed,
		captureReplyOptInFocused,
		captureReplyOptInShown,
		captureReplyOptInSubmitted,
		captureReplyOptInSucceeded,
		type ReplyOptInContext,
		type ReplyOptInFailureCategory
	} from '$lib/analytics/replyOptInEvents';
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
	}

	let { parentType, data, user, questionId, isDemo = false, oncommentAdded }: Props = $props();

	// Type guard to check if data is QuestionPageData
	const isQuestionPageData = (d: QuestionPageData | CommentType): d is QuestionPageData => {
		return 'question' in d && d.question !== undefined;
	};
	const shouldOpenComposerInitially = () =>
		parentType === 'question' &&
		!(isQuestionPageData(data) ? data?.flags?.userHasAnswered || false : false);

	// State variables
	let likes = $state<CommentLike[]>([]);
	let subscriptions = $state<Subscription[]>([]);
	let comment = $state('');
	// Give-first: on a question the user has not yet answered, the composer is
	// the main event — open by default instead of hiding it behind a button.
	// Replies and post-answer comments stay collapsed until asked for.
	let commenting = $state(shouldOpenComposerInitially());
	let loading = $state(false);
	let subscriptionLoading = $state(false);
	let shareLoading = $state(false);
	let anonymousComment = $state(false);
	let shortAnswerNudge = $state(false);
	let confirmShortSubmit = $state(false);
	let commentError = $state('');
	let commentStartedTracked = false;
	let reduceMotion = $state(false);
	let voiceBusy = $state(false);
	let textareaElement = $state<HTMLTextAreaElement | null>(null);
	let voiceInsertionRange = { start: 0, end: 0 };
	let replyOptInContext = $state<ReplyOptInContext | null>(null);
	let replyOptInFingerprint = '';
	let replyEmail = $state('');
	let replyOptInLoading = $state(false);
	let replyOptInSucceeded = $state(false);
	let replyOptInMessage = $state('');
	let replyOptInFocusedTracked = false;
	let composerId = $derived(
		parentType === 'question'
			? `question-${questionId}`
			: `comment-${isQuestionPageData(data) ? questionId : data.id}`
	);
	let textareaId = $derived(`comment-box-${composerId}`);
	let nudgeId = $derived(`comment-composer-nudge-${composerId}`);
	let errorId = $derived(`comment-composer-error-${composerId}`);
	let commentButtonId = $derived(`comment-button-${composerId}`);

	const SHORT_ANSWER_THRESHOLD = 100;
	const TEXTAREA_MAX_HEIGHT_PX = 320;
	const REPLY_OPT_IN_DISMISSED_KEY = '9t-reply-opt-in-dismissed';
	const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
	let questionCommentActionLabel = $derived(userHasAnswered ? 'Comment' : 'Add your take');
	let questionCommentActionAria = $derived(
		userHasAnswered ? 'Write a comment' : 'Add your take to reveal the other answers'
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

	// SvelteKit reuses this component on client-side question -> question
	// navigation, so the creation-time composer snapshot goes stale. Re-seed
	// the draft and the give-first open state when the question changes; the
	// early return keeps answered-state flips from clobbering user toggles.
	let seededForQuestionId = $state<number | null>(null);
	$effect(() => {
		if (questionId === seededForQuestionId) return;
		seededForQuestionId = questionId;
		comment = '';
		commentError = '';
		commentStartedTracked = false;
		shortAnswerNudge = false;
		confirmShortSubmit = false;
		commenting = parentType === 'question' && !userHasAnswered;
		shareLoading = false;
		replyOptInContext = null;
		replyOptInFingerprint = '';
		replyEmail = '';
		replyOptInLoading = false;
		replyOptInSucceeded = false;
		replyOptInMessage = '';
		replyOptInFocusedTracked = false;
	});
	let composerKindTitle = $derived(
		`${composerKind.charAt(0).toUpperCase()}${composerKind.slice(1)}`
	);
	let textareaDescribedBy = $derived(
		[shortAnswerNudge ? nudgeId : null, commentError ? errorId : null].filter(Boolean).join(' ') ||
			undefined
	);
	// Update likes and subscription state from data
	$effect(() => {
		likes = isQuestionPageData(data) ? [] : (data as CommentType)?.comment_like || [];
		subscriptions = isQuestionPageData(data) ? data?.question?.subscriptions || [] : [];
	});

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
			notifications.success(`${composerKindTitle} posted`, 3000);
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

	function rememberReplyOptInDismissal() {
		try {
			sessionStorage.setItem(REPLY_OPT_IN_DISMISSED_KEY, '1');
		} catch {
			// The current component state still prevents the tray from reappearing.
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

		replyOptInFingerprint = getCommentFingerprint();
		replyOptInContext = {
			questionId,
			questionUrl,
			commentId,
			surface: 'question_page',
			isFirstCommentEver: true
		};
		replyEmail = '';
		replyOptInMessage = '';
		replyOptInSucceeded = false;
		replyOptInFocusedTracked = false;
		void captureReplyOptInShown(replyOptInContext);
	}

	function focusReplyOptIn() {
		if (!replyOptInContext || replyOptInFocusedTracked) return;
		replyOptInFocusedTracked = true;
		void captureReplyOptInFocused(replyOptInContext);
	}

	function dismissReplyOptIn() {
		if (!replyOptInContext) return;
		void captureReplyOptInDismissed(replyOptInContext);
		rememberReplyOptInDismissal();
		replyOptInContext = null;
		replyEmail = '';
		replyOptInMessage = '';
	}

	function getReplyOptInStatus(result: any): string {
		return (
			result?.data?.replyOptIn?.status ??
			result?.data?.status ??
			result?.replyOptIn?.status ??
			'failed'
		);
	}

	function replyOptInFailureCopy(category: ReplyOptInFailureCategory): string {
		if (category === 'invalid_email') return 'Enter a valid email address.';
		if (category === 'suppressed') return 'That address is unsubscribed, so no email was added.';
		if (category === 'ineligible') return 'This reply reminder is no longer available.';
		return 'Your take is posted, but the email could not be saved. Try again if you’d like.';
	}

	async function submitReplyOptIn() {
		if (!replyOptInContext || replyOptInLoading || replyOptInSucceeded) return;
		const email = replyEmail.trim();
		void captureReplyOptInSubmitted(replyOptInContext);

		if (!EMAIL_PATTERN.test(email) || email.length > 320) {
			replyOptInMessage = replyOptInFailureCopy('invalid_email');
			void captureReplyOptInFailed(replyOptInContext, 'invalid_email');
			return;
		}

		replyOptInLoading = true;
		replyOptInMessage = '';
		try {
			const body = new FormData();
			body.append('comment_id', String(replyOptInContext.commentId));
			body.append('question_id', String(replyOptInContext.questionId));
			body.append('fingerprint', replyOptInFingerprint);
			body.append('email', email);

			const response = await fetch('?/subscribeToCommentReplies', { method: 'POST', body });
			const result = deserialize(await response.text());
			const status = getReplyOptInStatus(result);
			if (status === 'subscribed' || status === 'already_subscribed') {
				replyOptInSucceeded = true;
				replyOptInMessage = 'You’re set. We’ll only email if someone replies to this conversation.';
				void captureReplyOptInSucceeded(replyOptInContext);
				return;
			}

			const category: ReplyOptInFailureCategory =
				status === 'suppressed'
					? 'suppressed'
					: status === 'invalid'
						? 'invalid_email'
						: status === 'ineligible'
							? 'ineligible'
							: 'server_error';
			replyOptInMessage = replyOptInFailureCopy(category);
			void captureReplyOptInFailed(replyOptInContext, category);
		} catch {
			replyOptInMessage = replyOptInFailureCopy('network_error');
			void captureReplyOptInFailed(replyOptInContext, 'network_error');
		} finally {
			replyOptInLoading = false;
		}
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
					title="Share this question"
					class="interaction-toolbar-button"
					variant="secondary"
					size="md"
					onclick={shareQuestionFromToolbar}
					disabled={shareLoading}
					loading={shareLoading}
					aria-label="Share this question"
					aria-busy={shareLoading || undefined}
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
							{:else if composerKind === 'answer'}
								Post answer and reveal
							{:else}
								Post {composerKind}
							{/if}
						</Button>
					</div>
				{/if}
			</div>
		</div>
	{/if}

	{#if replyOptInContext}
		<section
			class="reply-opt-in"
			aria-labelledby="reply-opt-in-heading"
			aria-live="polite"
			in:slide={{ duration: reduceMotion ? 0 : 220 }}
		>
			<div class="reply-opt-in__copy">
				<p class="reply-opt-in__eyebrow">OPTIONAL · THIS CONVERSATION ONLY</p>
				<h3 id="reply-opt-in-heading">Want a note if someone replies?</h3>
				<p>
					Leave an email if you'd like. Your take stays anonymous, and we'll only email about this
					conversation.
				</p>
			</div>

			{#if replyOptInSucceeded}
				<p class="reply-opt-in__status reply-opt-in__status--success" role="status">
					{replyOptInMessage}
				</p>
			{:else}
				<label class="reply-opt-in__label" for="reply-opt-in-email">Email</label>
				<input
					id="reply-opt-in-email"
					class="reply-opt-in__input"
					type="email"
					inputmode="email"
					autocomplete="email"
					placeholder="you@example.com"
					bind:value={replyEmail}
					onfocus={focusReplyOptIn}
					oninput={() => (replyOptInMessage = '')}
					aria-invalid={replyOptInMessage ? 'true' : 'false'}
					aria-describedby={replyOptInMessage ? 'reply-opt-in-status' : undefined}
				/>
				{#if replyOptInMessage}
					<p id="reply-opt-in-status" class="reply-opt-in__status" role="status">
						{replyOptInMessage}
					</p>
				{/if}
				<div class="reply-opt-in__actions">
					<Button
						class="reply-opt-in__button"
						variant="primary"
						size="md"
						type="button"
						onclick={submitReplyOptIn}
						disabled={replyOptInLoading}
						loading={replyOptInLoading}
					>
						Keep me posted
					</Button>
					<Button
						class="reply-opt-in__button"
						variant="ghost"
						size="md"
						type="button"
						onclick={dismissReplyOptIn}
						disabled={replyOptInLoading}
					>
						Not now
					</Button>
				</div>
			{/if}
		</section>
	{/if}
</div>

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

	.reply-opt-in {
		padding: 1rem;
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 22%, var(--stone-edge));
		border-radius: 0.9rem;
		background:
			linear-gradient(135deg, color-mix(in srgb, var(--lamp-soft) 58%, transparent), transparent),
			color-mix(in srgb, var(--stone-warm) 97%, var(--night-deep));
		box-shadow: var(--shadow-sm);
	}

	.reply-opt-in__copy h3 {
		margin: 0.2rem 0 0.35rem;
		color: var(--ink-bright);
		font-size: 1rem;
		font-weight: 650;
	}

	.reply-opt-in__copy p:last-child,
	.reply-opt-in__status {
		margin: 0;
		color: var(--ink-mid);
		font-size: 0.82rem;
		line-height: 1.5;
	}

	.reply-opt-in__eyebrow {
		margin: 0;
		color: var(--lamp-glow);
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.08em;
	}

	.reply-opt-in__label {
		display: block;
		margin-top: 0.8rem;
		color: var(--ink-bright);
		font-size: 0.76rem;
		font-weight: 600;
	}

	.reply-opt-in__input {
		display: block;
		width: 100%;
		margin-top: 0.35rem;
		padding: 0.7rem 0.8rem;
		border: 1px solid var(--stone-edge);
		border-radius: 0.55rem;
		background: color-mix(in srgb, var(--night-deep) 88%, transparent);
		color: var(--ink-bright);
		font: inherit;
		font-size: 16px;
	}

	:global(.reply-opt-in__input:focus-visible) {
		border-color: var(--lamp-glow);
		outline: 2px solid color-mix(in srgb, var(--lamp-glow) 36%, transparent);
		outline-offset: 2px;
	}

	.reply-opt-in__status {
		margin-top: 0.55rem;
		color: var(--error-text);
	}

	.reply-opt-in__status--success {
		padding-top: 0.7rem;
		color: var(--lamp-light);
	}

	.reply-opt-in__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 0.75rem;
	}

	:global(.reply-opt-in__button) {
		flex: 0 1 auto;
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
