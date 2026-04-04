// src/routes/admin/analytics/+page.server.ts
import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import type { AnalyticsScope } from '$lib/analytics/pageAnalytics';
import { attachAnalyticsLastModified } from '$lib/server/analyticsPageLastModified';

interface AnalyticsOverview {
	total_visits: number;
	unique_visitors: number;
	authenticated_visits: number;
	anonymous_visits: number;
	avg_time_on_page_ms: number;
	median_time_on_page_ms: number;
	bounce_rate: number;
}

interface TopPagesTimeseriesRow {
	day: string;
	path: string;
	path_group: string | null;
	visits: number;
}

const DEFAULT_SCOPE: AnalyticsScope = 'all';
const DEFAULT_LIMIT = 50;
const DEFAULT_TOP_LIST_LIMIT = 8;
const DEFAULT_TOP_SERIES_LIMIT = 6;
const DEFAULT_DURATION_MIN_VISITS = 3;

const overviewDefaults: AnalyticsOverview = {
	total_visits: 0,
	unique_visitors: 0,
	authenticated_visits: 0,
	anonymous_visits: 0,
	avg_time_on_page_ms: 0,
	median_time_on_page_ms: 0,
	bounce_rate: 0
};

function toNumber(value: unknown): number {
	return Number(value || 0);
}

function toDateString(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

function startOfWeek(date: Date): Date {
	const result = new Date(date);
	const day = result.getDay();
	const mondayOffset = day === 0 ? -6 : 1 - day;
	result.setDate(result.getDate() + mondayOffset);
	result.setHours(0, 0, 0, 0);
	return result;
}

function startOfMonth(date: Date): Date {
	const result = new Date(date);
	result.setDate(1);
	result.setHours(0, 0, 0, 0);
	return result;
}

export const load: PageServerLoad = async (event) => {
	const session = event.locals.session;
	const supabase = event.locals.supabase;

	if (!session?.user?.id) {
		throw redirect(302, '/questions');
	}

	const { data: user, error: findUserError } = await supabase
		.from('profiles')
		.select('id, admin')
		.eq('id', session.user.id)
		.single();

	if (!user?.admin) {
		throw redirect(307, '/questions');
	}

	if (findUserError) {
		throw error(404, { message: 'Error searching for user' });
	}

	const toDate = toDateString(new Date());
	const fromDateObj = new Date();
	fromDateObj.setDate(fromDateObj.getDate() - 29);
	const fromDate = toDateString(fromDateObj);
	const weekFromDate = toDateString(startOfWeek(new Date()));
	const monthFromDate = toDateString(startOfMonth(new Date()));

	const supabaseAny = supabase as any;
	const [
		overviewResult,
		timeseriesResult,
		pagesResult,
		topOverTimeResult,
		topWeekResult,
		topMonthResult,
		topDurationResult
	] = await Promise.all([
		supabaseAny.rpc('get_page_analytics_overview', {
			p_from_date: fromDate,
			p_to_date: toDate,
			p_scope: DEFAULT_SCOPE
		}),
		supabaseAny.rpc('get_page_analytics_timeseries', {
			p_from_date: fromDate,
			p_to_date: toDate,
			p_scope: DEFAULT_SCOPE
		}),
		supabaseAny.rpc('get_page_analytics_pages', {
			p_from_date: fromDate,
			p_to_date: toDate,
			p_scope: DEFAULT_SCOPE,
			p_search: null,
			p_limit: DEFAULT_LIMIT,
			p_offset: 0
		}),
		supabaseAny.rpc('get_page_analytics_top_pages_timeseries', {
			p_from_date: fromDate,
			p_to_date: toDate,
			p_scope: DEFAULT_SCOPE,
			p_top_n: DEFAULT_TOP_SERIES_LIMIT
		}),
		supabaseAny.rpc('get_page_analytics_pages', {
			p_from_date: weekFromDate,
			p_to_date: toDate,
			p_scope: DEFAULT_SCOPE,
			p_search: null,
			p_limit: DEFAULT_TOP_LIST_LIMIT,
			p_offset: 0
		}),
		supabaseAny.rpc('get_page_analytics_pages', {
			p_from_date: monthFromDate,
			p_to_date: toDate,
			p_scope: DEFAULT_SCOPE,
			p_search: null,
			p_limit: DEFAULT_TOP_LIST_LIMIT,
			p_offset: 0
		}),
		supabaseAny.rpc('get_page_analytics_pages_by_duration', {
			p_from_date: fromDate,
			p_to_date: toDate,
			p_scope: DEFAULT_SCOPE,
			p_min_visits: DEFAULT_DURATION_MIN_VISITS,
			p_limit: DEFAULT_TOP_LIST_LIMIT
		})
	]);

	if (
		overviewResult.error ||
		timeseriesResult.error ||
		pagesResult.error ||
		topOverTimeResult.error ||
		topWeekResult.error ||
		topMonthResult.error ||
		topDurationResult.error
	) {
		console.error('Failed loading admin analytics', {
			overview: overviewResult.error,
			timeseries: timeseriesResult.error,
			pages: pagesResult.error,
			topOverTime: topOverTimeResult.error,
			topWeek: topWeekResult.error,
			topMonth: topMonthResult.error,
			topDuration: topDurationResult.error
		});
		throw error(500, 'Failed to load analytics');
	}

	const summary = {
		...overviewDefaults,
		...(overviewResult.data ?? {})
	};

	const overview = {
		total_visits: toNumber(summary.total_visits),
		unique_visitors: toNumber(summary.unique_visitors),
		authenticated_visits: toNumber(summary.authenticated_visits),
		anonymous_visits: toNumber(summary.anonymous_visits),
		avg_time_on_page_ms: toNumber(summary.avg_time_on_page_ms),
		median_time_on_page_ms: toNumber(summary.median_time_on_page_ms),
		bounce_rate: toNumber(summary.bounce_rate)
	};

	const timeseries = ((timeseriesResult.data ?? []) as Array<Record<string, unknown>>).map(
		(point) => ({
			day: String(point.day ?? ''),
			visits: toNumber(point.visits),
			unique_visitors: toNumber(point.unique_visitors),
			authenticated_visits: toNumber(point.authenticated_visits),
			anonymous_visits: toNumber(point.anonymous_visits),
			avg_time_on_page_ms: toNumber(point.avg_time_on_page_ms)
		})
	);

	const rows = ((pagesResult.data ?? []) as Array<Record<string, unknown>>).map((row) => ({
		path: String(row.path ?? ''),
		path_group: String(row.path_group ?? ''),
		content_type: String(row.content_type ?? 'other'),
		visits: toNumber(row.visits),
		unique_visitors: toNumber(row.unique_visitors),
		authenticated_visits: toNumber(row.authenticated_visits),
		anonymous_visits: toNumber(row.anonymous_visits),
		avg_time_on_page_ms: toNumber(row.avg_time_on_page_ms),
		median_time_on_page_ms: toNumber(row.median_time_on_page_ms),
		bounce_rate: toNumber(row.bounce_rate),
		total_rows: toNumber(row.total_rows)
	}));
	const rowsWithLastModified = await attachAnalyticsLastModified(supabase, rows);

	const totalRows = rowsWithLastModified.length > 0 ? rowsWithLastModified[0].total_rows : 0;
	const normalizeTopRows = (input: Array<Record<string, unknown>>) =>
		input.map((row) => ({
			path: String(row.path ?? ''),
			path_group: String(row.path_group ?? ''),
			content_type: String(row.content_type ?? 'other'),
			visits: toNumber(row.visits),
			unique_visitors: toNumber(row.unique_visitors),
			authenticated_visits: toNumber(row.authenticated_visits),
			anonymous_visits: toNumber(row.anonymous_visits),
			avg_time_on_page_ms: toNumber(row.avg_time_on_page_ms),
			median_time_on_page_ms: toNumber(row.median_time_on_page_ms),
			bounce_rate: toNumber(row.bounce_rate)
		}));

	const topPagesOverTime = ((topOverTimeResult.data ?? []) as TopPagesTimeseriesRow[]).map(
		(row) => ({
			day: String(row.day ?? ''),
			path: String(row.path ?? ''),
			path_group: String(row.path_group ?? ''),
			visits: toNumber(row.visits)
		})
	);

	return {
		filters: {
			from: fromDate,
			to: toDate,
			scope: DEFAULT_SCOPE
		},
		overview,
		timeseries,
		topPages: {
			topPagesOverTime,
			topPagesThisWeek: normalizeTopRows(
				(topWeekResult.data ?? []) as Array<Record<string, unknown>>
			),
			topPagesThisMonth: normalizeTopRows(
				(topMonthResult.data ?? []) as Array<Record<string, unknown>>
			),
			topPagesBySessionDuration: normalizeTopRows(
				(topDurationResult.data ?? []) as Array<Record<string, unknown>>
			),
			windows: {
				selectedFrom: fromDate,
				selectedTo: toDate,
				weekFrom: weekFromDate,
				weekTo: toDate,
				monthFrom: monthFromDate,
				monthTo: toDate
			}
		},
		rows: rowsWithLastModified,
		pagination: {
			total: totalRows,
			page: 1,
			limit: DEFAULT_LIMIT,
			totalPages: Math.max(1, Math.ceil(totalRows / DEFAULT_LIMIT))
		}
	};
};
