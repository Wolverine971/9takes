// src/routes/admin/email-dashboard/+page.server.ts
import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { getWelcomeSequenceOverview } from '$lib/server/emailAdminSequences';
import { buildAdminDataStatus } from '$lib/server/adminDataStatus';

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
	const [
		usersResult,
		draftsResult,
		scheduledResult,
		analyticsResult,
		cronStatusResult,
		welcomeSequenceResult
	] = await Promise.all([
		// Get first page of users
		supabase.rpc('get_email_dashboard_users', {
			p_source: 'all',
			p_search: undefined,
			p_limit: 50,
			p_offset: 0
		}),
		// Get drafts
		supabase
			.from('email_drafts')
			.select('id, subject, recipients, scheduled_for, created_by, created_at, updated_at')
			.order('updated_at', { ascending: false })
			.limit(10),
		// Get pending scheduled emails
		supabase
			.from('scheduled_emails')
			.select(
				'id, draft_id, subject, recipients, campaign_id, scheduled_for, status, processed_at, emails_sent, emails_failed, created_by, created_at'
			)
			.eq('status', 'pending')
			.order('scheduled_for', { ascending: true })
			.limit(10),
		// Get overall analytics
		supabase.rpc('get_email_analytics', {
			p_campaign_id: undefined,
			p_from_date: undefined,
			p_to_date: undefined
		}),
		// Get cron status (from view created by migration)
		supabase
			.from('email_cron_status')
			.select('api_endpoint, enabled, health_status, last_run_at, last_run_status, updated_at')
			.single(),
		getWelcomeSequenceOverview(supabase)
			.then((data) => ({ data, error: null }))
			.catch((error: unknown) => ({ data: null, error }))
	]);

	// Get total user count
	const { data: totalCount, error: totalCountError } = await supabase.rpc(
		'count_email_dashboard_users',
		{
			p_source: 'all',
			p_search: undefined
		}
	);

	const dataStatus = buildAdminDataStatus([
		{ key: 'recipients', label: 'Recipient list', error: usersResult.error },
		{ key: 'recipient-total', label: 'Recipient total', error: totalCountError },
		{ key: 'drafts', label: 'Email drafts', error: draftsResult.error },
		{ key: 'scheduled', label: 'Scheduled emails', error: scheduledResult.error },
		{ key: 'analytics', label: 'Email analytics', error: analyticsResult.error },
		{ key: 'scheduler', label: 'Scheduler status', error: cronStatusResult.error },
		{ key: 'welcome-sequence', label: 'Welcome sequence', error: welcomeSequenceResult.error }
	]);

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
	const analyticsData =
		analyticsResult.data &&
		typeof analyticsResult.data === 'object' &&
		!Array.isArray(analyticsResult.data)
			? analyticsResult.data
			: {};

	return {
		session,
		dataStatus,
		users: usersResult.data || [],
		totalUsers: totalCount || 0,
		drafts: draftsResult.data || [],
		scheduledEmails: scheduledResult.data || [],
		analytics: { ...analyticsDefaults, ...analyticsData },
		cronStatus: cronStatusResult.data || null,
		welcomeSequence: welcomeSequenceResult.data
	};
};
