// src/lib/server/accountReplyNotificationEmail.ts
//
// Email leg for logged-in `reply_to_take` notifications.
//
// The notify_on_comment trigger inserts a notifications row with
// email_status = 'pending' (migration 20260906120000). This worker claims
// those rows through a service-role RPC, renders one plain transactional
// email per direct reply, sends it, and marks the row. It mirrors the shape
// of replyNotificationDelivery.ts (the anonymous-subscriber worker) but keeps
// state on the notification row itself instead of a separate outbox.
//
// Anonymity: the only actor identity available is notifications.actor_enneagram
// ('1'..'9' | 'unknown' | 'rando'). The email never names the replier.

import { createHmac, timingSafeEqual } from 'node:crypto';
import { SUPABASE_SERVICE_KEY } from '$env/static/private';
import { sendEmail, type SendEmailResult } from '$lib/email/sender';
import { normalizeEmail } from '$lib/email/suppression';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';

const BASE_URL = 'https://9takes.com';
const SUBJECT = 'Someone replied to your take on 9takes';
const PREHEADER = 'Your take on 9takes got a direct reply.';
const MAX_BATCH_SIZE = 25;
const TAKE_EXCERPT_LIMIT = 200;
const REPLY_EXCERPT_LIMIT = 400;
const UNSUBSCRIBE_PATH = '/api/notifications/email-unsubscribe';

/** Row shape returned by public.claim_account_reply_notification_emails. */
export type ClaimedAccountReplyNotification = {
	notification_id: number;
	recipient_id: string;
	recipient_email: string;
	recipient_first_name: string | null;
	actor_enneagram: string;
	question_id: number;
	question_url: string;
	question_text: string | null;
	reply_comment_id: number;
	reply_text: string;
	subject_comment_id: number;
	subject_text: string | null;
	email_replies: boolean;
	attempt_count: number;
};

export type AccountReplyEmailSummary = {
	claimed: number;
	sent: number;
	failed: number;
	suppressed: number;
	skipped: number;
	/** Present only when the batch could not be claimed at all. */
	error?: string;
};

type Dependencies = {
	// TODO regen database.types.ts after applying 20260906120000; the new RPCs
	// are not in the generated types yet, so the client is used untyped here
	// (same idiom as replyNotificationDelivery.ts and accountDashboard.ts).
	supabase?: any;
	send?: (options: Parameters<typeof sendEmail>[0]) => Promise<SendEmailResult>;
	limit?: number;
	/** Signing secret override for tests. Defaults to SUPABASE_SERVICE_KEY. */
	secret?: string;
};

// ---------------------------------------------------------------------------
// Unsubscribe token
// ---------------------------------------------------------------------------
//
// Signed, not encrypted: the payload is only a user id and a purpose. No
// expiry on purpose; an unsubscribe link in a year-old email must still work.
// Same HMAC pattern as replyNotificationReturn.ts.

const UNSUBSCRIBE_PURPOSE = 'email_replies';
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type UnsubscribePayload = {
	version: 1;
	userId: string;
	purpose: typeof UNSUBSCRIBE_PURPOSE;
};

function getSigningSecret(explicitSecret?: string): string {
	const secret = explicitSecret || SUPABASE_SERVICE_KEY;
	if (!secret) throw new Error('Reply email unsubscribe signing secret is not configured');
	return secret;
}

function signPayload(payload: string, secret: string): string {
	return createHmac('sha256', secret).update(payload).digest('base64url');
}

export function signEmailRepliesUnsubscribeToken(
	userId: string,
	options: { secret?: string } = {}
): string {
	if (!UUID_PATTERN.test(userId)) throw new Error('Unsubscribe token requires a user id');
	const payload: UnsubscribePayload = { version: 1, userId, purpose: UNSUBSCRIBE_PURPOSE };
	const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
	return `${encoded}.${signPayload(encoded, getSigningSecret(options.secret))}`;
}

/** Returns the user id the token was issued for, or null if it is not ours. */
export function verifyEmailRepliesUnsubscribeToken(
	token: string | undefined,
	options: { secret?: string } = {}
): string | null {
	if (!token) return null;
	const [encoded, signature, extra] = token.split('.');
	if (!encoded || !signature || extra) return null;

	const expected = signPayload(encoded, getSigningSecret(options.secret));
	const signatureBuffer = Buffer.from(signature);
	const expectedBuffer = Buffer.from(expected);
	if (
		signatureBuffer.length !== expectedBuffer.length ||
		!timingSafeEqual(signatureBuffer, expectedBuffer)
	) {
		return null;
	}

	try {
		const parsed: unknown = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
		if (!parsed || typeof parsed !== 'object') return null;
		const payload = parsed as Partial<UnsubscribePayload>;
		if (
			payload.version !== 1 ||
			payload.purpose !== UNSUBSCRIBE_PURPOSE ||
			typeof payload.userId !== 'string' ||
			!UUID_PATTERN.test(payload.userId)
		) {
			return null;
		}
		return payload.userId;
	} catch {
		return null;
	}
}

export function buildEmailRepliesUnsubscribeUrl(userId: string, options: { secret?: string } = {}) {
	return `${BASE_URL}${UNSUBSCRIBE_PATH}/${encodeURIComponent(
		signEmailRepliesUnsubscribeToken(userId, options)
	)}`;
}

// ---------------------------------------------------------------------------
// Email content
// ---------------------------------------------------------------------------

export function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

export function truncateText(value: string | null | undefined, limit: number): string {
	const collapsed = (value ?? '').replace(/\s+/g, ' ').trim();
	if (collapsed.length <= limit) return collapsed;
	// Cut on a word boundary when one is reasonably close so we do not end on
	// half a word; otherwise hard-cut.
	const slice = collapsed.slice(0, limit);
	const lastSpace = slice.lastIndexOf(' ');
	const cut = lastSpace > limit * 0.6 ? slice.slice(0, lastSpace) : slice;
	return `${cut.trimEnd()}…`;
}

function actorSentence(actorEnneagram: string): string {
	return /^[1-9]$/.test(actorEnneagram)
		? `A Type ${actorEnneagram} replied to your take`
		: 'Someone replied to your take';
}

/**
 * Deep link for the "Read and reply" button.
 *
 * `?reply=<id>` is resolved server-side by src/routes/questions/[slug]:
 * for an unlocked viewer it pre-loads the parent take's replies, scrolls to
 * `#comment-box{replyId}` and applies the same "NEW REPLY" treatment the
 * anonymous reply-return flow uses. Invalid or removed ids are ignored, so a
 * stale link still lands on the question.
 */
export function buildReadUrl(
	row: Pick<ClaimedAccountReplyNotification, 'question_url' | 'reply_comment_id'>
) {
	return `${BASE_URL}/questions/${encodeURIComponent(row.question_url)}?reply=${row.reply_comment_id}`;
}

export function buildAccountReplyEmail(
	row: ClaimedAccountReplyNotification,
	options: { secret?: string } = {}
) {
	const readUrl = buildReadUrl(row);
	const unsubscribeUrl = buildEmailRepliesUnsubscribeUrl(row.recipient_id, options);
	const greeting = row.recipient_first_name?.trim()
		? `Hi ${row.recipient_first_name.trim()},`
		: 'Hi,';
	const lead = actorSentence(row.actor_enneagram);
	const question = truncateText(row.question_text, 160);
	const take = truncateText(row.subject_text, TAKE_EXCERPT_LIMIT);
	const reply = truncateText(row.reply_text, REPLY_EXCERPT_LIMIT);

	const quoteStyle =
		'margin: 0 0 16px; padding: 12px 16px; border-left: 3px solid #d9dce1; color: #3d4148; white-space: pre-wrap;';
	const labelStyle =
		'margin: 0 0 4px; font-size: 12px; letter-spacing: 0.04em; text-transform: uppercase; color: #69707a;';

	const htmlContent = `<p>${escapeHtml(greeting)}</p>
<p>${escapeHtml(lead)}${question ? ` on <em>${escapeHtml(question)}</em>` : ''}.</p>
${
	take
		? `<p style="${labelStyle}">Your take</p>
<blockquote style="${quoteStyle}">${escapeHtml(take)}</blockquote>`
		: ''
}
<p style="${labelStyle}">The reply</p>
<blockquote style="${quoteStyle}">${escapeHtml(reply)}</blockquote>
<p><a class="button" href="${readUrl}">Read and reply</a></p>
<p style="font-size: 13px; color: #69707a;">You get one email per direct reply. <a href="${unsubscribeUrl}">Turn off reply emails</a>.</p>`;

	const plainTextContent = [
		greeting,
		'',
		`${lead}${question ? ` on "${question}"` : ''}.`,
		'',
		...(take ? ['Your take:', take, ''] : []),
		'The reply:',
		reply,
		'',
		`Read and reply: ${readUrl}`,
		'',
		`You get one email per direct reply. Turn off reply emails: ${unsubscribeUrl}`
	].join('\n');

	return {
		subject: SUBJECT,
		preheader: PREHEADER,
		htmlContent,
		plainTextContent,
		readUrl,
		unsubscribeUrl
	};
}

// ---------------------------------------------------------------------------
// Worker
// ---------------------------------------------------------------------------

async function markRow(
	supabase: any,
	notificationId: number,
	status: 'sent' | 'failed' | 'suppressed' | 'skipped',
	errorCategory?: string
) {
	try {
		const { error } = await supabase.rpc('mark_account_reply_notification_email', {
			p_notification_id: notificationId,
			p_status: status,
			p_error: errorCategory ?? null
		});
		if (error) {
			console.error('Failed to mark account reply notification email', {
				notificationId,
				status,
				error
			});
		}
	} catch (markError) {
		console.error('Failed to mark account reply notification email', {
			notificationId,
			status,
			markError
		});
	}
}

/**
 * Global suppression check. Fails CLOSED: if the RPC is unavailable we return
 * null and the caller retries the batch later rather than sending to an
 * address that may have unsubscribed.
 */
async function loadSuppressedEmails(supabase: any, emails: string[]): Promise<Set<string> | null> {
	const normalized = [...new Set(emails.map(normalizeEmail).filter(Boolean))];
	if (normalized.length === 0) return new Set();
	try {
		const { data, error } = await supabase.rpc('get_suppressed_emails', { p_emails: normalized });
		if (error || !Array.isArray(data)) return null;
		return new Set(
			data
				.map((row: { email?: string | null }) => normalizeEmail(row?.email))
				.filter((email: string) => email.length > 0)
		);
	} catch {
		return null;
	}
}

export async function processAccountReplyNotificationEmails(
	dependencies: Dependencies = {}
): Promise<AccountReplyEmailSummary> {
	const send = dependencies.send ?? sendEmail;
	const limit = Math.min(Math.max(Math.trunc(dependencies.limit ?? 10) || 10, 1), MAX_BATCH_SIZE);
	const summary: AccountReplyEmailSummary = {
		claimed: 0,
		sent: 0,
		failed: 0,
		suppressed: 0,
		skipped: 0
	};

	let supabase: any;
	let rows: ClaimedAccountReplyNotification[];
	try {
		supabase = dependencies.supabase ?? (getSupabaseAdminClient() as any);
		const { data, error } = await supabase.rpc('claim_account_reply_notification_emails', {
			p_limit: limit
		});
		if (error) {
			console.error('Failed to claim account reply notification emails', error);
			return { ...summary, error: 'claim_failed' };
		}
		rows = (Array.isArray(data) ? data : []) as ClaimedAccountReplyNotification[];
	} catch (claimError) {
		console.error('Failed to claim account reply notification emails', claimError);
		return { ...summary, error: 'claim_failed' };
	}
	summary.claimed = rows.length;
	if (rows.length === 0) return summary;

	// Per-user opt-out first; nothing else needs to happen for those rows.
	const sendable: ClaimedAccountReplyNotification[] = [];
	for (const row of rows) {
		if (row.email_replies === false) {
			await markRow(supabase, row.notification_id, 'skipped', 'email_replies_off');
			summary.skipped += 1;
			continue;
		}
		if (!row.recipient_email?.trim()) {
			await markRow(supabase, row.notification_id, 'skipped', 'no_recipient_email');
			summary.skipped += 1;
			continue;
		}
		sendable.push(row);
	}
	if (sendable.length === 0) return summary;

	const suppressed = await loadSuppressedEmails(
		supabase,
		sendable.map((row) => row.recipient_email)
	);
	if (!suppressed) {
		for (const row of sendable) {
			await markRow(supabase, row.notification_id, 'failed', 'suppression_check');
			summary.failed += 1;
		}
		return summary;
	}

	for (const row of sendable) {
		try {
			if (suppressed.has(normalizeEmail(row.recipient_email))) {
				await markRow(supabase, row.notification_id, 'suppressed', 'suppressed');
				summary.suppressed += 1;
				continue;
			}

			const email = buildAccountReplyEmail(row, { secret: dependencies.secret });
			const result = await send({
				to: row.recipient_email,
				subject: email.subject,
				preheader: email.preheader,
				htmlContent: email.htmlContent,
				plainTextContent: email.plainTextContent,
				recipientName: row.recipient_first_name ?? undefined,
				linkAttribution: {
					source: 'reply-notification',
					medium: 'email',
					campaign: 'account-reply',
					content: 'reply_to_take'
				},
				unsubscribeUrl: email.unsubscribeUrl,
				includeFooter: false,
				emailKind: 'transactional',
				idempotencyKey: `account-reply-${row.notification_id}`
			});

			if (!result.success) {
				await markRow(supabase, row.notification_id, 'failed', result.errorCategory ?? 'unknown');
				summary.failed += 1;
				continue;
			}

			await markRow(supabase, row.notification_id, 'sent');
			summary.sent += 1;
		} catch (rowError) {
			console.error('Account reply notification email failed', {
				notificationId: row.notification_id,
				rowError
			});
			await markRow(supabase, row.notification_id, 'failed', 'exception');
			summary.failed += 1;
		}
	}

	return summary;
}
