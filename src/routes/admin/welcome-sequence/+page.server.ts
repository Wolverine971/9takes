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
import type { SequenceStepMetric } from '$lib/server/emailSequenceMetrics';

const TEST_UNSUBSCRIBE_URL = 'https://9takes.com/api/track/unsubscribe/test-preview';
const RECENT_ENROLLMENT_LIMIT = 200;
const QUEUED_ENROLLMENT_LIMIT = 100;
const ENROLLMENT_COLUMNS =
	'id, user_id, recipient_email, recipient_source, status, current_step_number, next_step_number, enrolled_at, next_send_at, last_sent_at, exit_reason, failure_count, last_error';

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

type WelcomeFunnelCounts = {
	total_enrolled: number;
	reached_step_1: number;
	reached_step_2: number;
	reached_step_3: number;
	reached_step_4: number;
	completed: number;
	exited: number;
	errored: number;
	active: number;
};

async function loadWelcomeFunnelCounts(
	supabase: App.Locals['supabase'],
	sequenceId: string
): Promise<WelcomeFunnelCounts> {
	const baseQuery = () =>
		supabase
			.from('email_sequence_enrollments')
			.select('id', { count: 'exact', head: true })
			.eq('sequence_id', sequenceId);
	const results = await Promise.all([
		baseQuery(),
		baseQuery().gte('current_step_number', 1),
		baseQuery().gte('current_step_number', 2),
		baseQuery().gte('current_step_number', 3),
		baseQuery().gte('current_step_number', 4),
		baseQuery().eq('status', 'completed'),
		baseQuery().eq('status', 'exited'),
		baseQuery().eq('status', 'errored'),
		baseQuery().eq('status', 'active')
	]);
	const failed = results.find((result) => result.error);
	if (failed?.error) throw failed.error;
	const count = (index: number) => results[index]?.count ?? 0;

	return {
		total_enrolled: count(0),
		reached_step_1: count(1),
		reached_step_2: count(2),
		reached_step_3: count(3),
		reached_step_4: count(4),
		completed: count(5),
		exited: count(6),
		errored: count(7),
		active: count(8)
	};
}

type StepMetricCounts = Pick<SequenceStepMetric, 'total_sent' | 'total_opened' | 'total_clicked'>;

type StepMetricsRpcRow = {
	step_number: number;
	total_sent: number | string;
	total_opened: number | string;
	total_clicked: number | string;
};

// Added by supabase/migrations/20261003150000_admin_welcome_sequence_perf.sql;
// the generated Database types predate it.
const STEP_METRICS_RPC = 'admin_sequence_step_metrics';

type StepMetricsRpcClient = {
	rpc: (
		fn: typeof STEP_METRICS_RPC,
		args: { p_sequence_id: string }
	) => PromiseLike<{ data: unknown; error: unknown }>;
};

function isMissingRpc(err: unknown): boolean {
	if (!err || typeof err !== 'object') return false;
	const { code, message } = err as { code?: unknown; message?: unknown };
	return (
		code === 'PGRST202' ||
		code === '42883' ||
		String(message ?? '').includes('Could not find the function')
	);
}

// One grouped query for every step. Null while the migration is pending.
async function loadGroupedStepMetricCounts(
	supabase: App.Locals['supabase'],
	sequenceId: string
): Promise<Map<number, StepMetricCounts> | null> {
	const { data, error } = await (supabase as unknown as StepMetricsRpcClient).rpc(
		STEP_METRICS_RPC,
		{ p_sequence_id: sequenceId }
	);
	if (error) {
		if (isMissingRpc(error)) return null;
		throw error;
	}

	return new Map(
		((data ?? []) as StepMetricsRpcRow[]).map((row) => [
			row.step_number,
			{
				total_sent: Number(row.total_sent),
				total_opened: Number(row.total_opened),
				total_clicked: Number(row.total_clicked)
			}
		])
	);
}

// Pre-migration fallback: three exact counts per step.
async function countStepMetrics(
	supabase: App.Locals['supabase'],
	sequenceId: string,
	steps: StepRow[]
): Promise<Map<number, StepMetricCounts>> {
	const entries = await Promise.all(
		steps.map(async (step) => {
			const baseQuery = () =>
				supabase
					.from('email_sends')
					.select('id', { count: 'exact', head: true })
					.eq('sequence_id', sequenceId)
					.eq('sequence_step_number', step.step_number);
			const [deliveredResult, openedResult, clickedResult] = await Promise.all([
				baseQuery().in('status', ['sent', 'delivered']),
				baseQuery().not('opened_at', 'is', null),
				baseQuery().not('clicked_at', 'is', null)
			]);
			const failed = [deliveredResult, openedResult, clickedResult].find((result) => result.error);
			if (failed?.error) throw failed.error;

			return [
				step.step_number,
				{
					total_sent: deliveredResult.count ?? 0,
					total_opened: openedResult.count ?? 0,
					total_clicked: clickedResult.count ?? 0
				}
			] as const;
		})
	);

	return new Map(entries);
}

async function loadSequenceStepMetrics(
	supabase: App.Locals['supabase'],
	sequenceId: string,
	stepsPromise: PromiseLike<StepRow[]>
): Promise<SequenceStepMetric[]> {
	// The grouped query doesn't need the step list, so it runs alongside the steps query.
	const [steps, groupedCounts] = await Promise.all([
		stepsPromise,
		loadGroupedStepMetricCounts(supabase, sequenceId)
	]);
	const counts = groupedCounts ?? (await countStepMetrics(supabase, sequenceId, steps));

	return steps.map((step) => {
		const stepCounts = counts.get(step.step_number);
		const totalSent = stepCounts?.total_sent ?? 0;
		const totalOpened = stepCounts?.total_opened ?? 0;
		const totalClicked = stepCounts?.total_clicked ?? 0;

		return {
			step_number: step.step_number,
			subject: step.subject,
			total_sent: totalSent,
			total_opened: totalOpened,
			total_clicked: totalClicked,
			open_rate: totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0,
			click_rate: totalSent > 0 ? Math.round((totalClicked / totalSent) * 100) : 0
		};
	});
}

// Sessions tied to these users, plus every session on a device they signed in on.
async function loadReturnVisits(
	supabase: App.Locals['supabase'],
	enrollments: EnrollmentRow[]
): Promise<Record<string, ReturnVisitData>> {
	const userIds = [...new Set(enrollments.map((e) => e.user_id).filter(Boolean))] as string[];
	if (userIds.length === 0) return {};

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

	return buildReturnVisitsByUser(
		(directSessions || []) as AnalyticsSessionRow[],
		fingerprintSessions
	);
}

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

async function loadWelcomeSequencePage(locals: App.Locals) {
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
			enrollmentWindowLimit: RECENT_ENROLLMENT_LIMIT,
			adminEmail: session?.user?.email ?? ''
		};
	}

	// Everything below needs only the sequence row, so it runs as independent chains in one
	// stage: steps -> step metrics, recent enrollments -> return visits, and the rest.
	const stepsPromise = supabase
		.from('email_sequence_steps')
		.select('step_number, subject, html_content, plain_text, delay_days_after_previous')
		.eq('sequence_id', sequence.id)
		.order('step_number', { ascending: true })
		.then(({ data, error }) => {
			if (error) throw error;
			return ((data || []) as DbStepRow[]).map((step) => buildEffectiveStep(sequence.key, step));
		});
	const enrollmentsPromise = supabase
		.from('email_sequence_enrollments')
		.select(ENROLLMENT_COLUMNS)
		.eq('sequence_id', sequence.id)
		.order('enrolled_at', { ascending: false })
		.limit(RECENT_ENROLLMENT_LIMIT)
		.then(({ data, error }): EnrollmentRow[] => {
			if (error) throw error;
			return data || [];
		});

	const [
		steps,
		enrollments,
		queueEnrollments,
		scheduledEmailsResult,
		funnelCounts,
		// Aggregate by immutable sequence/step identity without transferring every send row.
		stepMetrics,
		// Get return visits for enrolled users from page analytics
		returnVisits
	] = await Promise.all([
		stepsPromise,
		enrollmentsPromise,
		supabase
			.from('email_sequence_enrollments')
			.select(ENROLLMENT_COLUMNS)
			.eq('sequence_id', sequence.id)
			.in('status', ['active', 'processing'])
			.not('next_step_number', 'is', null)
			.not('next_send_at', 'is', null)
			.order('next_send_at', { ascending: true })
			.limit(QUEUED_ENROLLMENT_LIMIT)
			.then(({ data, error }): EnrollmentRow[] => {
				if (error) throw error;
				return data || [];
			}),
		supabase
			.from('scheduled_emails')
			.select('id, subject, scheduled_for, status, recipients, created_at')
			.in('status', ['pending', 'processing'])
			.order('scheduled_for', { ascending: true })
			.limit(25),
		loadWelcomeFunnelCounts(supabase, sequence.id),
		loadSequenceStepMetrics(supabase, sequence.id, stepsPromise),
		enrollmentsPromise.then((rows) => loadReturnVisits(supabase, rows))
	]);

	const nowTime = Date.now();
	const stepsByNumber = new Map(steps.map((step) => [step.step_number, step]));
	const queuedEnrollments: QueueRow[] = queueEnrollments
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
		.slice(0, QUEUED_ENROLLMENT_LIMIT);
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
		enrollmentWindowLimit: RECENT_ENROLLMENT_LIMIT,
		adminEmail: session?.user?.email ?? ''
	};
}

export const load: PageServerLoad = async ({ locals, parent }) => {
	// Awaiting parent() runs the admin layout's guard even on a crafted __data.json request
	// that skips layouts. It runs alongside the queries, not in front of them.
	const [, pageData] = await Promise.all([parent(), loadWelcomeSequencePage(locals)]);
	return pageData;
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
