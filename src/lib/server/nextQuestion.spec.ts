// src/lib/server/nextQuestion.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { checkUserAnsweredMock } = vi.hoisted(() => ({ checkUserAnsweredMock: vi.fn() }));
vi.mock('$lib/server/questionComments', () => ({ checkUserAnswered: checkUserAnsweredMock }));

import { orderCandidates, pickNextQuestion, rotationOffset } from './nextQuestion';

const ROWS = ['a', 'b', 'c', 'd', 'e', 'f'].map((url, index) => ({
	id: index + 1,
	url,
	question: `question ${url}`,
	question_formatted: index === 0 ? '' : `Question ${url.toUpperCase()}?`,
	comment_count: 60 - index * 10,
	starter_rank: null
}));

function fakeDb(rows: unknown[] = ROWS, error: unknown = null) {
	const query = {
		select: vi.fn(() => query),
		not: vi.fn(() => query),
		or: vi.fn(() => query),
		order: vi.fn(() => query),
		limit: vi.fn(async () => ({ data: rows, error }))
	};
	return { from: vi.fn(() => query), query };
}

const viewer = { fingerprint: 'visitor-1', userId: null };

beforeEach(() => {
	checkUserAnsweredMock.mockReset();
	checkUserAnsweredMock.mockResolvedValue(false);
});

describe('orderCandidates', () => {
	it('offers starters before anything else', () => {
		const pool = [
			{ url: 's1', starter: true },
			{ url: 's2', starter: true },
			{ url: 'x', starter: false },
			{ url: 'y', starter: false }
		];
		for (const after of ['a', 'b', 'c', 'zzz']) {
			const ordered = orderCandidates(pool, after, new Set()).map((item) => item.url);
			expect(ordered.slice(0, 2).sort()).toEqual(['s1', 's2']);
		}
	});

	it('rotates the pool by the question just answered and drops it and skipped ones', () => {
		const pool = ['a', 'b', 'c', 'd'].map((url) => ({ url, starter: false }));
		const offset = rotationOffset('c', pool.length);
		const ordered = orderCandidates(pool, 'c', new Set(['a'])).map((item) => item.url);

		expect(ordered).not.toContain('c');
		expect(ordered).not.toContain('a');
		expect(ordered[0]).toBe(
			[...pool.slice(offset), ...pool.slice(0, offset)].find(
				(item) => item.url !== 'c' && item.url !== 'a'
			)?.url
		);
	});

	it('is stable for the same page', () => {
		const pool = ['a', 'b', 'c', 'd', 'e'].map((url) => ({ url, starter: false }));
		expect(orderCandidates(pool, 'x', new Set())).toEqual(orderCandidates(pool, 'x', new Set()));
	});
});

describe('pickNextQuestion', () => {
	it('returns the first candidate the visitor has not answered, with its formatted title', async () => {
		const { from } = fakeDb();
		// Everything answered except "d".
		checkUserAnsweredMock.mockImplementation(async (_fp, questionId: number) => questionId !== 4);

		const next = await pickNextQuestion({ from }, { afterSlug: null, viewer });

		expect(next).toEqual({ url: 'd', title: 'Question D?', responses: 30 });
		expect(checkUserAnsweredMock).toHaveBeenCalledWith('visitor-1', 4, undefined, { from });
	});

	it('falls back to the raw question text when there is no formatted one', async () => {
		const { from } = fakeDb([ROWS[0]]);
		const next = await pickNextQuestion({ from }, { afterSlug: null, viewer });
		expect(next?.title).toBe('question a');
	});

	it('returns null when every candidate is answered', async () => {
		const { from } = fakeDb();
		checkUserAnsweredMock.mockResolvedValue(true);
		expect(await pickNextQuestion({ from }, { afterSlug: 'a', viewer })).toBeNull();
	});

	it('treats an unreadable gate as answered', async () => {
		const { from } = fakeDb([ROWS[1], ROWS[2]]);
		checkUserAnsweredMock.mockRejectedValueOnce(new Error('rpc down')).mockResolvedValueOnce(false);
		const next = await pickNextQuestion({ from }, { afterSlug: null, viewer });
		expect(next?.url).toBe('c');
	});

	it('never offers the question just answered or a skipped one', async () => {
		const { from } = fakeDb(ROWS.slice(1, 4));
		const next = await pickNextQuestion(
			{ from },
			{ afterSlug: 'b', skip: ['c'], viewer: { fingerprint: null, userId: null } }
		);
		expect(next?.url).toBe('d');
		// No identity yet: nothing to check against the gate.
		expect(checkUserAnsweredMock).not.toHaveBeenCalled();
	});

	it('only reads starters and questions with a real room behind them', async () => {
		const { from, query } = fakeDb();
		await pickNextQuestion({ from }, { afterSlug: null, viewer });
		expect(query.or).toHaveBeenCalledWith('starter_rank.not.is.null,comment_count.gte.10');
	});

	it('throws when the pool cannot be read', async () => {
		const { from } = fakeDb([], { message: 'boom' });
		await expect(pickNextQuestion({ from }, { afterSlug: null, viewer })).rejects.toThrow('boom');
	});
});
