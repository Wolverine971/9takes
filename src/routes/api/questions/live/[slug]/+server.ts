// src/routes/api/questions/live/[slug]/+server.ts
//
// The answer-first card for any open question, embedded after a reveal by
// "Answer the next one" (src/lib/components/questions/AnswerNext.svelte).
//
// GET  ?from=<page path>   The card (LiveTake + type mix). A visitor who hasn't
//                          answered gets the locked card and a gate_shown event
//                          attributed to `from`, the page they are reading.
// POST ?from=<page path>   Posts their take through postLiveTake: the question
//                          page's schema, rate limit, give-first rule and atomic
//                          insert. Body { slug, comment, fingerprint? }, the same
//                          shape LiveQuestionCard sends to every endpoint.
//
// Responses: GET { live, types } | POST LiveTakePostResult (200), or { error }.
import { json } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';

import { parseQuestionSlug, parseSourcePath } from '$lib/server/answerNextRequest';
import { loadLiveTake } from '$lib/server/homepageLiveTake';
import { getLiveTakeTypes } from '$lib/server/homepageLiveTypes';
import { postLiveTake } from '$lib/server/liveTakeAnswer';

const NO_STORE = { 'Cache-Control': 'private, no-store' };

const postSchema = z.object({
	slug: z.string(),
	// Length and emptiness are checked by the question page's createCommentSchema.
	comment: z.string(),
	fingerprint: z.string().trim().max(100).optional()
});

function errorResponse(status: number, message: string) {
	return json({ error: message }, { status, headers: NO_STORE });
}

export const GET: RequestHandler = async (event) => {
	const slug = parseQuestionSlug(event.params.slug);
	if (!slug) return errorResponse(404, 'No such question.');

	const live = await loadLiveTake(event, {
		slug,
		gatePath: parseSourcePath(event.url.searchParams.get('from'))
	});
	if (!live) return errorResponse(404, 'This question isn’t open right now.');

	const types = await getLiveTakeTypes(live.questionId).catch(() => null);
	return json({ live, types }, { headers: NO_STORE });
};

export const POST: RequestHandler = async (event) => {
	const slug = parseQuestionSlug(event.params.slug);
	if (!slug) return errorResponse(404, 'No such question.');

	let body: unknown;
	try {
		body = await event.request.json();
	} catch {
		return errorResponse(400, 'Invalid request');
	}
	const parsed = postSchema.safeParse(body);
	// The card posts the slug it shows; it must be this route's question.
	if (!parsed.success || parsed.data.slug.trim() !== slug) {
		return errorResponse(400, 'Invalid request');
	}

	const outcome = await postLiveTake(event, {
		slug,
		comment: parsed.data.comment,
		fingerprint: parsed.data.fingerprint,
		path: parseSourcePath(event.url.searchParams.get('from')),
		pausedMessage: 'Posting is paused right now.',
		missingMessage: 'This question is no longer open.'
	});
	if (!outcome.ok) return errorResponse(outcome.status, outcome.error);
	return json(outcome.result, { headers: NO_STORE });
};
