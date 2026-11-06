// src/routes/homepage.page.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { adminRpc, adminFrom, demoTimeMock, getQuestionTakesMock } = vi.hoisted(() => ({
	adminRpc: vi.fn(),
	adminFrom: vi.fn(),
	demoTimeMock: vi.fn(),
	getQuestionTakesMock: vi.fn()
}));

// The real giveFirstFunnel runs, so its crawler filter is under test; only the
// service-role RPC that would write the event is mocked.
vi.mock('$lib/server/supabaseAdmin', () => ({
	getSupabaseAdminClient: () => ({ rpc: adminRpc, from: adminFrom })
}));
vi.mock('$lib/supabase', () => ({ supabase: { rpc: vi.fn() } }));
vi.mock('$lib/server/demoTime', () => ({ loadRouteDemoTime: demoTimeMock }));
vi.mock('$lib/server/questionTakes', () => ({ getQuestionTakes: getQuestionTakesMock }));

import { load } from './+page.server';
import { LIVE_TAKE_SLUG } from '$lib/data/homepageLiveTake';

const USER_ID = '123e4567-e89b-12d3-a456-426614174000';
const CHROME =
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';
const GOOGLEBOT =
	'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
const QUESTION = {
	id: 203,
	url: LIVE_TAKE_SLUG,
	question: 'whats criteria considering someone friend',
	question_formatted: 'What are your criteria for considering someone a friend?',
	comment_count: 10
};

function buildEvent(
	options: {
		cookie?: string;
		userId?: string | null;
		userAgent?: string | null;
		answered?: boolean;
		question?: typeof QUESTION | null;
	} = {}
) {
	const pending: Promise<unknown>[] = [];
	const setHeaders = vi.fn();
	const question = options.question === undefined ? QUESTION : options.question;
	const query: Record<string, unknown> = {};
	for (const method of ['select', 'eq', 'not']) query[method] = () => query;
	query.single = async () => ({ data: question, error: question ? null : { code: 'PGRST116' } });
	const localsRpc = vi.fn(async () => ({ data: Boolean(options.answered), error: null }));
	const headers = new Headers();
	if (options.userAgent !== null) headers.set('user-agent', options.userAgent ?? CHROME);

	const event = {
		url: new URL('https://9takes.com/'),
		request: new Request('https://9takes.com/', { headers }),
		cookies: {
			get: (name: string) => (name === '9tfingerprint' ? options.cookie : undefined)
		},
		locals: {
			session: options.userId ? { user: { id: options.userId } } : null,
			supabase: { from: () => query, rpc: localsRpc }
		},
		setHeaders,
		platform: { context: { waitUntil: (promise: Promise<unknown>) => pending.push(promise) } }
	};
	return {
		event,
		setHeaders,
		localsRpc,
		settle: () => Promise.all(pending)
	};
}

/** Service-role table reads for the answered-types row: comments, then profiles. */
function stubAdminTables(tables: Record<string, unknown[]>) {
	const selects: Record<string, string> = {};
	adminFrom.mockImplementation((table: string) => {
		const query: Record<string, unknown> = {};
		query.select = (columns: string) => {
			selects[table] = columns;
			return query;
		};
		for (const method of ['eq', 'not', 'order', 'in']) query[method] = () => query;
		const result = { data: tables[table] ?? [], error: null };
		query.limit = async () => result;
		query.then = (resolve: (value: unknown) => unknown) => resolve(result);
		return query;
	});
	return selects;
}

function gateEvents() {
	return adminRpc.mock.calls.filter(([name]) => name === 'record_give_first_event');
}

beforeEach(() => {
	vi.clearAllMocks();
	vi.spyOn(console, 'warn').mockImplementation(() => {});
	demoTimeMock.mockResolvedValue(false);
	adminRpc.mockResolvedValue({ data: null, error: null });
	adminFrom.mockImplementation(() => {
		throw new Error('admin tables not stubbed');
	});
	getQuestionTakesMock.mockResolvedValue({
		data: [
			{ id: 77, comment: 'Loyalty, mostly.', is_own: true },
			{
				id: 31,
				comment: 'They remember the small things.',
				is_own: false,
				profiles: { enneagram: 2 }
			}
		],
		ownComments: [{ id: 77, comment: 'Loyalty, mostly.', is_own: true }],
		count: 10
	});
});

describe('homepage live take load', () => {
	it('serves a locked live question to a visitor who has not answered, with no answers', async () => {
		const { event, setHeaders, settle } = buildEvent({ cookie: 'visitor-1' });
		const data = (await load(event as never)) as { live: Record<string, unknown> };
		await settle();

		expect(setHeaders).toHaveBeenCalledWith({ 'cache-control': 'private, no-store' });
		expect(data.live).toEqual({
			questionId: 203,
			slug: LIVE_TAKE_SLUG,
			title: 'What are your criteria for considering someone a friend?',
			responses: 10,
			signedIn: false,
			answered: false,
			ownTake: null,
			answers: []
		});
		// Give-first integrity: no take is read before the visitor answers.
		expect(getQuestionTakesMock).not.toHaveBeenCalled();
		expect(gateEvents()).toEqual([
			[
				'record_give_first_event',
				{
					p_fingerprint: 'visitor-1',
					p_event_type: 'gate_shown',
					p_question_id: 203,
					p_path: '/',
					p_user_id: null
				}
			]
		]);
	});

	it.each([
		['a search crawler', GOOGLEBOT],
		['a request with no user agent', null]
	])('records no gate_shown for %s', async (_label, userAgent) => {
		const { event, settle } = buildEvent({ cookie: 'visitor-1', userAgent });
		const data = (await load(event as never)) as { live: { answered: boolean } };
		await settle();

		expect(data.live.answered).toBe(false);
		expect(gateEvents()).toHaveLength(0);
	});

	it('records no gate event and skips the gate read for a first visit with no cookie', async () => {
		const { event, localsRpc, settle } = buildEvent();
		await load(event as never);
		await settle();

		expect(localsRpc).not.toHaveBeenCalled();
		expect(gateEvents()).toHaveLength(0);
	});

	it('skips a visitor who already answered straight to their unlocked answers', async () => {
		const { event, localsRpc, settle } = buildEvent({
			cookie: 'visitor-1',
			userId: USER_ID,
			answered: true
		});
		const data = (await load(event as never)) as { live: Record<string, unknown> };
		await settle();

		expect(localsRpc).toHaveBeenCalledWith('can_see_comments_3', {
			userfingerprint: 'visitor-1',
			questionid: 203,
			userid: USER_ID
		});
		expect(getQuestionTakesMock).toHaveBeenCalledWith(203, {
			viewerId: USER_ID,
			fingerprint: 'visitor-1',
			limit: 24
		});
		expect(data.live).toMatchObject({
			signedIn: true,
			answered: true,
			ownTake: { id: 77, text: 'Loyalty, mostly.' },
			answers: [{ id: 31, text: 'They remember the small things.', type: 2 }]
		});
		expect(gateEvents()).toHaveLength(0);
	});

	it('falls back to the no-question card in demo mode or when the question is gone', async () => {
		const empty = { live: null, liveTypes: null };
		demoTimeMock.mockResolvedValueOnce(true);
		expect(await load(buildEvent({ cookie: 'visitor-1' }).event as never)).toEqual(empty);

		expect(await load(buildEvent({ question: null }).event as never)).toEqual(empty);
		expect(gateEvents()).toHaveLength(0);
		expect(adminFrom).not.toHaveBeenCalled();
	});

	it('never fails the homepage when the live question cannot load', async () => {
		demoTimeMock.mockRejectedValueOnce(new Error('settings timeout'));
		expect(await load(buildEvent({ cookie: 'visitor-1' }).event as never)).toEqual({
			live: null,
			liveTypes: null
		});
	});

	it('tells the locked card which types answered, reading no take text', async () => {
		const selects = stubAdminTables({
			comments: [
				{ author_id: 'a', created_at: '2026-10-31T15:00:00Z' },
				{ author_id: null, created_at: '2026-10-30T15:00:00Z' },
				{ author_id: 'b', created_at: '2026-10-29T15:00:00Z' },
				{ author_id: 'c', created_at: '2026-10-28T15:00:00Z' },
				{ author_id: 'a', created_at: '2026-10-27T15:00:00Z' }
			],
			profiles: [
				{ id: 'a', enneagram: '8' },
				{ id: 'b', enneagram: 'unknown' },
				{ id: 'c', enneagram: 4 }
			]
		});
		const { event, settle } = buildEvent({ cookie: 'visitor-1' });
		const data = (await load(event as never)) as { liveTypes: unknown };
		await settle();

		expect(data.liveTypes).toEqual({
			recent: [8, 4, 8, null],
			answered: [4, 8],
			newestAt: '2026-10-31T15:00:00Z'
		});
		expect(selects.comments).toBe('author_id, created_at');
		expect(selects.comments).not.toContain('comment,');
		expect(getQuestionTakesMock).not.toHaveBeenCalled();
	});

	it('drops the types row instead of failing when the types read errors', async () => {
		const { event } = buildEvent({ cookie: 'visitor-1' });
		const data = (await load(event as never)) as { live: unknown; liveTypes: unknown };
		expect(data.live).not.toBeNull();
		expect(data.liveTypes).toBeNull();
	});
});
