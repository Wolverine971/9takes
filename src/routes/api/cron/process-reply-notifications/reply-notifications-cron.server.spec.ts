// src/routes/api/cron/process-reply-notifications/reply-notifications-cron.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { processReplyNotificationOutboxMock } = vi.hoisted(() => ({
	processReplyNotificationOutboxMock: vi.fn()
}));

vi.mock('$env/static/private', () => ({ CRON_SECRET: 'cron-test-secret' }));
vi.mock('$lib/server/replyNotificationDelivery', () => ({
	processReplyNotificationOutbox: processReplyNotificationOutboxMock
}));

import { GET } from './+server';

describe('/api/cron/process-reply-notifications', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		processReplyNotificationOutboxMock.mockResolvedValue({
			claimed: 1,
			sent: 1,
			retried: 0,
			failed: 0,
			ambiguous: 0,
			skipped: 0
		});
	});

	it('fails closed without the cron secret', async () => {
		await expect(
			GET({
				request: new Request('https://9takes.com/api/cron/process-reply-notifications')
			} as any)
		).rejects.toMatchObject({ status: 401 });
		expect(processReplyNotificationOutboxMock).not.toHaveBeenCalled();
	});

	it('processes a bounded worker run when authorized', async () => {
		const response = await GET({
			request: new Request('https://9takes.com/api/cron/process-reply-notifications', {
				headers: { authorization: 'Bearer cron-test-secret' }
			})
		} as any);

		expect(response.status).toBe(200);
		expect(await response.json()).toMatchObject({ processed: 1, sent: 1 });
		expect(processReplyNotificationOutboxMock).toHaveBeenCalledWith(10);
	});
});
