// src/routes/api/admin/analytics/timeseries/+server.ts
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';
import { requireAdmin } from '$lib/server/adminAuth';
import { analyticsDateSchema, analyticsScopeSchema } from '$lib/validation/analyticsSchemas';
import {
	loadAnalyticsTimeseries,
	rethrowAnalyticsQueryError
} from '$lib/server/adminPageAnalytics';

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

	try {
		const points = await loadAnalyticsTimeseries(locals.supabase, { fromDate, toDate, scope });
		return json({ points });
	} catch (err) {
		rethrowAnalyticsQueryError(err);
	}
};
