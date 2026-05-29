// src/lib/server/releasePerformanceScoring.ts
export interface ReleaseScoreBaseRow {
	slug: string;
	published_at: string | null;
	views_24h: number;
	unique_24h: number;
	views_7d: number;
	unique_7d: number;
	views_30d: number;
	unique_30d: number;
	views_24h_percentile: number | null;
	benchmark_score: number | null;
	benchmark_sample_size: number;
	benchmark_basis: string;
	performance_band: string;
}

export interface ReleaseVisitSignal {
	content_slug: string | null;
	started_at: string | null;
	fingerprint: string | null;
	acquisition_source: string | null;
	referrer_host: string | null;
	engaged_ms: number | string | null;
	max_scroll_pct: number | string | null;
	path?: string | null;
}

export interface ReleasePerformanceScoreFields {
	launch_score: number | null;
	launch_band: string;
	launch_basis: string;
	launch_sample_size: number;
	quality_demand_score: number | null;
	quality_demand_band: string;
	quality_demand_basis: string;
	quality_demand_sample_size: number;
	quality_demand_confidence: 'collecting' | 'directional' | 'stable';
	overall_score: number | null;
	overall_performance_band: string;
	overall_basis: string;
	external_unique_7d: number;
	external_unique_30d: number;
	engaged_external_unique_7d: number;
	engaged_external_unique_30d: number;
	search_unique_7d: number;
	search_unique_30d: number;
	direct_unique_7d: number;
	direct_unique_30d: number;
	internal_share_24h: number;
	internal_share_7d: number;
	internal_share_30d: number;
	repeat_view_share_24h: number;
	demand_points: number | null;
	demand_percentile: number | null;
	engagement_percentile: number | null;
	top_demand_sources: Array<{ source: string; visits: number }>;
	performance_notes: string[];
}

interface WindowMetrics {
	views: number;
	unique: number;
	internalViews: number;
	externalViews: number;
	externalUnique: number;
	engagedExternalUnique: number;
	searchUnique: number;
	directUnique: number;
	avgEngagedMs: number;
	avgScrollPct: number;
	engagedExternalVisitShare: number;
	demandPoints: number;
	engagementValue: number;
	topSources: Array<{ source: string; visits: number }>;
}

interface RowMetrics {
	row: ReleaseScoreBaseRow;
	ageDays: number | null;
	repeatViewShare24h: number;
	window24h: WindowMetrics;
	window7d: WindowMetrics;
	window30d: WindowMetrics;
	basis: '7d' | '30d' | null;
	activeWindow: WindowMetrics | null;
	hasMatureRawVisitCoverage: boolean;
	demandPercentile: number | null;
	engagementPercentile: number | null;
	qualityDemandScore: number | null;
	qualityDemandBand: string;
	qualityDemandSampleSize: number;
}

const ENGAGED_MS_THRESHOLD = 10_000;
const ENGAGED_SCROLL_THRESHOLD = 35;
const ABOVE_THRESHOLD = 75;
const BELOW_THRESHOLD = 25;
const MIN_DIRECTIONAL_EXTERNAL_UNIQUE = 3;
const MIN_STABLE_EXTERNAL_UNIQUE = 5;

// Demand + engagement formulas live here so the raw-visit path (computeWindowMetrics) and the
// pre-aggregated path (windowMetricsFromAggregate) can never drift apart.
function computeDemandPoints(
	externalUnique: number,
	searchUnique: number,
	directUnique: number,
	engagedExternalUnique: number
): number {
	return externalUnique + searchUnique * 0.75 + directUnique * 0.25 + engagedExternalUnique * 0.75;
}

// Scroll depth is a weak/biased signal on these long, lazy-loading pages (related posts + comments
// load below the article and inflate document scrollHeight after the reader passed the content), so
// it is down-weighted to 15; the freed weight moves to engaged time (55) and engaged-visit share (30).
function computeEngagementValue(
	avgEngagedMs: number,
	avgScrollPct: number,
	engagedExternalVisitShare: number
): number {
	return (
		Math.min(avgEngagedMs / 60_000, 1) * 55 +
		Math.min(avgScrollPct / 60, 1) * 15 +
		engagedExternalVisitShare * 30
	);
}

function toNumber(value: unknown): number {
	const numeric = Number(value ?? 0);
	return Number.isFinite(numeric) ? numeric : 0;
}

function round(value: number, digits = 2): number {
	if (!Number.isFinite(value)) return 0;
	const factor = 10 ** digits;
	return Math.round(value * factor) / factor;
}

function parseDate(value: string | null | undefined): Date | null {
	if (!value) return null;
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? null : date;
}

function daysSince(publishedAt: string | null, referenceDate: Date): number | null {
	const published = parseDate(publishedAt);
	if (!published) return null;
	return Math.floor((referenceDate.getTime() - published.getTime()) / 86_400_000);
}

function isUtilityPath(path: string | null | undefined): boolean {
	if (!path) return false;
	return (
		path === '/logout' ||
		/^\/(admin|api)(\/|$)/.test(path) ||
		path.startsWith('/account/unsubscribe')
	);
}

function sourceBucket(visit: ReleaseVisitSignal): string {
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
	) {
		return 'internal';
	}
	if (source.startsWith('search/')) return 'search';
	if (source.startsWith('ai/')) return 'ai';
	if (source.startsWith('social/')) return 'social';
	if (source.startsWith('email')) return 'email';
	if (source === 'direct' || referrer === 'direct' || (!source && !referrer)) return 'direct';
	if (source && source !== 'unknown' && source !== 'other') return source;
	// Referrer fallback when acquisition_source is missing/unknown. AI engines first so they aren't
	// swallowed by generic search matching (e.g. gemini.google.* must not read as search/google).
	if (
		/(chatgpt|openai|perplexity|claude\.ai|anthropic|gemini\.google|bard\.google|copilot\.microsoft|grok\.|x\.ai|poe\.com|you\.com|phind\.com|meta\.ai|mistral\.ai)/.test(
			referrer
		)
	) {
		return 'ai';
	}
	if (
		referrer.includes('google.') ||
		referrer.includes('bing.') ||
		referrer.includes('duckduckgo.') ||
		referrer.includes('ecosia.') ||
		referrer.includes('yahoo.') ||
		referrer.includes('yandex.') ||
		referrer.includes('brave.') ||
		referrer.includes('googlequicksearch')
	) {
		return 'search';
	}
	if (referrer === 'direct') return 'direct';
	return source || 'other';
}

function isDemandSource(bucket: string): boolean {
	return bucket !== 'internal';
}

function percentileFromSorted(sortedValues: number[], value: number): number | null {
	if (sortedValues.length < 2) return null;
	let less = 0;
	for (const candidate of sortedValues) {
		if (candidate < value) less += 1;
	}
	return round((less / (sortedValues.length - 1)) * 100, 2);
}

function sourceSummary(
	sourceCounts: Map<string, number>
): Array<{ source: string; visits: number }> {
	return [...sourceCounts.entries()]
		.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
		.slice(0, 4)
		.map(([source, visits]) => ({ source, visits }));
}

function emptyWindowMetrics(): WindowMetrics {
	return {
		views: 0,
		unique: 0,
		internalViews: 0,
		externalViews: 0,
		externalUnique: 0,
		engagedExternalUnique: 0,
		searchUnique: 0,
		directUnique: 0,
		avgEngagedMs: 0,
		avgScrollPct: 0,
		engagedExternalVisitShare: 0,
		demandPoints: 0,
		engagementValue: 0,
		topSources: []
	};
}

function computeWindowMetrics(
	row: ReleaseScoreBaseRow,
	visits: ReleaseVisitSignal[],
	days: 1 | 7 | 30
): WindowMetrics {
	const published = parseDate(row.published_at);
	if (!published) return emptyWindowMetrics();

	const windowEnd = new Date(published.getTime() + days * 86_400_000);
	const windowVisits = visits.filter((visit) => {
		if (isUtilityPath(visit.path)) return false;
		const startedAt = parseDate(visit.started_at);
		return startedAt !== null && startedAt >= published && startedAt < windowEnd;
	});
	if (windowVisits.length === 0) return emptyWindowMetrics();

	const unique = new Set<string>();
	const externalUnique = new Set<string>();
	const engagedExternalUnique = new Set<string>();
	const searchUnique = new Set<string>();
	const directUnique = new Set<string>();
	const sourceCounts = new Map<string, number>();
	let internalViews = 0;
	let externalViews = 0;
	let engagedMsTotal = 0;
	let scrollTotal = 0;
	let engagedExternalVisits = 0;

	for (const visit of windowVisits) {
		const fingerprint =
			visit.fingerprint || `${visit.started_at ?? ''}:${visit.referrer_host ?? ''}`;
		unique.add(fingerprint);
		const bucket = sourceBucket(visit);
		sourceCounts.set(bucket, (sourceCounts.get(bucket) ?? 0) + 1);

		const engagedMs = toNumber(visit.engaged_ms);
		const scrollPct = Math.max(0, Math.min(100, toNumber(visit.max_scroll_pct)));
		engagedMsTotal += engagedMs;
		scrollTotal += scrollPct;

		if (!isDemandSource(bucket)) {
			internalViews += 1;
			continue;
		}

		externalViews += 1;
		externalUnique.add(fingerprint);
		if (bucket === 'search' || bucket === 'ai') searchUnique.add(fingerprint);
		if (bucket === 'direct' || bucket === 'other' || bucket === 'unknown')
			directUnique.add(fingerprint);
		if (engagedMs >= ENGAGED_MS_THRESHOLD || scrollPct >= ENGAGED_SCROLL_THRESHOLD) {
			engagedExternalUnique.add(fingerprint);
			engagedExternalVisits += 1;
		}
	}

	const avgEngagedMs = engagedMsTotal / windowVisits.length;
	const avgScrollPct = scrollTotal / windowVisits.length;
	const engagedExternalVisitShare = externalViews > 0 ? engagedExternalVisits / externalViews : 0;
	const demandPoints = computeDemandPoints(
		externalUnique.size,
		searchUnique.size,
		directUnique.size,
		engagedExternalUnique.size
	);
	const engagementValue = computeEngagementValue(
		avgEngagedMs,
		avgScrollPct,
		engagedExternalVisitShare
	);

	return {
		views: windowVisits.length,
		unique: unique.size,
		internalViews,
		externalViews,
		externalUnique: externalUnique.size,
		engagedExternalUnique: engagedExternalUnique.size,
		searchUnique: searchUnique.size,
		directUnique: directUnique.size,
		avgEngagedMs,
		avgScrollPct,
		engagedExternalVisitShare,
		demandPoints: round(demandPoints),
		engagementValue: round(engagementValue),
		topSources: sourceSummary(sourceCounts)
	};
}

function computeRepeatShare(row: ReleaseScoreBaseRow): number {
	if (row.views_24h <= 0) return 0;
	return round((Math.max(0, row.views_24h - row.unique_24h) / row.views_24h) * 100);
}

function computeInternalShare(window: WindowMetrics): number {
	if (window.views <= 0) return 0;
	return round((window.internalViews / window.views) * 100);
}

function getAggregateViewsForBasis(row: ReleaseScoreBaseRow, basis: RowMetrics['basis']): number {
	if (basis === '30d') return row.views_30d;
	if (basis === '7d') return row.views_7d;
	return 0;
}

function getDemandBand(metrics: RowMetrics): string {
	if (!metrics.basis || metrics.qualityDemandScore === null) return 'collecting';
	if (!metrics.hasMatureRawVisitCoverage) return 'collecting';
	if (metrics.qualityDemandSampleSize < 10) return 'insufficient_history';

	const minimumExternalUnique =
		metrics.basis === '30d' ? MIN_STABLE_EXTERNAL_UNIQUE : MIN_DIRECTIONAL_EXTERNAL_UNIQUE;
	const externalUnique = metrics.activeWindow?.externalUnique ?? 0;

	if (metrics.qualityDemandScore >= ABOVE_THRESHOLD && externalUnique >= minimumExternalUnique) {
		return 'above_norm';
	}
	if (metrics.qualityDemandScore <= BELOW_THRESHOLD || externalUnique === 0) {
		return 'below_norm';
	}
	return 'near_norm';
}

function getLaunchBand(score: number | null): string {
	if (score === null) return 'insufficient_history';
	if (score >= ABOVE_THRESHOLD) return 'above_norm';
	if (score <= BELOW_THRESHOLD) return 'below_norm';
	return 'near_norm';
}

function buildNotes(metrics: RowMetrics): string[] {
	const notes: string[] = [];
	const active = metrics.activeWindow;

	if (!metrics.basis || !active) {
		notes.push('Mature demand score waits for at least 7 days of post-release data.');
	} else if (!metrics.hasMatureRawVisitCoverage) {
		notes.push('Raw source data is missing for the mature scoring window; score withheld.');
	} else if (active.externalUnique === 0) {
		notes.push('No non-internal demand yet in the mature scoring window.');
	} else if (active.searchUnique > 0) {
		notes.push(`${active.searchUnique} search/AI unique visitors in the mature scoring window.`);
	} else if (active.directUnique > 0) {
		notes.push(
			`${active.directUnique} direct/unknown unique visitors in the mature scoring window.`
		);
	}

	const internalShare = active ? computeInternalShare(active) : 0;
	if (internalShare >= 75) {
		notes.push('Mostly internal traffic in the mature window; treat demand cautiously.');
	}
	if (metrics.repeatViewShare24h >= 50) {
		notes.push('High first-day repeat views; raw launch count may overstate demand.');
	}
	if (active && active.engagedExternalUnique >= 3) {
		notes.push(`${active.engagedExternalUnique} engaged non-internal visitors.`);
	}
	return notes.slice(0, 4);
}

/**
 * Pre-aggregated window row as returned by the `get_content_release_demand_metrics` RPC — one row per
 * (release slug, window_days). This is the SQL-side replacement for fetching every raw visit: the
 * heavy COUNT(DISTINCT fingerprint) per source bucket happens set-based in Postgres, and the scorer
 * rebuilds WindowMetrics from these aggregates instead of from raw visit rows.
 */
export interface ReleaseDemandWindowRow {
	slug: string;
	window_days: number | string;
	views: number | string;
	unique_visitors: number | string;
	internal_views: number | string;
	external_views: number | string;
	external_unique: number | string;
	search_unique: number | string;
	direct_unique: number | string;
	engaged_external_unique: number | string;
	engaged_external_visits: number | string;
	engaged_ms_sum: number | string;
	scroll_sum: number | string;
	source_counts: Record<string, number | string> | null;
}

function windowMetricsFromAggregate(agg: ReleaseDemandWindowRow | undefined): WindowMetrics {
	if (!agg || toNumber(agg.views) <= 0) return emptyWindowMetrics();

	const views = toNumber(agg.views);
	const externalViews = toNumber(agg.external_views);
	const externalUnique = toNumber(agg.external_unique);
	const searchUnique = toNumber(agg.search_unique);
	const directUnique = toNumber(agg.direct_unique);
	const engagedExternalUnique = toNumber(agg.engaged_external_unique);
	const engagedExternalVisits = toNumber(agg.engaged_external_visits);
	const avgEngagedMs = views > 0 ? toNumber(agg.engaged_ms_sum) / views : 0;
	const avgScrollPct = views > 0 ? toNumber(agg.scroll_sum) / views : 0;
	const engagedExternalVisitShare = externalViews > 0 ? engagedExternalVisits / externalViews : 0;

	const sourceCounts = new Map<string, number>();
	for (const [source, value] of Object.entries(agg.source_counts ?? {})) {
		sourceCounts.set(source, toNumber(value));
	}

	return {
		views,
		unique: toNumber(agg.unique_visitors),
		internalViews: toNumber(agg.internal_views),
		externalViews,
		externalUnique,
		engagedExternalUnique,
		searchUnique,
		directUnique,
		avgEngagedMs,
		avgScrollPct,
		engagedExternalVisitShare,
		demandPoints: round(
			computeDemandPoints(externalUnique, searchUnique, directUnique, engagedExternalUnique)
		),
		engagementValue: round(
			computeEngagementValue(avgEngagedMs, avgScrollPct, engagedExternalVisitShare)
		),
		topSources: sourceSummary(sourceCounts)
	};
}

function buildRowMetrics(
	row: ReleaseScoreBaseRow,
	window24h: WindowMetrics,
	window7d: WindowMetrics,
	window30d: WindowMetrics,
	referenceDate: Date
): RowMetrics {
	const ageDays = daysSince(row.published_at, referenceDate);
	const basis = ageDays === null || ageDays < 7 ? null : ageDays >= 30 ? '30d' : '7d';
	const activeWindow = basis === '30d' ? window30d : basis === '7d' ? window7d : null;
	const hasMatureRawVisitCoverage =
		!basis ||
		!activeWindow ||
		activeWindow.views > 0 ||
		getAggregateViewsForBasis(row, basis) === 0;

	return {
		row,
		ageDays,
		repeatViewShare24h: computeRepeatShare(row),
		window24h,
		window7d,
		window30d,
		basis,
		activeWindow,
		hasMatureRawVisitCoverage,
		demandPercentile: null,
		engagementPercentile: null,
		qualityDemandScore: null,
		qualityDemandBand: 'collecting',
		qualityDemandSampleSize: 0
	};
}

function finalizeScoreFields(rowMetrics: RowMetrics[]): Map<string, ReleasePerformanceScoreFields> {
	for (const basis of ['7d', '30d'] as const) {
		const eligible = rowMetrics.filter(
			(metrics) =>
				metrics.basis === basis && metrics.activeWindow && metrics.hasMatureRawVisitCoverage
		);
		const demandValues = eligible
			.map((metrics) => metrics.activeWindow?.demandPoints ?? 0)
			.sort((a, b) => a - b);
		const engagementValues = eligible
			.map((metrics) => metrics.activeWindow?.engagementValue ?? 0)
			.sort((a, b) => a - b);

		for (const metrics of eligible) {
			const demandPercentile = percentileFromSorted(
				demandValues,
				metrics.activeWindow?.demandPoints ?? 0
			);
			const engagementPercentile = percentileFromSorted(
				engagementValues,
				metrics.activeWindow?.engagementValue ?? 0
			);
			metrics.qualityDemandSampleSize = eligible.length;
			metrics.demandPercentile = demandPercentile;
			metrics.engagementPercentile = engagementPercentile;
			metrics.qualityDemandScore =
				demandPercentile === null || engagementPercentile === null
					? null
					: round(demandPercentile * 0.7 + engagementPercentile * 0.3);
		}
	}

	const fieldsBySlug = new Map<string, ReleasePerformanceScoreFields>();
	for (const metrics of rowMetrics) {
		metrics.qualityDemandBand = getDemandBand(metrics);
		const active = metrics.activeWindow;
		const hasDemandScore = metrics.qualityDemandScore !== null;
		const overallScore = hasDemandScore ? metrics.qualityDemandScore : null;
		const overallBand = hasDemandScore ? metrics.qualityDemandBand : 'collecting';
		const confidence =
			!metrics.basis || !metrics.hasMatureRawVisitCoverage
				? 'collecting'
				: metrics.basis === '30d'
					? 'stable'
					: 'directional';
		const demandBasis = metrics.hasMatureRawVisitCoverage
			? (metrics.basis ?? 'collecting')
			: 'unavailable';
		const overallBasis = hasDemandScore
			? `demand_${metrics.basis}`
			: metrics.basis && !metrics.hasMatureRawVisitCoverage
				? 'demand_unavailable'
				: 'collecting';

		fieldsBySlug.set(metrics.row.slug, {
			launch_score: metrics.row.views_24h_percentile,
			launch_band: getLaunchBand(metrics.row.views_24h_percentile),
			launch_basis: '24h',
			launch_sample_size: metrics.row.benchmark_sample_size,
			quality_demand_score: metrics.qualityDemandScore,
			quality_demand_band: metrics.qualityDemandBand,
			quality_demand_basis: demandBasis,
			quality_demand_sample_size: metrics.qualityDemandSampleSize,
			quality_demand_confidence: confidence,
			overall_score: overallScore,
			overall_performance_band: overallBand,
			overall_basis: overallBasis,
			external_unique_7d: metrics.window7d.externalUnique,
			external_unique_30d: metrics.window30d.externalUnique,
			engaged_external_unique_7d: metrics.window7d.engagedExternalUnique,
			engaged_external_unique_30d: metrics.window30d.engagedExternalUnique,
			search_unique_7d: metrics.window7d.searchUnique,
			search_unique_30d: metrics.window30d.searchUnique,
			direct_unique_7d: metrics.window7d.directUnique,
			direct_unique_30d: metrics.window30d.directUnique,
			internal_share_24h: computeInternalShare(metrics.window24h),
			internal_share_7d: computeInternalShare(metrics.window7d),
			internal_share_30d: computeInternalShare(metrics.window30d),
			repeat_view_share_24h: metrics.repeatViewShare24h,
			demand_points: active ? active.demandPoints : null,
			demand_percentile: metrics.demandPercentile,
			engagement_percentile: metrics.engagementPercentile,
			top_demand_sources: active ? active.topSources : [],
			performance_notes: buildNotes(metrics)
		});
	}

	return fieldsBySlug;
}

/**
 * Raw-visit path: compute score fields directly from individual visit signals. Retained for tests and
 * as a fallback. Production reads pre-aggregated windows via computeReleasePerformanceScoreFieldsFromWindows.
 */
export function computeReleasePerformanceScoreFields(
	rows: ReleaseScoreBaseRow[],
	visits: ReleaseVisitSignal[],
	referenceDate = new Date()
): Map<string, ReleasePerformanceScoreFields> {
	const visitsBySlug = new Map<string, ReleaseVisitSignal[]>();
	for (const visit of visits) {
		const slug = String(visit.content_slug || '').trim();
		if (!slug) continue;
		if (!visitsBySlug.has(slug)) visitsBySlug.set(slug, []);
		visitsBySlug.get(slug)?.push(visit);
	}

	const rowMetrics = rows.map((row) => {
		const slugVisits = visitsBySlug.get(row.slug) ?? [];
		return buildRowMetrics(
			row,
			computeWindowMetrics(row, slugVisits, 1),
			computeWindowMetrics(row, slugVisits, 7),
			computeWindowMetrics(row, slugVisits, 30),
			referenceDate
		);
	});

	return finalizeScoreFields(rowMetrics);
}

/**
 * Pre-aggregated path (production): build score fields from per-(slug, window) aggregate rows returned
 * by the get_content_release_demand_metrics RPC. Same scoring/percentile logic as the raw path, but the
 * heavy distinct-fingerprint windowing is done set-based in SQL instead of fetched as raw visits.
 */
export function computeReleasePerformanceScoreFieldsFromWindows(
	rows: ReleaseScoreBaseRow[],
	windowRows: ReleaseDemandWindowRow[],
	referenceDate = new Date()
): Map<string, ReleasePerformanceScoreFields> {
	const windowsBySlug = new Map<string, Map<number, ReleaseDemandWindowRow>>();
	for (const windowRow of windowRows) {
		const slug = String(windowRow.slug || '').trim();
		if (!slug) continue;
		if (!windowsBySlug.has(slug)) windowsBySlug.set(slug, new Map());
		windowsBySlug.get(slug)?.set(toNumber(windowRow.window_days), windowRow);
	}

	const rowMetrics = rows.map((row) => {
		const windows = windowsBySlug.get(row.slug);
		return buildRowMetrics(
			row,
			windowMetricsFromAggregate(windows?.get(1)),
			windowMetricsFromAggregate(windows?.get(7)),
			windowMetricsFromAggregate(windows?.get(30)),
			referenceDate
		);
	});

	return finalizeScoreFields(rowMetrics);
}
