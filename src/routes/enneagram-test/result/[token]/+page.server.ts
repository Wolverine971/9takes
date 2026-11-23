// src/routes/enneagram-test/result/[token]/+page.server.ts
//
// A test-taker's private Enneagram test result (T-42). The token in the URL is
// the only key, so the page is never cached or indexed. Loads the picks, the
// friend reads so far, the friend-link token, and the answer chain: up to three
// questions answered "as their type" without leaving the page. Questions this
// result already answered open unlocked (on any device); the first unanswered
// one is ready to answer; later ones load when the person asks for the next.
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getTestResult, isResultToken } from '$lib/server/enneagramTest';
import {
	getChainQuestions,
	getFollows,
	getResultIdentity,
	loadChainView
} from '$lib/server/enneagramTestChain';
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

	const [questions, identity, profileType] = await Promise.all([
		getChainQuestions(db, result.types),
		getResultIdentity(db, params.token).catch(() => null),
		loadProfileType(locals)
	]);
	const follows = identity ? await getFollows(db, identity.id) : [];
	const chain = await loadChainView(event, questions, follows);

	return {
		resultToken: params.token,
		result,
		chain,
		viewer: { signedIn: Boolean(locals.session?.user?.id), profileType },
		emailsStopped: url.searchParams.get('emails') === 'stopped'
	};
};
