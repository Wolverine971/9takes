// src/lib/utils/betaInvite.spec.ts
import { describe, expect, it } from 'vitest';
import { pickInlineAnchorIndex } from './betaInvite';

describe('pickInlineAnchorIndex', () => {
	it('puts the card at the end of articles too short to split', () => {
		expect(pickInlineAnchorIndex(0, 0.6)).toBe(-1);
		expect(pickInlineAnchorIndex(2, 0.6)).toBe(-1);
	});

	it('picks the heading closest to the requested point', () => {
		expect(pickInlineAnchorIndex(6, 0.6)).toBe(3);
		expect(pickInlineAnchorIndex(11, 0.7)).toBe(7);
	});

	it('never lands on the first heading and stays in range', () => {
		expect(pickInlineAnchorIndex(5, 0)).toBe(1);
		expect(pickInlineAnchorIndex(5, 1)).toBe(4);
		expect(pickInlineAnchorIndex(5, 4)).toBe(4);
		expect(pickInlineAnchorIndex(5, -1)).toBe(1);
	});
});
