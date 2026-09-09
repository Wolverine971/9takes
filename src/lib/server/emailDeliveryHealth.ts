// src/lib/server/emailDeliveryHealth.ts
import { env } from '$env/dynamic/private';

export function getEmailDeliveryConfiguration(values: Record<string, string | undefined> = env) {
	const provider = values.EMAIL_MARKETING_PROVIDER?.trim().toLowerCase() || 'gmail';
	const blockers: string[] = [];
	if (!values.EMAIL_FOOTER_ADDRESS?.trim()) {
		blockers.push(
			'Add the mailing address in EMAIL_FOOTER_ADDRESS before sending marketing email.'
		);
	}
	if (provider === 'resend') {
		if (!values.RESEND_MARKETING_FROM?.trim())
			blockers.push('Configure RESEND_MARKETING_FROM for Resend delivery.');
		if (!values.RESEND_API_KEY?.trim())
			blockers.push('Configure RESEND_API_KEY for Resend delivery.');
	} else if (provider === 'gmail') {
		if (!values.PRIVATE_gmail_private_key?.trim()) {
			blockers.push('Configure the Gmail service account before sending email.');
		}
	} else {
		blockers.push('EMAIL_MARKETING_PROVIDER must be gmail or resend.');
	}
	return { provider, configured: blockers.length === 0, blockers };
}

export async function loadEmailDeliveryHealth(supabase: any) {
	const { count, error } = await supabase
		.from('email_sequence_enrollments')
		.select('email_sequences!inner(status)', { count: 'exact', head: true })
		.eq('status', 'errored')
		.eq('email_sequences.status', 'active');
	if (error) throw error;
	return { ...getEmailDeliveryConfiguration(), stoppedEnrollments: count ?? 0 };
}
