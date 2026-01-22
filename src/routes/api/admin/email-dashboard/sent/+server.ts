// src/routes/api/admin/email-dashboard/sent/+server.ts
// Fetch sent emails with analytics

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

	// Parse query parameters
	const page = parseInt(url.searchParams.get('page') || '1');
	const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100);
	const offset = (page - 1) * limit;
	const campaignId = url.searchParams.get('campaign_id');
	const status = url.searchParams.get('status');
	const source = url.searchParams.get('source');
	const search = url.searchParams.get('search');
	const fromDate = url.searchParams.get('from_date');
	const toDate = url.searchParams.get('to_date');

	try {
		// Build query for emails
		let query = supabase
			.from('email_sends')
			.select('*', { count: 'exact' })
			.order('sent_at', { ascending: false, nullsFirst: false })
			.order('created_at', { ascending: false })
			.range(offset, offset + limit - 1);

		if (campaignId) {
			query = query.eq('campaign_id', campaignId);
		}

		if (status) {
			if (status === 'sent') {
				query = query.in('status', ['sent', 'delivered']);
			} else {
				query = query.eq('status', status);
			}
		}

		if (source) {
			query = query.eq('recipient_source', source);
		}

		if (search) {
			const escaped = search.replace(/%/g, '\\%').replace(/_/g, '\\_');
			query = query.or(
				`recipient_email.ilike.%${escaped}%,recipient_name.ilike.%${escaped}%,subject.ilike.%${escaped}%`
			);
		}

		if (fromDate) {
			query = query.gte('sent_at', fromDate);
		}

		if (toDate) {
			query = query.lte('sent_at', toDate);
		}

		const { data: emails, error: emailsError, count } = await query;

		if (emailsError) {
			console.error('Error fetching sent emails:', emailsError);
			throw error(500, 'Failed to fetch sent emails');
		}

		// Get analytics summary
		const { data: analytics } = await supabase.rpc('get_email_analytics', {
			p_campaign_id: campaignId || null,
			p_from_date: fromDate || null,
			p_to_date: toDate || null
		});

		return json({
			emails: emails || [],
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
			},
			pagination: {
				total: count || 0,
				page,
				limit,
				totalPages: Math.ceil((count || 0) / limit)
			}
		});
	} catch (e) {
		console.error('Error in sent emails GET:', e);
		throw error(500, 'Internal server error');
	}
};
