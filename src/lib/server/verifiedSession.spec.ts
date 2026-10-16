import { createHmac, randomUUID, webcrypto } from 'node:crypto';
import { createServerClient } from '@supabase/ssr';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { getVerifiedSession, requiresFreshUser } from './verifiedSession';

const url = 'https://auth-upgrade-test.supabase.co';
const userId = '00000000-0000-4000-8000-000000000001';
const user = { id: userId, aud: 'authenticated', email: 'current@example.com' };
let keyPair: webcrypto.CryptoKeyPair;
let publicKey: object;

const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString('base64url');
const claims = () => ({
	iss: `${url}/auth/v1`,
	sub: userId,
	aud: 'authenticated',
	role: 'authenticated',
	email: 'token@example.com',
	iat: Math.floor(Date.now() / 1000),
	exp: Math.floor(Date.now() / 1000) + 3600,
	user_metadata: { admin: true }
});

beforeAll(async () => {
	keyPair = await webcrypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, [
		'sign',
		'verify'
	]);
	publicKey = {
		...(await webcrypto.subtle.exportKey('jwk', keyPair.publicKey)),
		kid: 'test-key',
		alg: 'ES256',
		use: 'sig'
	};
});

async function sign(payload = claims()) {
	const body = `${encode({ alg: 'ES256', kid: 'test-key', typ: 'JWT' })}.${encode(payload)}`;
	const signature = await webcrypto.subtle.sign(
		{ name: 'ECDSA', hash: 'SHA-256' },
		keyPair.privateKey,
		Buffer.from(body)
	);
	return `${body}.${Buffer.from(signature).toString('base64url')}`;
}

function createFixture(
	token: string | null,
	options: { refreshToken?: string; rejectUser?: boolean } = {}
) {
	const cookieName = `sb-test-${randomUUID()}-auth-token`;
	const cookies = new Map<string, string>();
	const session = (accessToken: string) => ({
		access_token: accessToken,
		refresh_token: 'synthetic-refresh-token',
		expires_at: JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64url').toString()).exp,
		token_type: 'bearer',
		// The cookie user and its metadata must never become the verified identity.
		user: { ...user, id: 'forged-cookie-user', user_metadata: { admin: true } }
	});
	if (token) cookies.set(cookieName, `base64-${encode(session(token))}`);
	const setAll = vi.fn((values, _headers) => {
		for (const { name, value } of values) cookies.set(name, value);
	});
	const fetch = vi.fn(async (input: RequestInfo | URL) => {
		const path = new URL(String(input)).pathname;
		if (path.endsWith('/.well-known/jwks.json')) return Response.json({ keys: [publicKey] });
		if (path.endsWith('/user')) {
			return options.rejectUser
				? Response.json({ message: 'User not found', code: 'user_not_found' }, { status: 401 })
				: Response.json(user);
		}
		if (path.endsWith('/token')) {
			return options.refreshToken
				? Response.json({ ...session(options.refreshToken), user, expires_in: 3600 })
				: Response.json(
						{ message: 'Invalid refresh token', code: 'refresh_token_not_found' },
						{ status: 400 }
					);
		}
		throw new Error(`Unexpected request: ${path}`);
	});
	const makeClient = () =>
		createServerClient(url, 'synthetic-publishable-key', {
			cookieOptions: { name: cookieName },
			global: { fetch },
			cookies: {
				getAll: () => Array.from(cookies, ([name, value]) => ({ name, value })),
				setAll
			}
		});
	return { makeClient, fetch, setAll };
}

describe('verified sessions with the real Supabase SSR client', () => {
	it('uses signed identity, excludes metadata, and shares only public keys across requests', async () => {
		const fixture = createFixture(await sign());
		const expectedUser = { id: userId, aud: 'authenticated', email: 'token@example.com' };
		expect(await getVerifiedSession(fixture.makeClient().auth, false)).toEqual({
			user: expectedUser,
			session: { user: expectedUser }
		});
		expect(fixture.fetch).toHaveBeenCalledTimes(1);
		expect(String(fixture.fetch.mock.calls[0][0])).toContain('/.well-known/jwks.json');
		fixture.fetch.mockClear();
		expect((await getVerifiedSession(fixture.makeClient().auth, false)).user?.id).toBe(userId);
		expect(fixture.fetch).not.toHaveBeenCalled();
	});

	it('does not authenticate a tampered JWT even if the cookie contains a user', async () => {
		const token = await sign();
		const [header, , signature] = token.split('.');
		const fixture = createFixture(
			`${header}.${encode({ ...claims(), sub: 'forged' })}.${signature}`
		);
		expect(await getVerifiedSession(fixture.makeClient().auth, false)).toEqual({
			session: null,
			user: null
		});
	});

	it.each([{ sub: '' }, { aud: 'other-app' }, { role: 'service_role' }])(
		'rejects signed claims that do not identify an authenticated user: %j',
		async (overrides) => {
			const fixture = createFixture(await sign({ ...claims(), ...overrides }));
			expect(await getVerifiedSession(fixture.makeClient().auth, false)).toEqual({
				session: null,
				user: null
			});
		}
	);

	it('keeps legacy HS256 sessions working through server verification', async () => {
		const body = `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode(claims())}`;
		const token = `${body}.${createHmac('sha256', 'test-only-secret').update(body).digest('base64url')}`;
		const fixture = createFixture(token);
		expect((await getVerifiedSession(fixture.makeClient().auth, false)).user?.id).toBe(userId);
		expect(fixture.fetch).toHaveBeenCalledTimes(1);
		expect(String(fixture.fetch.mock.calls[0][0])).toContain('/user');
	});

	it('uses fresh user details for sensitive requests without also checking claims', async () => {
		const fixture = createFixture(await sign());
		expect((await getVerifiedSession(fixture.makeClient().auth, true)).user).toEqual(user);
		expect(fixture.fetch).toHaveBeenCalledTimes(1);
		expect(String(fixture.fetch.mock.calls[0][0])).toContain('/user');
	});

	it('rejects a user rejected by Auth even with an otherwise valid signed token', async () => {
		const fixture = createFixture(await sign(), { rejectUser: true });
		expect(await getVerifiedSession(fixture.makeClient().auth, true)).toEqual({
			session: null,
			user: null
		});
	});

	it('refreshes an expired session and writes refreshed cookies with private cache headers', async () => {
		const expired = await sign({ ...claims(), exp: Math.floor(Date.now() / 1000) - 60 });
		const fixture = createFixture(expired, { refreshToken: await sign() });
		expect((await getVerifiedSession(fixture.makeClient().auth, false)).user?.id).toBe(userId);
		expect(fixture.fetch.mock.calls.map(([input]) => new URL(String(input)).pathname)).toEqual([
			'/auth/v1/token',
			'/auth/v1/.well-known/jwks.json'
		]);
		expect(fixture.setAll).toHaveBeenCalledWith(
			expect.arrayContaining([
				expect.objectContaining({ value: expect.stringMatching(/^base64-/) })
			]),
			expect.objectContaining({ 'Cache-Control': expect.stringContaining('private') })
		);
	});

	it('does not trust an expired session after refresh fails', async () => {
		const fixture = createFixture(
			await sign({ ...claims(), exp: Math.floor(Date.now() / 1000) - 60 })
		);
		expect(await getVerifiedSession(fixture.makeClient().auth, false)).toEqual({
			session: null,
			user: null
		});
	});

	it('returns no user without a session and makes no requests', async () => {
		const fixture = createFixture(null);
		expect(await getVerifiedSession(fixture.makeClient().auth, false)).toEqual({
			session: null,
			user: null
		});
		expect(fixture.fetch).not.toHaveBeenCalled();
	});
});

describe('fresh user policy', () => {
	it.each([
		'/questions',
		'/questions/[slug]',
		'/api/auth-shell',
		'/api/notifications/unread',
		'/users/[externalId]'
	])('uses claims for ordinary reads at %s', (route) => {
		expect(requiresFreshUser('GET', route)).toBe(false);
		expect(requiresFreshUser('HEAD', route)).toBe(false);
	});
	it.each([
		'/admin',
		'/admin/users/__data.json',
		'/api/admin/analytics/overview',
		'/account',
		'/account/unsubscribe',
		'/login',
		'/resetPassword',
		'/forgotPassword',
		'/register',
		'/auth/callback',
		'/logout',
		'/api/blog-versions/[id]',
		'/api/update-questions'
	])('checks fresh identity on %s', (route) => expect(requiresFreshUser('GET', route)).toBe(true));
	it.each(['POST', 'PUT', 'PATCH', 'DELETE'])(
		'checks fresh identity for %s even on ordinary routes',
		(method) => expect(requiresFreshUser(method, '/questions/[slug]')).toBe(true)
	);
});
