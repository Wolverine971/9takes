// src/lib/email/base-template.spec.ts
import { describe, expect, it } from 'vitest';

import {
	addAttributionToEmailLinks,
	addAttributionToPlainTextLinks,
	appendEmailFooterToPlainText,
	generateEmailHtml,
	htmlToPlainText,
	rewriteLinksForTracking,
	rewritePlainTextLinksForTracking
} from './base-template';

const TRACKING_ID = '550e8400-e29b-41d4-a716-446655440000';
const BASE_URL = 'https://9takes.com';

function decodeTrackedTarget(trackedUrl: string): URL {
	const encodedUrl = new URL(trackedUrl).pathname.split('/').at(-1);
	if (!encodedUrl) throw new Error('Missing encoded tracking target');
	return new URL(decodeURIComponent(Buffer.from(encodedUrl, 'base64url').toString()));
}

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

	it('keeps the 600px email shell fluid on narrow screens', () => {
		const html = generateEmailHtml({
			subject: 'Responsive shell',
			content: '<p>Body</p>',
			includeFooter: false
		});

		expect(html).toContain(
			'width="600" align="center" style="width: 100%; max-width: 600px; margin: 0 auto;"'
		);
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

	it('preserves anchor destinations in generated plain text', () => {
		expect(
			htmlToPlainText('<p><a href="https://9takes.com/questions">Browse questions</a></p>')
		).toBe('Browse questions (https://9takes.com/questions)');
	});

	it('tracks quoted, unquoted, absolute, and relative first-party HTML links', () => {
		const html = rewriteLinksForTracking(
			'<a href="https://9takes.com/questions">One</a>' +
				"<a href='/personality-analysis/map'>Two</a>" +
				'<a href=https://www.9takes.com/account>Three</a>' +
				'<a href="https://example.com">External</a>' +
				'<a href="https://9takes.com:444/private">Nonstandard port</a>' +
				'<a href="https://user:password@9takes.com/private">Credentials</a>' +
				'<div href="https://9takes.com/not-a-link">Not a link</div>' +
				'<a data-href="https://9takes.com/not-the-target" href="https://example.com/real">Data</a>',
			TRACKING_ID,
			BASE_URL,
			{
				source: 'reactivation',
				medium: 'email',
				campaign: 'reactivation-sequence',
				content: 'reactivation_dormant_step_1'
			}
		);
		const trackedUrls = [...html.matchAll(/\bhref=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/g)]
			.map((match) => match[1] || match[2] || match[3])
			.filter((url) => url.includes('/api/track/click/'));

		expect(trackedUrls).toHaveLength(3);
		expect(html).toContain('href="https://example.com"');
		expect(html).toContain('href="https://9takes.com:444/private"');
		expect(html).toContain('href="https://user:password@9takes.com/private"');
		expect(html).toContain('<div href="https://9takes.com/not-a-link">');
		expect(html).toContain('data-href="https://9takes.com/not-the-target"');
		expect(decodeTrackedTarget(trackedUrls[0]).toString()).toBe(
			'https://9takes.com/questions?utm_source=reactivation&utm_medium=email&utm_campaign=reactivation-sequence&utm_content=reactivation_dormant_step_1_link_1'
		);
		expect(decodeTrackedTarget(trackedUrls[1]).pathname).toBe('/personality-analysis/map');
		expect(decodeTrackedTarget(trackedUrls[2]).hostname).toBe('www.9takes.com');
	});

	it('preserves explicit UTM values and fills only missing attribution', () => {
		const html = rewriteLinksForTracking(
			'<a href="https://9takes.com/personality-analysis/emma-watson?utm_campaign=people-wall&amp;utm_source=reactivation&amp;utm_content=person-emma-watson">People</a>',
			TRACKING_ID,
			BASE_URL,
			{
				source: 'automatic-source',
				medium: 'email',
				campaign: 'automatic-campaign',
				content: 'reactivation_cold_step_1'
			}
		);
		const trackedUrl = html.match(/https:\/\/9takes\.com\/api\/track\/click\/[^"']+/)?.[0];
		if (!trackedUrl) throw new Error('Expected a tracked URL');
		const target = decodeTrackedTarget(trackedUrl);

		expect(target.searchParams.get('utm_source')).toBe('reactivation');
		expect(target.searchParams.get('utm_medium')).toBe('email');
		expect(target.searchParams.get('utm_campaign')).toBe('people-wall');
		expect(target.searchParams.get('utm_content')).toBe('person-emma-watson');
	});

	it('fills blank UTM values and attributes test-email links without wrapping them', () => {
		const attribution = {
			source: 'reactivation',
			medium: 'email',
			campaign: 'reactivation-sequence',
			content: 'reactivation_dormant_step_3'
		};
		const html = addAttributionToEmailLinks(
			'<a href="http://9takes.com/questions/example?utm_source=&utm_campaign=custom">Open</a>',
			BASE_URL,
			attribution
		);
		const href = html.match(/href="([^"]+)"/)?.[1];
		if (!href) throw new Error('Expected an attributed href');
		const target = new URL(href);

		expect(target.protocol).toBe('https:');
		expect(target.searchParams.get('utm_source')).toBe('reactivation');
		expect(target.searchParams.get('utm_campaign')).toBe('custom');
		expect(target.searchParams.get('utm_content')).toBe('reactivation_dormant_step_3_link_1');
		expect(href).not.toContain('/api/track/click/');

		const plainText = addAttributionToPlainTextLinks(
			'Read https://9takes.com/questions/example.',
			BASE_URL,
			attribution
		);
		expect(plainText).toContain('utm_source=reactivation');
		expect(plainText.endsWith('.')).toBe(true);
	});

	it('tracks first-party plain-text links without swallowing sentence punctuation', () => {
		const text = rewritePlainTextLinksForTracking(
			'See https://9takes.com/questions. External: https://example.com/path.',
			TRACKING_ID,
			BASE_URL,
			{
				source: 'reactivation',
				medium: 'email',
				campaign: 'reactivation-sequence',
				content: 'reactivation_zombies_step_3'
			}
		);
		const trackedUrl = text.match(/https:\/\/9takes\.com\/api\/track\/click\/\S+/)?.[0];
		if (!trackedUrl) throw new Error('Expected a tracked URL');

		expect(trackedUrl.endsWith('.')).toBe(true);
		expect(decodeTrackedTarget(trackedUrl.slice(0, -1)).searchParams.get('utm_content')).toBe(
			'reactivation_zombies_step_3_link_1'
		);
		expect(text).toContain('https://example.com/path.');
	});

	it('does not wrap tracking controls a second time', () => {
		const unsubscribeUrl = `${BASE_URL}/api/track/unsubscribe/${TRACKING_ID}`;
		expect(
			rewriteLinksForTracking(`<a href="${unsubscribeUrl}">Unsubscribe</a>`, TRACKING_ID, BASE_URL)
		).toContain(`href="${unsubscribeUrl}"`);
	});
});
