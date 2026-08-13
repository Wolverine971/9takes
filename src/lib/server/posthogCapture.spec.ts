// src/lib/server/posthogCapture.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$env/static/public', () => ({
	PUBLIC_POSTHOG_KEY: 'phc_test_project_key',
	PUBLIC_POSTHOG_HOST: 'https://us.i.posthog.com'
}));

import {
	buildReplyNotificationPostHogPayload,
	captureReplyNotificationEvent
} from './posthogCapture';

const context = {
	outboxId: 91,
	subscriptionId: 22,
	questionId: 42,
	commentId: 100,
	replyCommentId: 101,
	attempt: 1
};

describe('reply notification server analytics', () => {
	beforeEach(() => vi.restoreAllMocks());

	it('builds anonymous, deduplicated properties without recipient data', () => {
		const payload = buildReplyNotificationPostHogPayload(
			'reply_notification_sent',
			context,
			'sent'
		);

		expect(payload.properties).toMatchObject({
			distinct_id: 'reply-notification:91',
			$process_person_profile: false,
			$insert_id: 'reply_notification_sent:91:sent',
			outbox_id: 91,
			subscription_id: 22,
			question_id: 42,
			comment_id: 100,
			reply_comment_id: 101
		});
		expect(JSON.stringify(payload)).not.toMatch(
			/recipient_email|fingerprint|management_token|@example/i
		);
	});

	it('posts to the capture API without creating a person profile', async () => {
		const fetchImpl = vi.fn().mockResolvedValue({ ok: true, status: 200 });

		await expect(
			captureReplyNotificationEvent('reply_notification_queued', context, {
				insertIdSuffix: 'queued',
				fetchImpl: fetchImpl as never
			})
		).resolves.toBe(true);

		expect(fetchImpl).toHaveBeenCalledWith(
			'https://us.i.posthog.com/capture/',
			expect.objectContaining({ method: 'POST' })
		);
		const request = fetchImpl.mock.calls[0][1];
		const body = JSON.parse(String(request.body));
		expect(body.properties.$process_person_profile).toBe(false);
		expect(JSON.stringify(body)).not.toContain('@example.com');
	});
});
