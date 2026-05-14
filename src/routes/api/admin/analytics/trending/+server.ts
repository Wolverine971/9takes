// src/routes/api/admin/analytics/trending/+server.ts
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';
import { analyticsScopeSchema } from '$lib/validation/analyticsSchemas';
import { requireAdmin } from '$lib/server/adminAuth';
import {
	DEFAULT_TRENDING_BASELINE_DAYS,
	DEFAULT_TRENDING_LIMIT,
	DEFAULT_TRENDING_MIN_UNIQUE,
	DEFAULT_TRENDING_MIN_VISITS,
	getTrendingOptions,
	loadTrendingAnalytics
} from '$lib/server/adminTrendingAnalytics';

const querySchema = z.object({
	baselineDays: z.coerce.number().int().min(1).max(30).default(DEFAULT_TRENDING_BASELINE_DAYS),
	minVisits: z.coerce.number().int().min(1).max(200).default(DEFAULT_TRENDING_MIN_VISITS),
	minUnique: z.coerce.number().int().min(1).max(200).default(DEFAULT_TRENDING_MIN_UNIQUE),
	limit: z.coerce.number().int().min(1).max(100).default(DEFAULT_TRENDING_LIMIT),
	anchorTs: z.string().datetime().optional()
});

function parseScope(value: string | null): z.infer<typeof analyticsScopeSchema> {
	const parsed = analyticsScopeSchema.safeParse(value ?? 'all');
	if (!parsed.success) {
		throw error(400, 'Invalid scope');
	}
	return parsed.data;
}

export const GET: RequestHandler = async ({ url, locals }) => {
	const { supabase } = await requireAdmin(locals);
	const scope = parseScope(url.searchParams.get('scope'));
	const parsedQuery = querySchema.safeParse({
		baselineDays: url.searchParams.get('baselineDays') ?? undefined,
		minVisits: url.searchParams.get('minVisits') ?? undefined,
		minUnique: url.searchParams.get('minUnique') ?? undefined,
		limit: url.searchParams.get('limit') ?? undefined,
		anchorTs: url.searchParams.get('anchorTs') ?? undefined
	});

	if (!parsedQuery.success) {
		throw error(400, 'Invalid trending analytics query parameters');
	}

	const { baselineDays, minVisits, minUnique, limit, anchorTs } = parsedQuery.data;
	const now = anchorTs ? new Date(anchorTs) : new Date();
	const options = getTrendingOptions({
		baselineDays,
		minVisits,
		minUnique,
		limit,
		now
	});

	try {
		const payload = await loadTrendingAnalytics(supabase as any, {
			...options,
			scope,
			anchorTs: anchorTs ?? null
		});
		return json(payload);
	} catch (rpcError) {
		console.error('Failed to fetch trending analytics:', rpcError);
		throw error(500, 'Failed to fetch trending analytics');
	}
};
