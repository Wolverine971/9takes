// src/routes/api/admin/analytics/release-events/release-events.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { requireAdminMock } = vi.hoisted(() => ({
	requireAdminMock: vi.fn()
}));

vi.mock('$lib/server/adminAuth', () => ({
	requireAdmin: requireAdminMock
}));

import { GET, POST } from './+server';

describe('/api/admin/analytics/release-events', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('fetches and normalizes release event impact rows', async () => {
		const rpc = vi.fn().mockResolvedValue({
			data: [
				{
					id: '7',
					content_type: 'people',
					content_slug: 'sample-person',
					path: '/personality-analysis/sample-person',
					event_type: 'newsletter_sent',
					event_at: '2026-04-12T12:00:00.000Z',
					source: 'mailchimp',
					metadata: { campaign: 'launch' },
					days_before: '7',
					days_after: '7',
					views_before: '12',
					views_after: '33',
					unique_before: '10',
					unique_after: '28',
					avg_daily_before: '1.71',
					avg_daily_after: '4.71',
					lift_views: '21',
					lift_pct: '175'
				}
			],
			error: null
		});
		requireAdminMock.mockResolvedValue({ supabase: { rpc } });

		const response = await GET({
			url: new URL(
				'https://9takes.test/api/admin/analytics/release-events?slug=sample-person&daysBefore=7&daysAfter=7'
			),
			locals: {}
		} as any);
		const body = await response.json();

		expect(rpc).toHaveBeenCalledWith('get_content_release_event_impact', {
			p_slug: 'sample-person',
			p_days_before: 7,
			p_days_after: 7
		});
		expect(body.rows[0]).toMatchObject({
			id: 7,
			event_type: 'newsletter_sent',
			views_before: 12,
			views_after: 33,
			lift_pct: 175
		});
	});

	it('records a manual release event for the selected personality post', async () => {
		const rpc = vi.fn().mockResolvedValue({ data: 42, error: null });
		requireAdminMock.mockResolvedValue({ supabase: { rpc } });

		const response = await POST({
			request: new Request('https://9takes.test/api/admin/analytics/release-events', {
				method: 'POST',
				body: JSON.stringify({
					slug: 'sample-person',
					eventType: 'social_posted',
					eventAt: '2026-04-12T12:00:00.000Z',
					source: 'x',
					path: '/personality-analysis/sample-person',
					metadata: { title: 'Sample Person' }
				})
			}),
			locals: {}
		} as any);
		const body = await response.json();

		expect(rpc).toHaveBeenCalledWith('record_content_release_event', {
			p_content_type: 'people',
			p_content_slug: 'sample-person',
			p_event_type: 'social_posted',
			p_event_at: '2026-04-12T12:00:00.000Z',
			p_source: 'x',
			p_path: '/personality-analysis/sample-person',
			p_metadata: { title: 'Sample Person' }
		});
		expect(body).toEqual({ success: true, id: 42 });
	});

	it('rejects unsupported release event types', async () => {
		const rpc = vi.fn();
		requireAdminMock.mockResolvedValue({ supabase: { rpc } });

		const response = await POST({
			request: new Request('https://9takes.test/api/admin/analytics/release-events', {
				method: 'POST',
				body: JSON.stringify({
					slug: 'sample-person',
					eventType: 'unsupported_event'
				})
			}),
			locals: {}
		} as any);
		const body = await response.json();

		expect(response.status).toBe(400);
		expect(body.success).toBe(false);
		expect(rpc).not.toHaveBeenCalled();
	});
});
