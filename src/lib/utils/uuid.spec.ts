// src/lib/utils/uuid.spec.ts
import { describe, expect, it } from 'vitest';

import { isUuid } from './uuid';

describe('isUuid', () => {
	it('accepts standard UUID strings', () => {
		expect(isUuid('43f280b0-1234-4abc-9def-123456789abc')).toBe(true);
		expect(isUuid('BE6E25C0-1234-4ABC-9DEF-123456789ABC')).toBe(true);
	});

	it('rejects malformed email tracking ids before they reach Supabase UUID comparisons', () => {
		expect(isUuid('YmU2ZTI1Yz')).toBe(false);
		expect(isUuid('NDNmMjgwYj')).toBe(false);
		expect(isUuid('ODQwMzM5Zm')).toBe(false);
		expect(isUuid(null)).toBe(false);
		expect(isUuid(undefined)).toBe(false);
	});
});
