// src/routes/api/auth-shell/auth-shell.server.spec.ts
import { describe, expect, it, vi } from 'vitest';
import { GET } from './+server';

describe('GET /api/auth-shell', () => {
	it('returns an uncached anonymous shell without querying profiles', async () => {
		const from = vi.fn();
		const response = await GET({
			locals: { user: null, supabase: { from } }
		} as never);

		expect(await response.json()).toEqual({ user: null });
		expect(response.headers.get('cache-control')).toBe('private, no-store');
		expect(from).not.toHaveBeenCalled();
	});

	it('returns the validated user id and profile admin flag only', async () => {
		const maybeSingle = vi.fn().mockResolvedValue({ data: { admin: true } });
		const eq = vi.fn(() => ({ maybeSingle }));
		const select = vi.fn(() => ({ eq }));
		const from = vi.fn(() => ({ select }));
		const response = await GET({
			locals: {
				user: { id: 'user-1', email: 'private@example.com' },
				supabase: { from }
			}
		} as never);

		expect(await response.json()).toEqual({ user: { id: 'user-1', admin: true } });
		expect(from).toHaveBeenCalledWith('profiles');
		expect(select).toHaveBeenCalledWith('admin');
		expect(eq).toHaveBeenCalledWith('id', 'user-1');
	});
});
