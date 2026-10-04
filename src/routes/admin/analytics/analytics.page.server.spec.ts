// src/routes/admin/analytics/analytics.page.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$lib/server/analyticsPageLastModified', () => ({
	primeAnalyticsLastModifiedIndex: vi.fn(),
	attachAnalyticsLastModified: vi.fn(async (_supabase: unknown, rows: Array<{ path: string }>) =>
		rows.map((row) => ({ ...row, last_modified_at: '2026-04-01' }))
	)
}));

import { load } from './+page.server';

type RpcResult = { data: unknown; error: unknown };

function deferred<T>() {
	let resolve!: (value: T) => void;
	let reject!: (reason: unknown) => void;
	const promise = new Promise<T>((nextResolve, nextReject) => {
		resolve = nextResolve;
		reject = nextReject;
	});
	return { promise, resolve, reject };
}

const flushIo = () => new Promise<void>((resolve) => setImmediate(resolve));

const rpcData: Record<string, unknown> = {
	get_page_analytics_overview: {
		total_visits: '120',
		unique_visitors: 80,
		authenticated_visits: 20,
		anonymous_visits: 100,
		avg_time_on_page_ms: 45000,
		median_time_on_page_ms: 30000,
		bounce_rate: 52.5
	},
	get_page_analytics_timeseries: [
		{
			day: '2026-04-08',
			visits: 12,
			unique_visitors: 9,
			authenticated_visits: 2,
			anonymous_visits: 10,
			avg_time_on_page_ms: 40000
		}
	],
	get_page_analytics_pages_sorted_windowed: [
		{
			path: '/personality-analysis/taylor-swift',
			path_group: '/personality-analysis/[slug]',
			content_type: 'people',
			visits: 30,
			unique_visitors: 25,
			authenticated_visits: 1,
			anonymous_visits: 29,
			avg_time_on_page_ms: 60000,
			median_time_on_page_ms: 50000,
			bounce_rate: 40,
			total_rows: 120
		}
	],
	get_page_analytics_top_pages_timeseries: [
		{ day: '2026-04-08', path: '/questions', path_group: '/questions', visits: 7 }
	],
	get_page_analytics_pages: [],
	get_page_analytics_pages_by_duration: [],
	get_page_analytics_trending_pages: []
};

function createSupabase(results: Record<string, RpcResult> = {}) {
	return {
		rpc: vi.fn(async (fn: string): Promise<RpcResult> => {
			return results[fn] ?? { data: rpcData[fn] ?? null, error: null };
		}),
		from: vi.fn(() => {
			throw new Error('The page load should not query tables directly');
		})
	};
}

function createEvent(
	supabase: ReturnType<typeof createSupabase>,
	parent: () => Promise<unknown>,
	isDataRequest = true
) {
	return {
		locals: {
			session: { user: { id: 'admin-user' } },
			supabase
		},
		isDataRequest,
		depends: vi.fn(),
		parent: vi.fn(parent)
	} as any;
}

describe('/admin/analytics page server load', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.useFakeTimers({ toFake: ['Date'] });
		vi.setSystemTime(new Date('2026-04-08T12:00:00.000Z'));
	});

	it('starts the default view queries on data requests once the guard passes and streams them', async () => {
		const supabase = createSupabase();
		const guard = deferred<Record<string, unknown>>();
		const event = createEvent(supabase, () => guard.promise);

		const pending = load(event);

		// Nothing starts until the admin guard passes.
		await flushIo();
		expect(event.parent).toHaveBeenCalledTimes(1);
		expect(supabase.rpc).not.toHaveBeenCalled();

		guard.resolve({});
		const result = (await pending) as any;
		// vi.waitFor would advance the faked Date while polling; drain pending work instead.
		await flushIo();
		expect(supabase.rpc).toHaveBeenCalledTimes(8);

		const range = { p_from_date: '2026-03-10', p_to_date: '2026-04-08', p_scope: 'all' };
		expect(supabase.rpc).toHaveBeenCalledWith('get_page_analytics_overview', range);
		expect(supabase.rpc).toHaveBeenCalledWith('get_page_analytics_timeseries', range);
		expect(supabase.rpc).toHaveBeenCalledWith('get_page_analytics_pages_sorted_windowed', {
			p_from_ts: '2026-03-09T12:00:00.000Z',
			p_to_ts: '2026-04-08T12:00:00.000Z',
			p_scope: 'all',
			p_search: null,
			p_limit: 50,
			p_offset: 0,
			p_sort_by: 'visits',
			p_sort_dir: 'desc'
		});
		expect(supabase.rpc).toHaveBeenCalledWith('get_page_analytics_top_pages_timeseries', {
			...range,
			p_top_n: 10
		});
		expect(supabase.rpc).toHaveBeenCalledWith(
			'get_page_analytics_pages',
			expect.objectContaining({ p_scope: 'all', p_limit: 8, p_offset: 0 })
		);
		expect(supabase.rpc).toHaveBeenCalledWith('get_page_analytics_pages_by_duration', {
			...range,
			p_min_visits: 3,
			p_limit: 8
		});
		expect(supabase.rpc).toHaveBeenCalledWith('get_page_analytics_trending_pages', {
			p_anchor_ts: null,
			p_baseline_days: 7,
			p_scope: 'all',
			p_min_visits: 3,
			p_min_unique: 3,
			p_limit: 20
		});

		expect(result.filters).toEqual({
			from: '2026-03-10',
			to: '2026-04-08',
			scope: 'all',
			timeZone: 'UTC'
		});
		expect(result.cohortFilters).toEqual({
			from: '2026-02-09',
			to: '2026-04-05',
			entrySurface: '',
			acquisitionSource: ''
		});

		await expect(result.initialOverview).resolves.toEqual({
			summary: {
				total_visits: 120,
				unique_visitors: 80,
				authenticated_visits: 20,
				anonymous_visits: 100,
				avg_time_on_page_ms: 45000,
				median_time_on_page_ms: 30000,
				bounce_rate: 52.5
			},
			points: rpcData.get_page_analytics_timeseries
		});
		await expect(result.initialPages).resolves.toEqual({
			rows: [
				{
					...(rpcData.get_page_analytics_pages_sorted_windowed as unknown[])[0]!,
					last_modified_at: '2026-04-01'
				}
			],
			pagination: { total: 120, page: 1, limit: 50, totalPages: 3 },
			sorting: { sortBy: 'visits', sortDir: 'desc' },
			window: {
				key: '30d',
				from: '2026-03-09',
				to: '2026-04-08',
				fromTs: '2026-03-09T12:00:00.000Z',
				toTs: '2026-04-08T12:00:00.000Z',
				label: 'Last 30 Days'
			}
		});
		await expect(result.initialTopPages).resolves.toMatchObject({
			topPagesOverTime: rpcData.get_page_analytics_top_pages_timeseries,
			topPagesThisWeek: [],
			topPagesThisMonth: [],
			topPagesBySessionDuration: [],
			windows: { selectedFrom: '2026-03-10', selectedTo: '2026-04-08' }
		});
		await expect(result.initialTrending).resolves.toMatchObject({
			available: true,
			generatedAt: '2026-04-08T12:00:00.000Z',
			baselineDays: 7,
			minVisits: 3,
			minUnique: 3,
			rows: []
		});
	});

	it('sends only the shell on a full page load, where streamed scripts would break CSP', async () => {
		const supabase = createSupabase();
		const event = createEvent(supabase, async () => ({}), false);

		const result = (await load(event)) as any;

		expect(event.depends).toHaveBeenCalledWith('admin:analytics-pageviews');
		expect(event.parent).toHaveBeenCalledTimes(1);
		expect(supabase.rpc).not.toHaveBeenCalled();
		expect(result).toMatchObject({
			filters: { from: '2026-03-10', to: '2026-04-08', scope: 'all', timeZone: 'UTC' },
			initialOverview: null,
			initialPages: null,
			initialTopPages: null,
			initialTrending: null
		});
	});

	it('streams null for a section whose query fails so the page can fetch it itself', async () => {
		const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
		const supabase = createSupabase({
			get_page_analytics_pages_sorted_windowed: { data: null, error: { message: 'timeout' } }
		});

		const result = (await load(createEvent(supabase, async () => ({})))) as any;

		await expect(result.initialPages).resolves.toBeNull();
		await expect(result.initialOverview).resolves.not.toBeNull();
		await expect(result.initialTopPages).resolves.not.toBeNull();
		await expect(result.initialTrending).resolves.not.toBeNull();
		expect(consoleError).toHaveBeenCalledWith('Failed to fetch analytics pages:', {
			message: 'timeout'
		});
		consoleError.mockRestore();
	});

	it('rejects when the admin guard does, before starting any query', async () => {
		const supabase = createSupabase();
		const guardError = { status: 302, location: '/' };

		await expect(
			load(
				createEvent(supabase, async () => {
					throw guardError;
				})
			)
		).rejects.toBe(guardError);
		expect(supabase.rpc).not.toHaveBeenCalled();
	});

	it('redirects signed-out requests before starting any query', async () => {
		const supabase = createSupabase();
		const event = createEvent(supabase, async () => ({}));
		event.locals.session = null;

		await expect(load(event)).rejects.toMatchObject({ status: 302, location: '/questions' });
		expect(supabase.rpc).not.toHaveBeenCalled();
		expect(event.parent).not.toHaveBeenCalled();
	});
});
