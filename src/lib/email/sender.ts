// Email Sender Service
// Handles sending emails via Gmail API with tracking support

import { PRIVATE_gmail_private_key } from '$env/static/private';
import { google } from 'googleapis';
import {
	generateEmailHtml,
	htmlToPlainText,
	rewriteLinksForTracking,
	getTrackingPixelUrl,
	getUnsubscribeUrl
} from './base-template';
import type { EmailRecipient, EmailSend } from '$lib/types/email';

const BASE_URL = 'https://9takes.com';

interface SendEmailOptions {
	to: string;
	subject: string;
	htmlContent: string;
	recipientName?: string;
	trackingId?: string;
}

interface SendEmailResult {
	success: boolean;
	messageId?: string;
	error?: string;
}

/**
 * Build RFC 2822 email message
 */
function makeBody({
	toEmails,
	fromEmail,
	subject,
	htmlMessage,
	plainTextMessage
}: {
	toEmails: string[];
	fromEmail: string;
	subject: string;
	htmlMessage: string;
	plainTextMessage?: string;
}): string {
	const boundary = `boundary_${Date.now()}`;

	const parts = [
		`MIME-Version: 1.0`,
		`To: ${toEmails.join(', ')}`,
		`From: 9takes <${fromEmail}>`,
		`Subject: ${subject}`,
		`Content-Type: multipart/alternative; boundary="${boundary}"`,
		'',
		`--${boundary}`,
		'Content-Type: text/plain; charset="UTF-8"',
		'Content-Transfer-Encoding: quoted-printable',
		'',
		plainTextMessage || htmlToPlainText(htmlMessage),
		'',
		`--${boundary}`,
		'Content-Type: text/html; charset="UTF-8"',
		'Content-Transfer-Encoding: quoted-printable',
		'',
		htmlMessage,
		'',
		`--${boundary}--`
	];

	return Buffer.from(parts.join('\r\n')).toString('base64url');
}

/**
 * Send a single email via Gmail API
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
	const { to, subject, htmlContent, recipientName, trackingId } = options;

	try {
		const { privateKey } = JSON.parse(PRIVATE_gmail_private_key);

		const authClient = new google.auth.JWT(
			'id-takes-gmail-service-account@smart-mark-302504.iam.gserviceaccount.com',
			'',
			privateKey,
			['https://www.googleapis.com/auth/gmail.send'],
			'usersup@9takes.com'
		);

		const gmail = google.gmail({
			auth: authClient,
			version: 'v1'
		});

		// Process HTML content with tracking if trackingId provided
		let finalHtmlContent = htmlContent;
		let trackingPixelUrl: string | undefined;
		let unsubscribeUrl: string | undefined;

		if (trackingId) {
			// Rewrite links for click tracking
			finalHtmlContent = rewriteLinksForTracking(htmlContent, trackingId, BASE_URL);
			trackingPixelUrl = getTrackingPixelUrl(trackingId, BASE_URL);
			unsubscribeUrl = getUnsubscribeUrl(trackingId, BASE_URL);
		}

		// Wrap content in base template
		const fullHtml = generateEmailHtml({
			subject,
			content: finalHtmlContent,
			recipientName,
			trackingPixelUrl,
			unsubscribeUrl
		});

		const response = await gmail.users.messages.send({
			requestBody: {
				raw: makeBody({
					toEmails: [to],
					fromEmail: 'usersup@9takes.com',
					subject,
					htmlMessage: fullHtml
				})
			},
			userId: 'me'
		});

		return {
			success: true,
			messageId: response.data.id || undefined
		};
	} catch (e) {
		const errorMessage = e instanceof Error ? e.message : JSON.stringify(e);
		console.error('Failed to send email:', errorMessage);
		return {
			success: false,
			error: errorMessage
		};
	}
}

/**
 * Send email with full tracking - creates email_send record
 */
export async function sendEmailWithTracking(
	supabase: any,
	options: {
		recipient: EmailRecipient;
		subject: string;
		htmlContent: string;
		campaignId?: string;
		sentBy: string;
	}
): Promise<{ success: boolean; emailSend?: EmailSend; error?: string }> {
	const { recipient, subject, htmlContent, campaignId, sentBy } = options;

	// Create email_send record first to get tracking_id
	const { data: emailSend, error: insertError } = await supabase
		.from('email_sends')
		.insert({
			recipient_email: recipient.email,
			recipient_name: recipient.name,
			recipient_source: recipient.source,
			recipient_source_id: recipient.source_id,
			subject,
			html_content: htmlContent,
			plain_text_content: htmlToPlainText(htmlContent),
			campaign_id: campaignId,
			sent_by: sentBy,
			status: 'pending'
		})
		.select()
		.single();

	if (insertError || !emailSend) {
		return {
			success: false,
			error: insertError?.message || 'Failed to create email record'
		};
	}

	// Send the email with tracking
	const result = await sendEmail({
		to: recipient.email,
		subject,
		htmlContent,
		recipientName: recipient.name,
		trackingId: emailSend.tracking_id
	});

	// Update email_send record with result
	const updateData = result.success
		? { status: 'sent', sent_at: new Date().toISOString() }
		: { status: 'failed', error_message: result.error };

	await supabase.from('email_sends').update(updateData).eq('id', emailSend.id);

	return {
		success: result.success,
		emailSend: { ...emailSend, ...updateData },
		error: result.error
	};
}

/**
 * Batch send emails to multiple recipients
 */
export async function sendBatchEmails(
	supabase: any,
	options: {
		recipients: EmailRecipient[];
		subject: string;
		htmlContent: string;
		campaignId?: string;
		sentBy: string;
		delayMs?: number; // Delay between sends to avoid rate limiting
	}
): Promise<{
	sent: number;
	failed: number;
	results: Array<{ email: string; success: boolean; error?: string; tracking_id?: string }>;
}> {
	const { recipients, subject, htmlContent, campaignId, sentBy, delayMs = 100 } = options;

	const results: Array<{ email: string; success: boolean; error?: string; tracking_id?: string }> =
		[];
	let sent = 0;
	let failed = 0;

	for (const recipient of recipients) {
		const result = await sendEmailWithTracking(supabase, {
			recipient,
			subject,
			htmlContent,
			campaignId,
			sentBy
		});

		if (result.success) {
			sent++;
			results.push({
				email: recipient.email,
				success: true,
				tracking_id: result.emailSend?.tracking_id
			});
		} else {
			failed++;
			results.push({
				email: recipient.email,
				success: false,
				error: result.error
			});
		}

		// Add delay between sends
		if (delayMs > 0 && recipients.indexOf(recipient) < recipients.length - 1) {
			await new Promise((resolve) => setTimeout(resolve, delayMs));
		}
	}

	return { sent, failed, results };
}
