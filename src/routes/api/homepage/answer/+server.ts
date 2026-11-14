// src/routes/api/homepage/answer/+server.ts
// POST /api/homepage/answer — the live-take homepage's "Post anonymously and read
// them". It posts the visitor's answer as a real take on the homepage's live
// question through postLiveTake (the question page's own schema, rate limit,
// give-first access rule and create_comment_atomic insert), then returns the
// answers the give-first gate now unlocks for this visitor.
//
// Request:  { slug: string, comment: string, fingerprint?: string }
//           The 9tfingerprint cookie wins over the body fingerprint, so the take
//           unlocks /questions/<slug> for the same visitor.
// Response: LiveTakePostResult (200), or { error } with 400 / 404 / 409 / 429 / 500.
import { json } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';

import { LIVE_TAKE_SLUG } from '$lib/data/homepageLiveTake';
import { postLiveTake } from '$lib/server/liveTakeAnswer';

// The homepage attributes every take it posts to `/`.
const HOMEPAGE_PATH = '/';

const requestSchema = z.object({
	slug: z
		.string()
		.trim()
		.min(1)
		.max(160)
		.regex(/^[a-z0-9-]+$/i),
	// Length and emptiness are checked by the question page's createCommentSchema below.
	comment: z.string(),
	fingerprint: z.string().trim().max(100).optional()
});

function errorResponse(status: number, message: string) {
	return json({ error: message }, { status });
}

export const POST: RequestHandler = async (event) => {
	const { request } = event;

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return errorResponse(400, 'Invalid request');
	}
	const parsed = requestSchema.safeParse(body);
	if (!parsed.success) return errorResponse(400, 'Invalid request');

	// Homepage-only: the take is attributed to `/`, so only the live question is accepted.
	if (parsed.data.slug !== LIVE_TAKE_SLUG) {
		return errorResponse(404, 'This question isn’t on the homepage.');
	}

	const outcome = await postLiveTake(event, {
		slug: parsed.data.slug,
		comment: parsed.data.comment,
		fingerprint: parsed.data.fingerprint,
		path: HOMEPAGE_PATH,
		pausedMessage: 'Posting from the homepage is paused right now.',
		missingMessage: 'This question is no longer open.'
	});
	if (!outcome.ok) return errorResponse(outcome.status, outcome.error);
	return json(outcome.result);
};
