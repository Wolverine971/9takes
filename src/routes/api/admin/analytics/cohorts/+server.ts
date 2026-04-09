// src/routes/api/admin/analytics/cohorts/+server.ts
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';
import { analyticsDateSchema } from '$lib/validation/analyticsSchemas';
import { filterOverviewByEntrySurface } from '$lib/server/retentionAnalytics';

const querySchema = z.object({
	entrySurface: z.string().max(50).optional().default(''),
	acquisitionSource: z.string().max(120).optional().default(''),
	nextPathLimit: z.coerce.number().int().min(1).max(50).default(12)
});

function parseDate(value: string | null): string | undefined {
	if (!value) return undefined;
	const parsed = analyticsDateSchema.safeParse(value);
	if (!parsed.success) {
		throw error(400, `Invalid date: ${value}`);
	}
	return parsed.data;
}

function toNumber(value: unknown): number {
	return Number(value || 0);
}

function isMissingRetentionRpc(err: unknown): boolean {
	const message =
		typeof err === 'object' && err !== null && 'message' in err
			? String((err as { message?: unknown }).message ?? '')
			: '';

	return (
		message.includes('get_entry_surface_overview') ||
		message.includes('get_cohort_retention_curve') ||
		message.includes('get_acquisition_mix_by_week') ||
		message.includes('get_first_session_next_paths')
	);
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
		entrySurface: url.searchParams.get('entrySurface') ?? '',
		acquisitionSource: url.searchParams.get('acquisitionSource') ?? '',
		nextPathLimit: url.searchParams.get('nextPathLimit') ?? '12'
	});

	if (!parsedQuery.success) {
		throw error(400, 'Invalid cohort query parameters');
	}

	const { entrySurface, acquisitionSource, nextPathLimit } = parsedQuery.data;
	const supabaseAny = locals.supabase as any;
	const [overviewResult, retentionResult, mixResult, nextPathsResult] = await Promise.all([
		supabaseAny.rpc('get_entry_surface_overview', {
			p_from: fromDate,
			p_to: toDate,
			p_acquisition_source: acquisitionSource || null
		}),
		supabaseAny.rpc('get_cohort_retention_curve', {
			p_from: fromDate,
			p_to: toDate,
			p_entry_surface: entrySurface || null,
			p_acquisition_source: acquisitionSource || null
		}),
		supabaseAny.rpc('get_acquisition_mix_by_week', {
			p_from: fromDate,
			p_to: toDate,
			p_entry_surface: entrySurface || null
		}),
		supabaseAny.rpc('get_first_session_next_paths', {
			p_from: fromDate,
			p_to: toDate,
			p_entry_surface: entrySurface || null,
			p_limit: nextPathLimit,
			p_acquisition_source: acquisitionSource || null
		})
	]);

	const errors = [
		overviewResult.error,
		retentionResult.error,
		mixResult.error,
		nextPathsResult.error
	].filter(Boolean);

	if (errors.length > 0) {
		if (errors.every(isMissingRetentionRpc)) {
			return json({
				available: false,
				overview: [],
				retentionCurve: [],
				acquisitionMix: [],
				nextPaths: []
			});
		}

		console.error('Failed to fetch cohort analytics', {
			overview: overviewResult.error,
			retention: retentionResult.error,
			acquisitionMix: mixResult.error,
			nextPaths: nextPathsResult.error
		});
		throw error(500, 'Failed to fetch cohort analytics');
	}

	const overviewRows = ((overviewResult.data ?? []) as Array<Record<string, unknown>>).map(
		(row) => ({
			entry_surface: String(row.entry_surface ?? 'other'),
			new_visitors: toNumber(row.new_visitors),
			commented_within_d7: toNumber(row.commented_within_d7),
			comment_rate_pct: toNumber(row.comment_rate_pct),
			signed_up_within_d7: toNumber(row.signed_up_within_d7),
			signup_rate_pct: toNumber(row.signup_rate_pct),
			registered_within_d7: toNumber(row.registered_within_d7),
			registration_rate_pct: toNumber(row.registration_rate_pct),
			retained_d1: toNumber(row.retained_d1),
			retained_d1_denominator: toNumber(row.retained_d1_denominator),
			retained_d1_pct: toNumber(row.retained_d1_pct),
			retained_d7: toNumber(row.retained_d7),
			retained_d7_denominator: toNumber(row.retained_d7_denominator),
			retained_d7_pct: toNumber(row.retained_d7_pct),
			retained_d30: toNumber(row.retained_d30),
			retained_d30_denominator: toNumber(row.retained_d30_denominator),
			retained_d30_pct: toNumber(row.retained_d30_pct),
			avg_engaged_minutes_within_d7: toNumber(row.avg_engaged_minutes_within_d7)
		})
	);

	return json({
		available: true,
		overview: filterOverviewByEntrySurface(overviewRows, entrySurface),
		retentionCurve: ((retentionResult.data ?? []) as Array<Record<string, unknown>>).map((row) => ({
			cohort_week: String(row.cohort_week ?? ''),
			new_visitors: toNumber(row.new_visitors),
			retained_d1: toNumber(row.retained_d1),
			retained_d1_denominator: toNumber(row.retained_d1_denominator),
			retained_d1_pct: toNumber(row.retained_d1_pct),
			retained_d3: toNumber(row.retained_d3),
			retained_d3_denominator: toNumber(row.retained_d3_denominator),
			retained_d3_pct: toNumber(row.retained_d3_pct),
			retained_d7: toNumber(row.retained_d7),
			retained_d7_denominator: toNumber(row.retained_d7_denominator),
			retained_d7_pct: toNumber(row.retained_d7_pct),
			retained_d14: toNumber(row.retained_d14),
			retained_d14_denominator: toNumber(row.retained_d14_denominator),
			retained_d14_pct: toNumber(row.retained_d14_pct),
			retained_d30: toNumber(row.retained_d30),
			retained_d30_denominator: toNumber(row.retained_d30_denominator),
			retained_d30_pct: toNumber(row.retained_d30_pct)
		})),
		acquisitionMix: ((mixResult.data ?? []) as Array<Record<string, unknown>>).map((row) => ({
			cohort_week: String(row.cohort_week ?? ''),
			acquisition_source: String(row.acquisition_source ?? 'direct'),
			new_visitors: toNumber(row.new_visitors)
		})),
		nextPaths: ((nextPathsResult.data ?? []) as Array<Record<string, unknown>>).map((row) => ({
			next_path: String(row.next_path ?? ''),
			visitor_count: toNumber(row.visitor_count),
			share_pct: toNumber(row.share_pct),
			avg_engaged_ms: toNumber(row.avg_engaged_ms)
		}))
	});
};
