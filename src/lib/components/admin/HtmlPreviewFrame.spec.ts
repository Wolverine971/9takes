// src/lib/components/admin/HtmlPreviewFrame.spec.ts
// @vitest-environment jsdom

import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import HtmlPreviewFrame from './HtmlPreviewFrame.svelte';

describe('HtmlPreviewFrame', () => {
	it('keeps untrusted HTML inside a restricted iframe document', () => {
		render(HtmlPreviewFrame, {
			props: {
				title: 'Unsafe email preview',
				html: '<script>window.parent.document.body.dataset.compromised = "true"</script><p>Hello</p>'
			}
		});

		const frame = screen.getByTitle('Unsafe email preview');
		const srcdoc = frame.getAttribute('srcdoc') ?? '';

		expect(frame.getAttribute('sandbox')).toBe('');
		expect(frame.getAttribute('referrerpolicy')).toBe('no-referrer');
		expect(srcdoc).toContain("script-src 'none'");
		expect(srcdoc).toContain("connect-src 'none'");
		expect(srcdoc).toContain('img-src data: blob:');
		expect(srcdoc).toContain('<p>Hello</p>');
		expect(document.body.dataset.compromised).toBeUndefined();
	});

	it.each([
		'src/lib/components/email/EmailComposeModal.svelte',
		'src/routes/admin/email-dashboard/+page.svelte',
		'src/routes/admin/blog-diff/[id]/+page.svelte'
	])('removes same-origin raw HTML rendering from %s', (relativePath) => {
		const source = readFileSync(resolve(process.cwd(), relativePath), 'utf8');

		expect(source).toContain('HtmlPreviewFrame');
		expect(source).not.toContain('{@html');
	});
});
