// vercel-functions/one-click-unsubscribe.spec.ts
import { describe, expect, it, vi } from 'vitest';

import { handleOneClickUnsubscribe } from './one-click-unsubscribe';

const TRACKING_ID = '123e4567-e89b-12d3-a456-426614174000';
const ENDPOINT = `https://9takes.com/api/one-click-unsubscribe?tracking_id=${TRACKING_ID}`;
const ONE_CLICK_BODY = 'List-Unsubscribe=One-Click';

function createSupabaseStub(result: { data?: unknown; error?: unknown } = { data: 'a@b.com' }) {
	return { rpc: vi.fn().mockResolvedValue(result) };
}

/**
 * The exact request Gmail and Yahoo send for RFC 8058. Note the deliberate
 * absence of an Origin header - that is what SvelteKit's CSRF guard rejects,
 * and the reason this endpoint lives outside the SvelteKit router.
 */
function providerRequest(init: RequestInit = {}) {
	return new Request(ENDPOINT, {
		method: 'POST',
		headers: { 'content-type': 'application/x-www-form-urlencoded' },
		body: ONE_CLICK_BODY,
		...init
	});
}

describe('/api/one-click-unsubscribe', () => {
	it('accepts the provider POST that has no Origin header', async () => {
		const supabase = createSupabaseStub();
		const request = providerRequest();

		expect(request.headers.get('origin')).toBeNull();

		const response = await handleOneClickUnsubscribe(request, { supabase });

		expect(response.status).toBe(200);
		expect(supabase.rpc).toHaveBeenCalledWith('track_email_unsubscribe', {
			p_tracking_id: TRACKING_ID,
			p_ip_address: 'unknown',
			p_user_agent: 'unknown'
		});
	});

	it('forwards the client IP and user agent for the audit trail', async () => {
		const supabase = createSupabaseStub();

		await handleOneClickUnsubscribe(
			providerRequest({
				headers: {
					'content-type': 'application/x-www-form-urlencoded',
					'x-forwarded-for': '203.0.113.7, 70.41.3.18',
					'user-agent': 'Google-Mail-Unsubscriber'
				}
			}),
			{ supabase }
		);

		expect(supabase.rpc).toHaveBeenCalledWith('track_email_unsubscribe', {
			p_tracking_id: TRACKING_ID,
			p_ip_address: '203.0.113.7',
			p_user_agent: 'Google-Mail-Unsubscriber'
		});
	});

	it('rejects GET so state never changes through a link scanner', async () => {
		const supabase = createSupabaseStub();

		const response = await handleOneClickUnsubscribe(new Request(ENDPOINT, { method: 'GET' }), {
			supabase
		});

		expect(response.status).toBe(405);
		expect(response.headers.get('allow')).toBe('POST');
		expect(supabase.rpc).not.toHaveBeenCalled();
	});

	it('rejects a non-form content type', async () => {
		const supabase = createSupabaseStub();

		const response = await handleOneClickUnsubscribe(
			new Request(ENDPOINT, {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: '{}'
			}),
			{ supabase }
		);

		expect(response.status).toBe(415);
		expect(supabase.rpc).not.toHaveBeenCalled();
	});

	it('accepts a charset-qualified form content type', async () => {
		const supabase = createSupabaseStub();

		const response = await handleOneClickUnsubscribe(
			new Request(ENDPOINT, {
				method: 'POST',
				headers: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' },
				body: ONE_CLICK_BODY
			}),
			{ supabase }
		);

		expect(response.status).toBe(200);
	});

	it('rejects a body that is not the RFC 8058 payload', async () => {
		const supabase = createSupabaseStub();

		const response = await handleOneClickUnsubscribe(
			providerRequest({ body: 'List-Unsubscribe=Whatever' }),
			{ supabase }
		);

		expect(response.status).toBe(400);
		expect(supabase.rpc).not.toHaveBeenCalled();
	});

	it('rejects a malformed tracking id without touching Supabase', async () => {
		const supabase = createSupabaseStub();

		const response = await handleOneClickUnsubscribe(
			new Request('https://9takes.com/api/one-click-unsubscribe?tracking_id=not-a-uuid', {
				method: 'POST',
				headers: { 'content-type': 'application/x-www-form-urlencoded' },
				body: ONE_CLICK_BODY
			}),
			{ supabase }
		);

		expect(response.status).toBe(404);
		expect(supabase.rpc).not.toHaveBeenCalled();
	});

	it('rejects an oversized body', async () => {
		const supabase = createSupabaseStub();

		const response = await handleOneClickUnsubscribe(providerRequest({ body: 'x'.repeat(2048) }), {
			supabase
		});

		expect(response.status).toBe(413);
		expect(supabase.rpc).not.toHaveBeenCalled();
	});

	it('returns 404 when the tracking id matches no send', async () => {
		const supabase = createSupabaseStub({ data: null });

		const response = await handleOneClickUnsubscribe(providerRequest(), { supabase });

		expect(response.status).toBe(404);
	});

	it('returns 500 when the RPC fails so the provider retries', async () => {
		const supabase = createSupabaseStub({ error: { code: '500', message: 'boom' } });
		const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

		const response = await handleOneClickUnsubscribe(providerRequest(), { supabase });

		expect(response.status).toBe(500);
		consoleError.mockRestore();
	});

	it('stays idempotent across the retries providers are allowed to send', async () => {
		const supabase = createSupabaseStub();

		const first = await handleOneClickUnsubscribe(providerRequest(), { supabase });
		const second = await handleOneClickUnsubscribe(providerRequest(), { supabase });

		expect(first.status).toBe(200);
		expect(second.status).toBe(200);
		expect(supabase.rpc).toHaveBeenCalledTimes(2);
	});

	it('returns an empty, uncacheable body', async () => {
		const supabase = createSupabaseStub();

		const response = await handleOneClickUnsubscribe(providerRequest(), { supabase });

		expect(response.headers.get('cache-control')).toBe('no-store');
		expect(await response.text()).toBe('');
	});
});
