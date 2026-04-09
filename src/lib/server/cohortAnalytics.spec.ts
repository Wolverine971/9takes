// src/lib/server/cohortAnalytics.spec.ts
import { describe, expect, it } from 'vitest';

import {
	aggregateAcquisitionMix,
	aggregateEntrySurfaceOverview,
	aggregateSourceOverview,
	aggregateWeeklyCohorts,
	type CohortFactRow
} from './cohortAnalytics';

const rows: CohortFactRow[] = [
	{
		cohort_date: '2026-03-23',
		entry_surface: 'people',
		acquisition_source: 'search/google',
		cohort_size: 20,
		commented_within_d7: 6,
		signed_up_within_d7: 5,
		registered_within_d7: 4,
		retained_d1: 8,
		retained_d3: 7,
		retained_d7: 6,
		retained_d14: 5,
		retained_d30: 0,
		engaged_ms_total_within_d7: 3600000
	},
	{
		cohort_date: '2026-03-24',
		entry_surface: 'people',
		acquisition_source: 'social/reddit',
		cohort_size: 10,
		commented_within_d7: 2,
		signed_up_within_d7: 1,
		registered_within_d7: 1,
		retained_d1: 3,
		retained_d3: 2,
		retained_d7: 1,
		retained_d14: 1,
		retained_d30: 0,
		engaged_ms_total_within_d7: 900000
	},
	{
		cohort_date: '2026-03-30',
		entry_surface: 'community',
		acquisition_source: 'social/x',
		cohort_size: 12,
		commented_within_d7: 3,
		signed_up_within_d7: 2,
		registered_within_d7: 2,
		retained_d1: 5,
		retained_d3: 4,
		retained_d7: 3,
		retained_d14: 0,
		retained_d30: 0,
		engaged_ms_total_within_d7: 1200000
	},
	{
		cohort_date: '2026-04-06',
		entry_surface: 'people',
		acquisition_source: 'search/google',
		cohort_size: 14,
		commented_within_d7: 4,
		signed_up_within_d7: 3,
		registered_within_d7: 2,
		retained_d1: 6,
		retained_d3: 3,
		retained_d7: 0,
		retained_d14: 0,
		retained_d30: 0,
		engaged_ms_total_within_d7: 1500000
	}
];

describe('cohortAnalytics', () => {
	it('keeps compare-mode overview stable across all surfaces and gates 7d metrics to mature cohorts', () => {
		const overview = aggregateEntrySurfaceOverview(rows, '2026-04-09');

		expect(overview.map((row) => row.entry_surface)).toEqual(['people', 'community']);
		expect(overview[0]).toMatchObject({
			entry_surface: 'people',
			new_visitors: 44,
			commented_within_d7: 8,
			comment_rate_denominator: 30,
			registered_within_d7: 5,
			registration_rate_denominator: 30,
			retained_d7: 7,
			retained_d7_denominator: 30
		});
		expect(overview[0].comment_rate_pct).toBeCloseTo(26.67, 2);
		expect(overview[0].retained_d7_pct).toBeCloseTo(23.33, 2);
	});

	it('builds weekly cohorts with full-week maturity gating', () => {
		const weekly = aggregateWeeklyCohorts(rows, '2026-04-09');

		expect(weekly).toHaveLength(3);
		expect(weekly[0]).toMatchObject({
			cohort_week: '2026-03-23',
			new_visitors: 30,
			is_mature_d7: true,
			commented_within_d7: 8,
			retained_d7: 7,
			retained_d7_denominator: 30
		});
		expect(weekly[1]).toMatchObject({
			cohort_week: '2026-03-30',
			new_visitors: 12,
			is_mature_d7: false,
			commented_within_d7: 0,
			retained_d7: 0,
			retained_d7_denominator: 0
		});
		expect(weekly[2]).toMatchObject({
			cohort_week: '2026-04-06',
			is_mature_d1: false,
			retained_d1_denominator: 0
		});
	});

	it('keeps acquisition mix filtered by surface only and leaves source comparison intact', () => {
		const mix = aggregateAcquisitionMix(rows, 'people');
		const weekly = aggregateWeeklyCohorts(rows, '2026-04-09', {
			entrySurface: 'people',
			acquisitionSource: 'search/google'
		});
		const sourceOverview = aggregateSourceOverview(rows, '2026-04-09', 'people');

		expect(mix).toEqual([
			{ cohort_week: '2026-03-23', acquisition_source: 'search/google', new_visitors: 20 },
			{ cohort_week: '2026-03-23', acquisition_source: 'social/reddit', new_visitors: 10 },
			{ cohort_week: '2026-04-06', acquisition_source: 'search/google', new_visitors: 14 }
		]);
		expect(sourceOverview.map((row) => row.acquisition_source)).toEqual([
			'search/google',
			'social/reddit'
		]);
		expect(weekly).toHaveLength(2);
		expect(weekly[0]).toMatchObject({
			cohort_week: '2026-03-23',
			new_visitors: 20
		});
	});
});
