// src/routes/design-preview/harry-dry-v2/communityProof.spec.ts
import { describe, expect, it, vi } from 'vitest';
import { GET } from './community/+server';
import { load } from './+page';
import { parseCommunityProof } from './communityProof';

const raw = {
	totalQuestions: 4,
	totalAnswers: 12,
	starters: [
		{
			url: 'good-friend',
			question: 'What makes a good friend?',
			comment_count: 7,
			author_id: 'must-not-serialize'
		}
	],
	questions: [
		{ url: 'good-friend', question: 'Duplicate', comment_count: 7 },
		{ url: 'cancelled-plans', question: 'What if plans change?', comment_count: 0 },
		{ url: 'hidden', question: 'Removed', comment_count: 3, removed: true },
		{ url: 'flagged', question: 'Flagged', comment_count: 3, flagged: true },
		{ url: 'https://example.com', question: 'External URL', comment_count: 3 },
		{ url: 'bad-count', question: 'Invalid', comment_count: -1 }
	],
	comments: ['must-not-serialize']
};

describe('V2 public community proof', () => {
	it('returns only safe public metadata, without duplicates, hidden rows, or invented counts', () => {
		expect(parseCommunityProof(raw)).toEqual({
			totalQuestions: 4,
			totalResponses: 12,
			questions: [
				{ slug: 'good-friend', title: 'What makes a good friend?', responses: 7 },
				{ slug: 'cancelled-plans', title: 'What if plans change?', responses: 0 }
			]
		});
		expect(parseCommunityProof({ ...raw, totalAnswers: '12' })).toBeNull();
		expect(parseCommunityProof(null)).toBeNull();
	});

	it('loads only public metadata through a bounded GET request', async () => {
		const abortSignal = vi.fn().mockResolvedValue({ data: raw, error: null });
		const rpc = vi.fn(() => ({ abortSignal }));
		const response = await GET({ locals: { supabase: { rpc } } } as never);
		expect(rpc).toHaveBeenCalledWith('get_questions_page_data', { p_limit: 6, p_offset: 0 });
		expect(abortSignal).toHaveBeenCalledWith(expect.any(AbortSignal));
		const proof = await response.json();
		expect(proof.totalResponses).toBe(12);
		expect(JSON.stringify(proof)).not.toContain('must-not-serialize');
	});

	it('renders the page without waiting for public activity', () => {
		expect(load()).toEqual({ pageChrome: 'owned', pageShell: 'owned' });
	});

	it('keeps the preview usable when the public data request fails or throws', async () => {
		for (const response of [
			() => Promise.resolve({ data: raw, error: { message: 'unavailable' } }),
			() => Promise.reject(new Error('timeout'))
		]) {
			const rpc = vi.fn(() => ({ abortSignal: response }));
			const result = await GET({ locals: { supabase: { rpc } } } as never);
			expect(await result.json()).toBeNull();
		}
	});
});
