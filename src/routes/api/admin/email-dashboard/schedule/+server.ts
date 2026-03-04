// src/routes/api/admin/email-dashboard/schedule/+server.ts
// Schedule emails for future delivery

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { ScheduleEmailRequest } from '$lib/types/email';
import { getSuppressedEmailSet, normalizeEmail } from '$lib/email/suppression';

export const POST: RequestHandler = async ({ request, locals }) => {
	const session = locals.session;
	const supabase = locals.supabase;

	if (!session?.user?.id) {
		throw error(401, 'Unauthorized');
	}

	const { data: user } = await supabase
		.from('profiles')
		.select('admin')
		.eq('id', session.user.id)
		.single();

	if (!user?.admin) {
		throw error(403, 'Admin access required');
	}

	try {
		const body: ScheduleEmailRequest = await request.json();
		const { recipients, subject, html_content, scheduled_for, campaign_id } = body;

		// Validate required fields
		if (!recipients || recipients.length === 0) {
			throw error(400, 'At least one recipient is required');
		}

		if (!subject || !subject.trim()) {
			throw error(400, 'Subject is required');
		}

		if (!html_content || !html_content.trim()) {
			throw error(400, 'Email content is required');
		}

		if (!scheduled_for) {
			throw error(400, 'Scheduled time is required');
		}

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
				subject: subject.trim(),
				html_content,
				recipients: validRecipients,
				scheduled_for: scheduledForIso,
				campaign_id: campaign_id || null,
				created_by: session.user.id,
				status: 'pending'
			} as any)
			.select()
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
		console.error('Error scheduling emails:', e);
		if (e instanceof Error && 'status' in e) {
			throw e;
		}
		throw error(500, 'Failed to schedule emails');
	}
};

// GET - List scheduled emails
export const GET: RequestHandler = async ({ url, locals }) => {
	const session = locals.session;
	const supabase = locals.supabase;

	if (!session?.user?.id) {
		throw error(401, 'Unauthorized');
	}

	const { data: user } = await supabase
		.from('profiles')
		.select('admin')
		.eq('id', session.user.id)
		.single();

	if (!user?.admin) {
		throw error(403, 'Admin access required');
	}

	const status = url.searchParams.get('status') || null;

	try {
		let query = supabase
			.from('scheduled_emails')
			.select('*')
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
		console.error('Error in schedule GET:', e);
		if (e instanceof Error && 'status' in e) {
			throw e;
		}
		throw error(500, 'Internal server error');
	}
};
