// src/routes/homepage.page.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { adminRpc, demoTimeMock, getQuestionTakesMock } = vi.hoisted(() => ({
	adminRpc: vi.fn(),
	demoTimeMock: vi.fn(),
	getQuestionTakesMock: vi.fn()
}));

// The real giveFirstFunnel runs, so its crawler filter is under test; only the
// service-role RPC that would write the event is mocked.
vi.mock('$lib/server/supabaseAdmin', () => ({
	getSupabaseAdminClient: () => ({ rpc: adminRpc })
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

function gateEvents() {
	return adminRpc.mock.calls.filter(([name]) => name === 'record_give_first_event');
}

beforeEach(() => {
	vi.clearAllMocks();
	vi.spyOn(console, 'warn').mockImplementation(() => {});
	demoTimeMock.mockResolvedValue(false);
	adminRpc.mockResolvedValue({ data: null, error: null });
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

	it('falls back to the practice homepage in demo mode or when the question is gone', async () => {
		demoTimeMock.mockResolvedValueOnce(true);
		expect(await load(buildEvent({ cookie: 'visitor-1' }).event as never)).toEqual({ live: null });

		expect(await load(buildEvent({ question: null }).event as never)).toEqual({ live: null });
		expect(gateEvents()).toHaveLength(0);
	});

	it('never fails the homepage when the live question cannot load', async () => {
		demoTimeMock.mockRejectedValueOnce(new Error('settings timeout'));
		expect(await load(buildEvent({ cookie: 'visitor-1' }).event as never)).toEqual({ live: null });
	});
});
