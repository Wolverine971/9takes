// src/lib/components/blog/enneagramSidebarCopy.spec.ts
import { describe, expect, it } from 'vitest';

import { getEnneagramSidebarContext, getEnneagramSidebarCopy } from './enneagramSidebarCopy';

describe('getEnneagramSidebarContext', () => {
	it('maps personality analysis paths', () => {
		expect(getEnneagramSidebarContext('/personality-analysis/bradley-martyn')).toBe(
			'personality-analysis'
		);
	});

	it('maps enneagram corner sections', () => {
		expect(getEnneagramSidebarContext('/enneagram-corner/enneagram-tldr')).toBe('enneagram-corner');
		expect(getEnneagramSidebarContext('/enneagram-corner/mental-health/enneagram-anxiety')).toBe(
			'enneagram-mental-health'
		);
	});

	it('maps other blog sections', () => {
		expect(getEnneagramSidebarContext('/pop-culture/brad-pitt')).toBe('pop-culture');
		expect(getEnneagramSidebarContext('/community/some-post')).toBe('community');
		expect(getEnneagramSidebarContext('/how-to-guides/some-guide')).toBe('how-to-guides');
	});

	it('falls back to generic for unrelated pages', () => {
		expect(getEnneagramSidebarContext('/questions')).toBe('generic');
	});
});

describe('getEnneagramSidebarCopy', () => {
	it('returns section-specific copy', () => {
		expect(getEnneagramSidebarCopy('/pop-culture/brad-pitt')).toEqual({
			title: 'Get new pop culture personality reads by email',
			copy: 'Fresh celebrity analyses, internet-culture breakdowns, and enneagram takes on public figures.',
			buttonLabel: 'Get pop culture emails'
		});
	});
});
