// src/lib/analytics/replyOptInEvents.ts
import { capture } from '$lib/analytics/posthog';

export type ReplyOptInSurface = 'question_page';
export type ReplyOptInFailureCategory =
	'invalid_email' | 'suppressed' | 'ineligible' | 'network_error' | 'server_error';

export type ReplyOptInContext = {
	questionId: number;
	questionUrl: string;
	commentId: number;
	surface: ReplyOptInSurface;
	isFirstCommentEver: true;
};

type ReplyOptInEventName =
	| 'reply_opt_in_shown'
	| 'reply_opt_in_focused'
	| 'reply_opt_in_submitted'
	| 'reply_opt_in_succeeded'
	| 'reply_opt_in_dismissed'
	| 'reply_opt_in_failed';

function captureReplyOptInEvent(
	event: ReplyOptInEventName,
	context: ReplyOptInContext,
	failureCategory?: ReplyOptInFailureCategory
): Promise<void> {
	return capture(event, {
		question_id: context.questionId,
		question_url: context.questionUrl,
		comment_id: context.commentId,
		surface: context.surface,
		is_first_comment_ever: context.isFirstCommentEver,
		...(failureCategory ? { failure_category: failureCategory } : {})
	});
}

export function captureReplyOptInShown(context: ReplyOptInContext): Promise<void> {
	return captureReplyOptInEvent('reply_opt_in_shown', context);
}

export function captureReplyOptInFocused(context: ReplyOptInContext): Promise<void> {
	return captureReplyOptInEvent('reply_opt_in_focused', context);
}

export function captureReplyOptInSubmitted(context: ReplyOptInContext): Promise<void> {
	return captureReplyOptInEvent('reply_opt_in_submitted', context);
}

export function captureReplyOptInSucceeded(context: ReplyOptInContext): Promise<void> {
	return captureReplyOptInEvent('reply_opt_in_succeeded', context);
}

export function captureReplyOptInDismissed(context: ReplyOptInContext): Promise<void> {
	return captureReplyOptInEvent('reply_opt_in_dismissed', context);
}

export function captureReplyOptInFailed(
	context: ReplyOptInContext,
	failureCategory: ReplyOptInFailureCategory
): Promise<void> {
	return captureReplyOptInEvent('reply_opt_in_failed', context, failureCategory);
}
