// src/routes/api/admin/analytics/overview/+server.ts
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';
import { analyticsDateSchema, analyticsScopeSchema } from '$lib/validation/analyticsSchemas';

const defaultOverview = {
	total_visits: 0,
	unique_visitors: 0,
	authenticated_visits: 0,
	anonymous_visits: 0,
	avg_time_on_page_ms: 0,
	median_time_on_page_ms: 0,
	bounce_rate: 0
};

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
	const { data, error: rpcError } = await supabaseAny.rpc('get_page_analytics_overview', {
		p_from_date: fromDate,
		p_to_date: toDate,
		p_scope: scope
	});

	if (rpcError) {
		console.error('Failed to fetch analytics overview:', rpcError);
		throw error(500, 'Failed to fetch analytics overview');
	}

	const summary = {
		...defaultOverview,
		...(data ?? {})
	};

	const normalizedSummary = {
		total_visits: Number(summary.total_visits || 0),
		unique_visitors: Number(summary.unique_visitors || 0),
		authenticated_visits: Number(summary.authenticated_visits || 0),
		anonymous_visits: Number(summary.anonymous_visits || 0),
		avg_time_on_page_ms: Number(summary.avg_time_on_page_ms || 0),
		median_time_on_page_ms: Number(summary.median_time_on_page_ms || 0),
		bounce_rate: Number(summary.bounce_rate || 0)
	};

	return json({
		summary: normalizedSummary
	});
};
