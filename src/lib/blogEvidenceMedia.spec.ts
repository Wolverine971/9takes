// src/lib/blogEvidenceMedia.spec.ts
import { describe, expect, it } from 'vitest';
import { getAllBlogEvidenceMedia, getBlogEvidenceMedia } from './blogEvidenceMedia';

describe('blog evidence media registry', () => {
	it('uses unique IDs and existing public asset paths', async () => {
		const items = getAllBlogEvidenceMedia();
		const ids = items.map((item) => item.id);

		expect(new Set(ids).size).toBe(ids.length);
		expect(items.every((item) => item.image.src.startsWith('/blog-enrichment/'))).toBe(true);
	});

	it('requires a four-factor record for every fair-use image', () => {
		const fairUseItems = getAllBlogEvidenceMedia().filter(
			(item) => item.image.rights.status === 'fair-use'
		);

		expect(fairUseItems.length).toBeGreaterThan(0);
		for (const item of fairUseItems) {
			expect(item.image.rights.fair_use).toMatchObject({
				purpose: expect.any(String),
				nature: expect.any(String),
				amount: expect.any(String),
				market_effect: expect.any(String),
				legal_review: 'recommended'
			});
		}
	});

	it('resolves the Elon pilot evidence by ID', () => {
		const kimbal = getBlogEvidenceMedia('elon-kimbal-musk-empathy-quote');
		expect(kimbal?.quote?.speaker).toBe('Kimbal Musk');
		expect(kimbal?.presentation?.variant).toBe('compact');
		expect(getBlogEvidenceMedia('elon-talulah-riley-childhood-quote')).toMatchObject({
			presentation: { variant: 'feature' },
			image: { rights: { license: 'CC BY 2.0' } }
		});
		expect(getBlogEvidenceMedia('missing-evidence')).toBeUndefined();
	});
});
