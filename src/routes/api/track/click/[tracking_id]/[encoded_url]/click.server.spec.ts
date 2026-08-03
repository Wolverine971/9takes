import { beforeEach, describe, expect, it, vi } from 'vitest';

const { reactivationMocks, loggerMocks } = vi.hoisted(() => ({
	reactivationMocks: {
		exitReactivationSequenceForTrackedClick: vi.fn().mockResolvedValue(1)
	},
	loggerMocks: {
		warn: vi.fn()
	}
}));

vi.mock('$lib/server/reactivationRepermission', () => reactivationMocks);
vi.mock('$lib/utils/logger', () => ({ logger: loggerMocks }));

import { GET } from './+server';

const TRACKING_ID = '550e8400-e29b-41d4-a716-446655440000';
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
		reactivationMocks.exitReactivationSequenceForTrackedClick.mockResolvedValue(1);
	});

	it('redirects immediately and persists a human click through waitUntil', async () => {
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
			p_user_agent: HUMAN_USER_AGENT
		});
		expect(reactivationMocks.exitReactivationSequenceForTrackedClick).toHaveBeenCalledWith(
			TRACKING_ID
		);
	});

	it('redirects an obvious scanner without recording engagement', async () => {
		const { event, rpc, waitUntil, targetUrl } = buildEvent({
			userAgent: 'Proofpoint URL Defense Link Scanner'
		});

		const response = await GET(event as never);
		expect(response.status).toBe(302);
		expect(response.headers.get('location')).toBe(targetUrl);
		expect(waitUntil).not.toHaveBeenCalled();
		expect(rpc).not.toHaveBeenCalled();
		expect(reactivationMocks.exitReactivationSequenceForTrackedClick).not.toHaveBeenCalled();
	});

	it('does not forward a scanner into a state-changing re-permission action', async () => {
		const { event, rpc, waitUntil } = buildEvent({
			targetUrl: `https://9takes.com/api/email/re-permission/yes/${TRACKING_ID}`,
			userAgent: 'Mimecast Link Scanner'
		});

		const response = await GET(event as never);
		expect(response.status).toBe(302);
		expect(response.headers.get('location')).toBe('https://9takes.com');
		expect(waitUntil).not.toHaveBeenCalled();
		expect(rpc).not.toHaveBeenCalled();
		expect(reactivationMocks.exitReactivationSequenceForTrackedClick).not.toHaveBeenCalled();
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
