// src/lib/server/emailAdminSequences.ts
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../../database.types';
import { WELCOME_SEQUENCE_KEY } from '$lib/email/sequences';

type SequenceRow = Database['public']['Tables']['email_sequences']['Row'];
type SequenceEnrollmentRow = Database['public']['Tables']['email_sequence_enrollments']['Row'];

export type WelcomeSequenceEnrollmentReview = Pick<
	SequenceEnrollmentRow,
	| 'id'
	| 'recipient_email'
	| 'recipient_source'
	| 'status'
	| 'current_step_number'
	| 'next_step_number'
	| 'enrolled_at'
	| 'next_send_at'
	| 'last_sent_at'
	| 'exit_reason'
	| 'failure_count'
	| 'last_error'
	| 'updated_at'
>;

export type WelcomeSequenceOverview = {
	sequence: Pick<SequenceRow, 'id' | 'key' | 'display_name' | 'status' | 'trigger_type'>;
	stepCount: number;
	counts: {
		total: number;
		active: number;
		processing: number;
		paused: number;
		completed: number;
		exited: number;
		errored: number;
		dueNow: number;
	};
	recentEnrollments: WelcomeSequenceEnrollmentReview[];
};

function baseEnrollmentCountQuery(supabase: SupabaseClient<Database>, sequenceId: string) {
	return supabase
		.from('email_sequence_enrollments')
		.select('*', { count: 'exact', head: true })
		.eq('sequence_id', sequenceId);
}

function exactCount(result: { count: number | null; error: unknown } | null | undefined): number {
	return result?.count ?? 0;
}

export async function getWelcomeSequenceOverview(
	supabase: SupabaseClient<Database>,
	sequenceKey = WELCOME_SEQUENCE_KEY
): Promise<WelcomeSequenceOverview | null> {
	const { data: sequence, error: sequenceError } = await supabase
		.from('email_sequences')
		.select('id, key, display_name, status, trigger_type')
		.eq('key', sequenceKey)
		.maybeSingle();

	if (sequenceError) {
		throw sequenceError;
	}

	if (!sequence) {
		return null;
	}

	const nowIso = new Date().toISOString();
	const [
		stepCountResult,
		totalResult,
		activeResult,
		processingResult,
		pausedResult,
		completedResult,
		exitedResult,
		erroredResult,
		dueNowResult,
		recentResult
	] = await Promise.all([
		supabase
			.from('email_sequence_steps')
			.select('*', { count: 'exact', head: true })
			.eq('sequence_id', sequence.id),
		baseEnrollmentCountQuery(supabase, sequence.id),
		baseEnrollmentCountQuery(supabase, sequence.id).eq('status', 'active'),
		baseEnrollmentCountQuery(supabase, sequence.id).eq('status', 'processing'),
		baseEnrollmentCountQuery(supabase, sequence.id).eq('status', 'paused'),
		baseEnrollmentCountQuery(supabase, sequence.id).eq('status', 'completed'),
		baseEnrollmentCountQuery(supabase, sequence.id).eq('status', 'exited'),
		baseEnrollmentCountQuery(supabase, sequence.id).eq('status', 'errored'),
		baseEnrollmentCountQuery(supabase, sequence.id)
			.eq('status', 'active')
			.not('next_send_at', 'is', null)
			.lte('next_send_at', nowIso),
		supabase
			.from('email_sequence_enrollments')
			.select(
				'id, recipient_email, recipient_source, status, current_step_number, next_step_number, enrolled_at, next_send_at, last_sent_at, exit_reason, failure_count, last_error, updated_at'
			)
			.eq('sequence_id', sequence.id)
			.order('updated_at', { ascending: false })
			.limit(15)
	]);

	const errors = [
		stepCountResult.error,
		totalResult.error,
		activeResult.error,
		processingResult.error,
		pausedResult.error,
		completedResult.error,
		exitedResult.error,
		erroredResult.error,
		dueNowResult.error,
		recentResult.error
	].filter(Boolean);

	if (errors.length > 0) {
		throw errors[0];
	}

	return {
		sequence,
		stepCount: exactCount(stepCountResult),
		counts: {
			total: exactCount(totalResult),
			active: exactCount(activeResult),
			processing: exactCount(processingResult),
			paused: exactCount(pausedResult),
			completed: exactCount(completedResult),
			exited: exactCount(exitedResult),
			errored: exactCount(erroredResult),
			dueNow: exactCount(dueNowResult)
		},
		recentEnrollments: (recentResult.data ?? []) as WelcomeSequenceEnrollmentReview[]
	};
}
