// src/routes/api/track/click/[tracking_id]/[encoded_url]/click.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { loggerMocks, captureReplyNotificationEventMock, getSupabaseAdminClientMock } = vi.hoisted(
	() => ({
		loggerMocks: {
			warn: vi.fn()
		},
		captureReplyNotificationEventMock: vi.fn().mockResolvedValue(true),
		getSupabaseAdminClientMock: vi.fn()
	})
);

vi.mock('$lib/utils/logger', () => ({ logger: loggerMocks }));
vi.mock('$lib/server/supabaseAdmin', () => ({
	getSupabaseAdminClient: getSupabaseAdminClientMock
}));
vi.mock('$lib/server/posthogCapture', () => ({
	captureReplyNotificationEvent: captureReplyNotificationEventMock
}));

import { GET } from './+server';

const TRACKING_ID = '550e8400-e29b-41d4-a716-446655440000';
const RETURN_TOKEN = 'c2613ed2-aaaa-4bbb-8ccc-123456789abc';
const HUMAN_USER_AGENT =
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/150.0.0.0 Safari/537.36';

function encodeTarget(targetUrl: string): string {
	return Buffer.from(encodeURIComponent(targetUrl)).toString('base64url');
}

function buildEvent({
	targetUrl = 'https://9takes.com/questions/example?utm_source=reactivation&utm_medium=email&utm_campaign=reactivation-sequence',
	trackingId = TRACKING_ID,
	userAgent = HUMAN_USER_AGENT,
	rpc = vi.fn().mockResolvedValue({ data: true, error: null })
}: {
	targetUrl?: string;
	trackingId?: string;
	userAgent?: string;
	rpc?: ReturnType<typeof vi.fn>;
} = {}) {
	const waitUntil = vi.fn();
	const encodedUrl = encodeTarget(targetUrl);
	getSupabaseAdminClientMock.mockReturnValue({ rpc });

	return {
		event: {
			params: { tracking_id: trackingId, encoded_url: encodedUrl },
			request: new Request(`https://9takes.com/api/track/click/${trackingId}/${encodedUrl}`, {
				headers: {
					'user-agent': userAgent,
					'x-forwarded-for': '203.0.113.10, 10.0.0.1'
				}
			}),
			locals: { supabase: { rpc } },
			platform: { context: { waitUntil } }
		},
		rpc,
		waitUntil,
		targetUrl
	};
}

describe('GET /api/track/click/[tracking_id]/[encoded_url]', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('redirects immediately and persists an unqualified raw click through waitUntil', async () => {
		const { event, rpc, waitUntil, targetUrl } = buildEvent();

		const response = await GET(event as never);
		expect(response.status).toBe(302);
		expect(response.headers.get('location')).toBe(targetUrl);
		expect(response.headers.get('cache-control')).toContain('no-store');
		expect(waitUntil).toHaveBeenCalledTimes(1);

		await waitUntil.mock.calls[0][0];
		expect(rpc).toHaveBeenCalledWith('track_email_event', {
			p_tracking_id: TRACKING_ID,
			p_event_type: 'click',
			p_link_url: targetUrl,
			p_ip_address: '203.0.113.10',
			p_user_agent: HUMAN_USER_AGENT,
			p_classification: 'unknown',
			p_classification_reason: 'awaiting_behavioral_holdback',
			p_classifier_version: 'email-event-v1'
		});
	});

	it('captures a privacy-safe reply-notification click when the tracking row matches', async () => {
		const rpc = vi.fn(async (name: string) => {
			if (name === 'track_email_event') return { data: true, error: null };
			if (name === 'get_reply_notification_analytics_context') {
				return {
					data: {
						outbox_id: 91,
						subscription_id: 22,
						question_id: 42,
						comment_id: 100,
						reply_comment_id: 101
					},
					error: null
				};
			}
			throw new Error(`Unexpected RPC ${name}`);
		});
		const { event, waitUntil } = buildEvent({
			rpc,
			targetUrl: `https://9takes.com/api/reply-notifications/return/${RETURN_TOKEN}`
		});

		await GET(event as never);
		await waitUntil.mock.calls[0][0];

		expect(rpc).toHaveBeenCalledWith(
			'track_email_event',
			expect.objectContaining({
				p_link_url: 'https://9takes.com/api/reply-notifications/return/[private]'
			})
		);
		expect(captureReplyNotificationEventMock).toHaveBeenCalledWith(
			'reply_notification_clicked',
			{
				outboxId: 91,
				subscriptionId: 22,
				questionId: 42,
				commentId: 100,
				replyCommentId: 101
			},
			{ insertIdSuffix: 'first-click' }
		);
		expect(JSON.stringify(captureReplyNotificationEventMock.mock.calls)).not.toMatch(
			/email|token|fingerprint/i
		);
		expect(JSON.stringify(rpc.mock.calls)).not.toContain(RETURN_TOKEN);
	});

	it('redirects an obvious scanner and retains it as automated raw telemetry', async () => {
		const { event, rpc, waitUntil, targetUrl } = buildEvent({
			userAgent: 'Proofpoint URL Defense Link Scanner'
		});

		const response = await GET(event as never);
		expect(response.status).toBe(302);
		expect(response.headers.get('location')).toBe(targetUrl);
		expect(waitUntil).toHaveBeenCalledTimes(1);
		await waitUntil.mock.calls[0][0];
		expect(rpc).toHaveBeenCalledWith(
			'track_email_event',
			expect.objectContaining({
				p_classification: 'automated',
				p_classification_reason: 'known_automation_user_agent'
			})
		);
	});

	it('does not forward a scanner into a state-changing re-permission action', async () => {
		const { event, rpc, waitUntil } = buildEvent({
			targetUrl: `https://9takes.com/api/email/re-permission/yes/${TRACKING_ID}`,
			userAgent: 'Mimecast Link Scanner'
		});

		const response = await GET(event as never);
		expect(response.status).toBe(302);
		expect(response.headers.get('location')).toBe('https://9takes.com');
		expect(waitUntil).toHaveBeenCalledTimes(1);
		await waitUntil.mock.calls[0][0];
		expect(rpc).toHaveBeenCalledWith(
			'track_email_event',
			expect.objectContaining({ p_classification: 'automated' })
		);
	});

	it('logs a durable-write failure without blocking the redirect', async () => {
		const trackingError = { message: 'database unavailable', code: '08006' };
		const rpc = vi.fn().mockResolvedValue({ data: null, error: trackingError });
		const { event, waitUntil, targetUrl } = buildEvent({ rpc });

		const response = await GET(event as never);
		expect(response.status).toBe(302);
		expect(response.headers.get('location')).toBe(targetUrl);
		await waitUntil.mock.calls[0][0];

		expect(loggerMocks.warn).toHaveBeenCalledWith(
			'Failed to persist email click',
			expect.objectContaining({ error: expect.objectContaining(trackingError) })
		);
	});

	it('does not track a blocked external redirect target', async () => {
		const { event, rpc, waitUntil } = buildEvent({ targetUrl: 'https://example.com/phishing' });

		const response = await GET(event as never);
		expect(response.status).toBe(302);
		expect(response.headers.get('location')).toBe('https://9takes.com');
		expect(waitUntil).not.toHaveBeenCalled();
		expect(rpc).not.toHaveBeenCalled();
	});

	it('upgrades legacy first-party HTTP targets to HTTPS', async () => {
		const targetUrl = 'http://9takes.com/questions/legacy';
		const { event, waitUntil } = buildEvent({ targetUrl });

		const response = await GET(event as never);
		expect(response.headers.get('location')).toBe('https://9takes.com/questions/legacy');
		await waitUntil.mock.calls[0][0];
	});
});
