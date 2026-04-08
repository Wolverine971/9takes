// src/routes/admin/welcome-sequence/+page.server.ts
import type { PageServerLoad } from './$types';
import {
	buildReturnVisitsByUser,
	type AnalyticsSessionRow,
	type ReturnVisitData
} from '$lib/server/welcomeSequenceReturns';

type StepRow = {
	step_number: number;
	subject: string;
	html_content: string;
	delay_days_after_previous: number;
};

type EnrollmentRow = {
	id: string;
	user_id: string | null;
	recipient_email: string;
	recipient_source: string;
	status: string;
	current_step_number: number;
	next_step_number: number | null;
	enrolled_at: string;
	next_send_at: string | null;
	last_sent_at: string | null;
	exit_reason: string | null;
	failure_count: number;
	last_error: string | null;
};

type EmailSendRow = {
	subject: string;
	status: string;
	opened_at: string | null;
	clicked_at: string | null;
	recipient_source_id: string | null;
};

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

	const steps: StepRow[] = stepsResult.data || [];
	const enrollments: EnrollmentRow[] = enrollmentsResult.data || [];

	// Match email_sends to sequence steps by subject for per-step delivery metrics
	const stepSubjects = steps.map((s) => s.subject);

	const { data: emailSends } = stepSubjects.length
		? await supabase
				.from('email_sends')
				.select('subject, status, opened_at, clicked_at, recipient_source_id')
				.in('subject', stepSubjects)
		: { data: [] };
	const sequenceEmailSends: EmailSendRow[] = emailSends || [];

	const stepMetrics = steps.map((step) => {
		const sends = sequenceEmailSends.filter((emailSend) => emailSend.subject === step.subject);
		const delivered = sends.filter(
			(emailSend) => emailSend.status === 'sent' || emailSend.status === 'delivered'
		);
		const opened = sends.filter((emailSend) => emailSend.opened_at);
		const clicked = sends.filter((emailSend) => emailSend.clicked_at);
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

	const returnVisits: Record<string, ReturnVisitData> = {};

	if (userIds.length > 0) {
		const { data: directSessions } = await supabase
			.from('page_analytics_sessions')
			.select('id, user_id, fingerprint, last_seen_at')
			.in('user_id', userIds)
			.order('last_seen_at', { ascending: false });

		const fingerprints = [
			...new Set(
				(directSessions || [])
					.map((session: AnalyticsSessionRow) => session.fingerprint)
					.filter((fingerprint): fingerprint is string => Boolean(fingerprint))
			)
		];

		let fingerprintSessions: AnalyticsSessionRow[] = [];
		if (fingerprints.length > 0) {
			const { data: fingerprintSessionData } = await supabase
				.from('page_analytics_sessions')
				.select('id, user_id, fingerprint, last_seen_at')
				.in('fingerprint', fingerprints)
				.order('last_seen_at', { ascending: false });

			fingerprintSessions = (fingerprintSessionData || []) as AnalyticsSessionRow[];
		}

		Object.assign(
			returnVisits,
			buildReturnVisitsByUser((directSessions || []) as AnalyticsSessionRow[], fingerprintSessions)
		);
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
