// src/routes/admin/email-dashboard/+page.server.ts
import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	const session = event.locals.session;
	const supabase = event.locals.supabase;

	if (!session?.user?.id) {
		throw redirect(302, '/questions');
	}

	const { data: user, error: findUserError } = await supabase
		.from('profiles')
		.select('id, admin')
		.eq('id', session.user.id)
		.single();

	if (!user?.admin) {
		throw redirect(307, '/questions');
	}

	if (findUserError) {
		throw error(404, { message: 'Error searching for user' });
	}

	// Fetch initial data in parallel
	const [usersResult, draftsResult, scheduledResult, analyticsResult, cronStatusResult] =
		await Promise.all([
			// Get first page of users
			supabase.rpc('get_email_dashboard_users', {
				p_source: 'all',
				p_search: null,
				p_limit: 50,
				p_offset: 0
			}),
			// Get drafts
			supabase.from('email_drafts').select('*').order('updated_at', { ascending: false }).limit(10),
			// Get pending scheduled emails
			supabase
				.from('scheduled_emails')
				.select('*')
				.eq('status', 'pending')
				.order('scheduled_for', { ascending: true })
				.limit(10),
			// Get overall analytics
			supabase.rpc('get_email_analytics', {
				p_campaign_id: null,
				p_from_date: null,
				p_to_date: null
			}),
			// Get cron status (from view created by migration)
			supabase.from('email_cron_status').select('*').single()
		]);

	// Get total user count
	const { data: totalCount } = await supabase.rpc('count_email_dashboard_users', {
		p_source: 'all',
		p_search: null
	});

	const analyticsDefaults = {
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
	};

	return {
		session,
		users: usersResult.data || [],
		totalUsers: totalCount || 0,
		drafts: draftsResult.data || [],
		scheduledEmails: scheduledResult.data || [],
		analytics: { ...analyticsDefaults, ...(analyticsResult.data || {}) },
		cronStatus: cronStatusResult.data || null
	};
};
