// src/routes/api/cron/classify-questions/classify-questions.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { fileMock } = vi.hoisted(() => ({ fileMock: vi.fn() }));

vi.mock('$env/static/private', () => ({
	CRON_SECRET: 'cron-test-secret',
	PRIVATE_OPENROUTER_API_KEY: 'or-test-key'
}));
vi.mock('$lib/server/supabaseAdmin', () => ({ getSupabaseAdminClient: () => ({ from: vi.fn() }) }));
vi.mock('$lib/server/questionTopics', () => ({ fileQuestionsNeedingTopics: fileMock }));

import { config, GET, POST } from './+server';

function cronEvent(options: { secret?: string | null; query?: string } = {}) {
	const headers: Record<string, string> = {};
	if (options.secret !== null)
		headers.authorization = `Bearer ${options.secret ?? 'cron-test-secret'}`;
	const url = new URL(`https://9takes.com/api/cron/classify-questions${options.query ?? ''}`);
	return { request: new Request(url, { headers }), url } as never;
}

describe('/api/cron/classify-questions', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		fileMock.mockResolvedValue({
			candidates: 2,
			filed: [
				{ id: 9, status: 'applied', topics: ['friends'] },
				{ id: 8, status: 'abstained', topics: [] }
			],
			errors: []
		});
	});

	it('gets its own 300 s limit', () => {
		expect(config).toEqual({ maxDuration: 300 });
	});

	it.each([
		['a missing', null],
		['a wrong', 'nope']
	])('rejects %s cron secret with 401 before doing any work', async (_label, secret) => {
		await expect(GET(cronEvent({ secret }))).rejects.toMatchObject({ status: 401 });
		await expect(POST(cronEvent({ secret }))).rejects.toMatchObject({ status: 401 });
		expect(fileMock).not.toHaveBeenCalled();
	});

	it('files a default batch and reports what happened', async () => {
		const response = await GET(cronEvent());
		expect(fileMock).toHaveBeenCalledWith(expect.anything(), 25);
		expect(await response.json()).toMatchObject({
			message: 'Filed 2 of 2',
			candidates: 2,
			errors: []
		});
	});

	it('clamps the batch size', async () => {
		await GET(cronEvent({ query: '?limit=5000' }));
		expect(fileMock).toHaveBeenLastCalledWith(expect.anything(), 60);
		await GET(cronEvent({ query: '?limit=-3' }));
		expect(fileMock).toHaveBeenLastCalledWith(expect.anything(), 1);
		await GET(cronEvent({ query: '?limit=abc' }));
		expect(fileMock).toHaveBeenLastCalledWith(expect.anything(), 25);
	});

	it('says so when nothing needs topics', async () => {
		fileMock.mockResolvedValue({ candidates: 0, filed: [], errors: [] });
		const response = await POST(cronEvent());
		expect((await response.json()).message).toBe('Every question has current topics');
	});

	it('returns 500 when the run itself fails', async () => {
		fileMock.mockRejectedValue(new Error('database unavailable'));
		await expect(GET(cronEvent())).rejects.toMatchObject({ status: 500 });
	});
});
