// src/routes/api/admin/analytics/cohorts/+server.ts
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';
import { analyticsDateSchema } from '$lib/validation/analyticsSchemas';
import {
	aggregateAcquisitionMix,
	aggregateEntrySurfaceOverview,
	aggregateSourceOverview,
	aggregateWeeklyCohorts,
	type CohortFactRow
} from '$lib/server/cohortAnalytics';

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

function toDateString(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

function isMissingRetentionDependency(err: unknown): boolean {
	const message =
		typeof err === 'object' && err !== null && 'message' in err
			? String((err as { message?: unknown }).message ?? '')
			: '';

	return (
		message.includes('daily_visitor_cohorts') || message.includes('get_first_session_next_paths')
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

	const analyticsToday = toDateString(new Date());
	const entrySurface = parsedQuery.data.entrySurface.trim();
	const acquisitionSource = entrySurface ? parsedQuery.data.acquisitionSource.trim() : '';
	const nextPathLimit = parsedQuery.data.nextPathLimit;
	const supabaseAny = locals.supabase as any;
	let cohortFactsQuery = locals.supabase
		.from('daily_visitor_cohorts')
		.select(
			'cohort_date, entry_surface, acquisition_source, cohort_size, commented_within_d7, signed_up_within_d7, registered_within_d7, retained_d1, retained_d3, retained_d7, retained_d14, retained_d30, engaged_ms_total_within_d7'
		)
		.order('cohort_date', { ascending: true });

	if (fromDate) {
		cohortFactsQuery = cohortFactsQuery.gte('cohort_date', fromDate);
	}
	if (toDate) {
		cohortFactsQuery = cohortFactsQuery.lte('cohort_date', toDate);
	}

	const [cohortFactsResult, nextPathsResult] = await Promise.all([
		cohortFactsQuery,
		supabaseAny.rpc('get_first_session_next_paths', {
			p_from: fromDate,
			p_to: toDate,
			p_entry_surface: entrySurface || null,
			p_limit: nextPathLimit,
			p_acquisition_source: acquisitionSource || null
		})
	]);

	if (cohortFactsResult.error) {
		if (isMissingRetentionDependency(cohortFactsResult.error)) {
			return json({
				available: false,
				anchorDate: analyticsToday,
				overview: [],
				weeklyCohorts: [],
				acquisitionMix: [],
				sourceOverview: [],
				nextPaths: []
			});
		}
		console.error('Failed to fetch cohort analytics', {
			cohortFacts: cohortFactsResult.error
		});
		throw error(500, 'Failed to fetch cohort analytics');
	}

	if (nextPathsResult.error) {
		console.warn('Failed to fetch cohort next paths', {
			nextPaths: nextPathsResult.error
		});
	}

	const cohortFacts = ((cohortFactsResult.data ?? []) as Array<Record<string, unknown>>).map(
		(row): CohortFactRow => ({
			cohort_date: String(row.cohort_date ?? ''),
			entry_surface: String(row.entry_surface ?? 'other'),
			acquisition_source: String(row.acquisition_source ?? 'direct'),
			cohort_size: toNumber(row.cohort_size),
			commented_within_d7: toNumber(row.commented_within_d7),
			signed_up_within_d7: toNumber(row.signed_up_within_d7),
			registered_within_d7: toNumber(row.registered_within_d7),
			retained_d1: toNumber(row.retained_d1),
			retained_d3: toNumber(row.retained_d3),
			retained_d7: toNumber(row.retained_d7),
			retained_d14: toNumber(row.retained_d14),
			retained_d30: toNumber(row.retained_d30),
			engaged_ms_total_within_d7: toNumber(row.engaged_ms_total_within_d7)
		})
	);

	return json({
		available: true,
		anchorDate: analyticsToday,
		overview: aggregateEntrySurfaceOverview(cohortFacts, analyticsToday),
		weeklyCohorts: aggregateWeeklyCohorts(cohortFacts, analyticsToday, {
			entrySurface: entrySurface || undefined,
			acquisitionSource: acquisitionSource || undefined
		}),
		acquisitionMix: aggregateAcquisitionMix(cohortFacts, entrySurface),
		sourceOverview: aggregateSourceOverview(cohortFacts, analyticsToday, entrySurface),
		nextPaths: nextPathsResult.error
			? []
			: ((nextPathsResult.data ?? []) as Array<Record<string, unknown>>).map((row) => ({
					next_path: String(row.next_path ?? ''),
					visitor_count: toNumber(row.visitor_count),
					share_pct: toNumber(row.share_pct),
					avg_engaged_ms: toNumber(row.avg_engaged_ms)
				}))
	});
};
