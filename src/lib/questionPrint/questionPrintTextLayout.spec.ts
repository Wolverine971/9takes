// src/lib/questionPrint/questionPrintTextLayout.spec.ts
import { describe, expect, it } from 'vitest';
import { estimateQuestionPrintTextLayout } from './questionPrintTextLayout';

describe('questionPrintTextLayout', () => {
	it('normalizes to uppercase to match rendered print output', () => {
		const layout = estimateQuestionPrintTextLayout({
			text: 'Who do you look up to and why?',
			maxWidth: 680,
			maxHeight: 280,
			maxLines: 6
		});

		expect(layout.text).toBe('WHO DO YOU LOOK UP TO AND WHY?');
	});

	it('keeps long questions intact in the fallback layout', () => {
		const text =
			'What is one belief you held very strongly in the past that you completely changed your mind about after a conversation, and what specific part of that conversation made the biggest difference for you?';
		const layout = estimateQuestionPrintTextLayout({
			text,
			maxWidth: 680,
			maxHeight: 280,
			maxLines: 6
		});

		expect(layout.lines.join(' ')).toBe(text.toUpperCase());
		expect(layout.lines.length).toBeGreaterThan(1);
	});

	it('returns an empty layout when no text is provided', () => {
		const layout = estimateQuestionPrintTextLayout({
			text: '   ',
			maxWidth: 680,
			maxHeight: 280
		});

		expect(layout.lines).toEqual([]);
		expect(layout.text).toBe('');
	});
});
