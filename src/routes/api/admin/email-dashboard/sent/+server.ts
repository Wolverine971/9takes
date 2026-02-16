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
	const pageParam = Number.parseInt(url.searchParams.get('page') || '1', 10);
	const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

	const limitParam = Number.parseInt(url.searchParams.get('limit') || '50', 10);
	const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 100) : 50;

	const offset = (page - 1) * limit;
	const campaignId = url.searchParams.get('campaign_id');
	const statusParam = url.searchParams.get('status');
	const status =
		statusParam === 'sent' ||
		statusParam === 'delivered' ||
		statusParam === 'failed' ||
		statusParam === 'bounced'
			? statusParam
			: null;

	const sourceParam = url.searchParams.get('source');
	const source =
		sourceParam === 'profiles' || sourceParam === 'signups' || sourceParam === 'coaching_waitlist'
			? sourceParam
			: null;

	const searchQuery = url.searchParams.get('search')?.trim();
	const search = searchQuery ? searchQuery.slice(0, 200) : null;

	const fromDateParam = url.searchParams.get('from_date');
	const toDateParam = url.searchParams.get('to_date');

	const fromDate = fromDateParam ? new Date(fromDateParam) : null;
	if (fromDateParam && (!fromDate || Number.isNaN(fromDate.getTime()))) {
		throw error(400, 'Invalid from_date');
	}

	const toDate = toDateParam ? new Date(toDateParam) : null;
	if (toDateParam && (!toDate || Number.isNaN(toDate.getTime()))) {
		throw error(400, 'Invalid to_date');
	}

	if (fromDate && toDate && fromDate > toDate) {
		throw error(400, 'from_date must be before to_date');
	}

	const fromDateIso = fromDate?.toISOString();
	const toDateIso = toDate?.toISOString();

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
			const escaped = search.replace(/%/g, '\\%').replace(/_/g, '\\_').replace(/[(),]/g, ' ');
			query = query.or(
				`recipient_email.ilike.%${escaped}%,recipient_name.ilike.%${escaped}%,subject.ilike.%${escaped}%`
			);
		}

		if (fromDateIso) {
			query = query.gte('sent_at', fromDateIso);
		}

		if (toDateIso) {
			query = query.lte('sent_at', toDateIso);
		}

		const { data: emails, error: emailsError, count } = await query;

		if (emailsError) {
			console.error('Error fetching sent emails:', emailsError);
			throw error(500, 'Failed to fetch sent emails');
		}

		// Get analytics summary
		const { data: analytics } = await supabase.rpc('get_email_analytics', {
			p_campaign_id: campaignId || undefined,
			p_from_date: fromDateIso || undefined,
			p_to_date: toDateIso || undefined
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
		if (e instanceof Error && 'status' in e) {
			throw e;
		}
		throw error(500, 'Internal server error');
	}
};
