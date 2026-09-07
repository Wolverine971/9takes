// src/routes/questions/questionsStarters.page.server.spec.ts
//
// /questions index load: the curated "Start here" block comes from the
// `starters` key of get_questions_page_data and must (a) survive older RPC
// deployments that omit the key, (b) arrive rank-ordered, and (c) drive the
// load-more flag from the archive page only.
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { rpcMock, checkDemoTimeMock } = vi.hoisted(() => ({
	rpcMock: vi.fn(),
	checkDemoTimeMock: vi.fn()
}));

vi.mock('$lib/utils/questionCategorySlug', () => ({
	buildQuestionCategoryPath: (slug: string) => `/questions/categories/${slug}`,
	buildQuestionCategorySlug: (value: string) => value.toLowerCase()
}));

vi.mock('$lib/server/questionSearch', () => ({
	searchQuestionsTypeahead: vi.fn()
}));

vi.mock('$lib/server/questionCategoryTree', () => ({
	buildQuestionCategoryPathRows: () => [],
	buildVisibleQuestionCategoryTree: () => []
}));

vi.mock('../../utils/api', () => ({
	checkDemoTime: checkDemoTimeMock
}));

vi.mock('../../utils/demo', () => ({
	mapDemoValues: (value: unknown) => value
}));

vi.mock('../../utils/server/openai', () => ({
	replaceQuestionTags: vi.fn()
}));

import { actions, load } from './+page.server';

const row = (id: number, extra: Record<string, unknown> = {}) => ({
	id,
	url: `q-${id}`,
	question: `Question ${id}`,
	question_formatted: `Question ${id}?`,
	comment_count: id % 7,
	created_at: `2026-09-0${(id % 5) + 1}T00:00:00.000Z`,
	...extra
});

function buildSupabase() {
	const from = vi.fn((table: string) => {
		if (table === 'question_category_tags') {
			return {
				select: vi.fn(() => ({
					in: vi.fn(async () => ({ data: [], error: null }))
				}))
			};
		}
		if (table === 'question_categories') {
			return {
				select: vi.fn(() => ({
					order: vi.fn(async () => ({ data: [], error: null })),
					eq: vi.fn(() => ({ maybeSingle: vi.fn(async () => ({ data: null })) }))
				}))
			};
		}
		throw new Error(`Unexpected table ${table}`);
	});

	return { from, rpc: rpcMock };
}

function buildLoadEvent(search = '') {
	return {
		parent: async () => ({ demo_time: false }),
		url: new URL(`http://localhost/questions${search}`),
		locals: { session: null, supabase: buildSupabase() }
	};
}

describe('/questions load: Start here block', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		checkDemoTimeMock.mockResolvedValue(false);
	});

	it('returns starters in rank order and keeps the archive list untouched', async () => {
		rpcMock.mockResolvedValue({
			data: {
				canAskQuestion: false,
				categories: [],
				starters: [
					row(567, { starter_rank: 5 }),
					row(118, { starter_rank: 1 }),
					row(203, { starter_rank: 3 })
				],
				questions: [row(900), row(899)],
				totalQuestions: 5,
				totalAnswers: 12
			},
			error: null
		});

		const result = (await load(buildLoadEvent() as any)) as any;

		expect(rpcMock).toHaveBeenCalledWith(
			'get_questions_page_data',
			expect.objectContaining({ p_limit: 20, p_offset: 0 })
		);
		expect(result.starters.map((q: { id: number }) => q.id)).toEqual([118, 203, 567]);
		expect(result.starters[0].category_paths).toEqual([]);
		expect(result.questionsAndTags.map((q: { id: number }) => q.id)).toEqual([900, 899]);
		expect(result.hasMore).toBe(false);
	});

	it('degrades to an empty block when the RPC has no starters key', async () => {
		rpcMock.mockResolvedValue({
			data: {
				canAskQuestion: true,
				categories: [],
				questions: Array.from({ length: 20 }, (_, index) => row(100 + index)),
				totalQuestions: 40,
				totalAnswers: 3
			},
			error: null
		});

		const result = (await load(buildLoadEvent() as any)) as any;

		expect(result.starters).toEqual([]);
		expect(result.hasMore).toBe(true);
	});

	it('never shows the block on page 2+', async () => {
		rpcMock.mockResolvedValue({
			data: {
				canAskQuestion: false,
				categories: [],
				starters: [row(118, { starter_rank: 1 })],
				questions: [row(50)],
				totalQuestions: 21,
				totalAnswers: 0
			},
			error: null
		});

		const result = (await load(buildLoadEvent('?page=2') as any)) as any;

		expect(rpcMock).toHaveBeenCalledWith(
			'get_questions_page_data',
			expect.objectContaining({ p_offset: 20 })
		);
		expect(result.starters).toEqual([]);
		expect(result.currentPage).toBe(2);
	});
});

describe('/questions loadMore action', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		checkDemoTimeMock.mockResolvedValue(false);
	});

	it('requests the next offset and reports hasMore from the page size', async () => {
		rpcMock.mockResolvedValue({
			data: {
				canAskQuestion: false,
				categories: [],
				starters: [],
				questions: Array.from({ length: 20 }, (_, index) => row(300 + index)),
				totalQuestions: 60,
				totalAnswers: 0
			},
			error: null
		});

		const formData = new FormData();
		formData.append('page', '3');
		const result = (await actions.loadMore({
			request: new Request('http://localhost/questions?/loadMore', {
				method: 'POST',
				body: formData
			}),
			locals: { session: null, supabase: buildSupabase() }
		} as any)) as any;

		expect(rpcMock).toHaveBeenCalledWith(
			'get_questions_page_data',
			expect.objectContaining({ p_limit: 20, p_offset: 40 })
		);
		expect(result.page).toBe(3);
		expect(result.hasMore).toBe(true);
		expect(result.questions).toHaveLength(20);
	});
});
