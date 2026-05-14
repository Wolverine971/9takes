// src/routes/api/admin/analytics/trending/trending.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { requireAdminMock } = vi.hoisted(() => ({
	requireAdminMock: vi.fn()
}));

vi.mock('$lib/server/adminAuth', () => ({
	requireAdmin: requireAdminMock
}));

import { GET } from './+server';

describe('/api/admin/analytics/trending', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('fetches and normalizes trending page rows', async () => {
		const rpc = vi.fn().mockResolvedValue({
			data: [
				{
					path: '/questions',
					path_group: '/questions',
					content_type: 'question',
					current_visits: '14',
					current_unique_visitors: '11',
					baseline_avg_visits: '2.14',
					baseline_avg_unique_visitors: '1.8',
					lift_visits: '11.86',
					lift_unique_visitors: '9.2',
					ratio_visits: '6.54',
					trend_score: '31.2',
					confidence: 'broad',
					top_sources: [{ key: 'internal', count: '8' }],
					top_referrers: [{ key: '9takes.com', count: '8' }],
					avg_time_on_page_ms: '7669',
					median_time_on_page_ms: '0',
					bounce_rate: '85.71',
					is_low_unique: false
				},
				{
					path: '/enneagram-corner/enneagram-social-styles',
					path_group: '/enneagram-corner/[slug]',
					content_type: 'enneagram',
					current_visits: '8',
					current_unique_visitors: '1',
					baseline_avg_visits: '0.29',
					baseline_avg_unique_visitors: '0.29',
					lift_visits: '7.71',
					lift_unique_visitors: '0.71',
					ratio_visits: '27.59',
					trend_score: '13.2',
					confidence: 'low_unique',
					top_sources: [{ key: 'search/google', count: '8' }],
					top_referrers: [{ key: 'www.google.com', count: '8' }],
					avg_time_on_page_ms: '17728',
					median_time_on_page_ms: '16934',
					bounce_rate: '50',
					is_low_unique: true
				}
			],
			error: null
		});
		requireAdminMock.mockResolvedValue({ supabase: { rpc } });

		const response = await GET({
			url: new URL(
				'https://9takes.test/api/admin/analytics/trending?scope=blog&baselineDays=14&minUnique=5&limit=12&anchorTs=2026-05-14T18%3A00%3A00.000Z'
			),
			locals: {}
		} as any);
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(rpc).toHaveBeenCalledWith('get_page_analytics_trending_pages', {
			p_anchor_ts: '2026-05-14T18:00:00.000Z',
			p_baseline_days: 14,
			p_scope: 'blog',
			p_min_visits: 3,
			p_min_unique: 5,
			p_limit: 12
		});
		expect(body.available).toBe(true);
		expect(body.rows).toHaveLength(2);
		expect(body.broadRows).toHaveLength(1);
		expect(body.repeatRows).toHaveLength(1);
		expect(body.broadRows[0]).toMatchObject({
			path: '/questions',
			current_visits: 14,
			ratio_visits: 6.54,
			top_sources: [{ key: 'internal', count: 8 }]
		});
		expect(body.repeatRows[0]).toMatchObject({
			path: '/enneagram-corner/enneagram-social-styles',
			is_low_unique: true
		});
	});

	it('returns unavailable payload when the trending RPC is not deployed', async () => {
		const rpc = vi.fn().mockResolvedValue({
			data: null,
			error: {
				message: 'function public.get_page_analytics_trending_pages does not exist'
			}
		});
		requireAdminMock.mockResolvedValue({ supabase: { rpc } });

		const response = await GET({
			url: new URL('https://9takes.test/api/admin/analytics/trending'),
			locals: {}
		} as any);
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(body).toMatchObject({
			available: false,
			rows: [],
			broadRows: [],
			repeatRows: []
		});
	});
});
