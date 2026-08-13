// src/routes/api/reply-notifications/return/[return_token]/return.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$env/static/private', () => ({
	SUPABASE_SERVICE_KEY: 'test-only-return-secret'
}));

import { GET } from './+server';
import {
	REPLY_RETURN_COOKIE,
	REPLY_RETURN_COOKIE_PATH,
	verifyReplyNotificationReturn
} from '$lib/server/replyNotificationReturn';

const RETURN_TOKEN = '550e8400-e29b-41d4-a716-446655440000';

function buildEvent(
	rpc = vi.fn().mockResolvedValue({
		data: {
			outbox_id: 91,
			subscription_id: 22,
			question_id: 42,
			question_url: 'what-helps-you-feel-understood',
			comment_id: 100,
			reply_comment_id: 101,
			target_status: 'available',
			subscription_status: 'active'
		},
		error: null
	})
) {
	const cookies = { set: vi.fn() };
	return {
		event: {
			params: { return_token: RETURN_TOKEN },
			locals: { supabase: { rpc } },
			cookies
		},
		rpc,
		cookies
	};
}

describe('GET /api/reply-notifications/return/[return_token]', () => {
	beforeEach(() => vi.clearAllMocks());

	it('sets a short-lived signed handoff and redirects to a clean exact-target URL', async () => {
		const { event, rpc, cookies } = buildEvent();

		await expect(GET(event as never)).rejects.toMatchObject({
			status: 303,
			location: '/questions/what-helps-you-feel-understood#reply-notification-target'
		});

		expect(rpc).toHaveBeenCalledWith('get_reply_notification_return_context', {
			p_return_token: RETURN_TOKEN
		});
		expect(cookies.set).toHaveBeenCalledWith(
			REPLY_RETURN_COOKIE,
			expect.any(String),
			expect.objectContaining({
				path: REPLY_RETURN_COOKIE_PATH,
				httpOnly: true,
				secure: true,
				sameSite: 'lax'
			})
		);
		const signed = cookies.set.mock.calls[0][1];
		expect(verifyReplyNotificationReturn(signed, { secret: 'test-only-return-secret' })).toEqual({
			outboxId: 91,
			subscriptionId: 22,
			questionId: 42,
			commentId: 100,
			replyCommentId: 101,
			targetStatus: 'available',
			subscriptionStatus: 'active'
		});
		expect(JSON.stringify(cookies.set.mock.calls)).not.toMatch(/reader@example|fingerprint/i);
	});

	it('fails closed for an unknown return token', async () => {
		const { event, cookies } = buildEvent(vi.fn().mockResolvedValue({ data: null, error: null }));

		await expect(GET(event as never)).rejects.toMatchObject({
			status: 303,
			location: 'https://9takes.com'
		});
		expect(cookies.set).not.toHaveBeenCalled();
	});
});
