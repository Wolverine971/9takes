// src/lib/server/sanitizeArticleHtml.spec.ts
import { describe, expect, it } from 'vitest';
import { sanitizeArticleHtml } from './sanitizeArticleHtml';

describe('article HTML boundary', () => {
	it('removes executable markup and unsafe URLs', () => {
		const html = sanitizeArticleHtml(
			'<script>alert(1)</script><img src=x onerror="alert(1)"><a href="javascript:alert(1)">link</a><iframe src="https://attacker.example/"></iframe>'
		);
		expect(html).not.toMatch(/<script|onerror|javascript:|attacker\.example/);
	});
	it('preserves editorial component markers and approved embeds', () => {
		const html = sanitizeArticleHtml(
			'<div id="component-1" data-component-placeholder="PopCard"><figure><img src="/portrait.webp" alt="Portrait"></figure></div><iframe src="https://www.youtube.com/embed/abc" title="Interview"></iframe>'
		);
		expect(html).toContain('data-component-placeholder="PopCard"');
		expect(html).toContain('https://www.youtube.com/embed/abc');
	});
});
