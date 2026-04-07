// src/routes/questions/questions.page.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { checkDemoTimeMock, replaceQuestionTagsMock } = vi.hoisted(() => ({
	checkDemoTimeMock: vi.fn(),
	replaceQuestionTagsMock: vi.fn()
}));

vi.mock('$lib/utils/questionCategorySlug', () => ({
	buildQuestionCategoryPath: vi.fn(),
	buildQuestionCategorySlug: vi.fn()
}));

vi.mock('$lib/server/elasticSearch', () => ({
	deleteESQuestion: vi.fn(),
	elasticClient: {
		search: vi.fn()
	}
}));

vi.mock('$lib/server/questionCategoryTree', () => ({
	buildVisibleQuestionCategoryTree: vi.fn(),
	listQuestionCategoriesWithDirectQuestions: vi.fn()
}));

vi.mock('../../utils/api', () => ({
	checkDemoTime: checkDemoTimeMock
}));

vi.mock('../../utils/demo', () => ({
	mapDemoValues: (value: unknown) => value
}));

vi.mock('../../utils/server/openai', () => ({
	replaceQuestionTags: replaceQuestionTagsMock
}));

import { actions } from './+page.server';

function buildRequest(overrides?: {
	questionId?: string;
	removed?: string;
	flagged?: string;
	question_formatted?: string;
	tags?: Array<{ tag_id: number; tag_name?: string }>;
}) {
	const formData = new FormData();
	formData.append('questionId', overrides?.questionId ?? '42');
	formData.append('removed', overrides?.removed ?? 'false');
	formData.append('flagged', overrides?.flagged ?? 'false');
	formData.append('question_formatted', overrides?.question_formatted ?? 'What is going on here?');
	formData.append(
		'tags',
		JSON.stringify(overrides?.tags ?? [{ tag_id: 7, tag_name: 'Romantic Relationships' }])
	);

	return new Request('http://localhost/questions?/update', {
		method: 'POST',
		body: formData
	});
}

function buildSupabase(tagged = false) {
	const profileSingle = vi.fn().mockResolvedValue({
		data: { id: 'admin-1', admin: true },
		error: null
	});
	const existingQuestionMaybeSingle = vi.fn().mockResolvedValue({
		data: { tagged },
		error: null
	});
	const updateEq = vi.fn().mockResolvedValue({
		error: null
	});
	const update = vi.fn(() => ({
		eq: updateEq
	}));

	const from = vi.fn((table: string) => {
		if (table === 'profiles') {
			return {
				select: vi.fn(() => ({
					eq: vi.fn(() => ({
						single: profileSingle
					}))
				}))
			};
		}

		if (table === 'questions') {
			return {
				select: vi.fn(() => ({
					eq: vi.fn(() => ({
						maybeSingle: existingQuestionMaybeSingle
					}))
				})),
				update
			};
		}

		throw new Error(`Unexpected table ${table}`);
	});

	return {
		supabase: { from },
		update,
		updateEq
	};
}

function buildEvent(
	requestOverrides?: Parameters<typeof buildRequest>[0],
	options?: { tagged?: boolean }
) {
	const supabaseState = buildSupabase(options?.tagged ?? false);

	return {
		request: buildRequest(requestOverrides),
		locals: {
			session: {
				user: {
					id: 'admin-1'
				}
			},
			supabase: supabaseState.supabase
		},
		_supabase: supabaseState
	};
}

describe('questions update action', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		checkDemoTimeMock.mockResolvedValue(false);
		replaceQuestionTagsMock.mockResolvedValue([]);
	});

	it('syncs tag removals through the shared question-tag helper', async () => {
		const event = buildEvent(
			{
				tags: [],
				flagged: 'false',
				question_formatted: 'Still worth reviewing.'
			},
			{ tagged: true }
		);

		const result = await actions.update(event as any);

		expect(replaceQuestionTagsMock).toHaveBeenCalledWith(event.locals.supabase, 42, [], false);
		expect(event._supabase.update).toHaveBeenCalledWith(
			expect.objectContaining({
				question_formatted: 'Still worth reviewing.',
				removed: false,
				flagged: false,
				tagged: true
			})
		);
		expect(result).toMatchObject({
			success: true,
			question: {
				id: 42,
				tagged: true,
				question_tag: []
			}
		});
	});

	it('marks a question handled when an admin adds tags manually', async () => {
		const event = buildEvent({
			tags: [
				{ tag_id: 11, tag_name: 'Personal Growth' },
				{ tag_id: 19, tag_name: 'Self-Relationship' }
			]
		});

		const result = await actions.update(event as any);

		expect(replaceQuestionTagsMock).toHaveBeenCalledWith(
			event.locals.supabase,
			42,
			[11, 19],
			false
		);
		expect(event._supabase.update).toHaveBeenCalledWith(
			expect.objectContaining({
				tagged: true,
				flagged: false,
				removed: false
			})
		);
		expect(result).toMatchObject({
			success: true,
			question: {
				id: 42,
				tagged: true,
				question_tag: [
					{ tag_id: 11, tag_name: 'Personal Growth' },
					{ tag_id: 19, tag_name: 'Self-Relationship' }
				]
			}
		});
	});
});
