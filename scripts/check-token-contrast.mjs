#!/usr/bin/env node
// scripts/check-token-contrast.mjs
// WCAG contrast gate for the Cold Light color tokens.
//
// Usage: node scripts/check-token-contrast.mjs [path/to/tokens.scss]
//   default source: src/scss/index.scss (first-level `:root { … }` blocks only;
//   `:root.light` and other variants are ignored — Cold Light is dark-only).
//   Any contract token missing from the source falls back to the contract value
//   below and is marked "fallback" in the table.
//
// Exit 1 when a required pair fails. Docs: docs/design/cold-light-rollout/README.md

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SOURCE = process.argv[2] ?? join(ROOT, 'src', 'scss', 'index.scss');

const CONTRACT = {
	bg: '#01010D',
	surface: '#0C0B22',
	'surface-raised': '#131133',
	accent: '#6331FB',
	'accent-deep': '#24127A',
	highlight: '#CFC2FF',
	action: '#88F9C0',
	'text-on-action': '#01010D',
	text: '#F4F2FF',
	'text-muted': '#BDB8DA',
	'text-faint': '#8D88AE',
	rule: 'rgba(207, 194, 255, 0.14)',
	focus: 'var(--highlight)'
};

const SURFACES = ['bg', 'surface', 'surface-raised'];
const CHECKS = [
	...['text', 'text-muted', 'text-faint', 'highlight'].flatMap((fg) =>
		SURFACES.map((bg) => ({ fg, bg, min: 4.5, kind: 'text' }))
	),
	{ fg: 'text-on-action', bg: 'action', min: 4.5, kind: 'text' },
	{ fg: 'text', bg: 'accent', min: 4.5, kind: 'text' },
	...SURFACES.map((bg) => ({ fg: 'focus', bg, min: 3, kind: 'non-text' })),
	{ fg: 'accent', bg: 'bg', max: 4.5, kind: 'never-text' },
	// Informational: reported, never fail.
	{ fg: 'action', bg: 'bg', min: 4.5, kind: 'info' },
	{ fg: 'action', bg: 'surface', min: 4.5, kind: 'info' },
	{ fg: 'text', bg: 'accent-deep', min: 4.5, kind: 'info' },
	{ fg: 'highlight', bg: 'accent-deep', min: 4.5, kind: 'info' },
	{ fg: 'rule', bg: 'surface', min: 1.5, kind: 'info' }
];

function readRootTokens(path) {
	if (!existsSync(path)) return {};
	const src = readFileSync(path, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
	const tokens = {};
	const re = /(^|[}\s;])(:root)\s*\{/g;
	for (const m of src.matchAll(re)) {
		let i = m.index + m[0].length;
		let depth = 1;
		const start = i;
		while (i < src.length && depth) {
			if (src[i] === '{') depth++;
			else if (src[i] === '}') depth--;
			i++;
		}
		const body = src.slice(start, i - 1);
		// Only top-level declarations of this block.
		let level = 0;
		let buf = '';
		for (const ch of body) {
			if (ch === '{') level++;
			if (ch === '}') {
				level--;
				buf = '';
				continue;
			}
			if (level > 0) continue;
			if (ch === ';') {
				const d = buf.match(/^\s*--([\w-]+)\s*:\s*([\s\S]+?)\s*$/);
				if (d) tokens[d[1]] = d[2];
				buf = '';
			} else buf += ch;
		}
	}
	return tokens;
}

const parsed = readRootTokens(SOURCE);

function resolve(name, seen = new Set()) {
	if (seen.has(name)) throw new Error(`circular var() at --${name}`);
	seen.add(name);
	const raw = parsed[name] ?? CONTRACT[name];
	if (raw == null) return null;
	const v = raw.trim();
	const ref = v.match(/^var\(\s*--([\w-]+)\s*(?:,\s*([^)]+))?\)$/);
	if (ref) return resolve(ref[1], seen) ?? (ref[2] ? ref[2].trim() : null);
	return v;
}

function parseColor(value) {
	if (!value) return null;
	let m = value.match(/^#([0-9a-f]{3,8})$/i);
	if (m) {
		let h = m[1];
		if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join('');
		const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
		return [
			parseInt(h.slice(0, 2), 16),
			parseInt(h.slice(2, 4), 16),
			parseInt(h.slice(4, 6), 16),
			a
		];
	}
	m = value.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+%?))?\s*\)$/i);
	if (m) {
		let a = m[4] == null ? 1 : m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4]);
		return [+m[1], +m[2], +m[3], a];
	}
	return null;
}

function over(fg, bg) {
	const a = fg[3];
	return [0, 1, 2].map((i) => fg[i] * a + bg[i] * (1 - a)).concat(1);
}

function luminance([r, g, b]) {
	const lin = (c) => {
		c /= 255;
		return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
	};
	return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrast(a, b) {
	const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (hi + 0.05) / (lo + 0.05);
}

const pad = (s, n) => String(s).padEnd(n);
const sourceOf = (name) => (parsed[name] != null ? 'scss' : 'fallback');

let failures = 0;
console.log(`Cold Light token contrast — source: ${SOURCE.replace(ROOT, '')}\n`);
console.log(
	`  ${pad('foreground', 16)} ${pad('background', 16)} ${pad('ratio', 7)} ${pad('rule', 20)} ${pad('result', 7)} values`
);
for (const c of CHECKS) {
	const fgVal = resolve(c.fg);
	const bgVal = resolve(c.bg);
	const bgCol = parseColor(bgVal);
	let fgCol = parseColor(fgVal);
	if (!fgCol || !bgCol) {
		console.log(
			`  ${pad(c.fg, 16)} ${pad(c.bg, 16)} ${pad('—', 7)} ${pad('', 20)} SKIP    unparseable: ${fgVal} on ${bgVal}`
		);
		if (c.kind !== 'info') failures++;
		continue;
	}
	const bgSolid = bgCol[3] < 1 ? over(bgCol, parseColor(resolve('bg'))) : bgCol;
	if (fgCol[3] < 1) fgCol = over(fgCol, bgSolid);
	const ratio = contrast(fgCol, bgSolid);
	let ok;
	let rule;
	if (c.max != null) {
		ok = ratio < c.max;
		rule = `< ${c.max} (never text)`;
	} else {
		ok = ratio >= c.min;
		rule = `≥ ${c.min}${c.kind === 'non-text' ? ' ui' : ''}`;
	}
	const result = c.kind === 'info' ? (ok ? 'info✓' : 'info✗') : ok ? 'PASS' : 'FAIL';
	if (!ok && c.kind !== 'info') failures++;
	const src = [c.fg, c.bg].map(sourceOf).includes('fallback')
		? `  [${c.fg}:${sourceOf(c.fg)}, ${c.bg}:${sourceOf(c.bg)}]`
		: '';
	console.log(
		`  ${pad(c.fg, 16)} ${pad(c.bg, 16)} ${pad(ratio.toFixed(2), 7)} ${pad(rule, 20)} ${pad(result, 7)} ${fgVal} on ${bgVal}${src}`
	);
}

const missing = Object.keys(CONTRACT).filter((k) => parsed[k] == null);
if (missing.length) {
	console.log(
		`\n  note: not yet defined in ${SOURCE.replace(ROOT, '')} → using contract fallback: ${missing.map((k) => '--' + k).join(', ')}`
	);
}

if (failures) {
	console.error(`\n✗ token contrast: ${failures} required pair(s) failed`);
	process.exit(1);
}
console.log('\n✓ token contrast: all required pairs pass');
