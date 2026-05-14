// src/lib/server/adminTrendingAnalytics.ts

export interface TrendingTrafficSource {
	key: string;
	count: number;
}

export interface TrendingPageRow {
	path: string;
	path_group: string;
	content_type: string;
	current_visits: number;
	current_unique_visitors: number;
	baseline_avg_visits: number;
	baseline_avg_unique_visitors: number;
	lift_visits: number;
	lift_unique_visitors: number;
	ratio_visits: number | null;
	trend_score: number;
	confidence: string;
	top_sources: TrendingTrafficSource[];
	top_referrers: TrendingTrafficSource[];
	avg_time_on_page_ms: number;
	median_time_on_page_ms: number;
	bounce_rate: number;
	is_low_unique: boolean;
}

export interface TrendingAnalyticsPayload {
	available: boolean;
	generatedAt: string;
	baselineDays: number;
	minVisits: number;
	minUnique: number;
	rows: TrendingPageRow[];
	broadRows: TrendingPageRow[];
	repeatRows: TrendingPageRow[];
}

export interface TrendingAnalyticsOptions {
	baselineDays?: number;
	minVisits?: number;
	minUnique?: number;
	limit?: number;
	now?: Date;
}

export interface LoadTrendingAnalyticsOptions extends TrendingAnalyticsOptions {
	scope?: string;
	anchorTs?: string | null;
}

export const DEFAULT_TRENDING_BASELINE_DAYS = 7;
export const DEFAULT_TRENDING_MIN_VISITS = 3;
export const DEFAULT_TRENDING_MIN_UNIQUE = 3;
export const DEFAULT_TRENDING_LIMIT = 20;

function toNumber(value: unknown): number {
	const numeric = Number(value ?? 0);
	return Number.isFinite(numeric) ? numeric : 0;
}

function toNullableNumber(value: unknown): number | null {
	if (value === null || value === undefined) return null;
	const numeric = Number(value);
	return Number.isFinite(numeric) ? numeric : null;
}

function clampInteger(value: unknown, fallback: number, min: number, max: number): number {
	const numeric = Number(value);
	if (!Number.isFinite(numeric)) return fallback;
	return Math.min(max, Math.max(min, Math.trunc(numeric)));
}

function normalizeTrafficSources(value: unknown): TrendingTrafficSource[] {
	if (!Array.isArray(value)) return [];

	return value
		.map((item) => {
			if (!item || typeof item !== 'object') return null;
			const source = item as Record<string, unknown>;
			const key = String(source.key ?? '').trim();
			if (!key) return null;

			return {
				key,
				count: toNumber(source.count)
			};
		})
		.filter((item): item is TrendingTrafficSource => item !== null);
}

export function getTrendingOptions(options: TrendingAnalyticsOptions = {}) {
	return {
		baselineDays: clampInteger(options.baselineDays, DEFAULT_TRENDING_BASELINE_DAYS, 1, 30),
		minVisits: clampInteger(options.minVisits, DEFAULT_TRENDING_MIN_VISITS, 1, 200),
		minUnique: clampInteger(options.minUnique, DEFAULT_TRENDING_MIN_UNIQUE, 1, 200),
		limit: clampInteger(options.limit, DEFAULT_TRENDING_LIMIT, 1, 100),
		now: options.now ?? new Date()
	};
}

export function normalizeTrendingPageRows(rows: unknown): TrendingPageRow[] {
	if (!Array.isArray(rows)) return [];

	return rows.map((row) => {
		const record = (row ?? {}) as Record<string, unknown>;
		return {
			path: String(record.path ?? ''),
			path_group: String(record.path_group ?? ''),
			content_type: String(record.content_type ?? 'other'),
			current_visits: toNumber(record.current_visits),
			current_unique_visitors: toNumber(record.current_unique_visitors),
			baseline_avg_visits: toNumber(record.baseline_avg_visits),
			baseline_avg_unique_visitors: toNumber(record.baseline_avg_unique_visitors),
			lift_visits: toNumber(record.lift_visits),
			lift_unique_visitors: toNumber(record.lift_unique_visitors),
			ratio_visits: toNullableNumber(record.ratio_visits),
			trend_score: toNumber(record.trend_score),
			confidence: String(record.confidence ?? 'moderate'),
			top_sources: normalizeTrafficSources(record.top_sources),
			top_referrers: normalizeTrafficSources(record.top_referrers),
			avg_time_on_page_ms: toNumber(record.avg_time_on_page_ms),
			median_time_on_page_ms: toNumber(record.median_time_on_page_ms),
			bounce_rate: toNumber(record.bounce_rate),
			is_low_unique: Boolean(record.is_low_unique)
		};
	});
}

export function buildTrendingAnalyticsPayload(
	rows: unknown,
	options: TrendingAnalyticsOptions = {},
	available = true
): TrendingAnalyticsPayload {
	const normalizedOptions = getTrendingOptions(options);
	const normalizedRows = normalizeTrendingPageRows(rows);
	const broadRows = normalizedRows.filter(
		(row) => !row.is_low_unique && row.current_unique_visitors >= normalizedOptions.minUnique
	);
	const repeatRows = normalizedRows.filter((row) => row.is_low_unique);

	return {
		available,
		generatedAt: normalizedOptions.now.toISOString(),
		baselineDays: normalizedOptions.baselineDays,
		minVisits: normalizedOptions.minVisits,
		minUnique: normalizedOptions.minUnique,
		rows: normalizedRows,
		broadRows,
		repeatRows
	};
}

export function emptyTrendingAnalyticsPayload(
	options: TrendingAnalyticsOptions = {},
	available = false
): TrendingAnalyticsPayload {
	return buildTrendingAnalyticsPayload([], options, available);
}

export function isMissingTrendingAnalyticsRpc(err: unknown): boolean {
	const message =
		typeof err === 'object' && err !== null && 'message' in err
			? String((err as { message?: unknown }).message ?? '')
			: '';

	return (
		message.includes('get_page_analytics_trending_pages') ||
		message.includes('function public.get_page_analytics_trending_pages')
	);
}

function getTimeZoneParts(date: Date, timeZone = 'America/New_York') {
	const parts = new Intl.DateTimeFormat('en-US', {
		timeZone,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hourCycle: 'h23'
	}).formatToParts(date);
	const lookup = Object.fromEntries(parts.map((part) => [part.type, part.value]));

	return {
		year: Number(lookup.year),
		month: Number(lookup.month),
		day: Number(lookup.day),
		hour: Number(lookup.hour),
		minute: Number(lookup.minute),
		second: Number(lookup.second)
	};
}

function getTimeZoneOffsetMs(date: Date, timeZone = 'America/New_York'): number {
	const parts = getTimeZoneParts(date, timeZone);
	const localAsUtc = Date.UTC(
		parts.year,
		parts.month - 1,
		parts.day,
		parts.hour,
		parts.minute,
		parts.second
	);
	return localAsUtc - date.getTime();
}

function zonedMidnightToUtc(
	parts: { year: number; month: number; day: number },
	timeZone = 'America/New_York'
): Date {
	const guess = new Date(Date.UTC(parts.year, parts.month - 1, parts.day, 0, 0, 0));
	const offset = getTimeZoneOffsetMs(guess, timeZone);
	return new Date(guess.getTime() - offset);
}

function addDaysToDateParts(parts: { year: number; month: number; day: number }, days: number) {
	const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + days, 12, 0, 0));
	return {
		year: date.getUTCFullYear(),
		month: date.getUTCMonth() + 1,
		day: date.getUTCDate()
	};
}

function computeFallbackTrendScore(row: TrendingPageRow): number {
	const ratioContribution =
		row.ratio_visits === null ? row.current_visits : Math.min(row.ratio_visits, 12);
	const score =
		(Math.max(row.lift_visits, 0) +
			Math.max(row.lift_unique_visitors, 0) * 1.5 +
			ratioContribution * 0.75) *
		(row.is_low_unique ? 0.65 : 1);
	return Number(score.toFixed(2));
}

function getFallbackConfidence(row: TrendingPageRow, minUnique: number): string {
	if (row.is_low_unique) return 'low_unique';
	return row.current_unique_visitors >= Math.max(minUnique * 2, 8) ? 'broad' : 'moderate';
}

async function fetchWindowedPageRows(
	supabase: any,
	options: {
		fromTs: string;
		toTs: string;
		scope: string;
		limit: number;
	}
): Promise<Array<Record<string, unknown>> | null> {
	const { data, error } = await supabase.rpc('get_page_analytics_pages_sorted_windowed', {
		p_from_ts: options.fromTs,
		p_to_ts: options.toTs,
		p_scope: options.scope,
		p_search: null,
		p_limit: options.limit,
		p_offset: 0,
		p_sort_by: 'visits',
		p_sort_dir: 'desc'
	});

	if (error) {
		return null;
	}

	return Array.isArray(data) ? (data as Array<Record<string, unknown>>) : [];
}

async function loadTrendingAnalyticsFallback(
	supabase: any,
	options: Required<ReturnType<typeof getTrendingOptions>> & { scope: string }
): Promise<TrendingAnalyticsPayload> {
	const anchorParts = getTimeZoneParts(options.now);
	const anchorDateParts = {
		year: anchorParts.year,
		month: anchorParts.month,
		day: anchorParts.day
	};
	const currentStart = zonedMidnightToUtc(anchorDateParts);
	const elapsedMs = Math.max(60_000, options.now.getTime() - currentStart.getTime());
	const currentRows = await fetchWindowedPageRows(supabase, {
		fromTs: currentStart.toISOString(),
		toTs: options.now.toISOString(),
		scope: options.scope,
		limit: Math.min(500, Math.max(options.limit * 8, 80))
	});

	if (!currentRows) {
		return emptyTrendingAnalyticsPayload(options, false);
	}

	const baselineMaps: Array<
		Map<string, { visits: number; uniqueVisitors: number; pathGroup: string; contentType: string }>
	> = [];

	for (let dayOffset = 1; dayOffset <= options.baselineDays; dayOffset += 1) {
		const dateParts = addDaysToDateParts(anchorDateParts, -dayOffset);
		const from = zonedMidnightToUtc(dateParts);
		const to = new Date(from.getTime() + elapsedMs);
		const rows = await fetchWindowedPageRows(supabase, {
			fromTs: from.toISOString(),
			toTs: to.toISOString(),
			scope: options.scope,
			limit: 500
		});

		if (!rows) {
			return emptyTrendingAnalyticsPayload(options, false);
		}

		baselineMaps.push(
			new Map(
				rows.map((row) => [
					String(row.path ?? ''),
					{
						visits: toNumber(row.visits),
						uniqueVisitors: toNumber(row.unique_visitors),
						pathGroup: String(row.path_group ?? ''),
						contentType: String(row.content_type ?? 'other')
					}
				])
			)
		);
	}

	const rows = currentRows
		.map((row): TrendingPageRow | null => {
			const path = String(row.path ?? '');
			if (!path) return null;

			const currentVisits = toNumber(row.visits);
			const currentUniqueVisitors = toNumber(row.unique_visitors);
			const baselineVisitsTotal = baselineMaps.reduce(
				(sum, map) => sum + (map.get(path)?.visits ?? 0),
				0
			);
			const baselineUniqueTotal = baselineMaps.reduce(
				(sum, map) => sum + (map.get(path)?.uniqueVisitors ?? 0),
				0
			);
			const baselineAvgVisits = Number((baselineVisitsTotal / options.baselineDays).toFixed(2));
			const baselineAvgUniqueVisitors = Number(
				(baselineUniqueTotal / options.baselineDays).toFixed(2)
			);
			const liftVisits = Number((currentVisits - baselineAvgVisits).toFixed(2));
			const liftUniqueVisitors = Number(
				(currentUniqueVisitors - baselineAvgUniqueVisitors).toFixed(2)
			);

			if (currentVisits < options.minVisits || liftVisits <= 0) return null;

			const isLowUnique =
				currentUniqueVisitors < options.minUnique ||
				(currentUniqueVisitors <= 2 && currentVisits >= options.minVisits) ||
				(currentUniqueVisitors > 0 && currentVisits / currentUniqueVisitors >= 4);
			const ratioVisits =
				baselineAvgVisits > 0 ? Number((currentVisits / baselineAvgVisits).toFixed(2)) : null;

			const normalized: TrendingPageRow = {
				path,
				path_group: String(row.path_group ?? ''),
				content_type: String(row.content_type ?? 'other'),
				current_visits: currentVisits,
				current_unique_visitors: currentUniqueVisitors,
				baseline_avg_visits: baselineAvgVisits,
				baseline_avg_unique_visitors: baselineAvgUniqueVisitors,
				lift_visits: liftVisits,
				lift_unique_visitors: liftUniqueVisitors,
				ratio_visits: ratioVisits,
				trend_score: 0,
				confidence: 'moderate',
				top_sources: [],
				top_referrers: [],
				avg_time_on_page_ms: toNumber(row.avg_time_on_page_ms),
				median_time_on_page_ms: toNumber(row.median_time_on_page_ms),
				bounce_rate: toNumber(row.bounce_rate),
				is_low_unique: isLowUnique
			};
			normalized.trend_score = computeFallbackTrendScore(normalized);
			normalized.confidence = getFallbackConfidence(normalized, options.minUnique);
			return normalized;
		})
		.filter((row): row is TrendingPageRow => row !== null)
		.sort(
			(a, b) =>
				b.trend_score - a.trend_score ||
				b.lift_visits - a.lift_visits ||
				b.current_unique_visitors - a.current_unique_visitors ||
				a.path.localeCompare(b.path)
		)
		.slice(0, options.limit);

	return buildTrendingAnalyticsPayload(rows, options, true);
}

export async function loadTrendingAnalytics(
	supabase: any,
	options: LoadTrendingAnalyticsOptions = {}
): Promise<TrendingAnalyticsPayload> {
	const normalizedOptions = getTrendingOptions({
		...options,
		now: options.anchorTs ? new Date(options.anchorTs) : options.now
	});
	const scope = options.scope ?? 'all';
	const { data, error } = await supabase.rpc('get_page_analytics_trending_pages', {
		p_anchor_ts: options.anchorTs ?? null,
		p_baseline_days: normalizedOptions.baselineDays,
		p_scope: scope,
		p_min_visits: normalizedOptions.minVisits,
		p_min_unique: normalizedOptions.minUnique,
		p_limit: normalizedOptions.limit
	});

	if (!error) {
		return buildTrendingAnalyticsPayload(data ?? [], normalizedOptions, true);
	}

	if (!isMissingTrendingAnalyticsRpc(error)) {
		throw error;
	}

	return loadTrendingAnalyticsFallback(supabase, {
		...normalizedOptions,
		scope
	});
}
