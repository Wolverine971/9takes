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

vi.mock('$lib/utils/questionSlug', () => ({
	appendQuestionSlugSuffix: vi.fn(),
	buildQuestionSlug: vi.fn(),
	QUESTION_URL_MAX_LENGTH: 120
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

function buildRequest(context = '') {
	const formData = new FormData();
	formData.append('question', 'How should I handle this conflict?');
	formData.append('author_id', AUTHOR_ID);
	formData.append('context', context);
	formData.append('url', 'how-should-i-handle-this-conflict');

	return new Request('http://localhost/questions/create?/createQuestion', {
		method: 'POST',
		body: formData
	});
}

function buildSupabase() {
	const profileSingle = vi.fn().mockResolvedValue({
		data: {
			id: AUTHOR_ID,
			admin: false,
			canAskQuestion: true
		},
		error: null
	});

	const insertSelect = vi.fn().mockResolvedValue({
		data: [{ id: 101, url: 'how-should-i-handle-this-conflict' }],
		error: null
	});

	const insert = vi.fn((payload: Record<string, unknown>) => {
		capturedInsertPayload.current = payload;
		return {
			select: insertSelect
		};
	});

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
				insert
			};
		}

		throw new Error(`Unexpected table ${table}`);
	});

	return {
		supabase: { from }
	};
}

function buildEvent(context = '') {
	const supabaseState = buildSupabase();

	return {
		request: buildRequest(context),
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
				context: 'I need advice about a tense work situation.',
				data: {
					userProvidedContext: true
				}
			})
		);
		expect(result).toEqual([{ id: 101, url: 'how-should-i-handle-this-conflict' }]);
	});

	it('leaves context metadata empty when no context is supplied', async () => {
		const event = buildEvent('');

		await actions.createQuestion(event as any);

		expect(capturedInsertPayload.current).toEqual(
			expect.objectContaining({
				context: '',
				data: null
			})
		);
	});
});
