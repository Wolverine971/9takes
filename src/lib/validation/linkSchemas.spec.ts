// src/lib/validation/linkSchemas.spec.ts
import { describe, expect, it } from 'vitest';

import { linkClickSchema } from './linkSchemas';

describe('linkClickSchema', () => {
	it('accepts the integer id a link row carries, as form text', () => {
		expect(linkClickSchema.parse({ linkId: '37' })).toEqual({ linkId: 37 });
		expect(linkClickSchema.parse({ linkId: '2147483647' })).toEqual({ linkId: 2147483647 });
	});

	it('rejects anything that is not a positive 32-bit integer', () => {
		for (const linkId of [
			undefined,
			'',
			'0',
			'-1',
			'1.5',
			'1e3',
			' 37',
			'37abc',
			'2147483648',
			'99999999999',
			'123e4567-e89b-12d3-a456-426614174000'
		]) {
			expect(linkClickSchema.safeParse({ linkId }).success).toBe(false);
		}
	});
});
