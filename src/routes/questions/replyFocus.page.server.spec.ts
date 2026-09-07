// src/routes/questions/replyFocus.page.server.spec.ts
//
// /questions/[slug]?reply=<id>: the signed-in reply-notification email lands
// on the actual reply. The server resolves the reply's parent take on this
// question and pre-loads that take's replies so #comment-box{replyId} exists
// on first paint. Anything that does not line up is ignored silently.
import { beforeEach, describe, expect, it, vi } from 'vitest';

type Call = { method: string; args: unknown[] };

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
	supabase: { rpc: state.rpcMock, from: (table: string) => chain(table) }
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

const QUESTION_ID = 42;
const OTHER_QUESTION_ID = 43;

const QUESTION = {
	id: QUESTION_ID,
	question: 'what helps you feel understood',
	question_formatted: 'What helps you feel understood?',
	url: 'what-helps-you-feel-understood',
	context: null,
	data: {},
	author_id: null,
	created_at: '2025-01-01T00:00:00.000Z',
	updated_at: '2025-01-01T00:00:00.000Z',
	comment_count: 3,
	es_id: null,
	img_url: null,
	subscriptions: []
};

type Row = {
	id: number;
	comment: string;
	parent_id: number;
	parent_type: 'question' | 'comment';
	removed: boolean;
	comment_count: number;
};

/** A tiny in-memory comments table the proxy chain filters against. */
function buildResolver(rows: Row[]) {
	return (table: string, calls: Call[]) => {
		if (table === 'questions') return { data: QUESTION, error: null };
		if (table === 'question_category_tags') return { data: [], error: null };
		if (table === 'links') return { data: [], count: 0, error: null };
		if (table === 'comments_ai') return { data: [], error: null };
		if (table === 'flag_reasons') return { data: [], error: null };
		if (table !== 'comments') return { data: null, error: null };

		let matched = rows;
		for (const call of calls) {
			if (call.method === 'eq') {
				const [column, value] = call.args as [keyof Row, unknown];
				matched = matched.filter((row) => row[column] === value);
			}
			if (call.method === 'in') {
				const [column, values] = call.args as [keyof Row, unknown[]];
				matched = matched.filter((row) => values.includes(row[column]));
			}
		}
		const single = calls.some((call) => call.method === 'maybeSingle');
		const data = single ? (matched[0] ?? null) : matched;
		return { data, count: matched.length, error: null };
	};
}

function buildEvent(search: string, answered = true) {
	state.rpcMock.mockImplementation(async (name: string) => {
		if (name === 'can_see_comments_3') return { data: answered, error: null };
		return { data: null, error: null };
	});
	return {
		params: { slug: QUESTION.url },
		parent: async () => ({ demo_time: false }),
		url: new URL(`http://localhost/questions/${QUESTION.url}${search}`),
		cookies: { get: vi.fn(() => 'visitor-1'), delete: vi.fn() },
		locals: {
			session: { user: { id: 'user-1', email: 'u@example.com', aud: 'authenticated' } },
			supabase: { rpc: state.rpcMock, from: (table: string) => chain(table) }
		}
	};
}

const take = (id: number, questionId = QUESTION_ID, extra: Partial<Row> = {}): Row => ({
	id,
	comment: `take ${id}`,
	parent_id: questionId,
	parent_type: 'question',
	removed: false,
	comment_count: 0,
	...extra
});
const reply = (id: number, parentId: number, extra: Partial<Row> = {}): Row => ({
	id,
	comment: `reply ${id}`,
	parent_id: parentId,
	parent_type: 'comment',
	removed: false,
	comment_count: 0,
	...extra
});

describe('/questions/[slug]?reply=<id> resolution', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		state.checkDemoTimeMock.mockResolvedValue(false);
	});

	it('resolves a valid reply to its parent take with replies pre-loaded', async () => {
		state.resolver = buildResolver([
			take(100, QUESTION_ID, { comment_count: 2 }),
			take(200),
			reply(900, 100),
			reply(901, 100),
			reply(902, 200)
		]);

		const result = (await load(buildEvent('?reply=901') as any)) as any;

		expect(result.replyFocus).not.toBeNull();
		expect(result.replyFocus.replyId).toBe(901);
		expect(result.replyFocus.parent.id).toBe(100);
		expect(result.replyFocus.parent.comment_count).toBe(2);
		expect(result.replyFocus.parent.comments.map((row: Row) => row.id).sort()).toEqual([900, 901]);
		// The email anchor must exist on first paint.
		expect(result.replyFocus.parent.comments.some((row: Row) => row.id === 901)).toBe(true);
	});

	it('ignores a removed reply silently', async () => {
		state.resolver = buildResolver([
			take(100, QUESTION_ID, { comment_count: 1 }),
			reply(900, 100, { removed: true })
		]);

		const result = (await load(buildEvent('?reply=900') as any)) as any;

		expect(result.replyFocus).toBeNull();
		expect(result.flags.userHasAnswered).toBe(true);
	});

	it('ignores a reply whose parent take belongs to another question', async () => {
		state.resolver = buildResolver([
			take(300, OTHER_QUESTION_ID, { comment_count: 1 }),
			reply(950, 300)
		]);

		const result = (await load(buildEvent('?reply=950') as any)) as any;

		expect(result.replyFocus).toBeNull();
	});

	it('ignores unknown, malformed, and top-level ids', async () => {
		state.resolver = buildResolver([take(100), reply(900, 100)]);

		for (const search of ['?reply=4242', '?reply=abc', '?reply=-1', '?reply=100', '']) {
			const result = (await load(buildEvent(search) as any)) as any;
			expect(result.replyFocus, search).toBeNull();
		}
	});

	it('never resolves the thread for a viewer who has not answered', async () => {
		state.resolver = buildResolver([take(100, QUESTION_ID, { comment_count: 1 }), reply(900, 100)]);

		const result = (await load(buildEvent('?reply=900', false) as any)) as any;

		expect(result.flags.userHasAnswered).toBe(false);
		expect(result.replyFocus).toBeNull();
		expect(result.comments).toEqual([]);
	});
});
