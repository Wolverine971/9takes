// src/lib/utils/searchHighlight.spec.ts
import { describe, expect, it } from 'vitest';
import { renderSearchHighlight } from './searchHighlight';

const NUL = String.fromCharCode(0);

describe('renderSearchHighlight', () => {
	it('escapes markup embedded in a reader-submitted question', () => {
		const hostile = 'Should I quit?<img src=x onerror=alert(1)>';

		const rendered = renderSearchHighlight(hostile);

		expect(rendered).not.toContain('<img');
		expect(rendered).toContain('&lt;img');
	});

	it('preserves the <mark> tags the search backend injected', () => {
		const highlighted = 'Should I <mark>quit</mark> my job?';

		expect(renderSearchHighlight(highlighted)).toBe('Should I <mark>quit</mark> my job?');
	});

	it('escapes hostile markup while keeping surrounding highlights intact', () => {
		const mixed = '<mark>quit</mark><script>alert(1)</script>';

		const rendered = renderSearchHighlight(mixed);

		expect(rendered).toContain('<mark>quit</mark>');
		expect(rendered).not.toContain('<script>');
		expect(rendered).toContain('&lt;script&gt;');
	});

	it('does not let a forged NUL sentinel smuggle a mark tag through', () => {
		const forged = `${NUL}MARK_OPEN${NUL}evil${NUL}MARK_CLOSE${NUL}`;

		const rendered = renderSearchHighlight(forged);

		expect(rendered).not.toContain('<mark>');
		expect(rendered).toBe('MARK_OPENevilMARK_CLOSE');
	});

	it('escapes quotes so the value is safe in attribute-adjacent markup', () => {
		expect(renderSearchHighlight(`"quoted" and 'single'`)).toBe(
			'&quot;quoted&quot; and &#39;single&#39;'
		);
	});

	it('returns an empty string for nullish input', () => {
		expect(renderSearchHighlight(null)).toBe('');
		expect(renderSearchHighlight(undefined)).toBe('');
		expect(renderSearchHighlight('')).toBe('');
	});
});
