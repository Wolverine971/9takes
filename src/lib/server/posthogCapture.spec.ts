// src/lib/server/posthogCapture.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$env/static/public', () => ({
	PUBLIC_POSTHOG_KEY: 'phc_test_project_key',
	PUBLIC_POSTHOG_HOST: 'https://us.i.posthog.com'
}));

import {
	buildEmailSignupCompletedPostHogPayload,
	captureEmailSignupCompleted,
	buildRegistrationCompletedPostHogPayload,
	buildReplyNotificationPostHogPayload,
	captureRegistrationCompleted,
	captureReplyNotificationEvent
} from './posthogCapture';

describe('saved newsletter signup analytics', () => {
	const signup = {
		signupId: '456',
		host: '9takes.com',
		userAgent: 'Mozilla/5.0',
		analytics: {
			distinctId: '019a0000-0000-7000-8000-000000000001',
			sessionId: '019a0000-0000-7000-8000-000000000002',
			surface: 'blog_purpose',
			sourcePath: '/personality-analysis/example',
			email: 'private@example.com',
			server_confirmed: false
		}
	};

	it('preserves funnel identity, stamps server provenance, and allowlists request metadata', () => {
		const payload = buildEmailSignupCompletedPostHogPayload(signup)!;
		expect(payload.distinct_id).toBe(signup.analytics.distinctId);
		expect(payload.properties).toMatchObject({
			$session_id: signup.analytics.sessionId,
			$host: '9takes.com',
			source_path: '/personality-analysis/example',
			capture_source: 'server',
			signup_tracking_version: 2,
			server_confirmed: true
		});
		expect(payload.uuid).toBe(buildEmailSignupCompletedPostHogPayload(signup)!.uuid);
		expect(JSON.stringify(payload)).not.toContain('private@example.com');
	});

	it('drops query strings and invalid identifiers instead of sending personal data', () => {
		expect(
			buildEmailSignupCompletedPostHogPayload({
				...signup,
				analytics: { ...signup.analytics, distinctId: 'private@example.com' }
			})
		).toBeNull();
		const payload = buildEmailSignupCompletedPostHogPayload({
			...signup,
			analytics: {
				...signup.analytics,
				sourcePath: '/email?email=private@example.com',
				sessionId: 'not-a-session'
			}
		})!;
		expect(payload.properties).not.toHaveProperty('source_path');
		expect(payload.properties).not.toHaveProperty('$session_id');
	});

	it('skips unavailable/opted-out browser tracking and tolerates capture failures', async () => {
		const fetchImpl = vi.fn().mockRejectedValue(new Error('offline'));
		await expect(
			captureEmailSignupCompleted({ ...signup, analytics: null }, { fetchImpl })
		).resolves.toBe(false);
		expect(fetchImpl).not.toHaveBeenCalled();
		await expect(captureEmailSignupCompleted(signup, { fetchImpl })).resolves.toBe(false);
	});

	it('sends the verified event with a bounded network request', async () => {
		const fetchImpl = vi.fn().mockResolvedValue({ ok: true, status: 200 });
		await expect(captureEmailSignupCompleted(signup, { fetchImpl })).resolves.toBe(true);
		const [url, request] = fetchImpl.mock.calls[0];
		expect(url).toBe('https://us.i.posthog.com/capture/');
		expect(request.signal).toBeInstanceOf(AbortSignal);
		expect(JSON.parse(request.body)).toMatchObject({
			event: 'email_signup_completed',
			distinct_id: signup.analytics.distinctId,
			properties: { capture_source: 'server', signup_tracking_version: 2 }
		});
	});
});

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

describe('registration server analytics', () => {
	beforeEach(() => vi.restoreAllMocks());

	it('builds a deduplicated conversion without email or other request identifiers', () => {
		const payload = buildRegistrationCompletedPostHogPayload({
			userId: 'user-123',
			enneagramType: 5
		});

		expect(payload).toMatchObject({
			event: 'registration_completed',
			properties: {
				distinct_id: 'user-123',
				$process_person_profile: true,
				$insert_id: 'registration_completed:user-123',
				enneagram_type: 5,
				has_enneagram_type: true,
				server_confirmed: true
			}
		});
		expect(JSON.stringify(payload)).not.toMatch(/email|fingerprint|token|ip_address/i);
	});

	it('posts the registration conversion to PostHog', async () => {
		const fetchImpl = vi.fn().mockResolvedValue({ ok: true, status: 200 });

		await expect(
			captureRegistrationCompleted({ userId: 'user-123' }, { fetchImpl: fetchImpl as never })
		).resolves.toBe(true);

		expect(fetchImpl).toHaveBeenCalledWith(
			'https://us.i.posthog.com/capture/',
			expect.objectContaining({ method: 'POST' })
		);
	});
});
