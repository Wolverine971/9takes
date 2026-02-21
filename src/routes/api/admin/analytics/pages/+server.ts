// src/routes/api/admin/analytics/pages/+server.ts
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
	total_rows: number;
}

const querySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(200).default(50),
	search: z.string().max(200).optional().default('')
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
		search: url.searchParams.get('search') ?? ''
	});

	if (!parsedQuery.success) {
		throw error(400, 'Invalid pagination parameters');
	}

	const { page, limit, search } = parsedQuery.data;
	const offset = (page - 1) * limit;

	const supabaseAny = locals.supabase as any;
	const { data, error: rpcError } = await supabaseAny.rpc('get_page_analytics_pages', {
		p_from_date: fromDate,
		p_to_date: toDate,
		p_scope: scope,
		p_search: search || null,
		p_limit: limit,
		p_offset: offset
	});

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

	const total = rows.length > 0 ? Number(rows[0].total_rows || 0) : 0;

	return json({
		rows,
		pagination: {
			total,
			page,
			limit,
			totalPages: Math.max(1, Math.ceil(total / limit))
		}
	});
};
