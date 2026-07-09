// src/routes/api/admin/email-dashboard/send/+server.ts
// Send emails to selected recipients

import { error, isHttpError, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { SendEmailResponse } from '$lib/types/email';
import { sendBatchEmails } from '$lib/email/sender';
import { getSuppressedEmailSet, normalizeEmail } from '$lib/email/suppression';
import { requireAdmin } from '$lib/server/adminAuth';
import { adminSendEmailSchema } from '$lib/validation/adminEmailSchemas';

export const POST: RequestHandler = async ({ request, locals }) => {
	const { session, supabase } = await requireAdmin(locals);

	try {
		const parsed = adminSendEmailSchema.safeParse(await request.json().catch(() => null));
		if (!parsed.success) {
			throw error(400, 'Invalid email send payload');
		}
		const body = parsed.data;
		const { recipients, subject, html_content, campaign_id } = body;

		// Check suppression list (email_unsubscribes + legacy signup unsubscribes).
		const suppressedEmails = await getSuppressedEmailSet(
			supabase,
			recipients.map((r) => r.email)
		);
		const validRecipients = recipients.filter(
			(r) => !suppressedEmails.has(normalizeEmail(r.email))
		);

		if (validRecipients.length === 0) {
			throw error(400, 'All recipients have unsubscribed');
		}

		// Send emails
		const result = await sendBatchEmails(supabase, {
			recipients: validRecipients,
			subject,
			htmlContent: html_content,
			campaignId: campaign_id,
			sentBy: session.user.id,
			delayMs: 100, // 100ms delay between sends
			includeFooter: true
		});

		const response: SendEmailResponse = {
			success: result.sent > 0,
			sent: result.sent,
			failed: result.failed,
			excluded_count: recipients.length - validRecipients.length,
			results: result.results
		};

		return json(response);
	} catch (e) {
		if (isHttpError(e)) throw e;
		console.error('Error sending emails:', e);
		if (e instanceof Error && 'status' in e) {
			throw e;
		}
		throw error(500, 'Failed to send emails');
	}
};
