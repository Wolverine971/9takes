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
