// src/lib/utils/schema.ts
// Schema utilities for SEO structured data
import type { FAQItem } from '$lib/types/faq';

/**
 * Builds FAQPage JSON-LD schema from FAQ items
 * @see https://schema.org/FAQPage
 */
export function buildFAQSchema(faqs: FAQItem[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqs.map((faq) => ({
			'@type': 'Question',
			name: faq.question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: faq.answer
			}
		}))
	};
}

/**
 * HowTo step interface
 */
export interface HowToStep {
	name: string;
	text: string;
	image?: string;
}

/**
 * Builds HowTo JSON-LD schema from steps
 * @see https://schema.org/HowTo
 */
export function buildHowToSchema(options: {
	name: string;
	description: string;
	steps: HowToStep[];
	image?: string;
	totalTime?: string; // ISO 8601 duration format, e.g., "PT30M" for 30 minutes
}) {
	return {
		'@context': 'https://schema.org',
		'@type': 'HowTo',
		name: options.name,
		description: options.description,
		...(options.image && { image: options.image }),
		...(options.totalTime && { totalTime: options.totalTime }),
		step: options.steps.map((step, index) => ({
			'@type': 'HowToStep',
			position: index + 1,
			name: step.name,
			text: step.text,
			...(step.image && { image: step.image })
		}))
	};
}

export interface BreadcrumbItem {
	name: string;
	url: string;
}

/**
 * Builds BreadcrumbList JSON-LD schema
 * @see https://schema.org/BreadcrumbList
 */
export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: item.url
		}))
	};
}

/**
 * Builds BreadcrumbList schema as part of a @graph array
 */
export function buildBreadcrumbSchemaForGraph(items: BreadcrumbItem[]) {
	return {
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: item.url
		}))
	};
}

/**
 * Builds FAQPage schema as part of a @graph array (for pages with multiple schema types)
 */
export function buildFAQSchemaForGraph(faqs: FAQItem[]) {
	return {
		'@type': 'FAQPage',
		mainEntity: faqs.map((faq) => ({
			'@type': 'Question',
			name: faq.question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: faq.answer
			}
		}))
	};
}

type JsonLdNode = Record<string, unknown>;
type JsonLdValue = JsonLdNode | JsonLdNode[];
type SupportedPersonSocialPlatform = 'wikipedia' | 'twitter' | 'instagram' | 'tiktok';

function isJsonLdNode(value: unknown): value is JsonLdNode {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function cloneJsonLdValue<T extends JsonLdValue>(value: T): T {
	return JSON.parse(JSON.stringify(value)) as T;
}

function normalizeUrlForComparison(value: string): string {
	return value.trim().replace(/\/+$/, '').toLowerCase();
}

function dedupeUrls(values: string[]): string[] {
	const seen = new Set<string>();
	const deduped: string[] = [];

	for (const value of values) {
		const trimmed = value.trim();
		if (!trimmed) continue;

		const key = normalizeUrlForComparison(trimmed);
		if (seen.has(key)) continue;

		seen.add(key);
		deduped.push(trimmed);
	}

	return deduped;
}

function isEmptySocialValue(value: string | null | undefined): boolean {
	return !value || /^(?:none|null|n\/a|na)$/i.test(value.trim());
}

function normalizeProfileUrl(
	platform: SupportedPersonSocialPlatform,
	value: string | null | undefined
): string | null {
	if (isEmptySocialValue(value)) {
		return null;
	}

	const trimmed = value!.trim();

	if (/^https?:\/\//i.test(trimmed)) {
		return trimmed;
	}

	switch (platform) {
		case 'wikipedia':
			return `https://en.wikipedia.org/wiki/${trimmed.replace(/\s+/g, '_')}`;
		case 'twitter': {
			const handle = trimmed.replace(/^@/, '');
			return handle ? `https://twitter.com/${handle}` : null;
		}
		case 'instagram': {
			const handle = trimmed.replace(/^@/, '');
			return handle ? `https://www.instagram.com/${handle}/` : null;
		}
		case 'tiktok': {
			const handle = trimmed.replace(/^@/, '');
			return handle ? `https://www.tiktok.com/@${handle}` : null;
		}
	}
}

function hasSchemaType(node: JsonLdNode, schemaType: string): boolean {
	const candidateType = node['@type'];

	if (typeof candidateType === 'string') {
		return candidateType === schemaType;
	}

	if (Array.isArray(candidateType)) {
		return candidateType.some((item) => typeof item === 'string' && item === schemaType);
	}

	return false;
}

function isArticleSchemaNode(node: JsonLdNode): boolean {
	return ['Article', 'BlogPosting', 'NewsArticle'].some((schemaType) =>
		hasSchemaType(node, schemaType)
	);
}

function isPersonSchemaNode(node: JsonLdNode): boolean {
	return !('@type' in node) || hasSchemaType(node, 'Person');
}

function normalizePersonNameForComparison(value: string): string {
	return value
		.trim()
		.toLowerCase()
		.replace(/[^\p{L}\p{N}]+/gu, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function shouldMergeIntoPersonNode(
	personNode: JsonLdNode,
	personName: string | null | undefined
): boolean {
	if (!isPersonSchemaNode(personNode)) {
		return false;
	}

	if (!personName?.trim()) {
		return true;
	}

	if (typeof personNode.name !== 'string' || !personNode.name.trim()) {
		return true;
	}

	return (
		normalizePersonNameForComparison(personNode.name) ===
		normalizePersonNameForComparison(personName)
	);
}

function buildPersonReference(personName: string | null | undefined, sameAs: string[]): JsonLdNode {
	return {
		'@type': 'Person',
		...(personName?.trim() ? { name: personName.trim() } : {}),
		sameAs
	};
}

function mergeSameAsIntoPersonNode(
	personNode: JsonLdNode,
	personName: string | null | undefined,
	sameAs: string[]
): JsonLdNode {
	if (personName?.trim() && (typeof personNode.name !== 'string' || !personNode.name.trim())) {
		personNode.name = personName.trim();
	}

	personNode.sameAs = [...sameAs];
	return personNode;
}

function mergeSameAsIntoArticleReference(
	articleNode: JsonLdNode,
	property: 'about' | 'mentions',
	personName: string | null | undefined,
	sameAs: string[]
): boolean {
	const current = articleNode[property];

	if (Array.isArray(current)) {
		let updatedAny = false;
		articleNode[property] = current.map((entry) => {
			if (!isJsonLdNode(entry) || !shouldMergeIntoPersonNode(entry, personName)) {
				return entry;
			}

			updatedAny = true;
			return mergeSameAsIntoPersonNode(entry, personName, sameAs);
		});
		return updatedAny;
	}

	if (isJsonLdNode(current) && shouldMergeIntoPersonNode(current, personName)) {
		articleNode[property] = mergeSameAsIntoPersonNode(current, personName, sameAs);
		return true;
	}

	return false;
}

function unwrapJsonLdScriptTag(value: string): string {
	const trimmed = value.trim();
	const scriptMatch = trimmed.match(
		/^<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>$/i
	);
	return scriptMatch?.[1]?.trim() ?? trimmed;
}

export function parseJsonLdSnippet(value: unknown): JsonLdValue | null {
	let parsed = value;

	for (let attempts = 0; attempts < 3 && typeof parsed === 'string'; attempts += 1) {
		const candidate = unwrapJsonLdScriptTag(parsed);
		if (!candidate) return null;

		try {
			parsed = JSON.parse(candidate);
		} catch {
			return null;
		}
	}

	if (Array.isArray(parsed) && parsed.every(isJsonLdNode)) {
		return cloneJsonLdValue(parsed);
	}

	if (isJsonLdNode(parsed)) {
		return cloneJsonLdValue(parsed);
	}

	return null;
}

export function updateJsonLdDateModified(
	value: JsonLdValue,
	dateModified: string | null | undefined
): JsonLdValue {
	const clonedValue = cloneJsonLdValue(value);

	if (!dateModified) {
		return clonedValue;
	}

	const visit = (candidate: unknown): unknown => {
		if (Array.isArray(candidate)) {
			return candidate.map(visit);
		}

		if (!isJsonLdNode(candidate)) {
			return candidate;
		}

		if ('dateModified' in candidate) {
			candidate.dateModified = dateModified;
		}

		if (Array.isArray(candidate['@graph'])) {
			candidate['@graph'] = candidate['@graph'].map(visit);
		}

		return candidate;
	};

	return visit(clonedValue) as JsonLdValue;
}

export function buildPersonSameAsUrls(options: {
	wikipedia?: string | null;
	fallbackWikipedia?: string | null;
	twitter?: string | null;
	instagram?: string | null;
	tiktok?: string | null;
}): string[] {
	const wikipediaUrl =
		normalizeProfileUrl('wikipedia', options.wikipedia) ??
		normalizeProfileUrl('wikipedia', options.fallbackWikipedia);

	return dedupeUrls(
		[
			wikipediaUrl,
			normalizeProfileUrl('twitter', options.twitter),
			normalizeProfileUrl('instagram', options.instagram),
			normalizeProfileUrl('tiktok', options.tiktok)
		].filter((value): value is string => Boolean(value))
	);
}

export function mergePersonSameAsIntoJsonLd(
	value: JsonLdValue,
	options: {
		personName?: string | null;
		sameAs?: string[] | null;
	}
): JsonLdValue {
	const clonedValue = cloneJsonLdValue(value);
	const sameAs = dedupeUrls(options.sameAs ?? []);

	if (!sameAs.length) {
		return clonedValue;
	}

	const visit = (candidate: unknown): unknown => {
		if (Array.isArray(candidate)) {
			return candidate.map(visit);
		}

		if (!isJsonLdNode(candidate)) {
			return candidate;
		}

		if (Array.isArray(candidate['@graph'])) {
			candidate['@graph'] = candidate['@graph'].map(visit);
		}

		if (isArticleSchemaNode(candidate)) {
			const aboutUpdated = mergeSameAsIntoArticleReference(
				candidate,
				'about',
				options.personName,
				sameAs
			);
			const mentionsUpdated = mergeSameAsIntoArticleReference(
				candidate,
				'mentions',
				options.personName,
				sameAs
			);

			if (!aboutUpdated && !mentionsUpdated) {
				if (candidate.about === undefined) {
					candidate.about = buildPersonReference(options.personName, sameAs);
				} else if (candidate.mentions === undefined) {
					candidate.mentions = buildPersonReference(options.personName, sameAs);
				}
			}
		}

		return candidate;
	};

	return visit(clonedValue) as JsonLdValue;
}
