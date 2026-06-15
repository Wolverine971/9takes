// src/routes/api/nine/mirror/+server.ts
//
// The "mirror": a reader answers the evergreen question (give-first). We reflect
// the emotional logic back, return the nine takes, AND record their answer as a
// real comment on the backing question (via the same create_comment_atomic RPC
// the questions page uses) so it lives on /questions/[slug] and unlocks the gate.

import { json, error } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';
import { getChorus, generateMirror, recordUserTake } from '$lib/server/nineTakes';
import { logger } from '$lib/utils/logger';

const requestSchema = z.object({
	subjectType: z.literal('personality-analysis'),
	slug: z
		.string()
		.min(1)
		.max(160)
		.regex(/^[a-z0-9-]+$/i, 'invalid slug'),
	take: z.string().trim().min(8, 'Say a little more').max(2000)
});

// Lightweight in-memory throttle: one mirror every few seconds per fingerprint.
const lastCallAt = new Map<string, number>();
const MIN_INTERVAL_MS = 3000;

export const POST: RequestHandler = async ({ request, locals, cookies, getClientAddress }) => {
	let payload: z.infer<typeof requestSchema>;
	try {
		payload = requestSchema.parse(await request.json());
	} catch (e) {
		if (e instanceof z.ZodError) {
			return json({ error: e.errors[0]?.message ?? 'Invalid request' }, { status: 400 });
		}
		throw error(400, 'Invalid request');
	}

	const { subjectType, slug, take } = payload;

	const fingerprint = cookies.get('9tfingerprint') ?? null;
	const userId = locals.session?.user?.id ?? null;
	const throttleKey = fingerprint || userId || getClientAddress();

	const now = Date.now();
	if (now - (lastCallAt.get(throttleKey) ?? 0) < MIN_INTERVAL_MS) {
		return json({ error: 'One breath between takes, please.' }, { status: 429 });
	}
	lastCallAt.set(throttleKey, now);

	try {
		const chorus = await getChorus(slug);
		if (!chorus) {
			throw error(409, 'This chorus is not ready yet');
		}

		const mirror = await generateMirror(chorus.question, take);

		// Typed corpus capture (carries the resonant type). Best-effort.
		await recordUserTake({
			subjectType,
			subjectSlug: slug,
			take,
			resonantType: mirror.resonantType,
			fingerprint,
			userId
		});

		// Record the answer as a real comment on the backing question, using the
		// reader's own client so give-first identity rules apply. Best-effort:
		// duplicate answers (one-per-fingerprint) are expected and ignored.
		if (chorus.questionId && (fingerprint || userId)) {
			try {
				await (locals.supabase.rpc as any)('create_comment_atomic', {
					p_comment: take,
					p_parent_id: chorus.questionId,
					p_author_id: userId,
					p_parent_type: 'question',
					p_fingerprint: fingerprint,
					p_ip: getClientAddress()
				});
			} catch (commentErr) {
				logger.warn('Chorus answer not recorded as comment', { error: String(commentErr) });
			}
		}

		return json({ ...mirror, takes: chorus.takes, questionUrl: chorus.questionUrl });
	} catch (e) {
		if ((e as any)?.status) throw e;
		logger.error('Error in POST /api/nine/mirror', e as Error);
		throw error(500, 'The mirror clouded over');
	}
};
