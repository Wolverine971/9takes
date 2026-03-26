// src/lib/utils/personalityAnalysis.spec.ts
import { describe, expect, it } from 'vitest';

import {
	buildPersonalityAnalysisPath,
	buildPersonalityImagePath,
	formatPersonalityDisplayName,
	normalizePersonalityAnalysisUrl,
	normalizePersonalitySlug,
	resolvePersonalityImageSlug
} from './personalityAnalysis';

describe('personalityAnalysis helpers', () => {
	it('normalizes personality slugs for canonical URLs', () => {
		expect(normalizePersonalitySlug('Jordan-Peterson')).toBe('jordan-peterson');
		expect(normalizePersonalitySlug('Jordan Peterson')).toBe('jordan-peterson');
		expect(buildPersonalityAnalysisPath('Jordan-Peterson')).toBe(
			'/personality-analysis/jordan-peterson'
		);
		expect(
			normalizePersonalityAnalysisUrl('https://9takes.com/personality-analysis/Jordan-Peterson')
		).toBe('https://9takes.com/personality-analysis/jordan-peterson');
	});

	it('maps lowercase slugs back to the existing mixed-case image assets', () => {
		expect(resolvePersonalityImageSlug('jordan-peterson')).toBe('Jordan-Peterson');
		expect(buildPersonalityImagePath(1, 'jordan-peterson')).toBe('/types/1s/Jordan-Peterson.webp');
		expect(buildPersonalityImagePath(1, 'jordan-peterson', 'thumbnail')).toBe(
			'/types/1s/s-Jordan-Peterson.webp'
		);
	});

	it('formats display names using the preserved asset casing when available', () => {
		expect(formatPersonalityDisplayName('jordan-peterson')).toBe('Jordan Peterson');
		expect(formatPersonalityDisplayName('j.k.-rowling')).toBe('J.K. Rowling');
	});
});
