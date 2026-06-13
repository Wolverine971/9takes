// src/routes/api/analytics/page-view/page-view.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { loggerMocks } = vi.hoisted(() => ({
	loggerMocks: {
		info: vi.fn(),
		warn: vi.fn(),
		error: vi.fn(),
		logApiRequest: vi.fn(),
		logApiResponse: vi.fn()
	}
}));

vi.mock('$lib/utils/logger', () => ({
	logger: loggerMocks,
	withApiLogging: (handler: unknown) => handler
}));

import { POST } from './+server';

const validPayload = {
	visit_key: '550e8400-e29b-41d4-a716-446655440000',
	session_key: 'session-123',
	fingerprint: 'visitor-123',
	path: '/personality-analysis/John-Doe',
	route_id: '/personality-analysis/[slug]',
	path_group: '/personality-analysis/[slug]',
	content_type: 'people',
	content_slug: 'john-doe',
	referrer_host: 'www.google.com'
};

function buildEvent({
	payload = validPayload,
	rpc = vi
		.fn()
		.mockResolvedValue({ data: [{ session_id: 'session-id', visit_id: 1 }], error: null })
}: {
	payload?: Record<string, unknown>;
	rpc?: ReturnType<typeof vi.fn>;
} = {}) {
	const waitUntil = vi.fn();

	return {
		event: {
			request: new Request('https://9takes.test/api/analytics/page-view', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			}),
			locals: {
				session: {
					user: {
						id: 'user-123'
					}
				},
				supabase: {
					rpc
				}
			},
			platform: {
				context: {
					waitUntil
				}
			}
		},
		rpc,
		waitUntil
	};
}

describe('POST /api/analytics/page-view', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('queues valid page-view writes and returns immediately', async () => {
		const { event, rpc, waitUntil } = buildEvent();

		const response = await POST(event as any);
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(body).toEqual({
			ok: true,
			queued: true,
			session_id: null,
			visit_id: null
		});
		expect(waitUntil).toHaveBeenCalledTimes(1);

		await waitUntil.mock.calls[0][0];
		expect(rpc).toHaveBeenCalledWith(
			'upsert_page_analytics_visit',
			expect.objectContaining({
				p_visit_key: validPayload.visit_key,
				p_session_key: validPayload.session_key,
				p_user_id: 'user-123',
				p_path: '/personality-analysis/john-doe',
				p_route_id: '/personality-analysis/[slug]'
			})
		);
	});

	it('keeps telemetry storage failures out of the API response', async () => {
		const rpc = vi.fn().mockResolvedValue({
			data: null,
			error: {
				message: 'TypeError: fetch failed',
				code: ''
			}
		});
		const { event, waitUntil } = buildEvent({ rpc });

		const response = await POST(event as any);
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(body.ok).toBe(true);

		await waitUntil.mock.calls[0][0];
		expect(loggerMocks.warn).toHaveBeenCalledWith(
			'Failed to upsert page analytics visit',
			expect.objectContaining({
				path: '/personality-analysis/john-doe',
				error: expect.objectContaining({
					message: 'TypeError: fetch failed'
				})
			})
		);
	});
});
