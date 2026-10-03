// src/routes/api/analytics/background-telemetry.server.spec.ts
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('$env/static/public', () => ({
	PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
	PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test'
}));

vi.mock('$lib/utils/logger', () => ({
	logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
	withApiLogging: (handler: unknown) => handler
}));

import { POST as pageView } from './page-view/+server';
import { POST as pagePing } from './page-ping/+server';
import { POST as pageExit } from './page-exit/+server';

const payload = {
	visit_key: '550e8400-e29b-41d4-a716-446655440000',
	session_key: 'session-123',
	fingerprint: 'visitor-123',
	path: '/personality-analysis/john-doe',
	path_group: '/personality-analysis/[slug]',
	engaged_ms_delta: 1000,
	max_scroll_pct: 50
};

afterEach(() => vi.unstubAllGlobals());

describe.each([
	['page-view', pageView, 'upsert_page_analytics_visit'],
	['page-ping', pagePing, 'record_page_analytics_ping'],
	['page-exit', pageExit, 'record_page_analytics_ping']
] as const)('%s background telemetry', (path, handler, rpcName) => {
	it.each([null, 'captured-user-jwt'])(
		'detaches cookie auth before returning (%s)',
		async (token) => {
			const authReady = Promise.withResolvers<void>();
			const writeReady = Promise.withResolvers<void>();
			let responseGenerated = false;
			const getSession = vi.fn(async () => {
				await authReady.promise;
				if (responseGenerated) throw new Error('Cannot set cookies after response');
				return { data: { session: token ? { access_token: token } : null }, error: null };
			});
			const requestRpc = vi.fn(() => {
				throw new Error('Background work must not reuse the cookie-backed client');
			});
			const fetchMock = vi.fn(async (_url: unknown, _init: RequestInit) => {
				await writeReady.promise;
				return new Response('[]', { status: 200, headers: { 'Content-Type': 'application/json' } });
			});
			vi.stubGlobal('fetch', fetchMock);
			const waitUntil = vi.fn();
			const responsePromise = handler({
				request: new Request(`https://9takes.test/api/analytics/${path}`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(payload)
				}),
				locals: {
					supabase: { auth: { getSession }, rpc: requestRpc },
					session: token ? { user: { id: 'verified-user' } } : null
				},
				platform: { context: { waitUntil } }
			} as any).then((response) => {
				responseGenerated = true;
				return response;
			});

			await vi.waitFor(() => expect(getSession).toHaveBeenCalledOnce());
			expect(responseGenerated).toBe(false);
			expect(fetchMock).not.toHaveBeenCalled();
			authReady.resolve();
			const response = await responsePromise;
			expect(response.status).toBe(200);
			expect(await response.json()).toMatchObject({ ok: true, queued: true });
			expect(waitUntil).toHaveBeenCalledOnce();

			// The database write may finish after response generation, with no more
			// reads/refreshes of request cookies and with the original caller's JWT.
			writeReady.resolve();
			await waitUntil.mock.calls[0][0];
			expect(getSession).toHaveBeenCalledOnce();
			expect(requestRpc).not.toHaveBeenCalled();
			expect(fetchMock).toHaveBeenCalledOnce();
			const [url, init] = fetchMock.mock.calls[0];
			expect(String(url)).toContain(`/rest/v1/rpc/${rpcName}`);
			const headers = new Headers(init.headers);
			expect(headers.get('apikey')).toBe('sb_publishable_test');
			expect(headers.get('authorization')).toBe(`Bearer ${token ?? 'sb_publishable_test'}`);
			if (path === 'page-view') {
				expect(JSON.parse(String(init.body)).p_user_id).toBe(token ? 'verified-user' : null);
			}
		}
	);
});
