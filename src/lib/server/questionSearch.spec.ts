// src/lib/server/questionSearch.spec.ts
import { describe, expect, it, vi } from 'vitest';

import {
	buildUniqueQuestionUrl,
	findAvailableQuestionUrl,
	highlightQuestionSnippet,
	searchQuestions,
	searchQuestionsTypeahead
} from './questionSearch';

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
