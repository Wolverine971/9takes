// src/routes/admin/analytics/+page.server.ts
import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import type { AnalyticsScope } from '$lib/analytics/pageAnalytics';
import {
	ADMIN_ANALYTICS_TIME_ZONE,
	getCompletedUtcWeeksRange,
	startOfUtcMonth,
	startOfUtcWeek,
	toUtcDateString
} from '$lib/analytics/adminAnalyticsDates';
import { emptyTrendingAnalyticsPayload } from '$lib/server/adminTrendingAnalytics';

interface AnalyticsOverview {
	total_visits: number;
	unique_visitors: number;
	authenticated_visits: number;
	anonymous_visits: number;
	avg_time_on_page_ms: number;
	median_time_on_page_ms: number;
	bounce_rate: number;
}

const DEFAULT_SCOPE: AnalyticsScope = 'all';
const DEFAULT_LIMIT = 50;
const DEFAULT_COHORT_WEEKS = 8;

const overviewDefaults: AnalyticsOverview = {
	total_visits: 0,
	unique_visitors: 0,
	authenticated_visits: 0,
	anonymous_visits: 0,
	avg_time_on_page_ms: 0,
	median_time_on_page_ms: 0,
	bounce_rate: 0
};

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

	if (findUserError) {
		throw error(404, { message: 'Error searching for user' });
	}

	if (!user?.admin) {
		throw redirect(307, '/questions');
	}

	const today = new Date();
	const toDate = toUtcDateString(today);
	const fromDateObj = new Date(today);
	fromDateObj.setUTCDate(fromDateObj.getUTCDate() - 29);
	const fromDate = toUtcDateString(fromDateObj);
	const weekFromDate = toUtcDateString(startOfUtcWeek(today));
	const monthFromDate = toUtcDateString(startOfUtcMonth(today));
	const cohortRange = getCompletedUtcWeeksRange(today, DEFAULT_COHORT_WEEKS);

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
		overview: overviewDefaults,
		timeseries: [],
		topPages: {
			topPagesOverTime: [],
			topPagesThisWeek: [],
			topPagesThisMonth: [],
			topPagesBySessionDuration: [],
			windows: {
				selectedFrom: fromDate,
				selectedTo: toDate,
				weekFrom: weekFromDate,
				weekTo: toDate,
				monthFrom: monthFromDate,
				monthTo: toDate
			}
		},
		trending: emptyTrendingAnalyticsPayload(),
		rows: [],
		pagination: {
			total: 0,
			page: 1,
			limit: DEFAULT_LIMIT,
			totalPages: 1
		}
	};
};
