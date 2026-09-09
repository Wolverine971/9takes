// src/routes/questions/curatedReveal.page.server.spec.ts
//
// /questions/[slug] load: one newest-first snapshot for browser ranking, the
// next-starter nudge, and the give-first rule that boosted human takes never
// travel before the visitor answers.
import { beforeEach, describe, expect, it, vi } from 'vitest';

type Call = { method: string; args: unknown[] };
type Resolver = (table: string, calls: Call[]) => unknown;

const state = vi.hoisted(() => ({
	resolver: null as
		null | ((table: string, calls: { method: string; args: unknown[] }[]) => unknown),
	rpcMock: vi.fn(),
	checkDemoTimeMock: vi.fn()
}));

function chain(table: string): any {
	const calls: Call[] = [];
	const proxy: any = new Proxy(
		{},
		{
			get(_, prop) {
				if (prop === 'then') {
					const result = state.resolver
						? state.resolver(table, calls)
						: { data: null, error: null };
					return (resolve: (value: unknown) => void, reject: (reason: unknown) => void) =>
						Promise.resolve(result).then(resolve, reject);
				}
				return (...args: unknown[]) => {
					calls.push({ method: String(prop), args });
					return proxy;
				};
			}
		}
	);
	return proxy;
}

vi.mock('$lib/supabase', () => ({
	supabase: {
		rpc: state.rpcMock,
		from: (table: string) => chain(table)
	}
}));

vi.mock('$lib/server/supabaseAdmin', () => ({
	getSupabaseAdminClient: () => ({ rpc: state.rpcMock, from: (table: string) => chain(table) })
}));

vi.mock('$lib/server/giveFirstFunnel', () => ({ recordGiveFirstEvent: vi.fn() }));
vi.mock('$lib/server/bestEffortTelemetry', () => ({
	logBestEffortTelemetryFailure: vi.fn(),
	runBestEffortTelemetry: vi.fn()
}));
vi.mock('../../utils/api', () => ({ checkDemoTime: state.checkDemoTimeMock }));
vi.mock('../../utils/demo', () => ({ mapDemoValues: (value: unknown) => value }));

import { load } from './[slug]/+page.server';

const QUESTION = {
	id: 118,
	question: 'what were you like as a kid in 3 words',
	question_formatted: 'What were you like as a kid, in three words?',
	url: 'kid-in-3-words',
	context: null,
	data: {},
	author_id: null,
	created_at: '2025-01-01T00:00:00.000Z',
	updated_at: '2025-01-01T00:00:00.000Z',
	comment_count: 38,
	es_id: null,
	img_url: null,
	subscriptions: []
};

const comment = (id: number, extra: Record<string, unknown> = {}) => ({
	id,
	comment: `take ${id}`,
	author_id: null,
	parent_id: 118,
	parent_type: 'question',
	comment_count: 0,
	created_at: `2026-01-${String((id % 27) + 1).padStart(2, '0')}T00:00:00.000Z`,
	modified_at: null,
	like_count: 0,
	profiles: null,
	comment_like: [],
	...extra
});

const has = (calls: Call[], method: string, firstArg?: unknown) =>
	calls.some(
		(call) => call.method === method && (firstArg === undefined || call.args[0] === firstArg)
	);

function buildResolver(options: {
	curation?: { starter_rank: number | null; pinned_comment_ids: number[] } | 'missing';
	pinnedRows?: unknown[];
	nextStarter?: unknown;
	newest?: unknown[];
}): Resolver {
	return (table, calls) => {
		if (table === 'questions') {
			if (has(calls, 'select', 'starter_rank, pinned_comment_ids')) {
				if (options.curation === 'missing') {
					return { data: null, error: { message: 'column "starter_rank" does not exist' } };
				}
				return { data: options.curation ?? null, error: null };
			}
			if (has(calls, 'gt')) {
				return { data: options.nextStarter ?? null, error: null };
			}
			return { data: QUESTION, error: null };
		}
		if (table === 'comments') {
			if (has(calls, 'in')) {
				return { data: options.pinnedRows ?? [], error: null };
			}
			const removedFilter = calls.find(
				(call) => call.method === 'eq' && call.args[0] === 'removed'
			);
			if (removedFilter?.args[1] === true) {
				return { data: [], count: 0, error: null };
			}
			const newest = options.newest ?? [];
			return { data: newest, count: newest.length, error: null };
		}
		if (table === 'question_category_tags') return { data: [], error: null };
		if (table === 'links') return { data: [], count: 0, error: null };
		if (table === 'comments_ai') return { data: [], error: null };
		if (table === 'flag_reasons') return { data: [], error: null };
		return { data: null, error: null };
	};
}

function buildEvent(answered: boolean) {
	state.rpcMock.mockImplementation(async (name: string) => {
		if (name === 'can_see_comments_3') return { data: answered, error: null };
		if (name === 'get_question_take_data') {
			const page = state.resolver?.('comments', [
				{ method: 'eq', args: ['removed', false] }
			]) as any;
			return {
				data: { takes: page?.data ?? [], own_takes: [], total_count: page?.count ?? 0 },
				error: null
			};
		}
		return { data: null, error: null };
	});

	return {
		params: { slug: 'kid-in-3-words' },
		parent: async () => ({ demo_time: false }),
		url: new URL('http://localhost/questions/kid-in-3-words'),
		cookies: { get: vi.fn(() => 'visitor-1'), delete: vi.fn() },
		locals: {
			session: null,
			supabase: { rpc: state.rpcMock, from: (table: string) => chain(table) }
		}
	};
}

describe('/questions/[slug] load: curated reveal', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		state.checkDemoTimeMock.mockResolvedValue(false);
	});

	it.each([true, false])(
		'preserves the gate without a visitor cookie (signed in: %s)',
		async (signedIn) => {
			state.resolver = buildResolver({ newest: [comment(1)] });
			const event: any = buildEvent(signedIn);
			event.cookies.get = () => undefined;
			event.locals.session = signedIn ? { user: { id: 'reader' } } : null;
			const result = (await load(event)) as any;
			const gateCall = state.rpcMock.mock.calls.find(([name]) => name === 'can_see_comments_3');
			expect(JSON.parse(JSON.stringify(gateCall?.[1]))).toEqual({
				questionid: 118,
				userid: signedIn ? 'reader' : null,
				userfingerprint: null
			});
			expect(result.flags.userHasAnswered).toBe(signedIn);
			expect(result.comments).toEqual(signedIn ? [comment(1)] : []);
		}
	);

	it('sends one newest-first snapshot plus boost IDs for browser ranking and returns the next starter', async () => {
		const newest = [comment(1000), comment(661), comment(999), comment(375)];
		state.resolver = buildResolver({
			curation: { starter_rank: 1, pinned_comment_ids: [375, 372, 661] },
			// Fetch order is not display order: the DB hands them back shuffled.
			pinnedRows: [comment(661), comment(375), comment(372)],
			nextStarter: {
				id: 119,
				question: 'if you had to be trapped somewhere',
				question_formatted: 'If you had to be trapped somewhere, where?',
				url: 'trapped-somewhere',
				starter_rank: 2
			},
			newest
		});

		const result = (await load(buildEvent(true) as any)) as any;

		expect(result.flags.userHasAnswered).toBe(true);
		expect(result.starterRank).toBe(1);
		expect(result.nextStarter).toEqual({
			id: 119,
			url: 'trapped-somewhere',
			question: 'If you had to be trapped somewhere, where?',
			starter_rank: 2
		});
		expect(result.comments.map((row: { id: number }) => row.id)).toEqual([1000, 661, 999, 375]);
		expect(result.pinnedCommentIds).toEqual([375, 372, 661]);
		expect(state.rpcMock).toHaveBeenCalledWith(
			'get_question_take_data',
			expect.objectContaining({ p_limit: 100, p_question_id: 118 })
		);
		expect(
			state.rpcMock.mock.calls.filter(([name]) => name === 'get_question_take_data')
		).toHaveLength(1);
		expect(result.pinnedComments).toBeUndefined();
		expect(result.comment_count).toBe(4);
	});

	it('drops boosted ids the database no longer returns (removed or moved)', async () => {
		state.resolver = buildResolver({
			curation: { starter_rank: 5, pinned_comment_ids: [702, 703, 719] },
			pinnedRows: [comment(719), comment(702)],
			nextStarter: null,
			newest: [comment(702)]
		});

		const result = (await load(buildEvent(true) as any)) as any;

		expect(result.comments.map((row: { id: number }) => row.id)).toEqual([702]);
		expect(result.nextStarter).toBeNull();
		expect(result.starterRank).toBe(5);
	});

	it('never sends boosted human takes before the visitor answers (give-first)', async () => {
		const fetchedTables: string[] = [];
		const base = buildResolver({
			curation: { starter_rank: 1, pinned_comment_ids: [375, 372, 661] },
			pinnedRows: [comment(375), comment(372), comment(661)],
			nextStarter: { id: 119, question: 'q', question_formatted: '', url: 'next', starter_rank: 2 }
		});
		state.resolver = (table, calls) => {
			if (table === 'comments' && has(calls, 'in')) fetchedTables.push('pinned');
			return base(table, calls);
		};

		const result = (await load(buildEvent(false) as any)) as any;

		expect(result.flags.userHasAnswered).toBe(false);
		expect(result.comments).toEqual([]);
		expect(state.rpcMock.mock.calls.some(([name]) => name === 'get_question_take_data')).toBe(
			false
		);
		expect(result.ownComments).toBeUndefined();
		expect(fetchedTables).toEqual([]);
		// The nudge target is safe to preload: it is a question, not an answer.
		expect(result.nextStarter?.url).toBe('next');
		expect(result.starterRank).toBe(1);
	});

	it('behaves exactly as before when the curation columns are not there yet', async () => {
		state.resolver = buildResolver({
			curation: 'missing',
			newest: [comment(1), comment(2)]
		});

		const result = (await load(buildEvent(true) as any)) as any;

		expect(result.starterRank).toBeNull();
		expect(result.nextStarter).toBeNull();
		expect(result.comments).toHaveLength(2);
	});
});
