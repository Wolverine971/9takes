// src/lib/rehype-prune-legacy-jsonld.spec.ts
import { describe, expect, it } from 'vitest';
import { pruneLegacyJsonLdFromMarkdown } from './rehype-prune-legacy-jsonld.js';

function post(jsonLd: object, body: string, frontmatter = "title: 'Test'") {
	return `---\n${frontmatter}\n---\n\n<svelte:head>\n<script type="application/ld+json">\n${JSON.stringify(jsonLd)}\n</script>\n</svelte:head>\n\n${body}\n`;
}

function jsonLdIn(output: string) {
	const match = output.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
	return match ? JSON.parse(match[1]) : null;
}

const faq = {
	'@context': 'https://schema.org',
	'@type': 'FAQPage',
	mainEntity: [
		{
			'@type': 'Question',
			name: 'What is the most common Enneagram type?',
			acceptedAnswer: { '@type': 'Answer', text: 'Type 9 in the largest sample.' }
		},
		{
			'@type': 'Question',
			name: 'Is this question only in the schema?',
			acceptedAnswer: { '@type': 'Answer', text: 'Yes.' }
		}
	]
};

describe('pruneLegacyJsonLdFromMarkdown', () => {
	it('removes a hand-rolled BlogPosting block', () => {
		const output = pruneLegacyJsonLdFromMarkdown(
			post({ '@context': 'https://schema.org', '@type': 'BlogPosting', headline: 'x' }, 'Body')
		);
		expect(jsonLdIn(output)).toBeNull();
	});

	it('keeps FAQ questions that appear in the visible body and drops the rest', () => {
		const output = pruneLegacyJsonLdFromMarkdown(
			post(
				faq,
				'## Frequently asked questions\n\n### What is the most common Enneagram type?\n\nType 9.'
			)
		);
		const kept = jsonLdIn(output);
		expect(kept['@type']).toBe('FAQPage');
		expect(kept.mainEntity.map((q: { name: string }) => q.name)).toEqual([
			'What is the most common Enneagram type?'
		]);
	});

	it('matches questions across markdown emphasis and curly apostrophes', () => {
		const withApostrophe = {
			...faq,
			mainEntity: [{ ...faq.mainEntity[0], name: "What's the rarest type?" }]
		};
		const output = pruneLegacyJsonLdFromMarkdown(
			post(withApostrophe, '### What’s the **rarest** type?\n\nType 4.')
		);
		expect(jsonLdIn(output)?.mainEntity).toHaveLength(1);
	});

	it('drops the FAQ block when no question is visible', () => {
		const output = pruneLegacyJsonLdFromMarkdown(post(faq, 'A post with no FAQ section.'));
		expect(jsonLdIn(output)).toBeNull();
	});

	it('keeps the visible FAQ node from a @graph that also holds a BlogPosting', () => {
		const graph = {
			'@context': 'https://schema.org',
			'@graph': [
				{ '@type': 'BlogPosting', headline: 'x' },
				{ ...faq, '@context': undefined }
			]
		};
		const output = pruneLegacyJsonLdFromMarkdown(
			post(graph, '### What is the most common Enneagram type?\n\nType 9.')
		);
		const kept = jsonLdIn(output);
		expect(kept['@type']).toBe('FAQPage');
		expect(kept['@context']).toBe('https://schema.org');
	});

	it('does not count text inside the JSON-LD script as visible', () => {
		const output = pruneLegacyJsonLdFromMarkdown(post(faq, 'Unrelated body.'));
		expect(output).not.toContain('FAQPage');
	});
});
