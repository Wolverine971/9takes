// src/lib/server/releasePerformanceScoring.spec.ts
import { describe, expect, it } from 'vitest';

import {
	computeReleasePerformanceScoreFields,
	type ReleaseScoreBaseRow,
	type ReleaseVisitSignal
} from './releasePerformanceScoring';

function makeRow(slug: string, publishedAt: string, launchScore = 90): ReleaseScoreBaseRow {
	return {
		slug,
		published_at: publishedAt,
		views_24h: 8,
		unique_24h: 8,
		views_7d: 12,
		unique_7d: 12,
		views_30d: 20,
		unique_30d: 20,
		views_24h_percentile: launchScore,
		benchmark_score: launchScore,
		benchmark_sample_size: 20,
		benchmark_basis: '24h_7d',
		performance_band:
			launchScore >= 75 ? 'above_norm' : launchScore <= 25 ? 'below_norm' : 'near_norm'
	};
}

function makeVisit(
	slug: string,
	startedAt: string,
	fingerprint: string,
	source: string,
	overrides: Partial<ReleaseVisitSignal> = {}
): ReleaseVisitSignal {
	return {
		content_slug: slug,
		started_at: startedAt,
		fingerprint,
		acquisition_source: source,
		referrer_host:
			source === 'internal' ? '9takes.com' : source === 'search/google' ? 'google.com' : 'direct',
		engaged_ms: 45_000,
		max_scroll_pct: 55,
		path: `/personality-analysis/${slug}`,
		...overrides
	};
}

describe('release performance scoring', () => {
	it('keeps noisy first-week internal launches out of mature overperformer bands', () => {
		const referenceDate = new Date('2026-05-15T12:00:00.000Z');
		const rows = [
			makeRow('early-internal', '2026-05-14T12:00:00.000Z', 90),
			makeRow('mature-winner', '2026-04-01T12:00:00.000Z', 80),
			...Array.from({ length: 9 }, (_, index) =>
				makeRow(`mature-baseline-${index}`, '2026-04-01T12:00:00.000Z', 50)
			)
		];
		const visits: ReleaseVisitSignal[] = [
			...Array.from({ length: 7 }, (_, index) =>
				makeVisit('early-internal', '2026-05-14T14:00:00.000Z', `early-${index}`, 'internal', {
					engaged_ms: 0,
					max_scroll_pct: 0
				})
			),
			...Array.from({ length: 12 }, (_, index) =>
				makeVisit('mature-winner', '2026-04-03T14:00:00.000Z', `winner-${index}`, 'search/google')
			),
			...Array.from({ length: 9 }, (_, index) =>
				makeVisit(
					`mature-baseline-${index}`,
					'2026-04-03T14:00:00.000Z',
					`baseline-${index}`,
					index % 3 === 0 ? 'search/google' : 'internal',
					{ engaged_ms: index % 3 === 0 ? 12_000 : 0, max_scroll_pct: index % 3 === 0 ? 40 : 0 }
				)
			)
		];

		const scores = computeReleasePerformanceScoreFields(rows, visits, referenceDate);
		const early = scores.get('early-internal');
		const winner = scores.get('mature-winner');

		expect(early).toMatchObject({
			launch_band: 'above_norm',
			overall_score: null,
			overall_performance_band: 'collecting',
			quality_demand_basis: 'collecting'
		});
		expect(winner?.quality_demand_score).toBeGreaterThanOrEqual(75);
		expect(winner).toMatchObject({
			overall_performance_band: 'above_norm',
			quality_demand_basis: '30d',
			search_unique_30d: 12,
			external_unique_30d: 12
		});
	});

	it('withholds mature scores when raw source data is missing for nonzero aggregate views', () => {
		const referenceDate = new Date('2026-05-15T12:00:00.000Z');
		const rows = [
			{
				...makeRow('missing-raw-source-data', '2026-04-01T12:00:00.000Z', 50),
				views_30d: 30,
				unique_30d: 20
			},
			...Array.from({ length: 10 }, (_, index) => ({
				...makeRow(`zero-demand-${index}`, '2026-04-01T12:00:00.000Z', 50),
				views_7d: 0,
				unique_7d: 0,
				views_30d: 0,
				unique_30d: 0
			}))
		];

		const scores = computeReleasePerformanceScoreFields(rows, [], referenceDate);
		const missingRaw = scores.get('missing-raw-source-data');
		const trueZero = scores.get('zero-demand-0');

		expect(missingRaw).toMatchObject({
			quality_demand_score: null,
			quality_demand_basis: 'unavailable',
			overall_score: null,
			overall_basis: 'demand_unavailable',
			overall_performance_band: 'collecting'
		});
		expect(missingRaw?.performance_notes[0]).toContain('Raw source data is missing');
		expect(trueZero).toMatchObject({
			quality_demand_basis: '30d',
			overall_performance_band: 'below_norm'
		});
	});
});
