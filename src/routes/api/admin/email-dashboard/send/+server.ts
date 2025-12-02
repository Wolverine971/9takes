// POST /api/admin/email-dashboard/send
// Send emails to selected recipients

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { SendEmailRequest, SendEmailResponse } from '$lib/types/email';
import { sendBatchEmails } from '$lib/email/sender';

export const POST: RequestHandler = async ({ request, locals }) => {
	const session = locals.session;
	const supabase = locals.supabase;

	// Check authentication
	if (!session?.user?.id) {
		throw error(401, 'Unauthorized');
	}

	// Check admin status
	const { data: user } = await supabase
		.from('profiles')
		.select('admin')
		.eq('id', session.user.id)
		.single();

	if (!user?.admin) {
		throw error(403, 'Admin access required');
	}

	try {
		const body: SendEmailRequest = await request.json();
		const { recipients, subject, html_content, campaign_id } = body;

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

		// Check for unsubscribed emails
		const { data: unsubscribes } = await supabase
			.from('email_unsubscribes')
			.select('email')
			.in(
				'email',
				recipients.map((r) => r.email)
			);

		const unsubscribedEmails = new Set((unsubscribes || []).map((u) => u.email));
		const validRecipients = recipients.filter((r) => !unsubscribedEmails.has(r.email));

		if (validRecipients.length === 0) {
			throw error(400, 'All recipients have unsubscribed');
		}

		// Send emails
		const result = await sendBatchEmails(supabase, {
			recipients: validRecipients,
			subject: subject.trim(),
			htmlContent: html_content,
			campaignId: campaign_id,
			sentBy: session.user.id,
			delayMs: 100 // 100ms delay between sends
		});

		const response: SendEmailResponse = {
			success: result.sent > 0,
			sent: result.sent,
			failed: result.failed,
			results: result.results
		};

		return json(response);
	} catch (e) {
		console.error('Error sending emails:', e);
		if (e instanceof Error && 'status' in e) {
			throw e;
		}
		throw error(500, 'Failed to send emails');
	}
};
