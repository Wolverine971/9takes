// src/routes/api/homepage/answer/+server.ts
// POST /api/homepage/answer — the live-take homepage's "Post anonymously and read
// them". It posts the visitor's answer as a real take on the homepage's live
// question through the question page's own helpers (same schema, rate limit,
// give-first access rule and create_comment_atomic insert), then returns the
// answers the give-first gate now unlocks for this visitor.
//
// Request:  { slug: string, comment: string, fingerprint?: string }
//           The 9tfingerprint cookie wins over the body fingerprint, so the take
//           unlocks /questions/<slug> for the same visitor.
// Response: LiveTakePostResult (200), or { error } with 400 / 404 / 409 / 429 / 500.
import { isHttpError, json } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';

import { LIVE_TAKE_SLUG, type LiveTakePostResult } from '$lib/data/homepageLiveTake';
import {
	logBestEffortTelemetryFailure,
	runBestEffortTelemetry
} from '$lib/server/bestEffortTelemetry';
import { loadRouteDemoTime } from '$lib/server/demoTime';
import { recordGiveFirstEvent } from '$lib/server/giveFirstFunnel';
import {
	getLiveQuestion,
	getUnlockedLiveTakes,
	readVisitorFingerprint
} from '$lib/server/homepageLiveTake';
import {
	assertCommentAccess,
	checkRateLimit,
	checkUserAnswered,
	createCommentData,
	insertCommentAtomic,
	isOncePerQuestionError,
	parseUrls
} from '$lib/server/questionComments';
import { createCommentSchema } from '$lib/validation/questionSchemas';

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
	const { request, locals, cookies, getClientAddress } = event;

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

	// Demo mode moves the question page onto demo tables; never write a real take then.
	if ((await loadRouteDemoTime(locals.supabase)) === true) {
		return errorResponse(409, 'Posting from the homepage is paused right now.');
	}

	const question = await getLiveQuestion(locals.supabase, parsed.data.slug);
	if (!question) return errorResponse(404, 'This question is no longer open.');

	const userId = locals.session?.user?.id ?? null;
	const fingerprint = readVisitorFingerprint(cookies) ?? parsed.data.fingerprint ?? undefined;

	// Same schema as the question page's createComment action. author_id never comes
	// from the client: createCommentData binds it to the session.
	const validation = createCommentSchema.safeParse({
		comment: parsed.data.comment,
		parent_id: String(question.id),
		parent_type: 'question',
		fingerprint,
		question_id: String(question.id)
	});
	if (!validation.success) {
		return errorResponse(400, validation.error.errors[0]?.message || 'Invalid comment data');
	}
	const input = validation.data;
	// The schema trims after its length check, so whitespace-only text gets here empty.
	if (!input.comment) return errorResponse(400, 'Comment cannot be empty');

	const ip = getClientAddress();
	// Independent reads share one round trip; the rate-limit rejection still wins.
	const [rateLimit, access, signedInAnswered] = await Promise.allSettled([
		checkRateLimit(input.fingerprint, ip),
		assertCommentAccess(input, userId, false),
		// Signed-in users may add more takes on the question page, but the homepage
		// offers exactly one, so an existing take means "already answered" here too.
		userId
			? checkUserAnswered(input.fingerprint, question.id, userId, locals.supabase)
			: Promise.resolve(false)
	]);
	if (rateLimit.status === 'fulfilled' && !rateLimit.value) {
		return errorResponse(429, 'Too many comments. Please wait a minute before trying again.');
	}

	let alreadyAnswered = signedInAnswered.status === 'fulfilled' && Boolean(signedInAnswered.value);
	if (access.status === 'rejected') {
		const reason = access.reason;
		// For a top-level take, assertCommentAccess's only 403 is the anonymous
		// one-take-per-question rule: this visitor already answered.
		if (isHttpError(reason) && reason.status === 403) alreadyAnswered = true;
		else if (isHttpError(reason)) return errorResponse(reason.status, reason.body.message);
		else throw reason;
	}

	let record: { id?: unknown; _analytics?: unknown } | null = null;
	if (!alreadyAnswered) {
		const commentData = await createCommentData(input, ip, userId);
		const { data, error: rpcError } = await insertCommentAtomic(commentData, 'question');
		if (rpcError && isOncePerQuestionError(rpcError)) {
			// Lost a race with another tab: the take already exists.
			alreadyAnswered = true;
		} else if (rpcError) {
			console.error('Atomic comment creation failed:', rpcError);
			return errorResponse(500, 'We couldn’t post your answer. It’s still here, so try again.');
		} else {
			record = data ?? {};
		}
	}

	if (record) {
		// Same background link enrichment as the question page, kept alive past the response.
		runBestEffortTelemetry(event, parseUrls(input.comment, input.parent_id), () => {
			console.warn('Background URL parsing failed');
		});
		// Give-first contribution (fingerprint-keyed) joins the homepage's gate_shown.
		runBestEffortTelemetry(
			event,
			recordGiveFirstEvent({
				fingerprint: input.fingerprint,
				eventType: 'contribution',
				questionId: question.id,
				path: HOMEPAGE_PATH,
				userId
			}),
			(telemetryError) => {
				logBestEffortTelemetryFailure('Failed to record give-first funnel event', telemetryError, {
					eventType: 'contribution',
					questionId: question.id
				});
			}
		);
	}

	// Through the same gate as the question page: no take, no answers.
	const unlocked = await getUnlockedLiveTakes(locals.supabase, question.id, {
		fingerprint: input.fingerprint ?? null,
		userId
	}).catch(() => null);

	const recordId = Number(record?.id);
	const commentId = record && Number.isSafeInteger(recordId) ? recordId : null;
	const result: LiveTakePostResult = {
		ok: true,
		alreadyAnswered,
		questionId: question.id,
		commentId,
		commentAnalytics: record?._analytics ?? null,
		isAnonymous: !userId,
		ownTake:
			unlocked?.ownTake ?? (commentId !== null ? { id: commentId, text: input.comment } : null),
		answers: unlocked?.answers ?? [],
		responses: unlocked?.responses ?? question.responses + (record ? 1 : 0)
	};
	return json(result);
};
