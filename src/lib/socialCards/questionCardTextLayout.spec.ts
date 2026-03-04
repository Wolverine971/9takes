// src/lib/socialCards/questionCardTextLayout.spec.ts
import { describe, expect, it } from 'vitest';
import { calculateQuestionCardTextLayout } from './questionCardTextLayout';

describe('questionCardTextLayout', () => {
	it('keeps short questions readable with large font', () => {
		const layout = calculateQuestionCardTextLayout('Who do you look up to and why?');
		expect(layout.lines.length).toBeLessThanOrEqual(2);
		expect(layout.fontSize).toBeGreaterThanOrEqual(52);
	});

	it('keeps long questions fully represented without truncation', () => {
		const text =
			'What is one belief you held very strongly in the past that you completely changed your mind about after a conversation, and what specific part of that conversation made the biggest difference for you?';
		const layout = calculateQuestionCardTextLayout(text);
		const rendered = layout.lines.join(' ');
		expect(rendered).toBe(text);
		expect(layout.lines.length).toBeGreaterThan(2);
	});

	it('returns a safe fallback when text is empty', () => {
		const layout = calculateQuestionCardTextLayout('   ');
		expect(layout.lines.join(' ')).toBe('Share your perspective');
	});
});
