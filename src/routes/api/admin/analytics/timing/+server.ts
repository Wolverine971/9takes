// src/routes/api/admin/analytics/timing/+server.ts
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';
import { analyticsDateSchema, analyticsScopeSchema } from '$lib/validation/analyticsSchemas';

interface TimingHeatmapRow {
	local_dow: number;
	local_hour: number;
	visits: number;
	unique_visitors: number;
	avg_time_on_page_ms: number;
}

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

	const supabaseAny = locals.supabase as any;
	const { data, error: rpcError } = await supabaseAny.rpc('get_page_analytics_timing_heatmap', {
		p_from_date: fromDate,
		p_to_date: toDate,
		p_scope: scope
	});

	if (rpcError) {
		console.error('Failed to fetch timing analytics:', rpcError);
		throw error(500, 'Failed to fetch timing analytics');
	}

	const rows = ((data ?? []) as TimingHeatmapRow[]).map((row) => ({
		local_dow: Number(row.local_dow || 0),
		local_hour: Number(row.local_hour || 0),
		visits: Number(row.visits || 0),
		unique_visitors: Number(row.unique_visitors || 0),
		avg_time_on_page_ms: Number(row.avg_time_on_page_ms || 0)
	}));

	return json({
		rows,
		summary: {
			total_visits: rows.reduce((sum, row) => sum + row.visits, 0),
			total_unique_slots: rows.filter((row) => row.visits > 0).length
		}
	});
};
