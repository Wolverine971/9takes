// src/routes/api/admin/analytics/cohorts/cohorts.server.spec.ts
import { describe, expect, it, vi } from 'vitest';

import { GET } from './+server';

interface SupabaseResult {
	data: unknown;
	error: unknown;
}

type RpcStubs = Partial<Record<string, SupabaseResult>>;

function createAdminProfileQuery() {
	const single = vi.fn().mockResolvedValue({
		data: { admin: true },
		error: null
	});
	const eq = vi.fn(() => ({ single }));
	const select = vi.fn(() => ({ eq }));

	return { select, eq, single };
}

function createSupabase(rpcStubs: RpcStubs) {
	const adminProfileQuery = createAdminProfileQuery();
	const rpc = vi.fn((name: string) => {
		const result = rpcStubs[name] ?? { data: [], error: null };
		return Promise.resolve(result);
	});
	const from = vi.fn((table: string) => {
		if (table === 'profiles') return adminProfileQuery;
		throw new Error(`Unexpected table: ${table}`);
	});

	return { from, rpc };
}

const overviewRow = {
	entry_surface: 'people',
	new_visitors: 20,
	commented_within_d7: 6,
	comment_rate_denominator: 20,
	comment_rate_pct: 30,
	signed_up_within_d7: 5,
	signup_rate_denominator: 20,
	signup_rate_pct: 25,
	registered_within_d7: 4,
	registration_rate_denominator: 20,
	registration_rate_pct: 20,
	retained_d1: 8,
	retained_d1_denominator: 20,
	retained_d1_pct: 40,
	retained_d7: 6,
	retained_d7_denominator: 20,
	retained_d7_pct: 30,
	retained_d30: 0,
	retained_d30_denominator: 0,
	retained_d30_pct: 0,
	avg_engaged_minutes_within_d7: 3
};

const retentionRow = {
	cohort_week: '2026-03-23',
	cohort_week_end: '2026-03-29',
	new_visitors: 20,
	commented_within_d7: 6,
	comment_rate_denominator: 20,
	comment_rate_pct: 30,
	signed_up_within_d7: 5,
	signup_rate_denominator: 20,
	signup_rate_pct: 25,
	registered_within_d7: 4,
	registration_rate_denominator: 20,
	registration_rate_pct: 20,
	retained_d1: 8,
	retained_d1_denominator: 20,
	retained_d1_pct: 40,
	is_mature_d1: true,
	retained_d3: 7,
	retained_d3_denominator: 20,
	retained_d3_pct: 35,
	is_mature_d3: true,
	retained_d7: 6,
	retained_d7_denominator: 20,
	retained_d7_pct: 30,
	is_mature_d7: true,
	retained_d14: 0,
	retained_d14_denominator: 0,
	retained_d14_pct: 0,
	is_mature_d14: false,
	retained_d30: 0,
	retained_d30_denominator: 0,
	retained_d30_pct: 0,
	is_mature_d30: false,
	avg_engaged_minutes_within_d7: 3,
	is_mature_within_d7: true
};

const mixRow = {
	cohort_week: '2026-03-23',
	acquisition_source: 'search/google',
	new_visitors: 20
};

describe('/api/admin/analytics/cohorts', () => {
	it('passes RPC results through and returns available cohort analytics', async () => {
		const supabase = createSupabase({
			get_entry_surface_overview: { data: [overviewRow], error: null },
			get_cohort_retention_curve: { data: [retentionRow], error: null },
			get_acquisition_mix_by_week: { data: [mixRow], error: null },
			get_first_session_next_paths: {
				data: [
					{
						next_path: '/questions',
						visitor_count: 12,
						share_pct: 60,
						avg_engaged_ms: 24000
					}
				],
				error: null
			}
		});

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
		expect(body.overview).toEqual([overviewRow]);
		expect(body.weeklyCohorts).toEqual([retentionRow]);
		expect(body.acquisitionMix).toEqual([mixRow]);
		expect(body.sourceOverview).toEqual([]);
		expect(body.nextPaths).toEqual([
			{
				next_path: '/questions',
				visitor_count: 12,
				share_pct: 60,
				avg_engaged_ms: 24000
			}
		]);
		expect(supabase.rpc).not.toHaveBeenCalledWith('get_source_overview', expect.anything());
	});

	it('calls get_source_overview when entry surface is selected', async () => {
		const sourceRow = {
			acquisition_source: 'search/google',
			new_visitors: 20,
			commented_within_d7: 6,
			comment_rate_denominator: 20,
			comment_rate_pct: 30,
			signed_up_within_d7: 5,
			signup_rate_denominator: 20,
			signup_rate_pct: 25,
			registered_within_d7: 4,
			registration_rate_denominator: 20,
			registration_rate_pct: 20,
			retained_d7: 6,
			retained_d7_denominator: 20,
			retained_d7_pct: 30,
			avg_engaged_minutes_within_d7: 3
		};

		const supabase = createSupabase({
			get_entry_surface_overview: { data: [overviewRow], error: null },
			get_cohort_retention_curve: { data: [retentionRow], error: null },
			get_acquisition_mix_by_week: { data: [mixRow], error: null },
			get_source_overview: { data: [sourceRow], error: null },
			get_first_session_next_paths: { data: [], error: null }
		});

		const response = await GET({
			url: new URL(
				'https://9takes.test/api/admin/analytics/cohorts?from=2026-02-23&to=2026-04-19&entrySurface=people'
			),
			locals: {
				session: { user: { id: 'admin-user' } },
				supabase
			}
		} as any);
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(body.sourceOverview).toEqual([sourceRow]);
		expect(supabase.rpc).toHaveBeenCalledWith('get_source_overview', {
			p_from: '2026-02-23',
			p_to: '2026-04-19',
			p_entry_surface: 'people'
		});
	});

	it('keeps cohort analytics available when next-path RPC fails', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
		const supabase = createSupabase({
			get_entry_surface_overview: { data: [overviewRow], error: null },
			get_cohort_retention_curve: { data: [retentionRow], error: null },
			get_acquisition_mix_by_week: { data: [mixRow], error: null },
			get_first_session_next_paths: {
				data: null,
				error: {
					message: 'function public.get_first_session_next_paths does not exist'
				}
			}
		});

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
		expect(body.overview).toEqual([overviewRow]);
		expect(body.nextPaths).toEqual([]);
		expect(warn).toHaveBeenCalledWith('Failed to fetch cohort next paths', {
			nextPaths: {
				message: 'function public.get_first_session_next_paths does not exist'
			}
		});

		warn.mockRestore();
	});

	it('marks retention analytics unavailable when the cohort table is missing', async () => {
		const supabase = createSupabase({
			get_entry_surface_overview: {
				data: null,
				error: { message: 'relation "public.daily_visitor_cohorts" does not exist' }
			},
			get_cohort_retention_curve: { data: [], error: null },
			get_acquisition_mix_by_week: { data: [], error: null },
			get_first_session_next_paths: { data: [], error: null }
		});

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
