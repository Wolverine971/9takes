// src/lib/validation/schemas.spec.ts
import { describe, expect, it } from 'vitest';

import { adminUsersQuerySchema } from './schemas';

describe('adminUsersQuerySchema', () => {
	it('normalizes valid global user-directory query state', () => {
		expect(
			adminUsersQuerySchema.parse({
				search: '  ada  ',
				filter: 'admins',
				sort: 'email',
				direction: 'asc',
				profilePage: '3'
			})
		).toEqual({
			search: 'ada',
			filter: 'admins',
			sort: 'email',
			direction: 'asc',
			profilePage: 3
		});
	});

	it('falls back to safe defaults for malformed URL state', () => {
		expect(
			adminUsersQuerySchema.parse({
				search: 'x'.repeat(201),
				filter: 'owners',
				sort: 'password',
				direction: 'sideways',
				profilePage: '-8'
			})
		).toEqual({
			search: '',
			filter: 'all',
			sort: 'last_sign_in_at',
			direction: 'desc',
			profilePage: 1
		});
	});
});
