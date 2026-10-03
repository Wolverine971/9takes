// src/lib/data/homepageLiveTake.spec.ts
import { describe, expect, it } from 'vitest';
import { splitLiveTakes, toLiveTakeAnswers } from './homepageLiveTake';

describe('toLiveTakeAnswers', () => {
	it('keeps non-empty answers, trims text, caps the list and only keeps valid types', () => {
		const answers = toLiveTakeAnswers(
			[
				{ id: 1, comment: '  Shows up.  ', profiles: { enneagram: 6 } },
				{ id: 2, comment: '   ', profiles: null },
				{ id: 3, comment: 'Tells the truth.', profiles: { enneagram: 12 } },
				{ id: 4, comment: 'Listens.' }
			],
			2
		);
		expect(answers).toEqual([
			{ id: 1, text: 'Shows up.', type: 6 },
			{ id: 3, text: 'Tells the truth.', type: null }
		]);
	});
});

describe('splitLiveTakes', () => {
	it('separates the visitor’s own take and puts low-effort answers last', () => {
		const own = { id: 9, comment: ' Mine. ', is_own: true };
		const split = splitLiveTakes(
			[
				own,
				{ id: 1, comment: 'ok', is_own: false, ranking_low_effort: true },
				{ id: 2, comment: 'They call back.', is_own: false, profiles: { enneagram: 6 } }
			],
			[own]
		);
		expect(split).toEqual({
			ownTake: { id: 9, text: 'Mine.' },
			answers: [
				{ id: 2, text: 'They call back.', type: 6 },
				{ id: 1, text: 'ok', type: null }
			]
		});
	});

	it('finds no own take when the gate opened through a take that is not on the page', () => {
		expect(splitLiveTakes([{ id: 1, comment: 'Hi', is_own: false }], [])).toEqual({
			ownTake: null,
			answers: [{ id: 1, text: 'Hi', type: null }]
		});
	});
});
