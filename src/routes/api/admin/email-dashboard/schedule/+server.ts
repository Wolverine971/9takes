// src/routes/api/admin/email-dashboard/schedule/+server.ts
// Schedule emails for future delivery

import { error, isHttpError, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSuppressedEmailSet, normalizeEmail } from '$lib/email/suppression';
import { requireAdmin } from '$lib/server/adminAuth';
import {
	adminScheduledEmailStatusSchema,
	adminScheduleEmailSchema
} from '$lib/validation/adminEmailSchemas';

export const POST: RequestHandler = async ({ request, locals }) => {
	const { session, supabase } = await requireAdmin(locals);

	try {
		const parsed = adminScheduleEmailSchema.safeParse(await request.json().catch(() => null));
		if (!parsed.success) {
			throw error(400, 'Invalid scheduled email payload');
		}
		const body = parsed.data;
		const { recipients, subject, html_content, scheduled_for, campaign_id } = body;

		const scheduledDate = new Date(scheduled_for);
		if (Number.isNaN(scheduledDate.getTime())) {
			throw error(400, 'Invalid scheduled time');
		}

		if (scheduledDate <= new Date()) {
			throw error(400, 'Scheduled time must be in the future');
		}

		const scheduledForIso = scheduledDate.toISOString();

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

		// Create scheduled email record
		const { data: scheduledEmail, error: insertError } = await supabase
			.from('scheduled_emails')
			.insert({
				subject,
				html_content,
				recipients: validRecipients,
				scheduled_for: scheduledForIso,
				campaign_id: campaign_id || null,
				created_by: session.user.id,
				status: 'pending'
			} as any)
			.select(
				'id, draft_id, subject, recipients, campaign_id, scheduled_for, status, processed_at, emails_sent, emails_failed, created_by, created_at'
			)
			.single();

		if (insertError) {
			console.error('Error scheduling email:', insertError);
			throw error(500, 'Failed to schedule email');
		}

		return json({
			success: true,
			scheduled_email: scheduledEmail,
			recipient_count: validRecipients.length,
			excluded_count: recipients.length - validRecipients.length
		});
	} catch (e) {
		if (isHttpError(e)) throw e;
		console.error('Error scheduling emails:', e);
		if (e instanceof Error && 'status' in e) {
			throw e;
		}
		throw error(500, 'Failed to schedule emails');
	}
};

// GET - List scheduled emails
export const GET: RequestHandler = async ({ url, locals }) => {
	const { supabase } = await requireAdmin(locals);

	const parsedStatus = adminScheduledEmailStatusSchema.safeParse(url.searchParams.get('status'));
	if (!parsedStatus.success) {
		throw error(400, 'Invalid scheduled email status');
	}
	const status = parsedStatus.data;

	try {
		let query = supabase
			.from('scheduled_emails')
			.select(
				'id, draft_id, subject, recipients, campaign_id, scheduled_for, status, processed_at, emails_sent, emails_failed, created_by, created_at'
			)
			.order('scheduled_for', { ascending: true });

		if (status) {
			query = query.eq('status', status);
		}

		const { data: scheduledEmails, error: fetchError } = await query;

		if (fetchError) {
			console.error('Error fetching scheduled emails:', fetchError);
			throw error(500, 'Failed to fetch scheduled emails');
		}

		return json({ scheduled_emails: scheduledEmails || [] });
	} catch (e) {
		if (isHttpError(e)) throw e;
		console.error('Error in schedule GET:', e);
		if (e instanceof Error && 'status' in e) {
			throw e;
		}
		throw error(500, 'Internal server error');
	}
};
