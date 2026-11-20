// src/lib/server/questionCategoryIntro.spec.ts
import { load } from 'cheerio';
import { describe, expect, it } from 'vitest';

import {
	buildQuestionCategoryIntroDescription,
	renderQuestionCategoryIntroMarkdown
} from './questionCategoryIntro';

describe('questionCategoryIntro rendering', () => {
	it('renders a safe subset of markdown for public category intros', () => {
		const html = renderQuestionCategoryIntroMarkdown(
			'# Relationships\n\nThis **category** covers [connection](/questions) and <script>alert(1)</script>.\n\n- Trust\n- Boundaries'
		);

		expect(html).toContain('<p>Relationships</p>');
		expect(html).toContain('<strong>category</strong>');
		expect(html).toContain(
			'<a href="/questions" rel="nofollow noopener noreferrer">connection</a>'
		);
		expect(html).not.toContain('<script>');
		expect(html).toContain('<ul>');
		expect(html).toContain('<li>Trust</li>');
	});

	it('derives a plain text meta description when none is provided', () => {
		const description = buildQuestionCategoryIntroDescription(
			'This category explores friendship, intimacy, communication, and trust in close relationships.'
		);

		expect(description).toContain('friendship');
		expect(description.length).toBeLessThanOrEqual(160);
	});

	describe('links that are not allowed to stay links', () => {
		const encodedPayloads: Array<[string, string, string]> = [
			['script', '&lt;script&gt;alert(1)&lt;/script&gt;', '&lt;script&gt;'],
			['img', '&lt;img src=x onerror=alert(1)&gt;', '&lt;img src=x onerror=alert(1)&gt;'],
			['iframe', '&lt;iframe src="https://example.com"&gt;&lt;/iframe&gt;', '&lt;iframe'],
			['form', '&lt;form action="https://example.com"&gt;&lt;input&gt;&lt;/form&gt;', '&lt;form']
		];

		it.each(encodedPayloads)(
			'keeps entity-encoded <%s> in markdown link text as inert text',
			(tag, payload, escaped) => {
				const html = renderQuestionCategoryIntroMarkdown(
					`Before [${payload}](javascript:void) after`
				);
				const $ = load(html);

				expect($('script, img, iframe, form, input, a')).toHaveLength(0);
				expect($(tag)).toHaveLength(0);
				expect(html).toContain(escaped);
				expect(html).not.toContain('javascript:');
			}
		);

		it.each(encodedPayloads)(
			'keeps entity-encoded <%s> in raw anchor text as inert text',
			(tag, payload, escaped) => {
				const html = renderQuestionCategoryIntroMarkdown(
					`Before <a href="data:text/html,x">${payload}</a> after`
				);
				const $ = load(html);

				expect($('script, img, iframe, form, input, a')).toHaveLength(0);
				expect($(tag)).toHaveLength(0);
				expect(html).toContain(escaped);
			}
		);

		it('drops an unsafe link that has no text', () => {
			const html = renderQuestionCategoryIntroMarkdown(
				'Before <a href="javascript:void"></a> after'
			);

			expect(load(html)('a')).toHaveLength(0);
			expect(html).toContain('Before');
		});

		it.each([
			'//example.org/path',
			'/\\example.org/path',
			'\\\\example.org/path',
			'/&#9;/example.org/path',
			'/&#10;/example.org/path',
			'&#9;//example.org/path',
			' //example.org/path',
			'javascript:void',
			'data:text/html,x',
			'mailto:someone@example.org',
			'example.org/path'
		])('unlinks href %j', (href) => {
			const html = renderQuestionCategoryIntroMarkdown(`See <a href="${href}">the page</a> now`);
			const $ = load(html);

			expect($('a')).toHaveLength(0);
			expect(html).toContain('the page');
		});

		it.each([
			'/questions',
			'/',
			'/questions?x=1#top',
			'#section',
			'https://example.org/a',
			'http://example.org/a'
		])('keeps href %j', (href) => {
			const html = renderQuestionCategoryIntroMarkdown(`See <a href="${href}">the page</a> now`);
			const $ = load(html);

			expect($('a')).toHaveLength(1);
			expect($('a').attr('href')).toBe(href);
			expect($('a').attr('rel')).toBe('nofollow noopener noreferrer');
		});
	});
});
