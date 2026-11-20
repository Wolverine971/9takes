// src/routes/api/enneagram-test/enneagramTestStop.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getTestResultTypesMock, stopTestNotificationsMock } = vi.hoisted(() => ({
	getTestResultTypesMock: vi.fn(),
	stopTestNotificationsMock: vi.fn()
}));

vi.mock('$lib/server/enneagramTest', () => ({
	isResultToken: (value: string) => /^[A-Za-z0-9_-]{20,64}$/.test(value),
	getTestResultTypes: getTestResultTypesMock,
	stopTestNotifications: stopTestNotificationsMock
}));
vi.mock('$lib/server/supabaseAdmin', () => ({ getSupabaseAdminClient: () => ({}) }));
vi.mock('$lib/utils/logger', () => ({ logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn() } }));

import { GET, POST } from './stop/[token]/+server';

const TOKEN = 'r'.repeat(24);

async function call(handler: typeof GET, token: string) {
	try {
		return await handler({ params: { token } } as any);
	} catch (thrown) {
		return thrown as { status: number; location: string };
	}
}

describe('Enneagram test "stop these emails" link', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		getTestResultTypesMock.mockResolvedValue([4]);
		stopTestNotificationsMock.mockResolvedValue(true);
	});

	it('GET shows a confirm page and changes nothing', async () => {
		const response = (await call(GET, TOKEN)) as Response;

		expect(response.status).toBe(200);
		expect(response.headers.get('content-type')).toContain('text/html');
		expect(response.headers.get('cache-control')).toBe('no-store');
		expect(response.headers.get('referrer-policy')).toBe('no-referrer');
		const html = await response.text();
		expect(html).toContain(`<form method="post" action="/api/enneagram-test/stop/${TOKEN}">`);
		expect(html).toContain('Stop these emails');
		expect(stopTestNotificationsMock).not.toHaveBeenCalled();
	});

	it('GET sends malformed and unknown links back to the test without a lookup or a change', async () => {
		const malformed = await call(GET, '"><script>alert(1)</script>');
		expect(malformed).toMatchObject({ status: 303, location: '/enneagram-test' });
		expect(getTestResultTypesMock).not.toHaveBeenCalled();

		getTestResultTypesMock.mockResolvedValueOnce(null);
		const unknown = await call(GET, TOKEN);
		expect(unknown).toMatchObject({ status: 303, location: '/enneagram-test' });
		expect(stopTestNotificationsMock).not.toHaveBeenCalled();
	});

	it('POST turns the emails off and returns to the result page', async () => {
		const result = await call(POST, TOKEN);

		expect(stopTestNotificationsMock).toHaveBeenCalledWith(expect.anything(), TOKEN);
		expect(result).toMatchObject({
			status: 303,
			location: `/enneagram-test/result/${TOKEN}?emails=stopped`
		});
	});

	it('POST rejects malformed and unknown links', async () => {
		expect(await call(POST, 'short')).toMatchObject({ status: 303, location: '/enneagram-test' });
		expect(stopTestNotificationsMock).not.toHaveBeenCalled();

		stopTestNotificationsMock.mockResolvedValueOnce(false);
		expect(await call(POST, TOKEN)).toMatchObject({ status: 303, location: '/enneagram-test' });
	});

	it('reports a failed update instead of claiming success', async () => {
		stopTestNotificationsMock.mockRejectedValueOnce(new Error('db down'));
		const response = (await call(POST, TOKEN)) as Response;
		expect(response.status).toBe(500);
		expect(await response.text()).toContain('Something went wrong');
	});
});
