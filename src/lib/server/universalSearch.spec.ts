// src/lib/server/universalSearch.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { searchBlogs, searchBlogTypeahead, searchQuestions, searchQuestionsTypeahead } = vi.hoisted(
	() => ({
		searchBlogs: vi.fn(),
		searchBlogTypeahead: vi.fn(),
		searchQuestions: vi.fn(),
		searchQuestionsTypeahead: vi.fn()
	})
);

vi.mock('$lib/server/blogSearch', () => ({
	searchBlogs,
	searchBlogTypeahead
}));

vi.mock('$lib/server/questionSearch', () => ({
	searchQuestions,
	searchQuestionsTypeahead
}));

import {
	parseUniversalSearchScope,
	searchUniversal,
	searchUniversalTypeahead
} from './universalSearch';

describe('universalSearch', () => {
	beforeEach(() => {
		searchBlogs.mockReset();
		searchBlogTypeahead.mockReset();
		searchQuestions.mockReset();
		searchQuestionsTypeahead.mockReset();
	});

	it('normalizes supported scopes', () => {
		expect(parseUniversalSearchScope('all')).toBe('all');
		expect(parseUniversalSearchScope('blogs')).toBe('library');
		expect(parseUniversalSearchScope('questions')).toBe('questions');
		expect(parseUniversalSearchScope('weird')).toBe('all');
	});

	it('merges blog and question results by rank', async () => {
		searchBlogs.mockResolvedValue({
			results: [
				{
					id: 1,
					source: 'famous_people',
					slug: 'cillian-murphy',
					title: 'Cillian Murphy Enneagram',
					description: 'Personality analysis',
					enneagram: 5,
					type: ['analysis'],
					tags: ['actor'],
					category: 'pop-culture',
					lastmod: '2026-04-08T10:00:00.000Z',
					rank: 6.2,
					url: '/personality-analysis/cillian-murphy'
				}
			],
			total: 1
		});
		searchQuestions.mockResolvedValue({
			results: [
				{
					id: 2,
					title: 'Why do I overthink every conversation?',
					url: '/questions/why-do-i-overthink-every-conversation',
					comment_count: 14,
					description: 'anxiety · relationships',
					highlighted: 'Why do I <mark>overthink</mark> every conversation?',
					rank: 4.1,
					updated_at: '2026-04-08T09:00:00.000Z',
					category_names: ['anxiety', 'relationships']
				}
			],
			total: 1
		});

		const result = await searchUniversal({} as any, 'overthink', {
			scope: 'all',
			limit: 20,
			offset: 0
		});

		expect(result.total).toBe(2);
		expect(result.results.map((item) => item.source)).toEqual(['personality_analysis', 'question']);
		expect(result.results[0]).toMatchObject({
			source: 'personality_analysis',
			subtype: 'famous_people',
			url: '/personality-analysis/cillian-murphy'
		});
		expect(result.results[1]).toMatchObject({
			source: 'question',
			subtype: 'question',
			url: '/questions/why-do-i-overthink-every-conversation'
		});
	});

	it('honors question-only scope in typeahead', async () => {
		searchBlogTypeahead.mockResolvedValue([
			{
				id: 1,
				source: 'content',
				title: 'Ignore me',
				slug: 'ignore-me',
				url: '/enneagram-corner/ignore-me',
				enneagram: 1,
				category: 'enneagram',
				headline: 'Ignore me',
				rank: 9
			}
		]);
		searchQuestionsTypeahead.mockResolvedValue([
			{
				id: 8,
				question: 'How do I set boundaries with friends?',
				url: 'how-do-i-set-boundaries-with-friends',
				comment_count: 5,
				highlighted: 'How do I set <mark>boundaries</mark> with friends?'
			}
		]);

		const result = await searchUniversalTypeahead({} as any, 'boundaries', {
			scope: 'questions',
			limit: 10
		});

		expect(searchBlogTypeahead).not.toHaveBeenCalled();
		expect(result.results).toHaveLength(1);
		expect(result.results[0]).toMatchObject({
			source: 'question',
			url: '/questions/how-do-i-set-boundaries-with-friends'
		});
	});
});
