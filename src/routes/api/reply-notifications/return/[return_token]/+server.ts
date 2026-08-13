// src/routes/api/reply-notifications/return/[return_token]/+server.ts
import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';
import { isUuid } from '$lib/utils/uuid';
import {
	REPLY_RETURN_COOKIE,
	REPLY_RETURN_COOKIE_PATH,
	REPLY_RETURN_MAX_AGE_SECONDS,
	signReplyNotificationReturn,
	type ReplyNotificationReturnContext
} from '$lib/server/replyNotificationReturn';

const HOME_URL = 'https://9takes.com';

function parseContext(
	value: any
): (ReplyNotificationReturnContext & { questionUrl: string }) | null {
	if (
		!value?.question_url ||
		!Number.isSafeInteger(Number(value.outbox_id)) ||
		!Number.isSafeInteger(Number(value.subscription_id)) ||
		!Number.isSafeInteger(Number(value.question_id)) ||
		!Number.isSafeInteger(Number(value.comment_id)) ||
		!Number.isSafeInteger(Number(value.reply_comment_id)) ||
		(value.target_status !== 'available' && value.target_status !== 'removed') ||
		(value.subscription_status !== 'active' && value.subscription_status !== 'stopped')
	) {
		return null;
	}

	return {
		outboxId: Number(value.outbox_id),
		subscriptionId: Number(value.subscription_id),
		questionId: Number(value.question_id),
		commentId: Number(value.comment_id),
		replyCommentId: Number(value.reply_comment_id),
		targetStatus: value.target_status,
		subscriptionStatus: value.subscription_status,
		questionUrl: String(value.question_url)
	};
}

export const GET: RequestHandler = async ({ params, locals, cookies }) => {
	if (!isUuid(params.return_token)) redirect(303, HOME_URL);

	const { data, error } = await (locals.supabase as any).rpc(
		'get_reply_notification_return_context',
		{ p_return_token: params.return_token }
	);
	const parsed = error ? null : parseContext(data);
	if (!parsed) redirect(303, HOME_URL);

	const { questionUrl, ...context } = parsed;
	cookies.set(REPLY_RETURN_COOKIE, signReplyNotificationReturn(context), {
		path: REPLY_RETURN_COOKIE_PATH,
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		maxAge: REPLY_RETURN_MAX_AGE_SECONDS
	});

	redirect(303, `/questions/${encodeURIComponent(questionUrl)}#reply-notification-target`);
};
