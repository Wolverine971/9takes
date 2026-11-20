// src/routes/api/update-questions/updateQuestions.server.spec.ts
//
// Both verbs are admin-only. Demo mode may pick the question tables, but the
// admin check always reads `profiles`. All fixtures are synthetic.
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { checkDemoTimeMock, tagQuestionMock, updateStateMock, waitUntilMock } = vi.hoisted(() => ({
	checkDemoTimeMock: vi.fn(),
	tagQuestionMock: vi.fn(),
	updateStateMock: vi.fn(),
	waitUntilMock: vi.fn()
}));

vi.mock('@vercel/functions', () => ({ waitUntil: waitUntilMock }));
vi.mock('../../../utils/api', () => ({ checkDemoTime: checkDemoTimeMock }));
vi.mock('../../../utils/server/openai', () => ({
	getQuestionAiTaggingState: () => null,
	tagQuestion: tagQuestionMock,
	updateQuestionAiTaggingState: updateStateMock
}));
vi.mock('$lib/utils/logger', () => ({
	logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
	withApiLogging: (handler: unknown) => handler
}));

import { GET, POST } from './+server';

function buildLocals(options: { admin: boolean; signedIn?: boolean }) {
	const tables: string[] = [];
	const from = vi.fn((table: string) => {
		tables.push(table);
		const row =
			table === 'profiles'
				? { id: 'user-1', admin: options.admin, email: 'user@example.com' }
				: { id: 7, question_formatted: 'Q?', data: null, question_tag: [] };
		const chain: any = {
			select: () => chain,
			eq: () => chain,
			order: () => chain,
			limit: () => chain,
			single: async () => ({ data: row, error: null }),
			maybeSingle: async () => ({ data: table === 'question_keywords' ? null : row, error: null })
		};
		return chain;
	});

	return {
		tables,
		locals: {
			session: options.signedIn === false ? null : { user: { id: 'user-1' } },
			supabase: { from }
		}
	};
}

function getEvent(locals: unknown, search: string, headers: Record<string, string> = {}) {
	const url = new URL(`http://localhost/api/update-questions${search}`);
	return { locals, url, request: new Request(url, { headers }) };
}

function postEvent(locals: unknown) {
	const body = new FormData();
	body.set('questionId', '7');
	body.set('questionText', 'What matters most?');
	return {
		locals,
		request: new Request('http://localhost/api/update-questions', { method: 'POST', body })
	};
}

describe('/api/update-questions', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		checkDemoTimeMock.mockResolvedValue(false);
		tagQuestionMock.mockResolvedValue(undefined);
		updateStateMock.mockResolvedValue(undefined);
	});

	it.each([
		['', {}],
		['', { auth: '' }],
		['', { auth: 'anything' }],
		['?questionId=7', {}]
	])('GET %s rejects a signed-out caller whatever headers it sends', async (search, headers) => {
		const { locals } = buildLocals({ admin: true, signedIn: false });

		await expect(GET(getEvent(locals, search, headers) as any)).rejects.toMatchObject({
			status: 401
		});
	});

	it('GET rejects a non-admin', async () => {
		const { locals } = buildLocals({ admin: false });

		await expect(GET(getEvent(locals, '?questionId=7') as any)).rejects.toMatchObject({
			status: 403
		});
	});

	it('GET without a question id does no work, even for an admin', async () => {
		const { locals, tables } = buildLocals({ admin: true });

		await expect(GET(getEvent(locals, '') as any)).rejects.toMatchObject({ status: 400 });
		expect(tables).toEqual(['profiles']);
	});

	it('GET returns tagging status to an admin', async () => {
		const { locals } = buildLocals({ admin: true });

		const response = await GET(getEvent(locals, '?questionId=7') as any);

		await expect(response.json()).resolves.toMatchObject({ success: true, status: 'idle' });
	});

	it('POST rejects a non-admin before tagging starts', async () => {
		const { locals } = buildLocals({ admin: false });

		await expect(POST(postEvent(locals) as any)).rejects.toMatchObject({ status: 403 });
		expect(updateStateMock).not.toHaveBeenCalled();
		expect(tagQuestionMock).not.toHaveBeenCalled();
	});

	it('does not let demo mode decide who is an admin', async () => {
		checkDemoTimeMock.mockResolvedValue(true);
		const { locals, tables } = buildLocals({ admin: false });

		await expect(POST(postEvent(locals) as any)).rejects.toMatchObject({ status: 403 });
		expect(tables).toEqual(['profiles']);
	});

	it('POST queues tagging for an admin, on the demo table in demo mode', async () => {
		checkDemoTimeMock.mockResolvedValue(true);
		const { locals } = buildLocals({ admin: true });

		const response = await POST(postEvent(locals) as any);

		await expect(response.json()).resolves.toMatchObject({ success: true, status: 'processing' });
		expect(updateStateMock).toHaveBeenCalledWith(
			locals.supabase,
			'questions_demo',
			7,
			expect.objectContaining({ status: 'processing' })
		);
		expect(waitUntilMock).toHaveBeenCalledTimes(1);
	});
});
