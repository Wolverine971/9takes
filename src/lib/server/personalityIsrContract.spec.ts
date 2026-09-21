// src/lib/server/personalityIsrContract.spec.ts
//
// /personality-analysis/[slug] is served from Vercel's ISR cache: one stored
// response per path, replayed to every visitor and crawler. These assertions
// guard the invariants that make that safe. If a load() here starts reading the
// session, a cookie or the user agent again, that visitor's page gets served to
// everyone — so this fails loudly rather than shipping a leak.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = process.cwd();
const PAGE_SERVER = path.join(ROOT, 'src/routes/personality-analysis/[slug]/+page.server.ts');
const DISCUSSION_ENDPOINT = path.join(
	ROOT,
	'src/routes/api/personality-analysis/[slug]/discussion/+server.ts'
);

const pageServerSource = readFileSync(PAGE_SERVER, 'utf8');
const discussionSource = readFileSync(DISCUSSION_ENDPOINT, 'utf8');

/** Strip comments so prose about cookies/sessions doesn't trip the scans. */
function stripComments(source: string): string {
	return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
}

const pageServerCode = stripComments(pageServerSource);

describe('personality analysis ISR contract', () => {
	it('declares ISR with a query-independent cache key', () => {
		expect(pageServerCode).toMatch(/export const config\s*=/);
		expect(pageServerCode).toMatch(/isr:\s*\{/);
		expect(pageServerCode).toMatch(/expiration:/);
		// utm/fbclid must not fragment the cache or regenerate pages.
		expect(pageServerCode).toMatch(/allowQuery:\s*\[\]/);
	});

	it('never reads per-visitor state in the shared page load', () => {
		expect(pageServerCode).not.toMatch(/locals\.session/);
		expect(pageServerCode).not.toMatch(/locals\.user/);
		expect(pageServerCode).not.toMatch(/safeGetSession/);
		expect(pageServerCode).not.toMatch(/cookies\.get/);
		expect(pageServerCode).not.toMatch(/cookies\.set/);
		expect(pageServerCode).not.toMatch(/user-agent/i);
	});

	it('returns no user, flags or comments to the shared page', () => {
		expect(pageServerCode).not.toMatch(/^\s*user:/m);
		expect(pageServerCode).not.toMatch(/^\s*flags:/m);
		expect(pageServerCode).not.toMatch(/^\s*comments,?$/m);
		expect(pageServerCode).not.toMatch(/userHasAnswered/);
	});

	it('404s unpublished people for everyone, including admins', () => {
		expect(pageServerCode).toMatch(/if\s*\(!personData\.published\)\s*\{\s*throw error\(404/);
		// An admin lookup here would cache a draft publicly.
		expect(pageServerCode).not.toMatch(/adminProfile/);
	});

	it('keeps the give-first gate server-side and uncacheable in the discussion API', () => {
		// Comments only after the visitor has answered.
		expect(discussionSource).toMatch(/if\s*\(!userHasAnswered\)/);
		expect(discussionSource).toMatch(/CONTENT_GUARD_CACHE_CONTROL/);
		expect(discussionSource).not.toMatch(/s-maxage/);
	});
});
