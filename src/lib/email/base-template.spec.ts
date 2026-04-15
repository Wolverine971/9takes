// src/lib/email/base-template.spec.ts
import { describe, expect, it } from 'vitest';

import { appendEmailFooterToPlainText, generateEmailHtml, htmlToPlainText } from './base-template';

describe('base email template helpers', () => {
	it('escapes recipient names when replacing name placeholders', () => {
		const html = generateEmailHtml({
			subject: 'Hello',
			content: '<p>Hi {{name}}</p>',
			recipientName: '<script>alert(1)</script>',
			includeFooter: false
		});

		expect(html).toContain('Hi &lt;script&gt;alert(1)&lt;/script&gt;');
		expect(html).not.toContain('Hi <script>alert(1)</script>');
	});

	it('adds an unsubscribe URL to the plain-text footer', () => {
		const text = appendEmailFooterToPlainText('Body', 'https://9takes.com/unsubscribe/test');

		expect(text).toContain('Body');
		expect(text).toContain('9takes - See the emotions behind every take');
		expect(text).toContain('Unsubscribe: https://9takes.com/unsubscribe/test');
	});

	it('converts simple email html to readable plain text', () => {
		expect(htmlToPlainText('<p>Hello</p><ul><li>One</li></ul>')).toBe('Hello\n\n- One');
	});
});
