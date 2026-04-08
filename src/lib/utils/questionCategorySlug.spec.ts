// src/lib/utils/questionCategorySlug.spec.ts
import { describe, expect, it } from 'vitest';

import {
	buildQuestionCategoryPath,
	buildQuestionCategorySlug,
	matchesQuestionCategorySlug
} from './questionCategorySlug';

describe('questionCategorySlug', () => {
	it('slugifies category names into lowercase punctuation-free paths', () => {
		expect(buildQuestionCategorySlug('Art, History, and Culture')).toBe('art-history-and-culture');
		expect(buildQuestionCategoryPath('Technology, Science, and the Universe')).toBe(
			'/questions/categories/technology-science-and-the-universe'
		);
	});

	it('matches database slugify behavior for accented characters', () => {
		expect(buildQuestionCategorySlug('Beyonce')).toBe('beyonce');
		expect(buildQuestionCategorySlug('Beyonce & Co.')).toBe('beyonce-and-co');
		expect(buildQuestionCategorySlug('Beyonce and Co')).toBe('beyonce-and-co');
		expect(buildQuestionCategorySlug('Beyonce and Co')).not.toBe(
			buildQuestionCategorySlug('Beyonc\u00e9 and Co')
		);
		expect(buildQuestionCategorySlug('Beyonc\u00e9 and Co')).toBe('beyonc-and-co');
	});

	it('matches legacy mixed-case slugs to the canonical slug', () => {
		expect(
			matchesQuestionCategorySlug('Art, History, and Culture', 'Art,-History,-and-Culture')
		).toBe(true);
		expect(
			matchesQuestionCategorySlug(
				'Building Self-confidence and Self-worth',
				'building-self-confidence-and-self-worth'
			)
		).toBe(true);
	});
});
