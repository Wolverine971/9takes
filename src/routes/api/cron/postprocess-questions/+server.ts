// src/routes/api/cron/postprocess-questions/+server.ts
//
// Drains questions whose post-processing (tags + formatted question + nine AI
// takes) never ran. The question-create path cannot reliably run this work
// in-request: Vercel freezes the invocation as soon as the response returns,
// so a fire-and-forget `postProcess()` dies mid-flight (every question created
// 2026-06 → 2026-08 was born with no tags and no takes). Creation now defers
// tagging entirely to this cron.
//
// Chorus questions are excluded: they are created dormant on purpose and are
// tagged after their first answer by tag-chorus-questions instead.
//
// Each question costs ~11 LLM calls (1 metadata + director + 9 voices), so the
// batch is small; at */15 cadence a new question has its takes within minutes.

import { CRON_SECRET } from '$env/static/private';
import { isAuthorizedCronRequest } from '$lib/server/cronAuth';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';
import { tagQuestion } from '../../../../utils/server/openai';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const DEFAULT_BATCH = 3;
const MAX_BATCH = 10;

async function run(request: Request, url: URL) {
	if (!isAuthorizedCronRequest(request.headers.get('authorization'), [CRON_SECRET])) {
		throw error(401, 'Unauthorized');
	}

	const limit = Math.min(
		MAX_BATCH,
		Math.max(1, Number(url.searchParams.get('limit')) || DEFAULT_BATCH)
	);
	const supabase = getSupabaseAdminClient();

	// Non-chorus questions that never finished post-processing. Flagged rows are
	// a moderation state and stay untouched.
	const { data, error: queryError } = await (supabase as any)
		.from('questions')
		.select('id, question, question_formatted')
		.or('data->>source.is.null,data->>source.neq.chorus')
		.or('flagged.is.null,flagged.eq.false')
		.not('tagged', 'is', true)
		.not('removed', 'is', true)
		.order('created_at', { ascending: false })
		.limit(limit);

	if (queryError) {
		console.error('postprocess-questions query failed', queryError);
		throw error(500, 'Failed to load questions awaiting post-processing');
	}

	const rows = (data ?? []) as Array<{
		id: number;
		question: string | null;
		question_formatted: string | null;
	}>;
	let processed = 0;
	const errors: Array<{ id: number; error: string }> = [];

	// Sequential to stay gentle on the LLM and within the function time budget.
	for (const q of rows) {
		const text = (q.question_formatted || q.question || '').trim();
		if (!text) continue;
		try {
			await tagQuestion(supabase, text, q.id);
			processed++;
		} catch (e) {
			errors.push({ id: q.id, error: String(e) });
		}
	}

	return json({
		message: rows.length === 0 ? 'No questions awaiting post-processing' : `Processed ${processed}`,
		candidates: rows.length,
		processed,
		errors
	});
}

export const GET: RequestHandler = ({ request, url }) => run(request, url);
export const POST: RequestHandler = ({ request, url }) => run(request, url);
