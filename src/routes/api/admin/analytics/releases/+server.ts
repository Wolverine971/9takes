// src/routes/api/admin/analytics/releases/+server.ts
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';
import { analyticsDateSchema } from '$lib/validation/analyticsSchemas';
import {
	computeReleasePerformanceScoreFieldsFromWindows,
	type ReleaseDemandWindowRow,
	type ReleasePerformanceScoreFields,
	type ReleaseScoreBaseRow
} from '$lib/server/releasePerformanceScoring';

interface ReleasePerformanceRow {
	id: number;
	slug: string;
	path: string;
	title: string;
	published_at: string | null;
	first_view_at: string | null;
	minutes_to_first_view: number | null;
	views_1h: number;
	views_6h: number;
	views_24h: number;
	unique_24h: number;
	views_7d: number;
	unique_7d: number;
	views_30d: number;
	unique_30d: number;
	total_views: number;
	total_unique_visitors: number;
	avg_time_on_page_ms: number;
	median_time_on_page_ms: number;
	avg_scroll_pct: number;
	bounce_rate: number;
	views_24h_percentile: number | null;
	views_7d_percentile: number | null;
	views_30d_percentile: number | null;
	benchmark_score: number | null;
	benchmark_sample_size: number;
	benchmark_basis: string;
	performance_band: string;
	release_stage: string;
	growth_slope_7d: number | null;
	decay_rate_after_spike: number | null;
}

const querySchema = z.object({
	limit: z.coerce.number().int().min(1).max(1000).default(200)
});
const RPC_RELEASE_LIMIT = 200;
const MAX_RELEASE_FETCH_PAGES = 10;
const DEMAND_BASELINE_LIMIT = 1000;
const RAW_VISIT_REFRESH_WINDOW_DAYS = 90;
const RELEASE_ANALYTICS_WINDOW_DAYS = 30;
const analyticsDateFormatter = new Intl.DateTimeFormat('en-CA', {
	timeZone: 'America/New_York',
	year: 'numeric',
	month: '2-digit',
	day: '2-digit'
});

function toDateString(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

function toAnalyticsLocalDateString(value: string): string | null {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return null;
	const parts = Object.fromEntries(
		analyticsDateFormatter.formatToParts(date).map((part) => [part.type, part.value])
	) as Record<string, string>;
	if (!parts.year || !parts.month || !parts.day) return null;
	return `${parts.year}-${parts.month}-${parts.day}`;
}

function previousDateString(value: string): string | null {
	const date = new Date(`${value}T12:00:00Z`);
	if (Number.isNaN(date.getTime())) return null;
	date.setUTCDate(date.getUTCDate() - 1);
	return date.toISOString().slice(0, 10);
}

function addDaysString(value: string, days: number): string | null {
	const date = new Date(`${value}T12:00:00Z`);
	if (Number.isNaN(date.getTime())) return null;
	date.setUTCDate(date.getUTCDate() + days);
	return date.toISOString().slice(0, 10);
}

function getFreshnessRefreshRange(): { from: string; to: string } {
	const to = new Date();
	const from = new Date(to);
	from.setDate(from.getDate() - 44);

	return {
		from: toDateString(from),
		to: toDateString(to)
	};
}

function getRawRefreshFloor(): string {
	const floor = new Date();
	floor.setDate(floor.getDate() - RAW_VISIT_REFRESH_WINDOW_DAYS);
	return toDateString(floor);
}

function getSelectedReleaseRefreshRange(
	fromDate: string | undefined,
	toDate: string | undefined
): { from: string; to: string } | null {
	const today = toDateString(new Date());
	const rawFloor = getRawRefreshFloor();
	const publishFrom = fromDate ?? rawFloor;
	const publishTo = toDate ?? today;
	const launchWindowTo = addDaysString(publishTo, RELEASE_ANALYTICS_WINDOW_DAYS - 1) ?? publishTo;
	const from = publishFrom > rawFloor ? publishFrom : rawFloor;
	const to = launchWindowTo < today ? launchWindowTo : today;

	if (from > to) return null;
	return { from, to };
}

function mergeRefreshRanges(
	baseRange: { from: string; to: string },
	selectedRange: { from: string; to: string } | null
): { from: string; to: string } {
	if (!selectedRange) return baseRange;
	return {
		from: selectedRange.from < baseRange.from ? selectedRange.from : baseRange.from,
		to: selectedRange.to > baseRange.to ? selectedRange.to : baseRange.to
	};
}

function parseDate(value: string | null): string | undefined {
	if (!value) return undefined;
	const parsed = analyticsDateSchema.safeParse(value);
	if (!parsed.success) {
		throw error(400, `Invalid date: ${value}`);
	}
	return parsed.data;
}

async function assertAdmin(locals: App.Locals): Promise<void> {
	const session = locals.session;
	if (!session?.user?.id) {
		throw error(401, 'Unauthorized');
	}

	const { data: user } = await locals.supabase
		.from('profiles')
		.select('admin')
		.eq('id', session.user.id)
		.single();

	if (!user?.admin) {
		throw error(403, 'Admin access required');
	}
}

async function fetchReleasePerformanceRows(
	supabaseAny: any,
	fromDate: string | undefined,
	toDate: string | undefined,
	requestedLimit: number
): Promise<{ data: ReleasePerformanceRow[]; error: { message?: string } | null }> {
	const rows: ReleasePerformanceRow[] = [];
	const seen = new Set<string>();
	let pageToDate = toDate;

	for (let page = 0; page < MAX_RELEASE_FETCH_PAGES && rows.length < requestedLimit; page += 1) {
		const pageLimit = Math.min(RPC_RELEASE_LIMIT, requestedLimit - rows.length);
		const { data, error: rpcError } = await supabaseAny.rpc('get_content_release_performance', {
			p_from_date: fromDate,
			p_to_date: pageToDate,
			p_limit: pageLimit
		});

		if (rpcError) {
			return { data: [], error: rpcError };
		}

		const batch = (data ?? []) as ReleasePerformanceRow[];
		if (batch.length === 0) break;

		for (const row of batch) {
			const key = String(row.id || `${row.slug}:${row.published_at ?? ''}`);
			if (seen.has(key)) continue;
			seen.add(key);
			rows.push(row);
			if (rows.length >= requestedLimit) break;
		}

		if (batch.length < pageLimit || rows.length >= requestedLimit) break;

		const oldestPublishedAt = batch[batch.length - 1]?.published_at;
		if (!oldestPublishedAt) break;

		const oldestDate = toAnalyticsLocalDateString(String(oldestPublishedAt));
		const nextToDate = oldestDate ? previousDateString(oldestDate) : null;
		if (!nextToDate || (pageToDate && nextToDate >= pageToDate)) break;
		if (fromDate && nextToDate < fromDate) break;

		pageToDate = nextToDate;
	}

	return { data: rows, error: null };
}

function toNullableNumber(value: unknown): number | null {
	if (value === null || value === undefined) return null;
	const numeric = Number(value);
	return Number.isFinite(numeric) ? numeric : null;
}

function getLaunchBand(score: number | null): string {
	if (score === null) return 'insufficient_history';
	if (score >= 75) return 'above_norm';
	if (score <= 25) return 'below_norm';
	return 'near_norm';
}

function hasExpandedBenchmarkFields(row: ReleasePerformanceRow): boolean {
	const record = row as unknown as Record<string, unknown>;
	return (
		Object.prototype.hasOwnProperty.call(record, 'benchmark_score') ||
		Object.prototype.hasOwnProperty.call(record, 'views_24h_percentile') ||
		Object.prototype.hasOwnProperty.call(record, 'views_30d_percentile') ||
		Object.prototype.hasOwnProperty.call(record, 'benchmark_basis')
	);
}

function normalizeReleasePerformanceRow(row: ReleasePerformanceRow) {
	const hasExpandedBenchmarks = hasExpandedBenchmarkFields(row);
	const views7dPercentile = toNullableNumber(row.views_7d_percentile);
	const benchmarkScore = hasExpandedBenchmarks
		? (toNullableNumber(row.benchmark_score) ?? views7dPercentile)
		: null;
	const benchmarkBasis =
		!hasExpandedBenchmarks || row.benchmark_basis === null || row.benchmark_basis === undefined
			? benchmarkScore === null
				? 'insufficient_history'
				: '7d'
			: String(row.benchmark_basis);
	const performanceBand = hasExpandedBenchmarks
		? String(row.performance_band ?? 'insufficient_history')
		: 'insufficient_history';

	return {
		id: Number(row.id || 0),
		slug: String(row.slug ?? ''),
		path: String(row.path ?? ''),
		title: String(row.title ?? ''),
		published_at: row.published_at ? String(row.published_at) : null,
		first_view_at: row.first_view_at ? String(row.first_view_at) : null,
		minutes_to_first_view: toNullableNumber(row.minutes_to_first_view),
		views_1h: Number(row.views_1h || 0),
		views_6h: Number(row.views_6h || 0),
		views_24h: Number(row.views_24h || 0),
		unique_24h: Number(row.unique_24h || 0),
		views_7d: Number(row.views_7d || 0),
		unique_7d: Number(row.unique_7d || 0),
		views_30d: Number(row.views_30d || 0),
		unique_30d: Number(row.unique_30d || 0),
		total_views: Number(row.total_views || 0),
		total_unique_visitors: Number(row.total_unique_visitors || 0),
		avg_time_on_page_ms: Number(row.avg_time_on_page_ms || 0),
		median_time_on_page_ms: Number(row.median_time_on_page_ms || 0),
		avg_scroll_pct: Number(row.avg_scroll_pct || 0),
		bounce_rate: Number(row.bounce_rate || 0),
		views_24h_percentile: toNullableNumber(row.views_24h_percentile),
		views_7d_percentile: views7dPercentile,
		views_30d_percentile: toNullableNumber(row.views_30d_percentile),
		benchmark_score: benchmarkScore,
		benchmark_sample_size: Number(row.benchmark_sample_size || 0),
		benchmark_basis: benchmarkBasis,
		performance_band: performanceBand,
		release_stage: String(row.release_stage ?? 'mature'),
		growth_slope_7d: toNullableNumber(row.growth_slope_7d),
		decay_rate_after_spike: toNullableNumber(row.decay_rate_after_spike)
	};
}

function getFallbackScoreFields(
	row: ReturnType<typeof normalizeReleasePerformanceRow>
): ReleasePerformanceScoreFields {
	const launchScore = row.views_24h_percentile;

	return {
		launch_score: launchScore,
		launch_band: getLaunchBand(launchScore),
		launch_basis: '24h',
		launch_sample_size: row.benchmark_sample_size,
		quality_demand_score: null,
		quality_demand_band: 'insufficient_history',
		quality_demand_basis: 'unavailable',
		quality_demand_sample_size: 0,
		quality_demand_confidence: 'collecting',
		overall_score: null,
		overall_performance_band: 'collecting',
		overall_basis: 'demand_unavailable',
		external_unique_7d: 0,
		external_unique_30d: 0,
		engaged_external_unique_7d: 0,
		engaged_external_unique_30d: 0,
		search_unique_7d: 0,
		search_unique_30d: 0,
		direct_unique_7d: 0,
		direct_unique_30d: 0,
		internal_share_24h: 0,
		internal_share_7d: 0,
		internal_share_30d: 0,
		repeat_view_share_24h:
			row.views_24h > 0 ? Math.round(((row.views_24h - row.unique_24h) / row.views_24h) * 100) : 0,
		demand_points: null,
		demand_percentile: null,
		engagement_percentile: null,
		top_demand_sources: [],
		performance_notes: ['Demand scoring unavailable; overall band not assigned.']
	};
}

function toReleaseScoreBaseRow(
	row: ReturnType<typeof normalizeReleasePerformanceRow>
): ReleaseScoreBaseRow {
	return {
		slug: row.slug,
		published_at: row.published_at,
		views_24h: row.views_24h,
		unique_24h: row.unique_24h,
		views_7d: row.views_7d,
		unique_7d: row.unique_7d,
		views_30d: row.views_30d,
		unique_30d: row.unique_30d,
		views_24h_percentile: row.views_24h_percentile,
		benchmark_score: row.benchmark_score,
		benchmark_sample_size: row.benchmark_sample_size,
		benchmark_basis: row.benchmark_basis,
		performance_band: row.performance_band
	};
}

async function fetchReleaseDemandWindows(supabaseAny: any): Promise<ReleaseDemandWindowRow[]> {
	const { data, error: rpcError } = await supabaseAny.rpc('get_content_release_demand_metrics');
	if (rpcError) {
		throw new Error(rpcError.message || 'Failed to load release demand metrics');
	}
	return (data ?? []) as ReleaseDemandWindowRow[];
}

async function buildDemandScoreFields(
	supabaseAny: any,
	selectedRows: Array<ReturnType<typeof normalizeReleasePerformanceRow>>,
	fromDate: string | undefined,
	toDate: string | undefined
): Promise<Map<string, ReleasePerformanceScoreFields>> {
	if (selectedRows.length === 0) return new Map();

	// Score percentiles need the full release population as a baseline, not just the selected slice.
	let baselineRows = selectedRows;
	if (fromDate || toDate) {
		const { data: baselineData, error: baselineError } = await fetchReleasePerformanceRows(
			supabaseAny,
			undefined,
			undefined,
			DEMAND_BASELINE_LIMIT
		);
		if (baselineError) {
			throw new Error(baselineError.message || 'Failed to load release demand baseline');
		}
		const normalizedBaseline = ((baselineData ?? []) as ReleasePerformanceRow[]).map(
			normalizeReleasePerformanceRow
		);
		if (normalizedBaseline.length > 0) {
			baselineRows = normalizedBaseline;
		}
	}

	const selectedSlugSet = new Set(selectedRows.map((row) => row.slug));
	const baselineSlugSet = new Set(baselineRows.map((row) => row.slug));
	const rowsForScoring = [
		...baselineRows,
		...selectedRows.filter((row) => !baselineSlugSet.has(row.slug))
	];

	// Pre-aggregated per-(slug, window) demand metrics computed set-based in SQL. This replaces fetching
	// every raw page_analytics_visits row for every slug on each request (the old performance bottleneck).
	const windowRows = await fetchReleaseDemandWindows(supabaseAny);
	const scoreFields = computeReleasePerformanceScoreFieldsFromWindows(
		rowsForScoring.map(toReleaseScoreBaseRow),
		windowRows
	);

	return new Map([...scoreFields.entries()].filter(([slug]) => selectedSlugSet.has(slug)));
}

export const GET: RequestHandler = async ({ url, locals }) => {
	await assertAdmin(locals);

	const fromDate = parseDate(url.searchParams.get('from'));
	const toDate = parseDate(url.searchParams.get('to'));
	const parsedQuery = querySchema.safeParse({
		limit: url.searchParams.get('limit') ?? undefined
	});

	if (fromDate && toDate && fromDate > toDate) {
		throw error(400, 'Release analytics from date must be before to date');
	}

	if (!parsedQuery.success) {
		throw error(400, 'Invalid release analytics query parameters');
	}

	const supabaseAny = locals.supabase as any;
	const selectedRefreshRange = getSelectedReleaseRefreshRange(fromDate, toDate);
	const refreshRange = mergeRefreshRanges(getFreshnessRefreshRange(), selectedRefreshRange);
	const { data: refreshedRows, error: refreshError } = await supabaseAny.rpc(
		'refresh_content_analytics_daily',
		{
			p_from: refreshRange.from,
			p_to: refreshRange.to,
			p_content_type: 'people'
		}
	);

	if (refreshError) {
		console.warn('Failed to refresh people release analytics before read:', refreshError);
	}

	const { data, error: rpcError } = await fetchReleasePerformanceRows(
		supabaseAny,
		fromDate,
		toDate,
		parsedQuery.data.limit
	);

	if (rpcError) {
		console.error('Failed to fetch release performance analytics:', rpcError);
		throw error(500, 'Failed to fetch release performance analytics');
	}

	const normalizedRows = ((data ?? []) as ReleasePerformanceRow[]).map(
		normalizeReleasePerformanceRow
	);
	let scoreFieldsBySlug: Map<string, ReleasePerformanceScoreFields>;
	try {
		scoreFieldsBySlug = await buildDemandScoreFields(supabaseAny, normalizedRows, fromDate, toDate);
	} catch (scoreError) {
		console.warn('Failed to compute demand release scoring:', scoreError);
		scoreFieldsBySlug = new Map(
			normalizedRows.map((row) => [row.slug, getFallbackScoreFields(row)])
		);
	}

	const rows = normalizedRows.map((row) => ({
		...row,
		...(scoreFieldsBySlug.get(row.slug) ?? getFallbackScoreFields(row))
	}));

	return json({
		rows,
		summary: {
			total_releases: rows.length,
			above_norm: rows.filter((row) => row.overall_performance_band === 'above_norm').length,
			below_norm: rows.filter((row) => row.overall_performance_band === 'below_norm').length,
			collecting: rows.filter((row) => row.overall_performance_band === 'collecting').length,
			benchmarked: rows.filter((row) => row.overall_score !== null).length
		},
		refresh: {
			from: refreshRange.from,
			to: refreshRange.to,
			rows: Number(refreshedRows || 0),
			selectedRangeExtended: selectedRefreshRange !== null
		}
	});
};
