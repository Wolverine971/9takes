// src/routes/api/questions/next/+server.ts
//
// GET /api/questions/next?after=<slug>&skip=<slug,slug>
// The next question this visitor hasn't answered, for the "Answer the next one"
// step after a reveal (src/lib/components/questions/AnswerNext.svelte). Returns
// only the question (no takes, no gate event): the card itself loads from
// /api/questions/live/<slug> when the visitor opens it.
//
// Response: { next: { url, title, responses } | null } (200), or { error } 503.
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import { parseQuestionSlug, parseSkipList } from '$lib/server/answerNextRequest';
import { readVisitorFingerprint } from '$lib/server/homepageLiveTake';
import { pickNextQuestion } from '$lib/server/nextQuestion';
import { logger } from '$lib/utils/logger';

const NO_STORE = { 'Cache-Control': 'private, no-store' };

export const GET: RequestHandler = async ({ url, cookies, locals }) => {
	try {
		const next = await pickNextQuestion(locals.supabase, {
			afterSlug: parseQuestionSlug(url.searchParams.get('after')),
			skip: parseSkipList(url.searchParams.get('skip')),
			viewer: {
				fingerprint: readVisitorFingerprint(cookies),
				userId: locals.session?.user?.id ?? null
			}
		});
		return json({ next }, { headers: NO_STORE });
	} catch (pickError) {
		logger.warn('Next question unavailable', { error: String(pickError) });
		return json(
			{ error: 'We couldn’t find another question right now.' },
			{ status: 503, headers: NO_STORE }
		);
	}
};
