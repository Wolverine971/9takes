// scripts/check-server-runtime.mjs
// Check the server the way Vercel runs it: from copies of the traced functions
// (only the files Vercel packages, outside the repo so Node can't fall back to the
// full node_modules), with require(ESM) disabled because newer local Node versions
// can require ESM and mask Vercel runtime failures.
//
// Rolldown leaves require() calls inside bundled CommonJS as runtime requires that
// Vercel's file tracer never sees. On 2026-09-22 that shipped a function without
// postcss and 500'd every personality page while this check (then importing from
// .svelte-kit/output inside the repo) passed.
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readdirSync, readFileSync, realpathSync, rmSync } from 'node:fs';
import { createRequire, isBuiltin } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

assert.equal(
	process.features.require_module,
	false,
	'Run this check with node --no-experimental-require-module'
);

const FUNCTIONS_DIR = '.vercel/output/functions';
const ARTICLE_FUNCTION = `${FUNCTIONS_DIR}/personality-analysis/[slug].func`;
const ARTICLE_PROCESSOR = '.svelte-kit/output/server/chunks/blogContentProcessor.js';
const RUNTIME_REQUIRE = /__require\(\s*["']([^"']+)["']\s*\)/g;

function listFunctionDirs(dir, found = new Set()) {
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.name.endsWith('.func')) found.add(realpathSync(full));
		else if (entry.isDirectory()) listFunctionDirs(full, found);
	}
	return found;
}

function listJsFiles(dir, found = []) {
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) listJsFiles(full, found);
		else if (entry.name.endsWith('.js')) found.push(full);
	}
	return found;
}

function isolate(functionDir) {
	const copy = mkdtempSync(path.join(tmpdir(), 'server-runtime-'));
	// Keep the bundle's relative pnpm symlinks as-is; resolving them would point back
	// into the repo's node_modules and hide exactly the packages tracing missed.
	cpSync(functionDir, copy, { recursive: true, verbatimSymlinks: true });
	return copy;
}

const unresolved = new Set();
for (const functionDir of listFunctionDirs(FUNCTIONS_DIR)) {
	const copy = isolate(functionDir);
	try {
		for (const file of listJsFiles(path.join(copy, '.svelte-kit/output/server'))) {
			const requireFrom = createRequire(file);
			for (const [, specifier] of readFileSync(file, 'utf8').matchAll(RUNTIME_REQUIRE)) {
				if (isBuiltin(specifier)) continue;
				try {
					requireFrom.resolve(specifier);
				} catch {
					unresolved.add(`${specifier} (required by ${path.relative(copy, file)})`);
				}
			}
		}
	} finally {
		rmSync(copy, { recursive: true, force: true });
	}
}
assert.equal(
	unresolved.size,
	0,
	`Traced Vercel functions are missing runtime-required packages:\n  ${[...unresolved].join('\n  ')}\n` +
		'Bundle them with their caller via ssr.noExternal in vite.config.ts.'
);
console.log('✓ Every runtime require() in the traced Vercel functions resolves.');

const articleCopy = isolate(realpathSync(ARTICLE_FUNCTION));
try {
	await import(pathToFileURL(path.join(articleCopy, ARTICLE_PROCESSOR)).href);
} finally {
	rmSync(articleCopy, { recursive: true, force: true });
}
console.log(
	'✓ Built article processor loads from its traced Vercel function without require(ESM).'
);
