// src/routes/api/cron/process-email-events/+server.ts
import { CRON_SECRET } from '$env/static/private';
import { error, json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';
import { isAuthorizedCronRequest } from '$lib/server/cronAuth';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';

async function processEmailEvents(request: Request) {
	if (!isAuthorizedCronRequest(request.headers.get('authorization'), [CRON_SECRET])) {
		throw error(401, 'Unauthorized');
	}

	const supabase = getSupabaseAdminClient() as any;
	const [qualification, providerReplay] = await Promise.all([
		supabase.rpc('qualify_pending_email_clicks', {
			p_min_age: '2 minutes',
			p_limit: 1000
		}),
		supabase.rpc('reprocess_email_provider_events', { p_limit: 100 })
	]);

	if (qualification.error || providerReplay.error) {
		console.error('Email event maintenance failed', {
			qualification: qualification.error,
			providerReplay: providerReplay.error
		});
		throw error(500, 'Email event maintenance failed');
	}

	return json({
		qualification: qualification.data,
		providerReplay: providerReplay.data
	});
}

export const GET: RequestHandler = async ({ request }) => processEmailEvents(request);
export const POST: RequestHandler = async ({ request }) => processEmailEvents(request);
