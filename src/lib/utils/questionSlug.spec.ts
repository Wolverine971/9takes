// src/lib/utils/questionSlug.spec.ts
import { describe, expect, it } from 'vitest';

import {
	appendQuestionSlugSuffix,
	buildQuestionSlug,
	QUESTION_URL_MAX_LENGTH
} from './questionSlug';

describe('questionSlug', () => {
	it('keeps readable prefixes when only a few keywords remain', () => {
		expect(buildQuestionSlug('What is the purpose of life?')).toBe('what-is-the-purpose-of-life');
	});

	it('removes punctuation and clamps long slugs', () => {
		const slug = buildQuestionSlug(
			'Why do people keep overexplaining themselves in text messages after a small disagreement with someone they are dating'
		);

		expect(slug).toBe('why-people-keep-overexplaining-themselves-text-messages-small-disagreement');
		expect(slug.length).toBeLessThanOrEqual(QUESTION_URL_MAX_LENGTH);
	});

	it('appends collision suffixes without exceeding the max length', () => {
		const baseSlug = 'why-people-keep-overexplaining-themselves-text-messages-small-disagreement';
		const slugWithSuffix = appendQuestionSlugSuffix(baseSlug, 17);

		expect(slugWithSuffix).toBe(
			'why-people-keep-overexplaining-themselves-text-messages-small-disagreement-17'
		);
		expect(slugWithSuffix.length).toBeLessThanOrEqual(QUESTION_URL_MAX_LENGTH);
	});
});
