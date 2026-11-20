// src/lib/server/consultingResource.spec.ts
import { load } from 'cheerio';
import { describe, expect, it } from 'vitest';

import {
	normalizeConsultingResourceRelatedBlogSlug,
	normalizeConsultingResourceSlug,
	renderConsultingResourceMarkdown
} from './consultingResource';

describe('consultingResource helpers', () => {
	it('normalizes slugs for admin edits', () => {
		expect(normalizeConsultingResourceSlug(' Intro Call Playbook ')).toBe('intro-call-playbook');
		expect(normalizeConsultingResourceSlug('Trust & Boundaries 101')).toBe('trust-boundaries-101');
	});

	it('normalizes related blog slugs without forcing URLs', () => {
		expect(
			normalizeConsultingResourceRelatedBlogSlug('/guides/ultimate-guide-to-active-listening')
		).toBe('guides/ultimate-guide-to-active-listening');
		expect(
			normalizeConsultingResourceRelatedBlogSlug(
				'https://9takes.com/enneagram-corner/personality-maxing'
			)
		).toBe('https://9takes.com/enneagram-corner/personality-maxing');
		expect(normalizeConsultingResourceRelatedBlogSlug('   ')).toBeNull();
	});

	it('renders a safe subset of markdown for consulting resources', () => {
		const html = renderConsultingResourceMarkdown(
			'# Discovery Playbook\n\nUse **this guide** to open the session.\n\n- Start calm\n- Ask a better question\n\n[Safe link](/admin/consulting)\n\n[Unsafe](javascript:alert(1))\n\n<script>alert(1)</script>'
		);

		expect(html).toContain('<h1>Discovery Playbook</h1>');
		expect(html).toContain('<strong>this guide</strong>');
		expect(html).toContain(
			'<a href="/admin/consulting" rel="nofollow noopener noreferrer">Safe link</a>'
		);
		expect(html).toContain('<li>Start calm</li>');
		expect(html).not.toContain('javascript:alert(1)');
		expect(html).not.toContain('<script>');
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
				const html = renderConsultingResourceMarkdown(`Before [${payload}](javascript:void) after`);
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
				const html = renderConsultingResourceMarkdown(
					`Before <a href="data:text/html,x">${payload}</a> after`
				);
				const $ = load(html);

				expect($('script, img, iframe, form, input, a')).toHaveLength(0);
				expect($(tag)).toHaveLength(0);
				expect(html).toContain(escaped);
			}
		);

		it('drops an unsafe link that has no text', () => {
			const html = renderConsultingResourceMarkdown('Before <a href="javascript:void"></a> after');

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
			const html = renderConsultingResourceMarkdown(`See <a href="${href}">the page</a> now`);
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
			const html = renderConsultingResourceMarkdown(`See <a href="${href}">the page</a> now`);
			const $ = load(html);

			expect($('a')).toHaveLength(1);
			expect($('a').attr('href')).toBe(href);
			expect($('a').attr('rel')).toBe('nofollow noopener noreferrer');
		});
	});
});
