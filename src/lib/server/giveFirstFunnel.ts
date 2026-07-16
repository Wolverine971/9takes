// src/lib/server/giveFirstFunnel.ts
// Records give-first wall funnel events (gate_shown, contribution) so the
// lurker -> contributor conversion is queryable. See migration
// 20260613_give_first_funnel_events.sql for the table + canonical funnel query.
//
// Every write is fire-and-forget safe: failures are logged and swallowed so
// instrumentation can never break a page load or a comment submission.
import { getSupabaseAdminClient } from './supabaseAdmin';

export type GiveFirstEventType = 'gate_shown' | 'contribution';

export async function recordGiveFirstEvent({
	fingerprint,
	eventType,
	questionId,
	path = null,
	userId = null
}: {
	fingerprint: string | undefined | null;
	eventType: GiveFirstEventType;
	questionId: number | null | undefined;
	path?: string | null;
	userId?: string | null;
}): Promise<void> {
	// No fingerprint means no join key (e.g. bots / cookie-less clients) — skip.
	if (!fingerprint || questionId == null || !Number.isFinite(questionId)) {
		return;
	}

	try {
		const supabaseAdmin = getSupabaseAdminClient() as any;
		const { error } = await supabaseAdmin.rpc('record_give_first_event', {
			p_fingerprint: fingerprint,
			p_event_type: eventType,
			p_question_id: questionId,
			p_path: path,
			p_user_id: userId
		});

		if (error) {
			console.error('Failed to record give-first funnel event', {
				eventType,
				questionId,
				error
			});
		}
	} catch (error) {
		console.error('Failed to record give-first funnel event', {
			eventType,
			questionId,
			error
		});
	}
}

// Small in-memory cache so blog pageviews do not pay a questions lookup on
// every request. Serverless instances each keep their own copy; that is fine
// because the funnel RPC dedupes on (fingerprint, event_type, question_id).
const questionIdByUrl = new Map<string, { id: number | null; expiresAt: number }>();
const QUESTION_ID_CACHE_MS = 5 * 60 * 1000;

async function resolveQuestionIdByUrl(questionUrl: string): Promise<number | null> {
	const cached = questionIdByUrl.get(questionUrl);
	if (cached && cached.expiresAt > Date.now()) return cached.id;

	const supabaseAdmin = getSupabaseAdminClient() as any;
	const { data } = await supabaseAdmin
		.from('questions')
		.select('id')
		.eq('url', questionUrl)
		.maybeSingle();

	const id = typeof data?.id === 'number' ? data.id : null;
	questionIdByUrl.set(questionUrl, { id, expiresAt: Date.now() + QUESTION_ID_CACHE_MS });
	return id;
}

/**
 * Strategic-question widget impression: a blog page that embeds the widget was
 * served to a fingerprinted visitor. Reuses gate_shown semantics so the funnel
 * reads widget served -> contribution, attributed per source page via `path`.
 * The table's unique constraint keeps this at one row per visitor per question
 * (earliest occurrence wins), matching the funnel grain.
 */
export async function recordStrategicQuestionImpression({
	questionUrl,
	fingerprint,
	path,
	userId = null
}: {
	questionUrl: string;
	fingerprint: string | undefined | null;
	path: string | null;
	userId?: string | null;
}): Promise<void> {
	if (!fingerprint || !questionUrl) return;

	try {
		const questionId = await resolveQuestionIdByUrl(questionUrl);
		if (questionId == null) return;

		await recordGiveFirstEvent({
			fingerprint,
			eventType: 'gate_shown',
			questionId,
			path,
			userId
		});
	} catch (error) {
		console.error('Failed to record strategic question impression', { questionUrl, error });
	}
}
