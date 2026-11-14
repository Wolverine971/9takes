// src/lib/utils/keepThisPage.spec.ts
import { describe, expect, it } from 'vitest';
import { KEEP_PAGE_MIN_HEADINGS, pickKeepPageAnchorIndex } from './keepThisPage';

describe('pickKeepPageAnchorIndex', () => {
	it('skips short articles', () => {
		expect(pickKeepPageAnchorIndex(0, 0.3)).toBe(-1);
		expect(pickKeepPageAnchorIndex(KEEP_PAGE_MIN_HEADINGS - 1, 0.3)).toBe(-1);
		expect(pickKeepPageAnchorIndex(2.5, 0.3)).toBe(-1);
	});

	it('lands about a third of the way in, never in front of the first or last section', () => {
		expect(pickKeepPageAnchorIndex(5, 0.3)).toBe(1);
		expect(pickKeepPageAnchorIndex(10, 0.3)).toBe(3);
		expect(pickKeepPageAnchorIndex(20, 0.3)).toBe(6);
		expect(pickKeepPageAnchorIndex(8, 0)).toBe(1);
		expect(pickKeepPageAnchorIndex(8, 1)).toBe(6);
	});

	it('steps off a heading another card already claimed', () => {
		expect(pickKeepPageAnchorIndex(10, 0.3, 3)).toBe(2);
		expect(pickKeepPageAnchorIndex(5, 0.3, 1)).toBe(2);
		expect(pickKeepPageAnchorIndex(10, 0.3, 5)).toBe(3);
	});
});
