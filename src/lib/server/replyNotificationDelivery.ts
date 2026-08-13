// src/lib/server/replyNotificationDelivery.ts
import { sendEmail, type SendEmailResult } from '$lib/email/sender';
import {
	captureReplyNotificationEvent,
	type ReplyNotificationEventContext
} from '$lib/server/posthogCapture';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';

const BASE_URL = 'https://9takes.com';
const SUBJECT = 'Someone replied to your take on 9takes';
const MAX_BATCH_SIZE = 25;

type ClaimedReplyNotification = {
	outbox_id: number;
	subscription_id: number;
	comment_id: number;
	reply_comment_id: number;
	question_id: number;
	question_url: string;
	recipient_email: string;
	management_token: string;
	return_token: string;
	attempt_count: number;
	email_send_id: string | null;
	tracking_id: string | null;
};

type TrackingRow = {
	id: string;
	tracking_id: string;
};

type DeliveryDependencies = {
	supabase?: any;
	send?: (options: Parameters<typeof sendEmail>[0]) => Promise<SendEmailResult>;
	capture?: typeof captureReplyNotificationEvent;
};

export type ReplyNotificationDeliverySummary = {
	claimed: number;
	sent: number;
	retried: number;
	failed: number;
	ambiguous: number;
	skipped: number;
};

export function buildReplyNotificationEmail(row: ClaimedReplyNotification) {
	const readUrl = `${BASE_URL}/api/reply-notifications/return/${encodeURIComponent(row.return_token)}`;
	const unsubscribeUrl = `${BASE_URL}/api/reply-notifications/unsubscribe/${encodeURIComponent(row.management_token)}`;
	const htmlContent = `<p>A new reply was added to the conversation.</p>
<p><a class="button" href="${readUrl}">Read the reply</a></p>
<p style="font-size: 13px; color: #69707a;">You’re receiving this because you asked for replies to this take. <a href="${unsubscribeUrl}">Stop emails for this conversation</a>.</p>`;
	const plainTextContent = `A new reply was added to the conversation.

Read the reply: ${readUrl}

You’re receiving this because you asked for replies to this take.
Stop emails for this conversation: ${unsubscribeUrl}`;

	return {
		subject: SUBJECT,
		preheader: 'A new reply was added to your conversation.',
		htmlContent,
		plainTextContent,
		readUrl,
		unsubscribeUrl
	};
}

function analyticsContext(row: ClaimedReplyNotification): ReplyNotificationEventContext {
	return {
		outboxId: row.outbox_id,
		subscriptionId: row.subscription_id,
		questionId: row.question_id,
		commentId: row.comment_id,
		replyCommentId: row.reply_comment_id,
		attempt: row.attempt_count
	};
}

async function createTrackingRow(
	supabase: any,
	row: ClaimedReplyNotification,
	email: ReturnType<typeof buildReplyNotificationEmail>
): Promise<TrackingRow | null> {
	if (row.email_send_id && row.tracking_id) {
		return { id: row.email_send_id, tracking_id: row.tracking_id };
	}

	const redactedHtml = email.htmlContent
		.replaceAll(email.unsubscribeUrl, '[conversation stop link omitted]')
		.replaceAll(email.readUrl, '[private reply link omitted]');
	const redactedPlainText = email.plainTextContent
		.replaceAll(email.unsubscribeUrl, '[conversation stop link omitted]')
		.replaceAll(email.readUrl, '[private reply link omitted]');
	const { data, error } = await supabase.rpc('create_reply_notification_tracking', {
		p_outbox_id: row.outbox_id,
		p_subject: email.subject,
		p_html_content: redactedHtml,
		p_plain_text_content: redactedPlainText
	});

	if (error || data?.status !== 'ready' || !data?.id || !data?.tracking_id) return null;
	return { id: data.id, tracking_id: data.tracking_id };
}

async function markFailure(
	supabase: any,
	row: ClaimedReplyNotification,
	trackingRow: TrackingRow | null,
	category: string,
	retrySafe: boolean,
	providerAttempted: boolean
): Promise<'retry' | 'failed' | 'ambiguous'> {
	if (trackingRow) {
		await supabase
			.from('email_sends')
			.update({ status: 'failed', error_message: category })
			.eq('id', trackingRow.id);
	}

	const { data } = await supabase.rpc('fail_reply_notification_delivery', {
		p_outbox_id: row.outbox_id,
		p_email_send_id: trackingRow?.id ?? null,
		p_error_category: category,
		p_retry_safe: retrySafe,
		p_provider_attempted: providerAttempted
	});
	const status = data?.status;
	return status === 'retry' || status === 'ambiguous' ? status : 'failed';
}

export async function processReplyNotificationOutbox(
	limit = 10,
	dependencies: DeliveryDependencies = {}
): Promise<ReplyNotificationDeliverySummary> {
	const supabase = dependencies.supabase ?? (getSupabaseAdminClient() as any);
	const send = dependencies.send ?? sendEmail;
	const capture = dependencies.capture ?? captureReplyNotificationEvent;
	const boundedLimit = Math.min(Math.max(Math.trunc(limit) || 10, 1), MAX_BATCH_SIZE);
	const summary: ReplyNotificationDeliverySummary = {
		claimed: 0,
		sent: 0,
		retried: 0,
		failed: 0,
		ambiguous: 0,
		skipped: 0
	};

	const { data, error } = await supabase.rpc('claim_reply_notification_outbox', {
		p_limit: boundedLimit
	});
	if (error) throw new Error('Failed to claim reply notification work');
	const rows = (Array.isArray(data) ? data : []) as ClaimedReplyNotification[];
	summary.claimed = rows.length;

	for (const row of rows) {
		const context = analyticsContext(row);
		await capture('reply_notification_queued', context, { insertIdSuffix: 'queued' });
		const email = buildReplyNotificationEmail(row);
		const trackingRow = await createTrackingRow(supabase, row, email);

		if (!trackingRow) {
			const status = await markFailure(supabase, row, null, 'persistence', true, false);
			if (status === 'retry') summary.retried += 1;
			else summary.failed += 1;
			await capture(
				'reply_notification_failed',
				{ ...context, failureCategory: 'persistence' },
				{ insertIdSuffix: `attempt-${row.attempt_count}` }
			);
			continue;
		}

		const { data: preparation, error: preparationError } = await supabase.rpc(
			'prepare_reply_notification_delivery',
			{ p_outbox_id: row.outbox_id }
		);
		if (preparationError) {
			const status = await markFailure(supabase, row, trackingRow, 'persistence', true, false);
			if (status === 'retry') summary.retried += 1;
			else summary.failed += 1;
			await capture(
				'reply_notification_failed',
				{ ...context, failureCategory: 'persistence' },
				{ insertIdSuffix: `attempt-${row.attempt_count}` }
			);
			continue;
		}
		if (preparation?.status !== 'ready') {
			summary.skipped += 1;
			await supabase
				.from('email_sends')
				.update({ status: 'failed', error_message: preparation?.status || 'pre_send_check' })
				.eq('id', trackingRow.id);
			const failureCategory = preparation?.status === 'suppressed' ? 'suppressed' : 'cancelled';
			await capture(
				'reply_notification_failed',
				{ ...context, failureCategory },
				{ insertIdSuffix: `attempt-${row.attempt_count}` }
			);
			continue;
		}

		const result = await send({
			to: row.recipient_email,
			subject: email.subject,
			preheader: email.preheader,
			htmlContent: email.htmlContent,
			plainTextContent: email.plainTextContent,
			trackingId: trackingRow.tracking_id,
			linkAttribution: {
				source: 'reply-notification',
				medium: 'email',
				campaign: 'direct-reply',
				content: 'reply_notification'
			},
			unsubscribeUrl: email.unsubscribeUrl,
			includeFooter: false
		});

		if (!result.success) {
			const rawCategory = result.errorCategory ?? 'unknown';
			const status = await markFailure(
				supabase,
				row,
				trackingRow,
				rawCategory,
				result.retrySafe,
				result.providerAttempted
			);
			const failureCategory = status === 'ambiguous' ? 'provider_ambiguous' : rawCategory;
			if (status === 'retry') summary.retried += 1;
			else if (status === 'ambiguous') summary.ambiguous += 1;
			else summary.failed += 1;
			await capture(
				'reply_notification_failed',
				{ ...context, failureCategory },
				{ insertIdSuffix: `attempt-${row.attempt_count}` }
			);
			continue;
		}

		await supabase
			.from('email_sends')
			.update({ status: 'sent', sent_at: new Date().toISOString(), error_message: null })
			.eq('id', trackingRow.id);
		await supabase.rpc('complete_reply_notification_delivery', {
			p_outbox_id: row.outbox_id,
			p_email_send_id: trackingRow.id,
			p_provider_message_id: result.messageId ?? null
		});
		await capture('reply_notification_sent', context, { insertIdSuffix: 'sent' });
		summary.sent += 1;
	}

	return summary;
}
