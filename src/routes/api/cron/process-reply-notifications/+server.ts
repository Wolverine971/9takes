// src/routes/api/cron/process-reply-notifications/+server.ts
import { CRON_SECRET } from '$env/static/private';
import { processAccountReplyNotificationEmails } from '$lib/server/accountReplyNotificationEmail';
import { processReplyNotificationOutbox } from '$lib/server/replyNotificationDelivery';
import { isAuthorizedCronRequest } from '$lib/server/cronAuth';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

async function handleReplyNotificationCron(request: Request) {
	if (!isAuthorizedCronRequest(request.headers.get('authorization'), [CRON_SECRET])) {
		throw error(401, 'Unauthorized');
	}

	try {
		// Anonymous give-first subscribers (comment_reply_subscriptions outbox).
		const summary = await processReplyNotificationOutbox(10);
		// Logged-in recipients (notifications rows with kind = 'reply_to_take').
		// Reports a claim failure in its summary rather than throwing, so a
		// missing migration cannot take the anonymous leg down with it.
		const account = await processAccountReplyNotificationEmails({ limit: 10 });
		console.info('Processed reply notification cron run', { ...summary, account });
		return json({ processed: summary.claimed, ...summary, account });
	} catch (processingError) {
		console.error('Failed to process reply notifications', processingError);
		throw error(500, 'Failed to process reply notifications');
	}
}

export const GET: RequestHandler = async ({ request }) => handleReplyNotificationCron(request);
export const POST: RequestHandler = async ({ request }) => handleReplyNotificationCron(request);
