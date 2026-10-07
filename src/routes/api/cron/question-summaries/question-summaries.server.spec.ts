// src/routes/api/cron/question-summaries/question-summaries.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { refreshMock, createLlmMock } = vi.hoisted(() => ({
	refreshMock: vi.fn(),
	createLlmMock: vi.fn()
}));

vi.mock('$env/static/private', () => ({
	CRON_SECRET: 'cron-test-secret',
	PRIVATE_OPENROUTER_API_KEY: 'or-test-key'
}));
vi.mock('$lib/server/supabaseAdmin', () => ({ getSupabaseAdminClient: () => ({ from: vi.fn() }) }));
vi.mock('$lib/server/questionAnswerSummary', () => ({
	refreshQuestionSummaries: refreshMock,
	createOpenRouterSummaryLlm: createLlmMock
}));

import { config, GET, POST } from './+server';

function cronEvent(options: { secret?: string | null; query?: string } = {}) {
	const headers: Record<string, string> = {};
	if (options.secret !== null)
		headers.authorization = `Bearer ${options.secret ?? 'cron-test-secret'}`;
	const url = new URL(`https://9takes.com/api/cron/question-summaries${options.query ?? ''}`);
	return { request: new Request(url, { headers }), url } as never;
}

const REPORT = {
	dryRun: false,
	liveQuestions: 47,
	needingWork: 3,
	attempted: 3,
	generated: [{ questionId: 1, sourceCommentCount: 4, model: 'm' }],
	failed: [],
	deleted: [],
	deferred: 0
};

describe('/api/cron/question-summaries', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		refreshMock.mockResolvedValue(REPORT);
		createLlmMock.mockReturnValue(vi.fn());
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
		expect(refreshMock).not.toHaveBeenCalled();
		expect(createLlmMock).not.toHaveBeenCalled();
	});

	it('refreshes at most 10 questions inside a time budget', async () => {
		const response = await GET(cronEvent());
		expect(response.status).toBe(200);
		await expect(response.json()).resolves.toEqual(REPORT);
		expect(createLlmMock).toHaveBeenCalledWith(
			expect.objectContaining({ apiKey: 'or-test-key', timeoutMs: 45_000 })
		);
		expect(refreshMock).toHaveBeenCalledWith(
			expect.objectContaining({ limit: 10, budgetMs: 120_000 })
		);
	});

	it('clamps the limit query param to 1..10', async () => {
		await GET(cronEvent({ query: '?limit=500' }));
		expect(refreshMock.mock.calls[0][0].limit).toBe(10);
		await GET(cronEvent({ query: '?limit=2' }));
		expect(refreshMock.mock.calls[1][0].limit).toBe(2);
		await GET(cronEvent({ query: '?limit=-4' }));
		expect(refreshMock.mock.calls[2][0].limit).toBe(10);
	});

	it('returns 500 when the run crashes', async () => {
		refreshMock.mockRejectedValue(new Error('db down'));
		await expect(GET(cronEvent())).rejects.toMatchObject({ status: 500 });
	});
});
