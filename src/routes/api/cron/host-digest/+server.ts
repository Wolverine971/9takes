// src/routes/api/cron/host-digest/+server.ts
//
// Daily host digest: every new human take since the last digest (at most 14
// days back), two drafted replies each, one email to the host. Scheduled in
// vercel.json at 13:00 UTC (9am ET). Sends at most one email per run and never
// posts a comment. Each run is logged to app_error_events (source
// 'host_digest'); see runHostDigest.
import { CRON_SECRET } from '$env/static/private';
import { CRON_DRAFT_BUDGET_MS, runHostDigest } from '$lib/server/hostDigest';
import { isAuthorizedCronRequest } from '$lib/server/cronAuth';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Without this the route inherits the project default of 15 s (fluid compute
// is off), which killed every run with a take to draft from 2026-09-09 on.
export const config = {
	maxDuration: 300
};

async function handleHostDigestCron(request: Request) {
	if (!isAuthorizedCronRequest(request.headers.get('authorization'), [CRON_SECRET])) {
		throw error(401, 'Unauthorized');
	}

	try {
		const summary = await runHostDigest({
			trigger: 'cron',
			draftBudgetMs: CRON_DRAFT_BUDGET_MS
		});
		console.info('Processed host digest cron run', summary);
		// Takes existed but no email went out: fail the invocation so it shows
		// red in Vercel's cron log, not just in the run row.
		const undelivered = summary.status === 'send_failed' || summary.status === 'no_recipient';
		return json(summary, { status: undelivered ? 500 : 200 });
	} catch (processingError) {
		console.error('Failed to run host digest', processingError);
		throw error(500, 'Failed to run host digest');
	}
}

export const GET: RequestHandler = async ({ request }) => handleHostDigestCron(request);
export const POST: RequestHandler = async ({ request }) => handleHostDigestCron(request);
