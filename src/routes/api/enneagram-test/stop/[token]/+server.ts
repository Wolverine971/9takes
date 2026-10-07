// src/routes/api/enneagram-test/stop/[token]/+server.ts
//
// "Stop these emails" link in the friend-read email. Clears the opt-in email
// and sends the person back to their result page with a confirmation.
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { isResultToken, stopTestNotifications } from '$lib/server/enneagramTest';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';
import { logger } from '$lib/utils/logger';

export const GET: RequestHandler = async ({ params }) => {
	if (!isResultToken(params.token)) redirect(303, '/enneagram-test');

	let found = false;
	try {
		found = await stopTestNotifications(getSupabaseAdminClient(), params.token);
	} catch (error) {
		logger.error('Failed to stop Enneagram test emails', error as Error);
	}
	if (!found) redirect(303, '/enneagram-test');
	redirect(303, `/enneagram-test/result/${encodeURIComponent(params.token)}?emails=stopped`);
};
