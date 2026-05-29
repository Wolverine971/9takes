// src/lib/server/releasePerformanceScoring.spec.ts
import { describe, expect, it } from 'vitest';

import {
	computeReleasePerformanceScoreFields,
	computeReleasePerformanceScoreFieldsFromWindows,
	type ReleaseDemandWindowRow,
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

// Faithful port of the SQL get_content_release_demand_metrics aggregation + the JS sourceBucket rules,
// used only to prove the aggregate path matches the raw-visit path.
function bucketOf(visit: ReleaseVisitSignal): string {
	const source = String(visit.acquisition_source || '')
		.trim()
		.toLowerCase();
	const referrer = String(visit.referrer_host || '')
		.trim()
		.toLowerCase();
	if (
		source === 'internal' ||
		referrer.includes('9takes.com') ||
		referrer === 'localhost' ||
		referrer === '127.0.0.1'
	)
		return 'internal';
	if (source.startsWith('search/')) return 'search';
	if (source.startsWith('ai/')) return 'ai';
	if (source.startsWith('social/')) return 'social';
	if (source.startsWith('email')) return 'email';
	if (source === 'direct' || referrer === 'direct' || (!source && !referrer)) return 'direct';
	if (source && source !== 'unknown' && source !== 'other') return source;
	return 'other';
}

function visitsToWindowRows(
	rows: ReleaseScoreBaseRow[],
	visits: ReleaseVisitSignal[]
): ReleaseDemandWindowRow[] {
	const bySlug = new Map<string, ReleaseVisitSignal[]>();
	for (const visit of visits) {
		const slug = String(visit.content_slug || '');
		if (!bySlug.has(slug)) bySlug.set(slug, []);
		bySlug.get(slug)?.push(visit);
	}

	const out: ReleaseDemandWindowRow[] = [];
	for (const row of rows) {
		const published = new Date(row.published_at ?? '').getTime();
		const slugVisits = bySlug.get(row.slug) ?? [];
		for (const days of [1, 7, 30]) {
			const end = published + days * 86_400_000;
			const win = slugVisits.filter((visit) => {
				const t = new Date(visit.started_at ?? '').getTime();
				return t >= published && t < end;
			});
			if (win.length === 0) continue;

			const uniq = new Set<string>();
			const extU = new Set<string>();
			const srchU = new Set<string>();
			const dirU = new Set<string>();
			const engU = new Set<string>();
			const src: Record<string, number> = {};
			let internal = 0;
			let external = 0;
			let engagedVisits = 0;
			let engagedMs = 0;
			let scroll = 0;

			for (const visit of win) {
				const fp = String(visit.fingerprint ?? '');
				const bucket = bucketOf(visit);
				uniq.add(fp);
				src[bucket] = (src[bucket] ?? 0) + 1;
				const ms = Number(visit.engaged_ms ?? 0);
				const sc = Math.max(0, Math.min(100, Number(visit.max_scroll_pct ?? 0)));
				engagedMs += ms;
				scroll += sc;
				if (bucket === 'internal') {
					internal += 1;
					continue;
				}
				external += 1;
				extU.add(fp);
				if (bucket === 'search' || bucket === 'ai') srchU.add(fp);
				if (bucket === 'direct' || bucket === 'other' || bucket === 'unknown') dirU.add(fp);
				if (ms >= 10_000 || sc >= 35) {
					engU.add(fp);
					engagedVisits += 1;
				}
			}

			out.push({
				slug: row.slug,
				window_days: days,
				views: win.length,
				unique_visitors: uniq.size,
				internal_views: internal,
				external_views: external,
				external_unique: extU.size,
				search_unique: srchU.size,
				direct_unique: dirU.size,
				engaged_external_unique: engU.size,
				engaged_external_visits: engagedVisits,
				engaged_ms_sum: engagedMs,
				scroll_sum: scroll,
				source_counts: src
			});
		}
	}
	return out;
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

	it('aggregate-window path produces identical scores to the raw-visit path', () => {
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

		const rawScores = computeReleasePerformanceScoreFields(rows, visits, referenceDate);
		const windowRows = visitsToWindowRows(rows, visits);
		const aggregateScores = computeReleasePerformanceScoreFieldsFromWindows(
			rows,
			windowRows,
			referenceDate
		);

		expect([...aggregateScores.keys()].sort()).toEqual([...rawScores.keys()].sort());
		for (const slug of rawScores.keys()) {
			expect(aggregateScores.get(slug)).toEqual(rawScores.get(slug));
		}
	});
});
