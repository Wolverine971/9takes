// src/lib/utils/socialImage.spec.ts
import { describe, expect, it } from 'vitest';
import { buildPersonSocialCardUrl, buildSocialImageUrl } from './socialImage';

describe('buildPersonSocialCardUrl', () => {
	it('builds a person-card URL with name and type for /types/ portraits', () => {
		const url = new URL(
			buildPersonSocialCardUrl({
				imagePath: 'https://9takes.com/types/9s/Adam-Sandler.webp',
				name: 'Adam  Sandler',
				type: '9'
			})
		);

		expect(url.origin + url.pathname).toBe('https://9takes.com/social-image.png');
		expect(url.searchParams.get('path')).toBe('/types/9s/Adam-Sandler.webp');
		expect(url.searchParams.get('name')).toBe('Adam Sandler');
		expect(url.searchParams.get('type')).toBe('9');
	});

	it('carries the portrait cache-buster and drops invalid types', () => {
		const url = new URL(
			buildPersonSocialCardUrl({
				imagePath: '/types/5s/Demis-Hassabis.webp?v=20260902d',
				name: 'Demis Hassabis',
				type: 0
			})
		);

		expect(url.searchParams.get('path')).toBe('/types/5s/Demis-Hassabis.webp');
		expect(url.searchParams.get('v')).toBe('20260902d');
		expect(url.searchParams.has('type')).toBe(false);
	});

	it('falls back to the plain portrait proxy without a usable name', () => {
		const imagePath = 'https://9takes.com/types/9s/Adam-Sandler.webp';
		expect(buildPersonSocialCardUrl({ imagePath, name: '' })).toBe(buildSocialImageUrl(imagePath));
		expect(buildPersonSocialCardUrl({ imagePath, name: 'x'.repeat(81) })).toBe(
			buildSocialImageUrl(imagePath)
		);
		expect(buildPersonSocialCardUrl({ imagePath: '', name: 'Adam Sandler' })).toBe('');
	});
});
