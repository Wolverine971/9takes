// src/routes/api/nine/mirror/+server.ts
//
// The "mirror": a reader answers the evergreen question (give-first). We reflect
// the emotional logic back, return the nine takes, AND record their answer as a
// real comment on the backing question (via the same create_comment_atomic RPC
// the questions page uses) so it lives on /questions/[slug] and unlocks the gate.
//
// Two subject shapes:
//   personality-analysis -> chorus keyed by blogs_famous_people person slug
//   question             -> chorus keyed directly by the questions.url slug
//                           (the blog-embedded StrategicQuestion widget)

import { json, error } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';
import {
	getChorus,
	getChorusForQuestion,
	generateMirror,
	recordUserTake
} from '$lib/server/nineTakes';
import { recordGiveFirstEvent } from '$lib/server/giveFirstFunnel';
import { logger } from '$lib/utils/logger';

const takeSchema = z.string().trim().min(8, 'Say a little more').max(2000);
// Same-site path of the page hosting the widget, for funnel attribution.
const sourcePathSchema = z
	.string()
	.max(300)
	.regex(/^\/[a-zA-Z0-9\-_/]*$/, 'invalid path')
	.optional();

const requestSchema = z.discriminatedUnion('subjectType', [
	z.object({
		subjectType: z.literal('personality-analysis'),
		slug: z
			.string()
			.min(1)
			.max(160)
			.regex(/^[a-z0-9-]+$/i, 'invalid slug'),
		take: takeSchema,
		sourcePath: sourcePathSchema
	}),
	z.object({
		subjectType: z.literal('question'),
		questionUrl: z
			.string()
			.min(1)
			.max(160)
			.regex(/^[a-z0-9-]+$/i, 'invalid slug'),
		take: takeSchema,
		sourcePath: sourcePathSchema
	})
]);

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

	const { subjectType, take } = payload;
	const subjectSlug = payload.subjectType === 'question' ? payload.questionUrl : payload.slug;

	const fingerprint = cookies.get('9tfingerprint') ?? null;
	const userId = locals.session?.user?.id ?? null;
	const throttleKey = fingerprint || userId || getClientAddress();

	const now = Date.now();
	if (now - (lastCallAt.get(throttleKey) ?? 0) < MIN_INTERVAL_MS) {
		return json({ error: 'One breath between takes, please.' }, { status: 429 });
	}
	lastCallAt.set(throttleKey, now);

	try {
		const chorus =
			payload.subjectType === 'question'
				? await getChorusForQuestion(payload.questionUrl)
				: await getChorus(payload.slug);
		if (!chorus) {
			throw error(409, 'This chorus is not ready yet');
		}

		const mirror = await generateMirror(chorus.question, take);
		let answerRecorded = false;

		// Typed corpus capture (carries the resonant type). Best-effort.
		await recordUserTake({
			subjectType,
			subjectSlug,
			take,
			resonantType: mirror.resonantType,
			fingerprint,
			userId
		});

		// Record the answer as a real comment on the backing question, using the
		// reader's own client so give-first identity rules apply. Best-effort:
		// a duplicate (one-per-fingerprint) means the reader already answered and
		// is already unlocked, so it counts as success and they get the reveal.
		let alreadyAnswered = false;
		if (chorus.questionId && (fingerprint || userId)) {
			try {
				const { error: commentError } = await (locals.supabase.rpc as any)(
					'create_comment_atomic',
					{
						p_comment: take,
						p_parent_id: chorus.questionId,
						p_author_id: userId,
						p_parent_type: 'question',
						p_fingerprint: fingerprint,
						p_ip: getClientAddress()
					}
				);

				if (!commentError) {
					answerRecorded = true;
				} else if (
					/once per question|duplicate|unique/i.test(String(commentError?.message ?? commentError))
				) {
					answerRecorded = true;
					alreadyAnswered = true;
				} else {
					logger.warn('Chorus answer not recorded as comment', {
						error: String(commentError?.message ?? commentError)
					});
				}
			} catch (commentErr) {
				logger.warn('Chorus answer not recorded as comment', { error: String(commentErr) });
			}
		}

		// Give-first funnel: the widget answer is a contribution. Joins the
		// gate_shown / widget-impression event by fingerprint; the RPC's unique
		// constraint dedupes repeat answers. Best-effort by construction.
		if (chorus.questionId && fingerprint) {
			const fallbackPath =
				payload.subjectType === 'personality-analysis'
					? `/personality-analysis/${payload.slug}`
					: null;
			await recordGiveFirstEvent({
				fingerprint,
				eventType: 'contribution',
				questionId: chorus.questionId,
				path: payload.sourcePath ?? fallbackPath,
				userId
			});
		}

		return json({
			...mirror,
			takes: chorus.takes,
			questionUrl: chorus.questionUrl,
			answerRecorded,
			alreadyAnswered
		});
	} catch (e) {
		if ((e as any)?.status) throw e;
		logger.error('Error in POST /api/nine/mirror', e as Error);
		throw error(500, 'The mirror clouded over');
	}
};
