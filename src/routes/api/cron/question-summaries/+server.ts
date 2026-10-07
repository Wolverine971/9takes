// src/routes/api/cron/question-summaries/+server.ts
//
// Keeps "The gist so far" (T-43) current: regenerates the AI paraphrase for a
// question whenever its human-take count differs from the count the stored
// summary was built from, and deletes a summary whose question has no human
// takes left. Scheduled hourly in vercel.json; at most 10 questions per run
// and no new generation after BUDGET_MS, so a run fits the 300 s limit even
// when the last question started uses all 3 attempts (120 s + 3 x 45 s).
//
// The summary is gated content (see src/lib/server/questionAnswerSummary.ts):
// the page sends it only to viewers who answered and to verified Googlebot.
// This response carries ids and counts only, never summary or take text.
import { CRON_SECRET, PRIVATE_OPENROUTER_API_KEY } from '$env/static/private';
import { isAuthorizedCronRequest } from '$lib/server/cronAuth';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';
import {
	createOpenRouterSummaryLlm,
	refreshQuestionSummaries
} from '$lib/server/questionAnswerSummary';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Without this the route inherits the project default of 15 s.
export const config = {
	maxDuration: 300
};

const MAX_QUESTIONS_PER_RUN = 10;
const BUDGET_MS = 120_000;
const CALL_TIMEOUT_MS = 45_000;

async function run(request: Request, url: URL) {
	if (!isAuthorizedCronRequest(request.headers.get('authorization'), [CRON_SECRET])) {
		throw error(401, 'Unauthorized');
	}

	const requested = Number(url.searchParams.get('limit'));
	const limit = Math.min(
		MAX_QUESTIONS_PER_RUN,
		Math.max(1, Number.isFinite(requested) && requested > 0 ? requested : MAX_QUESTIONS_PER_RUN)
	);

	try {
		const report = await refreshQuestionSummaries({
			db: getSupabaseAdminClient(),
			llm: createOpenRouterSummaryLlm({
				apiKey: PRIVATE_OPENROUTER_API_KEY,
				timeoutMs: CALL_TIMEOUT_MS
			}),
			limit,
			budgetMs: BUDGET_MS,
			log: (message, details) => console.warn(message, details ?? {})
		});
		console.info('Processed question summaries cron run', {
			needingWork: report.needingWork,
			generated: report.generated.length,
			failed: report.failed.length,
			deleted: report.deleted.length,
			deferred: report.deferred
		});
		return json(report);
	} catch (runError) {
		console.error('Question summaries cron failed', runError);
		throw error(500, 'Failed to refresh question summaries');
	}
}

export const GET: RequestHandler = ({ request, url }) => run(request, url);
export const POST: RequestHandler = ({ request, url }) => run(request, url);
