// src/lib/email/sender.ts
// Email Sender Service
// Handles sending emails via Gmail API with tracking support

import { PRIVATE_gmail_private_key } from '$env/static/private';
import { google } from 'googleapis';
import {
	addAttributionToEmailLinks,
	addAttributionToPlainTextLinks,
	appendEmailFooterToPlainText,
	generateEmailHtml,
	htmlToPlainText,
	renderEmailContent,
	rewriteLinksForTracking,
	rewritePlainTextLinksForTracking,
	getTrackingPixelUrl,
	getUnsubscribeUrl,
	TRACKING_ID_PLACEHOLDER,
	type EmailLinkAttribution
} from './base-template';
import type { EmailRecipient, EmailSend } from '$lib/types/email';

const BASE_URL = 'https://9takes.com';

export interface SendEmailOptions {
	to: string;
	subject: string;
	htmlContent: string;
	preheader?: string;
	plainTextContent?: string;
	recipientName?: string;
	trackingId?: string;
	linkAttribution?: EmailLinkAttribution;
	unsubscribeUrl?: string;
	includeFooter?: boolean;
}

export type EmailSendFailureCategory =
	| 'configuration'
	| 'provider_rate_limited'
	| 'provider_rejected'
	| 'provider_unavailable'
	| 'unknown';

export interface SendEmailResult {
	success: boolean;
	messageId?: string;
	error?: string;
	errorCategory?: EmailSendFailureCategory;
	providerAttempted: boolean;
	retrySafe: boolean;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function normalizeSentBy(sentBy?: string | null): string | null {
	const normalized = sentBy?.trim();
	return normalized && UUID_PATTERN.test(normalized) ? normalized : null;
}

function sanitizeHeaderValue(value: string): string {
	return value.replace(/[\r\n]+/g, ' ').trim();
}

function readProviderStatus(error: unknown): number | null {
	if (!error || typeof error !== 'object') return null;
	const candidate = error as {
		code?: unknown;
		status?: unknown;
		response?: { status?: unknown };
	};
	for (const value of [candidate.response?.status, candidate.status, candidate.code]) {
		const parsed = typeof value === 'number' ? value : Number.parseInt(String(value ?? ''), 10);
		if (Number.isFinite(parsed)) return parsed;
	}
	return null;
}

function classifySendFailure(
	error: unknown,
	providerAttempted: boolean
): { category: EmailSendFailureCategory; retrySafe: boolean } {
	if (!providerAttempted) return { category: 'configuration', retrySafe: true };
	const status = readProviderStatus(error);
	if (status === 429) return { category: 'provider_rate_limited', retrySafe: true };
	if (status !== null && status >= 400 && status < 500) {
		return { category: 'provider_rejected', retrySafe: false };
	}
	if (status !== null && status >= 500) {
		// Gmail has no idempotency key. A 5xx response can be ambiguous, so the
		// notification worker must not automatically retry it.
		return { category: 'provider_unavailable', retrySafe: false };
	}
	return { category: 'unknown', retrySafe: false };
}

/**
 * Build RFC 2822 email message
 */
function makeBody({
	toEmails,
	fromEmail,
	subject,
	htmlMessage,
	plainTextMessage,
	unsubscribeUrl,
	includeFooter
}: {
	toEmails: string[];
	fromEmail: string;
	subject: string;
	htmlMessage: string;
	plainTextMessage?: string;
	unsubscribeUrl?: string;
	includeFooter?: boolean;
}): string {
	const boundary = `boundary_${Date.now()}`;
	const listUnsubscribeMailto =
		'mailto:usersup@9takes.com?subject=unsubscribe&body=Please%20unsubscribe%20me';
	const safeSubject = sanitizeHeaderValue(subject);
	const safeFromEmail = sanitizeHeaderValue(fromEmail);
	const safeToEmails = toEmails.map(sanitizeHeaderValue);
	const plainTextWithFooter =
		includeFooter === false
			? plainTextMessage || htmlToPlainText(htmlMessage)
			: appendEmailFooterToPlainText(
					plainTextMessage || htmlToPlainText(htmlMessage),
					unsubscribeUrl
				);

	const parts = [
		`MIME-Version: 1.0`,
		`To: ${safeToEmails.join(', ')}`,
		`From: DJ at 9takes <${safeFromEmail}>`,
		`Reply-To: usersup@9takes.com`,
		`Subject: ${safeSubject}`,
		`List-ID: 9takes <emails.9takes.com>`,
		...(unsubscribeUrl
			? [
					`List-Unsubscribe: <${unsubscribeUrl}>, <${listUnsubscribeMailto}>`,
					`List-Unsubscribe-Post: List-Unsubscribe=One-Click`
				]
			: []),
		`Content-Type: multipart/alternative; boundary="${boundary}"`,
		'',
		`--${boundary}`,
		'Content-Type: text/plain; charset="UTF-8"',
		'Content-Transfer-Encoding: 8bit',
		'',
		plainTextWithFooter,
		'',
		`--${boundary}`,
		'Content-Type: text/html; charset="UTF-8"',
		'Content-Transfer-Encoding: 8bit',
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
	const {
		to,
		subject,
		preheader,
		htmlContent,
		plainTextContent,
		recipientName,
		trackingId,
		linkAttribution,
		unsubscribeUrl: providedUnsubscribeUrl,
		includeFooter = true
	} = options;

	let providerAttempted = false;
	try {
		// Validate that the private key environment variable is set
		if (!PRIVATE_gmail_private_key) {
			throw new Error('PRIVATE_gmail_private_key environment variable is not set');
		}

		let privateKey: string;
		try {
			const parsed = JSON.parse(PRIVATE_gmail_private_key);
			privateKey = parsed.privateKey;
		} catch (parseError) {
			throw new Error(
				`Failed to parse PRIVATE_gmail_private_key: ${parseError instanceof Error ? parseError.message : 'Invalid JSON'}`
			);
		}

		if (!privateKey) {
			throw new Error('privateKey field is missing from PRIVATE_gmail_private_key');
		}

		const authClient = new google.auth.JWT({
			email: 'id-takes-gmail-service-account@smart-mark-302504.iam.gserviceaccount.com',
			key: privateKey,
			scopes: ['https://www.googleapis.com/auth/gmail.send'],
			subject: 'usersup@9takes.com'
		});

		const gmail = google.gmail({
			auth: authClient,
			version: 'v1'
		});

		// Process HTML content with tracking if trackingId provided
		let finalHtmlContent = htmlContent;
		let finalPlainTextContent = plainTextContent;
		let trackingPixelUrl: string | undefined;
		let unsubscribeUrl = providedUnsubscribeUrl;

		if (trackingId) {
			finalHtmlContent = finalHtmlContent.replaceAll(TRACKING_ID_PLACEHOLDER, trackingId);
			finalPlainTextContent = finalPlainTextContent?.replaceAll(
				TRACKING_ID_PLACEHOLDER,
				trackingId
			);
			// Rewrite links for click tracking
			finalHtmlContent = rewriteLinksForTracking(
				finalHtmlContent,
				trackingId,
				BASE_URL,
				linkAttribution
			);
			if (finalPlainTextContent) {
				finalPlainTextContent = rewritePlainTextLinksForTracking(
					finalPlainTextContent,
					trackingId,
					BASE_URL,
					linkAttribution
				);
			}
			trackingPixelUrl = getTrackingPixelUrl(trackingId, BASE_URL);
			unsubscribeUrl ??= getUnsubscribeUrl(trackingId, BASE_URL);
		} else if (linkAttribution) {
			// Admin test sends should show the same attributed destinations as a
			// production send without creating analytics records for test clicks.
			finalHtmlContent = addAttributionToEmailLinks(finalHtmlContent, BASE_URL, linkAttribution);
			if (finalPlainTextContent) {
				finalPlainTextContent = addAttributionToPlainTextLinks(
					finalPlainTextContent,
					BASE_URL,
					linkAttribution
				);
			}
		}

		// Wrap content in base template
		const fullHtml = generateEmailHtml({
			subject,
			content: finalHtmlContent,
			preheader,
			recipientName,
			trackingPixelUrl,
			unsubscribeUrl,
			includeFooter
		});
		const resolvedPlainTextContent =
			finalPlainTextContent ?? htmlToPlainText(renderEmailContent(finalHtmlContent, recipientName));

		providerAttempted = true;
		const response = await gmail.users.messages.send({
			requestBody: {
				raw: makeBody({
					toEmails: [to],
					fromEmail: 'usersup@9takes.com',
					subject,
					htmlMessage: fullHtml,
					plainTextMessage: resolvedPlainTextContent,
					unsubscribeUrl,
					includeFooter
				})
			},
			userId: 'me'
		});

		return {
			success: true,
			messageId: response.data.id || undefined,
			providerAttempted: true,
			retrySafe: false
		};
	} catch (e) {
		const errorMessage = e instanceof Error ? e.message : JSON.stringify(e);
		const failure = classifySendFailure(e, providerAttempted);
		console.error('Failed to send email:', errorMessage);
		return {
			success: false,
			error: errorMessage,
			errorCategory: failure.category,
			providerAttempted,
			retrySafe: failure.retrySafe
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
		preheader?: string;
		htmlContent: string;
		plainTextContent?: string;
		campaignId?: string;
		sequenceEnrollmentId?: string;
		sequenceStepNumber?: number;
		linkAttribution?: EmailLinkAttribution;
		unsubscribeUrl?: string;
		sentBy?: string | null;
		includeFooter?: boolean;
	}
): Promise<{ success: boolean; emailSend?: EmailSend; error?: string }> {
	const {
		recipient,
		subject,
		preheader,
		htmlContent,
		plainTextContent,
		campaignId,
		sequenceEnrollmentId,
		sequenceStepNumber,
		linkAttribution,
		unsubscribeUrl,
		sentBy,
		includeFooter = true
	} = options;
	const resolvedPlainTextContent = plainTextContent ?? htmlToPlainText(htmlContent);

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
			plain_text_content: resolvedPlainTextContent,
			campaign_id: campaignId,
			sequence_enrollment_id: sequenceEnrollmentId,
			sequence_step_number: sequenceStepNumber,
			sent_by: normalizeSentBy(sentBy),
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
		preheader,
		htmlContent,
		plainTextContent: resolvedPlainTextContent,
		recipientName: recipient.name ?? undefined,
		trackingId: emailSend.tracking_id,
		linkAttribution,
		unsubscribeUrl,
		includeFooter
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
		preheader?: string;
		htmlContent: string;
		plainTextContent?: string;
		campaignId?: string;
		linkAttribution?: EmailLinkAttribution;
		sentBy?: string | null;
		delayMs?: number; // Delay between sends to avoid rate limiting
		includeFooter?: boolean;
	}
): Promise<{
	sent: number;
	failed: number;
	results: Array<{ email: string; success: boolean; error?: string; tracking_id?: string }>;
}> {
	const {
		recipients,
		subject,
		preheader,
		htmlContent,
		plainTextContent,
		campaignId,
		linkAttribution,
		sentBy,
		delayMs = 100,
		includeFooter = true
	} = options;

	const results: Array<{ email: string; success: boolean; error?: string; tracking_id?: string }> =
		[];
	let sent = 0;
	let failed = 0;

	for (const recipient of recipients) {
		const result = await sendEmailWithTracking(supabase, {
			recipient,
			subject,
			preheader,
			htmlContent,
			plainTextContent,
			campaignId,
			linkAttribution,
			sentBy,
			includeFooter
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
