// src/lib/posters/posterQuestionTextLayout.spec.ts
import { describe, expect, it } from 'vitest';
import {
	dimensionToPixels,
	estimatePosterQuestionTextLayout,
	getPosterQuestionBounds
} from './posterQuestionTextLayout';

describe('posterQuestionTextLayout', () => {
	it('converts inches to css pixels for export-sized poster formats', () => {
		expect(dimensionToPixels('1080px')).toBe(1080);
		expect(dimensionToPixels('8.5in')).toBe(816);
		expect(dimensionToPixels('11in')).toBe(1056);
	});

	it('reserves less question space when the poster footer includes a qr code and logo', () => {
		const withChrome = getPosterQuestionBounds({
			width: 1080,
			height: 1080,
			showLogo: true,
			showQrCode: true
		});
		const withoutChrome = getPosterQuestionBounds({
			width: 1080,
			height: 1080,
			showLogo: false,
			showQrCode: false
		});

		expect(withChrome.maxWidth).toBe(withoutChrome.maxWidth);
		expect(withChrome.maxHeight).toBeLessThan(withoutChrome.maxHeight);
	});

	it('keeps long questions intact in the synchronous fallback layout', () => {
		const text =
			'What is one belief you held very strongly in the past that you completely changed your mind about after a conversation, and what specific part of that conversation made the biggest difference for you?';
		const layout = estimatePosterQuestionTextLayout(text, {
			maxWidth: 900,
			maxHeight: 420
		});

		expect(layout.lines.join(' ')).toBe(text);
		expect(layout.lines.length).toBeGreaterThan(1);
	});
});
