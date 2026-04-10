// src/lib/utils/schema.spec.ts
import { describe, expect, it } from 'vitest';

import {
	buildPersonSameAsUrls,
	mergePersonSameAsIntoJsonLd,
	parseJsonLdSnippet,
	updateJsonLdDateModified
} from './schema';

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

	it('builds canonical person sameAs URLs from mixed social values', () => {
		expect(
			buildPersonSameAsUrls({
				wikipedia: 'https://en.wikipedia.org/wiki/Benson_Boone',
				twitter: '@BensonBoone',
				instagram: 'bensonboone',
				tiktok: 'https://www.tiktok.com/@bensonboone'
			})
		).toEqual([
			'https://en.wikipedia.org/wiki/Benson_Boone',
			'https://twitter.com/BensonBoone',
			'https://www.instagram.com/bensonboone/',
			'https://www.tiktok.com/@bensonboone'
		]);
	});

	it('ignores blank or sentinel social values', () => {
		expect(
			buildPersonSameAsUrls({
				wikipedia: 'None',
				fallbackWikipedia: 'https://en.wikipedia.org/wiki/Benson_Boone',
				twitter: 'None',
				instagram: '',
				tiktok: 'n/a'
			})
		).toEqual(['https://en.wikipedia.org/wiki/Benson_Boone']);
	});

	it('merges sameAs into article person references without mutating the source', () => {
		const original = {
			'@context': 'https://schema.org',
			'@graph': [
				{
					'@type': 'Article',
					headline: 'Benson Boone',
					mentions: {
						'@type': 'Person',
						name: 'Benson Boone',
						sameAs: ['https://en.wikipedia.org/wiki/Benson_Boone']
					}
				}
			]
		};

		const updated = mergePersonSameAsIntoJsonLd(original, {
			personName: 'Benson Boone',
			sameAs: [
				'https://en.wikipedia.org/wiki/Benson_Boone',
				'https://twitter.com/BensonBoone',
				'https://www.instagram.com/bensonboone/',
				'https://www.tiktok.com/@bensonboone'
			]
		});

		expect(updated).toEqual({
			'@context': 'https://schema.org',
			'@graph': [
				{
					'@type': 'Article',
					headline: 'Benson Boone',
					mentions: {
						'@type': 'Person',
						name: 'Benson Boone',
						sameAs: [
							'https://en.wikipedia.org/wiki/Benson_Boone',
							'https://twitter.com/BensonBoone',
							'https://www.instagram.com/bensonboone/',
							'https://www.tiktok.com/@bensonboone'
						]
					}
				}
			]
		});

		expect(original).toEqual({
			'@context': 'https://schema.org',
			'@graph': [
				{
					'@type': 'Article',
					headline: 'Benson Boone',
					mentions: {
						'@type': 'Person',
						name: 'Benson Boone',
						sameAs: ['https://en.wikipedia.org/wiki/Benson_Boone']
					}
				}
			]
		});
	});

	it('replaces stale subject sameAs values with the current field-driven URLs', () => {
		expect(
			mergePersonSameAsIntoJsonLd(
				{
					'@context': 'https://schema.org',
					'@type': 'Article',
					headline: 'Alix Earle',
					mentions: {
						'@type': 'Person',
						name: 'Alix Earle',
						sameAs: ['https://en.wikipedia.org/wiki/Alix_Earle', 'https://twitter.com/alaborr']
					}
				},
				{
					personName: 'Alix Earle',
					sameAs: [
						'https://en.wikipedia.org/wiki/Alix_Earle',
						'https://twitter.com/alixearle',
						'https://www.instagram.com/alixearle/'
					]
				}
			)
		).toEqual({
			'@context': 'https://schema.org',
			'@type': 'Article',
			headline: 'Alix Earle',
			mentions: {
				'@type': 'Person',
				name: 'Alix Earle',
				sameAs: [
					'https://en.wikipedia.org/wiki/Alix_Earle',
					'https://twitter.com/alixearle',
					'https://www.instagram.com/alixearle/'
				]
			}
		});
	});

	it('adds an about person node when article schema has no existing person reference', () => {
		expect(
			mergePersonSameAsIntoJsonLd(
				{
					'@context': 'https://schema.org',
					'@type': 'Article',
					headline: 'Benson Boone'
				},
				{
					personName: 'Benson Boone',
					sameAs: ['https://twitter.com/BensonBoone']
				}
			)
		).toEqual({
			'@context': 'https://schema.org',
			'@type': 'Article',
			headline: 'Benson Boone',
			about: {
				'@type': 'Person',
				name: 'Benson Boone',
				sameAs: ['https://twitter.com/BensonBoone']
			}
		});
	});

	it('does not add the subject sameAs links to other mentioned people', () => {
		expect(
			mergePersonSameAsIntoJsonLd(
				{
					'@context': 'https://schema.org',
					'@type': 'Article',
					headline: 'Benson Boone',
					mentions: [
						{
							'@type': 'Person',
							name: 'Brian May',
							sameAs: ['https://en.wikipedia.org/wiki/Brian_May']
						},
						{
							'@type': 'Person',
							name: 'Benson Boone',
							sameAs: ['https://en.wikipedia.org/wiki/Benson_Boone']
						}
					]
				},
				{
					personName: 'Benson Boone',
					sameAs: ['https://en.wikipedia.org/wiki/Benson_Boone', 'https://twitter.com/BensonBoone']
				}
			)
		).toEqual({
			'@context': 'https://schema.org',
			'@type': 'Article',
			headline: 'Benson Boone',
			mentions: [
				{
					'@type': 'Person',
					name: 'Brian May',
					sameAs: ['https://en.wikipedia.org/wiki/Brian_May']
				},
				{
					'@type': 'Person',
					name: 'Benson Boone',
					sameAs: ['https://en.wikipedia.org/wiki/Benson_Boone', 'https://twitter.com/BensonBoone']
				}
			]
		});
	});
});
