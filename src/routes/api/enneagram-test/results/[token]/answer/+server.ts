// src/routes/api/enneagram-test/results/[token]/answer/+server.ts
//
// POST: a test-taker answers a question "as their type" without leaving the
// result page. The take is a real take on that question (postLiveTake: the
// question page's own schema, rate limit, give-first gate and insert), and the
// response carries the answers the gate now unlocks.
//
// The result token is the credential, and only a question this result's page
// actually shows is accepted. The type the person picked is saved with the take
// in nine_user_takes (self_reported_type); the public take itself stays
// anonymous unless they are signed in.
//
// Request:  { slug: string, comment: string, fingerprint?: string }
// Response: LiveTakePostResult (200), or { error } with 400 / 404 / 409 / 429 / 500.
import { json } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';

import {
	TEST_RESULT_GATE_PATH,
	getQuestionsForTypes,
	getTestResultTypes,
	isResultToken
} from '$lib/server/enneagramTest';
import { postLiveTake } from '$lib/server/liveTakeAnswer';
import { recordUserTake } from '$lib/server/nineTakes';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';
import { logger } from '$lib/utils/logger';

const NO_STORE = { 'Cache-Control': 'private, no-store' };

const requestSchema = z.object({
	slug: z
		.string()
		.trim()
		.min(1)
		.max(160)
		.regex(/^[a-z0-9-]+$/i),
	// Length and emptiness are checked by the question page's createCommentSchema.
	comment: z.string(),
	fingerprint: z.string().trim().max(100).optional()
});

function errorResponse(status: number, message: string) {
	return json({ error: message }, { status, headers: NO_STORE });
}

export const POST: RequestHandler = async (event) => {
	const { params, request, locals } = event;
	if (!isResultToken(params.token)) return errorResponse(404, 'Result not found.');

	const parsed = requestSchema.safeParse(await request.json().catch(() => null));
	if (!parsed.success) return errorResponse(400, 'Invalid request');

	const db = getSupabaseAdminClient();
	let types;
	try {
		types = await getTestResultTypes(db, params.token);
	} catch (loadError) {
		logger.error('Failed to load Enneagram test result for an answer', loadError as Error);
		return errorResponse(503, 'We couldn’t post your take. It’s still here, so try again.');
	}
	if (!types?.length) return errorResponse(404, 'Result not found.');

	// Only a question this result page shows. The match also says which of the
	// person's types the question was offered for.
	const questions = await getQuestionsForTypes(db, types);
	const answeredAs = types.find((type) => questions[type]?.url === parsed.data.slug);
	if (answeredAs === undefined) return errorResponse(404, 'This question isn’t on your result.');

	const outcome = await postLiveTake(event, {
		slug: parsed.data.slug,
		comment: parsed.data.comment,
		fingerprint: parsed.data.fingerprint,
		path: TEST_RESULT_GATE_PATH,
		pausedMessage: 'Posting is paused right now.',
		missingMessage: 'This question is no longer open.'
	});
	if (!outcome.ok) return errorResponse(outcome.status, outcome.error);

	if (outcome.created) {
		// Typed corpus capture: the one place an anonymous take keeps the type its
		// author picked for themselves. Best effort by construction.
		await recordUserTake({
			subjectType: 'question',
			subjectSlug: parsed.data.slug,
			take: outcome.result.ownTake?.text ?? parsed.data.comment.trim(),
			resonantType: null,
			fingerprint: outcome.fingerprint,
			userId: locals.session?.user?.id ?? null,
			selfReportedType: answeredAs
		});
	}

	return json(outcome.result, { headers: NO_STORE });
};
