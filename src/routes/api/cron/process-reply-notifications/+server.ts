// src/routes/api/cron/process-reply-notifications/+server.ts
import { CRON_SECRET } from '$env/static/private';
import { processReplyNotificationOutbox } from '$lib/server/replyNotificationDelivery';
import { isAuthorizedCronRequest } from '$lib/server/cronAuth';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

async function handleReplyNotificationCron(request: Request) {
	if (!isAuthorizedCronRequest(request.headers.get('authorization'), [CRON_SECRET])) {
		throw error(401, 'Unauthorized');
	}

	try {
		const summary = await processReplyNotificationOutbox(10);
		console.info('Processed reply notification cron run', summary);
		return json({ processed: summary.claimed, ...summary });
	} catch (processingError) {
		console.error('Failed to process reply notifications', processingError);
		throw error(500, 'Failed to process reply notifications');
	}
}

export const GET: RequestHandler = async ({ request }) => handleReplyNotificationCron(request);
export const POST: RequestHandler = async ({ request }) => handleReplyNotificationCron(request);
