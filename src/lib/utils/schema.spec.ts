// src/lib/utils/schema.spec.ts
import { describe, expect, it } from 'vitest';

import {
	buildPersonIdentifiers,
	buildPersonSameAsUrls,
	jsonLdContainsType,
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

	it('merges explicit sameAs URLs ahead of legacy fallbacks', () => {
		expect(
			buildPersonSameAsUrls({
				sameAs: [
					'https://www.taylorswift.com/',
					'https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02'
				],
				wikipedia: 'https://en.wikipedia.org/wiki/Taylor_Swift',
				twitter: '@taylorswift13'
			})
		).toEqual([
			'https://www.taylorswift.com/',
			'https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02',
			'https://en.wikipedia.org/wiki/Taylor_Swift',
			'https://twitter.com/taylorswift13'
		]);
	});

	it('expands wikidataQid and imdbId into sameAs URLs', () => {
		expect(
			buildPersonSameAsUrls({
				wikidataQid: 'Q26876',
				imdbId: 'nm1728342'
			})
		).toEqual(['https://www.wikidata.org/wiki/Q26876', 'https://www.imdb.com/name/nm1728342/']);
	});

	it('dedupes an explicit Wikidata sameAs against the QID-derived URL', () => {
		expect(
			buildPersonSameAsUrls({
				sameAs: ['https://www.wikidata.org/wiki/Q26876/'],
				wikidataQid: 'Q26876'
			})
		).toEqual(['https://www.wikidata.org/wiki/Q26876/']);
	});

	it('rejects invalid wikidataQid and imdbId values', () => {
		expect(
			buildPersonSameAsUrls({
				wikidataQid: 'q26876',
				imdbId: 'tt1234567'
			})
		).toEqual([]);

		expect(
			buildPersonSameAsUrls({
				wikidataQid: 'Q',
				imdbId: 'NM1234567'
			})
		).toEqual([]);
	});

	it('rejects http://, relative paths, blank strings, and sentinels from explicit sameAs', () => {
		expect(
			buildPersonSameAsUrls({
				sameAs: [
					'http://example.com',
					'/relative/path',
					'',
					'none',
					'n/a',
					'not a url',
					'https://example.com/valid'
				]
			})
		).toEqual(['https://example.com/valid']);
	});

	it('builds identifier PropertyValues only for present IDs', () => {
		expect(buildPersonIdentifiers({ wikidataQid: 'Q26876', imdbId: 'nm1728342' })).toEqual([
			{ '@type': 'PropertyValue', propertyID: 'wikidata', value: 'Q26876' },
			{ '@type': 'PropertyValue', propertyID: 'imdb', value: 'nm1728342' }
		]);

		expect(buildPersonIdentifiers({ wikidataQid: 'Q26876' })).toEqual([
			{ '@type': 'PropertyValue', propertyID: 'wikidata', value: 'Q26876' }
		]);

		expect(buildPersonIdentifiers({ imdbId: 'nm1728342' })).toEqual([
			{ '@type': 'PropertyValue', propertyID: 'imdb', value: 'nm1728342' }
		]);

		expect(buildPersonIdentifiers({})).toEqual([]);

		expect(buildPersonIdentifiers({ wikidataQid: 'not-a-qid', imdbId: 'not-an-nconst' })).toEqual(
			[]
		);
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

	describe('jsonLdContainsType', () => {
		it('returns false for null/non-node inputs', () => {
			expect(jsonLdContainsType(null, 'BreadcrumbList')).toBe(false);
			expect(jsonLdContainsType(undefined, 'BreadcrumbList')).toBe(false);
			expect(jsonLdContainsType('BreadcrumbList', 'BreadcrumbList')).toBe(false);
		});

		it('detects a type at the top level of a node', () => {
			expect(jsonLdContainsType({ '@type': 'BreadcrumbList' }, 'BreadcrumbList')).toBe(true);
			expect(jsonLdContainsType({ '@type': 'Article' }, 'BreadcrumbList')).toBe(false);
		});

		it('detects a type inside a @graph array', () => {
			const snippet = {
				'@context': 'https://schema.org',
				'@graph': [
					{ '@type': 'Article', headline: 'X' },
					{ '@type': 'BreadcrumbList', itemListElement: [] }
				]
			};
			expect(jsonLdContainsType(snippet, 'BreadcrumbList')).toBe(true);
			expect(jsonLdContainsType(snippet, 'FAQPage')).toBe(false);
		});

		it('detects a type inside a bare array of nodes', () => {
			const snippet = [{ '@type': 'Article' }, { '@type': 'BreadcrumbList' }];
			expect(jsonLdContainsType(snippet, 'BreadcrumbList')).toBe(true);
		});

		it('handles @type arrays', () => {
			expect(jsonLdContainsType({ '@type': ['Thing', 'BreadcrumbList'] }, 'BreadcrumbList')).toBe(
				true
			);
		});
	});
});
