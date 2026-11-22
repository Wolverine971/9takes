// src/lib/server/superlativeVotes.spec.ts
import { describe, expect, it } from 'vitest';
import { MIN_PICK_VOTES, MIN_TYPE_BASE, summarizeVotes } from './superlativeVotes';

describe('summarizeVotes', () => {
	it('returns nothing for an empty table', () => {
		expect(summarizeVotes({ rows: [], base: [] })).toEqual({});
		expect(summarizeVotes(null)).toEqual({});
	});

	it('counts reader picks and names a readers pick only past the threshold', () => {
		const early = summarizeVotes({
			rows: [{ trait: 'jealous', kind: 'pick', voter_type: 4, picked_type: 2, votes: 3 }],
			base: []
		});
		expect(early.jealous.pickCounts[1]).toBe(3);
		expect(early.jealous.readersPick).toBeNull();

		const later = summarizeVotes({
			rows: [
				{ trait: 'jealous', kind: 'pick', voter_type: 4, picked_type: 2, votes: MIN_PICK_VOTES },
				{ trait: 'jealous', kind: 'pick', voter_type: null, picked_type: 6, votes: 2 }
			],
			base: []
		});
		expect(later.jealous.pickTotal).toBe(MIN_PICK_VOTES + 2);
		expect(later.jealous.readersPick).toBe(2);
	});

	it('does not crown a reader pick on a tie', () => {
		const tie = summarizeVotes({
			rows: [
				{ trait: 'jealous', kind: 'pick', voter_type: null, picked_type: 2, votes: 6 },
				{ trait: 'jealous', kind: 'pick', voter_type: null, picked_type: 4, votes: 6 }
			],
			base: []
		});
		expect(tie.jealous.readersPick).toBeNull();
	});

	it('turns "this is me" into a share of each type, only with enough voters', () => {
		const summary = summarizeVotes({
			rows: [
				{ trait: 'jealous', kind: 'me', voter_type: 4, picked_type: null, votes: 3 },
				{ trait: 'jealous', kind: 'me', voter_type: 8, picked_type: null, votes: 1 }
			],
			base: [
				{ voter_type: 4, voters: 10 },
				{ voter_type: 8, voters: MIN_TYPE_BASE - 1 }
			]
		});
		expect(summary.jealous.meTotal).toBe(4);
		expect(summary.jealous.meRates[3]).toBeCloseTo(0.3);
		expect(summary.jealous.meRates[7]).toBeNull();
	});

	it('ignores out-of-range types', () => {
		const summary = summarizeVotes({
			rows: [{ trait: 'jealous', kind: 'pick', voter_type: null, picked_type: 12, votes: 5 }],
			base: [{ voter_type: 0, voters: 4 }]
		});
		expect(summary.jealous.pickTotal).toBe(0);
	});
});
