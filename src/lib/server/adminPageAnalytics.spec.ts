// src/lib/server/adminPageAnalytics.spec.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$lib/server/analyticsPageLastModified', () => ({
	primeAnalyticsLastModifiedIndex: vi.fn(),
	attachAnalyticsLastModified: vi.fn(async (_supabase: unknown, rows: Array<{ path: string }>) =>
		rows.map((row) => ({ ...row, last_modified_at: null }))
	)
}));

import {
	AdminAnalyticsQueryError,
	loadAnalyticsOverview,
	loadAnalyticsPages,
	rethrowAnalyticsQueryError
} from './adminPageAnalytics';
import { primeAnalyticsLastModifiedIndex } from '$lib/server/analyticsPageLastModified';

type RpcResult = { data: unknown; error: unknown };

function createSupabase(handler: (fn: string, args: Record<string, unknown>) => RpcResult) {
	return {
		rpc: vi.fn(async (fn: string, args: Record<string, unknown>) => handler(fn, args))
	} as any;
}

const pageRow = {
	path: '/how-to-guides/example',
	path_group: '/how-to-guides/[slug]',
	content_type: null,
	visits: '4',
	unique_visitors: 3,
	authenticated_visits: 0,
	anonymous_visits: 4,
	avg_time_on_page_ms: 1000,
	median_time_on_page_ms: 900,
	bounce_rate: 25,
	total_rows: 61
};

const baseQuery = {
	fromDate: '2026-03-10',
	toDate: '2026-04-08',
	scope: 'all' as const,
	page: 2,
	limit: 20,
	search: 'guide',
	sortBy: 'visits',
	sortDir: 'asc' as const
};

describe('adminPageAnalytics', () => {
	let consoleError: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		vi.clearAllMocks();
		consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		consoleError.mockRestore();
	});

	it('loads a custom date range page and primes the last-modified index', async () => {
		const supabase = createSupabase(() => ({ data: [pageRow], error: null }));

		const payload = await loadAnalyticsPages(supabase, baseQuery);

		expect(primeAnalyticsLastModifiedIndex).toHaveBeenCalledTimes(1);
		expect(supabase.rpc).toHaveBeenCalledWith('get_page_analytics_pages_sorted', {
			p_from_date: '2026-03-10',
			p_to_date: '2026-04-08',
			p_scope: 'all',
			p_search: 'guide',
			p_limit: 20,
			p_offset: 20,
			p_sort_by: 'visits',
			p_sort_dir: 'asc'
		});
		expect(payload.rows).toEqual([
			{ ...pageRow, content_type: 'other', visits: 4, last_modified_at: null }
		]);
		expect(payload.pagination).toEqual({ total: 61, page: 2, limit: 20, totalPages: 4 });
		expect(payload.window).toEqual({
			key: 'custom',
			from: '2026-03-10',
			to: '2026-04-08',
			label: '2026-03-10 - 2026-04-08'
		});
	});

	it('falls back to the date RPC when the windowed RPC is not deployed', async () => {
		const supabase = createSupabase((fn) =>
			fn === 'get_page_analytics_pages_sorted_windowed'
				? {
						data: null,
						error: { message: 'function public.get_page_analytics_pages_sorted_windowed missing' }
					}
				: { data: [pageRow], error: null }
		);

		const payload = await loadAnalyticsPages(supabase, {
			...baseQuery,
			toDate: '2026-04-01',
			window: '7d'
		});

		expect(supabase.rpc).toHaveBeenLastCalledWith(
			'get_page_analytics_pages_sorted',
			expect.objectContaining({ p_from_date: '2026-03-25', p_to_date: '2026-04-01' })
		);
		expect(payload.window).toMatchObject({
			key: '7d',
			from: '2026-03-25',
			to: '2026-04-01',
			fromTs: '2026-03-25T23:59:59.999Z',
			toTs: '2026-04-01T23:59:59.999Z',
			label: 'Last 7 Days'
		});
		expect(payload.rows).toHaveLength(1);
	});

	it('logs and throws a query error that endpoints map to an HTTP 500', async () => {
		const supabase = createSupabase(() => ({ data: null, error: { message: 'boom' } }));

		const failure = await loadAnalyticsOverview(supabase, {
			fromDate: '2026-03-10',
			toDate: '2026-04-08',
			scope: 'all'
		}).catch((err: unknown) => err);

		expect(failure).toBeInstanceOf(AdminAnalyticsQueryError);
		expect(consoleError).toHaveBeenCalledWith('Failed to fetch analytics overview:', {
			message: 'boom'
		});

		let httpError: unknown;
		try {
			rethrowAnalyticsQueryError(failure);
		} catch (err) {
			httpError = err;
		}
		expect(httpError).toMatchObject({
			status: 500,
			body: { message: 'Failed to fetch analytics overview' }
		});

		const unexpected = new TypeError('unexpected');
		expect(() => rethrowAnalyticsQueryError(unexpected)).toThrow(unexpected);
	});
});
