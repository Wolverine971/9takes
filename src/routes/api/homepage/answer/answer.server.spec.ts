// src/routes/api/homepage/answer/answer.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { anonRpc, adminRpc, demoTimeMock, getQuestionTakesMock, recordGiveFirstEventMock } =
	vi.hoisted(() => ({
		anonRpc: vi.fn(),
		adminRpc: vi.fn(),
		demoTimeMock: vi.fn(),
		getQuestionTakesMock: vi.fn(),
		recordGiveFirstEventMock: vi.fn()
	}));

vi.mock('$lib/supabase', () => ({ supabase: { rpc: anonRpc } }));
vi.mock('$lib/server/supabaseAdmin', () => ({
	getSupabaseAdminClient: () => ({ rpc: adminRpc })
}));
vi.mock('$lib/server/demoTime', () => ({ loadRouteDemoTime: demoTimeMock }));
vi.mock('$lib/server/questionTakes', () => ({ getQuestionTakes: getQuestionTakesMock }));
vi.mock('$lib/server/giveFirstFunnel', () => ({ recordGiveFirstEvent: recordGiveFirstEventMock }));
vi.mock('$lib/server/safeExternalFetch', () => ({ fetchPublicHtml: vi.fn() }));

import { POST } from './+server';
import { LIVE_TAKE_SLUG } from '$lib/data/homepageLiveTake';

const USER_ID = '123e4567-e89b-12d3-a456-426614174000';
const QUESTION = {
	id: 203,
	url: LIVE_TAKE_SLUG,
	question: 'whats criteria considering someone friend',
	question_formatted: 'What are your criteria for considering someone a friend?',
	comment_count: 10
};
const OTHER_TAKES = [
	{ id: 31, comment: 'They remember the small things.', is_own: false, profiles: { enneagram: 2 } },
	{ id: 32, comment: 'k', is_own: false, ranking_low_effort: true, profiles: null },
	{ id: 33, comment: 'I can be quiet around them.', is_own: false, profiles: null }
];

type Scenario = {
	body?: unknown;
	rawBody?: string;
	cookie?: string;
	userId?: string | null;
	rateLimited?: boolean;
	answeredBefore?: boolean;
	insertError?: unknown;
	gateAfterPost?: boolean;
	demo?: boolean;
	question?: typeof QUESTION | null;
};

function setup(scenario: Scenario = {}) {
	const waitUntil = vi.fn();
	let gateCalls = 0;
	const gateAnswer = () => {
		gateCalls += 1;
		// The first gate read is the pre-insert access check; later ones follow the post.
		if (gateCalls === 1) return Boolean(scenario.answeredBefore);
		return scenario.gateAfterPost ?? true;
	};

	demoTimeMock.mockResolvedValue(scenario.demo ?? false);
	anonRpc.mockImplementation(async (name: string) => {
		if (name === 'check_comment_rate_limit') return { data: !scenario.rateLimited, error: null };
		if (name === 'can_see_comments_3') return { data: gateAnswer(), error: null };
		throw new Error(`Unexpected anon rpc ${name}`);
	});
	adminRpc.mockImplementation(async (name: string, args: Record<string, unknown>) => {
		if (name !== 'create_comment_atomic') throw new Error(`Unexpected admin rpc ${name}`);
		if (scenario.insertError) return { data: null, error: scenario.insertError };
		return {
			data: {
				id: 901,
				comment: args.p_comment,
				fingerprint: args.p_fingerprint,
				ip: args.p_ip,
				_analytics: { is_first_comment_ever: true, is_first_comment_on_question: false }
			},
			error: null
		};
	});
	getQuestionTakesMock.mockImplementation(async () => ({
		data: [{ id: 901, comment: 'Someone who shows up.', is_own: true }, ...OTHER_TAKES],
		ownComments: [{ id: 901, comment: 'Someone who shows up.', is_own: true }],
		count: 11
	}));

	const question = scenario.question === undefined ? QUESTION : scenario.question;
	const query: Record<string, unknown> = {};
	for (const method of ['select', 'eq', 'not']) query[method] = () => query;
	query.single = async () => ({ data: question, error: question ? null : { code: 'PGRST116' } });
	const localsRpc = vi.fn(async (name: string) => {
		if (name === 'can_see_comments_3') return { data: gateAnswer(), error: null };
		throw new Error(`Unexpected locals rpc ${name}`);
	});

	const event = {
		request: new Request('http://localhost/api/homepage/answer', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body:
				scenario.rawBody ??
				JSON.stringify(
					scenario.body ?? {
						slug: LIVE_TAKE_SLUG,
						comment: '  Someone who shows up.  ',
						fingerprint: 'body-visitor'
					}
				)
		}),
		url: new URL('http://localhost/api/homepage/answer'),
		cookies: {
			get: (name: string) => (name === '9tfingerprint' ? scenario.cookie : undefined)
		},
		locals: {
			session: scenario.userId ? { user: { id: scenario.userId } } : null,
			supabase: { from: () => query, rpc: localsRpc }
		},
		getClientAddress: () => '203.0.113.7',
		platform: { context: { waitUntil } }
	};
	return { event, waitUntil, localsRpc };
}

async function post(scenario: Scenario = {}) {
	const context = setup(scenario);
	const response = await POST(context.event as never);
	return { ...context, response, body: await response.json() };
}

function insertCalls() {
	return adminRpc.mock.calls.filter(([name]) => name === 'create_comment_atomic');
}

beforeEach(() => {
	vi.clearAllMocks();
	vi.spyOn(console, 'error').mockImplementation(() => {});
	vi.spyOn(console, 'warn').mockImplementation(() => {});
	recordGiveFirstEventMock.mockResolvedValue(undefined);
});

describe('POST /api/homepage/answer', () => {
	it('posts an anonymous take through create_comment_atomic and returns the unlocked answers', async () => {
		const { response, body, waitUntil } = await post({ cookie: 'cookie-visitor' });

		expect(response.status).toBe(200);
		// The cookie the question page reads wins over the body value.
		expect(insertCalls()).toEqual([
			[
				'create_comment_atomic',
				{
					p_comment: 'Someone who shows up.',
					p_parent_id: 203,
					p_author_id: null,
					p_parent_type: 'question',
					p_fingerprint: 'cookie-visitor',
					p_ip: '203.0.113.7'
				}
			]
		]);
		expect(anonRpc).toHaveBeenCalledWith('check_comment_rate_limit', {
			p_fingerprint: 'cookie-visitor',
			p_ip: '203.0.113.7',
			p_max_comments: 5,
			p_window_seconds: 60
		});
		expect(recordGiveFirstEventMock).toHaveBeenCalledWith({
			fingerprint: 'cookie-visitor',
			eventType: 'contribution',
			questionId: 203,
			path: '/',
			userId: null
		});
		expect(waitUntil).toHaveBeenCalledTimes(2); // link enrichment + contribution event
		expect(getQuestionTakesMock).toHaveBeenCalledWith(203, {
			viewerId: null,
			fingerprint: 'cookie-visitor',
			limit: 24
		});
		expect(body).toEqual({
			ok: true,
			alreadyAnswered: false,
			questionId: 203,
			commentId: 901,
			commentAnalytics: { is_first_comment_ever: true, is_first_comment_on_question: false },
			isAnonymous: true,
			ownTake: { id: 901, text: 'Someone who shows up.' },
			// Others only, thoughtful answers before low-effort ones.
			answers: [
				{ id: 31, text: 'They remember the small things.', type: 2 },
				{ id: 33, text: 'I can be quiet around them.', type: null },
				{ id: 32, text: 'k', type: null }
			],
			responses: 11
		});
		// No private identifiers travel back to the browser.
		expect(JSON.stringify(body)).not.toMatch(/cookie-visitor|203\.0\.113\.7|fingerprint/);
	});

	it('falls back to the body fingerprint when the browser has no cookie yet', async () => {
		await post();
		expect(insertCalls()[0][1]).toMatchObject({ p_fingerprint: 'body-visitor' });
	});

	it('binds a signed-in take to the session account', async () => {
		const { body } = await post({ cookie: 'cookie-visitor', userId: USER_ID });
		expect(insertCalls()[0][1]).toMatchObject({ p_author_id: USER_ID });
		expect(body).toMatchObject({ isAnonymous: false, alreadyAnswered: false });
	});

	it('maps an anonymous visitor who already answered to alreadyAnswered without a second take', async () => {
		const { response, body } = await post({ cookie: 'cookie-visitor', answeredBefore: true });

		expect(response.status).toBe(200);
		expect(insertCalls()).toHaveLength(0);
		expect(recordGiveFirstEventMock).not.toHaveBeenCalled();
		expect(body).toMatchObject({
			ok: true,
			alreadyAnswered: true,
			commentId: null,
			ownTake: { id: 901, text: 'Someone who shows up.' }
		});
		expect(body.answers).toHaveLength(3);
	});

	it('maps the once-per-question trigger (a race with another tab) to alreadyAnswered', async () => {
		const { response, body } = await post({
			cookie: 'cookie-visitor',
			insertError: {
				code: '23505',
				message: 'Anonymous visitors can only comment once per question'
			}
		});

		expect(response.status).toBe(200);
		expect(body).toMatchObject({ ok: true, alreadyAnswered: true, commentId: null });
		expect(recordGiveFirstEventMock).not.toHaveBeenCalled();
	});

	it('gives signed-in users one homepage take even though the question page allows more', async () => {
		const { body } = await post({ userId: USER_ID, answeredBefore: true });
		expect(insertCalls()).toHaveLength(0);
		expect(body).toMatchObject({ alreadyAnswered: true, isAnonymous: false });
	});

	it('rate-limits with the question page limit before writing or reading takes', async () => {
		const { response, body } = await post({ cookie: 'cookie-visitor', rateLimited: true });

		expect(response.status).toBe(429);
		expect(body).toEqual({ error: 'Too many comments. Please wait a minute before trying again.' });
		expect(insertCalls()).toHaveLength(0);
		expect(getQuestionTakesMock).not.toHaveBeenCalled();
		expect(recordGiveFirstEventMock).not.toHaveBeenCalled();
	});

	it.each([
		['an empty answer', { slug: LIVE_TAKE_SLUG, comment: '' }, 400],
		['a whitespace-only answer', { slug: LIVE_TAKE_SLUG, comment: '   \n ' }, 400],
		['an answer over 5000 characters', { slug: LIVE_TAKE_SLUG, comment: 'a'.repeat(5001) }, 400],
		['a missing comment', { slug: LIVE_TAKE_SLUG }, 400],
		['a malformed slug', { slug: '../admin', comment: 'Hi there' }, 400],
		['a question that is not on the homepage', { slug: 'another-question', comment: 'Hi' }, 404]
	])('rejects %s without touching the database', async (_label, body, status) => {
		const { response, body: result } = await post({ cookie: 'cookie-visitor', body });

		expect(response.status).toBe(status);
		expect(typeof result.error).toBe('string');
		expect(insertCalls()).toHaveLength(0);
		expect(getQuestionTakesMock).not.toHaveBeenCalled();
	});

	it('rejects a body that is not JSON', async () => {
		const { response } = await post({ rawBody: 'comment=hi' });
		expect(response.status).toBe(400);
		expect(insertCalls()).toHaveLength(0);
	});

	it('requires a visitor fingerprint for anonymous takes, as the question page does', async () => {
		const { response, body } = await post({
			body: { slug: LIVE_TAKE_SLUG, comment: 'Someone who shows up.' }
		});
		expect(response.status).toBe(400);
		expect(body).toEqual({ error: 'Missing visitor fingerprint' });
		expect(insertCalls()).toHaveLength(0);
	});

	it('never writes a real take while demo mode is on', async () => {
		const { response } = await post({ cookie: 'cookie-visitor', demo: true });
		expect(response.status).toBe(409);
		expect(insertCalls()).toHaveLength(0);
	});

	it('returns 404 when the live question was removed or flagged', async () => {
		const { response } = await post({ cookie: 'cookie-visitor', question: null });
		expect(response.status).toBe(404);
		expect(insertCalls()).toHaveLength(0);
	});

	it('keeps the draft-safe error when the insert fails for another reason', async () => {
		const { response, body } = await post({
			cookie: 'cookie-visitor',
			insertError: { message: 'connection reset' }
		});
		expect(response.status).toBe(500);
		expect(body.error).toMatch(/still here/);
		expect(recordGiveFirstEventMock).not.toHaveBeenCalled();
		expect(getQuestionTakesMock).not.toHaveBeenCalled();
	});

	it('returns no answers unless the give-first gate opens for this visitor', async () => {
		const { body, localsRpc } = await post({ cookie: 'cookie-visitor', gateAfterPost: false });

		expect(localsRpc).toHaveBeenCalledWith('can_see_comments_3', {
			userfingerprint: 'cookie-visitor',
			questionid: 203,
			userid: null
		});
		expect(getQuestionTakesMock).not.toHaveBeenCalled();
		expect(body.answers).toEqual([]);
		expect(JSON.stringify(body)).not.toContain('They remember the small things.');
	});

	it('still confirms the post when the unlocked answers cannot be read', async () => {
		const context = setup({ cookie: 'cookie-visitor' });
		getQuestionTakesMock.mockRejectedValueOnce(new Error('timeout'));
		const response = await POST(context.event as never);
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(body).toMatchObject({
			ok: true,
			alreadyAnswered: false,
			commentId: 901,
			ownTake: { id: 901, text: 'Someone who shows up.' },
			answers: [],
			responses: 11
		});
	});
});
