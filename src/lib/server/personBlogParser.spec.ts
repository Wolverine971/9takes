// src/lib/server/personBlogParser.spec.ts
import path from 'path';
import { describe, expect, it } from 'vitest';

import {
	countPublishableSections,
	countPublishableWords,
	extractJsonLd,
	filterProcessableMarkdownFiles,
	findUnfinishedDraftMarkers,
	getMissingPublishFrontmatterFields,
	getPublishImageStatus,
	normalizeBirthDate,
	normalizeFaqs,
	normalizeImdbId,
	normalizeStringArray,
	normalizeUrlArray,
	normalizeWikidataQid,
	parseMarkdownFile,
	resolveFirstPublishedAt,
	resolveReleaseEventType,
	selectPublishCandidate,
	shouldProcessMarkdownFile,
	updatePublishFrontmatterContent
} from '../../../scripts/personBlogParser.js';

describe('personBlogParser', () => {
	it('parses persona title, suggestions, and content quality from a person draft', async () => {
		const filePath = path.resolve(process.cwd(), 'src/blog/people/drafts/Malcolm-X.md');
		const parsed = await parseMarkdownFile(filePath);

		expect(parsed.person).toBe('malcolm-x');
		expect(parsed.persona_title).toBe("Justice's Incorruptible Fire");
		expect(parsed.suggestions).toEqual([
			'martin-luther-king-jr',
			'abraham-lincoln',
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

	it('validates publish frontmatter without treating published false as missing', () => {
		expect(
			getMissingPublishFrontmatterFields({
				title: 'Title',
				meta_title: 'Meta',
				persona_title: 'Persona',
				description: 'Description',
				author: 'DJ Wayne',
				date: '2026-04-12',
				loc: 'https://9takes.com/personality-analysis/example',
				lastmod: '2026-04-12',
				changefreq: 'monthly',
				priority: '0.6',
				published: false,
				enneagram: 4,
				type: ['musician'],
				person: 'Example',
				suggestions: ['Adele']
			})
		).toEqual([]);
	});

	it('updates publish fields without reformatting the rest of the frontmatter', () => {
		const input = `---
title: "Hilary Duff's Personality: Why She Can't Stop Giving Herself Away"
meta_title: "Hilary Duff's Hidden Hunger: The Cost of Being Everyone's Favorite"
persona_title: "America's Sweetest Survivor"
description: "At 18, Hilary Duff couldn't start a washing machine. She'd been too busy being what everyone needed. Here's the Enneagram Type 2 pattern behind it all."
author: 'DJ Wayne'
date: '2026-04-08'
loc: 'https://9takes.com/personality-analysis/Hilary-Duff'
lastmod: '2026-04-10'
changefreq: 'monthly'
priority: '0.6'
published: false
enneagram: 2
type: ['celebrity', 'musician']
person: 'Hilary-Duff'
suggestions: ['Paris-Hilton', 'Olivia-Rodrigo', 'Sabrina-Carpenter', 'Millie-Bobby-Brown']
---

Body`;

		const output = updatePublishFrontmatterContent(input, '2026-04-12');

		expect(output).toContain("date: '2026-04-12'");
		expect(output).toContain("lastmod: '2026-04-12'");
		expect(output).toContain('published: true');
		expect(output).toContain('persona_title: "America\'s Sweetest Survivor"');
		expect(output).toContain("author: 'DJ Wayne'");
		expect(output).toContain(
			`description: "At 18, Hilary Duff couldn't start a washing machine. She'd been too busy being what everyone needed. Here's the Enneagram Type 2 pattern behind it all."`
		);
		expect(output).toContain("type: ['celebrity', 'musician']");
		expect(output).toContain(
			"suggestions: ['Paris-Hilton', 'Olivia-Rodrigo', 'Sabrina-Carpenter', 'Millie-Bobby-Brown']"
		);
		expect(output).toContain("loc: 'https://9takes.com/personality-analysis/Hilary-Duff'");
		expect(output).not.toContain('description: >-');
		expect(output).not.toContain('author: DJ Wayne');
	});

	it('uses the current publish time as first_published_at for unpublished draft rows', () => {
		const publishedAt = '2026-04-17T10:00:00.000Z';

		expect(
			resolveFirstPublishedAt(
				{
					published: false,
					published_at: null,
					first_published_at: null
				},
				publishedAt
			)
		).toBe(publishedAt);
		expect(
			resolveFirstPublishedAt(
				{
					published: true,
					published_at: '2026-04-01T12:00:00.000Z',
					first_published_at: null
				},
				publishedAt
			)
		).toBe('2026-04-01T12:00:00.000Z');
	});

	it('classifies new publish events separately from republishes', () => {
		expect(
			resolveReleaseEventType({
				published: false,
				published_at: null,
				first_published_at: null
			})
		).toBe('published');
		expect(
			resolveReleaseEventType({
				published: true,
				published_at: '2026-04-01T12:00:00.000Z',
				first_published_at: null
			})
		).toBe('republished');
	});

	it('detects publishable body shape and unfinished markers', () => {
		const content = `
## One
This is a real paragraph with actual words.

## Two
TODO: add source.
`;

		expect(countPublishableSections(content)).toBe(2);
		expect(countPublishableWords(content)).toBeGreaterThan(10);
		expect(findUnfinishedDraftMarkers(content)).toContain('todo_marker');
	});

	it('requires both full and thumbnail personality images for publish candidates', async () => {
		const imageStatus = await getPublishImageStatus({
			person: 'cillian-murphy',
			enneagram: 5
		} as any);

		expect(imageStatus.fullPath).toContain('static/types/5s/Cillian-Murphy.webp');
		expect(imageStatus.thumbnailPath).toContain('static/types/5s/s-Cillian-Murphy.webp');
		expect(imageStatus.fullExists).toBe(true);
		expect(imageStatus.thumbnailExists).toBe(true);
	});

	it('selects the highest-grade unpublished eligible publish candidate', () => {
		const candidates = [
			{
				entry: { person: 'already-live', lastmod: '2026-04-12' },
				qualityOverall: 10,
				blockers: []
			},
			{
				entry: { person: 'candidate-a', lastmod: '2026-04-11' },
				qualityOverall: 8.8,
				blockers: []
			},
			{
				entry: { person: 'candidate-b', lastmod: '2026-04-10' },
				qualityOverall: 9.1,
				blockers: []
			}
		] as any[];

		const selected = selectPublishCandidate(
			candidates,
			new Map([
				['already-live', true],
				['candidate-a', false],
				['candidate-b', false]
			]),
			false
		);

		expect(selected?.entry.person).toBe('candidate-b');
		expect(candidates[0].blockers).toContain('already_published');
	});

	describe('JSON-LD frontmatter normalizers', () => {
		it('trims, drops empty, and dedupes string arrays case-insensitively', () => {
			expect(normalizeStringArray(['  Pop music ', 'pop music', 'Songwriting', ''])).toEqual([
				'Pop music',
				'Songwriting'
			]);
			expect(normalizeStringArray([])).toBeNull();
			expect(normalizeStringArray(null)).toBeNull();
			expect(normalizeStringArray('not an array')).toBeNull();
		});

		it('rejects non-HTTPS and invalid URLs and dedupes on trailing slash', () => {
			expect(
				normalizeUrlArray([
					'https://en.wikipedia.org/wiki/Taylor_Swift',
					'https://en.wikipedia.org/wiki/Taylor_Swift/', // trailing-slash dup
					'http://insecure.example.com',
					'not a url',
					'none',
					'  ',
					''
				])
			).toEqual(['https://en.wikipedia.org/wiki/Taylor_Swift']);
			expect(normalizeUrlArray(null)).toBeNull();
			expect(normalizeUrlArray([])).toBeNull();
		});

		it('accepts valid Wikidata QIDs and rejects malformed ones', () => {
			expect(normalizeWikidataQid('Q26876')).toBe('Q26876');
			expect(normalizeWikidataQid('  Q26876  ')).toBe('Q26876');
			expect(normalizeWikidataQid('Q')).toBeNull();
			expect(normalizeWikidataQid('q26876')).toBeNull();
			expect(normalizeWikidataQid('Q 26876')).toBeNull();
			expect(normalizeWikidataQid('Q0')).toBeNull();
			expect(normalizeWikidataQid('')).toBeNull();
			expect(normalizeWikidataQid(null)).toBeNull();
		});

		it('accepts valid IMDb nconsts and rejects malformed ones', () => {
			expect(normalizeImdbId('nm1728342')).toBe('nm1728342');
			expect(normalizeImdbId('tt1234567')).toBeNull();
			expect(normalizeImdbId('NM1728342')).toBeNull();
			expect(normalizeImdbId('')).toBeNull();
		});

		it('accepts ISO 8601 birth dates as strings and YAML Date objects', () => {
			expect(normalizeBirthDate('1989-12-13')).toBe('1989-12-13');
			expect(normalizeBirthDate(new Date('1989-12-13T00:00:00Z'))).toBe('1989-12-13');
			expect(normalizeBirthDate('2026-02-31')).toBeNull();
			expect(normalizeBirthDate('12/13/1989')).toBeNull();
			expect(normalizeBirthDate('not a date')).toBeNull();
			expect(normalizeBirthDate('')).toBeNull();
			expect(normalizeBirthDate(null)).toBeNull();
		});

		it('drops FAQs missing question or answer, dedupes, preserves anchors', () => {
			expect(
				normalizeFaqs([
					{ question: 'Q1?', answer: 'A1.', anchor: 'q1' },
					{ question: 'Q1?', answer: 'duplicate' },
					{ question: 'Q2?' },
					{ answer: 'no question' },
					{ question: '  ', answer: 'blank question' },
					{ question: 'Q3?', answer: 'A3.' }
				])
			).toEqual([
				{ question: 'Q1?', answer: 'A1.', anchor: 'q1' },
				{ question: 'Q3?', answer: 'A3.' }
			]);
			expect(normalizeFaqs([])).toBeNull();
			expect(normalizeFaqs(null)).toBeNull();
		});
	});
});
