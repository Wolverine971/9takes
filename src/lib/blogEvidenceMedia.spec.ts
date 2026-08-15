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

	it('uses the portrait-led presentation for every quoted person', () => {
		const quotedPeople = getAllBlogEvidenceMedia().filter((item) => item.quote);

		expect(quotedPeople.length).toBeGreaterThan(0);
		expect(quotedPeople.every((item) => item.presentation?.variant === 'portrait')).toBe(true);
	});

	it('resolves the Elon pilot evidence by ID', () => {
		const kimbal = getBlogEvidenceMedia('elon-kimbal-musk-empathy-quote');
		expect(kimbal?.quote?.speaker).toBe('Kimbal Musk');
		expect(kimbal?.presentation?.variant).toBe('portrait');
		expect(getBlogEvidenceMedia('elon-talulah-riley-childhood-quote')).toMatchObject({
			presentation: { variant: 'portrait' },
			image: {
				src: '/blog-enrichment/elon-musk/talulah-riley-portrait-2024.webp',
				rights: { status: 'fair-use' }
			}
		});
		expect(getBlogEvidenceMedia('elon-justine-musk-intimacy-quote')).toMatchObject({
			image: {
				src: '/blog-enrichment/elon-musk/justine-musk-speaking-2014.webp',
				height: 1200
			}
		});
		expect(getBlogEvidenceMedia('missing-evidence')).toBeUndefined();
	});
});
