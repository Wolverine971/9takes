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
			total_visits: 0,
			unique_visitors: 0,
			authenticated_visits: 0,
			anonymous_visits: 0,
			avg_time_on_page_ms: 0,
			median_time_on_page_ms: 0,
			bounce_rate: 0
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
		trending: {
			available: false,
			generatedAt: '',
			baselineDays: 7,
			minVisits: 3,
			minUnique: 3,
			rows: [],
			broadRows: [],
			repeatRows: []
		},
		rows: [],
		pagination: {
			total: 0,
			page: 1,
			limit: 50,
			totalPages: 1
		}
	};

	function fetchUrls(): string[] {
		return (
			fetch as unknown as {
				mock: { calls: Array<[RequestInfo | URL, RequestInit | undefined]> };
			}
		).mock.calls.map(([input]) => String(input));
	}

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

		await waitFor(() => {
			expect(fetchUrls()).toContain(
				'/api/admin/analytics/top-pages?from=2026-03-10&to=2026-04-08&scope=all&topN=10&limit=8&minVisits=3'
			);
		});
		expect(fetchUrls()).toEqual(
			expect.arrayContaining([
				'/api/admin/analytics/overview?from=2026-03-10&to=2026-04-08&scope=all',
				'/api/admin/analytics/timeseries?from=2026-03-10&to=2026-04-08&scope=all',
				'/api/admin/analytics/pages?from=2026-03-10&to=2026-04-08&scope=all&page=1&limit=50&sortBy=visits&sortDir=desc&window=30d',
				'/api/admin/analytics/trending?scope=all&baselineDays=7&minVisits=3&minUnique=3&limit=20'
			])
		);
		expect(
			fetchUrls().filter((url) => url.startsWith('/api/admin/analytics/cohorts?'))
		).toHaveLength(0);
		expect(screen.queryByText('Cohort from')).toBeNull();

		await fireEvent.click(screen.getByRole('tab', { name: 'Acquisition & Retention' }));

		await waitFor(() => {
			expect(fetchUrls()).toContain(
				'/api/admin/analytics/cohorts?from=2026-02-09&to=2026-04-05&nextPathLimit=12'
			);
		});
		expect(screen.getByText('Cohort from')).toBeTruthy();

		await fireEvent.click(screen.getByRole('tab', { name: 'Pageviews' }));
		await fireEvent.click(screen.getByRole('tab', { name: 'Acquisition & Retention' }));

		expect(
			fetchUrls().filter((url) => url.startsWith('/api/admin/analytics/cohorts?'))
		).toHaveLength(1);
	});

	it('loads timing and release analytics only after their tabs are opened', async () => {
		render(AnalyticsPage, {
			data: pageData as any
		});

		await waitFor(() => {
			expect(fetchUrls()).toContain(
				'/api/admin/analytics/top-pages?from=2026-03-10&to=2026-04-08&scope=all&topN=10&limit=8&minVisits=3'
			);
		});
		expect(fetchUrls().some((url) => url.startsWith('/api/admin/analytics/timing?'))).toBe(false);
		expect(fetchUrls().some((url) => url.startsWith('/api/admin/analytics/releases?'))).toBe(false);

		await fireEvent.click(screen.getByRole('tab', { name: 'Traffic Timing' }));

		await waitFor(() => {
			expect(fetchUrls()).toContain(
				'/api/admin/analytics/timing?from=2026-03-10&to=2026-04-08&scope=all'
			);
		});

		await fireEvent.click(screen.getByRole('tab', { name: 'Release Performance' }));

		await waitFor(() => {
			expect(fetchUrls()).toContain(
				'/api/admin/analytics/releases?from=2026-03-10&to=2026-04-08&scope=all&limit=200'
			);
		});
	});

	it('handles non-JSON release failures without surfacing JSON parse errors', async () => {
		const parseError = new SyntaxError('Unexpected token A');
		const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

		vi.stubGlobal(
			'fetch',
			vi.fn(async (input: RequestInfo | URL) => {
				const url = String(input);
				if (url.startsWith('/api/admin/analytics/releases?')) {
					return {
						ok: false,
						status: 504,
						statusText: '',
						json: vi.fn().mockRejectedValue(parseError)
					};
				}
				return {
					ok: true,
					json: vi.fn().mockResolvedValue({})
				};
			})
		);

		render(AnalyticsPage, {
			data: pageData as any
		});

		await fireEvent.click(screen.getByRole('tab', { name: 'Release Performance' }));

		await waitFor(() => {
			const releaseError = consoleError.mock.calls.find(
				([label]) => label === 'Release analytics fetch error:'
			)?.[1] as Error | undefined;

			expect(releaseError).toBeInstanceOf(Error);
			expect(releaseError).not.toBe(parseError);
			expect(releaseError?.message).toContain('Failed to load release analytics (504)');
		});
	});

	it('renders actionable timing synthesis and standard deviation outliers', async () => {
		const timingRows = [
			{
				local_dow: 2,
				local_hour: 14,
				visits: 120,
				unique_visitors: 82,
				avg_time_on_page_ms: 91000
			},
			{
				local_dow: 2,
				local_hour: 15,
				visits: 54,
				unique_visitors: 40,
				avg_time_on_page_ms: 62000
			},
			{
				local_dow: 3,
				local_hour: 14,
				visits: 44,
				unique_visitors: 31,
				avg_time_on_page_ms: 57000
			},
			{
				local_dow: 0,
				local_hour: 4,
				visits: 2,
				unique_visitors: 2,
				avg_time_on_page_ms: 12000
			}
		];

		vi.stubGlobal(
			'fetch',
			vi.fn(async (input: RequestInfo | URL) => {
				const url = String(input);
				if (url.startsWith('/api/admin/analytics/timing?')) {
					return {
						ok: true,
						json: vi.fn().mockResolvedValue({ rows: timingRows })
					};
				}
				return {
					ok: true,
					json: vi.fn().mockResolvedValue({})
				};
			})
		);

		render(AnalyticsPage, {
			data: pageData as any
		});

		await fireEvent.click(screen.getByRole('tab', { name: 'Traffic Timing' }));

		await waitFor(() => {
			expect(screen.getByText('Timing Synthesis')).toBeTruthy();
		});

		expect(screen.getByText('Standard Deviation Outliers')).toBeTruthy();
		expect(screen.getByText('Most traffic')).toBeTruthy();
		expect(screen.getAllByText('Tue 2PM').length).toBeGreaterThan(0);
		expect(screen.getByText(/Tue 2PM is the strongest slot/)).toBeTruthy();
		expect(screen.getByText(/Use Tue 2PM as the first promotion window/)).toBeTruthy();
		expect(screen.getByText(/Put maintenance, low-risk experiments/)).toBeTruthy();
		expect(screen.getByText('High Traffic Outliers')).toBeTruthy();
	});

	it('lets the release tab apply a wider date range directly', async () => {
		render(AnalyticsPage, {
			data: pageData as any
		});

		await fireEvent.click(screen.getByRole('tab', { name: 'Release Performance' }));

		await waitFor(() => {
			expect(fetchUrls()).toContain(
				'/api/admin/analytics/releases?from=2026-03-10&to=2026-04-08&scope=all&limit=200'
			);
		});

		await fireEvent.click(screen.getByRole('button', { name: 'Last 90 days' }));

		await waitFor(() => {
			expect(fetchUrls()).toContain(
				'/api/admin/analytics/releases?from=2026-01-09&to=2026-04-08&scope=all&limit=200'
			);
		});
	});

	it('resets release range back to all history when defaults are empty', async () => {
		const dataWithEmptyReleaseDefaults = {
			...pageData,
			filters: {
				...pageData.filters,
				from: '',
				to: ''
			}
		};

		render(AnalyticsPage, {
			data: dataWithEmptyReleaseDefaults as any
		});

		await fireEvent.click(screen.getByRole('tab', { name: 'Release Performance' }));

		await waitFor(() => {
			expect(fetchUrls()).toContain('/api/admin/analytics/releases?scope=all&limit=200');
		});

		await fireEvent.click(screen.getByRole('button', { name: 'Last 30 days' }));

		await waitFor(() => {
			const releaseCalls = fetchUrls().filter((url) =>
				url.startsWith('/api/admin/analytics/releases?')
			);
			const presetCall = releaseCalls.at(-1);
			expect(presetCall).toContain('from=');
			expect(presetCall).toContain('&to=');
			expect(presetCall).toContain('scope=all');
			expect(presetCall).toContain('limit=200');
		});

		await fireEvent.click(screen.getByRole('button', { name: 'Reset range' }));

		await waitFor(() => {
			const releaseCalls = fetchUrls().filter((url) =>
				url.startsWith('/api/admin/analytics/releases?')
			);
			expect(releaseCalls.at(-1)).toBe('/api/admin/analytics/releases?scope=all&limit=200');
		});
	});

	it('loads overperformer and underperformer blog diagnostics on demand', async () => {
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
			launch_score: 90,
			launch_band: 'above_norm',
			launch_basis: '24h',
			launch_sample_size: 20,
			quality_demand_score: 82,
			quality_demand_band: 'above_norm',
			quality_demand_basis: '30d',
			quality_demand_sample_size: 20,
			quality_demand_confidence: 'stable',
			overall_score: 82,
			overall_performance_band: 'above_norm',
			overall_basis: 'demand_30d',
			external_unique_7d: 18,
			external_unique_30d: 40,
			engaged_external_unique_7d: 12,
			engaged_external_unique_30d: 24,
			search_unique_7d: 8,
			search_unique_30d: 18,
			direct_unique_7d: 3,
			direct_unique_30d: 6,
			internal_share_24h: 20,
			internal_share_7d: 30,
			internal_share_30d: 34,
			repeat_view_share_24h: 27,
			demand_points: 58,
			demand_percentile: 84,
			engagement_percentile: 78,
			top_demand_sources: [{ source: 'search', visits: 24 }],
			performance_notes: ['Strong search demand.'],
			release_stage: 'mature',
			growth_slope_7d: 2.1,
			decay_rate_after_spike: 12,
			...overrides
		});
		const makeDiagnostics = (slug: string, title: string, note: string) => ({
			slug,
			file_path: `src/blog/people/drafts/${title}.md`,
			frontmatter: {
				title,
				meta_title: `${title} meta`,
				persona_title: `${title} persona`,
				description: `${title} description with enough copy to sanity check snippet quality.`,
				date: '2026-04-01',
				lastmod: '2026-04-01',
				published: false,
				enneagram: '5',
				type: ['techie'],
				person: title.replaceAll(' ', '-'),
				suggestions: ['Beta-Person'],
				content_quality: {
					hook: 9,
					enneagram: 9,
					evidence: 9,
					writing: 9,
					originality: 9,
					overall: 9,
					letter: 'A',
					graded_at: '2026-04-01'
				},
				keywords: [`${title} Enneagram`],
				citations: [],
				faq_count: 1,
				same_as_count: 1
			},
			content_stats: {
				word_count: 2400,
				h2_count: 7,
				h3_count: 2,
				title_chars: title.length,
				meta_title_chars: `${title} meta`.length,
				description_chars: 142,
				has_tldr: true,
				has_testimony_ledger: true,
				has_heading_mix_ledger: true,
				has_distribution_ledger: true,
				has_faq_schema: true
			},
			link_stats: {
				outgoing_internal_count: 6,
				outgoing_personality_count: 4,
				outgoing_enneagram_count: 1,
				outgoing_category_count: 1,
				external_link_count: 2,
				incoming_internal_count: 3,
				suggestion_count: 1,
				suggestions_existing_count: 1,
				missing_suggestions: [],
				outgoing_targets: [{ href: '/personality-analysis/beta-person', label: 'beta' }],
				incoming_sources: [
					{
						slug: 'gamma-person',
						title: 'Gamma Person',
						href: '/personality-analysis/gamma-person'
					}
				]
			},
			diagnostic_scores: {
				seo: 88,
				internal_links: 92,
				content_depth: 91,
				frontmatter: 100
			},
			action_notes: [note],
			replication_notes: [note]
		});
		const releaseRows = [
			makeRelease({ slug: 'alpha-person', title: 'Alpha Person', overall_score: 88 }),
			makeRelease({
				id: 2,
				slug: 'beta-person',
				title: 'Beta Person',
				path: '/personality-analysis/beta-person',
				overall_score: 12,
				overall_performance_band: 'below_norm',
				quality_demand_score: 12,
				quality_demand_band: 'below_norm',
				external_unique_30d: 2,
				search_unique_30d: 0,
				direct_unique_30d: 1,
				internal_share_30d: 90,
				repeat_view_share_24h: 50
			})
		];
		const diagnosticsRows = [
			makeDiagnostics('alpha-person', 'Alpha Person', 'Strong body cross-linking footprint.'),
			makeDiagnostics('beta-person', 'Beta Person', 'Add more contextual internal links.')
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
				if (url === '/api/admin/analytics/blog-diagnostics') {
					return {
						ok: true,
						json: vi.fn().mockResolvedValue({ rows: diagnosticsRows })
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

		render(AnalyticsPage, {
			data: pageData as any
		});

		expect(fetchUrls()).not.toContain('/api/admin/analytics/blog-diagnostics');

		await fireEvent.click(screen.getByRole('tab', { name: 'Overperformers' }));

		await waitFor(() => {
			expect(fetchUrls()).toContain('/api/admin/analytics/blog-diagnostics');
			expect(screen.getByText('Overperforming Blogs')).toBeTruthy();
		});
		expect(screen.getByText('Alpha Person meta')).toBeTruthy();
		expect(screen.getAllByText('Strong body cross-linking footprint.').length).toBeGreaterThan(0);

		await fireEvent.click(screen.getByRole('tab', { name: 'Underperformers' }));

		await waitFor(() => {
			expect(screen.getByText('Underperforming Blogs')).toBeTruthy();
			expect(screen.getByText('Beta Person meta')).toBeTruthy();
		});
		expect(screen.getAllByText('Add more contextual internal links.').length).toBeGreaterThan(0);
		expect(
			fetchUrls().filter((url) => url === '/api/admin/analytics/blog-diagnostics')
		).toHaveLength(1);
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
			launch_score: 90,
			launch_band: 'above_norm',
			launch_basis: '24h',
			launch_sample_size: 20,
			quality_demand_score: 82,
			quality_demand_band: 'above_norm',
			quality_demand_basis: '30d',
			quality_demand_sample_size: 20,
			quality_demand_confidence: 'stable',
			overall_score: 82,
			overall_performance_band: 'above_norm',
			overall_basis: 'demand_30d',
			external_unique_7d: 18,
			external_unique_30d: 40,
			engaged_external_unique_7d: 12,
			engaged_external_unique_30d: 24,
			search_unique_7d: 8,
			search_unique_30d: 18,
			direct_unique_7d: 3,
			direct_unique_30d: 6,
			internal_share_24h: 20,
			internal_share_7d: 30,
			internal_share_30d: 34,
			repeat_view_share_24h: 27,
			demand_points: 58,
			demand_percentile: 84,
			engagement_percentile: 78,
			top_demand_sources: [{ source: 'search', visits: 24 }],
			performance_notes: ['Strong search demand.'],
			release_stage: 'mature',
			growth_slope_7d: 2.1,
			decay_rate_after_spike: 12,
			...overrides
		});
		const releaseRows = [
			makeRelease({ id: 1, published_at: '2026-04-03T12:00:00.000Z' }),
			makeRelease({
				id: 2,
				slug: 'beta-person',
				path: '/personality-analysis/beta-person',
				title: 'Beta Person',
				published_at: '2026-04-01T12:00:00.000Z',
				views_24h: 4,
				views_24h_percentile: 12,
				views_7d: 8,
				views_30d: 16,
				benchmark_score: 12,
				performance_band: 'below_norm',
				launch_score: 12,
				launch_band: 'below_norm',
				quality_demand_score: 10,
				quality_demand_band: 'below_norm',
				overall_score: 10,
				overall_performance_band: 'below_norm',
				external_unique_30d: 0,
				top_demand_sources: [],
				performance_notes: ['No non-internal demand yet.']
			}),
			makeRelease({
				id: 3,
				slug: 'gamma-person',
				path: '/personality-analysis/gamma-person',
				title: 'Gamma Person',
				published_at: '2026-04-02T12:00:00.000Z',
				views_24h: 28,
				views_24h_percentile: 76,
				views_7d: 120,
				views_30d: 160,
				benchmark_score: 76,
				performance_band: 'above_norm',
				launch_score: 76,
				launch_band: 'above_norm',
				quality_demand_score: 91,
				quality_demand_band: 'above_norm',
				overall_score: 91,
				overall_performance_band: 'above_norm',
				external_unique_30d: 90,
				top_demand_sources: [{ source: 'search', visits: 80 }],
				performance_notes: ['Strong search demand.']
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
				expect(tableRows[1].textContent).toContain('Gamma Person');
			});

			await fireEvent.click(within(releaseRegion).getByRole('button', { name: /^7d/ }));
			expect(within(releaseRegion).getAllByRole('row')[1].textContent).toContain('Gamma Person');

			await fireEvent.click(screen.getByRole('button', { name: /Underperforming\s+1/i }));
			expect(within(releaseRegion).getByText('Beta Person')).toBeTruthy();
			expect(within(releaseRegion).queryByText('Alpha Person')).toBeNull();

			await fireEvent.click(screen.getByRole('button', { name: /Gamma Person\s+91/i }));
			expect(within(releaseRegion).getByText('Gamma Person')).toBeTruthy();
			expect(within(releaseRegion).queryByText('Beta Person')).toBeNull();

			await fireEvent.click(screen.getByRole('button', { name: /Needs history\s+0/i }));
			await waitFor(() => {
				expect(
					within(releaseRegion).getByText('No releases match this performance filter.')
				).toBeTruthy();
			});

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
