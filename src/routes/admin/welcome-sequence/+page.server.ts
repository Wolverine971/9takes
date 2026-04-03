// src/routes/admin/welcome-sequence/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const supabase = locals.supabase;

	const { data: sequence } = await supabase
		.from('email_sequences')
		.select('id, key, display_name, status, trigger_type')
		.eq('key', 'welcome_sequence')
		.maybeSingle();

	if (!sequence) {
		return { sequence: null, steps: [], enrollments: [], stepMetrics: [], funnelCounts: null };
	}

	const [stepsResult, enrollmentsResult] = await Promise.all([
		supabase
			.from('email_sequence_steps')
			.select('step_number, subject, html_content, delay_days_after_previous')
			.eq('sequence_id', sequence.id)
			.order('step_number', { ascending: true }),
		supabase
			.from('email_sequence_enrollments')
			.select(
				'id, user_id, recipient_email, recipient_source, status, current_step_number, next_step_number, enrolled_at, next_send_at, last_sent_at, exit_reason, failure_count, last_error'
			)
			.eq('sequence_id', sequence.id)
			.order('enrolled_at', { ascending: false })
	]);

	const steps = stepsResult.data || [];
	const enrollments = enrollmentsResult.data || [];

	// Match email_sends to sequence steps by subject for per-step delivery metrics
	const stepSubjects = steps.map((s) => s.subject);

	const { data: emailSends } = stepSubjects.length
		? await supabase
				.from('email_sends')
				.select('subject, status, opened_at, clicked_at, recipient_source_id')
				.in('subject', stepSubjects)
		: { data: [] };

	const stepMetrics = steps.map((step) => {
		const sends = (emailSends || []).filter((s) => s.subject === step.subject);
		const delivered = sends.filter((s) => s.status === 'sent' || s.status === 'delivered');
		const opened = sends.filter((s) => s.opened_at);
		const clicked = sends.filter((s) => s.clicked_at);
		return {
			step_number: step.step_number,
			subject: step.subject,
			total_sent: delivered.length,
			total_opened: opened.length,
			total_clicked: clicked.length,
			open_rate: delivered.length > 0 ? Math.round((opened.length / delivered.length) * 100) : 0,
			click_rate: delivered.length > 0 ? Math.round((clicked.length / delivered.length) * 100) : 0
		};
	});

	// Funnel: how many enrollments reached each step
	const funnelCounts = {
		total_enrolled: enrollments.length,
		reached_step_1: enrollments.filter((e) => e.current_step_number >= 1).length,
		reached_step_2: enrollments.filter((e) => e.current_step_number >= 2).length,
		reached_step_3: enrollments.filter((e) => e.current_step_number >= 3).length,
		reached_step_4: enrollments.filter((e) => e.current_step_number >= 4).length,
		completed: enrollments.filter((e) => e.status === 'completed').length,
		exited: enrollments.filter((e) => e.status === 'exited').length,
		errored: enrollments.filter((e) => e.status === 'errored').length,
		active: enrollments.filter((e) => e.status === 'active').length
	};

	// Get return visits for enrolled users from page analytics
	const userIds = [...new Set(enrollments.map((e) => e.user_id).filter(Boolean))] as string[];

	type ReturnVisitData = { last_visit: string; session_count: number };
	const returnVisits: Record<string, ReturnVisitData> = {};

	if (userIds.length > 0) {
		const { data: sessions } = await supabase
			.from('page_analytics_sessions')
			.select('user_id, last_seen_at')
			.in('user_id', userIds)
			.order('last_seen_at', { ascending: false });

		for (const session of sessions || []) {
			if (!session.user_id) continue;
			if (!returnVisits[session.user_id]) {
				returnVisits[session.user_id] = {
					last_visit: session.last_seen_at,
					session_count: 1
				};
			} else {
				returnVisits[session.user_id].session_count++;
			}
		}
	}

	const enrichedEnrollments = enrollments.map((e) => ({
		...e,
		return_data: e.user_id && returnVisits[e.user_id] ? returnVisits[e.user_id] : null
	}));

	return {
		sequence,
		steps,
		enrollments: enrichedEnrollments,
		stepMetrics,
		funnelCounts
	};
};
