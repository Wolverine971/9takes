// src/lib/utils/betaCardCopy.spec.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
	assignBetaCardVariant,
	BETA_CARD_VARIANTS,
	BETA_VARIANT_STORAGE_KEY,
	DETAILS_COPY,
	isBetaCardVariantId,
	renderBetaHeadline,
	type BetaCardCopy
} from './betaCardCopy';

function installStorage() {
	const store = new Map<string, string>();
	vi.stubGlobal('localStorage', {
		getItem: (key: string) => store.get(key) ?? null,
		setItem: (key: string, value: string) => void store.set(key, value),
		removeItem: (key: string) => void store.delete(key)
	});
	return store;
}

describe('beta card copy', () => {
	const personalizedCopy: BetaCardCopy = {
		id: 'test-personalized',
		kicker: 'Test',
		headline: 'Read {name}. Understand {name}.',
		headlineFallback: 'Read a personality.',
		sub: 'Test description',
		button: 'Read'
	};

	it('replaces every name placeholder and trims the supplied name', () => {
		expect(renderBetaHeadline(personalizedCopy, '  Taylor Swift  ')).toBe(
			'Read Taylor Swift. Understand Taylor Swift.'
		);
	});

	it('uses the fallback when a person name is missing or blank', () => {
		for (const name of [null, undefined, '', '  ']) {
			expect(renderBetaHeadline(personalizedCopy, name)).toBe('Read a personality.');
		}
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

	afterEach(() => vi.unstubAllGlobals());

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
		vi.stubGlobal('localStorage', {
			getItem: () => {
				throw new Error('blocked');
			},
			setItem: () => {
				throw new Error('blocked');
			}
		});
		expect(BETA_CARD_VARIANTS).toContainEqual(assignBetaCardVariant(() => 0.4));
	});
});
