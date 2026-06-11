// src/lib/server/questionSearch.spec.ts
import { describe, expect, it, vi } from 'vitest';

import {
	buildUniqueQuestionUrl,
	findAvailableQuestionUrl,
	highlightQuestionSnippet,
	searchCategoriesTypeahead,
	searchQuestions,
	searchQuestionsTypeahead
} from './questionSearch';

function buildCategorySupabaseMock(
	categories: Array<{ id: number; category_name: string; slug: string | null }>,
	tagRows: Array<{ tag_id: number }>
) {
	return {
		from: vi.fn((table: string) => {
			if (table === 'question_categories') {
				return {
					select: () => ({
						ilike: () => ({
							limit: () => Promise.resolve({ data: categories, error: null })
						})
					})
				};
			}
			return {
				select: () => ({
					in: () => Promise.resolve({ data: tagRows, error: null })
				})
			};
		})
	};
}

describe('questionSearch helpers', () => {
	it('returns the base url when it is unused', () => {
		expect(buildUniqueQuestionUrl('how-do-i-handle-conflict', [])).toBe('how-do-i-handle-conflict');
	});

	it('picks the next available numeric suffix for duplicate urls', () => {
		expect(
			buildUniqueQuestionUrl('how-do-i-handle-conflict', [
				'how-do-i-handle-conflict',
				'how-do-i-handle-conflict-1',
				'how-do-i-handle-conflict-3'
			])
		).toBe('how-do-i-handle-conflict-2');
	});

	it('highlights matching text and escapes surrounding html', () => {
		expect(highlightQuestionSnippet('conflict', 'How do I handle <conflict> at work?')).toBe(
			'How do I handle &lt;<mark>conflict</mark>&gt; at work?'
		);
	});

	it('builds typeahead results from the rpc response', async () => {
		const rpc = vi.fn().mockResolvedValue({
			data: [
				{
					id: 10,
					url: 'how-do-i-handle-conflict',
					question: 'How do I handle conflict at work?',
					question_formatted: 'How do I handle conflict at work?',
					comment_count: 12,
					headline: 'How do I handle <mark>conflict</mark> at work?'
				}
			],
			error: null
		});

		const results = await searchQuestionsTypeahead({ rpc } as any, 'conflict', 10);

		expect(rpc).toHaveBeenCalledWith('typeahead_question_search', {
			search_query: 'conflict',
			result_limit: 10
		});
		expect(results).toEqual([
			{
				id: 10,
				url: 'how-do-i-handle-conflict',
				question: 'How do I handle conflict at work?',
				comment_count: 12,
				highlighted: 'How do I handle <mark>conflict</mark> at work?'
			}
		]);
	});

	it('ignores headline fragments from the category blob and highlights the question text', async () => {
		const rpc = vi.fn().mockResolvedValue({
			data: [
				{
					id: 11,
					url: 'what-tech-skills-are-worth-knowing',
					question: 'What technical skills are worth knowing other than programming?',
					question_formatted: 'What technical skills are worth knowing other than programming?',
					comment_count: 3,
					// ts_headline can land mid category-names blob — must never surface raw
					headline: '<mark>Emerging</mark> Technologies Hardware and Devices Health and Wellness'
				}
			],
			error: null
		});

		const results = await searchQuestionsTypeahead({ rpc } as any, 'emerging', 10);

		expect(results[0].highlighted).toBe(
			'What technical skills are worth knowing other than programming?'
		);
	});

	it('builds full search results from the rpc response', async () => {
		const rpc = vi.fn().mockResolvedValue({
			data: [
				{
					id: 22,
					url: 'how-do-i-stop-spiraling',
					question: 'How do I stop spiraling?',
					question_formatted: 'How do I stop spiraling?',
					comment_count: 8,
					category_names: 'anxiety, mental health',
					context: 'I keep replaying worst-case outcomes at night.',
					headline: 'How do I stop <mark>spiraling</mark>? ... anxiety, mental health',
					rank: 4.5,
					updated_at: '2026-04-08T12:00:00.000Z'
				}
			],
			error: null,
			count: 1
		});

		const result = await searchQuestions({ rpc } as any, 'spiraling', { limit: 20, offset: 0 });

		expect(rpc).toHaveBeenCalledWith(
			'search_questions',
			{
				search_query: 'spiraling',
				result_limit: 20,
				result_offset: 0
			},
			{ count: 'exact' }
		);
		expect(result).toEqual({
			results: [
				{
					id: 22,
					title: 'How do I stop spiraling?',
					url: '/questions/how-do-i-stop-spiraling',
					comment_count: 8,
					description: 'anxiety · mental health',
					highlighted: 'How do I stop <mark>spiraling</mark>? ... anxiety, mental health',
					rank: 4.5,
					updated_at: '2026-04-08T12:00:00.000Z',
					category_names: ['anxiety', 'mental health']
				}
			],
			total: 1
		});
	});

	it('suggests matching categories with question pages, prefix matches first', async () => {
		const supabase = buildCategorySupabaseMock(
			[
				{ id: 1, category_name: 'Hardware and Emerging Devices', slug: 'hardware-devices' },
				{ id: 2, category_name: 'Emerging Technologies', slug: 'emerging-technologies' },
				{ id: 3, category_name: 'Emerging Markets', slug: null }
			],
			[{ tag_id: 1 }, { tag_id: 2 }, { tag_id: 3 }]
		);

		const results = await searchCategoriesTypeahead(supabase as any, 'emerging', 3);

		expect(results.map((r) => r.name)).toEqual([
			'Emerging Markets',
			'Emerging Technologies',
			'Hardware and Emerging Devices'
		]);
		expect(results[1].url).toBe('/questions/categories/emerging-technologies');
		// Falls back to the id when the category has no slug
		expect(results[0].url).toBe('/questions/categories/3');
		expect(results[1].highlighted).toBe('<mark>Emerging</mark> Technologies');
	});

	it('omits categories that have no tagged questions', async () => {
		const supabase = buildCategorySupabaseMock(
			[
				{ id: 1, category_name: 'Emerging Technologies', slug: 'emerging-technologies' },
				{ id: 2, category_name: 'Emerging Markets', slug: 'emerging-markets' }
			],
			[{ tag_id: 1 }]
		);

		const results = await searchCategoriesTypeahead(supabase as any, 'emerging', 3);

		expect(results.map((r) => r.name)).toEqual(['Emerging Technologies']);
	});

	it('returns no category suggestions for wildcard-only or short queries', async () => {
		const supabase = buildCategorySupabaseMock([], []);

		expect(await searchCategoriesTypeahead(supabase as any, '%_', 3)).toEqual([]);
		expect(await searchCategoriesTypeahead(supabase as any, 'a', 3)).toEqual([]);
		expect(supabase.from).not.toHaveBeenCalled();
	});

	it('queries Supabase for url collisions when generating a new question url', async () => {
		const limit = vi.fn().mockResolvedValue({
			data: [{ url: 'how-do-i-handle-conflict' }, { url: 'how-do-i-handle-conflict-1' }],
			error: null
		});
		const like = vi.fn(() => ({ limit }));
		const select = vi.fn(() => ({ like }));
		const from = vi.fn(() => ({ select }));

		const url = await findAvailableQuestionUrl({ from } as any, 'how-do-i-handle-conflict');

		expect(from).toHaveBeenCalledWith('questions');
		expect(url).toBe('how-do-i-handle-conflict-2');
	});
});
