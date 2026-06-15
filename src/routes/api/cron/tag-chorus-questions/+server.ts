// src/routes/api/cron/tag-chorus-questions/+server.ts
//
// Asynchronous tagging flow for chorus questions. A chorus question is created
// dormant (hidden from the feed, untagged). Once it gets its first answer it
// becomes visible; this cron then tags it via the same `tagQuestion` flow the
// normal question-create path uses. Covers answers from both the chorus reveal
// and direct answers on /questions/[slug]. See docs/product/the-chorus-vision.md.

import { CRON_SECRET } from '$env/static/private';
import { isAuthorizedCronRequest } from '$lib/server/cronAuth';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';
import { tagQuestion } from '../../../../utils/server/openai';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const DEFAULT_BATCH = 20;
const MAX_BATCH = 50;

async function run(request: Request, url: URL) {
	if (!isAuthorizedCronRequest(request.headers.get('authorization'), [CRON_SECRET])) {
		throw error(401, 'Unauthorized');
	}

	const limit = Math.min(
		MAX_BATCH,
		Math.max(1, Number(url.searchParams.get('limit')) || DEFAULT_BATCH)
	);
	const supabase = getSupabaseAdminClient();

	// Chorus questions that have been answered but are not tagged yet.
	const { data, error: queryError } = await (supabase as any)
		.from('questions')
		.select('id, question, comment_count, tagged')
		.eq('data->>source', 'chorus')
		.gt('comment_count', 0)
		.not('tagged', 'is', true)
		.not('removed', 'is', true)
		.order('last_comment_date', { ascending: false, nullsFirst: false })
		.limit(limit);

	if (queryError) {
		console.error('tag-chorus-questions query failed', queryError);
		throw error(500, 'Failed to load chorus questions');
	}

	const rows = (data ?? []) as Array<{ id: number; question: string }>;
	let tagged = 0;
	const errors: Array<{ id: number; error: string }> = [];

	// Sequential to stay gentle on the LLM and within the function time budget.
	for (const q of rows) {
		try {
			await tagQuestion(supabase, q.question, q.id);
			tagged++;
		} catch (e) {
			errors.push({ id: q.id, error: String(e) });
		}
	}

	return json({
		message: rows.length === 0 ? 'No answered chorus questions awaiting tags' : `Tagged ${tagged}`,
		candidates: rows.length,
		tagged,
		errors
	});
}

export const GET: RequestHandler = ({ request, url }) => run(request, url);
export const POST: RequestHandler = ({ request, url }) => run(request, url);
