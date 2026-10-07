// src/routes/questions/answerGist.page.server.spec.ts
//
// /questions/[slug] load and "The gist so far" (T-43, DJ 2026-10-07):
//   * humans see zero answers AND no gist before they answer;
//   * IP-verified Googlebot gets the gist (never the takes) with
//     Cache-Control: private, no-store;
//   * humans who answered get the gist at the top of the revealed thread;
//   * no stored gist (or no table yet) breaks nothing.
import { beforeEach, describe, expect, it, vi } from 'vitest';

type Call = { method: string; args: unknown[] };

const GIST_TEXT = 'Invented gist text for the test: most answers circle the same two moves.';
const GOOGLEBOT_UA = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
const CHROME_UA =
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/141.0.0.0 Safari/537.36';
const GOOGLE_IP = '66.249.66.1';

const state = vi.hoisted(() => ({
	rpcMock: vi.fn(),
	checkDemoTimeMock: vi.fn(),
	verifyMock: vi.fn(),
	recordGiveFirstEventMock: vi.fn(),
	runBestEffortTelemetryMock: vi.fn(),
	summaryRow: null as null | Record<string, unknown>,
	summaryTableMissing: false,
	summarySelects: [] as string[]
}));

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

const TAKE = {
	id: 501,
	comment: 'invented human take',
	author_id: null,
	parent_id: 118,
	parent_type: 'question',
	comment_count: 0,
	created_at: '2026-01-02T00:00:00.000Z',
	modified_at: null,
	like_count: 0,
	profiles: null,
	comment_like: []
};

function resolve(table: string, calls: Call[]) {
	if (table === 'question_answer_summaries') {
		const select = calls.find((call) => call.method === 'select');
		state.summarySelects.push(String(select?.args[0] ?? ''));
		if (state.summaryTableMissing) {
			return {
				data: null,
				error: { message: 'relation "question_answer_summaries" does not exist' }
			};
		}
		if (!state.summaryRow) return { data: null, error: null };
		return String(select?.args[0]).includes('summary')
			? { data: state.summaryRow, error: null }
			: { data: { question_id: QUESTION.id }, error: null };
	}
	if (table === 'questions' || table === 'questions_demo') {
		if (
			calls.some(
				(call) => call.method === 'select' && call.args[0] === 'starter_rank, pinned_comment_ids'
			)
		) {
			return { data: null, error: null };
		}
		return { data: QUESTION, error: null };
	}
	if (table === 'comments') return { data: [], count: 1, error: null };
	if (table === 'links') return { data: [], count: 0, error: null };
	return { data: [], error: null };
}

function chain(table: string): any {
	const calls: Call[] = [];
	const proxy: any = new Proxy(
		{},
		{
			get(_, prop) {
				if (prop === 'then') {
					const result = resolve(table, calls);
					return (onFulfilled: (value: unknown) => void, onRejected: (reason: unknown) => void) =>
						Promise.resolve(result).then(onFulfilled, onRejected);
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
vi.mock('$lib/server/verifiedGooglebot', () => ({ isVerifiedGooglebot: state.verifyMock }));
vi.mock('$lib/server/giveFirstFunnel', () => ({
	recordGiveFirstEvent: state.recordGiveFirstEventMock
}));
vi.mock('$lib/server/bestEffortTelemetry', () => ({
	logBestEffortTelemetryFailure: vi.fn(),
	runBestEffortTelemetry: state.runBestEffortTelemetryMock
}));
vi.mock('../../utils/api', () => ({ checkDemoTime: state.checkDemoTimeMock }));
vi.mock('../../utils/demo', () => ({ mapDemoValues: (value: unknown) => value }));

import { load } from './[slug]/+page.server';

function buildEvent(options: {
	answered: boolean;
	userAgent: string;
	ip?: string;
	cookie?: string | undefined;
}) {
	state.rpcMock.mockImplementation(async (name: string) => {
		if (name === 'can_see_comments_3') return { data: options.answered, error: null };
		if (name === 'get_question_take_data') {
			return { data: { takes: [TAKE], own_takes: [], total_count: 1 }, error: null };
		}
		return { data: null, error: null };
	});
	const setHeaders = vi.fn();
	return {
		setHeaders,
		event: {
			params: { slug: 'kid-in-3-words' },
			url: new URL('https://9takes.com/questions/kid-in-3-words'),
			request: new Request('https://9takes.com/questions/kid-in-3-words', {
				headers: { 'user-agent': options.userAgent }
			}),
			getClientAddress: () => options.ip ?? '203.0.113.9',
			setHeaders,
			cookies: { get: vi.fn(() => options.cookie), delete: vi.fn() },
			locals: {
				session: null,
				supabase: { rpc: state.rpcMock, from: (table: string) => chain(table) }
			}
		} as any
	};
}

const takesRpcCalled = () =>
	state.rpcMock.mock.calls.some(([name]) => name === 'get_question_take_data');

describe('/questions/[slug] load: the gist so far (T-43)', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		state.checkDemoTimeMock.mockResolvedValue(false);
		state.summaryTableMissing = false;
		state.summarySelects = [];
		state.summaryRow = {
			summary: GIST_TEXT,
			source_comment_count: 12,
			generated_at: '2026-10-07T12:00:00.000Z'
		};
		state.verifyMock.mockImplementation(
			async ({ userAgent, ip }: { userAgent?: string | null; ip?: string | null }) =>
				Boolean(userAgent?.includes('Googlebot')) && ip === GOOGLE_IP
		);
	});

	it('verified Googlebot before answering: the gist, no takes, private no-store', async () => {
		const { event, setHeaders } = buildEvent({
			answered: false,
			userAgent: GOOGLEBOT_UA,
			ip: GOOGLE_IP
		});
		const result = (await load(event)) as any;

		expect(state.verifyMock).toHaveBeenCalledWith({ userAgent: GOOGLEBOT_UA, ip: GOOGLE_IP });
		expect(result.answerSummary).toEqual({
			summary: GIST_TEXT,
			sourceCommentCount: 12,
			generatedAt: '2026-10-07T12:00:00.000Z'
		});
		expect(result.answerSummaryAvailable).toBe(true);
		expect(setHeaders).toHaveBeenCalledWith({ 'cache-control': 'private, no-store' });
		// Googlebot stays a locked visitor: no takes, no view tracking, no gate event.
		expect(result.flags.userHasAnswered).toBe(false);
		expect(result.comments).toEqual([]);
		expect(takesRpcCalled()).toBe(false);
		expect(JSON.stringify(result)).not.toContain('invented human take');
		expect(state.recordGiveFirstEventMock).not.toHaveBeenCalled();
		expect(state.runBestEffortTelemetryMock).not.toHaveBeenCalled();
	});

	it.each([
		['a browser', CHROME_UA, '203.0.113.9'],
		['a spoofed Googlebot user agent', GOOGLEBOT_UA, '203.0.113.9']
	])('%s before answering gets no gist text and no takes', async (_label, userAgent, ip) => {
		const { event, setHeaders } = buildEvent({
			answered: false,
			userAgent,
			ip,
			cookie: 'visitor-1'
		});
		const result = (await load(event)) as any;

		expect(result.answerSummary).toBeNull();
		// Only existence is read, for the paywall JSON-LD; the text never leaves the server.
		expect(result.answerSummaryAvailable).toBe(true);
		expect(state.summarySelects).toEqual(['question_id']);
		expect(JSON.stringify(result)).not.toContain(GIST_TEXT);
		expect(result.comments).toEqual([]);
		expect(takesRpcCalled()).toBe(false);
		expect(setHeaders).not.toHaveBeenCalled();
	});

	it('a human who answered gets the gist with the revealed takes', async () => {
		const { event, setHeaders } = buildEvent({
			answered: true,
			userAgent: CHROME_UA,
			cookie: 'visitor-1'
		});
		const result = (await load(event)) as any;

		expect(result.flags.userHasAnswered).toBe(true);
		expect(result.answerSummary?.summary).toBe(GIST_TEXT);
		expect(result.answerSummaryAvailable).toBe(true);
		expect(result.comments.map((row: { id: number }) => row.id)).toEqual([501]);
		expect(setHeaders).not.toHaveBeenCalled();
	});

	it.each([
		['no stored gist', false],
		['the table not migrated yet', true]
	])('%s breaks nothing, locked or unlocked', async (_label, tableMissing) => {
		state.summaryRow = null;
		state.summaryTableMissing = tableMissing;

		const locked = (await load(
			buildEvent({ answered: false, userAgent: GOOGLEBOT_UA, ip: GOOGLE_IP }).event
		)) as any;
		expect(locked.answerSummary).toBeNull();
		expect(locked.answerSummaryAvailable).toBe(false);

		const human = (await load(buildEvent({ answered: false, userAgent: CHROME_UA }).event)) as any;
		expect(human.answerSummaryAvailable).toBe(false);

		const unlocked = (await load(
			buildEvent({ answered: true, userAgent: CHROME_UA, cookie: 'visitor-1' }).event
		)) as any;
		expect(unlocked.answerSummary).toBeNull();
		expect(unlocked.comments).toHaveLength(1);
	});

	it('demo mode never verifies crawlers or reads gists', async () => {
		state.checkDemoTimeMock.mockResolvedValue(true);
		const { event, setHeaders } = buildEvent({
			answered: false,
			userAgent: GOOGLEBOT_UA,
			ip: GOOGLE_IP
		});
		const result = (await load(event)) as any;

		expect(state.verifyMock).not.toHaveBeenCalled();
		expect(state.summarySelects).toEqual([]);
		expect(result.answerSummary).toBeNull();
		expect(result.answerSummaryAvailable).toBe(false);
		expect(setHeaders).not.toHaveBeenCalled();
	});
});
