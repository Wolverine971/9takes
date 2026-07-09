// src/lib/server/emailSequences.ts
import {
	getReactivationSequenceKeyForBucket,
	prepareSequenceSend,
	REACTIVATION_SEQUENCE_KEYS,
	WELCOME_SEQUENCE_KEY,
	type ReactivationBucket,
	type ReactivationSequenceKey,
	type SequenceSendRow
} from '$lib/email/sequences';
import { sendEmailWithTracking } from '$lib/email/sender';
import { getSuppressedEmailSet, normalizeEmail } from '$lib/email/suppression';
import { getSupabaseAdminClient } from './supabaseAdmin';
import { loadReactivationCandidateSummary } from './reactivationCandidates';

type SequenceProcessingSummary = {
	claimed: number;
	sent: number;
	skipped: number;
	errors: number;
};

type ReactivationEnrollmentOptions = {
	dryRun?: boolean;
	limit?: number;
	buckets?: ReactivationBucket[];
};

type ReactivationEnrollmentSummary = {
	dryRun: boolean;
	limit: number;
	enrolled: Record<ReactivationBucket, number>;
	candidates: Record<ReactivationBucket, number>;
	skipped: { reason: string; count: number }[];
	errors: { email: string; reason: string }[];
};

const REACTIVATION_SEQUENCE_KEY_SET = new Set<string>(REACTIVATION_SEQUENCE_KEYS);

function getClaimedSequenceRows(data: SequenceSendRow[] | null | undefined) {
	return (data ?? []).filter((row) => row.sequence_key);
}

function normalizeLimit(limit: number | undefined): number {
	if (limit === undefined || !Number.isFinite(limit)) {
		return 50;
	}

	return Math.min(1000, Math.max(0, Math.floor(limit)));
}

function emptyBucketCounts(): Record<ReactivationBucket, number> {
	return {
		cold: 0,
		dormant: 0,
		zombies: 0
	};
}

async function markEnrollmentErrored(enrollmentId: string, message: string) {
	const supabase = getSupabaseAdminClient() as any;

	await supabase
		.from('email_sequence_enrollments')
		.update({
			status: 'errored',
			next_send_at: null,
			processing_started_at: null,
			last_error: message.slice(0, 1000),
			updated_at: new Date().toISOString()
		})
		.eq('id', enrollmentId)
		.eq('status', 'processing');
}

async function exitUserFromSequence(userId: string, sequenceKey: string, reason: string) {
	const supabase = getSupabaseAdminClient() as any;
	const { data, error } = await supabase.rpc('exit_user_from_sequence', {
		p_user_id: userId,
		p_sequence_key: sequenceKey,
		p_reason: reason
	});

	if (error) {
		throw error;
	}

	return (data as number | null) ?? 0;
}

async function exitEmailFromSequence(email: string, sequenceKey: string, reason: string) {
	const supabase = getSupabaseAdminClient() as any;
	const { data, error } = await supabase.rpc('exit_email_from_sequence', {
		p_email: email,
		p_sequence_key: sequenceKey,
		p_reason: reason
	});

	if (error) {
		throw error;
	}

	return (data as number | null) ?? 0;
}

export async function enrollUserInWelcomeSequence(userId: string, email: string) {
	const supabase = getSupabaseAdminClient() as any;
	const { data, error } = await supabase.rpc('enroll_user_in_sequence', {
		p_user_id: userId,
		p_email: email,
		p_sequence_key: WELCOME_SEQUENCE_KEY,
		p_recipient_source: 'profiles',
		p_recipient_source_id: userId
	});

	if (error) {
		throw error;
	}

	return (data as string | null) ?? null;
}

export async function exitWelcomeSequenceForUser(userId: string, reason: string) {
	return exitUserFromSequence(userId, WELCOME_SEQUENCE_KEY, reason);
}

export async function exitWelcomeSequenceForEmail(email: string, reason: string) {
	return exitEmailFromSequence(email, WELCOME_SEQUENCE_KEY, reason);
}

export async function exitReactivationSequencesForEmail(email: string, reason: string) {
	let exited = 0;

	for (const sequenceKey of REACTIVATION_SEQUENCE_KEYS) {
		exited += await exitEmailFromSequence(email, sequenceKey, reason);
	}

	return exited;
}

export async function enrollDormantCandidatesInReactivationSequence(
	options: ReactivationEnrollmentOptions = {}
): Promise<ReactivationEnrollmentSummary> {
	const dryRun = options.dryRun ?? true;
	const limit = normalizeLimit(options.limit);
	const supabase = getSupabaseAdminClient() as any;
	const enrolled = emptyBucketCounts();
	const errors: ReactivationEnrollmentSummary['errors'] = [];
	const candidateSummary = await loadReactivationCandidateSummary(supabase, {
		limit,
		buckets: options.buckets
	});

	if (dryRun) {
		return {
			dryRun,
			limit: candidateSummary.limit,
			enrolled,
			candidates: candidateSummary.counts,
			skipped: candidateSummary.skipped,
			errors
		};
	}

	for (const candidate of candidateSummary.candidates) {
		const sequenceKey: ReactivationSequenceKey = getReactivationSequenceKeyForBucket(
			candidate.bucket
		);

		if (!REACTIVATION_SEQUENCE_KEY_SET.has(sequenceKey)) {
			errors.push({ email: candidate.email, reason: `Unknown sequence for ${candidate.bucket}` });
			continue;
		}

		const { error } = await supabase.rpc('enroll_user_in_sequence', {
			p_user_id: candidate.userId,
			p_email: candidate.email,
			p_sequence_key: sequenceKey,
			p_recipient_source: 'profiles',
			p_recipient_source_id: candidate.userId
		});

		if (error) {
			errors.push({ email: candidate.email, reason: error.message || 'Enrollment failed' });
			continue;
		}

		enrolled[candidate.bucket]++;
	}

	return {
		dryRun,
		limit: candidateSummary.limit,
		enrolled,
		candidates: candidateSummary.counts,
		skipped: candidateSummary.skipped,
		errors
	};
}

async function processClaimedSequenceSends(
	supabase: any,
	claimed: SequenceSendRow[]
): Promise<SequenceProcessingSummary> {
	if (claimed.length === 0) {
		return { claimed: 0, sent: 0, skipped: 0, errors: 0 };
	}

	const suppressedEmails = await getSuppressedEmailSet(
		supabase,
		claimed.map((row) => row.recipient_email)
	);
	const summary: SequenceProcessingSummary = {
		claimed: claimed.length,
		sent: 0,
		skipped: 0,
		errors: 0
	};

	for (const row of claimed) {
		const normalizedEmail = normalizeEmail(row.recipient_email);

		if (suppressedEmails.has(normalizedEmail)) {
			try {
				await exitEmailFromSequence(row.recipient_email, row.sequence_key, 'unsubscribed');
				summary.skipped++;
			} catch (suppressionError) {
				console.error(
					'Failed to exit suppressed sequence enrollment',
					row.enrollment_id,
					suppressionError
				);
				await supabase.rpc('retry_or_fail_sequence_send', {
					p_enrollment_id: row.enrollment_id,
					p_error: 'Suppressed recipient could not be exited before send'
				});
				summary.errors++;
			}
			continue;
		}

		const prepared = prepareSequenceSend(row);
		let emailSent = false;

		try {
			const sendResult = await sendEmailWithTracking(supabase, {
				recipient: prepared.recipient,
				subject: prepared.subject,
				preheader: prepared.preheader,
				htmlContent: prepared.htmlContent,
				plainTextContent: prepared.plainText,
				sequenceEnrollmentId: row.enrollment_id,
				sequenceStepNumber: row.step_number,
				sentBy: null,
				includeFooter: true
			});

			if (!sendResult.success) {
				await supabase.rpc('retry_or_fail_sequence_send', {
					p_enrollment_id: row.enrollment_id,
					p_error: sendResult.error || 'Failed to send sequence email'
				});
				summary.errors++;
				continue;
			}

			emailSent = true;

			const { error: finalizeError } = await supabase.rpc('complete_sequence_send', {
				p_enrollment_id: row.enrollment_id,
				p_email_send_id: sendResult.emailSend?.id ?? null
			});

			if (finalizeError) {
				console.error(
					'Failed to finalize sequence send after delivery',
					row.enrollment_id,
					finalizeError
				);
				await markEnrollmentErrored(
					row.enrollment_id,
					'Email sent successfully, but sequence advancement failed'
				);
				summary.errors++;
				continue;
			}

			summary.sent++;
		} catch (sendError) {
			console.error('Unexpected sequence send error', row.enrollment_id, sendError);

			if (emailSent) {
				await markEnrollmentErrored(
					row.enrollment_id,
					'Email sent successfully, but sequence processing crashed before completion'
				);
			} else {
				await supabase.rpc('retry_or_fail_sequence_send', {
					p_enrollment_id: row.enrollment_id,
					p_error:
						sendError instanceof Error ? sendError.message : 'Unexpected sequence processing error'
				});
			}

			summary.errors++;
		}
	}

	return summary;
}

export async function processPendingSequenceSends(limit = 10): Promise<SequenceProcessingSummary> {
	const supabase = getSupabaseAdminClient() as any;
	const { data, error } = await supabase.rpc('claim_pending_sequence_sends', {
		p_limit: limit
	});

	if (error) {
		throw error;
	}

	return processClaimedSequenceSends(
		supabase,
		getClaimedSequenceRows(data as SequenceSendRow[] | null)
	);
}

export async function processSequenceEnrollmentNow(
	enrollmentId: string
): Promise<SequenceProcessingSummary> {
	const supabase = getSupabaseAdminClient() as any;
	const { data, error } = await supabase.rpc('claim_specific_sequence_send', {
		p_enrollment_id: enrollmentId
	});

	if (error) {
		throw error;
	}

	return processClaimedSequenceSends(
		supabase,
		getClaimedSequenceRows(data as SequenceSendRow[] | null)
	);
}
