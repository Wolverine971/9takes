// src/routes/admin/analytics/analytics.page.spec.ts
// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor, within } from '@testing-library/svelte';
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
	const pageData = {
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
	};

	beforeEach(() => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok: true,
				json: vi.fn().mockResolvedValue({
					available: true,
					anchorDate: '2026-04-08',
					overview: [],
					weeklyCohorts: [],
					acquisitionMix: [],
					sourceOverview: [],
					nextPaths: []
				})
			})
		);
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});

	it('loads cohort analytics only after the cohort tab is opened', async () => {
		render(AnalyticsPage, {
			data: pageData as any
		});

		expect(fetch).not.toHaveBeenCalled();
		expect(screen.queryByText('Cohort from')).toBeNull();

		await fireEvent.click(screen.getByRole('tab', { name: 'Acquisition & Retention' }));

		await waitFor(() => {
			expect(fetch).toHaveBeenCalledTimes(1);
		});
		expect(fetch).toHaveBeenCalledWith(
			'/api/admin/analytics/cohorts?from=2026-02-09&to=2026-04-05&nextPathLimit=12'
		);
		expect(screen.getByText('Cohort from')).toBeTruthy();

		await fireEvent.click(screen.getByRole('tab', { name: 'Pageviews' }));
		await fireEvent.click(screen.getByRole('tab', { name: 'Acquisition & Retention' }));

		expect(fetch).toHaveBeenCalledTimes(1);
	});

	it('loads timing and release analytics only after their tabs are opened', async () => {
		render(AnalyticsPage, {
			data: pageData as any
		});

		expect(fetch).not.toHaveBeenCalled();

		await fireEvent.click(screen.getByRole('tab', { name: 'Traffic Timing' }));

		await waitFor(() => {
			expect(fetch).toHaveBeenCalledWith(
				'/api/admin/analytics/timing?from=2026-03-10&to=2026-04-08&scope=all'
			);
		});

		await fireEvent.click(screen.getByRole('tab', { name: 'Release Performance' }));

		await waitFor(() => {
			expect(fetch).toHaveBeenCalledWith(
				'/api/admin/analytics/releases?from=2026-03-10&to=2026-04-08&scope=all&limit=80'
			);
		});
	});

	it('filters, sorts, and exports release performance rows', async () => {
		const makeRelease = (overrides: Partial<Record<string, unknown>>) => ({
			id: 1,
			slug: 'alpha-person',
			path: '/personality-analysis/alpha-person',
			title: 'Alpha Person',
			published_at: '2026-04-01T12:00:00.000Z',
			first_view_at: '2026-04-01T12:20:00.000Z',
			minutes_to_first_view: 20,
			views_1h: 3,
			views_6h: 8,
			views_24h: 30,
			unique_24h: 22,
			views_7d: 40,
			unique_7d: 31,
			views_30d: 80,
			unique_30d: 60,
			total_views: 90,
			total_unique_visitors: 66,
			avg_time_on_page_ms: 42000,
			median_time_on_page_ms: 31000,
			avg_scroll_pct: 72,
			bounce_rate: 26,
			views_24h_percentile: 90,
			views_7d_percentile: 86,
			views_30d_percentile: 84,
			benchmark_score: 88,
			benchmark_sample_size: 20,
			benchmark_basis: '24h_7d_30d',
			performance_band: 'above_norm',
			release_stage: 'mature',
			growth_slope_7d: 2.1,
			decay_rate_after_spike: 12,
			...overrides
		});
		const releaseRows = [
			makeRelease({ id: 1 }),
			makeRelease({
				id: 2,
				slug: 'beta-person',
				path: '/personality-analysis/beta-person',
				title: 'Beta Person',
				views_24h: 4,
				views_7d: 8,
				views_30d: 16,
				benchmark_score: 12,
				performance_band: 'below_norm'
			}),
			makeRelease({
				id: 3,
				slug: 'gamma-person',
				path: '/personality-analysis/gamma-person',
				title: 'Gamma Person',
				views_24h: 28,
				views_7d: 120,
				views_30d: 160,
				benchmark_score: 76,
				performance_band: 'above_norm'
			})
		];

		vi.stubGlobal(
			'fetch',
			vi.fn(async (input: RequestInfo | URL) => {
				const url = String(input);
				if (url.startsWith('/api/admin/analytics/releases?')) {
					return {
						ok: true,
						json: vi.fn().mockResolvedValue({ rows: releaseRows })
					};
				}
				if (url.startsWith('/api/admin/analytics/release-growth?')) {
					return {
						ok: true,
						json: vi.fn().mockResolvedValue({ points: [] })
					};
				}
				if (url.startsWith('/api/admin/analytics/release-events?')) {
					return {
						ok: true,
						json: vi.fn().mockResolvedValue({ rows: [] })
					};
				}
				return {
					ok: true,
					json: vi.fn().mockResolvedValue({})
				};
			})
		);

		const hadCreateObjectURL = 'createObjectURL' in URL;
		const hadRevokeObjectURL = 'revokeObjectURL' in URL;
		const originalCreateObjectURL = URL.createObjectURL;
		const originalRevokeObjectURL = URL.revokeObjectURL;
		const createObjectURL = vi.fn((_blob: Blob) => 'blob:release-csv');
		const revokeObjectURL = vi.fn((_url: string) => {});
		Object.defineProperty(URL, 'createObjectURL', {
			configurable: true,
			writable: true,
			value: createObjectURL
		});
		Object.defineProperty(URL, 'revokeObjectURL', {
			configurable: true,
			writable: true,
			value: revokeObjectURL
		});
		const anchorClick = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

		try {
			render(AnalyticsPage, {
				data: pageData as any
			});

			await fireEvent.click(screen.getByRole('tab', { name: 'Release Performance' }));

			const releaseRegion = await screen.findByRole('region', { name: 'Release performance' });
			await waitFor(() => {
				const tableRows = within(releaseRegion).getAllByRole('row');
				expect(tableRows[1].textContent).toContain('Alpha Person');
			});

			await fireEvent.click(within(releaseRegion).getByRole('button', { name: /^7d/ }));
			expect(within(releaseRegion).getAllByRole('row')[1].textContent).toContain('Gamma Person');

			await fireEvent.click(screen.getByRole('button', { name: /Underperforming\s+1/i }));
			expect(within(releaseRegion).getByText('Beta Person')).toBeTruthy();
			expect(within(releaseRegion).queryByText('Alpha Person')).toBeNull();

			await fireEvent.click(screen.getByRole('button', { name: /Gamma Person\s+76/i }));
			expect(within(releaseRegion).getByText('Gamma Person')).toBeTruthy();
			expect(within(releaseRegion).queryByText('Beta Person')).toBeNull();

			await fireEvent.click(screen.getByRole('button', { name: /Needs history\s+0/i }));
			expect(
				within(releaseRegion).getByText('No releases match this performance filter.')
			).toBeTruthy();
			expect(screen.getByText('Select a release to view its growth curve.')).toBeTruthy();

			await fireEvent.click(screen.getByRole('button', { name: /Underperforming\s+1/i }));
			expect(within(releaseRegion).getByText('Beta Person')).toBeTruthy();

			await fireEvent.click(screen.getByRole('button', { name: 'Export CSV' }));
			expect(anchorClick).toHaveBeenCalledTimes(1);
			expect(createObjectURL).toHaveBeenCalledTimes(1);
			const csvBlob = createObjectURL.mock.calls[0][0] as Blob;
			const csv = await csvBlob.text();
			expect(csv).toContain('Beta Person');
			expect(csv).not.toContain('Alpha Person');
			expect(revokeObjectURL).toHaveBeenCalledWith('blob:release-csv');
		} finally {
			if (hadCreateObjectURL) {
				Object.defineProperty(URL, 'createObjectURL', {
					configurable: true,
					writable: true,
					value: originalCreateObjectURL
				});
			} else {
				Reflect.deleteProperty(URL, 'createObjectURL');
			}

			if (hadRevokeObjectURL) {
				Object.defineProperty(URL, 'revokeObjectURL', {
					configurable: true,
					writable: true,
					value: originalRevokeObjectURL
				});
			} else {
				Reflect.deleteProperty(URL, 'revokeObjectURL');
			}
		}
	});
});
