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

function isJsonLdNode(value: unknown): value is JsonLdNode {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function cloneJsonLdValue<T extends JsonLdValue>(value: T): T {
	return JSON.parse(JSON.stringify(value)) as T;
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
