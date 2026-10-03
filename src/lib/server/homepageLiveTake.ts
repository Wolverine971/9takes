// src/lib/server/homepageLiveTake.ts
// Server side of the live-take homepage: resolve the live question, check the
// visitor against the give-first gate, and read their unlocked answers. Shared by
// the `/` load and POST /api/homepage/answer.
import type { RequestEvent } from '@sveltejs/kit';

import { VISITOR_ID_COOKIE_NAME } from '$lib/analytics/visitorIdentity';
import {
	LIVE_TAKE_ANSWER_LIMIT,
	LIVE_TAKE_SLUG,
	splitLiveTakes,
	type LiveTake,
	type LiveTakeAnswer,
	type LiveTakeOwnAnswer
} from '$lib/data/homepageLiveTake';
import {
	logBestEffortTelemetryFailure,
	runBestEffortTelemetry
} from '$lib/server/bestEffortTelemetry';
import { loadRouteDemoTime } from '$lib/server/demoTime';
import { recordGiveFirstEvent } from '$lib/server/giveFirstFunnel';
import { checkUserAnswered, getQuestion } from '$lib/server/questionComments';
import { getQuestionTakes } from '$lib/server/questionTakes';
import { logger } from '$lib/utils/logger';

// Enough recent takes to fill the homepage after skipping low-effort ones.
const UNLOCKED_TAKE_FETCH_LIMIT = 24;

export type LiveQuestion = {
	id: number;
	url: string;
	title: string;
	responses: number;
};

export type LiveViewer = {
	fingerprint: string | null;
	userId: string | null;
};

export type UnlockedLiveTakes = {
	ownTake: LiveTakeOwnAnswer | null;
	answers: LiveTakeAnswer[];
	responses: number | null;
};

type LiveTakeEvent = Pick<RequestEvent, 'cookies' | 'locals' | 'request' | 'url'> & {
	platform?: Parameters<typeof runBestEffortTelemetry>[0]['platform'];
};

/** The same cookie the question page reads, so both surfaces see one visitor. */
export function readVisitorFingerprint(cookies: RequestEvent['cookies']): string | null {
	return cookies.get(VISITOR_ID_COOKIE_NAME)?.trim() || null;
}

/** Same lookup as the question page: removed and flagged questions never resolve. */
export async function getLiveQuestion(
	db: App.Locals['supabase'],
	slug: string = LIVE_TAKE_SLUG
): Promise<LiveQuestion | null> {
	const question = await getQuestion(slug, false, db);
	const title = question?.question_formatted?.trim() || question?.question?.trim();
	if (!question?.url || !title) return null;
	return {
		id: question.id,
		url: question.url,
		title,
		responses: question.comment_count ?? 0
	};
}

/**
 * Give-first: other people's answers are read only after can_see_comments_3 says
 * this visitor has a take on the question. Returns null when the gate is closed.
 */
export async function getUnlockedLiveTakes(
	db: App.Locals['supabase'],
	questionId: number,
	viewer: LiveViewer
): Promise<UnlockedLiveTakes | null> {
	if (!viewer.fingerprint && !viewer.userId) return null;
	const answered = await checkUserAnswered(
		viewer.fingerprint ?? undefined,
		questionId,
		viewer.userId ?? undefined,
		db
	);
	if (!answered) return null;

	try {
		const takes = await getQuestionTakes(questionId, {
			viewerId: viewer.userId,
			fingerprint: viewer.fingerprint,
			limit: UNLOCKED_TAKE_FETCH_LIMIT
		});
		return {
			...splitLiveTakes(takes.data, takes.ownComments, LIVE_TAKE_ANSWER_LIMIT),
			responses: takes.count
		};
	} catch (takesError) {
		// The gate is open; only the read failed. The visitor still gets the
		// unlocked state and the link to the full conversation.
		logger.warn('Homepage live take: unlocked answers unavailable', {
			questionId,
			error: String(takesError)
		});
		return { ownTake: null, answers: [], responses: null };
	}
}

/**
 * `/` load: the live question plus, for visitors who already answered it, their
 * unlocked answers. Everyone else gets the locked card (no answers) and a
 * human-only `gate_shown` event. Any failure falls back to the practice homepage.
 */
export async function loadHomepageLiveTake(event: LiveTakeEvent): Promise<LiveTake | null> {
	try {
		const [isDemoTime, question] = await Promise.all([
			loadRouteDemoTime(event.locals.supabase),
			getLiveQuestion(event.locals.supabase)
		]);
		// Demo mode moves the question page onto demo tables; the homepage never
		// mixes them, so it falls back to the practice-only homepage.
		if (isDemoTime === true || !question) return null;

		const viewer: LiveViewer = {
			fingerprint: readVisitorFingerprint(event.cookies),
			userId: event.locals.session?.user?.id ?? null
		};
		const unlocked = await getUnlockedLiveTakes(event.locals.supabase, question.id, viewer);

		if (!unlocked && viewer.fingerprint) {
			const userAgent = event.request.headers.get('user-agent');
			runBestEffortTelemetry(
				event,
				// recordGiveFirstEvent drops crawler user agents for gate_shown.
				recordGiveFirstEvent({
					fingerprint: viewer.fingerprint,
					eventType: 'gate_shown',
					questionId: question.id,
					path: event.url.pathname,
					userId: viewer.userId,
					userAgent
				}),
				(telemetryError) => {
					logBestEffortTelemetryFailure(
						'Failed to record give-first funnel event',
						telemetryError,
						{
							eventType: 'gate_shown',
							questionId: question.id
						}
					);
				}
			);
		}

		return {
			questionId: question.id,
			slug: question.url,
			title: question.title,
			responses: unlocked?.responses ?? question.responses,
			signedIn: Boolean(viewer.userId),
			answered: Boolean(unlocked),
			ownTake: unlocked?.ownTake ?? null,
			answers: unlocked?.answers ?? []
		};
	} catch (loadError) {
		logger.warn('Homepage live take unavailable; showing the practice homepage', {
			error: String(loadError)
		});
		return null;
	}
}
