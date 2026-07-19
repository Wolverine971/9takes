// src/lib/utils/questionCategorySeo.spec.ts
import { describe, expect, it } from 'vitest';

import { hasSubstantiveQuestionCategoryIntro } from './questionCategorySeo.js';

describe('hasSubstantiveQuestionCategoryIntro', () => {
	it('keeps categories with saved intro copy indexable', () => {
		expect(
			hasSubstantiveQuestionCategoryIntro(
				'These questions explore trust, communication, and boundaries.'
			)
		).toBe(true);
	});

	it('treats missing and whitespace-only intros as thin content', () => {
		expect(hasSubstantiveQuestionCategoryIntro(null)).toBe(false);
		expect(hasSubstantiveQuestionCategoryIntro(undefined)).toBe(false);
		expect(hasSubstantiveQuestionCategoryIntro(' \n\t ')).toBe(false);
	});
});
