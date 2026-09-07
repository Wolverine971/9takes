import { describe, expect, it } from 'vitest';
import {
	isBelowTextFloor,
	isOwnTake,
	rankTakes,
	sortTakes,
	takeRankingMetrics,
	type RankableTake
} from './commentRanking';
const take = (id: number, extra: Partial<RankableTake> = {}): RankableTake => ({
	id,
	comment: 'a sincere answer',
	created_at: `2026-09-${String(id).padStart(2, '0')}T00:00:00Z`,
	view_count: 0,
	like_count: 0,
	...extra
});
const ids = (takes: RankableTake[]) => takes.map((t) => t.id);
describe('comment ranking', () => {
	it('uses curated order, likes, newest through exactly nine takes', () => {
		const takes = Array.from({ length: 9 }, (_, i) => take(i + 1));
		takes[3].like_count = 1;
		expect(ids(rankTakes(takes, { boostedIds: [2, 1] }))).toEqual([2, 1, 4, 9, 8, 7, 6, 5, 3]);
	});
	it('starts rotation at ten, counting the own take in the threshold', () => {
		const takes = Array.from({ length: 10 }, (_, i) => take(i + 1));
		takes[9].is_own = true;
		takes[0].view_count = 5;
		expect(ids(rankTakes(takes))).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 1]);
	});
	it('rotates boosts and likes behind unseen takes, including later turns', () => {
		expect(
			ids(
				rankTakes(
					[take(1, { view_count: 5 }), take(2), take(3, { like_count: 3, view_count: 4 })],
					{ boostedIds: [1], totalCount: 35 }
				)
			)
		).toEqual([2, 1, 3]);
		expect(takeRankingMetrics(take(1, { like_count: 1, view_count: 2 })).round).toBe(1);
		expect(
			ids(rankTakes([take(1, { view_count: 10 }), take(2, { view_count: 5 })], { totalCount: 10 }))
		).toEqual([2, 1]);
	});
	it('uses the literal quality formula, then older date and ID deterministically', () => {
		expect(
			takeRankingMetrics(take(1, { like_count: 1, view_count: 2, comment_count: 9 }), {
				boostedIds: [1]
			}).quality
		).toBeCloseTo(1.4);
		expect(ids(rankTakes([take(2), take(1)], { totalCount: 10 }))).toEqual([1, 2]);
		expect(
			ids(
				rankTakes([take(2, { created_at: null }), take(1, { created_at: null })], {
					totalCount: 10
				})
			)
		).toEqual([1, 2]);
	});
	it('always keeps below-floor takes last in rotating mode; only boost lifts the text floor', () => {
		const takes = [
			take(1, { comment: 'lol', like_count: 1 }),
			take(2, { view_count: 500 }),
			take(3, { ranking_low_effort: true })
		];
		expect(ids(rankTakes(takes, { totalCount: 10 }))).toEqual([2, 1, 3]);
		expect(takeRankingMetrics(takes[0], { boostedIds: [1] }).belowFloor).toBe(false);
	});
	it.each(['a', '!!', '😎😎😎', 'Nothing', 'Pooopin', 'abcdefghijkl'])(
		'rejects the text floor for %s',
		(text) => expect(isBelowTextFloor(text)).toBe(true)
	);
	it.each(['a b', 'abcdefghijklmn', '你好 世界', '  two words  '])(
		'accepts sincere text %s',
		(text) => expect(isBelowTextFloor(text)).toBe(false)
	);
	it('does not enforce the floor below the threshold', () => {
		expect(ids(rankTakes([take(1), take(2, { comment: 'lol', like_count: 1 })]))).toEqual([2, 1]);
	});
	it('excludes own takes by flag, user ID or fingerprint', () => {
		expect(isOwnTake(take(1, { is_own: true }))).toBe(true);
		expect(
			rankTakes([take(1, { author_id: 'u' }), take(2, { fingerprint: 'fp' }), take(3)], {
				viewerId: 'u',
				viewerFingerprint: 'fp'
			})
		).toEqual([take(3)]);
	});
	it('keeps input immutable and uses ranked order for equal likes', () => {
		const takes = Object.freeze([Object.freeze(take(2)), Object.freeze(take(1))]);
		const ranked = rankTakes(takes, { totalCount: 10 });
		expect(ids(sortTakes(ranked, 'likes'))).toEqual([1, 2]);
		expect(ids(sortTakes(ranked, 'newest'))).toEqual([2, 1]);
		expect(ids(takes as unknown as RankableTake[])).toEqual([2, 1]);
	});
});
