// src/lib/server/adminAuth.spec.ts
import { describe, expect, it, vi } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

import { guardAdminActions, requireAdmin } from './adminAuth';

type ProfileResult = {
	data: { id: string; admin: boolean; email: string | null } | null;
	error: { message: string } | null;
};

function createLocals(sessionUserId: string | null, profileResult?: ProfileResult): App.Locals {
	const single = vi.fn().mockResolvedValue(
		profileResult ?? {
			data: { id: sessionUserId ?? 'admin-1', admin: true, email: 'admin@example.com' },
			error: null
		}
	);
	const eq = vi.fn(() => ({ single }));
	const select = vi.fn(() => ({ eq }));
	const from = vi.fn(() => ({ select }));

	return {
		session: sessionUserId ? { user: { id: sessionUserId } } : null,
		supabase: { from }
	} as unknown as App.Locals;
}

describe('requireAdmin', () => {
	it('rejects unauthenticated requests', async () => {
		await expect(requireAdmin(createLocals(null))).rejects.toMatchObject({ status: 401 });
	});

	it('rejects authenticated non-admin users', async () => {
		const locals = createLocals('user-1', {
			data: { id: 'user-1', admin: false, email: 'user@example.com' },
			error: null
		});

		await expect(requireAdmin(locals)).rejects.toMatchObject({ status: 403 });
	});
});

describe('guardAdminActions', () => {
	it('does not invoke an action when authorization fails', async () => {
		const handler = vi.fn((_event: unknown) => ({ success: true }));
		const actions = guardAdminActions({ mutate: handler });

		await expect(actions.mutate({ locals: createLocals(null) })).rejects.toMatchObject({
			status: 401
		});
		expect(handler).not.toHaveBeenCalled();
	});

	it('preserves the action result for an authorized admin', async () => {
		const handler = vi.fn((_event: unknown) => ({ success: true, id: 'result-1' }));
		const actions = guardAdminActions({ mutate: handler });
		const event = { locals: createLocals('admin-1') };

		await expect(actions.mutate(event)).resolves.toEqual({
			success: true,
			id: 'result-1'
		});
		expect(handler).toHaveBeenCalledOnce();
		expect(handler).toHaveBeenCalledWith(event);
	});

	it.each([
		'src/routes/admin/asset-generators/zine-creator/+page.server.ts',
		'src/routes/admin/consulting/+page.server.ts',
		'src/routes/admin/consulting/clients/+page.server.ts',
		'src/routes/admin/consulting/clients/[id]/+page.server.ts',
		'src/routes/admin/consulting/sessions/[id]/+page.server.ts',
		'src/routes/admin/content-board/+page.server.ts',
		'src/routes/admin/marketing/+page.server.ts'
	])('protects every previously layout-dependent action module: %s', (relativePath) => {
		const source = readFileSync(resolve(process.cwd(), relativePath), 'utf8');

		expect(source).toContain('guardAdminActions({');
	});
});

describe('admin API guard adoption', () => {
	const adminApiRoot = resolve(process.cwd(), 'src/routes/api/admin');
	const adminApiFiles = readdirSync(adminApiRoot, {
		recursive: true,
		encoding: 'utf8'
	})
		.filter((relativePath) => relativePath.endsWith('/+server.ts') || relativePath === '+server.ts')
		.map((relativePath) => `src/routes/api/admin/${relativePath}`);

	it.each(adminApiFiles)('uses the canonical authorization boundary: %s', (relativePath) => {
		const source = readFileSync(resolve(process.cwd(), relativePath), 'utf8');

		expect(source).toContain("from '$lib/server/adminAuth'");
		expect(source).toContain('requireAdmin(locals)');
		expect(source).not.toContain(".select('admin')");
	});
});
