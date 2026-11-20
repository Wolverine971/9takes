// src/lib/server/visitorFingerprint.spec.ts
import { describe, expect, it } from 'vitest';

import {
	VISITOR_FINGERPRINT_MAX_LENGTH,
	normalizeVisitorFingerprint,
	readVisitorFingerprint
} from './visitorFingerprint';

function cookies(value: string | undefined) {
	return { get: (name: string) => (name === '9tfingerprint' ? value : undefined) };
}

describe('normalizeVisitorFingerprint', () => {
	it('keeps the ids the browser generates', () => {
		expect(normalizeVisitorFingerprint('3f2b8c1e-9a4d-4c7b-8e21-5d6f7a8b9c0d')).toBe(
			'3f2b8c1e-9a4d-4c7b-8e21-5d6f7a8b9c0d'
		);
		expect(normalizeVisitorFingerprint('1763600000000-9f3a1c-77be02')).toBe(
			'1763600000000-9f3a1c-77be02'
		);
		expect(normalizeVisitorFingerprint('anon-3f2b8c1e-9a4d-4c7b-8e21-5d6f7a8b9c0d')).toBe(
			'anon-3f2b8c1e-9a4d-4c7b-8e21-5d6f7a8b9c0d'
		);
	});

	it('trims surrounding whitespace', () => {
		expect(normalizeVisitorFingerprint('  visitor-1  ')).toBe('visitor-1');
	});

	it('rejects missing, oversized, and non-id values', () => {
		expect(normalizeVisitorFingerprint(undefined)).toBeNull();
		expect(normalizeVisitorFingerprint(null)).toBeNull();
		expect(normalizeVisitorFingerprint(42)).toBeNull();
		expect(normalizeVisitorFingerprint('')).toBeNull();
		expect(normalizeVisitorFingerprint('   ')).toBeNull();
		expect(normalizeVisitorFingerprint('a'.repeat(VISITOR_FINGERPRINT_MAX_LENGTH))).toHaveLength(
			VISITOR_FINGERPRINT_MAX_LENGTH
		);
		expect(normalizeVisitorFingerprint('a'.repeat(VISITOR_FINGERPRINT_MAX_LENGTH + 1))).toBeNull();
		for (const value of ['a b', 'a;b', 'a%20b', 'a/b', 'a.b', 'a_b', '<b>', 'é', 'a\nb']) {
			expect(normalizeVisitorFingerprint(value)).toBeNull();
		}
	});
});

describe('readVisitorFingerprint', () => {
	it('reads and validates the visitor cookie', () => {
		expect(readVisitorFingerprint(cookies('visitor-1'))).toBe('visitor-1');
		expect(readVisitorFingerprint(cookies(' visitor-1 '))).toBe('visitor-1');
		expect(readVisitorFingerprint(cookies(undefined))).toBeNull();
		expect(readVisitorFingerprint(cookies('x'.repeat(101)))).toBeNull();
		expect(readVisitorFingerprint(cookies('not an id'))).toBeNull();
	});
});
