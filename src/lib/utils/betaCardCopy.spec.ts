// src/lib/utils/betaCardCopy.spec.ts
import { beforeEach, describe, expect, it } from 'vitest';
import {
	assignBetaCardVariant,
	BETA_CARD_VARIANTS,
	BETA_VARIANT_STORAGE_KEY,
	DETAILS_COPY,
	isBetaCardVariantId,
	renderBetaHeadline
} from './betaCardCopy';

function installStorage() {
	const store = new Map<string, string>();
	(globalThis as { localStorage?: unknown }).localStorage = {
		getItem: (key: string) => store.get(key) ?? null,
		setItem: (key: string, value: string) => void store.set(key, value),
		removeItem: (key: string) => void store.delete(key)
	};
	return store;
}

describe('beta card copy', () => {
	it('keeps every variant short: headline ≤ 9 words, sub ≤ 15, button ≤ 4', () => {
		for (const copy of [...BETA_CARD_VARIANTS, DETAILS_COPY]) {
			const words = (text: string) => text.trim().split(/\s+/).length;
			expect(words(renderBetaHeadline(copy, 'Taylor Swift')), copy.id).toBeLessThanOrEqual(9);
			expect(words(renderBetaHeadline(copy, null)), copy.id).toBeLessThanOrEqual(9);
			expect(words(copy.sub), copy.id).toBeLessThanOrEqual(15);
			expect(words(copy.button), copy.id).toBeLessThanOrEqual(4);
		}
	});

	it('never names the founder or speaks as "I"', () => {
		for (const copy of [...BETA_CARD_VARIANTS, DETAILS_COPY]) {
			const text = [
				copy.kicker,
				copy.headline,
				copy.headlineFallback ?? '',
				copy.sub,
				copy.button
			].join(' ');
			expect(text, copy.id).not.toMatch(/\bDJ\b|\bI\b|\bI’|\bI'/);
		}
	});

	it('fills in the person, or falls back on pages without one', () => {
		const withName = BETA_CARD_VARIANTS.find((copy) => copy.headline.includes('{name}'));
		if (!withName) return;
		expect(renderBetaHeadline(withName, 'Taylor Swift')).toContain('Taylor Swift');
		expect(renderBetaHeadline(withName, null)).not.toContain('{name}');
		expect(renderBetaHeadline(withName, '  ')).not.toContain('{name}');
	});

	it('knows its own variant ids, including the details copy', () => {
		for (const copy of BETA_CARD_VARIANTS) expect(isBetaCardVariantId(copy.id)).toBe(true);
		expect(isBetaCardVariantId(DETAILS_COPY.id)).toBe(true);
		expect(isBetaCardVariantId('nope')).toBe(false);
	});
});

describe('assignBetaCardVariant', () => {
	let store: Map<string, string>;

	beforeEach(() => {
		store = installStorage();
	});

	it('picks a variant and keeps it for this browser', () => {
		const first = assignBetaCardVariant(() => 0.99);
		expect(store.get(BETA_VARIANT_STORAGE_KEY)).toBe(first.id);
		expect(assignBetaCardVariant(() => 0).id).toBe(first.id);
	});

	it('spreads visitors across every variant', () => {
		const ids = new Set(
			BETA_CARD_VARIANTS.map((_, index) => {
				store.clear();
				return assignBetaCardVariant(() => (index + 0.5) / BETA_CARD_VARIANTS.length).id;
			})
		);
		expect(ids.size).toBe(BETA_CARD_VARIANTS.length);
	});

	it('replaces a stale assignment from an old variant list', () => {
		store.set(BETA_VARIANT_STORAGE_KEY, 'retired_variant');
		expect(BETA_CARD_VARIANTS.map((copy) => copy.id)).toContain(assignBetaCardVariant(() => 0).id);
	});

	it('still works when storage is blocked', () => {
		(globalThis as { localStorage?: unknown }).localStorage = {
			getItem: () => {
				throw new Error('blocked');
			},
			setItem: () => {
				throw new Error('blocked');
			}
		};
		expect(BETA_CARD_VARIANTS).toContainEqual(assignBetaCardVariant(() => 0.4));
	});
});
