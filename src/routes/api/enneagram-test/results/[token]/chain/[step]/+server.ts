// src/routes/api/enneagram-test/results/[token]/chain/[step]/+server.ts
//
// GET: the next card in a result's answer chain ("Next question" on the result
// page). Steps after the current one are loaded only when the person asks for
// them, so gate_shown is recorded for questions they actually saw.
//
// The result token is the credential. A question this result already answered
// opens unlocked as its author (the follow), so the result link works on any
// device; anything else goes through the visitor's cookie and the give-first gate.
//
// Response: { step, question, answeredAs, live, types } (200), or { error } with 404 / 503.
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import { isResultToken } from '$lib/server/enneagramTest';
import {
	getChainQuestions,
	getFollows,
	getResultIdentity,
	loadChainStep
} from '$lib/server/enneagramTestChain';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';
import { logger } from '$lib/utils/logger';

const NO_STORE = { 'Cache-Control': 'private, no-store' };

function errorResponse(status: number, message: string) {
	return json({ error: message }, { status, headers: NO_STORE });
}

export const GET: RequestHandler = async (event) => {
	const { params } = event;
	if (!isResultToken(params.token)) return errorResponse(404, 'Result not found.');
	const index = Number(params.step);
	if (!Number.isInteger(index) || index < 0) return errorResponse(404, 'No such question.');

	const db = getSupabaseAdminClient();
	let identity;
	try {
		identity = await getResultIdentity(db, params.token);
	} catch (loadError) {
		logger.error('Failed to load Enneagram test result for a chain step', loadError as Error);
		return errorResponse(503, 'We couldn’t load the next question. Try again.');
	}
	if (!identity?.types.length) return errorResponse(404, 'Result not found.');

	const chain = await getChainQuestions(db, identity.types);
	const question = chain[index];
	if (!question) return errorResponse(404, 'No such question.');

	const follows = await getFollows(db, identity.id);
	const follow =
		question.id === null ? undefined : follows.find((row) => row.question_id === question.id);
	const { live, types } = await loadChainStep(event, question, follow);
	if (!live) return errorResponse(503, 'We couldn’t load the next question. Try again.');

	return json(
		{
			step: index,
			question: question.question,
			answeredAs: question.answeredAs,
			live,
			types
		},
		{ headers: NO_STORE }
	);
};
