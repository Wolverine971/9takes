// src/routes/admin/analytics/+page.server.ts
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import type { AnalyticsScope } from '$lib/analytics/pageAnalytics';
import {
	ADMIN_ANALYTICS_TIME_ZONE,
	getCompletedUtcWeeksRange,
	toUtcDateString
} from '$lib/analytics/adminAnalyticsDates';
import {
	AdminAnalyticsQueryError,
	loadAnalyticsOverview,
	loadAnalyticsPages,
	loadAnalyticsTimeseries,
	loadAnalyticsTopPages
} from '$lib/server/adminPageAnalytics';
import {
	DEFAULT_TRENDING_BASELINE_DAYS,
	DEFAULT_TRENDING_LIMIT,
	DEFAULT_TRENDING_MIN_UNIQUE,
	DEFAULT_TRENDING_MIN_VISITS,
	getTrendingOptions,
	loadTrendingAnalytics
} from '$lib/server/adminTrendingAnalytics';

// Must match the invalidate() call in +page.svelte.
const PAGEVIEWS_DEPENDENCY = 'admin:analytics-pageviews';

const DEFAULT_SCOPE: AnalyticsScope = 'all';
const DEFAULT_LIMIT = 50;
const DEFAULT_COHORT_WEEKS = 8;
const DEFAULT_TOP_PAGES_TOP_N = 10;
const DEFAULT_TOP_PAGES_LIMIT = 8;
const DEFAULT_TOP_PAGES_MIN_VISITS = 3;

/**
 * Resolve to null instead of rejecting. A streamed section that fails falls back to the
 * page's own client fetch, and a promise orphaned by a failed guard can't surface as an
 * unhandled rejection.
 */
function settle<T>(promise: Promise<T>, label: string): Promise<T | null> {
	return promise.catch((err) => {
		// Query helpers already logged their own failures.
		if (!(err instanceof AdminAnalyticsQueryError)) {
			console.error(`Failed to load ${label} for /admin/analytics:`, err);
		}
		return null;
	});
}

/**
 * Start the default view's queries with the parameters the page's client fetches send for
 * the default filters. Each promise resolves to what that section's endpoint returns.
 */
function startDefaultPageviewQueries(
	supabase: App.Locals['supabase'],
	range: { fromDate: string; toDate: string; scope: AnalyticsScope },
	now: Date
) {
	return {
		overview: settle(
			Promise.all([
				loadAnalyticsOverview(supabase, range),
				loadAnalyticsTimeseries(supabase, range)
			]).then(([summary, points]) => ({ summary, points })),
			'overview'
		),
		pages: settle(
			loadAnalyticsPages(supabase, {
				...range,
				page: 1,
				limit: DEFAULT_LIMIT,
				search: '',
				sortBy: 'visits',
				sortDir: 'desc',
				window: '30d'
			}),
			'page breakdown'
		),
		topPages: settle(
			loadAnalyticsTopPages(supabase, {
				...range,
				topN: DEFAULT_TOP_PAGES_TOP_N,
				limit: DEFAULT_TOP_PAGES_LIMIT,
				minVisits: DEFAULT_TOP_PAGES_MIN_VISITS
			}),
			'top pages'
		),
		trending: settle(
			loadTrendingAnalytics(supabase, {
				...getTrendingOptions({
					baselineDays: DEFAULT_TRENDING_BASELINE_DAYS,
					minVisits: DEFAULT_TRENDING_MIN_VISITS,
					minUnique: DEFAULT_TRENDING_MIN_UNIQUE,
					limit: DEFAULT_TRENDING_LIMIT,
					now
				}),
				scope: DEFAULT_SCOPE,
				anchorTs: null
			}),
			'trending pages'
		)
	};
}

export const load: PageServerLoad = async (event) => {
	event.depends(PAGEVIEWS_DEPENDENCY);

	// Local check only (no network), so signed-out requests never start the queries below.
	if (!event.locals.session?.user?.id) {
		throw redirect(302, '/questions');
	}

	const today = new Date();
	const toDate = toUtcDateString(today);
	const fromDateObj = new Date(today);
	fromDateObj.setUTCDate(fromDateObj.getUTCDate() - 29);
	const fromDate = toUtcDateString(fromDateObj);
	const cohortRange = getCompletedUtcWeeksRange(today, DEFAULT_COHORT_WEEKS);

	// The admin layout is the guard. Awaiting parent() makes SvelteKit run it even when a
	// crafted __data.json request marks the layouts as not invalidated. It runs before the
	// queries start so a signed-in non-admin can't trigger the heavy aggregates.
	await event.parent();

	// The default view's queries (0.2-2s RPCs) stream in behind the page shell. On a full page
	// load SvelteKit would stream them as inline <script> chunks, which csp.mode 'hash' can't
	// cover (the header is already sent), so the browser would drop them. Full loads send the
	// shell without them and the page re-requests them through invalidate(), which streams over
	// __data.json.
	const queries = event.isDataRequest
		? startDefaultPageviewQueries(
				event.locals.supabase,
				{ fromDate, toDate, scope: DEFAULT_SCOPE },
				today
			)
		: null;

	return {
		filters: {
			from: fromDate,
			to: toDate,
			scope: DEFAULT_SCOPE,
			timeZone: ADMIN_ANALYTICS_TIME_ZONE
		},
		cohortFilters: {
			from: cohortRange.from,
			to: cohortRange.to,
			entrySurface: '',
			acquisitionSource: ''
		},
		// Streamed on data requests, null on full loads. Each resolves to the payload its
		// /api/admin/analytics endpoint returns, or null when the query failed (the page then
		// fetches that section itself).
		initialOverview: queries?.overview ?? null,
		initialPages: queries?.pages ?? null,
		initialTopPages: queries?.topPages ?? null,
		initialTrending: queries?.trending ?? null
	};
};
