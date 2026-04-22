// src/lib/server/reactivationRepermission.ts
// Re-permission helpers for profiles-only reactivation emails.

import { normalizeEmail } from '$lib/email/suppression';
import { exitReactivationSequencesForEmail } from './emailSequences';
import { getSupabaseAdminClient } from './supabaseAdmin';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type EmailSendRecipient = {
	recipient_email: string;
	recipient_source: string;
	recipient_source_id: string;
};

async function getEmailSendRecipient(trackingId: string): Promise<EmailSendRecipient | null> {
	if (!UUID_PATTERN.test(trackingId)) {
		return null;
	}

	const supabase = getSupabaseAdminClient() as any;
	const { data, error } = await supabase
		.from('email_sends')
		.select('recipient_email, recipient_source, recipient_source_id')
		.eq('tracking_id', trackingId)
		.maybeSingle();

	if (error) {
		throw error;
	}

	return data ?? null;
}

export async function confirmReactivationRepermission(trackingId: string) {
	const recipient = await getEmailSendRecipient(trackingId);

	if (!recipient) {
		return null;
	}

	const supabase = getSupabaseAdminClient() as any;
	const normalizedEmail = normalizeEmail(recipient.recipient_email);
	const now = new Date().toISOString();

	if (
		recipient.recipient_source === 'profiles' &&
		UUID_PATTERN.test(recipient.recipient_source_id)
	) {
		const { error } = await supabase
			.from('profiles')
			.update({ re_permissioned_at: now })
			.eq('id', recipient.recipient_source_id);

		if (error) {
			throw error;
		}
	}

	if (normalizedEmail) {
		await supabase.from('email_unsubscribes').delete().eq('email', normalizedEmail);
		await exitReactivationSequencesForEmail(normalizedEmail, 're_permissioned');
	}

	return recipient;
}

export async function declineReactivationRepermission(trackingId: string) {
	const recipient = await getEmailSendRecipient(trackingId);

	if (!recipient) {
		return null;
	}

	const supabase = getSupabaseAdminClient() as any;
	const normalizedEmail = normalizeEmail(recipient.recipient_email);

	if (normalizedEmail) {
		const { error } = await supabase.rpc('unsubscribe_email_direct', {
			p_email: normalizedEmail,
			p_source: recipient.recipient_source,
			p_source_id: recipient.recipient_source_id,
			p_reason: 'reactivation_repermission_no'
		});

		if (error) {
			throw error;
		}

		await exitReactivationSequencesForEmail(normalizedEmail, 'unsubscribed_via_repermission');
	}

	return recipient;
}

export async function exitReactivationSequenceForTrackedClick(trackingId: string) {
	if (!UUID_PATTERN.test(trackingId)) {
		return 0;
	}

	const supabase = getSupabaseAdminClient() as any;
	const { data: emailSend, error: emailSendError } = await supabase
		.from('email_sends')
		.select('id, recipient_email')
		.eq('tracking_id', trackingId)
		.maybeSingle();

	if (emailSendError) {
		throw emailSendError;
	}

	if (!emailSend?.id || !emailSend.recipient_email) {
		return 0;
	}

	const { data: enrollments, error: enrollmentError } = await supabase
		.from('email_sequence_enrollments')
		.select('current_step_number, status, email_sequences!inner(key)')
		.eq('last_email_send_id', emailSend.id)
		.in('status', ['active', 'processing', 'paused']);

	if (enrollmentError) {
		throw enrollmentError;
	}

	const hasValueStepClick = (
		(enrollments ?? []) as Array<{
			current_step_number?: number | null;
			email_sequences?: { key?: string | null } | null;
		}>
	).some((enrollment) => {
		const sequenceKey = enrollment.email_sequences?.key ?? '';
		const stepNumber = enrollment.current_step_number ?? 0;
		return sequenceKey.startsWith('reactivation_') && stepNumber >= 1 && stepNumber <= 3;
	});

	if (!hasValueStepClick) {
		return 0;
	}

	return exitReactivationSequencesForEmail(emailSend.recipient_email, 'reactivated_click');
}
