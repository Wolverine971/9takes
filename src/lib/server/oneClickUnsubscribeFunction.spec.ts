// src/lib/server/oneClickUnsubscribeFunction.spec.ts
import { describe, expect, it, vi } from 'vitest';

import { handleOneClickUnsubscribe } from '../../../api/one-click-unsubscribe';

const TRACKING_ID = '550e8400-e29b-41d4-a716-446655440000';

function requestFor(body: string, overrides: RequestInit = {}) {
	return new Request(`https://9takes.com/api/one-click-unsubscribe?tracking_id=${TRACKING_ID}`, {
		method: 'POST',
		headers: {
			'content-type': 'application/x-www-form-urlencoded',
			'user-agent': 'Email Provider',
			'x-forwarded-for': '192.0.2.1'
		},
		body,
		...overrides
	});
}

describe('isolated RFC 8058 unsubscribe function', () => {
	it('accepts a provider POST without Origin or cookies and returns an empty 200', async () => {
		const rpc = vi.fn().mockResolvedValue({ data: 'person@example.com', error: null });

		const response = await handleOneClickUnsubscribe(requestFor('List-Unsubscribe=One-Click'), {
			supabase: { rpc } as never
		});

		expect(response.status).toBe(200);
		expect(response.headers.get('content-length')).toBe('0');
		expect(rpc).toHaveBeenCalledWith('track_email_unsubscribe', {
			p_tracking_id: TRACKING_ID,
			p_ip_address: '192.0.2.1',
			p_user_agent: 'Email Provider'
		});
	});

	it('rejects any body other than the exact one-click form value', async () => {
		const rpc = vi.fn();

		const response = await handleOneClickUnsubscribe(
			requestFor('List-Unsubscribe=One-Click&extra=true'),
			{ supabase: { rpc } as never }
		);

		expect(response.status).toBe(400);
		expect(rpc).not.toHaveBeenCalled();
	});

	it('is idempotent from the HTTP caller perspective', async () => {
		const rpc = vi.fn().mockResolvedValue({ data: 'person@example.com', error: null });

		for (let attempt = 0; attempt < 2; attempt += 1) {
			const response = await handleOneClickUnsubscribe(requestFor('List-Unsubscribe=One-Click'), {
				supabase: { rpc } as never
			});
			expect(response.status).toBe(200);
		}

		expect(rpc).toHaveBeenCalledTimes(2);
	});
});
