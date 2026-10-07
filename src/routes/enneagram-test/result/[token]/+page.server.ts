// src/routes/enneagram-test/result/[token]/+page.server.ts
//
// A test-taker's private Enneagram test result (T-42). The token in the URL is
// the only key, so the page is never cached or indexed. Loads the picks, the
// friend reads so far, the friend-link token, and one live question per type
// for the "answer a question as your type" exit.
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getQuestionsForTypes, getTestResult, isResultToken } from '$lib/server/enneagramTest';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';
import { logger } from '$lib/utils/logger';

export const load: PageServerLoad = async ({ params, setHeaders, url }) => {
	setHeaders({ 'cache-control': 'private, no-store', 'x-robots-tag': 'noindex, nofollow' });
	if (!isResultToken(params.token)) error(404, 'Result not found');

	const db = getSupabaseAdminClient();
	let result;
	try {
		result = await getTestResult(db, params.token);
	} catch (loadError) {
		logger.error('Failed to load Enneagram test result', loadError as Error);
		error(503, 'We couldn’t load this result. Please try again.');
	}
	if (!result) error(404, 'Result not found');

	return {
		resultToken: params.token,
		result,
		questions: await getQuestionsForTypes(db, result.types),
		emailsStopped: url.searchParams.get('emails') === 'stopped'
	};
};
