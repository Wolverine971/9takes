// src/routes/users/users.page.server.spec.ts
//
// /users is a legacy admin list. Admin rights come from `profiles` even when
// demo mode swaps the data tables. All fixtures are synthetic.
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { checkDemoTimeMock } = vi.hoisted(() => ({ checkDemoTimeMock: vi.fn() }));

vi.mock('../../utils/api', () => ({ checkDemoTime: checkDemoTimeMock }));
vi.mock('$lib/utils/logger', () => ({
	logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() }
}));

import { actions, load } from './+page.server';

/** Session client where `profiles` answers the admin check and every table records its calls. */
function buildLocals(options: { admin: boolean; signedIn?: boolean; updateError?: unknown }) {
	const tables: string[] = [];
	const updates: { table: string; values: unknown; filter: unknown[] }[] = [];
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
				order: async () => ({ data: [], error: null }),
				then: (resolve: (value: unknown) => void) => resolve({ data: [], error: null })
			}),
			update: (values: unknown) => ({
				eq: async (...filter: unknown[]) => {
					updates.push({ table, values, filter });
					return { error: options.updateError ?? null };
				}
			})
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

function adminToggle(fields: Record<string, string>) {
	const body = new FormData();
	for (const [key, value] of Object.entries(fields)) body.set(key, value);
	return new Request('http://localhost/users?/updateAdmin', { method: 'POST', body });
}

describe('/users load', () => {
	it('redirects a non-admin without reading any list, in demo mode too', async () => {
		const { locals, tables } = buildLocals({ admin: false });

		await expect(
			load({ locals, parent: async () => ({ demo_time: true }) } as any)
		).rejects.toMatchObject({ status: 307, location: '/questions' });
		expect(tables).toEqual(['profiles']);
	});

	it('checks admin on the live table, then lists the demo tables in demo mode', async () => {
		const { locals, tables } = buildLocals({ admin: true });

		const result = (await load({
			locals,
			parent: async () => ({ demo_time: true })
		} as any)) as any;

		expect(result.user).toEqual({ id: 'user-1', admin: true });
		expect(tables).toEqual(['profiles', 'profiles_demo', 'signups']);
	});
});

describe('/users actions', () => {
	beforeEach(() => {
		checkDemoTimeMock.mockResolvedValue(false);
	});

	it('exposes only the administrator toggle', () => {
		expect(Object.keys(actions)).toEqual(['updateAdmin']);
	});

	it('rejects a non-admin before any write', async () => {
		const { locals, updates } = buildLocals({ admin: false });

		await expect(
			actions.updateAdmin({
				locals,
				request: adminToggle({ email: 'a@example.com', isAdmin: 'true' })
			} as any)
		).rejects.toMatchObject({ status: 403 });
		expect(updates).toEqual([]);
	});

	it('rejects a signed-out request', async () => {
		const { locals, updates } = buildLocals({ admin: true, signedIn: false });

		await expect(
			actions.updateAdmin({
				locals,
				request: adminToggle({ email: 'a@example.com', isAdmin: 'true' })
			} as any)
		).rejects.toMatchObject({ status: 401 });
		expect(updates).toEqual([]);
	});

	it('does not let demo mode decide who is an admin', async () => {
		checkDemoTimeMock.mockResolvedValue(true);
		const { locals, tables } = buildLocals({ admin: false });

		await expect(
			actions.updateAdmin({
				locals,
				request: adminToggle({ email: 'a@example.com', isAdmin: 'true' })
			} as any)
		).rejects.toMatchObject({ status: 403 });
		expect(tables).toEqual(['profiles']);
	});

	it.each([
		{ email: '', isAdmin: 'true' },
		{ email: 'not-an-email', isAdmin: 'true' },
		{ email: 'a@example.com', isAdmin: 'yes' }
	])('rejects malformed input: %o', async (fields) => {
		const { locals, updates } = buildLocals({ admin: true });

		const result = await actions.updateAdmin({ locals, request: adminToggle(fields) } as any);

		expect(result).toMatchObject({ status: 400 });
		expect(updates).toEqual([]);
	});

	it('lets an admin change the flag and hides database errors', async () => {
		const ok = buildLocals({ admin: true });
		await expect(
			actions.updateAdmin({
				locals: ok.locals,
				request: adminToggle({ email: 'a@example.com', isAdmin: 'false' })
			} as any)
		).resolves.toEqual({ success: true });
		expect(ok.updates).toEqual([
			{ table: 'profiles', values: { admin: false }, filter: ['email', 'a@example.com'] }
		]);

		const failing = buildLocals({
			admin: true,
			updateError: { message: 'trigger "secret" fired' }
		});
		const failure = await Promise.resolve(
			actions.updateAdmin({
				locals: failing.locals,
				request: adminToggle({ email: 'a@example.com', isAdmin: 'true' })
			} as any)
		).catch((e: unknown) => e);
		expect(failure).toMatchObject({ status: 500 });
		expect(JSON.stringify(failure)).not.toContain('secret');
	});
});
