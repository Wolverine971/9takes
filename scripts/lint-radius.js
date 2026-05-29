// scripts/lint-radius.js
//
// Radius-scale linter — enforces docs/design-system.md §8 (locked 2026-04-27).
//
// Allowed radii:  rounded-sm (4px) · rounded-md (10px) · rounded-xl (16px) · rounded-full
// Banned radii:   rounded-lg · rounded-2xl · rounded-3xl · rounded-[<arbitrary>]
//   (rounded-lg/2xl/3xl are deprecated mappings; arbitrary values bypass the scale.)
//
// Side-prefixed variants are also checked: rounded-t-lg, rounded-tl-2xl,
// rounded-b-[12px], plus responsive/state prefixes (md:rounded-2xl, hover:rounded-lg).
//
// Usage:  node scripts/lint-radius.js          → scans src/, exits 1 on any violation
//         node scripts/lint-radius.js --quiet   → only prints the summary line
//
// Wire-up: `pnpm lint:radius`, and part of `pnpm lint`.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SCAN_DIRS = ['src'];
const SCAN_EXTS = new Set(['.svelte', '.scss', '.css', '.ts', '.js', '.html', '.md']);

// Directories/files excluded from enforcement.
//  - design-preview: the V5 reference prototype (also carved out of the ESLint color ban).
//  - src/blog: author-written MDsvex *content*, not the component design-system surface.
//    The radius scale (design-system.md §8) governs UI chrome, not inline blog markup.
const IGNORE_PATHS = ['src/routes/design-preview', 'src/blog'];

// A line is skipped if it — or the line immediately above it — contains this directive
// (covers both same-line and "disable-next-line" placement, the latter survives Prettier
// reflowing the comment onto its own line). Used by styleguide docs that *name* the
// banned classes as examples.
const INLINE_IGNORE = 'lint-radius-disable-line';

// Side prefixes: t, b, l, r, tl, tr, bl, br, s, e, ss, se, es, ee
const SIDE = '(?:-(?:t|b|l|r|s|e|tl|tr|bl|br|ss|se|es|ee))?';
// A banned class token, allowing any tailwind variant prefixes (md:, hover:, dark:, etc.)
// before `rounded`. Matched on a class-token boundary so `surrounded` etc. never hits.
const BANNED = new RegExp(
	`(?<![\\w-])((?:[a-z][a-z0-9-]*:)*rounded${SIDE}-(?:lg|2xl|3xl|\\[[^\\]]+\\]))(?![\\w-])`,
	'g'
);

function walk(dir, out) {
	for (const name of readdirSync(dir)) {
		if (name === 'node_modules' || name === '.svelte-kit' || name.startsWith('.')) continue;
		const full = join(dir, name);
		const st = statSync(full);
		if (st.isDirectory()) walk(full, out);
		else if (SCAN_EXTS.has(extname(name))) out.push(full);
	}
}

function isIgnored(rel) {
	return IGNORE_PATHS.some((p) => rel === p || rel.startsWith(p + '/'));
}

const quiet = process.argv.includes('--quiet');
const files = [];
for (const d of SCAN_DIRS) {
	try {
		walk(join(ROOT, d), files);
	} catch {
		/* dir may not exist */
	}
}

const violations = [];
for (const file of files) {
	const rel = relative(ROOT, file);
	if (isIgnored(rel)) continue;
	const text = readFileSync(file, 'utf8');
	const lines = text.split('\n');
	lines.forEach((line, i) => {
		if (line.includes(INLINE_IGNORE)) return;
		if (i > 0 && lines[i - 1].includes(INLINE_IGNORE)) return;
		for (const m of line.matchAll(BANNED)) {
			violations.push({ rel, line: i + 1, col: m.index + 1, match: m[1] });
		}
	});
}

if (violations.length) {
	if (!quiet) {
		console.error('\n✗ Radius-scale violations (docs/design-system.md §8):\n');
		for (const v of violations) {
			console.error(`  ${v.rel}:${v.line}:${v.col}  ${v.match}`);
		}
		console.error('\nAllowed: rounded-sm · rounded-md · rounded-xl · rounded-full');
		console.error('Fix: rounded-lg → rounded-md or rounded-xl · rounded-2xl/3xl → rounded-xl\n');
	}
	console.error(`✗ lint:radius — ${violations.length} violation(s) in ${files.length} files`);
	process.exit(1);
}

console.log(`✓ lint:radius — 0 violations (${files.length} files scanned)`);
