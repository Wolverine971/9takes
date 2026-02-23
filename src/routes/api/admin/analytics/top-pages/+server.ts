// src/routes/api/admin/analytics/top-pages/+server.ts
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';
import { analyticsDateSchema, analyticsScopeSchema } from '$lib/validation/analyticsSchemas';

interface AnalyticsPagesRow {
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

interface AnalyticsTimeseriesByPageRow {
	day: string;
	path: string;
	path_group: string | null;
	visits: number;
}

const querySchema = z.object({
	topN: z.coerce.number().int().min(3).max(12).default(6),
	limit: z.coerce.number().int().min(3).max(20).default(8),
	minVisits: z.coerce.number().int().min(1).max(100).default(3)
});

function parseDate(value: string | null): string | undefined {
	if (!value) return undefined;
	const parsed = analyticsDateSchema.safeParse(value);
	if (!parsed.success) {
		throw error(400, `Invalid date: ${value}`);
	}
	return parsed.data;
}

function parseScope(value: string | null): z.infer<typeof analyticsScopeSchema> {
	const parsed = analyticsScopeSchema.safeParse(value ?? 'all');
	if (!parsed.success) {
		throw error(400, 'Invalid scope');
	}
	return parsed.data;
}

function toDateString(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

function fromDateString(value: string): Date {
	const [year, month, day] = value.split('-').map(Number);
	return new Date(year, month - 1, day);
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

function resolveSelectedRange(
	fromDate: string | undefined,
	toDate: string | undefined
): {
	from: string;
	to: string;
} {
	const to = toDate ?? toDateString(new Date());
	const from = (() => {
		if (fromDate) return fromDate;
		const d = fromDateString(to);
		d.setDate(d.getDate() - 29);
		return toDateString(d);
	})();

	return { from, to };
}

function normalizePageRows(rows: AnalyticsPagesRow[]): Array<Record<string, unknown>> {
	return rows.map((row) => ({
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
	}));
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

export const GET: RequestHandler = async ({ url, locals }) => {
	await assertAdmin(locals);

	const fromDate = parseDate(url.searchParams.get('from'));
	const toDate = parseDate(url.searchParams.get('to'));
	const scope = parseScope(url.searchParams.get('scope'));

	const parsedQuery = querySchema.safeParse({
		topN: url.searchParams.get('topN') ?? '6',
		limit: url.searchParams.get('limit') ?? '8',
		minVisits: url.searchParams.get('minVisits') ?? '3'
	});

	if (!parsedQuery.success) {
		throw error(400, 'Invalid top pages query parameters');
	}

	const { topN, limit, minVisits } = parsedQuery.data;
	const selectedRange = resolveSelectedRange(fromDate, toDate);

	const today = new Date();
	const todayDate = toDateString(today);
	const weekFromDate = toDateString(startOfWeek(today));
	const monthFromDate = toDateString(startOfMonth(today));

	const supabaseAny = locals.supabase as any;
	const [overTimeResult, weekResult, monthResult, durationResult] = await Promise.all([
		supabaseAny.rpc('get_page_analytics_top_pages_timeseries', {
			p_from_date: selectedRange.from,
			p_to_date: selectedRange.to,
			p_scope: scope,
			p_top_n: topN
		}),
		supabaseAny.rpc('get_page_analytics_pages', {
			p_from_date: weekFromDate,
			p_to_date: todayDate,
			p_scope: scope,
			p_search: null,
			p_limit: limit,
			p_offset: 0
		}),
		supabaseAny.rpc('get_page_analytics_pages', {
			p_from_date: monthFromDate,
			p_to_date: todayDate,
			p_scope: scope,
			p_search: null,
			p_limit: limit,
			p_offset: 0
		}),
		supabaseAny.rpc('get_page_analytics_pages_by_duration', {
			p_from_date: selectedRange.from,
			p_to_date: selectedRange.to,
			p_scope: scope,
			p_min_visits: minVisits,
			p_limit: limit
		})
	]);

	if (overTimeResult.error || weekResult.error || monthResult.error || durationResult.error) {
		console.error('Failed to fetch top pages analytics', {
			overTime: overTimeResult.error,
			week: weekResult.error,
			month: monthResult.error,
			duration: durationResult.error
		});
		throw error(500, 'Failed to fetch top pages analytics');
	}

	const topPagesOverTime = ((overTimeResult.data ?? []) as AnalyticsTimeseriesByPageRow[]).map(
		(row) => ({
			day: String(row.day ?? ''),
			path: String(row.path ?? ''),
			path_group: String(row.path_group ?? ''),
			visits: Number(row.visits || 0)
		})
	);

	const topPagesThisWeek = normalizePageRows((weekResult.data ?? []) as AnalyticsPagesRow[]);
	const topPagesThisMonth = normalizePageRows((monthResult.data ?? []) as AnalyticsPagesRow[]);
	const topPagesBySessionDuration = normalizePageRows(
		(durationResult.data ?? []) as AnalyticsPagesRow[]
	);

	return json({
		topPagesOverTime,
		topPagesThisWeek,
		topPagesThisMonth,
		topPagesBySessionDuration,
		windows: {
			selectedFrom: selectedRange.from,
			selectedTo: selectedRange.to,
			weekFrom: weekFromDate,
			weekTo: todayDate,
			monthFrom: monthFromDate,
			monthTo: todayDate
		}
	});
};
