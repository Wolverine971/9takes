// src/lib/utils/articleSlots.spec.ts
import { describe, expect, it } from 'vitest';
import {
	ENNEAGRAM_TYPE_DOSSIER_SLOT_MARKER,
	splitAtEnneagramTypeDossierSlot
} from './articleSlots';

describe('splitAtEnneagramTypeDossierSlot', () => {
	it('splits content at the explicit dossier slot', () => {
		const result = splitAtEnneagramTypeDossierSlot(
			`<p>Diagnosis.</p>${ENNEAGRAM_TYPE_DOSSIER_SLOT_MARKER}<h2>Next section</h2>`
		);

		expect(result).toEqual({
			before: '<p>Diagnosis.</p>',
			after: '<h2>Next section</h2>',
			hasSlot: true
		});
	});

	it('leaves articles without the slot uninterrupted', () => {
		const html = '<p>Complete article.</p>';

		expect(splitAtEnneagramTypeDossierSlot(html)).toEqual({
			before: html,
			after: '',
			hasSlot: false
		});
	});
});
