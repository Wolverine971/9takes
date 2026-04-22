// src/routes/api/admin/analytics/cohorts/cohorts.server.spec.ts
import { describe, expect, it, vi } from 'vitest';

import { GET } from './+server';

interface SupabaseResult {
	data: unknown;
	error: unknown;
}

function createAdminProfileQuery() {
	const single = vi.fn().mockResolvedValue({
		data: { admin: true },
		error: null
	});
	const eq = vi.fn(() => ({ single }));
	const select = vi.fn(() => ({ eq }));

	return { select, eq, single };
}

function createCohortFactsQuery(result: SupabaseResult) {
	const builder: Record<string, unknown> = {};
	builder.select = vi.fn(() => builder);
	builder.order = vi.fn(() => builder);
	builder.gte = vi.fn(() => builder);
	builder.lte = vi.fn(() => builder);
	builder.then = (
		onFulfilled?: (value: SupabaseResult) => unknown,
		onRejected?: (reason: unknown) => unknown
	) => Promise.resolve(result).then(onFulfilled as any, onRejected as any);

	return builder;
}

function createSupabase(cohortResult: SupabaseResult, nextPathsResult: SupabaseResult) {
	const adminProfileQuery = createAdminProfileQuery();
	const cohortFactsQuery = createCohortFactsQuery(cohortResult);
	const rpc = vi.fn().mockResolvedValue(nextPathsResult);
	const from = vi.fn((table: string) => {
		if (table === 'profiles') return adminProfileQuery;
		if (table === 'daily_visitor_cohorts') return cohortFactsQuery;
		throw new Error(`Unexpected table: ${table}`);
	});

	return { from, rpc };
}

const cohortFactRow = {
	cohort_date: '2026-03-23',
	entry_surface: 'people',
	acquisition_source: 'search/google',
	cohort_size: 20,
	commented_within_d7: 6,
	signed_up_within_d7: 5,
	registered_within_d7: 4,
	retained_d1: 8,
	retained_d3: 7,
	retained_d7: 6,
	retained_d14: 5,
	retained_d30: 3,
	engaged_ms_total_within_d7: 3600000
};

describe('/api/admin/analytics/cohorts', () => {
	it('keeps cohort analytics available when next-path analytics fails', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
		const supabase = createSupabase(
			{ data: [cohortFactRow], error: null },
			{
				data: null,
				error: {
					message: 'function public.get_first_session_next_paths does not exist'
				}
			}
		);

		const response = await GET({
			url: new URL(
				'https://9takes.test/api/admin/analytics/cohorts?from=2026-02-23&to=2026-04-19&nextPathLimit=12'
			),
			locals: {
				session: { user: { id: 'admin-user' } },
				supabase
			}
		} as any);
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(body.available).toBe(true);
		expect(body.overview[0]).toMatchObject({
			entry_surface: 'people',
			new_visitors: 20
		});
		expect(body.nextPaths).toEqual([]);
		expect(warn).toHaveBeenCalledWith('Failed to fetch cohort next paths', {
			nextPaths: {
				message: 'function public.get_first_session_next_paths does not exist'
			}
		});

		warn.mockRestore();
	});

	it('marks retention analytics unavailable when the cohort table is missing', async () => {
		const supabase = createSupabase(
			{
				data: null,
				error: {
					message: 'relation "public.daily_visitor_cohorts" does not exist'
				}
			},
			{ data: [], error: null }
		);

		const response = await GET({
			url: new URL(
				'https://9takes.test/api/admin/analytics/cohorts?from=2026-02-23&to=2026-04-19&nextPathLimit=12'
			),
			locals: {
				session: { user: { id: 'admin-user' } },
				supabase
			}
		} as any);
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(body).toMatchObject({
			available: false,
			overview: [],
			weeklyCohorts: [],
			acquisitionMix: [],
			sourceOverview: [],
			nextPaths: []
		});
	});
});
