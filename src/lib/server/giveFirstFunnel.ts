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
