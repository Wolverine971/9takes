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

	it('strips URL-unsafe characters so clean URLs resolve (GSC 404 fix)', () => {
		// Apostrophes (straight + curly) are dropped, not left in the slug.
		expect(normalizePersonalitySlug("charli-d'amelio")).toBe('charli-damelio');
		expect(normalizePersonalitySlug('charli-d’amelio')).toBe('charli-damelio');
		expect(normalizePersonalitySlug("dixie-d'amelio")).toBe('dixie-damelio');
		// Periods are dropped: j.k.-rowling -> jk-rowling.
		expect(normalizePersonalitySlug('j.k.-rowling')).toBe('jk-rowling');
		// Accents are folded to ASCII, not dropped: brené -> brene.
		expect(normalizePersonalitySlug('brené-brown')).toBe('brene-brown');
		expect(normalizePersonalitySlug('beyoncé')).toBe('beyonce');
		// Already-clean slugs are unchanged (idempotent).
		expect(normalizePersonalitySlug('barack-obama')).toBe('barack-obama');
		expect(normalizePersonalitySlug('charli-damelio')).toBe('charli-damelio');
		// Non-strings return empty.
		expect(normalizePersonalitySlug(null)).toBe('');
		expect(normalizePersonalitySlug(undefined)).toBe('');
	});

	it('maps lowercase slugs back to the existing mixed-case image assets', () => {
		expect(resolvePersonalityImageSlug('jordan-peterson')).toBe('Jordan-Peterson');
		expect(buildPersonalityImagePath(1, 'jordan-peterson')).toBe('/types/1s/Jordan-Peterson.webp');
		expect(buildPersonalityImagePath(1, 'jordan-peterson', 'thumbnail')).toBe(
			'/types/1s/s-Jordan-Peterson.webp'
		);
		expect(buildPersonalityImagePath(3, 'john-travolta')).toBe('/types/3s/John-Travolta.webp');
		expect(buildPersonalityImagePath(3, 'john-travolta', 'thumbnail')).toBe(
			'/types/3s/s-John-Travolta.webp'
		);
	});

	it('formats display names using the preserved asset casing when available', () => {
		expect(formatPersonalityDisplayName('jordan-peterson')).toBe('Jordan Peterson');
		// j.k.-rowling now normalizes to the URL-safe jk-rowling; the proper-cased
		// "J.K. Rowling" lives in the DB title field, not the slug-derived name.
		expect(formatPersonalityDisplayName('j.k.-rowling')).toBe('JK Rowling');
	});
});
