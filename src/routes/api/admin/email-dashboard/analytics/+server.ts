// src/routes/api/admin/email-dashboard/analytics/+server.ts
// Fetch email analytics summary

import { error, isHttpError, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { requireAdmin } from '$lib/server/adminAuth';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';

export const GET: RequestHandler = async ({ url, locals }) => {
	await requireAdmin(locals);
	const supabase = getSupabaseAdminClient();

	const campaignId = url.searchParams.get('campaign_id');
	const fromDate = url.searchParams.get('from_date');
	const toDate = url.searchParams.get('to_date');

	try {
		const { data: analytics, error: analyticsError } = await supabase.rpc('get_email_analytics', {
			p_campaign_id: campaignId || undefined,
			p_from_date: fromDate || undefined,
			p_to_date: toDate || undefined
		});

		if (analyticsError) {
			console.error('Error fetching email analytics:', analyticsError);
			throw error(500, 'Failed to fetch analytics');
		}

		return json({
			summary: analytics || {
				total_sent: 0,
				total_opened: 0,
				total_clicked: 0,
				total_unsubscribed: 0,
				total_bounced: 0,
				total_complained: 0,
				total_failed: 0,
				total_open_count: 0,
				total_click_count: 0,
				open_rate: 0,
				click_rate: 0,
				click_to_open_rate: 0,
				unsubscribe_rate: 0,
				raw_open_events: 0,
				automated_open_events: 0,
				unknown_open_events: 0,
				raw_click_events: 0,
				qualified_click_events: 0,
				automated_click_events: 0,
				unknown_click_events: 0
			}
		});
	} catch (e) {
		if (isHttpError(e)) throw e;
		console.error('Error in analytics GET:', e);
		throw error(500, 'Internal server error');
	}
};
