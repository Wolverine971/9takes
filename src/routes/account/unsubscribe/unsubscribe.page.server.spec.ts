// src/routes/account/unsubscribe/unsubscribe.page.server.spec.ts
//
// /account/unsubscribe is an admin tool for issuing legacy unsubscribe links.
import { describe, expect, it, vi } from 'vitest';

vi.mock('../../../utils/crypto', () => ({
	encrypt: (value: string) => ({ encryptedData: `enc:${value}`, iv: 'iv' })
}));

import { actions, load } from './+page.server';

function buildLocals(options: { admin: boolean; signedIn?: boolean }) {
	const tables: string[] = [];
	const updates: unknown[] = [];
	const from = vi.fn((table: string) => {
		tables.push(table);
		return {
			select: () => ({
				eq: () => ({
					single: async () => ({
						data: { id: 'user-1', admin: options.admin, email: 'user@example.com' },
						error: null
					})
				}),
				then: (resolve: (value: unknown) => void) =>
					resolve({ data: [{ id: 1, email: 'reader@example.com' }], error: null })
			}),
			update: (values: unknown) => {
				updates.push(values);
				return { eq: () => ({ single: async () => ({ error: null }) }) };
			}
		};
	});

	return {
		tables,
		updates,
		locals: {
			session: options.signedIn === false ? null : { user: { id: 'user-1' } },
			supabase: { from }
		}
	};
}

function cypherRequest(email: string) {
	const body = new FormData();
	body.set('email', email);
	return new Request('http://localhost/account/unsubscribe?/createCypher', {
		method: 'POST',
		body
	});
}

describe('/account/unsubscribe', () => {
	it('exposes only the link-issuing action', () => {
		expect(Object.keys(actions)).toEqual(['createCypher']);
	});

	it('redirects a non-admin before the signup list is read', async () => {
		const { locals, tables } = buildLocals({ admin: false });

		await expect(load({ locals } as any)).rejects.toMatchObject({
			status: 307,
			location: '/questions'
		});
		expect(tables).toEqual(['profiles']);
	});

	it('lists signups for an admin', async () => {
		const { locals, tables } = buildLocals({ admin: true });

		await expect(load({ locals } as any)).resolves.toEqual({
			signups: [{ id: 1, email: 'reader@example.com' }]
		});
		expect(tables).toEqual(['profiles', 'signups']);
	});

	it('rejects a non-admin before any write', async () => {
		const { locals, updates } = buildLocals({ admin: false });

		await expect(
			actions.createCypher({ locals, request: cypherRequest('reader@example.com') } as any)
		).rejects.toMatchObject({ status: 403 });
		expect(updates).toEqual([]);
	});

	it('rejects a signed-out request', async () => {
		const { locals, updates } = buildLocals({ admin: true, signedIn: false });

		await expect(
			actions.createCypher({ locals, request: cypherRequest('reader@example.com') } as any)
		).rejects.toMatchObject({ status: 401 });
		expect(updates).toEqual([]);
	});

	it('issues a link for an admin', async () => {
		const { locals, updates } = buildLocals({ admin: true });

		await expect(
			actions.createCypher({ locals, request: cypherRequest('reader@example.com') } as any)
		).resolves.toMatchObject({ success: true });
		expect(updates).toEqual([{ unsubscribe_id: 'enc:reader@example.com', unsubscribe_iv: 'iv' }]);
	});
});
