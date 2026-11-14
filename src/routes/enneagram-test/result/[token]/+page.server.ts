// src/routes/enneagram-test/result/[token]/+page.server.ts
//
// A test-taker's private Enneagram test result (T-42). The token in the URL is
// the only key, so the page is never cached or indexed. Loads the picks, the
// friend reads so far, the friend-link token, one live question per type, and
// the answer-first card for the first of those questions so the test-taker can
// answer "as their type" without leaving the page.
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
	TEST_RESULT_GATE_PATH,
	getQuestionsForTypes,
	getTestResult,
	isResultToken
} from '$lib/server/enneagramTest';
import { loadLiveTake } from '$lib/server/homepageLiveTake';
import { getLiveTakeTypes } from '$lib/server/homepageLiveTypes';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';
import { logger } from '$lib/utils/logger';

/** The signed-in viewer's saved type, so the page can offer to save a new one. */
async function loadProfileType(locals: App.Locals): Promise<number | null> {
	const userId = locals.session?.user?.id;
	if (!userId) return null;
	try {
		const { data } = await locals.supabase
			.from('profiles')
			.select('enneagram')
			.eq('id', userId)
			.maybeSingle();
		const type = Number(data?.enneagram);
		return Number.isInteger(type) && type >= 1 && type <= 9 ? type : null;
	} catch {
		return null;
	}
}

export const load: PageServerLoad = async (event) => {
	const { params, setHeaders, url, locals } = event;
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

	const [questions, profileType] = await Promise.all([
		getQuestionsForTypes(db, result.types),
		loadProfileType(locals)
	]);

	// One answer-first card: the question offered for the first type that has one.
	const answerType = result.types.find((type) => questions[type]) ?? null;
	const slug = answerType === null ? null : (questions[answerType]?.url ?? null);
	const live = slug ? await loadLiveTake(event, { slug, gatePath: TEST_RESULT_GATE_PATH }) : null;
	const liveTypes = live ? await getLiveTakeTypes(live.questionId) : null;

	return {
		resultToken: params.token,
		result,
		questions,
		answerType: live ? answerType : null,
		live,
		liveTypes,
		viewer: { signedIn: Boolean(locals.session?.user?.id), profileType },
		emailsStopped: url.searchParams.get('emails') === 'stopped'
	};
};
