// src/lib/utils/seoBudget.spec.ts
import { describe, expect, it } from 'vitest';

import {
	DESCRIPTION_SNIPPET_BUDGET,
	TITLE_SNIPPET_BUDGET,
	capDescriptionForSnippet,
	capTitleForSnippet,
	truncateForSnippet
} from './seoBudget';

describe('truncateForSnippet', () => {
	it('returns short strings unchanged', () => {
		expect(truncateForSnippet('Hello world', 60)).toBe('Hello world');
	});

	it('returns empty string for null / undefined input', () => {
		expect(truncateForSnippet(null, 60)).toBe('');
		expect(truncateForSnippet(undefined, 60)).toBe('');
		expect(truncateForSnippet('', 60)).toBe('');
	});

	it('trims surrounding whitespace before length check', () => {
		expect(truncateForSnippet('  Hello world  ', 60)).toBe('Hello world');
	});

	it('breaks on the last whitespace within budget and appends ellipsis', () => {
		const long =
			'The Counterintuitive Guide to Active Listening: Why Your Personality Type Sabotages Conversations';
		const out = truncateForSnippet(long, 60);
		expect(out.length).toBeLessThanOrEqual(60);
		expect(out.endsWith('…')).toBe(true);
		// no trailing whitespace before the ellipsis
		expect(out).not.toMatch(/\s…$/);
	});

	it('strips trailing punctuation before the ellipsis', () => {
		const long = 'Some really long blog post title — with em dash, before the cut';
		const out = truncateForSnippet(long, 50);
		expect(out.length).toBeLessThanOrEqual(50);
		expect(out).not.toMatch(/[,—-]…$/);
	});

	it('falls back to hard cut when no good whitespace break exists', () => {
		const noSpaces = 'A'.repeat(80);
		const out = truncateForSnippet(noSpaces, 60);
		expect(out.length).toBe(60);
		expect(out.endsWith('…')).toBe(true);
	});

	it('exposes Google-aligned default budgets', () => {
		expect(TITLE_SNIPPET_BUDGET).toBe(60);
		expect(DESCRIPTION_SNIPPET_BUDGET).toBe(155);
	});

	it('caps titles via convenience helper', () => {
		const long = 'A'.repeat(120);
		const out = capTitleForSnippet(long);
		expect(out.length).toBe(TITLE_SNIPPET_BUDGET);
	});

	it('caps descriptions via convenience helper', () => {
		const long = 'word '.repeat(80).trim();
		const out = capDescriptionForSnippet(long);
		expect(out.length).toBeLessThanOrEqual(DESCRIPTION_SNIPPET_BUDGET);
	});
});
