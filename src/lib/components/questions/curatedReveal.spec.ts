// src/lib/components/questions/curatedReveal.spec.ts
import { describe, expect, it } from 'vitest';

import {
	MAX_PINNED_COMMENTS,
	excludePinnedComments,
	normalizePinnedCommentIds,
	orderPinnedComments,
	parseStarterQuestions
} from './curatedReveal';

const starter = (id: number, rank: number | null, url = `q-${id}`) => ({
	id,
	url,
	question: `Question ${id}`,
	comment_count: 0,
	created_at: '2026-09-06T00:00:00.000Z',
	starter_rank: rank
});

describe('parseStarterQuestions', () => {
	it('returns an empty array when the RPC omits the key (older function deployments)', () => {
		expect(parseStarterQuestions(undefined)).toEqual([]);
		expect(parseStarterQuestions(null)).toEqual([]);
		expect(parseStarterQuestions('nope')).toEqual([]);
	});

	it('orders by starter_rank, then id, and drops malformed or duplicate rows', () => {
		const parsed = parseStarterQuestions([
			starter(567, 5),
			starter(118, 1),
			{ id: 'bad', url: 'x' },
			starter(203, 3),
			starter(119, 2),
			starter(119, 2),
			{ id: 999, url: '' },
			starter(137, 4)
		]);

		expect(parsed.map((row) => row.id)).toEqual([118, 119, 203, 137, 567]);
	});

	it('pushes rows with no rank to the end without dropping them', () => {
		const parsed = parseStarterQuestions([starter(9, null), starter(2, 2), starter(1, 1)]);
		expect(parsed.map((row) => row.id)).toEqual([1, 2, 9]);
	});
});

describe('normalizePinnedCommentIds', () => {
	it('coerces bigint-ish values, drops junk and duplicates, and caps at three', () => {
		expect(normalizePinnedCommentIds(['375', 372, '372', 'abc', -1, 0, 661, 700])).toEqual([
			375, 372, 661
		]);
		expect(normalizePinnedCommentIds(null)).toEqual([]);
		expect(MAX_PINNED_COMMENTS).toBe(3);
	});
});

describe('orderPinnedComments', () => {
	const rows = [
		{ id: 661, comment: 'old soul' },
		{ id: 375, comment: 'quiet kid' },
		{ id: 372, comment: 'wild kid' },
		{ id: 900, comment: 'not pinned' }
	];

	it('preserves the pinned_comment_ids order, not the fetch order', () => {
		expect(orderPinnedComments([375, 372, 661], rows).map((row) => row.id)).toEqual([
			375, 372, 661
		]);
	});

	it('drops ids that did not come back and removed rows', () => {
		const withRemoved = [...rows, { id: 5, comment: 'gone', removed: true }];
		expect(orderPinnedComments([5, 372, 4242, 661], withRemoved).map((row) => row.id)).toEqual([
			372, 661
		]);
	});

	it('is empty when there is nothing to pin', () => {
		expect(orderPinnedComments([], rows)).toEqual([]);
		expect(orderPinnedComments([375], [])).toEqual([]);
	});
});

describe('excludePinnedComments', () => {
	const community = [
		{ id: 1000, comment: 'Pooopin' },
		{ id: 375, comment: 'quiet kid' },
		{ id: 998, comment: 'another' },
		{ id: 661, comment: 'old soul' }
	];

	it('removes pinned comments from the community list so nothing renders twice', () => {
		expect(excludePinnedComments(community, [375, 372, 661]).map((row) => row.id)).toEqual([
			1000, 998
		]);
	});

	it('leaves the list untouched when there are no pins (today behaviour)', () => {
		expect(excludePinnedComments(community, [])).toEqual(community);
		expect(excludePinnedComments(null, [1])).toEqual([]);
	});
});
