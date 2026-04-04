// src/routes/api/admin/analytics/pages/+server.ts
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';
import { analyticsDateSchema, analyticsScopeSchema } from '$lib/validation/analyticsSchemas';
import { attachAnalyticsLastModified } from '$lib/server/analyticsPageLastModified';

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
	total_rows: number;
}

type PageBreakdownWindow = '24h' | '7d' | '14d' | '30d' | '90d';

interface WindowBounds {
	fromTs: string;
	toTs: string;
	fromDate: string;
	toDate: string;
	label: string;
}

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

const querySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(200).default(50),
	search: z.string().max(200).optional().default(''),
	sortBy: z
		.enum([
			'path',
			'path_group',
			'content_type',
			'visits',
			'unique_visitors',
			'authenticated_visits',
			'anonymous_visits',
			'avg_time_on_page_ms',
			'median_time_on_page_ms',
			'bounce_rate'
		])
		.default('visits'),
	sortDir: z.enum(['asc', 'desc']).default('desc'),
	window: z.enum(['24h', '7d', '14d', '30d', '90d']).optional()
});

function parseDate(value: string | null): string | undefined {
	if (!value) return undefined;
	const parsed = analyticsDateSchema.safeParse(value);
	if (!parsed.success) {
		throw error(400, `Invalid date: ${value}`);
	}
	return parsed.data;
}

function toDateString(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

function endOfDay(date: string): Date {
	return new Date(`${date}T23:59:59.999`);
}

function getWindowBounds(window: PageBreakdownWindow, anchorDate?: string): WindowBounds {
	const now = new Date();
	const today = toDateString(now);
	const to = anchorDate && anchorDate !== today ? endOfDay(anchorDate) : now;
	const from = new Date(to.getTime() - pageBreakdownWindowHours[window] * 60 * 60 * 1000);

	return {
		fromTs: from.toISOString(),
		toTs: to.toISOString(),
		fromDate: toDateString(from),
		toDate: toDateString(to),
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

function parseScope(value: string | null): z.infer<typeof analyticsScopeSchema> {
	const parsed = analyticsScopeSchema.safeParse(value ?? 'all');
	if (!parsed.success) {
		throw error(400, 'Invalid scope');
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

export const GET: RequestHandler = async ({ url, locals }) => {
	await assertAdmin(locals);

	const fromDate = parseDate(url.searchParams.get('from'));
	const toDate = parseDate(url.searchParams.get('to'));
	const scope = parseScope(url.searchParams.get('scope'));
	const parsedQuery = querySchema.safeParse({
		page: url.searchParams.get('page') ?? '1',
		limit: url.searchParams.get('limit') ?? '50',
		search: url.searchParams.get('search') ?? '',
		sortBy: url.searchParams.get('sortBy') ?? 'visits',
		sortDir: url.searchParams.get('sortDir') ?? 'desc',
		window: url.searchParams.get('window') ?? undefined
	});

	if (!parsedQuery.success) {
		throw error(400, 'Invalid pagination parameters');
	}

	const { page, limit, search, sortBy, sortDir, window } = parsedQuery.data;
	const offset = (page - 1) * limit;

	const supabaseAny = locals.supabase as any;
	let data: AnalyticsPagesRow[] | null = null;
	let rpcError: unknown = null;
	let windowMeta: {
		key: PageBreakdownWindow | 'custom';
		from: string;
		to: string;
		fromTs?: string;
		toTs?: string;
		label: string;
	};

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

		const windowedResult = await supabaseAny.rpc('get_page_analytics_pages_sorted_windowed', {
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
			const fallbackResult = await supabaseAny.rpc('get_page_analytics_pages_sorted', {
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

		const rangeResult = await supabaseAny.rpc('get_page_analytics_pages_sorted', {
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
		console.error('Failed to fetch analytics pages:', rpcError);
		throw error(500, 'Failed to fetch analytics pages');
	}

	const rows = ((data ?? []) as AnalyticsPagesRow[]).map((row) => ({
		path: row.path ?? '',
		path_group: row.path_group ?? '',
		content_type: row.content_type ?? 'other',
		visits: Number(row.visits || 0),
		unique_visitors: Number(row.unique_visitors || 0),
		authenticated_visits: Number(row.authenticated_visits || 0),
		anonymous_visits: Number(row.anonymous_visits || 0),
		avg_time_on_page_ms: Number(row.avg_time_on_page_ms || 0),
		median_time_on_page_ms: Number(row.median_time_on_page_ms || 0),
		bounce_rate: Number(row.bounce_rate || 0),
		total_rows: Number(row.total_rows || 0)
	}));
	const rowsWithLastModified = await attachAnalyticsLastModified(locals.supabase, rows);

	const total =
		rowsWithLastModified.length > 0 ? Number(rowsWithLastModified[0].total_rows || 0) : 0;

	return json({
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
	});
};
