// src/routes/api/cron/process-sequences/+server.ts
import { PRIVATE_CRON_SECRET } from '$env/static/private';
import { env } from '$env/dynamic/private';
import { processPendingSequenceSends } from '$lib/server/emailSequences';
import { isAuthorizedCronRequest } from '$lib/server/cronAuth';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

async function handleSequenceCron(request: Request) {
	const authHeader = request.headers.get('authorization');

	if (!isAuthorizedCronRequest(authHeader, [env.CRON_SECRET, PRIVATE_CRON_SECRET])) {
		throw error(401, 'Unauthorized');
	}

	try {
		const summary = await processPendingSequenceSends(10);
		console.info('Processed email sequence cron run', summary);
		return json({
			message:
				summary.claimed === 0
					? 'No sequence emails to process'
					: `Processed ${summary.claimed} sequence enrollment${summary.claimed === 1 ? '' : 's'}`,
			processed: summary.claimed,
			sent: summary.sent,
			skipped: summary.skipped,
			errors: summary.errors
		});
	} catch (processingError) {
		console.error('Error processing email sequences:', processingError);
		throw error(500, 'Failed to process email sequences');
	}
}

export const GET: RequestHandler = async ({ request }) => {
	return handleSequenceCron(request);
};

export const POST: RequestHandler = async ({ request }) => {
	return handleSequenceCron(request);
};
