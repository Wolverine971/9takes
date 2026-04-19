// src/routes/api/admin/analytics/releases/releases.server.spec.ts
import { describe, expect, it, vi } from 'vitest';

import { GET } from './+server';

describe('/api/admin/analytics/releases', () => {
	it('uses the raised default release limit when no explicit limit is provided', async () => {
		const rpc = vi
			.fn()
			.mockResolvedValueOnce({
				data: 12,
				error: null
			})
			.mockResolvedValueOnce({
				data: [],
				error: null
			});
		const profilesSingle = vi.fn().mockResolvedValue({
			data: { admin: true },
			error: null
		});
		const supabase = {
			from: vi.fn(() => ({
				select: vi.fn(() => ({
					eq: vi.fn(() => ({
						single: profilesSingle
					}))
				}))
			})),
			rpc
		};

		const response = await GET({
			url: new URL('https://9takes.test/api/admin/analytics/releases'),
			locals: {
				session: { user: { id: 'admin-user' } },
				supabase
			}
		} as any);

		expect(response.status).toBe(200);
		expect(rpc).toHaveBeenNthCalledWith(2, 'get_content_release_performance', {
			p_from_date: undefined,
			p_to_date: undefined,
			p_limit: 200
		});
	});

	it('normalizes expanded release benchmark fields', async () => {
		const rpc = vi
			.fn()
			.mockResolvedValueOnce({
				data: 12,
				error: null
			})
			.mockResolvedValueOnce({
				data: [
					{
						id: '11',
						slug: 'sample-person',
						path: '/personality-analysis/sample-person',
						title: 'Sample Person',
						published_at: '2026-04-01T12:00:00.000Z',
						first_view_at: '2026-04-01T12:20:00.000Z',
						minutes_to_first_view: '20',
						views_1h: '2',
						views_6h: '5',
						views_24h: '12',
						unique_24h: '10',
						views_7d: '44',
						unique_7d: '35',
						views_30d: '88',
						unique_30d: '60',
						total_views: '91',
						total_unique_visitors: '62',
						avg_time_on_page_ms: '42000',
						median_time_on_page_ms: '31000',
						avg_scroll_pct: '74',
						bounce_rate: '26.5',
						views_24h_percentile: '82',
						views_7d_percentile: '77',
						views_30d_percentile: null,
						benchmark_score: '79.5',
						benchmark_sample_size: '24',
						benchmark_basis: '24h_7d',
						performance_band: 'above_norm',
						release_stage: 'first_month',
						growth_slope_7d: '1.25',
						decay_rate_after_spike: null
					}
				],
				error: null
			});
		const profilesSingle = vi.fn().mockResolvedValue({
			data: { admin: true },
			error: null
		});
		const supabase = {
			from: vi.fn(() => ({
				select: vi.fn(() => ({
					eq: vi.fn(() => ({
						single: profilesSingle
					}))
				}))
			})),
			rpc
		};

		const response = await GET({
			url: new URL('https://9takes.test/api/admin/analytics/releases?from=2026-04-01&limit=10'),
			locals: {
				session: { user: { id: 'admin-user' } },
				supabase
			}
		} as any);
		const body = await response.json();

		expect(rpc).toHaveBeenNthCalledWith(1, 'refresh_content_analytics_daily', {
			p_from: expect.any(String),
			p_to: expect.any(String),
			p_content_type: 'people'
		});
		expect(rpc).toHaveBeenNthCalledWith(2, 'get_content_release_performance', {
			p_from_date: '2026-04-01',
			p_to_date: undefined,
			p_limit: 10
		});
		expect(body.rows[0]).toMatchObject({
			id: 11,
			views_24h_percentile: 82,
			views_7d_percentile: 77,
			views_30d_percentile: null,
			benchmark_score: 79.5,
			benchmark_sample_size: 24,
			benchmark_basis: '24h_7d',
			growth_slope_7d: 1.25,
			decay_rate_after_spike: null
		});
		expect(body.summary).toMatchObject({
			total_releases: 1,
			above_norm: 1,
			benchmarked: 1
		});
	});

	it('fetches multiple release batches when the requested limit exceeds the RPC page size', async () => {
		const makeRow = (id: number, publishedAt: string) => ({
			id,
			slug: `person-${id}`,
			path: `/personality-analysis/person-${id}`,
			title: `Person ${id}`,
			published_at: publishedAt,
			first_view_at: publishedAt,
			minutes_to_first_view: 0,
			views_1h: 0,
			views_6h: 0,
			views_24h: 0,
			unique_24h: 0,
			views_7d: 0,
			unique_7d: 0,
			views_30d: 0,
			unique_30d: 0,
			total_views: 0,
			total_unique_visitors: 0,
			avg_time_on_page_ms: 0,
			median_time_on_page_ms: 0,
			avg_scroll_pct: 0,
			bounce_rate: 0,
			views_24h_percentile: null,
			views_7d_percentile: null,
			views_30d_percentile: null,
			benchmark_score: null,
			benchmark_sample_size: 0,
			benchmark_basis: 'insufficient_history',
			performance_band: 'insufficient_history',
			release_stage: 'mature',
			growth_slope_7d: null,
			decay_rate_after_spike: null
		});
		const firstBatch = Array.from({ length: 200 }, (_, index) =>
			makeRow(
				index + 1,
				`2026-01-${String(30 - Math.floor(index / 8)).padStart(2, '0')}T12:00:00.000Z`
			)
		);
		const secondBatch = [makeRow(201, '2025-12-31T12:00:00.000Z')];
		const rpc = vi
			.fn()
			.mockResolvedValueOnce({
				data: 12,
				error: null
			})
			.mockResolvedValueOnce({
				data: firstBatch,
				error: null
			})
			.mockResolvedValueOnce({
				data: secondBatch,
				error: null
			});
		const profilesSingle = vi.fn().mockResolvedValue({
			data: { admin: true },
			error: null
		});
		const supabase = {
			from: vi.fn(() => ({
				select: vi.fn(() => ({
					eq: vi.fn(() => ({
						single: profilesSingle
					}))
				}))
			})),
			rpc
		};

		const response = await GET({
			url: new URL('https://9takes.test/api/admin/analytics/releases?limit=500'),
			locals: {
				session: { user: { id: 'admin-user' } },
				supabase
			}
		} as any);
		const body = await response.json();

		expect(rpc).toHaveBeenNthCalledWith(2, 'get_content_release_performance', {
			p_from_date: undefined,
			p_to_date: undefined,
			p_limit: 200
		});
		expect(rpc).toHaveBeenNthCalledWith(3, 'get_content_release_performance', {
			p_from_date: undefined,
			p_to_date: expect.any(String),
			p_limit: 200
		});
		expect(body.rows).toHaveLength(201);
	});
});
