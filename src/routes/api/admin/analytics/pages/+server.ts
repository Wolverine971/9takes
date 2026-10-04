// src/routes/api/admin/analytics/pages/+server.ts
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';
import { requireAdmin } from '$lib/server/adminAuth';
import { analyticsDateSchema, analyticsScopeSchema } from '$lib/validation/analyticsSchemas';
import { loadAnalyticsPages, rethrowAnalyticsQueryError } from '$lib/server/adminPageAnalytics';

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

	try {
		const payload = await loadAnalyticsPages(locals.supabase, {
			fromDate,
			toDate,
			scope,
			page,
			limit,
			search,
			sortBy,
			sortDir,
			window
		});
		return json(payload);
	} catch (err) {
		rethrowAnalyticsQueryError(err);
	}
};
