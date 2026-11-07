// src/lib/server/socialCards/renderQuestionSocialCard.spec.ts
import { expect, it } from 'vitest';
import sharp from 'sharp';
import { renderQuestionSocialCard } from './renderQuestionSocialCard';
import {
	QUESTION_SOCIAL_CARD_HEIGHT,
	QUESTION_SOCIAL_CARD_WIDTH
} from '$lib/socialCards/questionSocialCard';

it('renders the v4 Cold Light question card as a 1200x630 PNG', async () => {
	const png = await renderQuestionSocialCard({
		questionText: 'What were you like as a kid in three words?',
		questionUrl: 'what-were-you-like-as-a-kid-in-3-words'
	});
	const metadata = await sharp(png).metadata();
	expect(metadata).toMatchObject({
		format: 'png',
		width: QUESTION_SOCIAL_CARD_WIDTH,
		height: QUESTION_SOCIAL_CARD_HEIGHT
	});
	expect([QUESTION_SOCIAL_CARD_WIDTH, QUESTION_SOCIAL_CARD_HEIGHT]).toEqual([1200, 630]);

	// Night ground: the bottom-left corner is near-black indigo, not the retired warm amber.
	const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
	const offset = ((info.height - 4) * info.width + 4) * info.channels;
	const [r, g, b] = [data[offset], data[offset + 1], data[offset + 2]];
	expect(r).toBeLessThan(40);
	expect(g).toBeLessThan(40);
	expect(b).toBeGreaterThanOrEqual(r);
});

it('falls back to a default prompt when the question is blank', async () => {
	const png = await renderQuestionSocialCard({ questionText: '   ' });
	const metadata = await sharp(png).metadata();
	expect(metadata.width).toBe(1200);
});
