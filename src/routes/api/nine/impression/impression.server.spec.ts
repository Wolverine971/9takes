// src/routes/api/nine/impression/impression.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { recordImpressionMock, personLookup, loggerMocks } = vi.hoisted(() => ({
	recordImpressionMock: vi.fn(),
	personLookup: vi.fn(),
	loggerMocks: { warn: vi.fn(), error: vi.fn() }
}));

vi.mock('$lib/server/giveFirstFunnel', async (importOriginal) => {
	const actual = await importOriginal<typeof import('$lib/server/giveFirstFunnel')>();
	return {
		// The real crawler filter, so this endpoint is tested against it.
		isLikelyCrawlerUserAgent: actual.isLikelyCrawlerUserAgent,
		recordStrategicQuestionImpression: recordImpressionMock
	};
});

vi.mock('$lib/server/supabaseAdmin', () => ({
	getSupabaseAdminClient: () => {
		const builder: Record<string, unknown> = {};
		for (const method of ['select', 'eq', 'limit']) builder[method] = () => builder;
		builder.maybeSingle = personLookup;
		return { from: () => builder };
	}
}));

vi.mock('$lib/utils/logger', () => ({ logger: loggerMocks }));

import { POST } from './+server';
import { PROVEN_CHORUS_QUESTION_URLS } from '$lib/server/provenChorusQuestions';

const CHROME =
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';
const GOOGLEBOT =
	'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
const PROVEN_URL = PROVEN_CHORUS_QUESTION_URLS[0];

function buildEvent({
	body,
	userAgent = CHROME,
	cookieFingerprint,
	userId = null
}: {
	body: unknown;
	userAgent?: string | null;
	cookieFingerprint?: string;
	userId?: string | null;
}) {
	const headers: Record<string, string> = { 'content-type': 'application/json' };
	if (userAgent) headers['user-agent'] = userAgent;
	return {
		request: new Request('http://localhost/api/nine/impression', {
			method: 'POST',
			headers,
			body: JSON.stringify(body)
		}),
		cookies: {
			get: vi.fn((name: string) => (name === '9tfingerprint' ? cookieFingerprint : undefined))
		},
		locals: { session: userId ? { user: { id: userId } } : null }
	};
}

async function post(event: ReturnType<typeof buildEvent>) {
	return POST(event as never);
}

describe('POST /api/nine/impression', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		recordImpressionMock.mockResolvedValue(undefined);
		personLookup.mockResolvedValue({ data: null, error: null });
	});

	it('records a gate impression for a proven question on a personality page', async () => {
		const response = await post(
			buildEvent({
				body: {
					questionUrl: PROVEN_URL,
					sourcePath: '/personality-analysis/zendaya',
					fingerprint: 'visitor-1'
				},
				userId: 'user-9'
			})
		);

		expect(response.status).toBe(204);
		expect(response.headers.get('cache-control')).toContain('no-store');
		expect(recordImpressionMock).toHaveBeenCalledWith({
			questionUrl: PROVEN_URL,
			fingerprint: 'visitor-1',
			path: '/personality-analysis/zendaya',
			userId: 'user-9',
			userAgent: CHROME
		});
		expect(personLookup).not.toHaveBeenCalled();
	});

	it('prefers the fingerprint cookie over the body value', async () => {
		await post(
			buildEvent({
				body: {
					questionUrl: PROVEN_URL,
					sourcePath: '/personality-analysis/zendaya',
					fingerprint: 'body-value'
				},
				cookieFingerprint: 'cookie-value'
			})
		);

		expect(recordImpressionMock).toHaveBeenCalledWith(
			expect.objectContaining({ fingerprint: 'cookie-value' })
		);
	});

	it.each([
		['a crawler', GOOGLEBOT],
		['a missing user agent', null]
	])('records nothing for %s', async (_label, userAgent) => {
		const response = await post(
			buildEvent({
				body: {
					questionUrl: PROVEN_URL,
					sourcePath: '/personality-analysis/zendaya',
					fingerprint: 'visitor-2'
				},
				userAgent
			})
		);

		expect(response.status).toBe(204);
		expect(recordImpressionMock).not.toHaveBeenCalled();
	});

	it('records nothing without a visitor fingerprint', async () => {
		await post(
			buildEvent({
				body: { questionUrl: PROVEN_URL, sourcePath: '/personality-analysis/zendaya' }
			})
		);

		expect(recordImpressionMock).not.toHaveBeenCalled();
	});

	it('accepts the page’s own chorus question', async () => {
		personLookup.mockResolvedValue({
			data: { chorus_question_url: 'what-does-zendaya-prepare-for' },
			error: null
		});

		await post(
			buildEvent({
				body: {
					questionUrl: 'what-does-zendaya-prepare-for',
					sourcePath: '/personality-analysis/zendaya',
					fingerprint: 'visitor-3'
				}
			})
		);

		expect(recordImpressionMock).toHaveBeenCalledWith(
			expect.objectContaining({ questionUrl: 'what-does-zendaya-prepare-for' })
		);
	});

	it('refuses a question the page cannot show', async () => {
		personLookup.mockResolvedValue({
			data: { chorus_question_url: 'what-does-zendaya-prepare-for' },
			error: null
		});

		const response = await post(
			buildEvent({
				body: {
					questionUrl: 'some-other-question',
					sourcePath: '/personality-analysis/zendaya',
					fingerprint: 'visitor-4'
				}
			})
		);

		expect(response.status).toBe(204);
		expect(recordImpressionMock).not.toHaveBeenCalled();
	});

	it.each([
		['a non-personality path', { questionUrl: PROVEN_URL, sourcePath: '/questions/x' }],
		['a malformed question', { questionUrl: 'a b', sourcePath: '/personality-analysis/zendaya' }],
		['an empty body', null]
	])('rejects %s', async (_label, body) => {
		const response = await post(buildEvent({ body }));

		expect(response.status).toBe(400);
		expect(recordImpressionMock).not.toHaveBeenCalled();
	});

	it('never fails the reader when recording throws', async () => {
		recordImpressionMock.mockRejectedValue(new Error('database unavailable'));

		const response = await post(
			buildEvent({
				body: {
					questionUrl: PROVEN_URL,
					sourcePath: '/personality-analysis/zendaya',
					fingerprint: 'visitor-5'
				}
			})
		);

		expect(response.status).toBe(204);
		expect(loggerMocks.warn).toHaveBeenCalled();
	});
});
