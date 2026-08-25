// src/lib/email/enneagram-type-prompt-content.spec.ts
import { describe, expect, it } from 'vitest';

import {
	ENNEAGRAM_TYPE_PROMPT_CONTENT,
	ENNEAGRAM_TYPE_PROMPT_VARIANTS
} from './enneagram-type-prompt-content';

describe('Enneagram type prompt variants', () => {
	it('keeps three distinct review variants with Variant A as the sendable pilot', () => {
		expect(ENNEAGRAM_TYPE_PROMPT_VARIANTS.map((variant) => variant.id)).toEqual(['a', 'b', 'c']);
		expect(ENNEAGRAM_TYPE_PROMPT_VARIANTS.map((variant) => variant.content.subject)).toEqual([
			'Make 9takes more useful to you',
			'Which Enneagram pattern feels most like you?',
			'Do you already know your Enneagram type?'
		]);
		expect(ENNEAGRAM_TYPE_PROMPT_VARIANTS[0]).toMatchObject({
			state: 'pilot',
			content: ENNEAGRAM_TYPE_PROMPT_CONTENT
		});
		expect(
			ENNEAGRAM_TYPE_PROMPT_VARIANTS.slice(1).every((variant) => variant.state === 'candidate')
		).toBe(true);
	});

	it.each(ENNEAGRAM_TYPE_PROMPT_VARIANTS)(
		'$label keeps one primary account CTA and the guide as the secondary path',
		({ content }) => {
			expect(content.htmlContent.match(/class="button"/g)).toHaveLength(1);
			expect(content.htmlContent).toContain('class="button" href="https://9takes.com/account"');
			expect(content.htmlContent).toContain(
				'https://9takes.com/enneagram-corner/beginners-guide-to-determining-your-enneagram-type'
			);
			expect(content.plainText).toContain('https://9takes.com/account');
		}
	);
});
