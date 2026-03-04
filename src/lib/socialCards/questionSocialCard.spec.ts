// src/lib/socialCards/questionSocialCard.spec.ts
import { describe, expect, it } from 'vitest';
import {
	QUESTION_SOCIAL_CARD_FILENAME,
	buildQuestionSocialCardPath,
	isQuestionSocialCardV1,
	toQuestionPublicImageUrl
} from './questionSocialCard';

describe('questionSocialCard helpers', () => {
	it('builds deterministic social-card path', () => {
		expect(buildQuestionSocialCardPath('why-do-i-overthink')).toBe(
			`images/why-do-i-overthink/${QUESTION_SOCIAL_CARD_FILENAME}`
		);
	});

	it('detects v1 social-card paths', () => {
		expect(isQuestionSocialCardV1(`images/some-question/${QUESTION_SOCIAL_CARD_FILENAME}`)).toBe(
			true
		);
		expect(isQuestionSocialCardV1('images/some-question/random-id.png')).toBe(false);
		expect(isQuestionSocialCardV1(null)).toBe(false);
	});

	it('builds supabase public URL for path', () => {
		expect(
			toQuestionPublicImageUrl(
				'https://abcxyz.supabase.co',
				`images/some-question/${QUESTION_SOCIAL_CARD_FILENAME}`
			)
		).toBe(
			`https://abcxyz.supabase.co/storage/v1/object/public/questions/images/some-question/${QUESTION_SOCIAL_CARD_FILENAME}`
		);
	});
});
