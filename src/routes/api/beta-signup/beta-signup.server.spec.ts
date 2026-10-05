// src/routes/api/beta-signup/beta-signup.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { createBetaSignupMock, consumeApiRateLimitMock, recordCtaExperimentEventMock } = vi.hoisted(
	() => ({
		createBetaSignupMock: vi.fn(),
		consumeApiRateLimitMock: vi.fn(),
		recordCtaExperimentEventMock: vi.fn()
	})
);

vi.mock('$lib/server/betaSignups', async (importOriginal) => {
	const actual = await importOriginal<typeof import('$lib/server/betaSignups')>();
	return { ...actual, createBetaSignup: createBetaSignupMock };
});
vi.mock('$lib/server/apiRateLimit', () => ({
	consumeApiRateLimit: consumeApiRateLimitMock,
	resolveRateLimitSubject: ({
		userId,
		clientAddress
	}: {
		userId?: string;
		clientAddress: string;
	}) => (userId ? `user:${userId}` : `ip:${clientAddress}`)
}));
vi.mock('$lib/server/ctaExperiments', () => ({
	recordCtaExperimentEvent: recordCtaExperimentEventMock
}));
vi.mock('$env/dynamic/private', () => ({ env: {} }));
vi.mock('$lib/server/supabaseAdmin', () => ({ getSupabaseAdminClient: vi.fn() }));
vi.mock('$lib/email/sender', () => ({ sendEmail: vi.fn() }));
vi.mock('$lib/utils/logger', () => ({ logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn() } }));

import { POST } from './+server';
import { BETA_CARD_EXPERIMENT, BETA_CARD_VARIANTS } from '$lib/utils/betaCardCopy';

const VARIANT = BETA_CARD_VARIANTS[0].id;

const BROWSER_UA =
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

function call(body: unknown, userAgent = BROWSER_UA) {
	const request = new Request('http://localhost/api/beta-signup', {
		method: 'POST',
		headers: { 'content-type': 'application/json', 'user-agent': userAgent },
		body: JSON.stringify(body)
	});
	return POST({
		request,
		getClientAddress: () => '203.0.113.7',
		locals: { session: null },
		cookies: { get: (name: string) => (name === '9tfingerprint' ? 'fp-123' : undefined) }
	} as unknown as Parameters<typeof POST>[0]);
}

const valid = {
	email: 'reader@example.com',
	surface: 'celebrity',
	placement: 'rail',
	sourcePath: '/personality-analysis/taylor-swift',
	variant: VARIANT,
	form_extra: '',
	_timeToken: 4000
};

describe('POST /api/beta-signup', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		consumeApiRateLimitMock.mockResolvedValue({ allowed: true, retryAfterSeconds: 0 });
		createBetaSignupMock.mockResolvedValue({ ok: true, alerted: true, recorded: true });
	});

	it('saves a real signup and never lets the response be cached', async () => {
		const response = await call(valid);

		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({ ok: true });
		expect(response.headers.get('cache-control')).toContain('no-store');
		expect(createBetaSignupMock).toHaveBeenCalledWith(
			expect.objectContaining({
				email: 'reader@example.com',
				surface: 'celebrity',
				placement: 'rail',
				sourcePath: '/personality-analysis/taylor-swift',
				clientAddress: '203.0.113.7'
			})
		);
		expect(consumeApiRateLimitMock).toHaveBeenCalledWith({
			bucket: 'beta_signup',
			subject: 'ip:203.0.113.7'
		});
	});

	it.each([
		['the honeypot is filled', { ...valid, form_extra: 'http://spam' }, BROWSER_UA],
		['the form was submitted too fast', { ...valid, _timeToken: 200 }, BROWSER_UA],
		['the user agent is a bot', valid, 'python-requests/2.31'],
		['the user agent is a crawler', valid, 'Mozilla/5.0 (compatible; Googlebot/2.1)']
	])('fakes success and saves nothing when %s', async (_label, body, userAgent) => {
		const response = await call(body, userAgent);

		expect(await response.json()).toEqual({ ok: true });
		expect(createBetaSignupMock).not.toHaveBeenCalled();
	});

	it('counts a real signup as a submit for its variant in the copy experiment', async () => {
		await call(valid);

		expect(createBetaSignupMock).toHaveBeenCalledWith(
			expect.objectContaining({ variant: VARIANT })
		);
		expect(recordCtaExperimentEventMock).toHaveBeenCalledWith(
			expect.objectContaining({
				experiment: BETA_CARD_EXPERIMENT,
				variant: VARIANT,
				event: 'submitted',
				fingerprint: 'fp-123'
			})
		);
	});

	it('does not count bot-flagged addresses or bot traffic as submits', async () => {
		createBetaSignupMock.mockResolvedValueOnce({ ok: true, alerted: false, recorded: false });
		await call(valid);
		await call(valid, 'python-requests/2.31');

		expect(recordCtaExperimentEventMock).not.toHaveBeenCalled();
	});

	it('rejects an unknown surface, variant, or off-site source path', async () => {
		expect((await call({ ...valid, variant: 'made_up' })).status).toBe(400);
		expect((await call({ ...valid, surface: 'homepage' })).status).toBe(400);
		expect((await call({ ...valid, sourcePath: 'https://evil.example/x' })).status).toBe(400);
		expect(createBetaSignupMock).not.toHaveBeenCalled();
	});

	it('returns 429 once the visitor is over the limit', async () => {
		consumeApiRateLimitMock.mockResolvedValueOnce({ allowed: false, retryAfterSeconds: 3600 });

		const response = await call(valid);

		expect(response.status).toBe(429);
		expect(createBetaSignupMock).not.toHaveBeenCalled();
	});

	it('passes validation messages from the signup back to the card', async () => {
		createBetaSignupMock.mockResolvedValueOnce({
			ok: false,
			status: 400,
			message: 'That email doesn’t look right.'
		});

		const response = await call(valid);

		expect(response.status).toBe(400);
		expect(await response.json()).toEqual({ ok: false, message: 'That email doesn’t look right.' });
	});
});
