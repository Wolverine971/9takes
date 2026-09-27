// src/lib/data/homepageLiveTake.spec.ts
import { describe, expect, it } from 'vitest';
import { toLiveTakeAnswers } from './homepageLiveTake';

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
