// src/lib/utils/personJsonLd.ts
// Deterministic JSON-LD builder for /personality-analysis/[slug] pages.
// See docs/planning/people-jsonld-unification-2026-04-19.md for the spec.
//
// Inputs come from frontmatter / DB columns; constants come from this file.
// Same inputs + same constants = byte-identical output on every render.

import type { PersonIdentifier } from './schema';

export interface PersonJsonLdFaq {
	question: string;
	answer: string;
	anchor?: string;
}

export interface PersonJsonLdBreadcrumbItem {
	name: string;
	url: string;
}

export interface PersonJsonLdInput {
	personName: string;
	canonicalUrl: string;
	breadcrumb: PersonJsonLdBreadcrumbItem[];
	title: string;
	description: string;
	articleBody?: string;
	datePublished: string;
	dateModified: string;

	imageUrl?: string | null;
	imageWidth?: number;
	imageHeight?: number;

	// Topical + identity
	keywords?: string[] | null;
	sameAs?: string[] | null;
	identifiers?: PersonIdentifier[] | null;

	// Person attributes
	birthDate?: string | null;
	birthPlace?: string | null;
	nationality?: string | null;
	jobTitle?: string | null;
	hasOccupation?: string[] | null;
	knowsAbout?: string[] | null;

	// Article sourcing
	citations?: string[] | null;
	wordCount?: number | null;
	timeRequired?: string | null;

	// FAQs (pre-validated visible upstream)
	faqs?: PersonJsonLdFaq[] | null;

	// Overrides
	articleSection?: string;
	inLanguage?: string;
	speakableSelectors?: string[];
}

// Site-global @ids — stable across every page so crawlers can resolve references.
export const AUTHOR_DJ_WAYNE_ID = 'https://9takes.com/#dj-wayne';
export const PUBLISHER_ID = 'https://9takes.com/#organization';
export const PERSONALITY_ANALYSIS_BLOG_ID = 'https://9takes.com/personality-analysis#blog';

export const DJ_WAYNE_SAME_AS = [
	'https://www.instagram.com/djwayne3/',
	'https://www.youtube.com/@djwayne3',
	'https://www.linkedin.com/in/davidtwayne/',
	'https://twitter.com/djwayne3'
];

export const PUBLISHER_SAME_AS = [
	'https://www.instagram.com/9takesdotcom/',
	'https://twitter.com/9takesdotcom'
];

const DEFAULT_ARTICLE_SECTION = 'Personality Analysis';
const DEFAULT_IN_LANGUAGE = 'en-US';
const DEFAULT_SPEAKABLE_SELECTORS = ['.article-body p'];
const MIN_FAQ_ITEMS = 2;

type JsonLdNode = Record<string, unknown>;

export interface PersonPageJsonLd {
	'@context': 'https://schema.org';
	'@graph': JsonLdNode[];
}

function trimmedOrUndefined(value: string | null | undefined): string | undefined {
	if (typeof value !== 'string') return undefined;
	const trimmed = value.trim();
	return trimmed ? trimmed : undefined;
}

function nonEmptyArray<T>(value: T[] | null | undefined): T[] | undefined {
	return Array.isArray(value) && value.length > 0 ? value : undefined;
}

function buildArticleNode(input: PersonJsonLdInput): JsonLdNode {
	const node: JsonLdNode = {
		'@type': 'Article',
		'@id': `${input.canonicalUrl}#article`,
		headline: input.title,
		description: input.description
	};

	const articleBody = trimmedOrUndefined(input.articleBody);
	if (articleBody) node.articleBody = articleBody;

	node.articleSection = input.articleSection ?? DEFAULT_ARTICLE_SECTION;
	node.inLanguage = input.inLanguage ?? DEFAULT_IN_LANGUAGE;

	const keywords = nonEmptyArray(input.keywords);
	if (keywords) node.keywords = keywords;

	if (
		typeof input.wordCount === 'number' &&
		Number.isFinite(input.wordCount) &&
		input.wordCount > 0
	) {
		node.wordCount = Math.round(input.wordCount);
	}

	const timeRequired = trimmedOrUndefined(input.timeRequired);
	if (timeRequired) node.timeRequired = timeRequired;

	node.isAccessibleForFree = true;
	node.datePublished = input.datePublished;
	node.dateModified = input.dateModified;
	node.author = { '@id': AUTHOR_DJ_WAYNE_ID };
	node.publisher = { '@id': PUBLISHER_ID };
	node.mainEntityOfPage = { '@type': 'WebPage', '@id': input.canonicalUrl };
	node.isPartOf = { '@id': PERSONALITY_ANALYSIS_BLOG_ID };

	if (input.imageUrl) {
		const image: JsonLdNode = {
			'@type': 'ImageObject',
			url: input.imageUrl
		};
		if (typeof input.imageWidth === 'number') image.width = input.imageWidth;
		if (typeof input.imageHeight === 'number') image.height = input.imageHeight;
		node.image = image;
	}

	node.about = { '@id': `${input.canonicalUrl}#person` };
	node.mentions = { '@id': `${input.canonicalUrl}#person` };

	const citations = nonEmptyArray(input.citations);
	if (citations) node.citation = citations;

	const speakableSelectors = input.speakableSelectors ?? DEFAULT_SPEAKABLE_SELECTORS;
	if (speakableSelectors.length > 0) {
		node.speakable = {
			'@type': 'SpeakableSpecification',
			cssSelector: speakableSelectors
		};
	}

	return node;
}

function buildSubjectPersonNode(input: PersonJsonLdInput): JsonLdNode {
	const node: JsonLdNode = {
		'@type': 'Person',
		'@id': `${input.canonicalUrl}#person`,
		name: input.personName
	};

	const birthDate = trimmedOrUndefined(input.birthDate);
	if (birthDate) node.birthDate = birthDate;

	const birthPlace = trimmedOrUndefined(input.birthPlace);
	if (birthPlace) {
		node.birthPlace = { '@type': 'Place', name: birthPlace };
	}

	const nationality = trimmedOrUndefined(input.nationality);
	if (nationality) {
		node.nationality = { '@type': 'Country', name: nationality };
	}

	const jobTitle = trimmedOrUndefined(input.jobTitle);
	if (jobTitle) node.jobTitle = jobTitle;

	const occupation = nonEmptyArray(input.hasOccupation);
	if (occupation) {
		node.hasOccupation = occupation.map((name) => ({ '@type': 'Occupation', name }));
	}

	const knowsAbout = nonEmptyArray(input.knowsAbout);
	if (knowsAbout) node.knowsAbout = knowsAbout;

	const sameAs = nonEmptyArray(input.sameAs);
	if (sameAs) node.sameAs = sameAs;

	const identifiers = nonEmptyArray(input.identifiers);
	if (identifiers) node.identifier = identifiers;

	return node;
}

function buildAuthorNode(): JsonLdNode {
	return {
		'@type': 'Person',
		'@id': AUTHOR_DJ_WAYNE_ID,
		name: 'DJ Wayne',
		sameAs: DJ_WAYNE_SAME_AS
	};
}

function buildPublisherNode(): JsonLdNode {
	return {
		'@type': 'Organization',
		'@id': PUBLISHER_ID,
		name: '9takes',
		url: 'https://9takes.com/',
		logo: {
			'@type': 'ImageObject',
			url: 'https://9takes.com/brand/darkRubix.png'
		},
		sameAs: PUBLISHER_SAME_AS
	};
}

function buildBlogNode(): JsonLdNode {
	return {
		'@type': 'Blog',
		'@id': PERSONALITY_ANALYSIS_BLOG_ID,
		name: '9takes Personality Analysis',
		url: 'https://9takes.com/personality-analysis',
		publisher: { '@id': PUBLISHER_ID }
	};
}

function buildBreadcrumbNode(input: PersonJsonLdInput): JsonLdNode {
	return {
		'@type': 'BreadcrumbList',
		'@id': `${input.canonicalUrl}#breadcrumb`,
		itemListElement: input.breadcrumb.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: item.url
		}))
	};
}

function buildFaqNode(input: PersonJsonLdInput): JsonLdNode | null {
	const faqs = nonEmptyArray(input.faqs);
	if (!faqs || faqs.length < MIN_FAQ_ITEMS) return null;

	return {
		'@type': 'FAQPage',
		'@id': `${input.canonicalUrl}#faq`,
		mainEntity: faqs.map((faq) => {
			const acceptedAnswer: JsonLdNode = {
				'@type': 'Answer',
				text: faq.answer,
				author: { '@id': AUTHOR_DJ_WAYNE_ID }
			};
			const anchor = trimmedOrUndefined(faq.anchor);
			if (anchor) {
				acceptedAnswer.url = `${input.canonicalUrl}#${anchor}`;
			}
			return {
				'@type': 'Question',
				name: faq.question,
				acceptedAnswer
			};
		})
	};
}

export function buildPersonPageJsonLd(input: PersonJsonLdInput): PersonPageJsonLd {
	const graph: JsonLdNode[] = [
		buildArticleNode(input),
		buildSubjectPersonNode(input),
		buildAuthorNode(),
		buildPublisherNode(),
		buildBlogNode(),
		buildBreadcrumbNode(input)
	];

	const faqNode = buildFaqNode(input);
	if (faqNode) graph.push(faqNode);

	return {
		'@context': 'https://schema.org',
		'@graph': graph
	};
}
