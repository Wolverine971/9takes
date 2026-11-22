// src/routes/api/superlatives/vote/vote.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { recordMock, summaryMock, consumeApiRateLimitMock } = vi.hoisted(() => ({
	recordMock: vi.fn(),
	summaryMock: vi.fn(),
	consumeApiRateLimitMock: vi.fn()
}));

vi.mock('$lib/server/superlativeVotes', async (importOriginal) => {
	const actual = await importOriginal<typeof import('$lib/server/superlativeVotes')>();
	return { ...actual, recordSuperlativeVote: recordMock, loadSuperlativeSummary: summaryMock };
});

vi.mock('$lib/server/apiRateLimit', () => ({
	consumeApiRateLimit: consumeApiRateLimitMock,
	resolveRateLimitSubject: ({ clientAddress }: { clientAddress: string }) => `ip:${clientAddress}`
}));

vi.mock('$lib/utils/logger', () => ({ logger: { error: vi.fn(), warn: vi.fn() } }));

import { POST } from './+server';

function buildEvent({
	body,
	fingerprint = 'visitor-1',
	userAgent = 'Mozilla/5.0 (Macintosh) Safari/605.1.15'
}: {
	body: unknown;
	fingerprint?: string | null;
	userAgent?: string;
}) {
	return {
		request: new Request('https://9takes.test/api/superlatives/vote', {
			method: 'POST',
			headers: { 'content-type': 'application/json', 'user-agent': userAgent },
			body: JSON.stringify(body)
		}),
		locals: { user: null, session: null },
		cookies: { get: (name: string) => (name === '9tfingerprint' ? fingerprint : undefined) },
		getClientAddress: () => '203.0.113.7'
	} as unknown as Parameters<typeof POST>[0];
}

beforeEach(() => {
	recordMock.mockReset().mockResolvedValue(undefined);
	summaryMock.mockReset().mockResolvedValue({});
	consumeApiRateLimitMock
		.mockReset()
		.mockResolvedValue({ allowed: true, retryAfterSeconds: 600, degraded: false });
});

describe('POST /api/superlatives/vote', () => {
	it('saves a "this is me" vote and returns the trait results', async () => {
		const res = await POST(buildEvent({ body: { kind: 'me', trait: 'jealous', voterType: 4 } }));
		expect(res.status).toBe(200);
		expect(recordMock).toHaveBeenCalledWith(
			{ kind: 'me', trait: 'jealous', voterType: 4, on: true },
			{ fingerprint: 'visitor-1', userId: null }
		);
		expect((await res.json()).results.pickTotal).toBe(0);
	});

	it('saves a pick with a trimmed reason, dropping an empty one', async () => {
		await POST(
			buildEvent({
				body: { kind: 'pick', trait: 'jealous', pickedType: 2, voterType: 2, reason: '   ' }
			})
		);
		expect(recordMock.mock.calls[0][0]).toMatchObject({
			kind: 'pick',
			pickedType: 2,
			reason: null
		});
	});

	it('rejects unknown traits, bad types and missing picks', async () => {
		for (const body of [
			{ kind: 'me', trait: 'not-a-trait', voterType: 4 },
			{ kind: 'me', trait: 'jealous', voterType: 10 },
			{ kind: 'pick', trait: 'jealous' },
			{ kind: 'me', trait: 'jealous' }
		]) {
			expect((await POST(buildEvent({ body }))).status).toBe(400);
		}
		expect(recordMock).not.toHaveBeenCalled();
	});

	it('needs the visitor cookie', async () => {
		const res = await POST(
			buildEvent({ body: { kind: 'me', trait: 'jealous', voterType: 4 }, fingerprint: null })
		);
		expect(res.status).toBe(400);
	});

	it('ignores crawlers', async () => {
		const res = await POST(
			buildEvent({
				body: { kind: 'me', trait: 'jealous', voterType: 4 },
				userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
			})
		);
		expect(res.status).toBe(403);
		expect(recordMock).not.toHaveBeenCalled();
	});

	it('rate limits', async () => {
		consumeApiRateLimitMock.mockResolvedValue({
			allowed: false,
			retryAfterSeconds: 600,
			degraded: false
		});
		const res = await POST(buildEvent({ body: { kind: 'me', trait: 'jealous', voterType: 4 } }));
		expect(res.status).toBe(429);
		expect(res.headers.get('Retry-After')).toBe('600');
	});

	it('still answers ok when the vote saved but results could not load', async () => {
		summaryMock.mockRejectedValue(new Error('down'));
		const res = await POST(buildEvent({ body: { kind: 'me', trait: 'jealous', voterType: 4 } }));
		expect(res.status).toBe(200);
	});

	it('reports a save failure', async () => {
		recordMock.mockRejectedValue(new Error('db down'));
		const res = await POST(buildEvent({ body: { kind: 'me', trait: 'jealous', voterType: 4 } }));
		expect(res.status).toBe(503);
	});
});
