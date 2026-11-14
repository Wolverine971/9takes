// src/routes/api/enneagram-test/results/[token]/answer/answer.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getTypesMock, getQuestionsMock, postLiveTakeMock, recordUserTakeMock } = vi.hoisted(() => ({
	getTypesMock: vi.fn(),
	getQuestionsMock: vi.fn(),
	postLiveTakeMock: vi.fn(),
	recordUserTakeMock: vi.fn()
}));

vi.mock('$lib/server/supabaseAdmin', () => ({ getSupabaseAdminClient: () => ({}) }));
vi.mock('$lib/server/enneagramTest', () => ({
	TEST_RESULT_GATE_PATH: '/enneagram-test/result',
	getQuestionsForTypes: getQuestionsMock,
	getTestResultTypes: getTypesMock,
	isResultToken: (token: string) => /^[A-Za-z0-9_-]{20,64}$/.test(token)
}));
vi.mock('$lib/server/liveTakeAnswer', () => ({ postLiveTake: postLiveTakeMock }));
vi.mock('$lib/server/nineTakes', () => ({ recordUserTake: recordUserTakeMock }));
vi.mock('$lib/utils/logger', () => ({ logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn() } }));

import { POST } from './+server';

const TOKEN = 'r'.repeat(24);
const POSTED = {
	ok: true,
	alreadyAnswered: false,
	questionId: 41,
	commentId: 901,
	commentAnalytics: null,
	isAnonymous: true,
	ownTake: { id: 901, text: 'I go quiet first.' },
	answers: [],
	responses: 12
};

function post(options: { token?: string; body?: unknown; userId?: string } = {}) {
	const event = {
		params: { token: options.token ?? TOKEN },
		request: new Request('http://localhost/api/enneagram-test/results/x/answer', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(
				options.body ?? {
					slug: 'six-question',
					comment: ' I go quiet first. ',
					fingerprint: 'fp-1'
				}
			)
		}),
		locals: { session: options.userId ? { user: { id: options.userId } } : null },
		cookies: { get: () => undefined },
		getClientAddress: () => '203.0.113.7'
	};
	return POST(event as never);
}

beforeEach(() => {
	vi.clearAllMocks();
	getTypesMock.mockResolvedValue([5, 6]);
	getQuestionsMock.mockResolvedValue({
		5: { url: 'five-question', question: 'Five?' },
		6: { url: 'six-question', question: 'Six?' }
	});
	postLiveTakeMock.mockResolvedValue({
		ok: true,
		created: true,
		fingerprint: 'fp-1',
		result: POSTED
	});
});

describe('POST /api/enneagram-test/results/[token]/answer', () => {
	it('posts the take and keeps the type the question was offered for', async () => {
		const response = await post();
		expect(response.status).toBe(200);
		expect(await response.json()).toEqual(POSTED);
		expect(postLiveTakeMock).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				slug: 'six-question',
				comment: ' I go quiet first. ',
				fingerprint: 'fp-1',
				// Never the private result URL.
				path: '/enneagram-test/result'
			})
		);
		expect(recordUserTakeMock).toHaveBeenCalledWith({
			subjectType: 'question',
			subjectSlug: 'six-question',
			take: 'I go quiet first.',
			resonantType: null,
			fingerprint: 'fp-1',
			userId: null,
			selfReportedType: 6
		});
	});

	it('only accepts a question this result shows', async () => {
		const response = await post({ body: { slug: 'some-other-question', comment: 'hello there' } });
		expect(response.status).toBe(404);
		expect(postLiveTakeMock).not.toHaveBeenCalled();
	});

	it('rejects malformed tokens, unknown results and bad bodies before posting', async () => {
		expect((await post({ token: 'nope' })).status).toBe(404);
		getTypesMock.mockResolvedValueOnce(null);
		expect((await post()).status).toBe(404);
		expect((await post({ body: { slug: 'bad slug!', comment: 'x' } })).status).toBe(400);
		expect(postLiveTakeMock).not.toHaveBeenCalled();
	});

	it('passes through gate and rate-limit failures without a corpus row', async () => {
		postLiveTakeMock.mockResolvedValueOnce({ ok: false, status: 429, error: 'Too many comments.' });
		const response = await post();
		expect(response.status).toBe(429);
		expect(await response.json()).toEqual({ error: 'Too many comments.' });
		expect(recordUserTakeMock).not.toHaveBeenCalled();
	});

	it('does not record a second corpus row for someone who already answered', async () => {
		postLiveTakeMock.mockResolvedValueOnce({
			ok: true,
			created: false,
			fingerprint: 'fp-1',
			result: { ...POSTED, alreadyAnswered: true, commentId: null }
		});
		expect((await post()).status).toBe(200);
		expect(recordUserTakeMock).not.toHaveBeenCalled();
	});
});
