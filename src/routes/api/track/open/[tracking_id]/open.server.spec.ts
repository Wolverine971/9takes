// src/routes/api/track/open/[tracking_id]/open.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { loggerMocks } = vi.hoisted(() => ({
	loggerMocks: {
		warn: vi.fn()
	}
}));

vi.mock('$lib/utils/logger', () => ({
	logger: loggerMocks
}));

import { GET } from './+server';

const VALID_TRACKING_ID = '550e8400-e29b-41d4-a716-446655440000';

function buildEvent({
	trackingId = VALID_TRACKING_ID,
	rpc = vi.fn().mockResolvedValue({ data: true, error: null })
}: {
	trackingId?: string;
	rpc?: ReturnType<typeof vi.fn>;
} = {}) {
	const waitUntil = vi.fn();

	return {
		event: {
			params: { tracking_id: trackingId },
			request: new Request(`https://9takes.test/api/track/open/${trackingId}`, {
				headers: {
					'user-agent': 'test-email-client',
					'x-forwarded-for': '203.0.113.10, 10.0.0.1'
				}
			}),
			locals: {
				supabase: { rpc }
			},
			platform: {
				context: { waitUntil }
			}
		},
		rpc,
		waitUntil
	};
}

describe('GET /api/track/open/[tracking_id]', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns the tracking pixel and queues the database write', async () => {
		const { event, rpc, waitUntil } = buildEvent();

		const response = await GET(event as any);

		expect(response.status).toBe(200);
		expect(response.headers.get('content-type')).toBe('image/gif');
		expect(response.headers.get('cache-control')).toContain('no-store');
		expect(waitUntil).toHaveBeenCalledTimes(1);

		await waitUntil.mock.calls[0][0];
		expect(rpc).toHaveBeenCalledWith('track_email_event', {
			p_tracking_id: VALID_TRACKING_ID,
			p_event_type: 'open',
			p_link_url: null,
			p_ip_address: '203.0.113.10',
			p_user_agent: 'test-email-client'
		});
	});

	it('does not call Supabase for an invalid tracking ID', async () => {
		const { event, rpc, waitUntil } = buildEvent({ trackingId: 'not-a-uuid' });

		const response = await GET(event as any);

		expect(response.status).toBe(200);
		expect(rpc).not.toHaveBeenCalled();
		expect(waitUntil).not.toHaveBeenCalled();
	});

	it('keeps database failures out of the pixel response and logs a warning', async () => {
		const trackingError = {
			message: 'TypeError: fetch failed',
			details: 'SocketError: other side closed (UND_ERR_SOCKET)',
			code: ''
		};
		const rpc = vi.fn().mockResolvedValue({ data: null, error: trackingError });
		const { event, waitUntil } = buildEvent({ rpc });

		const response = await GET(event as any);

		expect(response.status).toBe(200);
		await waitUntil.mock.calls[0][0];
		expect(loggerMocks.warn).toHaveBeenCalledWith(
			'Failed to track email open',
			expect.objectContaining({
				error: expect.objectContaining({
					message: 'TypeError: fetch failed',
					details: 'SocketError: other side closed (UND_ERR_SOCKET)'
				})
			})
		);
	});

	it('does not warn when a valid but stale tracking ID is not found', async () => {
		const rpc = vi.fn().mockResolvedValue({ data: false, error: null });
		const { event, waitUntil } = buildEvent({ rpc });

		const response = await GET(event as any);

		expect(response.status).toBe(200);
		await waitUntil.mock.calls[0][0];
		expect(loggerMocks.warn).not.toHaveBeenCalled();
	});
});
