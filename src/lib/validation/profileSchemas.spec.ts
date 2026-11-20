// src/lib/validation/profileSchemas.spec.ts
import { describe, expect, it } from 'vitest';

import { PROFILE_NAME_MAX_LENGTH, profileEditSchema, toProfileUpdate } from './profileSchemas';

describe('profileEditSchema', () => {
	it('trims names and keeps a valid type', () => {
		const parsed = profileEditSchema.parse({
			firstName: '  Alex ',
			lastName: ' Rivera  ',
			enneagram: '5'
		});

		expect(toProfileUpdate(parsed)).toEqual({
			first_name: 'Alex',
			last_name: 'Rivera',
			enneagram: '5'
		});
	});

	it('accepts an empty type and missing names', () => {
		expect(profileEditSchema.parse({})).toEqual({ firstName: '', lastName: '', enneagram: '' });
	});

	it('drops fields a user may not edit', () => {
		const parsed = profileEditSchema.parse({
			firstName: 'Alex',
			email: 'someone@example.com',
			admin: 'true'
		});

		expect(Object.keys(parsed).sort()).toEqual(['enneagram', 'firstName', 'lastName']);
	});

	it.each(['0', '10', 'not-a-type', '5.5', '-1'])('rejects an invalid type: %s', (enneagram) => {
		expect(profileEditSchema.safeParse({ enneagram }).success).toBe(false);
	});

	it('rejects names longer than the cap', () => {
		const tooLong = 'a'.repeat(PROFILE_NAME_MAX_LENGTH + 1);

		expect(profileEditSchema.safeParse({ firstName: tooLong }).success).toBe(false);
		expect(profileEditSchema.safeParse({ lastName: tooLong }).success).toBe(false);
		expect(
			profileEditSchema.safeParse({ firstName: 'a'.repeat(PROFILE_NAME_MAX_LENGTH) }).success
		).toBe(true);
	});

	it('rejects non-text values', () => {
		expect(profileEditSchema.safeParse({ firstName: 42 }).success).toBe(false);
	});
});
