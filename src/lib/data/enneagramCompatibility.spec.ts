// src/lib/data/enneagramCompatibility.spec.ts
import { describe, expect, it } from 'vitest';
import {
	CALCULATOR_ANCHOR_ID,
	COMPATIBILITY_PAIRINGS,
	DEFAULT_CALCULATOR_PAIR,
	ENNEAGRAM_TYPES,
	calculatorSearch,
	getCompatibilityPairing,
	pairingAnchor,
	pairingsListedUnder,
	parseTypeParam,
	resolveCalculatorPair,
	slugifyHeading,
	splitInlineLinks,
	typeGroupHeading
} from './enneagramCompatibility';

// Heading ids the live page shipped with before the pairings moved into this
// module. Chart cells and outside links point at these fragments; a title edit
// that changes one should fail here first.
const SHIPPED_PAIR_ANCHORS = [
	'1--1-the-perfectionist-mirror',
	'1--2-the-reformer-and-helper-dance',
	'1--3-the-achievement-partnership',
	'1--4-the-idealist-connection',
	'1--5-the-analytical-alliance',
	'1--6-the-security-system',
	'1--7-the-paradox-pairing',
	'1--8-the-power-struggle',
	'1--9-the-peaceful-reform',
	'2--2-the-giving-competition',
	'2--3-the-power-couple',
	'2--4-the-emotional-intensity',
	'2--5-the-unlikely-connection',
	'2--6-the-support-system',
	'2--7-the-joy-and-care',
	'2--8-the-intense-bond',
	'2--9-the-gentle-connection',
	'3--3-the-success-partnership',
	'3--4-the-success-and-depth',
	'3--5-the-strategic-alliance',
	'3--6-the-achievement-and-security',
	'3--7-the-dynamic-duo',
	'3--8-the-power-alliance',
	'3--9-the-achievement-and-peace',
	'4--4-the-emotional-depths',
	'4--5-the-depth-and-detachment',
	'4--6-the-intensity-and-anxiety',
	'4--7-the-depth-and-light',
	'4--8-the-intense-power',
	'4--9-the-depth-and-peace',
	'5--5-the-mind-meld',
	'5--6-the-research-partnership',
	'5--7-the-mind-and-adventure',
	'5--8-the-strategy-and-power',
	'5--9-the-quiet-understanding',
	'6--6-the-security-fortress',
	'6--7-the-security-and-adventure',
	'6--8-the-loyalty-and-power',
	'6--9-the-loyal-peace',
	'7--7-the-adventure-explosion',
	'7--8-the-intensity-and-joy',
	'7--9-the-joy-and-peace',
	'8--8-the-power-coupling',
	'8--9-the-power-and-peace',
	'9--9-the-double-peace'
];

describe('COMPATIBILITY_PAIRINGS', () => {
	it('holds each of the 45 unique pairs exactly once, lower type first', () => {
		expect(COMPATIBILITY_PAIRINGS).toHaveLength(45);
		const keys = COMPATIBILITY_PAIRINGS.map(({ types: [a, b] }) => {
			expect(a).toBeLessThanOrEqual(b);
			return `${a}-${b}`;
		});
		expect(new Set(keys).size).toBe(45);
	});

	it('keeps every shipped heading anchor', () => {
		expect(COMPATIBILITY_PAIRINGS.map(pairingAnchor)).toEqual(SHIPPED_PAIR_ANCHORS);
	});

	it('has written content for every pair, with no em dashes or straight quotes', () => {
		for (const pairing of COMPATIBILITY_PAIRINGS) {
			for (const field of [
				pairing.title,
				pairing.faultLine,
				pairing.draw,
				pairing.crack,
				pairing.works
			]) {
				expect(field.trim().length).toBeGreaterThan(0);
				expect(field).not.toMatch(/—/);
				expect(field).not.toMatch(/["']/);
			}
		}
	});
});

describe('getCompatibilityPairing', () => {
	it('is order-insensitive for all 81 ordered picks', () => {
		for (const a of ENNEAGRAM_TYPES) {
			for (const b of ENNEAGRAM_TYPES) {
				expect(getCompatibilityPairing(a, b)).toBe(getCompatibilityPairing(b, a));
			}
		}
	});

	it('returns the 4 + 8 read for 8 + 4', () => {
		const pairing = getCompatibilityPairing(8, 4);
		expect(pairing.types).toEqual([4, 8]);
		expect(pairing.title).toBe('The Intense Power');
		expect(pairingAnchor(pairing)).toBe('4--8-the-intense-power');
	});
});

describe('headings', () => {
	it('slugifies like rehype-slug, dropping curly apostrophes', () => {
		expect(slugifyHeading('4 + 8: The Intense Power')).toBe('4--8-the-intense-power');
		expect(slugifyHeading(typeGroupHeading(1))).toBe(
			'type-1-compatibility-the-perfectionists-relationships'
		);
	});

	it('lists each pair under its lower type number', () => {
		expect(pairingsListedUnder(1)).toHaveLength(9);
		expect(pairingsListedUnder(9)).toHaveLength(1);
		const total = ENNEAGRAM_TYPES.reduce((sum, type) => sum + pairingsListedUnder(type).length, 0);
		expect(total).toBe(45);
	});
});

describe('parseTypeParam', () => {
	it('accepts a single digit 1-9, trimmed', () => {
		expect(parseTypeParam('1')).toBe(1);
		expect(parseTypeParam('9')).toBe(9);
		expect(parseTypeParam(' 4 ')).toBe(4);
	});

	it.each([null, undefined, '', '0', '10', '-1', 'abc', '4.0', '0x4', '1e0', '4a'])(
		'rejects %j',
		(value) => {
			expect(parseTypeParam(value)).toBeNull();
		}
	);
});

describe('resolveCalculatorPair', () => {
	it('reads ?a=&b=', () => {
		expect(resolveCalculatorPair(new URLSearchParams('a=4&b=8'))).toEqual({ a: 4, b: 8 });
	});

	it('keeps the order the reader picked while resolving to the same pairing', () => {
		const forward = resolveCalculatorPair(new URLSearchParams('a=4&b=8'));
		const reversed = resolveCalculatorPair(new URLSearchParams('a=8&b=4'));
		expect(reversed).toEqual({ a: 8, b: 4 });
		expect(getCompatibilityPairing(reversed.a, reversed.b)).toBe(
			getCompatibilityPairing(forward.a, forward.b)
		);
	});

	it('falls back to the default pair when params are missing or invalid', () => {
		expect(resolveCalculatorPair(new URLSearchParams(''))).toEqual(DEFAULT_CALCULATOR_PAIR);
		expect(resolveCalculatorPair(new URLSearchParams('a=0&b=abc'))).toEqual(
			DEFAULT_CALCULATOR_PAIR
		);
	});

	it('falls back on each side independently', () => {
		expect(resolveCalculatorPair(new URLSearchParams('a=5'))).toEqual({
			a: 5,
			b: DEFAULT_CALCULATOR_PAIR.b
		});
		expect(resolveCalculatorPair(new URLSearchParams('a=99&b=3'))).toEqual({
			a: DEFAULT_CALCULATOR_PAIR.a,
			b: 3
		});
	});
});

describe('calculatorSearch', () => {
	it('builds a shareable query that lands on the calculator', () => {
		expect(calculatorSearch(4, 8)).toBe(`?a=4&b=8#${CALCULATOR_ANCHOR_ID}`);
	});
});

describe('splitInlineLinks', () => {
	it('returns plain text as one segment', () => {
		expect(splitInlineLinks('No links here.')).toEqual([{ text: 'No links here.' }]);
	});

	it('turns [text](/path) into a link segment and keeps surrounding spaces', () => {
		expect(splitInlineLinks('Scheduled [quality time](/love-languages) apart.')).toEqual([
			{ text: 'Scheduled ' },
			{ text: 'quality time', href: '/love-languages' },
			{ text: ' apart.' }
		]);
	});

	it('leaves off-site, protocol-relative, and script URLs as literal text', () => {
		for (const href of ['https://example.com', '//example.com', 'javascript:alert(1)']) {
			const text = `See [this](${href}) now.`;
			expect(splitInlineLinks(text)).toEqual([{ text }]);
		}
	});
});
