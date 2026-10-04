// src/routes/api/admin/analytics/top-pages/+server.ts
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';
import { requireAdmin } from '$lib/server/adminAuth';
import { analyticsDateSchema, analyticsScopeSchema } from '$lib/validation/analyticsSchemas';
import { loadAnalyticsTopPages, rethrowAnalyticsQueryError } from '$lib/server/adminPageAnalytics';

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

export const GET: RequestHandler = async ({ url, locals }) => {
	await requireAdmin(locals);

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

	try {
		const payload = await loadAnalyticsTopPages(locals.supabase, {
			fromDate,
			toDate,
			scope,
			topN,
			limit,
			minVisits
		});
		return json(payload);
	} catch (err) {
		rethrowAnalyticsQueryError(err);
	}
};
