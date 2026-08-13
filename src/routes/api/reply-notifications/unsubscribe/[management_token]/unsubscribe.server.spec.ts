// src/routes/api/reply-notifications/unsubscribe/[management_token]/unsubscribe.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { captureReplyNotificationEventMock, loggerWarnMock } = vi.hoisted(() => ({
	captureReplyNotificationEventMock: vi.fn().mockResolvedValue(true),
	loggerWarnMock: vi.fn()
}));

vi.mock('$lib/server/posthogCapture', () => ({
	captureReplyNotificationEvent: captureReplyNotificationEventMock
}));
vi.mock('$lib/utils/logger', () => ({ logger: { warn: loggerWarnMock } }));

import { GET, POST } from './+server';

const TOKEN = '43f280b0-1234-4abc-9def-123456789abc';

describe('/api/reply-notifications/unsubscribe/[management_token]', () => {
	beforeEach(() => vi.clearAllMocks());

	it('renders a safe confirmation on GET without changing state or showing an email', async () => {
		const response = await GET({ params: { management_token: TOKEN } } as any);
		const html = await response.text();

		expect(response.status).toBe(200);
		expect(response.headers.get('cache-control')).toBe('no-store');
		expect(html).toContain('Stop reply emails for this conversation?');
		expect(html).not.toMatch(/@|recipient|reader@example/i);
	});

	it('stops only the conversation subscription on POST and emits no PII', async () => {
		const rpc = vi.fn().mockResolvedValue({
			data: {
				status: 'unsubscribed',
				outbox_id: 91,
				subscription_id: 22,
				question_id: 42,
				comment_id: 100
			},
			error: null
		});
		const waitUntil = vi.fn();

		const response = await POST({
			params: { management_token: TOKEN },
			request: new Request(`https://9takes.com/api/reply-notifications/unsubscribe/${TOKEN}`, {
				method: 'POST',
				headers: { accept: 'application/json' }
			}),
			locals: { supabase: { rpc } },
			platform: { context: { waitUntil } }
		} as any);

		expect(response.status).toBe(200);
		expect(rpc).toHaveBeenCalledWith('unsubscribe_comment_reply_subscription', {
			p_management_token: TOKEN
		});
		expect(waitUntil).toHaveBeenCalledTimes(1);
		await waitUntil.mock.calls[0][0];
		expect(captureReplyNotificationEventMock).toHaveBeenCalledWith(
			'reply_notification_unsubscribed',
			{ outboxId: 91, subscriptionId: 22, questionId: 42, commentId: 100 },
			{ insertIdSuffix: 'unsubscribed' }
		);
		expect(JSON.stringify(captureReplyNotificationEventMock.mock.calls)).not.toMatch(
			/@|email|token|fingerprint/i
		);
	});

	it('rejects malformed tokens without calling the database', async () => {
		const rpc = vi.fn();
		await expect(
			POST({
				params: { management_token: 'not-a-token' },
				request: new Request('https://9takes.com/api/reply-notifications/unsubscribe/nope', {
					method: 'POST'
				}),
				locals: { supabase: { rpc } }
			} as any)
		).rejects.toMatchObject({ status: 404 });
		expect(rpc).not.toHaveBeenCalled();
	});
});
