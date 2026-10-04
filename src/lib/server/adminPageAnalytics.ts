// src/lib/server/adminPageAnalytics.ts
// Pageview analytics queries shared by the /api/admin/analytics/* endpoints and the
// /admin/analytics server load. The load starts the default view's queries during SSR and
// streams them, so the first paint and later client refetches read identical payloads.
import { error } from '@sveltejs/kit';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../../database.types';
import type { AnalyticsScope } from '$lib/analytics/pageAnalytics';
import { endOfUtcDay, toUtcDateString } from '$lib/analytics/adminAnalyticsDates';
import {
	attachAnalyticsLastModified,
	primeAnalyticsLastModifiedIndex
} from '$lib/server/analyticsPageLastModified';

type AppSupabaseClient = SupabaseClient<Database>;

/**
 * A query failed after it was logged. The message is safe to show in an HTTP 500 body.
 */
export class AdminAnalyticsQueryError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'AdminAnalyticsQueryError';
	}
}

/** Map a logged query failure to an HTTP 500 with its message; rethrow anything else. */
export function rethrowAnalyticsQueryError(err: unknown): never {
	if (err instanceof AdminAnalyticsQueryError) {
		error(500, err.message);
	}
	throw err;
}

interface AnalyticsRangeQuery {
	fromDate?: string;
	toDate?: string;
	scope: AnalyticsScope;
}

export interface AnalyticsOverviewSummary {
	total_visits: number;
	unique_visitors: number;
	authenticated_visits: number;
	anonymous_visits: number;
	avg_time_on_page_ms: number;
	median_time_on_page_ms: number;
	bounce_rate: number;
}

export interface AnalyticsTimeseriesPoint {
	day: string;
	visits: number;
	unique_visitors: number;
	authenticated_visits: number;
	anonymous_visits: number;
	avg_time_on_page_ms: number;
}

interface AnalyticsPagesRpcRow {
	path: string;
	path_group: string;
	content_type: string | null;
	visits: number;
	unique_visitors: number;
	authenticated_visits: number;
	anonymous_visits: number;
	avg_time_on_page_ms: number;
	median_time_on_page_ms: number;
	bounce_rate: number;
}

interface AnalyticsSortedPagesRpcRow extends AnalyticsPagesRpcRow {
	total_rows: number;
}

interface AnalyticsTimeseriesByPageRow {
	day: string;
	path: string;
	path_group: string | null;
	visits: number;
}

export interface AnalyticsPageSummaryRow {
	path: string;
	path_group: string;
	content_type: string;
	visits: number;
	unique_visitors: number;
	authenticated_visits: number;
	anonymous_visits: number;
	avg_time_on_page_ms: number;
	median_time_on_page_ms: number;
	bounce_rate: number;
}

export interface AnalyticsTopPagesPayload {
	topPagesOverTime: Array<{ day: string; path: string; path_group: string; visits: number }>;
	topPagesThisWeek: AnalyticsPageSummaryRow[];
	topPagesThisMonth: AnalyticsPageSummaryRow[];
	topPagesBySessionDuration: AnalyticsPageSummaryRow[];
	windows: {
		selectedFrom: string;
		selectedTo: string;
		weekFrom: string;
		weekTo: string;
		monthFrom: string;
		monthTo: string;
	};
}

export type PageBreakdownWindow = '24h' | '7d' | '14d' | '30d' | '90d';

export interface AnalyticsPagesQuery extends AnalyticsRangeQuery {
	page: number;
	limit: number;
	search: string;
	sortBy: string;
	sortDir: 'asc' | 'desc';
	window?: PageBreakdownWindow;
}

export interface AnalyticsPagesPayload {
	rows: Array<
		AnalyticsPageSummaryRow & {
			total_rows: number;
			last_modified_at: string | null;
		}
	>;
	pagination: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
	sorting: {
		sortBy: string;
		sortDir: 'asc' | 'desc';
	};
	window: {
		key: PageBreakdownWindow | 'custom';
		from: string;
		to: string;
		fromTs?: string;
		toTs?: string;
		label: string;
	};
}

const defaultOverview: AnalyticsOverviewSummary = {
	total_visits: 0,
	unique_visitors: 0,
	authenticated_visits: 0,
	anonymous_visits: 0,
	avg_time_on_page_ms: 0,
	median_time_on_page_ms: 0,
	bounce_rate: 0
};

const pageBreakdownWindowHours: Record<PageBreakdownWindow, number> = {
	'24h': 24,
	'7d': 24 * 7,
	'14d': 24 * 14,
	'30d': 24 * 30,
	'90d': 24 * 90
};

const pageBreakdownWindowLabels: Record<PageBreakdownWindow, string> = {
	'24h': 'Last 24 Hours',
	'7d': 'Last 7 Days',
	'14d': 'Last 14 Days',
	'30d': 'Last 30 Days',
	'90d': 'Last 90 Days'
};

function callRpc(
	supabase: AppSupabaseClient,
	fn: string,
	args: Record<string, unknown>
): Promise<{ data: unknown; error: unknown }> {
	// The analytics RPCs are not in the generated Database types.
	return (supabase as any).rpc(fn, args);
}

function fail(message: string, details: unknown): never {
	console.error(`${message}:`, details);
	throw new AdminAnalyticsQueryError(message);
}

export async function loadAnalyticsOverview(
	supabase: AppSupabaseClient,
	{ fromDate, toDate, scope }: AnalyticsRangeQuery
): Promise<AnalyticsOverviewSummary> {
	const { data, error: rpcError } = await callRpc(supabase, 'get_page_analytics_overview', {
		p_from_date: fromDate,
		p_to_date: toDate,
		p_scope: scope
	});

	if (rpcError) {
		fail('Failed to fetch analytics overview', rpcError);
	}

	const summary = {
		...defaultOverview,
		...((data ?? {}) as Partial<AnalyticsOverviewSummary>)
	};

	return {
		total_visits: Number(summary.total_visits || 0),
		unique_visitors: Number(summary.unique_visitors || 0),
		authenticated_visits: Number(summary.authenticated_visits || 0),
		anonymous_visits: Number(summary.anonymous_visits || 0),
		avg_time_on_page_ms: Number(summary.avg_time_on_page_ms || 0),
		median_time_on_page_ms: Number(summary.median_time_on_page_ms || 0),
		bounce_rate: Number(summary.bounce_rate || 0)
	};
}

export async function loadAnalyticsTimeseries(
	supabase: AppSupabaseClient,
	{ fromDate, toDate, scope }: AnalyticsRangeQuery
): Promise<AnalyticsTimeseriesPoint[]> {
	const { data, error: rpcError } = await callRpc(supabase, 'get_page_analytics_timeseries', {
		p_from_date: fromDate,
		p_to_date: toDate,
		p_scope: scope
	});

	if (rpcError) {
		fail('Failed to fetch analytics timeseries', rpcError);
	}

	return ((data ?? []) as Array<Record<string, unknown>>).map((point) => ({
		day: String(point.day ?? ''),
		visits: Number(point.visits || 0),
		unique_visitors: Number(point.unique_visitors || 0),
		authenticated_visits: Number(point.authenticated_visits || 0),
		anonymous_visits: Number(point.anonymous_visits || 0),
		avg_time_on_page_ms: Number(point.avg_time_on_page_ms || 0)
	}));
}

// The top-pages week/month windows use the server's local calendar, as they always have.
function toLocalDateString(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

function fromLocalDateString(value: string): Date {
	const [year, month, day] = value.split('-').map(Number);
	return new Date(year, month - 1, day);
}

function startOfLocalWeek(date: Date): Date {
	const result = new Date(date);
	const day = result.getDay();
	const mondayOffset = day === 0 ? -6 : 1 - day;
	result.setDate(result.getDate() + mondayOffset);
	result.setHours(0, 0, 0, 0);
	return result;
}

function startOfLocalMonth(date: Date): Date {
	const result = new Date(date);
	result.setDate(1);
	result.setHours(0, 0, 0, 0);
	return result;
}

function resolveSelectedRange(
	fromDate: string | undefined,
	toDate: string | undefined
): {
	from: string;
	to: string;
} {
	const to = toDate ?? toLocalDateString(new Date());
	const from = (() => {
		if (fromDate) return fromDate;
		const d = fromLocalDateString(to);
		d.setDate(d.getDate() - 29);
		return toLocalDateString(d);
	})();

	return { from, to };
}

function normalizePageRow(row: AnalyticsPagesRpcRow): AnalyticsPageSummaryRow {
	return {
		path: row.path ?? '',
		path_group: row.path_group ?? '',
		content_type: row.content_type ?? 'other',
		visits: Number(row.visits || 0),
		unique_visitors: Number(row.unique_visitors || 0),
		authenticated_visits: Number(row.authenticated_visits || 0),
		anonymous_visits: Number(row.anonymous_visits || 0),
		avg_time_on_page_ms: Number(row.avg_time_on_page_ms || 0),
		median_time_on_page_ms: Number(row.median_time_on_page_ms || 0),
		bounce_rate: Number(row.bounce_rate || 0)
	};
}

function normalizePageRows(rows: AnalyticsPagesRpcRow[]): AnalyticsPageSummaryRow[] {
	return rows.map(normalizePageRow);
}

export async function loadAnalyticsTopPages(
	supabase: AppSupabaseClient,
	{
		fromDate,
		toDate,
		scope,
		topN,
		limit,
		minVisits
	}: AnalyticsRangeQuery & { topN: number; limit: number; minVisits: number }
): Promise<AnalyticsTopPagesPayload> {
	const selectedRange = resolveSelectedRange(fromDate, toDate);

	const today = new Date();
	const todayDate = toLocalDateString(today);
	const weekFromDate = toLocalDateString(startOfLocalWeek(today));
	const monthFromDate = toLocalDateString(startOfLocalMonth(today));

	const [overTimeResult, weekResult, monthResult, durationResult] = await Promise.all([
		callRpc(supabase, 'get_page_analytics_top_pages_timeseries', {
			p_from_date: selectedRange.from,
			p_to_date: selectedRange.to,
			p_scope: scope,
			p_top_n: topN
		}),
		callRpc(supabase, 'get_page_analytics_pages', {
			p_from_date: weekFromDate,
			p_to_date: todayDate,
			p_scope: scope,
			p_search: null,
			p_limit: limit,
			p_offset: 0
		}),
		callRpc(supabase, 'get_page_analytics_pages', {
			p_from_date: monthFromDate,
			p_to_date: todayDate,
			p_scope: scope,
			p_search: null,
			p_limit: limit,
			p_offset: 0
		}),
		callRpc(supabase, 'get_page_analytics_pages_by_duration', {
			p_from_date: selectedRange.from,
			p_to_date: selectedRange.to,
			p_scope: scope,
			p_min_visits: minVisits,
			p_limit: limit
		})
	]);

	if (overTimeResult.error || weekResult.error || monthResult.error || durationResult.error) {
		fail('Failed to fetch top pages analytics', {
			overTime: overTimeResult.error,
			week: weekResult.error,
			month: monthResult.error,
			duration: durationResult.error
		});
	}

	const topPagesOverTime = ((overTimeResult.data ?? []) as AnalyticsTimeseriesByPageRow[]).map(
		(row) => ({
			day: String(row.day ?? ''),
			path: String(row.path ?? ''),
			path_group: String(row.path_group ?? ''),
			visits: Number(row.visits || 0)
		})
	);

	return {
		topPagesOverTime,
		topPagesThisWeek: normalizePageRows((weekResult.data ?? []) as AnalyticsPagesRpcRow[]),
		topPagesThisMonth: normalizePageRows((monthResult.data ?? []) as AnalyticsPagesRpcRow[]),
		topPagesBySessionDuration: normalizePageRows(
			(durationResult.data ?? []) as AnalyticsPagesRpcRow[]
		),
		windows: {
			selectedFrom: selectedRange.from,
			selectedTo: selectedRange.to,
			weekFrom: weekFromDate,
			weekTo: todayDate,
			monthFrom: monthFromDate,
			monthTo: todayDate
		}
	};
}

function getWindowBounds(window: PageBreakdownWindow, anchorDate?: string) {
	const now = new Date();
	const today = toUtcDateString(now);
	const to = anchorDate && anchorDate !== today ? endOfUtcDay(anchorDate) : now;
	const from = new Date(to.getTime() - pageBreakdownWindowHours[window] * 60 * 60 * 1000);

	return {
		fromTs: from.toISOString(),
		toTs: to.toISOString(),
		fromDate: toUtcDateString(from),
		toDate: toUtcDateString(to),
		label: pageBreakdownWindowLabels[window]
	};
}

function isMissingWindowedPagesRpc(err: unknown): boolean {
	const message =
		typeof err === 'object' && err !== null && 'message' in err
			? String((err as { message?: unknown }).message ?? '')
			: '';
	return (
		message.includes('get_page_analytics_pages_sorted_windowed') ||
		message.includes('function public.get_page_analytics_pages_sorted_windowed')
	);
}

export async function loadAnalyticsPages(
	supabase: AppSupabaseClient,
	{ fromDate, toDate, scope, page, limit, search, sortBy, sortDir, window }: AnalyticsPagesQuery
): Promise<AnalyticsPagesPayload> {
	// Build the blog last-modified index while the database works on the page rows.
	primeAnalyticsLastModifiedIndex();

	const offset = (page - 1) * limit;
	let data: unknown;
	let rpcError: unknown;
	let windowMeta: AnalyticsPagesPayload['window'];

	if (window) {
		const bounds = getWindowBounds(window, toDate ?? fromDate);
		windowMeta = {
			key: window,
			from: bounds.fromDate,
			to: bounds.toDate,
			fromTs: bounds.fromTs,
			toTs: bounds.toTs,
			label: bounds.label
		};

		const windowedResult = await callRpc(supabase, 'get_page_analytics_pages_sorted_windowed', {
			p_from_ts: bounds.fromTs,
			p_to_ts: bounds.toTs,
			p_scope: scope,
			p_search: search || null,
			p_limit: limit,
			p_offset: offset,
			p_sort_by: sortBy,
			p_sort_dir: sortDir
		});

		data = windowedResult.data ?? null;
		rpcError = windowedResult.error;

		// Fallback keeps table available if the new RPC isn't deployed yet.
		if (rpcError && isMissingWindowedPagesRpc(rpcError)) {
			const fallbackResult = await callRpc(supabase, 'get_page_analytics_pages_sorted', {
				p_from_date: bounds.fromDate,
				p_to_date: bounds.toDate,
				p_scope: scope,
				p_search: search || null,
				p_limit: limit,
				p_offset: offset,
				p_sort_by: sortBy,
				p_sort_dir: sortDir
			});

			data = fallbackResult.data ?? null;
			rpcError = fallbackResult.error;
		}
	} else {
		windowMeta = {
			key: 'custom',
			from: fromDate ?? '',
			to: toDate ?? '',
			label: fromDate && toDate ? `${fromDate} - ${toDate}` : 'Custom Range'
		};

		const rangeResult = await callRpc(supabase, 'get_page_analytics_pages_sorted', {
			p_from_date: fromDate,
			p_to_date: toDate,
			p_scope: scope,
			p_search: search || null,
			p_limit: limit,
			p_offset: offset,
			p_sort_by: sortBy,
			p_sort_dir: sortDir
		});

		data = rangeResult.data ?? null;
		rpcError = rangeResult.error;
	}

	if (rpcError) {
		fail('Failed to fetch analytics pages', rpcError);
	}

	const rows = ((data ?? []) as AnalyticsSortedPagesRpcRow[]).map((row) => ({
		...normalizePageRow(row),
		total_rows: Number(row.total_rows || 0)
	}));
	const rowsWithLastModified = await attachAnalyticsLastModified(supabase, rows);

	const total =
		rowsWithLastModified.length > 0 ? Number(rowsWithLastModified[0].total_rows || 0) : 0;

	return {
		rows: rowsWithLastModified,
		pagination: {
			total,
			page,
			limit,
			totalPages: Math.max(1, Math.ceil(total / limit))
		},
		sorting: {
			sortBy,
			sortDir
		},
		window: windowMeta
	};
}
