// src/lib/server/emailClickRequest.spec.ts
import { describe, expect, it } from 'vitest';
import { isLikelyAutomatedEmailClick } from './emailClickRequest';

function requestWithHeaders(headers: HeadersInit) {
	return new Request('https://9takes.com/api/track/click/test/target', { headers });
}

describe('isLikelyAutomatedEmailClick', () => {
	it('allows a normal browser navigation', () => {
		expect(
			isLikelyAutomatedEmailClick(
				requestWithHeaders({
					'user-agent':
						'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/150.0.0.0 Safari/537.36',
					'sec-fetch-mode': 'navigate',
					'sec-fetch-dest': 'document'
				})
			)
		).toBe(false);
	});

	it.each([
		'Proofpoint URL Defense',
		'Mimecast Link Scanner',
		'Slackbot-LinkExpanding 1.0',
		'Googlebot/2.1',
		'curl/8.0.1',
		'Mozilla/5.0 HeadlessChrome/150.0.0.0'
	])('blocks an automated user agent: %s', (userAgent) => {
		expect(isLikelyAutomatedEmailClick(requestWithHeaders({ 'user-agent': userAgent }))).toBe(true);
	});

	it('blocks browser prefetch requests', () => {
		expect(
			isLikelyAutomatedEmailClick(
				requestWithHeaders({
					'user-agent': 'Mozilla/5.0 AppleWebKit/537.36 Chrome/150.0.0.0 Safari/537.36',
					purpose: 'prefetch'
				})
			)
		).toBe(true);
	});

	it('blocks requests without a user agent', () => {
		expect(isLikelyAutomatedEmailClick(requestWithHeaders({}))).toBe(true);
	});
});
