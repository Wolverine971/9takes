// src/routes/admin/analytics/+page.server.ts
import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import type { AnalyticsScope } from '$lib/analytics/pageAnalytics';

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
	const toDate = toDateString(today);
	const fromDateObj = new Date(today);
	fromDateObj.setDate(fromDateObj.getDate() - 29);
	const fromDate = toDateString(fromDateObj);
	const weekFromDate = toDateString(startOfWeek(today));
	const monthFromDate = toDateString(startOfMonth(today));
	const cohortRange = getCompletedWeeksRange(today, DEFAULT_COHORT_WEEKS);

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
		rows: [],
		pagination: {
			total: 0,
			page: 1,
			limit: DEFAULT_LIMIT,
			totalPages: 1
		}
	};
};
