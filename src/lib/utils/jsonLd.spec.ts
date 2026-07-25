// src/lib/utils/jsonLd.spec.ts
import { describe, expect, it } from 'vitest';
import { escapeJsonLd, serializeJsonLd } from './jsonLd';

const SCRIPT_BREAKOUT = 'Is it ok to lie?</script><img src=x onerror=alert(1)>';

describe('serializeJsonLd', () => {
	it('neutralizes a </script> breakout in reader-submitted question text', () => {
		const payload = serializeJsonLd({
			'@type': 'DiscussionForumPosting',
			headline: SCRIPT_BREAKOUT,
			text: SCRIPT_BREAKOUT
		});

		// The emitted document must contain no closing tag and no raw markup.
		expect(payload).not.toContain('</script>');
		expect(payload).not.toContain('<img');
		expect(payload).not.toContain('<');
		expect(payload).not.toContain('>');
	});

	it('still parses back to the original values', () => {
		const original = {
			'@context': 'https://schema.org',
			headline: SCRIPT_BREAKOUT,
			nested: { description: 'a & b < c > d' }
		};

		expect(JSON.parse(serializeJsonLd(original))).toEqual(original);
	});

	it('escapes the JS line terminators that are legal inside JSON strings', () => {
		const withSeparators = `line${String.fromCharCode(0x2028)}break${String.fromCharCode(0x2029)}end`;
		const payload = serializeJsonLd({ text: withSeparators });

		expect(payload).not.toContain(String.fromCharCode(0x2028));
		expect(payload).not.toContain(String.fromCharCode(0x2029));
		expect(JSON.parse(payload).text).toBe(withSeparators);
	});

	it('accepts payloads that were already stringified upstream', () => {
		const preStringified = JSON.stringify({ headline: SCRIPT_BREAKOUT });

		const payload = serializeJsonLd(preStringified);

		expect(payload).not.toContain('</script>');
		expect(JSON.parse(payload).headline).toBe(SCRIPT_BREAKOUT);
	});

	it('returns an empty string for nullish input so callers can guard with {#if}', () => {
		expect(serializeJsonLd(null)).toBe('');
		expect(serializeJsonLd(undefined)).toBe('');
		expect(serializeJsonLd('')).toBe('');
	});

	it('leaves ordinary payloads byte-identical to JSON.stringify', () => {
		const plain = { '@type': 'WebPage', name: 'Nine takes', position: 3 };

		expect(serializeJsonLd(plain)).toBe(JSON.stringify(plain));
	});
});

describe('escapeJsonLd', () => {
	it('escapes the HTML-sensitive characters to JSON unicode escapes', () => {
		expect(escapeJsonLd('<>&')).toBe('\\u003c\\u003e\\u0026');
	});
});
