// src/lib/server/emailSequences.ts
import {
	prepareSequenceSend,
	WELCOME_SEQUENCE_KEY,
	type SequenceSendRow
} from '$lib/email/sequences';
import { sendEmailWithTracking } from '$lib/email/sender';
import { getSuppressedEmailSet, normalizeEmail } from '$lib/email/suppression';
import { getSupabaseAdminClient } from './supabaseAdmin';

type SequenceProcessingSummary = {
	claimed: number;
	sent: number;
	skipped: number;
	errors: number;
};

function getClaimedSequenceRows(data: SequenceSendRow[] | null | undefined) {
	return (data ?? []).filter((row) => row.sequence_key);
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
				htmlContent: prepared.htmlContent,
				plainTextContent: prepared.plainText,
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
