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
		'src/routes/admin/marketing/+page.server.ts',
		'src/routes/admin/comments/+page.server.ts',
		'src/routes/admin/transactional-emails/+page.server.ts',
		'src/routes/users/+page.server.ts',
		'src/routes/account/unsubscribe/+page.server.ts'
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

describe('admin page load guard adoption', () => {
	const adminRoot = resolve(process.cwd(), 'src/routes/admin');
	const adminLoadFiles = readdirSync(adminRoot, { recursive: true, encoding: 'utf8' })
		.filter((relativePath) => /(^|\/)\+(page|layout)\.server\.ts$/.test(relativePath))
		.map((relativePath) => `src/routes/admin/${relativePath}`)
		.filter((relativePath) =>
			/export\s+(const|async function|function)\s+load\b/.test(
				readFileSync(resolve(process.cwd(), relativePath), 'utf8')
			)
		);

	/** The load and everything after it, up to the action map. */
	const loadSection = (source: string) => {
		const start = source.search(/export\s+(const|async function|function)\s+load\b/);
		const end = source.indexOf('export const actions', start);
		return source.slice(start, end === -1 ? undefined : end);
	};
	const readsLiveAdminFlag = (source: string) =>
		source.includes(".from('profiles')") && /\?\.admin\b/.test(source);
	// A load passes when it calls requireAdmin, awaits the guarded layout via parent(),
	// or checks the live `profiles.admin` flag (inline or through a local assertAdmin).
	const checksAdmin = (source: string) => {
		const load = loadSection(source);
		return (
			load.includes('requireAdmin(') ||
			/\bparent\(\)/.test(load) ||
			readsLiveAdminFlag(load) ||
			(load.includes('assertAdmin(') && readsLiveAdminFlag(source))
		);
	};
	// A load that only redirects to another admin page has nothing to guard.
	const onlyRedirects = (source: string) =>
		/export const load[^=]*=\s*async\s*\(\)\s*=>\s*\{\s*throw redirect\(/.test(source);

	it('finds the admin pages', () => {
		expect(adminLoadFiles.length).toBeGreaterThan(20);
		expect(adminLoadFiles).toContain('src/routes/admin/consulting/clients/[id]/+page.server.ts');
	});

	it.each(adminLoadFiles)('checks admin inside the load itself: %s', (relativePath) => {
		const source = readFileSync(resolve(process.cwd(), relativePath), 'utf8');

		expect(onlyRedirects(source) || checksAdmin(source)).toBe(true);
	});

	it('does not count a guard that only the actions use', () => {
		const source = [
			"import { guardAdminActions, requireAdmin } from '$lib/server/adminAuth';",
			'export const load = async ({ locals }) => ({ rows: await locals.supabase.from("t") });',
			'export const actions = guardAdminActions({ save: async ({ locals }) => requireAdmin(locals) });'
		].join('\n');

		expect(checksAdmin(source)).toBe(false);
	});
});

describe('admin rights source', () => {
	// Files whose admin check used to follow the demo-mode table switch.
	it.each([
		'src/routes/admin/comments/+page.server.ts',
		'src/routes/admin/consulting/+layout.server.ts',
		'src/routes/admin/content-board/+page.server.ts',
		'src/routes/admin/questions/+page.server.ts',
		'src/routes/admin/transactional-emails/+page.server.ts',
		'src/routes/admin/users/+page.server.ts',
		'src/routes/api/update-questions/+server.ts',
		'src/routes/users/+page.server.ts',
		'src/routes/account/unsubscribe/+page.server.ts'
	])('reads admin from the live profile table only: %s', (relativePath) => {
		const source = readFileSync(resolve(process.cwd(), relativePath), 'utf8');

		expect(source).toContain("from '$lib/server/adminAuth'");
		expect(source).not.toMatch(/profiles_demo[^)]*\)\s*\.select\(\s*'id, admin/);
		expect(source).not.toMatch(/async function (validateAdmin|assertAdmin)\b/);
	});
});
