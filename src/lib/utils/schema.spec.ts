// src/lib/utils/schema.spec.ts
import { describe, expect, it } from 'vitest';

import { parseJsonLdSnippet, updateJsonLdDateModified } from './schema';

describe('JSON-LD helpers', () => {
	it('parses serialized JSON-LD strings into objects', () => {
		const serializedSnippet = JSON.stringify(`
			{
				"@context": "https://schema.org",
				"@graph": [
					{
						"@type": "Article",
						"headline": "Cillian Murphy",
						"dateModified": "2026-02-19"
					}
				]
			}
		`);

		expect(parseJsonLdSnippet(serializedSnippet)).toEqual({
			'@context': 'https://schema.org',
			'@graph': [
				{
					'@type': 'Article',
					headline: 'Cillian Murphy',
					dateModified: '2026-02-19'
				}
			]
		});
	});

	it('updates dateModified across graph items without mutating the source', () => {
		const original = {
			'@context': 'https://schema.org',
			'@graph': [
				{
					'@type': 'Article',
					headline: 'Cillian Murphy',
					dateModified: '2026-02-19'
				},
				{
					'@type': 'FAQPage'
				}
			]
		};

		const updated = updateJsonLdDateModified(original, '2026-03-28');

		expect(updated).toEqual({
			'@context': 'https://schema.org',
			'@graph': [
				{
					'@type': 'Article',
					headline: 'Cillian Murphy',
					dateModified: '2026-03-28'
				},
				{
					'@type': 'FAQPage'
				}
			]
		});
		expect(original['@graph'][0]).toEqual({
			'@type': 'Article',
			headline: 'Cillian Murphy',
			dateModified: '2026-02-19'
		});
	});
});
