// src/routes/admin/analytics/analytics.page.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { load } from './+page.server';

describe('/admin/analytics page server load', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-04-08T12:00:00.000Z'));
	});

	it('returns only lightweight defaults during the initial page load', async () => {
		const profilesSingle = vi.fn().mockResolvedValue({
			data: { id: 'admin-user', admin: true },
			error: null
		});
		const profilesEq = vi.fn(() => ({
			single: profilesSingle
		}));
		const profilesSelect = vi.fn(() => ({
			eq: profilesEq
		}));
		const supabase = {
			from: vi.fn((table: string) => {
				if (table !== 'profiles') {
					throw new Error(`Unexpected table ${table}`);
				}

				return {
					select: profilesSelect
				};
			}),
			rpc: vi.fn()
		};

		const result = await load({
			locals: {
				session: {
					user: {
						id: 'admin-user'
					}
				},
				supabase
			}
		} as any);

		expect(supabase.from).toHaveBeenCalledWith('profiles');
		expect(profilesSelect).toHaveBeenCalledWith('id, admin');
		expect(profilesEq).toHaveBeenCalledWith('id', 'admin-user');
		expect(supabase.rpc).not.toHaveBeenCalled();
		expect(result).toEqual({
			filters: {
				from: '2026-03-10',
				to: '2026-04-08',
				scope: 'all'
			},
			cohortFilters: {
				from: '2026-02-09',
				to: '2026-04-05',
				entrySurface: '',
				acquisitionSource: ''
			},
			overview: {
				total_visits: 0,
				unique_visitors: 0,
				authenticated_visits: 0,
				anonymous_visits: 0,
				avg_time_on_page_ms: 0,
				median_time_on_page_ms: 0,
				bounce_rate: 0
			},
			timeseries: [],
			topPages: {
				topPagesOverTime: [],
				topPagesThisWeek: [],
				topPagesThisMonth: [],
				topPagesBySessionDuration: [],
				windows: {
					selectedFrom: '2026-03-10',
					selectedTo: '2026-04-08',
					weekFrom: '2026-04-06',
					weekTo: '2026-04-08',
					monthFrom: '2026-04-01',
					monthTo: '2026-04-08'
				}
			},
			rows: [],
			pagination: {
				total: 0,
				page: 1,
				limit: 50,
				totalPages: 1
			}
		});
	});
});
