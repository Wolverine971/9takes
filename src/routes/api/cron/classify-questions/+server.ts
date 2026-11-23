// src/routes/api/cron/classify-questions/+server.ts
//
// Files questions under the topic directory with Jev. Picks up any question whose
// topics are missing or stale: a new question the tagger could not file, an edited
// question, or every question after src/lib/data/questionTaxonomy.json changes.
// One Jev request per question (about $0.0003), so a directory change re-files the
// whole corpus over a few runs. Never changes a question's visibility, and never
// overwrites topics an owner or admin picked.

import { CRON_SECRET } from '$env/static/private';
import { isAuthorizedCronRequest } from '$lib/server/cronAuth';
import { fileQuestionsNeedingTopics } from '$lib/server/questionTopics';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const config = {
	maxDuration: 300
};

const DEFAULT_BATCH = 25;
const MAX_BATCH = 60;

async function run(request: Request, url: URL) {
	if (!isAuthorizedCronRequest(request.headers.get('authorization'), [CRON_SECRET])) {
		throw error(401, 'Unauthorized');
	}

	const limit = Math.min(
		MAX_BATCH,
		Math.max(1, Number(url.searchParams.get('limit')) || DEFAULT_BATCH)
	);

	try {
		const result = await fileQuestionsNeedingTopics(getSupabaseAdminClient(), limit);
		return json({
			message:
				result.candidates === 0
					? 'Every question has current topics'
					: `Filed ${result.filed.length} of ${result.candidates}`,
			...result
		});
	} catch (e) {
		console.error('classify-questions failed', e);
		throw error(500, 'Failed to file questions under topics');
	}
}

export const GET: RequestHandler = ({ request, url }) => run(request, url);
export const POST: RequestHandler = ({ request, url }) => run(request, url);
