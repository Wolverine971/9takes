#!/usr/bin/env node
// scripts/lint-retired-color-tokens.mjs
// Guard the Streetlamp V5 color contract against bridge-token and palette drift.
//
// Usage: node scripts/lint-retired-color-tokens.mjs
// Wire-up: `pnpm lint:colors`, and part of `pnpm lint`.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SCAN_EXTS = new Set(['.svelte', '.scss', '.css', '.ts', '.js', '.mjs', '.html', '.md']);
const RETIRED_CUSTOM_PROPERTIES = [
	'secondary',
	'secondary-light',
	'secondary-dark',
	'secondary-glow',
	'secondary-subtle',
	'primary-rgb',
	'white',
	'off-white',
	'lightest-gray',
	'light-gray',
	'medium-gray',
	'dark-gray',
	'darkest-gray',
	'black',
	'text-on-secondary',
	'card-background',
	'body-background',
	'comment-hover-bg',
	'border-color',
	'button-hover',
	'hover-background',
	'message-background',
	'button-background',
	'background',
	'color-border',
	'color-text',
	'color-text-secondary',
	'color-text-muted',
	'color-primary',
	'color-warning',
	'color-bg-secondary',
	'color-bg-muted',
	'color-icon',
	'text-color-secondary',
	'card-bg-color',
	'item-background',
	'title-background',
	'title-color',
	'link-background',
	'link-hover-background',
	'link-color',
	'background-light',
	'background-dark',
	'base-white-outline',
	'classic-border',
	'muted-text'
];
const RETIRED_ARTICLE_HEX =
	/#(?:fff1f2|ffe4e6|fecdd3|fda4af|fb7185|f43f5e|e11d48|be123c|9f1239|881337|f5f3ff|ede9fe|ddd6fe|c4b5fd|a78bfa|8b5cf6|7c3aed|6d28d9|5b21b6|4c1d95)\b/gi;
const RETIRED_GLOBAL_INTERFACE_HEX = /#(?:801eff|be26d7|eb74c4|c41c8c|7158e2|6c5ce7|f9f9ff)\b/gi;
const RETIRED_TAILWIND_UTILITY =
	/\b(?:bg|text|border|ring|shadow|outline|decoration|from|via|to)-(?:secondary|accent)-(?:50|100|200|300|400|500|600|700|800|900|950)\b/g;

function escapeRegExp(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const retiredPropertyPattern = new RegExp(
	`(?:var\\(\\s*|(?<![a-z0-9-]))--(${RETIRED_CUSTOM_PROPERTIES.map(escapeRegExp).join('|')})(?=\\s*[:,)])`,
	'gi'
);

function walk(directory, output) {
	for (const name of readdirSync(directory)) {
		if (name === 'node_modules' || name === '.svelte-kit' || name === 'coverage') continue;
		const fullPath = join(directory, name);
		const stat = statSync(fullPath);
		if (stat.isDirectory()) walk(fullPath, output);
		else if (SCAN_EXTS.has(extname(name))) output.push(fullPath);
	}
}

const files = [];
walk(join(ROOT, 'src'), files);
files.push(join(ROOT, 'tailwind.config.ts'));

const violations = [];
for (const file of files) {
	const rel = relative(ROOT, file);
	const text = readFileSync(file, 'utf8');
	const lines = text.split('\n');

	lines.forEach((line, index) => {
		for (const match of line.matchAll(retiredPropertyPattern)) {
			violations.push({
				rel,
				line: index + 1,
				match: `--${match[1]}`,
				reason: 'retired CSS custom property'
			});
		}
		for (const match of line.matchAll(RETIRED_TAILWIND_UTILITY)) {
			violations.push({
				rel,
				line: index + 1,
				match: match[0],
				reason: 'retired Tailwind palette utility'
			});
		}
		for (const match of line.matchAll(RETIRED_GLOBAL_INTERFACE_HEX)) {
			violations.push({
				rel,
				line: index + 1,
				match: match[0],
				reason: 'retired non-semantic purple interface color'
			});
		}
		if (rel.startsWith('src/blog/') && !rel.includes('/drafts/')) {
			for (const match of line.matchAll(RETIRED_ARTICLE_HEX)) {
				violations.push({
					rel,
					line: index + 1,
					match: match[0],
					reason: 'retired rose/purple article color'
				});
			}
		}
	});

	if (rel === 'tailwind.config.ts') {
		for (const [pattern, label] of [
			[/^\s*(?:secondary|accent)\s*:\s*\{/gm, 'retired Tailwind palette definition'],
			[/^\s*(?:teal|tealDark|rose|roseDark|gold)\s*:\s*['"]/gm, 'retired brand color alias']
		]) {
			for (const match of text.matchAll(pattern)) {
				violations.push({
					rel,
					line: text.slice(0, match.index).split('\n').length,
					match: match[0].trim(),
					reason: label
				});
			}
		}
	}
}

if (violations.length) {
	console.error('\n✗ Retired color-token violations (docs/design-system.md §5):\n');
	for (const violation of violations) {
		console.error(`  ${violation.rel}:${violation.line}  ${violation.match} — ${violation.reason}`);
	}
	console.error(
		'\nUse V5 role tokens: --lamp-*, --night-*, --stone-*, --ink-*, or semantic status/data tokens.\n'
	);
	process.exit(1);
}

console.log(
	`✓ lint:colors — ${files.length} files scanned; no retired palette or bridge-token drift`
);
