// src/lib/utils/personJsonLd.spec.ts
import { describe, expect, it } from 'vitest';

import {
	AUTHOR_DJ_WAYNE_ID,
	PERSONALITY_ANALYSIS_BLOG_ID,
	PUBLISHER_ID,
	buildPersonPageJsonLd,
	type PersonJsonLdInput
} from './personJsonLd';

const CANONICAL_URL = 'https://9takes.com/personality-analysis/Taylor-Swift';

function minimalInput(overrides: Partial<PersonJsonLdInput> = {}): PersonJsonLdInput {
	return {
		personName: 'Taylor Swift',
		canonicalUrl: CANONICAL_URL,
		breadcrumb: [
			{ name: 'Home', url: 'https://9takes.com/' },
			{ name: 'Personality Analysis', url: 'https://9takes.com/personality-analysis' },
			{ name: 'Taylor Swift', url: CANONICAL_URL }
		],
		title: 'Taylor Swift: The Psychology of Pop Reinvention',
		description: 'Why Taylor Swift keeps re-inventing herself — an Enneagram Type 3 analysis.',
		datePublished: '2026-01-17',
		dateModified: '2026-04-19',
		...overrides
	};
}

function getGraphNode<T extends string>(
	result: ReturnType<typeof buildPersonPageJsonLd>,
	type: T
): Record<string, unknown> | undefined {
	return result['@graph'].find((node) => node['@type'] === type);
}

describe('buildPersonPageJsonLd', () => {
	it('produces the full graph given every input field', () => {
		const result = buildPersonPageJsonLd(
			minimalInput({
				articleBody: "Pop's Comeback Engineer. Type 3 driven reinvention.",
				imageUrl: 'https://9takes.com/types/3s/Taylor-Swift.webp',
				imageWidth: 900,
				imageHeight: 900,
				keywords: ['Taylor Swift personality type', 'Taylor Swift Enneagram', 'Type 3 celebrity'],
				sameAs: [
					'https://en.wikipedia.org/wiki/Taylor_Swift',
					'https://www.wikidata.org/wiki/Q26876',
					'https://www.imdb.com/name/nm1728342/'
				],
				identifiers: [
					{ '@type': 'PropertyValue', propertyID: 'wikidata', value: 'Q26876' },
					{ '@type': 'PropertyValue', propertyID: 'imdb', value: 'nm1728342' }
				],
				birthDate: '1989-12-13',
				birthPlace: 'West Reading, Pennsylvania, USA',
				nationality: 'American',
				jobTitle: 'Singer-songwriter',
				hasOccupation: ['Singer-songwriter', 'Record producer', 'Actress'],
				knowsAbout: ['Pop music', 'Country music', 'Songwriting'],
				citations: [
					'https://en.wikipedia.org/wiki/Taylor_Swift',
					'https://www.vogue.com/article/taylor-swift-cover-story-september-2019'
				],
				wordCount: 2840,
				timeRequired: 'PT14M',
				faqs: [
					{
						question: "What is Taylor Swift's Enneagram type?",
						answer: 'Taylor Swift is an Enneagram Type 3 (The Achiever).',
						anchor: 'what-is-taylor-swifts-personality-type'
					},
					{
						question: 'Why does Taylor Swift re-record her albums?',
						answer: 'From a Type 3 lens, ownership and narrative control are central.'
					}
				]
			})
		);

		expect(result['@context']).toBe('https://schema.org');
		expect(result['@graph'].map((node) => node['@type'])).toEqual([
			'Article',
			'Person',
			'Person',
			'Organization',
			'Blog',
			'BreadcrumbList',
			'FAQPage'
		]);

		const article = getGraphNode(result, 'Article');
		expect(article).toMatchObject({
			'@id': `${CANONICAL_URL}#article`,
			headline: 'Taylor Swift: The Psychology of Pop Reinvention',
			articleSection: 'Personality Analysis',
			inLanguage: 'en-US',
			keywords: ['Taylor Swift personality type', 'Taylor Swift Enneagram', 'Type 3 celebrity'],
			wordCount: 2840,
			timeRequired: 'PT14M',
			isAccessibleForFree: true,
			datePublished: '2026-01-17',
			dateModified: '2026-04-19',
			author: { '@id': AUTHOR_DJ_WAYNE_ID },
			publisher: { '@id': PUBLISHER_ID },
			isPartOf: { '@id': PERSONALITY_ANALYSIS_BLOG_ID },
			mainEntityOfPage: { '@type': 'WebPage', '@id': CANONICAL_URL },
			image: {
				'@type': 'ImageObject',
				url: 'https://9takes.com/types/3s/Taylor-Swift.webp',
				width: 900,
				height: 900
			},
			about: { '@id': `${CANONICAL_URL}#person` },
			mentions: { '@id': `${CANONICAL_URL}#person` },
			citation: [
				'https://en.wikipedia.org/wiki/Taylor_Swift',
				'https://www.vogue.com/article/taylor-swift-cover-story-september-2019'
			],
			speakable: {
				'@type': 'SpeakableSpecification',
				cssSelector: ['.firstLetter', 'details > div.panel', 'h2 + p:first-of-type']
			}
		});
	});

	it('emits the subject Person node with every attribute when provided', () => {
		const result = buildPersonPageJsonLd(
			minimalInput({
				sameAs: ['https://en.wikipedia.org/wiki/Taylor_Swift'],
				identifiers: [{ '@type': 'PropertyValue', propertyID: 'wikidata', value: 'Q26876' }],
				birthDate: '1989-12-13',
				birthPlace: 'West Reading, Pennsylvania, USA',
				nationality: 'American',
				jobTitle: 'Singer-songwriter',
				hasOccupation: ['Singer-songwriter', 'Record producer'],
				knowsAbout: ['Pop music', 'Songwriting']
			})
		);

		const subject = result['@graph'].find(
			(node) => node['@type'] === 'Person' && node['@id'] === `${CANONICAL_URL}#person`
		);

		expect(subject).toEqual({
			'@type': 'Person',
			'@id': `${CANONICAL_URL}#person`,
			name: 'Taylor Swift',
			birthDate: '1989-12-13',
			birthPlace: { '@type': 'Place', name: 'West Reading, Pennsylvania, USA' },
			nationality: { '@type': 'Country', name: 'American' },
			jobTitle: 'Singer-songwriter',
			hasOccupation: [
				{ '@type': 'Occupation', name: 'Singer-songwriter' },
				{ '@type': 'Occupation', name: 'Record producer' }
			],
			knowsAbout: ['Pop music', 'Songwriting'],
			sameAs: ['https://en.wikipedia.org/wiki/Taylor_Swift'],
			identifier: [{ '@type': 'PropertyValue', propertyID: 'wikidata', value: 'Q26876' }]
		});
	});

	it('omits the FAQPage node when faqs is empty or undefined', () => {
		const emptyFaqs = buildPersonPageJsonLd(minimalInput({ faqs: [] }));
		const noFaqs = buildPersonPageJsonLd(minimalInput());

		expect(emptyFaqs['@graph'].some((node) => node['@type'] === 'FAQPage')).toBe(false);
		expect(noFaqs['@graph'].some((node) => node['@type'] === 'FAQPage')).toBe(false);
	});

	it('omits the FAQPage node when only a single FAQ item is supplied', () => {
		const result = buildPersonPageJsonLd(
			minimalInput({
				faqs: [
					{
						question: "What is Taylor Swift's Enneagram type?",
						answer: 'Type 3.',
						anchor: 'type'
					}
				]
			})
		);

		expect(result['@graph'].some((node) => node['@type'] === 'FAQPage')).toBe(false);
	});

	it('emits FAQ acceptedAnswer.url only when an anchor is present', () => {
		const result = buildPersonPageJsonLd(
			minimalInput({
				faqs: [
					{
						question: 'Q1',
						answer: 'A1',
						anchor: 'anchor-one'
					},
					{
						question: 'Q2',
						answer: 'A2'
					}
				]
			})
		);

		const faqNode = getGraphNode(result, 'FAQPage') as Record<string, unknown>;
		const questions = faqNode.mainEntity as Array<Record<string, unknown>>;
		const firstAnswer = questions[0].acceptedAnswer as Record<string, unknown>;
		const secondAnswer = questions[1].acceptedAnswer as Record<string, unknown>;

		expect(firstAnswer.url).toBe(`${CANONICAL_URL}#anchor-one`);
		expect(firstAnswer.author).toEqual({ '@id': AUTHOR_DJ_WAYNE_ID });
		expect(secondAnswer).not.toHaveProperty('url');
		expect(secondAnswer.author).toEqual({ '@id': AUTHOR_DJ_WAYNE_ID });
	});

	it('omits keywords, citation, and image when their inputs are absent', () => {
		const result = buildPersonPageJsonLd(minimalInput());
		const article = getGraphNode(result, 'Article') as Record<string, unknown>;

		expect(article).not.toHaveProperty('keywords');
		expect(article).not.toHaveProperty('citation');
		expect(article).not.toHaveProperty('image');
	});

	it('omits each Person attribute individually when its input is absent', () => {
		const result = buildPersonPageJsonLd(
			minimalInput({
				birthDate: '1989-12-13'
				// only birthDate — no other attributes
			})
		);

		const subject = result['@graph'].find(
			(node) => node['@type'] === 'Person' && node['@id'] === `${CANONICAL_URL}#person`
		) as Record<string, unknown>;

		expect(subject.birthDate).toBe('1989-12-13');
		expect(subject).not.toHaveProperty('birthPlace');
		expect(subject).not.toHaveProperty('nationality');
		expect(subject).not.toHaveProperty('jobTitle');
		expect(subject).not.toHaveProperty('hasOccupation');
		expect(subject).not.toHaveProperty('knowsAbout');
		expect(subject).not.toHaveProperty('sameAs');
		expect(subject).not.toHaveProperty('identifier');
	});

	it('omits identifier array entirely when identifiers input is empty', () => {
		const result = buildPersonPageJsonLd(minimalInput({ identifiers: [] }));
		const subject = result['@graph'].find(
			(node) => node['@type'] === 'Person' && node['@id'] === `${CANONICAL_URL}#person`
		) as Record<string, unknown>;

		expect(subject).not.toHaveProperty('identifier');
	});

	it('converts occupation[] into Occupation objects and uses jobTitle separately', () => {
		const result = buildPersonPageJsonLd(
			minimalInput({
				jobTitle: 'Singer-songwriter',
				hasOccupation: ['Singer-songwriter', 'Record producer', 'Actress']
			})
		);

		const subject = result['@graph'].find(
			(node) => node['@type'] === 'Person' && node['@id'] === `${CANONICAL_URL}#person`
		) as Record<string, unknown>;

		expect(subject.jobTitle).toBe('Singer-songwriter');
		expect(subject.hasOccupation).toEqual([
			{ '@type': 'Occupation', name: 'Singer-songwriter' },
			{ '@type': 'Occupation', name: 'Record producer' },
			{ '@type': 'Occupation', name: 'Actress' }
		]);
	});

	it('uses default speakable selectors and allows override', () => {
		const defaulted = buildPersonPageJsonLd(minimalInput());
		const defaultedArticle = getGraphNode(defaulted, 'Article') as Record<string, unknown>;
		expect(defaultedArticle.speakable).toEqual({
			'@type': 'SpeakableSpecification',
			cssSelector: ['.firstLetter', 'details > div.panel', 'h2 + p:first-of-type']
		});

		const overridden = buildPersonPageJsonLd(
			minimalInput({ speakableSelectors: ['.custom', 'article > h2'] })
		);
		const overriddenArticle = getGraphNode(overridden, 'Article') as Record<string, unknown>;
		expect(overriddenArticle.speakable).toEqual({
			'@type': 'SpeakableSpecification',
			cssSelector: ['.custom', 'article > h2']
		});
	});

	it('formats timeRequired as ISO 8601 duration string', () => {
		const result = buildPersonPageJsonLd(minimalInput({ timeRequired: 'PT14M' }));
		const article = getGraphNode(result, 'Article') as Record<string, unknown>;
		expect(article.timeRequired).toMatch(/^PT\d+M$/);
	});

	it('produces byte-identical output for the same input', () => {
		const input = minimalInput({
			keywords: ['a', 'b'],
			sameAs: ['https://example.com/one', 'https://example.com/two'],
			faqs: [
				{ question: 'Q1', answer: 'A1', anchor: 'q1' },
				{ question: 'Q2', answer: 'A2' }
			]
		});

		const first = JSON.stringify(buildPersonPageJsonLd(input));
		const second = JSON.stringify(buildPersonPageJsonLd(input));
		expect(first).toBe(second);
	});

	it('emits Article, Person, Author, Organization, Blog, and Breadcrumb at minimum', () => {
		const result = buildPersonPageJsonLd(minimalInput());
		expect(result['@graph'].map((node) => node['@type'])).toEqual([
			'Article',
			'Person',
			'Person',
			'Organization',
			'Blog',
			'BreadcrumbList'
		]);
	});

	it('builds the BreadcrumbList with 1-indexed positions', () => {
		const result = buildPersonPageJsonLd(minimalInput());
		const breadcrumb = getGraphNode(result, 'BreadcrumbList') as Record<string, unknown>;
		expect(breadcrumb.itemListElement).toEqual([
			{
				'@type': 'ListItem',
				position: 1,
				name: 'Home',
				item: 'https://9takes.com/'
			},
			{
				'@type': 'ListItem',
				position: 2,
				name: 'Personality Analysis',
				item: 'https://9takes.com/personality-analysis'
			},
			{
				'@type': 'ListItem',
				position: 3,
				name: 'Taylor Swift',
				item: CANONICAL_URL
			}
		]);
	});
});
