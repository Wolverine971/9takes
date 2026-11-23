// src/routes/api/cron/test-take-digest/+server.ts
//
// Cron (daily): the Enneagram test "new takes on questions you answered" email.
// One email per test result that has an opt-in address and something new since
// the last one: takes after theirs on a question they answered from the result
// page, and replies to their take. See processTakeDigests.
import { CRON_SECRET } from '$env/static/private';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import { isAuthorizedCronRequest } from '$lib/server/cronAuth';
import { processTakeDigests } from '$lib/server/enneagramTestChain';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';

export const config = {
	maxDuration: 300
};

async function handle(request: Request) {
	if (!isAuthorizedCronRequest(request.headers.get('authorization'), [CRON_SECRET])) {
		throw error(401, 'Unauthorized');
	}
	try {
		const summary = await processTakeDigests(getSupabaseAdminClient());
		console.info('Processed Enneagram test take digests', summary);
		return json(summary);
	} catch (processingError) {
		console.error('Failed to process Enneagram test take digests', processingError);
		throw error(500, 'Failed to process take digests');
	}
}

export const GET: RequestHandler = async ({ request }) => handle(request);
export const POST: RequestHandler = async ({ request }) => handle(request);
