// scripts/lib/linkOnlyChange.spec.mjs
import { describe, expect, it } from 'vitest';
import { isInternalLinkOnlyChange, stripInternalLinks } from './linkOnlyChange.js';

const before =
	'Steve Carell said they are both "super shy." See [the study](https://example.com/x).';

describe('isInternalLinkOnlyChange', () => {
	it('accepts a markdown link wrapped around an existing name', () => {
		const after = before.replace(
			'Steve Carell',
			'[Steve Carell](/personality-analysis/steve-carell)'
		);
		expect(isInternalLinkOnlyChange(before, after)).toBe(true);
	});

	it('accepts an HTML link, with or without extra attributes', () => {
		const plain = before.replace(
			'Steve Carell',
			'<a href="/personality-analysis/steve-carell">Steve Carell</a>'
		);
		const withRel = before.replace(
			'Steve Carell',
			'<a href="/personality-analysis/steve-carell" rel="noopener">Steve Carell</a>'
		);
		expect(isInternalLinkOnlyChange(before, plain)).toBe(true);
		expect(isInternalLinkOnlyChange(before, withRel)).toBe(true);
	});

	it('accepts removing an internal link', () => {
		const linked = before.replace(
			'Steve Carell',
			'[Steve Carell](/personality-analysis/steve-carell)'
		);
		expect(isInternalLinkOnlyChange(linked, before)).toBe(true);
	});

	it('rejects any wording change, even alongside a link', () => {
		const after = before
			.replace('Steve Carell', '[Steve Carell](/personality-analysis/steve-carell)')
			.replace('super shy', 'very shy');
		expect(isInternalLinkOnlyChange(before, after)).toBe(false);
	});

	it('rejects adding or changing an external link or citation', () => {
		expect(isInternalLinkOnlyChange(before, before.replace('example.com/x', 'example.com/y'))).toBe(
			false
		);
		expect(
			isInternalLinkOnlyChange(
				before,
				before.replace('Steve Carell', '[Steve Carell](https://x.com)')
			)
		).toBe(false);
	});

	it('rejects identical content (nothing to exempt)', () => {
		expect(isInternalLinkOnlyChange(before, before)).toBe(false);
	});

	it('strips only root-relative links', () => {
		expect(stripInternalLinks('[a](/x) [b](https://y.com) <a href="/z">c</a>')).toBe(
			'a [b](https://y.com) c'
		);
	});
});
