// src/routes/api/admin/analytics/releases/+server.ts
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';
import { analyticsDateSchema } from '$lib/validation/analyticsSchemas';

interface ReleasePerformanceRow {
	id: number;
	slug: string;
	path: string;
	title: string;
	published_at: string | null;
	first_view_at: string | null;
	minutes_to_first_view: number | null;
	views_1h: number;
	views_6h: number;
	views_24h: number;
	unique_24h: number;
	views_7d: number;
	unique_7d: number;
	views_30d: number;
	unique_30d: number;
	total_views: number;
	total_unique_visitors: number;
	avg_time_on_page_ms: number;
	median_time_on_page_ms: number;
	avg_scroll_pct: number;
	bounce_rate: number;
	views_24h_percentile: number | null;
	views_7d_percentile: number | null;
	views_30d_percentile: number | null;
	benchmark_score: number | null;
	benchmark_sample_size: number;
	benchmark_basis: string;
	performance_band: string;
	release_stage: string;
	growth_slope_7d: number | null;
	decay_rate_after_spike: number | null;
}

const querySchema = z.object({
	limit: z.coerce.number().int().min(1).max(200).default(50)
});

function parseDate(value: string | null): string | undefined {
	if (!value) return undefined;
	const parsed = analyticsDateSchema.safeParse(value);
	if (!parsed.success) {
		throw error(400, `Invalid date: ${value}`);
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
	const parsedQuery = querySchema.safeParse({
		limit: url.searchParams.get('limit') ?? '50'
	});

	if (!parsedQuery.success) {
		throw error(400, 'Invalid release analytics query parameters');
	}

	const supabaseAny = locals.supabase as any;
	const { data, error: rpcError } = await supabaseAny.rpc('get_content_release_performance', {
		p_from_date: fromDate,
		p_to_date: toDate,
		p_limit: parsedQuery.data.limit
	});

	if (rpcError) {
		console.error('Failed to fetch release performance analytics:', rpcError);
		throw error(500, 'Failed to fetch release performance analytics');
	}

	const rows = ((data ?? []) as ReleasePerformanceRow[]).map((row) => ({
		id: Number(row.id || 0),
		slug: String(row.slug ?? ''),
		path: String(row.path ?? ''),
		title: String(row.title ?? ''),
		published_at: row.published_at ? String(row.published_at) : null,
		first_view_at: row.first_view_at ? String(row.first_view_at) : null,
		minutes_to_first_view:
			row.minutes_to_first_view === null || row.minutes_to_first_view === undefined
				? null
				: Number(row.minutes_to_first_view),
		views_1h: Number(row.views_1h || 0),
		views_6h: Number(row.views_6h || 0),
		views_24h: Number(row.views_24h || 0),
		unique_24h: Number(row.unique_24h || 0),
		views_7d: Number(row.views_7d || 0),
		unique_7d: Number(row.unique_7d || 0),
		views_30d: Number(row.views_30d || 0),
		unique_30d: Number(row.unique_30d || 0),
		total_views: Number(row.total_views || 0),
		total_unique_visitors: Number(row.total_unique_visitors || 0),
		avg_time_on_page_ms: Number(row.avg_time_on_page_ms || 0),
		median_time_on_page_ms: Number(row.median_time_on_page_ms || 0),
		avg_scroll_pct: Number(row.avg_scroll_pct || 0),
		bounce_rate: Number(row.bounce_rate || 0),
		views_24h_percentile:
			row.views_24h_percentile === null || row.views_24h_percentile === undefined
				? null
				: Number(row.views_24h_percentile),
		views_7d_percentile:
			row.views_7d_percentile === null || row.views_7d_percentile === undefined
				? null
				: Number(row.views_7d_percentile),
		views_30d_percentile:
			row.views_30d_percentile === null || row.views_30d_percentile === undefined
				? null
				: Number(row.views_30d_percentile),
		benchmark_score:
			row.benchmark_score === null || row.benchmark_score === undefined
				? null
				: Number(row.benchmark_score),
		benchmark_sample_size: Number(row.benchmark_sample_size || 0),
		benchmark_basis: String(row.benchmark_basis ?? 'insufficient_history'),
		performance_band: String(row.performance_band ?? 'insufficient_history'),
		release_stage: String(row.release_stage ?? 'mature'),
		growth_slope_7d:
			row.growth_slope_7d === null || row.growth_slope_7d === undefined
				? null
				: Number(row.growth_slope_7d),
		decay_rate_after_spike:
			row.decay_rate_after_spike === null || row.decay_rate_after_spike === undefined
				? null
				: Number(row.decay_rate_after_spike)
	}));

	return json({
		rows,
		summary: {
			total_releases: rows.length,
			above_norm: rows.filter((row) => row.performance_band === 'above_norm').length,
			below_norm: rows.filter((row) => row.performance_band === 'below_norm').length,
			collecting: rows.filter((row) => row.performance_band === 'collecting').length,
			benchmarked: rows.filter((row) => row.benchmark_score !== null).length
		}
	});
};
