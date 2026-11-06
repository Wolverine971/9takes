#!/usr/bin/env node
// scripts/style-ratchet.mjs
// Cold Light rollout guardrail: per-file style-debt counts may only go DOWN.
//
// Usage:
//   node scripts/style-ratchet.mjs                 # compare against baseline; exit 1 on any increase
//   node scripts/style-ratchet.mjs --update        # rewrite scripts/style-ratchet-baseline.json
//   node scripts/style-ratchet.mjs --report <path-prefix> [...]   # per-file counts for one screen
//   node scripts/style-ratchet.mjs --top 20        # worst files by weighted total
//   node scripts/style-ratchet.mjs --json          # machine-readable current counts
//
// Docs: docs/design/cold-light-rollout/README.md
//
// What is counted (per file):
//   hex          raw #rgb/#rrggbb/#rrggbbaa colors inside <style> blocks / .scss / .css
//   rgb          rgb()/rgba()/hsl()/hsla() literals with no var() inside (style only)
//   fontSize     `font-size:` values that are neither var()/token-based nor a keyword
//                (style only; src/routes/admin/** is EXCLUDED — admin is palette-only
//                in the Cold Light rebrand, so its type scale is out of scope)
//   important    `!important` (style only)
//   legacyToken  uses of retired V5 tokens (--lamp-*, --night-*, --stone-*, --data-teal*,
//                --data-cyan, --ink-*, --marble-*, --pool-*) anywhere in the file
//                (style, markup, script). Definitions (`--lamp-glow: …`) are not uses.
//   twLegacy     Tailwind amber-family utilities: {bg,text,border,…}-{primary,amber,
//                yellow,orange}-NNN anywhere in the file
//   amber        known amber hex values (#f59e0b family) anywhere in the file, incl. .ts/.js
//
// Token files (src/scss/index.scss and src/scss/_tokens*.scss) are allowed to DEFINE
// custom properties with literal colors: `--x: #abc` lines there are skipped for the
// hex / rgb / amber metrics. Everything else in those files is still counted.
//
// Scope: src/**/*.svelte, src/**/*.scss, src/**/*.css, and src/**/*.{ts,js} (the .ts/.js
// files only feed legacyToken / twLegacy / amber). Skips *.spec.*, *.test.*, src/blog/**,
// generated data, node_modules, .svelte-kit.

import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { extname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const BASELINE_PATH = join(ROOT, 'scripts', 'style-ratchet-baseline.json');
const METRICS = ['hex', 'rgb', 'fontSize', 'important', 'legacyToken', 'twLegacy', 'amber'];
const STYLE_METRICS = new Set(['hex', 'rgb', 'fontSize', 'important']);
const FONT_SIZE_EXCLUDE_PREFIXES = ['src/routes/admin/'];
const SKIP_DIRS = new Set(['node_modules', '.svelte-kit', 'coverage', 'build', '.vercel']);
const SKIP_PREFIXES = ['src/blog/', 'src/lib/data/'];
const TOKEN_FILE_RE = /^src\/scss\/(?:index\.scss|_tokens[\w-]*\.scss)$/;

const LEGACY_TOKEN_NAMES = [
	'lamp-[\\w-]+',
	'night-[\\w-]+',
	'stone-[\\w-]+',
	'data-teal[\\w-]*',
	'data-cyan',
	'ink-[\\w-]+',
	'marble-[\\w-]+',
	'pool-[\\w-]+'
];
// A use is any occurrence NOT immediately followed by `:` (which would be a definition).
const LEGACY_TOKEN_RE = new RegExp(
	`(?<![\\w-])--(?:${LEGACY_TOKEN_NAMES.join('|')})(?![\\w-])(?!\\s*:)`,
	'g'
);
const TW_LEGACY_RE =
	/(?<![\w-])(?:[a-z]+:)*(?:bg|text|border(?:-[trblxy])?|ring|ring-offset|from|via|to|fill|stroke|outline|decoration|shadow|divide|placeholder|accent|caret)-(?:primary|amber|yellow|orange)-(?:50|100|200|300|400|500|600|700|800|900|950)(?:\/\d+)?(?![\w-])/g;
const AMBER_HEX_RE =
	/#(?:f59e0b|fbbf24|d97706|b45309|92400e|78350f|fcd34d|fde68a|fef3c7|fffbeb|f97316|ea580c|fb923c|fdba74)(?![0-9a-f])/gi;
const AMBER_RGB_RE =
	/\b(?:245\s*,\s*158\s*,\s*11|251\s*,\s*191\s*,\s*36|217\s*,\s*119\s*,\s*6|180\s*,\s*83\s*,\s*9)\b/g;
const HEX_RE = /(?<![\w&])#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})(?![0-9a-z_-])/gi;
const COLOR_FN_RE = /\b(?:rgba?|hsla?)\(([^()]*(?:\([^()]*\)[^()]*)*)\)/gi;
const FONT_SIZE_RE = /(?<![\w-])font-size\s*:\s*([^;}{]+)/gi;
const IMPORTANT_RE = /!\s*important\b/gi;
const FONT_SIZE_KEYWORDS = new Set([
	'inherit',
	'initial',
	'unset',
	'revert',
	'revert-layer',
	'smaller',
	'larger',
	'1em',
	'100%',
	'0'
]);

function walk(dir, out) {
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		if (SKIP_DIRS.has(entry.name)) continue;
		const full = join(dir, entry.name);
		if (entry.isDirectory()) walk(full, out);
		else out.push(full);
	}
}

function toRel(file) {
	return relative(ROOT, file).split(sep).join('/');
}

/** Blank out comments while preserving line structure/offsets. */
function stripComments(text, { lineComments }) {
	let out = text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
	out = out.replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, ' '));
	if (lineComments) {
		// `//` comments, but not inside url(...) or after a protocol colon.
		out = out.replace(
			/(^|[^:\w/'"(])\/\/[^\n]*/g,
			(m, pre) => pre + ' '.repeat(m.length - pre.length)
		);
	}
	return out;
}

function styleBlocks(svelteSource) {
	const blocks = [];
	const re = /<style\b([^>]*)>([\s\S]*?)<\/style>/gi;
	for (const m of svelteSource.matchAll(re)) blocks.push(m[2]);
	return blocks.join('\n');
}

function count(re, text) {
	re.lastIndex = 0;
	let n = 0;
	for (const _ of text.matchAll(re)) n++;
	return n;
}

function dropTokenDefinitions(text) {
	return text
		.split('\n')
		.map((line) => (/^\s*--[\w-]+\s*:/.test(line) ? '' : line))
		.join('\n');
}

function scoreStyle(css, rel, isTokenFile) {
	const colorText = isTokenFile ? dropTokenDefinitions(css) : css;
	let rgb = 0;
	COLOR_FN_RE.lastIndex = 0;
	for (const m of colorText.matchAll(COLOR_FN_RE)) if (!m[1].includes('var(')) rgb++;
	let fontSize = 0;
	if (!FONT_SIZE_EXCLUDE_PREFIXES.some((p) => rel.startsWith(p))) {
		for (const m of css.matchAll(FONT_SIZE_RE)) {
			const value = m[1]
				.replace(/!\s*important/i, '')
				.trim()
				.toLowerCase();
			if (value.includes('var(') || value.includes('$') || FONT_SIZE_KEYWORDS.has(value)) continue;
			fontSize++;
		}
	}
	return {
		hex: count(HEX_RE, colorText),
		rgb,
		fontSize,
		important: count(IMPORTANT_RE, css)
	};
}

function scoreFile(file) {
	const rel = toRel(file);
	const ext = extname(file);
	const raw = readFileSync(file, 'utf8');
	const isTokenFile = TOKEN_FILE_RE.test(rel);
	const counts = Object.fromEntries(METRICS.map((m) => [m, 0]));

	let whole;
	if (ext === '.svelte') {
		whole = stripComments(raw, { lineComments: false });
		const css = stripComments(styleBlocks(raw), { lineComments: true });
		Object.assign(counts, scoreStyle(css, rel, false));
	} else if (ext === '.scss' || ext === '.css') {
		whole = stripComments(raw, { lineComments: ext === '.scss' });
		Object.assign(counts, scoreStyle(whole, rel, isTokenFile));
	} else {
		whole = stripComments(raw, { lineComments: true });
	}

	const amberText = isTokenFile ? dropTokenDefinitions(whole) : whole;
	counts.legacyToken = count(LEGACY_TOKEN_RE, whole);
	counts.twLegacy = count(TW_LEGACY_RE, whole);
	counts.amber = count(AMBER_HEX_RE, amberText) + count(AMBER_RGB_RE, amberText);
	return { rel, counts };
}

function collect() {
	const files = [];
	walk(join(ROOT, 'src'), files);
	const result = {};
	for (const file of files) {
		const rel = toRel(file);
		const ext = extname(file);
		if (!['.svelte', '.scss', '.css', '.ts', '.js'].includes(ext)) continue;
		if (/\.(spec|test)\.[tj]s$/.test(rel) || rel.endsWith('.d.ts')) continue;
		if (SKIP_PREFIXES.some((p) => rel.startsWith(p))) continue;
		const { counts } = scoreFile(file);
		const nonZero = Object.fromEntries(Object.entries(counts).filter(([, v]) => v > 0));
		if (Object.keys(nonZero).length) result[rel] = nonZero;
	}
	return Object.fromEntries(Object.entries(result).sort(([a], [b]) => a.localeCompare(b)));
}

function totals(files) {
	const t = Object.fromEntries(METRICS.map((m) => [m, 0]));
	for (const counts of Object.values(files)) for (const m of METRICS) t[m] += counts[m] ?? 0;
	return t;
}

function weight(counts) {
	return METRICS.reduce((sum, m) => sum + (counts[m] ?? 0), 0);
}

function pad(s, n) {
	s = String(s);
	return s.length >= n ? s : s + ' '.repeat(n - s.length);
}
function lpad(s, n) {
	s = String(s);
	return s.length >= n ? s : ' '.repeat(n - s.length) + s;
}

function printTable(rows, title) {
	console.log(`\n${title}`);
	console.log(
		`  ${pad('file', 64)} ${METRICS.map((m) => lpad(m, 11)).join(' ')} ${lpad('total', 6)}`
	);
	for (const [rel, counts] of rows) {
		console.log(
			`  ${pad(rel.length > 64 ? '…' + rel.slice(-63) : rel, 64)} ${METRICS.map((m) => lpad(counts[m] ?? 0, 11)).join(' ')} ${lpad(weight(counts), 6)}`
		);
	}
}

const args = process.argv.slice(2);
const started = performance.now();
const current = collect();

if (args.includes('--json')) {
	console.log(JSON.stringify({ totals: totals(current), files: current }, null, 2));
	process.exit(0);
}

const reportIdx = args.indexOf('--report');
if (reportIdx !== -1) {
	const prefixes = args.slice(reportIdx + 1).filter((a) => !a.startsWith('--'));
	const baseline = existsSync(BASELINE_PATH)
		? JSON.parse(readFileSync(BASELINE_PATH, 'utf8')).files
		: {};
	const keys = new Set(
		[...Object.keys(current), ...Object.keys(baseline)].filter((k) =>
			prefixes.some((p) => k.startsWith(p.replace(/^\.\//, '')))
		)
	);
	const rows = [...keys].sort().map((k) => [k, current[k] ?? {}]);
	printTable(rows, `Style debt for ${prefixes.join(', ')} (current tree)`);
	const sub = totals(Object.fromEntries(rows));
	const subBase = totals(Object.fromEntries([...keys].map((k) => [k, baseline[k] ?? {}])));
	console.log(
		`\n  totals now:      ${METRICS.map((m) => `${m}=${sub[m]}`).join('  ')}\n  totals baseline: ${METRICS.map((m) => `${m}=${subBase[m]}`).join('  ')}`
	);
	process.exit(0);
}

const topIdx = args.indexOf('--top');
if (topIdx !== -1) {
	const n = Number(args[topIdx + 1]) || 20;
	const rows = Object.entries(current)
		.sort(([, a], [, b]) => weight(b) - weight(a))
		.slice(0, n);
	printTable(rows, `Top ${n} files by total style debt`);
	const t = totals(current);
	console.log(`\n  overall: ${METRICS.map((m) => `${m}=${t[m]}`).join('  ')}`);
	process.exit(0);
}

if (args.includes('--update')) {
	const payload = {
		$comment:
			'Generated by scripts/style-ratchet.mjs --update. Per-file counts may only go down. See docs/design/cold-light-rollout/README.md.',
		metrics: METRICS,
		totals: totals(current),
		files: current
	};
	writeFileSync(BASELINE_PATH, JSON.stringify(payload, null, '\t') + '\n');
	const t = payload.totals;
	console.log(
		`✓ style-ratchet baseline written (${Object.keys(current).length} files with debt): ${METRICS.map((m) => `${m}=${t[m]}`).join('  ')}`
	);
	process.exit(0);
}

if (!existsSync(BASELINE_PATH)) {
	console.error('✗ style-ratchet: no baseline. Run `node scripts/style-ratchet.mjs --update`.');
	process.exit(1);
}

const baselineFile = JSON.parse(readFileSync(BASELINE_PATH, 'utf8'));
const baseline = baselineFile.files;
const regressions = [];
const wins = [];
for (const rel of new Set([...Object.keys(current), ...Object.keys(baseline)])) {
	const now = current[rel] ?? {};
	const before = baseline[rel];
	for (const m of METRICS) {
		const a = before?.[m] ?? 0;
		const b = now[m] ?? 0;
		if (b > a) regressions.push({ rel, m, a, b, isNew: !before });
		else if (b < a) wins.push({ rel, m, a, b });
	}
}

const tNow = totals(current);
const tBase = totals(baseline);
const ms = Math.round(performance.now() - started);

if (wins.length) {
	console.log(`\n▼ ${wins.length} improvement(s):`);
	for (const w of wins.slice(0, 40)) console.log(`  ${w.rel}  ${w.m} ${w.a} → ${w.b}`);
	if (wins.length > 40) console.log(`  … and ${wins.length - 40} more`);
}

console.log('\nTotals (baseline → now):');
for (const m of METRICS) {
	const d = tNow[m] - tBase[m];
	console.log(
		`  ${pad(m, 12)} ${lpad(tBase[m], 6)} → ${lpad(tNow[m], 6)}  ${d === 0 ? '' : d > 0 ? `+${d}` : d}`
	);
}

if (regressions.length) {
	console.error(
		`\n✗ style-ratchet: ${regressions.length} regression(s) — counts may only go down:\n`
	);
	for (const r of regressions)
		console.error(`  ${r.rel}  ${r.m} ${r.a} → ${r.b}${r.isNew ? '  (new file)' : ''}`);
	console.error(
		'\nUse Cold Light tokens (--bg, --surface, --accent, --action, --text*, --rule, --font-*) instead of literals/legacy tokens.' +
			'\nIf the increase is deliberate (e.g. moving debt between files), run `node scripts/style-ratchet.mjs --update` and say why in the commit.'
	);
	process.exit(1);
}

console.log(
	`\n✓ style-ratchet — ${Object.keys(current).length} files with debt, no increases (${ms}ms)` +
		(wins.length ? '. Lock in the wins: node scripts/style-ratchet.mjs --update' : '')
);
