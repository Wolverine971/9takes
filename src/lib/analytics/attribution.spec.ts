// src/lib/analytics/attribution.spec.ts
import { describe, expect, it } from 'vitest';

import {
	extractExternalReferrerHost,
	extractPageViewAttribution,
	sanitizeExternalReferrerHost
} from './attribution';

describe('extractPageViewAttribution', () => {
	it('extracts utm values and preserves the raw landing query', () => {
		const payload = extractPageViewAttribution(
			new URL(
				'https://9takes.com/personality-analysis/john-doe?utm_source=reddit&utm_medium=social&utm_campaign=launch'
			)
		);

		expect(payload).toEqual({
			landing_query: 'utm_source=reddit&utm_medium=social&utm_campaign=launch',
			utm_source: 'reddit',
			utm_medium: 'social',
			utm_campaign: 'launch',
			utm_term: null,
			utm_content: null,
			click_id_type: null,
			click_id_value: null
		});
	});

	it('selects the highest-priority click id when present', () => {
		const payload = extractPageViewAttribution(
			new URL('https://9takes.com/questions/test?fbclid=fb-123&gclid=google-456&utm_source=google')
		);

		expect(payload.click_id_type).toBe('gclid');
		expect(payload.click_id_value).toBe('google-456');
	});

	it('returns null values when the url has no attribution params', () => {
		const payload = extractPageViewAttribution(new URL('https://9takes.com/community/post'));

		expect(payload).toEqual({
			landing_query: null,
			utm_source: null,
			utm_medium: null,
			utm_campaign: null,
			utm_term: null,
			utm_content: null,
			click_id_type: null,
			click_id_value: null
		});
	});
});

describe('referrer attribution', () => {
	it('keeps a real external referrer', () => {
		expect(
			extractExternalReferrerHost('https://www.google.com/search?q=enneagram', '9takes.com')
		).toBe('www.google.com');
	});

	it.each(['9takes.com', 'www.9takes.com', 'https://9takes.com/questions'])(
		'drops a first-party referrer (%s)',
		(referrer) => {
			expect(sanitizeExternalReferrerHost(referrer, 'www.9takes.com')).toBeNull();
		}
	);

	it('drops malformed referrers', () => {
		expect(sanitizeExternalReferrerHost('not a valid host', '9takes.com')).toBeNull();
	});
});
