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

interface CohortOverviewRow {
	entry_surface: string;
	new_visitors: number;
	commented_within_d7: number;
	comment_rate_pct: number;
	signed_up_within_d7: number;
	signup_rate_pct: number;
	registered_within_d7: number;
	registration_rate_pct: number;
	retained_d1: number;
	retained_d1_denominator: number;
	retained_d1_pct: number;
	retained_d7: number;
	retained_d7_denominator: number;
	retained_d7_pct: number;
	retained_d30: number;
	retained_d30_denominator: number;
	retained_d30_pct: number;
	avg_engaged_minutes_within_d7: number;
}

interface CohortRetentionRow {
	cohort_week: string;
	new_visitors: number;
	retained_d1: number;
	retained_d1_denominator: number;
	retained_d1_pct: number;
	retained_d3: number;
	retained_d3_denominator: number;
	retained_d3_pct: number;
	retained_d7: number;
	retained_d7_denominator: number;
	retained_d7_pct: number;
	retained_d14: number;
	retained_d14_denominator: number;
	retained_d14_pct: number;
	retained_d30: number;
	retained_d30_denominator: number;
	retained_d30_pct: number;
}

interface AcquisitionMixRow {
	cohort_week: string;
	acquisition_source: string;
	new_visitors: number;
}

interface NextPathRow {
	next_path: string;
	visitor_count: number;
	share_pct: number;
	avg_engaged_ms: number;
}

const DEFAULT_SCOPE: AnalyticsScope = 'all';
const DEFAULT_LIMIT = 50;
const DEFAULT_TOP_LIST_LIMIT = 8;
const DEFAULT_TOP_SERIES_LIMIT = 6;
const DEFAULT_DURATION_MIN_VISITS = 3;
const DEFAULT_COHORT_WEEKS = 8;
const DEFAULT_NEXT_PATH_LIMIT = 12;

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

function endOfPreviousWeek(date: Date): Date {
	const result = startOfWeek(date);
	result.setDate(result.getDate() - 1);
	result.setHours(0, 0, 0, 0);
	return result;
}

function getCompletedWeeksRange(anchorDate: Date, weeks: number): { from: string; to: string } {
	const to = endOfPreviousWeek(anchorDate);
	const from = new Date(to);
	from.setDate(from.getDate() - (weeks * 7 - 1));
	from.setHours(0, 0, 0, 0);

	return {
		from: toDateString(from),
		to: toDateString(to)
	};
}

function isMissingRetentionRpc(err: unknown): boolean {
	const message =
		typeof err === 'object' && err !== null && 'message' in err
			? String((err as { message?: unknown }).message ?? '')
			: '';

	return (
		message.includes('get_entry_surface_overview') ||
		message.includes('get_cohort_retention_curve') ||
		message.includes('get_acquisition_mix_by_week') ||
		message.includes('get_first_session_next_paths')
	);
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

	const today = new Date();
	const toDate = toDateString(today);
	const fromDateObj = new Date(today);
	fromDateObj.setDate(fromDateObj.getDate() - 29);
	const fromDate = toDateString(fromDateObj);
	const weekFromDate = toDateString(startOfWeek(today));
	const monthFromDate = toDateString(startOfMonth(today));
	const cohortRange = getCompletedWeeksRange(today, DEFAULT_COHORT_WEEKS);

	const supabaseAny = supabase as any;
	const [
		overviewResult,
		timeseriesResult,
		pagesResult,
		topOverTimeResult,
		topWeekResult,
		topMonthResult,
		topDurationResult,
		cohortOverviewResult,
		cohortRetentionResult,
		cohortMixResult,
		cohortNextPathsResult
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
		}),
		supabaseAny.rpc('get_entry_surface_overview', {
			p_from: cohortRange.from,
			p_to: cohortRange.to,
			p_acquisition_source: null
		}),
		supabaseAny.rpc('get_cohort_retention_curve', {
			p_from: cohortRange.from,
			p_to: cohortRange.to,
			p_entry_surface: null,
			p_acquisition_source: null
		}),
		supabaseAny.rpc('get_acquisition_mix_by_week', {
			p_from: cohortRange.from,
			p_to: cohortRange.to,
			p_entry_surface: null
		}),
		supabaseAny.rpc('get_first_session_next_paths', {
			p_from: cohortRange.from,
			p_to: cohortRange.to,
			p_entry_surface: null,
			p_limit: DEFAULT_NEXT_PATH_LIMIT,
			p_acquisition_source: null
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

	const cohortRpcErrors = [
		cohortOverviewResult.error,
		cohortRetentionResult.error,
		cohortMixResult.error,
		cohortNextPathsResult.error
	].filter(Boolean);
	const retentionAvailable =
		cohortRpcErrors.length === 0 || cohortRpcErrors.every(isMissingRetentionRpc);

	if (cohortRpcErrors.length > 0 && !cohortRpcErrors.every(isMissingRetentionRpc)) {
		console.error('Failed loading retention analytics', {
			overview: cohortOverviewResult.error,
			retention: cohortRetentionResult.error,
			acquisitionMix: cohortMixResult.error,
			nextPaths: cohortNextPathsResult.error
		});
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

	const cohortOverview = retentionAvailable
		? ((cohortOverviewResult.data ?? []) as Array<Record<string, unknown>>).map(
				(row): CohortOverviewRow => ({
					entry_surface: String(row.entry_surface ?? 'other'),
					new_visitors: toNumber(row.new_visitors),
					commented_within_d7: toNumber(row.commented_within_d7),
					comment_rate_pct: toNumber(row.comment_rate_pct),
					signed_up_within_d7: toNumber(row.signed_up_within_d7),
					signup_rate_pct: toNumber(row.signup_rate_pct),
					registered_within_d7: toNumber(row.registered_within_d7),
					registration_rate_pct: toNumber(row.registration_rate_pct),
					retained_d1: toNumber(row.retained_d1),
					retained_d1_denominator: toNumber(row.retained_d1_denominator),
					retained_d1_pct: toNumber(row.retained_d1_pct),
					retained_d7: toNumber(row.retained_d7),
					retained_d7_denominator: toNumber(row.retained_d7_denominator),
					retained_d7_pct: toNumber(row.retained_d7_pct),
					retained_d30: toNumber(row.retained_d30),
					retained_d30_denominator: toNumber(row.retained_d30_denominator),
					retained_d30_pct: toNumber(row.retained_d30_pct),
					avg_engaged_minutes_within_d7: toNumber(row.avg_engaged_minutes_within_d7)
				})
			)
		: [];

	const cohortRetention = retentionAvailable
		? ((cohortRetentionResult.data ?? []) as Array<Record<string, unknown>>).map(
				(row): CohortRetentionRow => ({
					cohort_week: String(row.cohort_week ?? ''),
					new_visitors: toNumber(row.new_visitors),
					retained_d1: toNumber(row.retained_d1),
					retained_d1_denominator: toNumber(row.retained_d1_denominator),
					retained_d1_pct: toNumber(row.retained_d1_pct),
					retained_d3: toNumber(row.retained_d3),
					retained_d3_denominator: toNumber(row.retained_d3_denominator),
					retained_d3_pct: toNumber(row.retained_d3_pct),
					retained_d7: toNumber(row.retained_d7),
					retained_d7_denominator: toNumber(row.retained_d7_denominator),
					retained_d7_pct: toNumber(row.retained_d7_pct),
					retained_d14: toNumber(row.retained_d14),
					retained_d14_denominator: toNumber(row.retained_d14_denominator),
					retained_d14_pct: toNumber(row.retained_d14_pct),
					retained_d30: toNumber(row.retained_d30),
					retained_d30_denominator: toNumber(row.retained_d30_denominator),
					retained_d30_pct: toNumber(row.retained_d30_pct)
				})
			)
		: [];

	const acquisitionMix = retentionAvailable
		? ((cohortMixResult.data ?? []) as Array<Record<string, unknown>>).map(
				(row): AcquisitionMixRow => ({
					cohort_week: String(row.cohort_week ?? ''),
					acquisition_source: String(row.acquisition_source ?? 'direct'),
					new_visitors: toNumber(row.new_visitors)
				})
			)
		: [];

	const nextPaths = retentionAvailable
		? ((cohortNextPathsResult.data ?? []) as Array<Record<string, unknown>>).map(
				(row): NextPathRow => ({
					next_path: String(row.next_path ?? ''),
					visitor_count: toNumber(row.visitor_count),
					share_pct: toNumber(row.share_pct),
					avg_engaged_ms: toNumber(row.avg_engaged_ms)
				})
			)
		: [];

	return {
		filters: {
			from: fromDate,
			to: toDate,
			scope: DEFAULT_SCOPE
		},
		cohortFilters: {
			from: cohortRange.from,
			to: cohortRange.to,
			entrySurface: '',
			acquisitionSource: ''
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
		cohorts: {
			available: retentionAvailable && cohortRpcErrors.length === 0,
			overview: cohortOverview,
			retentionCurve: cohortRetention,
			acquisitionMix,
			nextPaths
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
