// src/lib/server/liveTakeAnswer.ts
// Posts a visitor's take on a question from an embedded "answer first" card and
// returns the answers the give-first gate now unlocks. Shared by the homepage
// (POST /api/homepage/answer) and the Enneagram test result page
// (POST /api/enneagram-test/results/[token]/answer).
//
// It goes through the question page's own helpers: same schema, rate limit,
// give-first access rule and create_comment_atomic insert. Callers decide which
// question a surface may post to before calling this.
import { isHttpError, type RequestEvent } from '@sveltejs/kit';

import type { LiveTakePostResult } from '$lib/data/homepageLiveTake';
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

type LiveTakeAnswerEvent = Pick<RequestEvent, 'cookies' | 'locals' | 'getClientAddress'> & {
	platform?: Parameters<typeof runBestEffortTelemetry>[0]['platform'];
};

export type LiveTakeAnswerInput = {
	/** questions.url of the question the surface shows. */
	slug: string;
	/** Raw take text. Length and emptiness are checked by createCommentSchema. */
	comment: string;
	/** Body fallback; the 9tfingerprint cookie wins so the take unlocks /questions/<slug>. */
	fingerprint?: string;
	/** Path the give-first contribution is attributed to. Never a private URL. */
	path: string;
	/** Shown when demo mode is on and nothing may be written. */
	pausedMessage: string;
	/** Shown when the question no longer resolves. */
	missingMessage: string;
};

export type LiveTakeAnswerOutcome =
	| { ok: true; result: LiveTakePostResult; created: boolean; fingerprint: string | null }
	| { ok: false; status: number; error: string };

function fail(status: number, error: string): LiveTakeAnswerOutcome {
	return { ok: false, status, error };
}

export async function postLiveTake(
	event: LiveTakeAnswerEvent,
	input: LiveTakeAnswerInput
): Promise<LiveTakeAnswerOutcome> {
	const { locals, cookies, getClientAddress } = event;

	// Demo mode moves the question page onto demo tables; never write a real take then.
	if ((await loadRouteDemoTime(locals.supabase)) === true) return fail(409, input.pausedMessage);

	const question = await getLiveQuestion(locals.supabase, input.slug);
	if (!question) return fail(404, input.missingMessage);

	const userId = locals.session?.user?.id ?? null;
	const fingerprint = readVisitorFingerprint(cookies) ?? input.fingerprint ?? undefined;

	// Same schema as the question page's createComment action. author_id never comes
	// from the client: createCommentData binds it to the session.
	const validation = createCommentSchema.safeParse({
		comment: input.comment,
		parent_id: String(question.id),
		parent_type: 'question',
		fingerprint,
		question_id: String(question.id)
	});
	if (!validation.success) {
		return fail(400, validation.error.errors[0]?.message || 'Invalid comment data');
	}
	const take = validation.data;
	// The schema trims after its length check, so whitespace-only text gets here empty.
	if (!take.comment) return fail(400, 'Comment cannot be empty');

	const ip = getClientAddress();
	// Independent reads share one round trip; the rate-limit rejection still wins.
	const [rateLimit, access, signedInAnswered] = await Promise.allSettled([
		checkRateLimit(take.fingerprint, ip),
		assertCommentAccess(take, userId, false),
		// Signed-in users may add more takes on the question page, but an embedded card
		// offers exactly one, so an existing take means "already answered" here too.
		userId
			? checkUserAnswered(take.fingerprint, question.id, userId, locals.supabase)
			: Promise.resolve(false)
	]);
	if (rateLimit.status === 'fulfilled' && !rateLimit.value) {
		return fail(429, 'Too many comments. Please wait a minute before trying again.');
	}

	let alreadyAnswered = signedInAnswered.status === 'fulfilled' && Boolean(signedInAnswered.value);
	if (access.status === 'rejected') {
		const reason = access.reason;
		// For a top-level take, assertCommentAccess's only 403 is the anonymous
		// one-take-per-question rule: this visitor already answered.
		if (isHttpError(reason) && reason.status === 403) alreadyAnswered = true;
		else if (isHttpError(reason)) return fail(reason.status, reason.body.message);
		else throw reason;
	}

	let record: { id?: unknown; _analytics?: unknown } | null = null;
	if (!alreadyAnswered) {
		const commentData = await createCommentData(take, ip, userId);
		const { data, error: rpcError } = await insertCommentAtomic(commentData, 'question');
		if (rpcError && isOncePerQuestionError(rpcError)) {
			// Lost a race with another tab: the take already exists.
			alreadyAnswered = true;
		} else if (rpcError) {
			console.error('Atomic comment creation failed:', rpcError);
			return fail(500, 'We couldn’t post your answer. It’s still here, so try again.');
		} else {
			record = data ?? {};
		}
	}

	if (record) {
		// Same background link enrichment as the question page, kept alive past the response.
		runBestEffortTelemetry(event, parseUrls(take.comment, take.parent_id), () => {
			console.warn('Background URL parsing failed');
		});
		// Give-first contribution (fingerprint-keyed) joins the surface's gate_shown.
		runBestEffortTelemetry(
			event,
			recordGiveFirstEvent({
				fingerprint: take.fingerprint,
				eventType: 'contribution',
				questionId: question.id,
				path: input.path,
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
		fingerprint: take.fingerprint ?? null,
		userId
	}).catch(() => null);

	const recordId = Number(record?.id);
	const commentId = record && Number.isSafeInteger(recordId) ? recordId : null;
	return {
		ok: true,
		created: Boolean(record),
		fingerprint: take.fingerprint ?? null,
		result: {
			ok: true,
			alreadyAnswered,
			questionId: question.id,
			commentId,
			commentAnalytics: record?._analytics ?? null,
			isAnonymous: !userId,
			ownTake:
				unlocked?.ownTake ?? (commentId !== null ? { id: commentId, text: take.comment } : null),
			answers: unlocked?.answers ?? [],
			responses: unlocked?.responses ?? question.responses + (record ? 1 : 0)
		}
	};
}
