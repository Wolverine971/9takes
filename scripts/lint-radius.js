// scripts/lint-radius.js
#!/usr/bin/env node
// scripts/lint-radius.js
//
// Enforces the corner-radius standard documented in
// docs/design/2026-04-27-ui-audit-kole-jain-8-mistakes.md.
//
// The standard:
//   rounded-md   → buttons, inputs, chips, popovers      (10px)
//   rounded-xl   → cards, modals, banners                (16px)
//   rounded-full → pills, avatars, circles, spinners
//   rounded-sm   → tiny inline things                    (4px)
//
// Banned in .svelte files:
//   rounded-lg, rounded-2xl, rounded-3xl, rounded-[Npx]   (ad-hoc)
//
// Run: pnpm lint:radius
// Exit 1 on any violation.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('../src', import.meta.url).pathname;
const PROJECT_ROOT = new URL('..', import.meta.url).pathname;

const BANNED = [
	{
		pattern: /\brounded-lg\b/,
		name: 'rounded-lg',
		hint: 'use rounded-md (button/input) or rounded-xl (card)'
	},
	{ pattern: /\brounded-2xl\b/, name: 'rounded-2xl', hint: 'use rounded-xl' },
	{ pattern: /\brounded-3xl\b/, name: 'rounded-3xl', hint: 'use rounded-xl' },
	{
		pattern: /\brounded-\[[^\]]+\]/,
		name: 'rounded-[arbitrary]',
		hint: 'use a token: sm/md/xl/full'
	}
];

function walk(dir) {
	const out = [];
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) {
			out.push(...walk(full));
		} else if (full.endsWith('.svelte')) {
			out.push(full);
		}
	}
	return out;
}

const files = walk(ROOT);
const violations = [];

for (const file of files) {
	const text = readFileSync(file, 'utf8');
	const lines = text.split('\n');
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		for (const rule of BANNED) {
			if (rule.pattern.test(line)) {
				violations.push({
					file: relative(PROJECT_ROOT, file),
					line: i + 1,
					rule: rule.name,
					hint: rule.hint,
					snippet: line.trim().slice(0, 120)
				});
			}
		}
	}
}

if (violations.length === 0) {
	console.log(
		`✓ Radius lint passed — scanned ${files.length} .svelte files, no banned classes found.`
	);
	process.exit(0);
}

console.error(`✗ Radius lint found ${violations.length} violation(s):\n`);
for (const v of violations) {
	console.error(`  ${v.file}:${v.line}  →  ${v.rule}`);
	console.error(`    ${v.snippet}`);
	console.error(`    hint: ${v.hint}\n`);
}
console.error(`See docs/design/2026-04-27-ui-audit-kole-jain-8-mistakes.md for the standard.`);
process.exit(1);
