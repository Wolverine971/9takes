// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$lib/components/charts/LineChart.svelte', async () => {
	const module = await import('$lib/test/LineChartStub.svelte');
	return { default: module.default };
});

vi.mock('$lib/components/charts/StatCard.svelte', async () => {
	const module = await import('$lib/test/StatCardStub.svelte');
	return { default: module.default };
});

import AnalyticsPage from './+page.svelte';

describe('/admin/analytics page', () => {
	beforeEach(() => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok: true,
				json: vi.fn().mockResolvedValue({
					available: true,
					overview: [],
					retentionCurve: [],
					acquisitionMix: [],
					nextPaths: []
				})
			})
		);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('loads cohort analytics only after the cohort tab is opened', async () => {
		render(AnalyticsPage, {
			data: {
				filters: {
					from: '2026-03-10',
					to: '2026-04-08',
					scope: 'all'
				},
				cohortFilters: {
					from: '2026-02-09',
					to: '2026-04-05',
					entrySurface: '',
					acquisitionSource: ''
				},
				overview: {
					total_visits: 12,
					unique_visitors: 10,
					authenticated_visits: 4,
					anonymous_visits: 8,
					avg_time_on_page_ms: 30000,
					median_time_on_page_ms: 22000,
					bounce_rate: 41.5
				},
				timeseries: [],
				topPages: {
					topPagesOverTime: [],
					topPagesThisWeek: [],
					topPagesThisMonth: [],
					topPagesBySessionDuration: [],
					windows: {
						selectedFrom: '2026-03-10',
						selectedTo: '2026-04-08',
						weekFrom: '2026-04-06',
						weekTo: '2026-04-08',
						monthFrom: '2026-04-01',
						monthTo: '2026-04-08'
					}
				},
				rows: [],
				pagination: {
					total: 0,
					page: 1,
					limit: 50,
					totalPages: 1
				}
			} as any
		});

		expect(fetch).not.toHaveBeenCalled();
		expect(screen.queryByText('Cohort from')).toBeNull();

		await fireEvent.click(screen.getByRole('tab', { name: 'Cohorts & Sources' }));

		await waitFor(() => {
			expect(fetch).toHaveBeenCalledTimes(1);
		});
		expect(fetch).toHaveBeenCalledWith(
			'/api/admin/analytics/cohorts?from=2026-02-09&to=2026-04-05&nextPathLimit=12'
		);
		expect(screen.getByText('Cohort from')).toBeTruthy();

		await fireEvent.click(screen.getByRole('tab', { name: 'Pageviews' }));
		await fireEvent.click(screen.getByRole('tab', { name: 'Cohorts & Sources' }));

		expect(fetch).toHaveBeenCalledTimes(1);
	});
});
