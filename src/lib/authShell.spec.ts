// src/lib/authShell.spec.ts
import { describe, expect, it } from 'vitest';
import { normalizeAuthShellUser } from './authShell';

describe('authShell', () => {
	it('keeps only the public shell identity fields', () => {
		expect(
			normalizeAuthShellUser({
				id: 'user-1',
				email: 'private@example.com',
				admin: true
			})
		).toEqual({ id: 'user-1', admin: true });
	});

	it('normalizes anonymous and malformed payloads to null', () => {
		expect(normalizeAuthShellUser(null)).toBeNull();
		expect(normalizeAuthShellUser({ admin: true })).toBeNull();
		expect(normalizeAuthShellUser({ id: 42 })).toBeNull();
	});
});
