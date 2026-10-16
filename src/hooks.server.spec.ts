import type { RequestEvent } from '@sveltejs/kit';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { createServerClient, getClaims, getUser } = vi.hoisted(() => ({
	createServerClient: vi.fn(),
	getClaims: vi.fn(),
	getUser: vi.fn()
}));
vi.mock('@supabase/ssr', () => ({ createServerClient }));
vi.mock('$app/environment', () => ({ dev: false }));
vi.mock('$env/static/public', () => ({
	PUBLIC_SUPABASE_URL: 'https://auth-test.supabase.co',
	PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'synthetic-key'
}));
vi.mock('$lib/server/contentAccessStore', () => ({ recordSharedContentAccessEvent: vi.fn() }));
vi.mock('$lib/server/bestEffortTelemetry', () => ({ runBestEffortTelemetry: vi.fn() }));

import { handle } from './hooks.server';

function fixture(path: string, { cookie = true, method = 'GET', route = path } = {}) {
	const cookies = new Map(cookie ? [['sb-auth-test-auth-token.0', 'synthetic-session']] : []);
	const event = {
		url: new URL(path, 'https://9takes.com'),
		request: new Request(new URL(path, 'https://9takes.com'), { method }),
		route: { id: route },
		locals: {},
		cookies: {
			getAll: () => Array.from(cookies, ([name, value]) => ({ name, value })),
			get: (name: string) => cookies.get(name),
			set: (name: string, value: string) => cookies.set(name, value),
			serialize: (name: string, value: string) => `${name}=${value}`
		},
		getClientAddress: () => '127.0.0.1',
		fetch: vi.fn()
	} as unknown as RequestEvent;
	const resolve = vi.fn(async () => new Response('ok'));
	return { event, resolve };
}

beforeEach(() => {
	vi.clearAllMocks();
	createServerClient.mockReturnValue({ auth: { getClaims, getUser } });
	getClaims.mockResolvedValue({
		data: { claims: { sub: 'verified-id', aud: 'authenticated', role: 'authenticated' } },
		error: null
	});
	getUser.mockResolvedValue({
		data: { user: { id: 'fresh-id', aud: 'authenticated' } },
		error: null
	});
});

describe('request authentication', () => {
	it('uses claims for signed-in pages and keeps the result private', async () => {
		const context = fixture('/questions');
		const response = await handle(context);
		expect(context.event.locals.user?.id).toBe('verified-id');
		expect(getClaims).toHaveBeenCalledTimes(1);
		expect(getUser).not.toHaveBeenCalled();
		expect(response.headers.get('cache-control')).toBe('private, no-store');
	});

	it('uses the matched route to recognize an encoded admin path', async () => {
		const context = fixture('/%61dmin/users', { route: '/admin/users' });
		await handle(context);
		expect(context.event.locals.user?.id).toBe('fresh-id');
		expect(getUser).toHaveBeenCalledTimes(1);
		expect(getClaims).not.toHaveBeenCalled();
	});

	it('keeps fresh verification on ordinary page actions', async () => {
		await handle(fixture('/questions', { method: 'POST' }));
		expect(getUser).toHaveBeenCalledTimes(1);
		expect(getClaims).not.toHaveBeenCalled();
	});

	it.each([
		['/questions', false],
		['/personality-analysis/scott-galloway', true],
		['/api/search/typeahead', true]
	] as const)('skips auth for %s (cookie: %s)', async (path, cookie) => {
		const context = fixture(path, { cookie });
		await handle(context);
		expect(context.event.locals.user).toBeNull();
		expect(getClaims).not.toHaveBeenCalled();
		expect(getUser).not.toHaveBeenCalled();
	});

	it('re-reads a newly established session after a login callback', async () => {
		const context = fixture('/login', { cookie: false });
		await handle(context);
		expect(context.event.locals.user).toBeNull();
		context.event.cookies.set('sb-auth-test-auth-token', 'new-session', { path: '/' });
		expect((await context.event.locals.safeGetSession()).user?.id).toBe('fresh-id');
	});

	it('preserves private refresh headers even when verification ultimately fails', async () => {
		getClaims.mockImplementation(async () => {
			const { cookies } = createServerClient.mock.calls[0][2];
			cookies.setAll([{ name: 'sb-auth-test-auth-token', value: '', options: {} }], {
				'Cache-Control': 'private, no-cache, no-store, must-revalidate, max-age=0',
				Pragma: 'no-cache',
				Expires: '0'
			});
			return { data: null, error: { message: 'Expired session' } };
		});
		const context = fixture('/questions');
		const response = await handle(context);
		expect(context.event.locals.user).toBeNull();
		expect(response.headers.get('cache-control')).toContain('private');
		expect(response.headers.get('pragma')).toBe('no-cache');
		expect(response.headers.get('expires')).toBe('0');
	});
});
