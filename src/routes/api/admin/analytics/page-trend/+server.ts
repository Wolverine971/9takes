// src/routes/api/admin/analytics/page-trend/+server.ts
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';
import { analyticsDateSchema, analyticsScopeSchema } from '$lib/validation/analyticsSchemas';

interface TrendRow {
	day: string;
	visits: number;
	unique_visitors: number;
	avg_time_on_page_ms: number;
}

const querySchema = z.object({
	path: z.string().min(1).max(500)
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
		path: url.searchParams.get('path') ?? ''
	});

	if (!parsedQuery.success) {
		throw error(400, 'Invalid path');
	}

	const { path } = parsedQuery.data;
	const supabaseAny = locals.supabase as any;
	const { data, error: rpcError } = await supabaseAny.rpc('get_page_analytics_page_timeseries', {
		p_path: path,
		p_from_date: fromDate,
		p_to_date: toDate,
		p_scope: scope
	});

	if (rpcError) {
		console.error('Failed to fetch page trend:', rpcError);
		throw error(500, 'Failed to fetch page trend');
	}

	const points = ((data ?? []) as TrendRow[]).map((row) => ({
		day: String(row.day ?? ''),
		visits: Number(row.visits || 0),
		unique_visitors: Number(row.unique_visitors || 0),
		avg_time_on_page_ms: Number(row.avg_time_on_page_ms || 0)
	}));

	return json({
		path,
		points,
		summary: {
			total_visits: points.reduce((sum, point) => sum + point.visits, 0),
			active_days: points.filter((point) => point.visits > 0).length
		}
	});
};
