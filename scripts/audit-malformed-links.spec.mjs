// scripts/audit-malformed-links.spec.mjs
import { describe, expect, it } from 'vitest';
import { findMalformedHrefs } from './audit-malformed-links.mjs';

const reasons = (html) => findMalformedHrefs(html).map((hit) => hit.reason);

describe('findMalformedHrefs', () => {
	it('flags external URLs that lost their domain', () => {
		// The shape that filled the GSC 404 bucket: a YouTube link rendered as a
		// site-relative path, which can only ever 404 on 9takes.com.
		expect(reasons('<a href="/watch?v=37tz3tpelxc">clip</a>')).toEqual(['domain-stripped']);
		expect(reasons('<a href="/wiki/the_diary_of_a_ceo">wiki</a>')).toEqual(['domain-stripped']);
	});

	it('flags markdown-link artifacts that trail a closing paren', () => {
		expect(reasons('<a href="/episodes/sam-altman/)">ep</a>')).toEqual(['trailing-paren']);
	});

	it('flags foreign file extensions', () => {
		expect(reasons('<a href="/2016/some-article.html">piece</a>')).toEqual(['foreign-extension']);
	});

	it('flags uppercase person slugs that only redirect', () => {
		expect(reasons('<a href="/personality-analysis/Harry-Styles">x</a>')).toEqual([
			'uppercase-slug'
		]);
	});

	it('leaves well-formed internal and external links alone', () => {
		const html = `
			<a href="/personality-analysis/harry-styles">person</a>
			<a href="https://9takes.com/enneagram-corner/enneagram-social-styles">post</a>
			<a href="https://www.youtube.com/watch?v=37tz3tpelxc">external clip</a>
			<a href="https://en.wikipedia.org/wiki/Flow_(real_estate_company)">external wiki</a>
			<a href="/questions/categories/law-ethics-and-justice">category</a>
		`;
		expect(findMalformedHrefs(html)).toEqual([]);
	});
});
