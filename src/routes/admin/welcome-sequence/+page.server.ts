// src/routes/admin/welcome-sequence/+page.server.ts
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import {
	buildReturnVisitsByUser,
	type AnalyticsSessionRow,
	type ReturnVisitData
} from '$lib/server/welcomeSequenceReturns';
import { getManagedSequenceContent } from '$lib/email/welcome-sequence-content';
import { generateEmailHtml } from '$lib/email/base-template';
import { prepareSequenceSend, type SequenceSendRow } from '$lib/email/sequences';
import { sendEmail } from '$lib/email/sender';
import { logger } from '$lib/utils/logger';

const TEST_UNSUBSCRIBE_URL = 'https://9takes.com/api/track/unsubscribe/test-preview';

type StepRow = {
	step_number: number;
	subject: string;
	html_content: string;
	plain_text: string | null;
	preheader?: string;
	preview_html?: string;
	delay_days_after_previous: number;
	code_managed?: boolean;
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
	status: string | null;
	opened_at: string | null;
	clicked_at: string | null;
	recipient_source_id: string | null;
};

type DbStepRow = {
	step_number: number;
	subject: string;
	html_content: string;
	plain_text: string | null;
	delay_days_after_previous: number;
};

type QueueRow = EnrollmentRow & {
	next_step_subject: string;
	next_step_preheader?: string;
	due_now: boolean;
	code_managed: boolean;
};

type ScheduledEmailQueueRow = {
	id: string;
	subject: string;
	scheduled_for: string;
	status: string | null;
	recipient_count: number;
	created_at: string | null;
};

function buildSequenceRow({
	sequenceKey,
	step,
	email,
	name = 'DJ',
	userId = '00000000-0000-0000-0000-000000000000'
}: {
	sequenceKey: string;
	step: DbStepRow;
	email: string;
	name?: string;
	userId?: string;
}): SequenceSendRow {
	return {
		enrollment_id: 'preview',
		sequence_key: sequenceKey,
		user_id: userId,
		recipient_email: email,
		recipient_source: 'profiles',
		recipient_source_id: userId,
		recipient_name: name,
		enneagram: null,
		step_number: step.step_number,
		subject: step.subject,
		html_content: step.html_content,
		plain_text: step.plain_text
	};
}

function buildEffectiveStep(sequenceKey: string, step: DbStepRow): StepRow {
	const prepared = prepareSequenceSend(
		buildSequenceRow({
			sequenceKey,
			step,
			email: 'preview@9takes.com'
		})
	);
	const managedContent = getManagedSequenceContent(sequenceKey, step.step_number);

	return {
		step_number: step.step_number,
		subject: prepared.subject,
		preheader: prepared.preheader,
		html_content: prepared.htmlContent,
		plain_text: prepared.plainText ?? null,
		preview_html: generateEmailHtml({
			subject: prepared.subject,
			preheader: prepared.preheader,
			content: prepared.htmlContent,
			recipientName: 'DJ',
			unsubscribeUrl: TEST_UNSUBSCRIBE_URL,
			includeFooter: true
		}),
		delay_days_after_previous: step.delay_days_after_previous,
		code_managed: Boolean(managedContent)
	};
}

export const load: PageServerLoad = async ({ locals }) => {
	const supabase = locals.supabase;
	const session = locals.session;

	const { data: sequence } = await supabase
		.from('email_sequences')
		.select('id, key, display_name, status, trigger_type')
		.eq('key', 'welcome_sequence')
		.maybeSingle();

	if (!sequence) {
		return {
			sequence: null,
			steps: [],
			enrollments: [],
			queuedEnrollments: [],
			scheduledEmails: [],
			stepMetrics: [],
			funnelCounts: null,
			adminEmail: session?.user?.email ?? ''
		};
	}

	const [stepsResult, enrollmentsResult, scheduledEmailsResult] = await Promise.all([
		supabase
			.from('email_sequence_steps')
			.select('step_number, subject, html_content, plain_text, delay_days_after_previous')
			.eq('sequence_id', sequence.id)
			.order('step_number', { ascending: true }),
		supabase
			.from('email_sequence_enrollments')
			.select(
				'id, user_id, recipient_email, recipient_source, status, current_step_number, next_step_number, enrolled_at, next_send_at, last_sent_at, exit_reason, failure_count, last_error'
			)
			.eq('sequence_id', sequence.id)
			.order('enrolled_at', { ascending: false }),
		supabase
			.from('scheduled_emails')
			.select('id, subject, scheduled_for, status, recipients, created_at')
			.in('status', ['pending', 'processing'])
			.order('scheduled_for', { ascending: true })
			.limit(25)
	]);

	const dbSteps = (stepsResult.data || []) as DbStepRow[];
	const steps = dbSteps.map((step) => buildEffectiveStep(sequence.key, step));
	const enrollments: EnrollmentRow[] = enrollmentsResult.data || [];
	const nowTime = Date.now();
	const stepsByNumber = new Map(steps.map((step) => [step.step_number, step]));
	const queuedEnrollments: QueueRow[] = enrollments
		.filter((enrollment) => {
			return (
				(enrollment.status === 'active' || enrollment.status === 'processing') &&
				enrollment.next_step_number !== null &&
				enrollment.next_send_at !== null
			);
		})
		.map((enrollment) => {
			const nextStep = enrollment.next_step_number
				? stepsByNumber.get(enrollment.next_step_number)
				: null;
			return {
				...enrollment,
				next_step_subject: nextStep?.subject ?? `Step ${enrollment.next_step_number ?? '-'}`,
				next_step_preheader: nextStep?.preheader,
				due_now: enrollment.next_send_at
					? new Date(enrollment.next_send_at).getTime() <= nowTime
					: false,
				code_managed: Boolean(nextStep?.code_managed)
			};
		})
		.sort((a, b) => {
			const aTime = a.next_send_at ? new Date(a.next_send_at).getTime() : Number.MAX_SAFE_INTEGER;
			const bTime = b.next_send_at ? new Date(b.next_send_at).getTime() : Number.MAX_SAFE_INTEGER;
			return aTime - bTime;
		})
		.slice(0, 100);
	const scheduledEmails: ScheduledEmailQueueRow[] = (scheduledEmailsResult.data || []).map(
		(scheduled) => ({
			id: scheduled.id,
			subject: scheduled.subject,
			scheduled_for: scheduled.scheduled_for,
			status: scheduled.status,
			recipient_count: Array.isArray(scheduled.recipients) ? scheduled.recipients.length : 0,
			created_at: scheduled.created_at
		})
	);

	// Match email_sends to sequence steps by subject for per-step delivery metrics
	const stepSubjects = [
		...new Set([
			...steps.map((s) => s.subject),
			...dbSteps.map((s) => s.subject).filter((subject): subject is string => Boolean(subject))
		])
	];

	const { data: emailSends } = stepSubjects.length
		? await supabase
				.from('email_sends')
				.select('subject, status, opened_at, clicked_at, recipient_source_id')
				.in('subject', stepSubjects)
		: { data: [] };
	const sequenceEmailSends: EmailSendRow[] = emailSends || [];

	const stepMetrics = steps.map((step) => {
		const dbStep = dbSteps.find((candidate) => candidate.step_number === step.step_number);
		const acceptedSubjects = new Set([step.subject, dbStep?.subject].filter(Boolean));
		const sends = sequenceEmailSends.filter((emailSend) => acceptedSubjects.has(emailSend.subject));
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
		queuedEnrollments,
		scheduledEmails,
		stepMetrics,
		funnelCounts,
		adminEmail: session?.user?.email ?? ''
	};
};

export const actions: Actions = {
	sendTestWelcomeEmail: async ({ request, locals }) => {
		const session = locals.session;
		const supabase = locals.supabase;

		if (!session?.user?.id) {
			return fail(401, { error: 'Unauthorized' });
		}

		const { data: profile } = await supabase
			.from('profiles')
			.select('admin')
			.eq('id', session.user.id)
			.single();

		if (!profile?.admin) {
			return fail(403, { error: 'Admin access required' });
		}

		const formData = await request.formData();
		const email = String(formData.get('testEmail') || '')
			.trim()
			.toLowerCase();
		const stepNumber = Number.parseInt(String(formData.get('stepNumber') || '1'), 10);
		const mode = String(formData.get('mode') || 'single');

		if (!email || !/\S+@\S+\.\S+/.test(email)) {
			return fail(400, { error: 'Enter a valid test email address' });
		}

		const { data: sequence } = await supabase
			.from('email_sequences')
			.select('id, key')
			.eq('key', 'welcome_sequence')
			.maybeSingle();

		if (!sequence) {
			return fail(404, { error: 'Welcome sequence not found' });
		}

		const { data: dbSteps, error: stepsError } = await supabase
			.from('email_sequence_steps')
			.select('step_number, subject, html_content, plain_text, delay_days_after_previous')
			.eq('sequence_id', sequence.id)
			.order('step_number', { ascending: true });

		if (stepsError || !dbSteps?.length) {
			return fail(500, { error: 'Unable to load welcome sequence steps' });
		}

		const requestedSteps =
			mode === 'flow'
				? ((dbSteps || []) as DbStepRow[])
				: ((dbSteps || []) as DbStepRow[]).filter((step) => step.step_number === stepNumber);

		if (requestedSteps.length === 0) {
			return fail(400, { error: 'Selected welcome sequence step does not exist' });
		}

		let sent = 0;
		for (const step of requestedSteps) {
			const prepared = prepareSequenceSend(
				buildSequenceRow({
					sequenceKey: sequence.key,
					step,
					email,
					name: 'there',
					userId: session.user.id
				})
			);
			const result = await sendEmail({
				to: email,
				subject: `[TEST] ${prepared.subject}`,
				preheader: prepared.preheader,
				htmlContent: prepared.htmlContent,
				plainTextContent: prepared.plainText,
				recipientName: 'there',
				unsubscribeUrl: TEST_UNSUBSCRIBE_URL,
				includeFooter: true
			});

			if (!result.success) {
				logger.error('Failed to send welcome sequence test email', new Error(result.error), {
					email,
					stepNumber: step.step_number,
					adminId: session.user.id
				});
				return fail(500, {
					error: result.error || `Failed to send test email for step ${step.step_number}`,
					sent
				});
			}

			sent++;
		}

		return {
			success: true,
			sent,
			email,
			mode,
			stepNumber: mode === 'flow' ? null : stepNumber
		};
	}
};
