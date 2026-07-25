// src/lib/server/accountDashboard.spec.ts
import { describe, expect, it } from 'vitest';
import {
	buildTypesByQuestion,
	buildYourTakes,
	dayIndex,
	isRoomLively,
	pickQuestionOfTheDay,
	questionText,
	rotateByDay,
	seedFrom,
	type QuestionCandidate
} from './accountDashboard';

function candidate(id: number, overrides: Partial<QuestionCandidate> = {}): QuestionCandidate {
	return {
		id,
		question: `Question ${id}`,
		question_formatted: null,
		url: `question-${id}`,
		comment_count: 0,
		created_at: '2026-07-01T00:00:00Z',
		last_comment_date: null,
		...overrides
	};
}

describe('rotateByDay', () => {
	it('returns everything when the pool is smaller than the window', () => {
		expect(rotateByDay([1, 2], 5, 0, 0)).toEqual([1, 2]);
	});

	it('is stable for the same day and moves on the next', () => {
		const pool = [1, 2, 3, 4, 5, 6, 7, 8];
		const today = rotateByDay(pool, 3, 42, 100);

		expect(rotateByDay(pool, 3, 42, 100)).toEqual(today);
		expect(rotateByDay(pool, 3, 42, 101)).not.toEqual(today);
	});

	it('differs between users on the same day', () => {
		const pool = [1, 2, 3, 4, 5, 6, 7, 8];
		expect(rotateByDay(pool, 3, seedFrom('user-a'), 100)).not.toEqual(
			rotateByDay(pool, 3, seedFrom('user-b'), 100)
		);
	});

	it('wraps around the end of the pool without running short', () => {
		expect(rotateByDay([1, 2, 3], 2, 2, 0)).toHaveLength(2);
	});

	it('handles an empty pool', () => {
		expect(rotateByDay([], 3, 1, 1)).toEqual([]);
	});
});

describe('buildTypesByQuestion', () => {
	it('keeps real types and drops anonymous and untyped commenters', () => {
		const map = buildTypesByQuestion([
			{ parent_id: 1, author_id: 'a', created_at: null, profiles: { enneagram: '5' } },
			{ parent_id: 1, author_id: 'b', created_at: null, profiles: { enneagram: '8' } },
			// registered but never picked a type
			{ parent_id: 1, author_id: 'c', created_at: null, profiles: { enneagram: 'unknown' } },
			// anonymous give-first visitor
			{ parent_id: 1, author_id: null, created_at: null, profiles: null }
		]);

		expect([...(map.get(1) ?? [])].sort()).toEqual(['5', '8']);
	});

	it('ignores rows with no parent question', () => {
		const map = buildTypesByQuestion([
			{ parent_id: null, author_id: 'a', created_at: null, profiles: { enneagram: '3' } }
		]);
		expect(map.size).toBe(0);
	});
});

describe('pickQuestionOfTheDay', () => {
	const types = new Map<number, Set<string>>();

	it('never returns a question the reader already answered', () => {
		const picked = pickQuestionOfTheDay(
			[candidate(1), candidate(2)],
			new Set([1]),
			types,
			'5',
			0,
			0
		);
		expect(picked?.id).toBe(2);
	});

	it('returns null when everything is already answered', () => {
		expect(pickQuestionOfTheDay([candidate(1)], new Set([1]), types, '5', 0, 0)).toBeNull();
	});

	it('prefers a live thread that is missing the reader type', () => {
		const typesByQuestion = new Map<number, Set<string>>([
			[1, new Set(['5'])], // reader's type already present
			[2, new Set(['8'])] // reader's type missing, and it has takes
		]);

		const picked = pickQuestionOfTheDay(
			[candidate(1, { comment_count: 4 }), candidate(2, { comment_count: 3 })],
			new Set(),
			typesByQuestion,
			'5',
			0,
			0
		);

		expect(picked?.id).toBe(2);
		expect(picked?.yourTypeMissing).toBe(true);
		expect(picked?.typesPresent).toEqual(['8']);
	});

	it('falls back to a live thread when the reader has no type', () => {
		const picked = pickQuestionOfTheDay(
			[candidate(1, { comment_count: 0 }), candidate(2, { comment_count: 6 })],
			new Set(),
			new Map(),
			null,
			0,
			0
		);

		expect(picked?.id).toBe(2);
		expect(picked?.yourTypeMissing).toBe(false);
	});

	it('still returns something when no question has any takes', () => {
		const picked = pickQuestionOfTheDay(
			[candidate(1, { comment_count: 0 })],
			new Set(),
			new Map(),
			null,
			0,
			0
		);
		expect(picked?.id).toBe(1);
	});

	it('skips candidates with no url or no text', () => {
		const picked = pickQuestionOfTheDay(
			[
				candidate(1, { url: null }),
				candidate(2, { question: null, question_formatted: null }),
				candidate(3)
			],
			new Set(),
			new Map(),
			null,
			0,
			0
		);
		expect(picked?.id).toBe(3);
	});

	it('is stable across calls on the same day', () => {
		const pool = [candidate(1), candidate(2), candidate(3), candidate(4)];
		const seed = seedFrom('user-x');
		const first = pickQuestionOfTheDay(pool, new Set(), new Map(), null, seed, 500);
		const second = pickQuestionOfTheDay(pool, new Set(), new Map(), null, seed, 500);
		expect(first?.id).toBe(second?.id);
	});

	it('reports only real types as present', () => {
		const typesByQuestion = new Map<number, Set<string>>([[1, new Set(['2', '9'])]]);
		const picked = pickQuestionOfTheDay(
			[candidate(1, { comment_count: 2 })],
			new Set(),
			typesByQuestion,
			'5',
			0,
			0
		);
		expect(picked?.typesPresent).toEqual(['2', '9']);
	});
});

describe('questionText', () => {
	it('prefers the formatted question', () => {
		expect(questionText({ question: 'raw', question_formatted: 'formatted' })).toBe('formatted');
	});

	it('falls back to the raw question', () => {
		expect(questionText({ question: 'raw', question_formatted: null })).toBe('raw');
	});
});

describe('buildYourTakes', () => {
	type QuestionRow = {
		question: string | null;
		question_formatted: string | null;
		url: string | null;
	};

	const questions = new Map<number, QuestionRow>([
		[10, { question: 'Raw ten', question_formatted: 'Formatted ten', url: 'ten' }],
		[11, { question: 'Raw eleven', question_formatted: null, url: 'eleven' }]
	]);

	function take(id: number, overrides: Record<string, unknown> = {}) {
		return {
			id,
			comment: `take ${id}`,
			parent_id: 10,
			created_at: `2026-07-2${id}T00:00:00Z`,
			like_count: 0,
			...overrides
		};
	}

	it('pairs a take with its question and reply count', () => {
		const [result] = buildYourTakes([take(1)], questions, new Map([[1, 3]]));

		expect(result.questionText).toBe('Formatted ten');
		expect(result.questionUrl).toBe('ten');
		expect(result.excerpt).toBe('take 1');
		expect(result.replyCount).toBe(3);
	});

	it('defaults a take with no replies to zero rather than dropping it', () => {
		const [result] = buildYourTakes([take(1)], questions, new Map());
		expect(result.replyCount).toBe(0);
	});

	it('orders newest first and honours the limit', () => {
		const takes = buildYourTakes([take(1), take(3), take(2)], questions, new Map(), 2);
		expect(takes.map((t) => t.id)).toEqual([3, 2]);
	});

	it('drops takes whose question is missing, empty, or unslugged', () => {
		const orphan = take(1, { parent_id: 999 });
		const unslugged = take(2, { parent_id: 12 });
		const blank = take(3, { comment: '   ' });
		const withUnslugged = new Map(questions);
		withUnslugged.set(12, { question: 'No url', question_formatted: null, url: null });

		expect(buildYourTakes([orphan, unslugged, blank], withUnslugged, new Map())).toEqual([]);
	});

	it('falls back to the raw question and clamps a negative like count', () => {
		const [result] = buildYourTakes(
			[take(1, { parent_id: 11, like_count: -4 })],
			questions,
			new Map()
		);
		expect(result.questionText).toBe('Raw eleven');
		expect(result.likeCount).toBe(0);
	});
});

describe('isRoomLively', () => {
	it('reports a pulse when several types weighed in', () => {
		expect(isRoomLively({ newTakes7d: 12, activeTypes7d: ['2', '4', '7'] })).toBe(true);
	});

	it('withholds the pulse when one type carried the week', () => {
		// The whole point of the gate: volume alone is not the product's claim.
		expect(isRoomLively({ newTakes7d: 40, activeTypes7d: ['5'] })).toBe(false);
	});

	it('withholds the pulse when many types barely spoke', () => {
		expect(isRoomLively({ newTakes7d: 3, activeTypes7d: ['1', '3', '8'] })).toBe(false);
	});

	it('withholds the pulse on a silent week', () => {
		expect(isRoomLively({ newTakes7d: 0, activeTypes7d: [] })).toBe(false);
	});

	it('holds at the exact boundary', () => {
		expect(isRoomLively({ newTakes7d: 8, activeTypes7d: ['1', '2', '3'] })).toBe(true);
		expect(isRoomLively({ newTakes7d: 7, activeTypes7d: ['1', '2', '3'] })).toBe(false);
		expect(isRoomLively({ newTakes7d: 8, activeTypes7d: ['1', '2'] })).toBe(false);
	});
});

describe('dayIndex', () => {
	it('is constant within a UTC day and increments across one', () => {
		const morning = dayIndex(new Date('2026-07-25T00:30:00Z'));
		const evening = dayIndex(new Date('2026-07-25T23:30:00Z'));
		const nextDay = dayIndex(new Date('2026-07-26T00:30:00Z'));

		expect(morning).toBe(evening);
		expect(nextDay).toBe(morning + 1);
	});
});
