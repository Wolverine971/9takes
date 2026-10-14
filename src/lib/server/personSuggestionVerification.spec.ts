import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { environment, appEnvironment } = vi.hoisted(() => ({
	environment: { TURNSTILE_SECRET_KEY: 'test-secret' },
	appEnvironment: { dev: false }
}));
vi.mock('$env/dynamic/private', () => ({ env: environment }));
vi.mock('$app/environment', () => appEnvironment);
vi.mock('$lib/utils/logger', () => ({ logger: { error: vi.fn(), warn: vi.fn() } }));
import { verifyPersonSuggestionToken } from './personSuggestionVerification';

const fetchMock = vi.fn();
const verified = { success: true, action: 'person_suggestion', hostname: '9takes.com' };

describe('person suggestion Turnstile verification', () => {
	beforeEach(() => {
		environment.TURNSTILE_SECRET_KEY = 'test-secret';
		appEnvironment.dev = false;
		fetchMock.mockReset().mockResolvedValue(Response.json(verified));
		vi.stubGlobal('fetch', fetchMock);
	});
	afterEach(() => vi.unstubAllGlobals());

	it('redeems the token server-side with the configured secret and trusted client address', async () => {
		expect(await verifyPersonSuggestionToken('fresh-token', '203.0.113.1')).toBe('verified');
		const [url, options] = fetchMock.mock.calls[0];
		expect(url).toBe('https://challenges.cloudflare.com/turnstile/v0/siteverify');
		expect(Object.fromEntries(options.body)).toEqual({
			secret: 'test-secret',
			response: 'fresh-token',
			remoteip: '203.0.113.1'
		});
		expect(options.signal).toBeInstanceOf(AbortSignal);
	});

	it.each([undefined, '', '  ', {}, 'x'.repeat(2049)])(
		'rejects invalid tokens without calling the provider: %j',
		async (token) => {
			expect(await verifyPersonSuggestionToken(token, '203.0.113.1')).toBe('invalid');
			expect(fetchMock).not.toHaveBeenCalled();
		}
	);

	it.each([
		{ ...verified, success: false, 'error-codes': ['timeout-or-duplicate'] },
		{ ...verified, success: 'true' },
		{ ...verified, action: 'login' },
		{ ...verified, hostname: 'attacker.example' },
		{ ...verified, hostname: 'localhost' },
		{ success: true }
	])('rejects failed, replayed, wrong-action and wrong-host tokens: %j', async (result) => {
		fetchMock.mockResolvedValue(Response.json(result));
		expect(await verifyPersonSuggestionToken('token', '203.0.113.1')).toBe('invalid');
	});

	it('fails closed when credentials are missing', async () => {
		environment.TURNSTILE_SECRET_KEY = '';
		expect(await verifyPersonSuggestionToken('token', '203.0.113.1')).toBe('unavailable');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it.each([
		new Response('offline', { status: 503 }),
		new Response('not-json'),
		Response.json(null)
	])('fails closed on provider failures', async (response) => {
		fetchMock.mockResolvedValue(response);
		expect(await verifyPersonSuggestionToken('token', '203.0.113.1')).toBe('unavailable');
	});

	it('fails closed on timeout or network failure', async () => {
		fetchMock.mockRejectedValue(new Error('timeout'));
		expect(await verifyPersonSuggestionToken('token', '203.0.113.1')).toBe('unavailable');
	});
});
