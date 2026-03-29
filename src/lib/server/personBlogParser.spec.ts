// src/lib/server/personBlogParser.spec.ts
import path from 'path';
import { describe, expect, it } from 'vitest';

import {
	extractJsonLd,
	filterProcessableMarkdownFiles,
	parseMarkdownFile,
	shouldProcessMarkdownFile
} from '../../../scripts/personBlogParser.js';

describe('personBlogParser', () => {
	it('parses persona title, suggestions, and content quality from a person draft', async () => {
		const filePath = path.resolve(process.cwd(), 'src/blog/people/drafts/Malcolm-X.md');
		const parsed = await parseMarkdownFile(filePath);

		expect(parsed.person).toBe('malcolm-x');
		expect(parsed.persona_title).toBe("Justice's Incorruptible Fire");
		expect(parsed.suggestions).toEqual([
			'martin-luther-king-jr',
			'muhammad-ali',
			'barack-obama',
			'denzel-washington'
		]);
		expect(parsed.content_quality).toEqual({
			hook: 9,
			enneagram: 9,
			evidence: 8,
			writing: 9,
			originality: 9,
			overall: 8.8,
			letter: 'B+',
			graded_at: '2026-03-04'
		});
	});

	it('filters out templates and research helpers from full person pushes', () => {
		expect(shouldProcessMarkdownFile('src/blog/people/person-template.md')).toBe(false);
		expect(shouldProcessMarkdownFile('src/blog/people/drafts/Tom-Holland-research.md')).toBe(false);
		expect(
			shouldProcessMarkdownFile('src/blog/people/drafts/Taylor-Swift-updated-sections.md')
		).toBe(false);
		expect(shouldProcessMarkdownFile('src/blog/people/drafts/Malcolm-X.md')).toBe(true);

		expect(
			filterProcessableMarkdownFiles([
				'src/blog/people/person-template.md',
				'src/blog/people/drafts/Tom-Holland-research.md',
				'src/blog/people/drafts/Malcolm-X.md'
			])
		).toEqual(['src/blog/people/drafts/Malcolm-X.md']);
	});

	it('parses embedded JSON-LD blocks into structured objects', async () => {
		const filePath = path.resolve(process.cwd(), 'src/blog/people/drafts/Cillian-Murphy.md');
		const parsed = await parseMarkdownFile(filePath);

		expect(parsed.jsonld_snippet).toMatchObject({
			'@context': 'https://schema.org',
			'@graph': expect.arrayContaining([
				expect.objectContaining({
					'@type': 'Article',
					headline: 'Cillian Murphy: The Invisible Man Behind Intense Eyes'
				})
			])
		});
	});

	it('extracts JSON-LD from stringified script content as an object', () => {
		expect(
			extractJsonLd(`
				<svelte:head>
					<script type="application/ld+json">
						{
							"@context": "https://schema.org",
							"@type": "Article",
							"headline": "Test"
						}
					</script>
				</svelte:head>
			`)
		).toEqual({
			'@context': 'https://schema.org',
			'@type': 'Article',
			headline: 'Test'
		});
	});
});
