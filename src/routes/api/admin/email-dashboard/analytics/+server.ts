// src/routes/api/admin/email-dashboard/analytics/+server.ts
// Fetch email analytics summary

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
	const session = locals.session;
	const supabase = locals.supabase;

	if (!session?.user?.id) {
		throw error(401, 'Unauthorized');
	}

	const { data: user } = await supabase
		.from('profiles')
		.select('admin')
		.eq('id', session.user.id)
		.single();

	if (!user?.admin) {
		throw error(403, 'Admin access required');
	}

	const campaignId = url.searchParams.get('campaign_id');
	const fromDate = url.searchParams.get('from_date');
	const toDate = url.searchParams.get('to_date');

	try {
		const { data: analytics, error: analyticsError } = await supabase.rpc('get_email_analytics', {
			p_campaign_id: campaignId || null,
			p_from_date: fromDate || null,
			p_to_date: toDate || null
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
				total_failed: 0,
				total_open_count: 0,
				total_click_count: 0,
				open_rate: 0,
				click_rate: 0,
				unsubscribe_rate: 0
			}
		});
	} catch (e) {
		console.error('Error in analytics GET:', e);
		throw error(500, 'Internal server error');
	}
};
