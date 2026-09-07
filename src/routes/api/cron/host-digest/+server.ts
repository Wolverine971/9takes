// src/routes/api/cron/host-digest/+server.ts
//
// Daily host digest: every new human take from the last day, two drafted
// replies each, one email to the host. Scheduled in vercel.json at 13:00 UTC
// (9am ET). Sends at most one email per run and never posts a comment.
import { CRON_SECRET } from '$env/static/private';
import { runHostDigest } from '$lib/server/hostDigest';
import { isAuthorizedCronRequest } from '$lib/server/cronAuth';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

async function handleHostDigestCron(request: Request) {
	if (!isAuthorizedCronRequest(request.headers.get('authorization'), [CRON_SECRET])) {
		throw error(401, 'Unauthorized');
	}

	try {
		const summary = await runHostDigest();
		console.info('Processed host digest cron run', summary);
		return json(summary);
	} catch (processingError) {
		console.error('Failed to run host digest', processingError);
		throw error(500, 'Failed to run host digest');
	}
}

export const GET: RequestHandler = async ({ request }) => handleHostDigestCron(request);
export const POST: RequestHandler = async ({ request }) => handleHostDigestCron(request);
