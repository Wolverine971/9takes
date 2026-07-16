// src/routes/questions/create.page.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { checkDemoTimeMock, mapDemoValuesMock, loggerMock, capturedInsertPayload } = vi.hoisted(
	() => {
		const captured = {
			current: null as Record<string, unknown> | null
		};

		return {
			checkDemoTimeMock: vi.fn(),
			mapDemoValuesMock: vi.fn((value: unknown) => value),
			loggerMock: {
				info: vi.fn(),
				warn: vi.fn(),
				error: vi.fn()
			},
			capturedInsertPayload: captured
		};
	}
);

vi.mock('$lib/server/elasticSearch', () => ({
	createESQuestion: vi.fn(),
	elasticClient: {
		search: vi.fn()
	}
}));

vi.mock('$lib/server/questionImages', () => ({
	uploadQuestionImage: vi.fn()
}));

vi.mock('$lib/server/welcomeSequenceGuards', () => ({
	safelyExitWelcomeSequenceForQuestionCreation: vi.fn()
}));

vi.mock('$lib/utils/logger', () => ({
	logger: loggerMock
}));

vi.mock('../../utils/api', () => ({
	checkDemoTime: checkDemoTimeMock
}));

vi.mock('../../utils/demo', () => ({
	mapDemoValues: mapDemoValuesMock
}));

vi.mock('../../utils/elasticSearch', () => ({
	typeaheadQuery: vi.fn()
}));

vi.mock('../../utils/server/openai', () => ({
	tagQuestion: vi.fn()
}));

import { actions } from './create/+page.server';

const AUTHOR_ID = '123e4567-e89b-12d3-a456-426614174000';
const OTHER_AUTHOR_ID = '123e4567-e89b-12d3-a456-426614174999';

function buildRequest(context = '', authorId: string | null = AUTHOR_ID) {
	const formData = new FormData();
	formData.append('question', 'How should I handle this conflict?');
	if (authorId !== null) {
		formData.append('author_id', authorId);
	}
	formData.append('context', context);
	formData.append('url', 'how-should-i-handle-this-conflict');

	return new Request('http://localhost/questions/create?/createQuestion', {
		method: 'POST',
		body: formData
	});
}

function buildSupabase(options: { existingUrls?: string[]; insertedRows?: unknown[] } = {}) {
	const profileSingle = vi.fn().mockResolvedValue({
		data: {
			id: AUTHOR_ID,
			admin: false,
			canAskQuestion: true
		},
		error: null
	});

	const insert = vi.fn((payload: Record<string, unknown>) => {
		capturedInsertPayload.current = payload;
		return {
			select: vi.fn().mockResolvedValue({
				data: options.insertedRows ?? [{ id: 101, url: payload.url }],
				error: null
			})
		};
	});

	const selectQuestionUrls = vi.fn(() => ({
		like: vi.fn(() => ({
			limit: vi.fn().mockResolvedValue({
				data: (options.existingUrls ?? []).map((url) => ({ url })),
				error: null
			})
		}))
	}));

	const from = vi.fn((table: string) => {
		if (table === 'profiles_demo') {
			return {
				select: vi.fn(() => ({
					eq: vi.fn(() => ({
						single: profileSingle
					}))
				}))
			};
		}

		if (table === 'questions_demo') {
			return {
				insert,
				select: selectQuestionUrls
			};
		}

		throw new Error(`Unexpected table ${table}`);
	});

	return {
		supabase: { from }
	};
}

function buildEvent(
	context = '',
	authorId: string | null = AUTHOR_ID,
	options: { existingUrls?: string[]; insertedRows?: unknown[] } = {}
) {
	const supabaseState = buildSupabase(options);

	return {
		request: buildRequest(context, authorId),
		locals: {
			session: {
				user: {
					id: AUTHOR_ID
				}
			},
			supabase: supabaseState.supabase
		}
	};
}

describe('questions create action', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		checkDemoTimeMock.mockResolvedValue(true);
		mapDemoValuesMock.mockImplementation((value: unknown) => value);
		capturedInsertPayload.current = null;
	});

	it('marks context as user provided when the creator submits it', async () => {
		const event = buildEvent('  I need advice about a tense work situation.  ');

		const result = await actions.createQuestion(event as any);

		expect(capturedInsertPayload.current).toEqual(
			expect.objectContaining({
				question: 'How should I handle this conflict?',
				context: 'I need advice about a tense work situation.',
				author_id: AUTHOR_ID,
				data: {
					userProvidedContext: true
				}
			})
		);
		expect(result).toEqual([{ id: 101, url: 'how-should-i-handle-this-conflict' }]);
	});

	it('returns a structured available URL for the confirmation step', async () => {
		const event = buildEvent();

		const result = await actions.getUrl(event as any);

		expect(result).toEqual({ url: 'how-should-i-handle-this-conflict' });
	});

	it('leaves context metadata empty when no context is supplied', async () => {
		const event = buildEvent('');

		await actions.createQuestion(event as any);

		expect(capturedInsertPayload.current).toEqual(
			expect.objectContaining({
				context: '',
				author_id: AUTHOR_ID,
				data: null
			})
		);
	});

	it('rejects a forged author id instead of trusting form data', async () => {
		const event = buildEvent('', OTHER_AUTHOR_ID);

		await expect(actions.createQuestion(event as any)).rejects.toMatchObject({
			status: 403
		});
		expect(capturedInsertPayload.current).toBeNull();
	});

	it('refreshes the available URL immediately before inserting', async () => {
		const event = buildEvent('', AUTHOR_ID, {
			existingUrls: ['how-should-i-handle-this-conflict']
		});

		const result = await actions.createQuestion(event as any);

		expect(capturedInsertPayload.current).toEqual(
			expect.objectContaining({
				url: 'how-should-i-handle-this-conflict-1'
			})
		);
		expect(result).toEqual([{ id: 101, url: 'how-should-i-handle-this-conflict-1' }]);
	});

	it('fails instead of reporting success when the insert returns no question', async () => {
		const event = buildEvent('', AUTHOR_ID, { insertedRows: [] });

		await expect(actions.createQuestion(event as any)).rejects.toMatchObject({
			status: 500
		});
	});
});
