// src/lib/server/replyNotificationDelivery.spec.ts
import { describe, expect, it, vi } from 'vitest';
import {
	buildReplyNotificationEmail,
	processReplyNotificationOutbox
} from './replyNotificationDelivery';

const claimedRow = {
	outbox_id: 91,
	subscription_id: 22,
	comment_id: 100,
	reply_comment_id: 101,
	question_id: 42,
	question_url: 'what-helps-you-feel-understood',
	recipient_email: 'reader@example.com',
	management_token: '43f280b0-1234-4abc-9def-123456789abc',
	return_token: 'c2613ed2-aaaa-4bbb-8ccc-123456789abc',
	attempt_count: 1,
	email_send_id: null,
	tracking_id: null
};

function createSupabaseStub({ preparationStatus = 'ready', failureStatus = 'failed' } = {}) {
	const rpc = vi.fn(async (name: string) => {
		if (name === 'claim_reply_notification_outbox') return { data: [claimedRow], error: null };
		if (name === 'create_reply_notification_tracking') {
			return {
				data: {
					status: 'ready',
					id: '550e8400-e29b-41d4-a716-446655440001',
					tracking_id: '550e8400-e29b-41d4-a716-446655440002'
				},
				error: null
			};
		}
		if (name === 'prepare_reply_notification_delivery') {
			return { data: { status: preparationStatus }, error: null };
		}
		if (name === 'complete_reply_notification_delivery') {
			return { data: { status: 'sent' }, error: null };
		}
		if (name === 'fail_reply_notification_delivery') {
			return { data: { status: failureStatus }, error: null };
		}
		throw new Error(`Unexpected RPC ${name}`);
	});
	const writes: Array<{ table: string; operation: string; value: unknown }> = [];
	const from = vi.fn((table: string) => ({
		update(value: unknown) {
			writes.push({ table, operation: 'update', value });
			return { eq: vi.fn().mockResolvedValue({ error: null }) };
		}
	}));

	return { supabase: { rpc, from }, rpc, from, writes };
}

describe('reply notification delivery', () => {
	it('builds narrow content with an exact-reply link and conversation-only stop URL', () => {
		const email = buildReplyNotificationEmail(claimedRow);

		expect(email.readUrl).toBe(
			'https://9takes.com/api/reply-notifications/return/c2613ed2-aaaa-4bbb-8ccc-123456789abc'
		);
		expect(email.unsubscribeUrl).toContain(
			'/api/reply-notifications/unsubscribe/43f280b0-1234-4abc-9def-123456789abc'
		);
		expect(email.subject).toBe('Someone replied to your take on 9takes');
		expect(email.htmlContent).not.toMatch(/reader@example|comment text|author/i);
	});

	it('sends once, records the shared tracking row, and emits only privacy-safe events', async () => {
		const { supabase, rpc, writes } = createSupabaseStub();
		const send = vi.fn().mockResolvedValue({
			success: true,
			messageId: 'gmail-message-1',
			providerAttempted: true,
			retrySafe: false
		});
		const capture = vi.fn().mockResolvedValue(true);

		const summary = await processReplyNotificationOutbox(10, { supabase, send, capture });

		expect(summary).toEqual({
			claimed: 1,
			sent: 1,
			retried: 0,
			failed: 0,
			ambiguous: 0,
			skipped: 0
		});
		expect(send).toHaveBeenCalledTimes(1);
		expect(send).toHaveBeenCalledWith(
			expect.objectContaining({
				to: 'reader@example.com',
				trackingId: '550e8400-e29b-41d4-a716-446655440002',
				includeFooter: false,
				unsubscribeUrl: expect.stringContaining('/api/reply-notifications/unsubscribe/')
			})
		);
		expect(rpc).toHaveBeenCalledWith(
			'create_reply_notification_tracking',
			expect.objectContaining({
				p_outbox_id: 91,
				p_html_content: expect.not.stringContaining(claimedRow.management_token),
				p_plain_text_content: expect.not.stringContaining(claimedRow.management_token)
			})
		);
		expect(JSON.stringify(rpc.mock.calls)).not.toContain(claimedRow.return_token);
		expect(rpc).toHaveBeenCalledWith(
			'complete_reply_notification_delivery',
			expect.objectContaining({ p_outbox_id: 91 })
		);
		expect(capture).toHaveBeenCalledWith(
			'reply_notification_sent',
			expect.objectContaining({ commentId: 100, replyCommentId: 101 }),
			{ insertIdSuffix: 'sent' }
		);
		expect(JSON.stringify(capture.mock.calls)).not.toMatch(/reader@example|management_token/i);
	});

	it('does not retry an ambiguous Gmail failure', async () => {
		const { supabase, rpc } = createSupabaseStub({ failureStatus: 'ambiguous' });
		const send = vi.fn().mockResolvedValue({
			success: false,
			errorCategory: 'provider_unavailable',
			providerAttempted: true,
			retrySafe: false
		});
		const capture = vi.fn().mockResolvedValue(true);

		const summary = await processReplyNotificationOutbox(10, { supabase, send, capture });

		expect(summary.ambiguous).toBe(1);
		expect(summary.retried).toBe(0);
		expect(rpc).toHaveBeenCalledWith(
			'fail_reply_notification_delivery',
			expect.objectContaining({
				p_retry_safe: false,
				p_provider_attempted: true
			})
		);
		expect(capture).toHaveBeenCalledWith(
			'reply_notification_failed',
			expect.objectContaining({ failureCategory: 'provider_ambiguous' }),
			{ insertIdSuffix: 'attempt-1' }
		);
	});

	it('skips provider delivery when the final pre-send gate is no longer ready', async () => {
		const { supabase } = createSupabaseStub({ preparationStatus: 'suppressed' });
		const send = vi.fn();

		const summary = await processReplyNotificationOutbox(10, {
			supabase,
			send,
			capture: vi.fn().mockResolvedValue(true)
		});

		expect(summary.skipped).toBe(1);
		expect(send).not.toHaveBeenCalled();
	});
});
