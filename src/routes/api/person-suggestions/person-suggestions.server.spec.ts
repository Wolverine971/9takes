import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
	rate: vi.fn(),
	verify: vi.fn(),
	db: vi.fn(),
	from: vi.fn(),
	count: vi.fn(),
	insert: vi.fn(),
	send: vi.fn()
}));
vi.mock('$lib/server/apiRateLimit', () => ({ consumeApiRateLimit: mocks.rate }));
vi.mock('$lib/server/personSuggestionVerification', () => ({
	verifyPersonSuggestionToken: mocks.verify
}));
vi.mock('$lib/server/supabaseAdmin', () => ({ getSupabaseAdminClient: mocks.db }));
vi.mock('$lib/email/sender', () => ({ sendEmail: mocks.send }));
vi.mock('$lib/utils/logger', () => ({ logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn() } }));
import { POST } from './+server';

const valid = {
	email: 'Reader@example.com',
	suggestedPerson: ' Courtney Love ',
	'cf-turnstile-response': 'fresh-token'
};
function call(body: unknown, contentType = 'application/json') {
	return POST({
		request: new Request('https://9takes.com/api/person-suggestions', {
			method: 'POST',
			headers: { 'content-type': contentType },
			body: contentType === 'application/json' ? JSON.stringify(body) : (body as string)
		}),
		getClientAddress: () => '203.0.113.1'
	} as Parameters<typeof POST>[0]);
}

describe('POST /api/person-suggestions', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mocks.rate.mockResolvedValue({ allowed: true });
		mocks.verify.mockResolvedValue('verified');
		mocks.count.mockResolvedValue({ count: 0, error: null });
		mocks.insert.mockResolvedValue({ error: null });
		mocks.from.mockReturnValue({
			select: () => ({ eq: () => ({ gte: mocks.count }) }),
			insert: mocks.insert
		});
		mocks.db.mockReturnValue({ from: mocks.from });
	});

	it('saves a verified suggestion without emailing the supplied address', async () => {
		const response = await call(valid);
		expect(await response.json()).toEqual({ ok: true });
		expect(mocks.verify).toHaveBeenCalledWith('fresh-token', '203.0.113.1');
		expect(mocks.insert).toHaveBeenCalledWith([
			{ email: 'reader@example.com', person_name: 'Courtney Love' }
		]);
		expect(mocks.send).not.toHaveBeenCalled();
	});

	it('accepts browser FormData after verification', async () => {
		const request = new Request('https://9takes.com/api/person-suggestions', {
			method: 'POST',
			body: new URLSearchParams(valid)
		});
		const response = await POST({ request, getClientAddress: () => '203.0.113.1' } as Parameters<
			typeof POST
		>[0]);
		expect(response.status).toBe(200);
		expect(mocks.insert).toHaveBeenCalledOnce();
	});

	it('blocks the observed direct-post spam without a token before any database access', async () => {
		const response = await call({
			email: 'random@example.com',
			suggestedPerson: 'xZeuWOoPQjUJFFnlbXZwJgzt'
		});
		expect(response.status).toBe(400);
		expect((await response.json()).code).toBe('verification_failed');
		expect(mocks.rate).not.toHaveBeenCalled();
		expect(mocks.db).not.toHaveBeenCalled();
		expect(mocks.send).not.toHaveBeenCalled();
	});

	it('silently discards honeypot submissions without persistence or email', async () => {
		expect(await (await call({ ...valid, form_extra: 'spam' })).json()).toEqual({ ok: true });
		expect(mocks.rate).not.toHaveBeenCalled();
		expect(mocks.db).not.toHaveBeenCalled();
		expect(mocks.send).not.toHaveBeenCalled();
	});

	it.each([
		['invalid', 400],
		['unavailable', 503]
	])('does not persist when verification is %s', async (result, status) => {
		mocks.verify.mockResolvedValue(result);
		expect((await call(valid)).status).toBe(status);
		expect(mocks.db).not.toHaveBeenCalled();
		expect(mocks.send).not.toHaveBeenCalled();
	});

	it('retains IP rate limiting before provider verification', async () => {
		mocks.rate.mockResolvedValue({ allowed: false, retryAfterSeconds: 86400 });
		const response = await call(valid);
		expect(response.status).toBe(429);
		expect(response.headers.get('retry-after')).toBe('86400');
		expect(mocks.verify).not.toHaveBeenCalled();
	});

	it('retains the per-email limit', async () => {
		mocks.count.mockResolvedValue({ count: 3 });
		expect((await call(valid)).status).toBe(429);
		expect(mocks.insert).not.toHaveBeenCalled();
	});

	it.each([
		[{ count: null, error: new Error('offline') }, null, 503],
		[{ count: 0, error: null }, { error: new Error('insert failed') }, 500]
	])('reports persistence failure without sending email', async (count, insert, status) => {
		mocks.count.mockResolvedValue(count);
		if (insert) mocks.insert.mockResolvedValue(insert);
		expect((await call(valid)).status).toBe(status);
		expect(mocks.send).not.toHaveBeenCalled();
	});

	it.each([null, [], 'invalid'])('rejects malformed JSON shapes', async (body) => {
		expect((await call(body)).status).toBe(400);
		expect(mocks.db).not.toHaveBeenCalled();
	});

	it('rejects malformed multipart bodies', async () => {
		expect((await call('not a form', 'multipart/form-data')).status).toBe(400);
		expect(mocks.db).not.toHaveBeenCalled();
	});
});
