// src/routes/api/nine/mirror/mirror.server.spec.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const {
	generateMirrorMock,
	getChorusForQuestionMock,
	recordUserTakeMock,
	recordGiveFirstEventMock,
	rpcMock,
	loggerMocks,
	consumeApiRateLimitMock
} = vi.hoisted(() => ({
	generateMirrorMock: vi.fn(),
	getChorusForQuestionMock: vi.fn(),
	recordUserTakeMock: vi.fn(),
	recordGiveFirstEventMock: vi.fn(),
	rpcMock: vi.fn(),
	consumeApiRateLimitMock: vi.fn(),
	loggerMocks: {
		warn: vi.fn(),
		error: vi.fn()
	}
}));

vi.mock('$lib/server/apiRateLimit', () => ({
	consumeApiRateLimit: consumeApiRateLimitMock,
	resolveRateLimitSubject: ({
		userId,
		clientAddress
	}: {
		userId?: string | null;
		clientAddress: string;
	}) => (userId ? `user:${userId}` : `ip:${clientAddress}`)
}));

vi.mock('$lib/server/nineTakes', () => ({
	generateMirror: generateMirrorMock,
	getChorus: vi.fn(),
	getChorusForQuestion: getChorusForQuestionMock,
	recordUserTake: recordUserTakeMock
}));

vi.mock('$lib/server/giveFirstFunnel', () => ({
	recordGiveFirstEvent: recordGiveFirstEventMock
}));

vi.mock('$lib/utils/logger', () => ({
	logger: loggerMocks
}));

import { POST } from './+server';

const questionUrl = 'whats-something-every-day-seem-fine-nobody-knows-costing-effort';
const takes = Array.from({ length: 9 }, (_, index) => ({
	type: index + 1,
	archetype: `Type ${index + 1}`,
	take: `Take ${index + 1}`,
	source: 'ai' as const
}));

function buildEvent(options: {
	fingerprint: string;
	cookieFingerprint?: string;
	rpcError?: unknown;
	take?: string;
}) {
	rpcMock.mockResolvedValueOnce({
		data: options.rpcError
			? null
			: {
					id: 123,
					_analytics: {
						is_first_comment_ever: true,
						is_first_comment_on_question: true,
						is_reply: false,
						question_age_hours: 3.5,
						responses_before_comment: 0
					}
				},
		error: options.rpcError ?? null
	});

	return {
		request: new Request('http://localhost/api/nine/mirror', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				subjectType: 'question',
				questionUrl,
				take: options.take ?? 'I act fine even when I feel exhausted.',
				fingerprint: options.fingerprint,
				sourcePath: '/'
			})
		}),
		locals: {
			session: null,
			supabase: { rpc: rpcMock }
		},
		cookies: {
			get: vi.fn((name: string) =>
				name === '9tfingerprint' ? options.cookieFingerprint : undefined
			)
		},
		getClientAddress: vi.fn(() => '127.0.0.1')
	};
}

describe('POST /api/nine/mirror', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		consumeApiRateLimitMock.mockResolvedValue({
			allowed: true,
			retryAfterSeconds: 600,
			degraded: false
		});
		getChorusForQuestionMock.mockResolvedValue({
			question: "What's something you do every day to seem fine?",
			questionUrl,
			questionId: 567,
			takes
		});
		generateMirrorMock.mockResolvedValue({
			reflection: 'You are protecting your energy while trying not to worry anyone.',
			resonantType: 9,
			resonantArchetype: 'Peacemaker'
		});
		recordUserTakeMock.mockResolvedValue(undefined);
		recordGiveFirstEventMock.mockResolvedValue(undefined);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('uses the body fingerprint when a browser does not return the cookie', async () => {
		const response = await POST(buildEvent({ fingerprint: 'visitor-body-fallback-1' }) as never);
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(body).toMatchObject({
			answerRecorded: true,
			alreadyAnswered: false,
			questionId: 567,
			commentId: 123,
			isAnonymous: true,
			commentAnalytics: {
				is_first_comment_ever: true,
				is_first_comment_on_question: true,
				is_reply: false,
				question_age_hours: 3.5,
				responses_before_comment: 0
			}
		});
		expect(rpcMock).toHaveBeenCalledWith(
			'create_comment_atomic',
			expect.objectContaining({ p_fingerprint: 'visitor-body-fallback-1' })
		);
		expect(rpcMock.mock.invocationCallOrder[0]).toBeLessThan(
			generateMirrorMock.mock.invocationCallOrder[0]
		);
	});

	it('does not return a comment id when the request only unlocks an existing answer', async () => {
		const response = await POST(
			buildEvent({
				fingerprint: 'visitor-existing-answer-2',
				rpcError: { message: 'Anonymous visitors can answer once per question' }
			}) as never
		);
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(body).toMatchObject({
			answerRecorded: true,
			alreadyAnswered: true,
			commentId: null
		});
	});

	it('reveals the perspectives when the optional mirror generation fails after posting', async () => {
		generateMirrorMock.mockRejectedValueOnce(new Error('provider unavailable'));

		const response = await POST(buildEvent({ fingerprint: 'visitor-mirror-fallback-2' }) as never);
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(body).toMatchObject({
			answerRecorded: true,
			mirrorUnavailable: true,
			reflection: null,
			resonantType: null,
			resonantArchetype: null,
			takes
		});
		expect(recordUserTakeMock).toHaveBeenCalledWith(
			expect.objectContaining({ resonantType: null })
		);
		expect(loggerMocks.warn).toHaveBeenCalledWith(
			'Chorus mirror unavailable after answer recorded',
			expect.any(Object)
		);
	});

	it('reveals the perspectives when mirror generation exceeds its deadline', async () => {
		vi.useFakeTimers();
		generateMirrorMock.mockImplementationOnce(() => new Promise(() => {}));

		const responsePromise = POST(buildEvent({ fingerprint: 'visitor-mirror-timeout-3' }) as never);
		await vi.advanceTimersByTimeAsync(8000);
		const response = await responsePromise;
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(body).toMatchObject({
			answerRecorded: true,
			mirrorUnavailable: true,
			reflection: null,
			takes
		});
	});

	it('keeps the draft retryable and skips mirror generation when posting fails', async () => {
		const response = await POST(
			buildEvent({
				fingerprint: 'visitor-post-failure-4',
				rpcError: { message: 'database unavailable' }
			}) as never
		);
		const body = await response.json();

		expect(response.status).toBe(503);
		expect(body.error).toContain('Your draft is still here');
		expect(generateMirrorMock).not.toHaveBeenCalled();
		expect(recordUserTakeMock).not.toHaveBeenCalled();
	});

	it('rejects answers above the shared 2,000-character limit before any write', async () => {
		const response = await POST(
			buildEvent({
				fingerprint: 'visitor-over-limit-5',
				take: 'x'.repeat(2001)
			}) as never
		);
		const body = await response.json();

		expect(response.status).toBe(400);
		expect(body.error).toContain('2000 characters');
		expect(getChorusForQuestionMock).not.toHaveBeenCalled();
		expect(rpcMock).not.toHaveBeenCalled();
		expect(generateMirrorMock).not.toHaveBeenCalled();
	});

	it('meters on the client address, not the caller-supplied fingerprint', async () => {
		// Both the body field and the cookie are attacker-controlled, so rotating
		// them must not buy a fresh budget on a paid LLM call.
		await POST(
			buildEvent({
				fingerprint: 'rotated-body-value',
				cookieFingerprint: 'rotated-cookie-value'
			}) as never
		);

		expect(consumeApiRateLimitMock).toHaveBeenCalledWith({
			bucket: 'chorus_mirror',
			subject: 'ip:127.0.0.1'
		});
	});

	it('refuses to generate a mirror once the limit is spent', async () => {
		consumeApiRateLimitMock.mockResolvedValue({
			allowed: false,
			retryAfterSeconds: 600,
			degraded: false
		});

		const response = await POST(buildEvent({ fingerprint: 'visitor-over-budget' }) as never);

		expect(response.status).toBe(429);
		expect(response.headers.get('Retry-After')).toBe('600');
		expect(generateMirrorMock).not.toHaveBeenCalled();
	});
});
