// src/routes/api/cron/process-sequences/+server.ts
import { CRON_SECRET } from '$env/static/private';
import { processPendingSequenceSends } from '$lib/server/emailSequences';
import { isAuthorizedCronRequest } from '$lib/server/cronAuth';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { loadEmailDeliveryHealth } from '$lib/server/emailDeliveryHealth';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';

async function handleSequenceCron(request: Request) {
	const authHeader = request.headers.get('authorization');

	if (!isAuthorizedCronRequest(authHeader, [CRON_SECRET])) {
		throw error(401, 'Unauthorized');
	}

	try {
		const delivery = await loadEmailDeliveryHealth(getSupabaseAdminClient());
		if (!delivery.configured) {
			console.error('Email sequence delivery blocked by configuration', delivery);
			return json(
				{ message: 'Email delivery needs configuration', processed: 0, delivery },
				{ status: 503 }
			);
		}
		const summary = await processPendingSequenceSends(10);
		const currentDelivery = await loadEmailDeliveryHealth(getSupabaseAdminClient());
		if (currentDelivery.stoppedEnrollments > 0) {
			console.error('Active email sequences have stopped enrollments', currentDelivery);
		}
		console.info('Processed email sequence cron run', summary);
		return json(
			{
				message:
					summary.claimed === 0
						? 'No sequence emails to process'
						: `Processed ${summary.claimed} sequence enrollment${summary.claimed === 1 ? '' : 's'}`,
				processed: summary.claimed,
				sent: summary.sent,
				skipped: summary.skipped,
				errors: summary.errors,
				delivery: currentDelivery
			},
			{ status: summary.errors > 0 || currentDelivery.stoppedEnrollments > 0 ? 500 : 200 }
		);
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
