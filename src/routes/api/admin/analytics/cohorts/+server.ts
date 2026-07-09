// src/routes/api/admin/analytics/cohorts/+server.ts
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';
import { requireAdmin } from '$lib/server/adminAuth';
import { analyticsDateSchema } from '$lib/validation/analyticsSchemas';

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
		message.includes('daily_visitor_cohorts') ||
		message.includes('get_entry_surface_overview') ||
		message.includes('get_cohort_retention_curve') ||
		message.includes('get_acquisition_mix_by_week') ||
		message.includes('get_source_overview') ||
		message.includes('get_first_session_next_paths')
	);
}

const EMPTY_RESPONSE = {
	available: false,
	overview: [] as unknown[],
	weeklyCohorts: [] as unknown[],
	acquisitionMix: [] as unknown[],
	sourceOverview: [] as unknown[],
	nextPaths: [] as unknown[]
};

export const GET: RequestHandler = async ({ url, locals }) => {
	await requireAdmin(locals);

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

	const [overviewRes, retentionRes, mixRes, sourceRes, nextPathsRes] = await Promise.all([
		supabaseAny.rpc('get_entry_surface_overview', {
			p_from: fromDate ?? null,
			p_to: toDate ?? null,
			p_acquisition_source: acquisitionSource || null
		}),
		supabaseAny.rpc('get_cohort_retention_curve', {
			p_from: fromDate ?? null,
			p_to: toDate ?? null,
			p_entry_surface: entrySurface || null,
			p_acquisition_source: acquisitionSource || null
		}),
		supabaseAny.rpc('get_acquisition_mix_by_week', {
			p_from: fromDate ?? null,
			p_to: toDate ?? null,
			p_entry_surface: entrySurface || null
		}),
		entrySurface
			? supabaseAny.rpc('get_source_overview', {
					p_from: fromDate ?? null,
					p_to: toDate ?? null,
					p_entry_surface: entrySurface
				})
			: Promise.resolve({ data: [], error: null }),
		supabaseAny.rpc('get_first_session_next_paths', {
			p_from: fromDate ?? null,
			p_to: toDate ?? null,
			p_entry_surface: entrySurface || null,
			p_limit: nextPathLimit,
			p_acquisition_source: acquisitionSource || null
		})
	]);

	for (const res of [overviewRes, retentionRes, mixRes, sourceRes]) {
		if (res.error) {
			if (isMissingRetentionDependency(res.error)) {
				return json({ ...EMPTY_RESPONSE, anchorDate: analyticsToday });
			}
			console.error('Failed to fetch cohort analytics', res.error);
			throw error(500, 'Failed to fetch cohort analytics');
		}
	}

	if (nextPathsRes.error) {
		console.warn('Failed to fetch cohort next paths', {
			nextPaths: nextPathsRes.error
		});
	}

	const nextPaths = nextPathsRes.error
		? []
		: ((nextPathsRes.data ?? []) as Array<Record<string, unknown>>).map((row) => ({
				next_path: String(row.next_path ?? ''),
				visitor_count: toNumber(row.visitor_count),
				share_pct: toNumber(row.share_pct),
				avg_engaged_ms: toNumber(row.avg_engaged_ms)
			}));

	return json({
		available: true,
		anchorDate: analyticsToday,
		overview: overviewRes.data ?? [],
		weeklyCohorts: retentionRes.data ?? [],
		acquisitionMix: mixRes.data ?? [],
		sourceOverview: sourceRes.data ?? [],
		nextPaths
	});
};
