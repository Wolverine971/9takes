// src/lib/server/rssFeed.spec.ts
import { load } from 'cheerio';
import { describe, expect, it } from 'vitest';

import { buildRssXml, escapeXml } from './rssFeed';

describe('rss feed', () => {
	it('escapes the five XML special characters', () => {
		expect(escapeXml(`Tom & "Jerry" <b>'s</b>`)).toBe(
			'Tom &amp; &quot;Jerry&quot; &lt;b&gt;&apos;s&lt;/b&gt;'
		);
	});

	it('renders missing values as empty text and drops characters XML cannot carry', () => {
		expect(escapeXml(undefined)).toBe('');
		expect(escapeXml(null)).toBe('');
		expect(escapeXml('a\u0000b\u0008c\nd')).toBe('abc\nd');
	});

	it('keeps every interpolated value as text inside its own element', () => {
		const xml = buildRssXml([
			{
				title: 'Fight & Flight </title><item><title>extra',
				description: 'Why <em>this</em> matters ]]> "now"',
				loc: 'https://9takes.com/community/a?b=1&c=2',
				rssDate: 'Mon, 01 Jan 2026 00:00:00 GMT',
				rssUpdateDate: 'Tue, 02 Jan 2026 00:00:00 <GMT>'
			}
		]);

		const $ = load(xml, { xml: true });
		const items = $('channel > item');

		expect(items).toHaveLength(1);
		expect(items.find('title').text()).toBe('Fight & Flight </title><item><title>extra');
		expect(items.find('description').text()).toBe('Why <em>this</em> matters ]]> "now"');
		expect(items.find('link').text()).toBe('https://9takes.com/community/a?b=1&c=2');
		expect(items.find('lastBuildDate').text()).toBe('Tue, 02 Jan 2026 00:00:00 <GMT>');
		expect(items.children()).toHaveLength(5);
		expect(xml).not.toContain('<em>');
	});

	it('keeps the channel header when there are no posts', () => {
		const xml = buildRssXml([]);

		expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
		expect(xml).toContain('<title>9takes RSS Feed</title>');
		expect(xml).not.toContain('<item>');
	});
});
