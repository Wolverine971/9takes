// src/lib/server/stoppedEnrollments.ts
// Enrollments that hit the retry ceiling sit in `errored` until an admin decides.
// This is the same set the process-sequences cron alarms on (errored + active sequence).

export type StoppedEnrollment = {
	id: string;
	sequenceName: string;
	recipientEmail: string;
	emailConfirmed: boolean | null;
	nextStepNumber: number;
	nextSubject: string | null;
	lastError: string | null;
	lastSentAt: string | null;
	stoppedAt: string;
};

export const ADMIN_END_EXIT_REASON = 'ended_by_admin_after_error';

export async function loadStoppedEnrollments(supabase: any): Promise<StoppedEnrollment[]> {
	const { data, error } = await supabase
		.from('email_sequence_enrollments')
		.select(
			'id, sequence_id, user_id, recipient_email, next_step_number, last_error, last_sent_at, updated_at, email_sequences!inner(display_name, status)'
		)
		.eq('status', 'errored')
		.eq('email_sequences.status', 'active')
		.order('updated_at', { ascending: false })
		.limit(50);
	if (error) throw error;

	const rows = (data ?? []) as any[];
	if (rows.length === 0) return [];

	const sequenceIds = [...new Set(rows.map((row) => row.sequence_id))];
	const [stepsResult, confirmations] = await Promise.all([
		supabase
			.from('email_sequence_steps')
			.select('sequence_id, step_number, subject')
			.in('sequence_id', sequenceIds),
		Promise.all(rows.map((row) => loadEmailConfirmed(supabase, row.user_id)))
	]);
	if (stepsResult.error) throw stepsResult.error;

	const subjects = new Map<string, string>();
	for (const step of stepsResult.data ?? []) {
		subjects.set(`${step.sequence_id}:${step.step_number}`, step.subject);
	}

	return rows.map((row, index) => ({
		id: row.id,
		sequenceName: row.email_sequences.display_name,
		recipientEmail: row.recipient_email,
		emailConfirmed: confirmations[index],
		nextStepNumber: row.next_step_number,
		nextSubject: subjects.get(`${row.sequence_id}:${row.next_step_number}`) ?? null,
		lastError: row.last_error,
		lastSentAt: row.last_sent_at,
		stoppedAt: row.updated_at
	}));
}

async function loadEmailConfirmed(supabase: any, userId: string | null): Promise<boolean | null> {
	if (!userId) return null;
	try {
		const { data, error } = await supabase.auth.admin.getUserById(userId);
		if (error || !data?.user) return null;
		return Boolean(data.user.email_confirmed_at);
	} catch {
		return null;
	}
}

// Both transitions only touch rows still in `errored`, so a double-click or a
// stale page can't resurrect an enrollment someone already resolved.
async function transitionStoppedEnrollment(
	supabase: any,
	enrollmentId: string,
	changes: Record<string, unknown>
): Promise<boolean> {
	const { data, error } = await supabase
		.from('email_sequence_enrollments')
		.update({ ...changes, processing_started_at: null, updated_at: new Date().toISOString() })
		.eq('id', enrollmentId)
		.eq('status', 'errored')
		.select('id');
	if (error) throw error;
	return (data ?? []).length > 0;
}

/** Picks up at the step that failed on the next cron run, with a fresh retry budget. */
export function resumeStoppedEnrollment(supabase: any, enrollmentId: string) {
	return transitionStoppedEnrollment(supabase, enrollmentId, {
		status: 'active',
		next_send_at: new Date().toISOString(),
		failure_count: 0,
		last_error: null
	});
}

/** Ends the sequence for this recipient. Keeps last_error as the record of why. */
export function endStoppedEnrollment(supabase: any, enrollmentId: string) {
	return transitionStoppedEnrollment(supabase, enrollmentId, {
		status: 'exited',
		exit_reason: ADMIN_END_EXIT_REASON,
		next_send_at: null
	});
}
