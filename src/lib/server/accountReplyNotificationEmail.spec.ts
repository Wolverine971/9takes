// src/lib/server/accountReplyNotificationEmail.spec.ts
import { describe, expect, it, vi } from 'vitest';
import {
	buildAccountReplyEmail,
	buildReadUrl,
	processAccountReplyNotificationEmails,
	signEmailRepliesUnsubscribeToken,
	truncateText,
	verifyEmailRepliesUnsubscribeToken,
	type ClaimedAccountReplyNotification
} from './accountReplyNotificationEmail';

const SECRET = 'test-only-unsubscribe-secret';
const USER_ID = '6f1c2d3e-4a5b-4c6d-8e9f-0a1b2c3d4e5f';

const claimedRow: ClaimedAccountReplyNotification = {
	notification_id: 501,
	recipient_id: USER_ID,
	recipient_email: 'Reader@Example.com',
	recipient_first_name: 'Dana',
	actor_enneagram: '8',
	question_id: 42,
	question_url: 'what-helps-you-feel-understood',
	question_text: 'What helps you feel understood?',
	reply_comment_id: 901,
	reply_text: 'Honestly <b>same</b> & I never say it out loud.',
	subject_comment_id: 900,
	subject_text: 'Being asked a second question instead of getting advice.',
	email_replies: true,
	attempt_count: 1
};

type StubOptions = {
	rows?: Partial<ClaimedAccountReplyNotification>[];
	suppressed?: string[];
	claimError?: unknown;
	suppressionError?: unknown;
};

function createSupabaseStub(options: StubOptions = {}) {
	const rows = (options.rows ?? [{}]).map((overrides, index) => ({
		...claimedRow,
		notification_id: 501 + index,
		...overrides
	}));
	const marks: Array<{ id: number; status: string; error: string | null }> = [];
	const rpc = vi.fn(async (name: string, args: Record<string, unknown> = {}) => {
		if (name === 'claim_account_reply_notification_emails') {
			if (options.claimError) return { data: null, error: options.claimError };
			return { data: rows, error: null };
		}
		if (name === 'get_suppressed_emails') {
			if (options.suppressionError) return { data: null, error: options.suppressionError };
			return { data: (options.suppressed ?? []).map((email) => ({ email })), error: null };
		}
		if (name === 'mark_account_reply_notification_email') {
			marks.push({
				id: args.p_notification_id as number,
				status: args.p_status as string,
				error: (args.p_error as string | null) ?? null
			});
			return { data: args.p_status, error: null };
		}
		throw new Error(`Unexpected RPC ${name}`);
	});
	return { supabase: { rpc }, rpc, marks };
}

function successfulSend() {
	return vi.fn().mockResolvedValue({
		success: true,
		messageId: 'gmail-message-1',
		providerAttempted: true,
		retrySafe: false
	});
}

describe('account reply email builder', () => {
	it('names only the actor type, quotes both sides escaped, and deep-links to the take', () => {
		const email = buildAccountReplyEmail(claimedRow, { secret: SECRET });

		expect(email.subject).toBe('Someone replied to your take on 9takes');
		expect(email.htmlContent).toContain('A Type 8 replied to your take');
		expect(email.htmlContent).toContain('Hi Dana,');
		expect(email.htmlContent).toContain(
			'Honestly &lt;b&gt;same&lt;/b&gt; &amp; I never say it out loud.'
		);
		expect(email.htmlContent).not.toContain('<b>same</b>');
		expect(email.htmlContent).toContain('Being asked a second question instead of getting advice.');
		expect(email.readUrl).toBe(
			'https://9takes.com/questions/what-helps-you-feel-understood?reply=901'
		);
		expect(email.htmlContent).toContain(`href="${email.readUrl}"`);
		expect(email.htmlContent).toContain('Read and reply');
		expect(email.htmlContent).toContain('You get one email per direct reply.');
		expect(email.htmlContent).toContain('Turn off reply emails');
		expect(email.unsubscribeUrl).toMatch(
			/^https:\/\/9takes\.com\/api\/notifications\/email-unsubscribe\/[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/
		);
		expect(email.plainTextContent).toContain(`Read and reply: ${email.readUrl}`);
		expect(email.plainTextContent).toContain(email.unsubscribeUrl);
		// Never leak the recipient address or any actor identity beyond the type.
		expect(email.htmlContent).not.toMatch(/reader@example|author_id|recipient_id/i);
	});

	it('says "Someone" for untyped and anonymous repliers', () => {
		for (const actor of ['unknown', 'rando', '']) {
			const email = buildAccountReplyEmail(
				{ ...claimedRow, actor_enneagram: actor },
				{ secret: SECRET }
			);
			expect(email.htmlContent).toContain('Someone replied to your take');
			expect(email.htmlContent).not.toMatch(/A Type/);
		}
	});

	it('truncates the take to 200 and the reply to 400 characters', () => {
		const longTake = 'take '.repeat(100).trim();
		const longReply = 'reply '.repeat(200).trim();
		const email = buildAccountReplyEmail(
			{ ...claimedRow, subject_text: longTake, reply_text: longReply },
			{ secret: SECRET }
		);

		expect(email.htmlContent).not.toContain(longTake);
		expect(email.htmlContent).not.toContain(longReply);
		const take = truncateText(longTake, 200);
		const reply = truncateText(longReply, 400);
		expect(take.length).toBeLessThanOrEqual(201);
		expect(reply.length).toBeLessThanOrEqual(401);
		expect(take.endsWith('…')).toBe(true);
		expect(reply.endsWith('…')).toBe(true);
		expect(email.htmlContent).toContain(take);
		expect(email.htmlContent).toContain(reply);
	});

	it('falls back to a plain greeting and no take block when those fields are empty', () => {
		const email = buildAccountReplyEmail(
			{ ...claimedRow, recipient_first_name: null, subject_text: '   ', question_text: null },
			{ secret: SECRET }
		);
		expect(email.htmlContent).toContain('<p>Hi,</p>');
		expect(email.htmlContent).not.toContain('Your take');
		expect(email.htmlContent).toContain('A Type 8 replied to your take.');
	});

	it('URL-encodes the question slug', () => {
		expect(buildReadUrl({ question_url: 'why so serious?', reply_comment_id: 7 })).toBe(
			'https://9takes.com/questions/why%20so%20serious%3F?reply=7'
		);
	});
});

describe('email replies unsubscribe token', () => {
	it('round-trips the user id without an expiry', () => {
		const token = signEmailRepliesUnsubscribeToken(USER_ID, { secret: SECRET });
		expect(verifyEmailRepliesUnsubscribeToken(token, { secret: SECRET })).toBe(USER_ID);
		const [encoded] = token.split('.');
		const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
		expect(payload).toEqual({ version: 1, userId: USER_ID, purpose: 'email_replies' });
	});

	it('rejects tampering, wrong secrets, and foreign payloads', () => {
		const token = signEmailRepliesUnsubscribeToken(USER_ID, { secret: SECRET });
		expect(verifyEmailRepliesUnsubscribeToken(`${token}x`, { secret: SECRET })).toBeNull();
		expect(verifyEmailRepliesUnsubscribeToken(token, { secret: 'other' })).toBeNull();
		expect(verifyEmailRepliesUnsubscribeToken(undefined, { secret: SECRET })).toBeNull();
		expect(verifyEmailRepliesUnsubscribeToken('not-a-token', { secret: SECRET })).toBeNull();

		// A validly signed payload for a different purpose must not unsubscribe.
		const [, signature] = token.split('.');
		const other = Buffer.from(
			JSON.stringify({ version: 1, userId: USER_ID, purpose: 'something_else' })
		).toString('base64url');
		expect(
			verifyEmailRepliesUnsubscribeToken(`${other}.${signature}`, { secret: SECRET })
		).toBeNull();

		// Swapping the user id invalidates the signature.
		const swapped = Buffer.from(
			JSON.stringify({
				version: 1,
				userId: '00000000-0000-4000-8000-000000000000',
				purpose: 'email_replies'
			})
		).toString('base64url');
		expect(
			verifyEmailRepliesUnsubscribeToken(`${swapped}.${signature}`, { secret: SECRET })
		).toBeNull();
	});

	it('refuses to sign anything that is not a user id', () => {
		expect(() => signEmailRepliesUnsubscribeToken('admin', { secret: SECRET })).toThrow();
	});
});

describe('account reply email processor', () => {
	it('sends one transactional email per claimed row and marks it sent', async () => {
		const { supabase, marks } = createSupabaseStub();
		const send = successfulSend();

		const summary = await processAccountReplyNotificationEmails({
			supabase,
			send,
			secret: SECRET
		});

		expect(summary).toEqual({ claimed: 1, sent: 1, failed: 0, suppressed: 0, skipped: 0 });
		expect(send).toHaveBeenCalledTimes(1);
		expect(send).toHaveBeenCalledWith(
			expect.objectContaining({
				to: 'Reader@Example.com',
				subject: 'Someone replied to your take on 9takes',
				emailKind: 'transactional',
				idempotencyKey: 'account-reply-501',
				includeFooter: false,
				unsubscribeUrl: expect.stringContaining('/api/notifications/email-unsubscribe/')
			})
		);
		expect(marks).toEqual([{ id: 501, status: 'sent', error: null }]);
	});

	it('marks rows skipped when the user turned reply emails off, without sending', async () => {
		const { supabase, marks, rpc } = createSupabaseStub({
			rows: [{ email_replies: false }, { email_replies: true }]
		});
		const send = successfulSend();

		const summary = await processAccountReplyNotificationEmails({ supabase, send, secret: SECRET });

		expect(summary).toEqual({ claimed: 2, sent: 1, failed: 0, suppressed: 0, skipped: 1 });
		expect(send).toHaveBeenCalledTimes(1);
		expect(marks).toContainEqual({ id: 501, status: 'skipped', error: 'email_replies_off' });
		expect(marks).toContainEqual({ id: 502, status: 'sent', error: null });
		// The suppression check only sees addresses we might actually send to.
		expect(rpc).toHaveBeenCalledWith('get_suppressed_emails', {
			p_emails: ['reader@example.com']
		});
	});

	it('marks globally suppressed addresses suppressed and never sends to them', async () => {
		const { supabase, marks } = createSupabaseStub({
			rows: [{ recipient_email: 'gone@example.com' }, {}],
			suppressed: ['gone@example.com']
		});
		const send = successfulSend();

		const summary = await processAccountReplyNotificationEmails({ supabase, send, secret: SECRET });

		expect(summary).toEqual({ claimed: 2, sent: 1, failed: 0, suppressed: 1, skipped: 0 });
		expect(send).toHaveBeenCalledTimes(1);
		expect(send.mock.calls[0][0].to).toBe('Reader@Example.com');
		expect(marks).toContainEqual({ id: 501, status: 'suppressed', error: 'suppressed' });
	});

	it('fails closed when the suppression check is unavailable', async () => {
		const { supabase, marks } = createSupabaseStub({
			suppressionError: { message: 'function does not exist' }
		});
		const send = successfulSend();

		const summary = await processAccountReplyNotificationEmails({ supabase, send, secret: SECRET });

		expect(summary).toEqual({ claimed: 1, sent: 0, failed: 1, suppressed: 0, skipped: 0 });
		expect(send).not.toHaveBeenCalled();
		expect(marks).toEqual([{ id: 501, status: 'failed', error: 'suppression_check' }]);
	});

	it('marks a provider failure failed with its category and keeps processing the batch', async () => {
		const { supabase, marks } = createSupabaseStub({ rows: [{}, {}] });
		const send = vi
			.fn()
			.mockResolvedValueOnce({
				success: false,
				errorCategory: 'provider_rate_limited',
				providerAttempted: true,
				retrySafe: true
			})
			.mockResolvedValueOnce({
				success: true,
				messageId: 'gmail-message-2',
				providerAttempted: true,
				retrySafe: false
			});

		const summary = await processAccountReplyNotificationEmails({ supabase, send, secret: SECRET });

		expect(summary).toEqual({ claimed: 2, sent: 1, failed: 1, suppressed: 0, skipped: 0 });
		expect(marks).toContainEqual({ id: 501, status: 'failed', error: 'provider_rate_limited' });
		expect(marks).toContainEqual({ id: 502, status: 'sent', error: null });
	});

	it('does not let one throwing row abort the loop', async () => {
		const { supabase, marks } = createSupabaseStub({ rows: [{}, {}] });
		const send = vi.fn().mockRejectedValueOnce(new Error('boom')).mockResolvedValueOnce({
			success: true,
			messageId: 'gmail-message-2',
			providerAttempted: true,
			retrySafe: false
		});

		const summary = await processAccountReplyNotificationEmails({ supabase, send, secret: SECRET });

		expect(summary).toEqual({ claimed: 2, sent: 1, failed: 1, suppressed: 0, skipped: 0 });
		expect(marks).toContainEqual({ id: 501, status: 'failed', error: 'exception' });
		expect(marks).toContainEqual({ id: 502, status: 'sent', error: null });
	});

	it('reports a claim failure instead of throwing so the anonymous leg still runs', async () => {
		const { supabase } = createSupabaseStub({ claimError: { message: 'missing rpc' } });
		const send = successfulSend();

		const summary = await processAccountReplyNotificationEmails({ supabase, send, secret: SECRET });

		expect(summary).toEqual({
			claimed: 0,
			sent: 0,
			failed: 0,
			suppressed: 0,
			skipped: 0,
			error: 'claim_failed'
		});
		expect(send).not.toHaveBeenCalled();
	});
});
