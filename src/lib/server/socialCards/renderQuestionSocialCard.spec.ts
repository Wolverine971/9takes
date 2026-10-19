// src/lib/server/socialCards/renderQuestionSocialCard.spec.ts
import { expect, it } from 'vitest';
import sharp from 'sharp';
import { renderQuestionSocialCard } from './renderQuestionSocialCard';

it('parses the bundled font and renders a complete PNG', async () => {
	const png = await renderQuestionSocialCard({
		questionText: 'What were you like as a kid in three words?',
		questionUrl: 'what-were-you-like-as-a-kid-in-3-words'
	});
	const metadata = await sharp(png).metadata();
	expect(metadata).toMatchObject({ format: 'png', width: 1200, height: 628 });
});
