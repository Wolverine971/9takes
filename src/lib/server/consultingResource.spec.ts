// src/lib/server/consultingResource.spec.ts
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
});
