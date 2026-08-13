// src/lib/analytics/replyNotificationReturnEvents.ts
import { capture } from '$lib/analytics/posthog';
import type { ReplyNotificationReturnContext } from '$lib/types/questions';

type ReturnEventName =
	'reply_notification_landed' | 'reply_target_visible' | 'reply_notification_return_action';

function safeProperties(context: ReplyNotificationReturnContext) {
	return {
		outbox_id: context.outboxId,
		subscription_id: context.subscriptionId,
		question_id: context.questionId,
		comment_id: context.commentId,
		target_comment_id: context.replyCommentId,
		target_exists: context.targetStatus === 'available',
		subscription_status: context.subscriptionStatus
	};
}

export function captureReplyNotificationReturnEvent(
	event: ReturnEventName,
	context: ReplyNotificationReturnContext,
	properties: { revisit?: boolean; action_type?: 'read_discussion' } = {}
) {
	return capture(event, { ...safeProperties(context), ...properties });
}
