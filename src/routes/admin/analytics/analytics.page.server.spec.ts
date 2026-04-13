// src/routes/admin/analytics/analytics.page.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { attachAnalyticsLastModifiedMock } = vi.hoisted(() => ({
	attachAnalyticsLastModifiedMock: vi.fn(async (_supabase: unknown, rows: unknown[]) => rows)
}));

vi.mock('$lib/server/analyticsPageLastModified', () => ({
	attachAnalyticsLastModified: attachAnalyticsLastModifiedMock
}));

import { load } from './+page.server';

describe('/admin/analytics page server load', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-04-08T12:00:00.000Z'));
	});

	it('does not fetch cohort analytics during the initial page load', async () => {
		const rpcCalls: string[] = [];
		const profilesSingle = vi.fn().mockResolvedValue({
			data: { id: 'admin-user', admin: true },
			error: null
		});

		const supabase = {
			from: vi.fn((table: string) => {
				if (table !== 'profiles') {
					throw new Error(`Unexpected table ${table}`);
				}

				return {
					select: vi.fn(() => ({
						eq: vi.fn(() => ({
							single: profilesSingle
						}))
					}))
				};
			}),
			rpc: vi.fn(async (name: string) => {
				rpcCalls.push(name);
				return {
					data:
						name === 'get_page_analytics_overview'
							? {
									total_visits: 12,
									unique_visitors: 10,
									authenticated_visits: 4,
									anonymous_visits: 8,
									avg_time_on_page_ms: 30000,
									median_time_on_page_ms: 22000,
									bounce_rate: 41.5
								}
							: [],
					error: null
				};
			})
		};

		const result = await load({
			locals: {
				session: {
					user: {
						id: 'admin-user'
					}
				},
				supabase
			}
		} as any);

		if (!result) {
			throw new Error('Expected analytics load to return page data');
		}

		expect(rpcCalls).toEqual([
			'get_page_analytics_overview',
			'get_page_analytics_timeseries',
			'get_page_analytics_pages',
			'get_page_analytics_top_pages_timeseries',
			'get_page_analytics_pages',
			'get_page_analytics_pages',
			'get_page_analytics_pages_by_duration'
		]);
		expect(rpcCalls).not.toContain('get_entry_surface_overview');
		expect(rpcCalls).not.toContain('get_cohort_retention_curve');
		expect(rpcCalls).not.toContain('get_acquisition_mix_by_week');
		expect(rpcCalls).not.toContain('get_first_session_next_paths');
		expect(result).not.toHaveProperty('cohorts');
		expect(result).toHaveProperty('cohortFilters');
		expect(result.cohortFilters).toEqual({
			from: '2026-02-09',
			to: '2026-04-05',
			entrySurface: '',
			acquisitionSource: ''
		});
	});
});
