// src/lib/components/admin/acquisitionMixChart.spec.ts
import { describe, expect, it } from 'vitest';

import {
	buildAcquisitionMixChart,
	formatAcquisitionSourceLabel,
	formatAcquisitionSourceShortLabel
} from './acquisitionMixChart';

describe('acquisitionMixChart', () => {
	it('formats normalized source labels into readable copy', () => {
		expect(formatAcquisitionSourceLabel('search/google')).toBe('Google Search');
		expect(formatAcquisitionSourceLabel('paid/meta')).toBe('Meta Ads');
		expect(formatAcquisitionSourceLabel('social/x')).toBe('X');
		expect(formatAcquisitionSourceLabel('email/substack')).toBe('Substack Email');
		expect(formatAcquisitionSourceShortLabel('search/duckduckgo')).toBe('DuckDuckGo');
	});

	it('builds weekly chart rows and ranks sources by total visitors', () => {
		const chart = buildAcquisitionMixChart([
			{ cohort_week: '2026-03-09', acquisition_source: 'search/google', new_visitors: 20 },
			{ cohort_week: '2026-03-09', acquisition_source: 'direct', new_visitors: 10 },
			{ cohort_week: '2026-03-16', acquisition_source: 'social/x', new_visitors: 12 },
			{ cohort_week: '2026-03-16', acquisition_source: 'search/google', new_visitors: 8 }
		]);

		expect(chart.totalVisitors).toBe(50);
		expect(chart.totalSources).toBe(3);
		expect(chart.leadSource?.label).toBe('Google Search');
		expect(chart.sources.map((source) => source.label)).toEqual(['Google Search', 'X', 'Direct']);
		expect(chart.weeks).toHaveLength(2);
		expect(chart.weeks[0]).toMatchObject({
			cohortWeek: '2026-03-09',
			total: 30,
			dominantLabel: 'Google Search'
		});
		expect(chart.weeks[0].segments[0]).toMatchObject({
			label: 'Google Search',
			count: 20
		});
	});

	it('rolls smaller sources into Other when the chart would get too noisy', () => {
		const chart = buildAcquisitionMixChart([
			{ cohort_week: '2026-03-09', acquisition_source: 'search/google', new_visitors: 20 },
			{ cohort_week: '2026-03-09', acquisition_source: 'direct', new_visitors: 18 },
			{ cohort_week: '2026-03-09', acquisition_source: 'social/x', new_visitors: 16 },
			{ cohort_week: '2026-03-09', acquisition_source: 'social/reddit', new_visitors: 14 },
			{ cohort_week: '2026-03-09', acquisition_source: 'social/facebook', new_visitors: 12 },
			{ cohort_week: '2026-03-09', acquisition_source: 'social/instagram', new_visitors: 10 },
			{ cohort_week: '2026-03-09', acquisition_source: 'email', new_visitors: 8 },
			{ cohort_week: '2026-03-09', acquisition_source: 'search/bing', new_visitors: 6 },
			{ cohort_week: '2026-03-09', acquisition_source: 'search/duckduckgo', new_visitors: 4 }
		]);

		expect(chart.totalSources).toBe(9);
		expect(chart.rolledUpSourceCount).toBe(2);
		expect(chart.sources).toHaveLength(8);
		expect(chart.sources.at(-1)?.label).toBe('Other');
		expect(chart.sources.at(-1)?.count).toBe(10);
		expect(chart.weeks[0].segments.at(-1)).toMatchObject({
			label: 'Other',
			count: 10
		});
	});
});
