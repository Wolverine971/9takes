#!/usr/bin/env node
// scripts/check-people-controversies.mjs

/**
 * Controversy coverage gate (runs in `pnpm lint`).
 *
 * Fails when a published people page is missing a "required" controversy from
 * docs/writing-system/people-controversies.json. "open" entries are known gaps:
 * listed with --open, never failing.
 *
 * Usage:
 *   pnpm controversies:check            # gate
 *   pnpm controversies:check -- --open  # also list open gaps (the fix queue)
 *
 * Fixing a failure: state the record plainly in the article body following
 * "Fair treatment across types" in docs/writing-system/people-profile-standard.md.
 * Adding an entry: list it as "open" first, write the section, then flip it to "required".
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
	evaluateControversies,
	loadPeopleDrafts,
	validateRegistry
} from './lib/peopleControversies.mjs';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REGISTRY_FILE = path.join(REPO_ROOT, 'docs/writing-system/people-controversies.json');
const DRAFTS_DIR = path.join(REPO_ROOT, 'src/blog/people/drafts');

const showOpen = process.argv.includes('--open');
const registry = JSON.parse(fs.readFileSync(REGISTRY_FILE, 'utf8'));

const problems = validateRegistry(registry);
if (problems.length) {
	console.error('people-controversies.json is malformed:');
	for (const p of problems) console.error(`  - ${p}`);
	process.exit(1);
}

const { failures, openGaps, covered } = evaluateControversies(
	registry,
	loadPeopleDrafts(DRAFTS_DIR)
);

if (showOpen && openGaps.length) {
	console.log(`Open controversy gaps (${openGaps.length}), not failing:`);
	for (const g of openGaps)
		console.log(`  - ${g.slug}: ${g.label}  [missing: ${g.missing.join(' | ')}]`);
	console.log('');
}

if (failures.length) {
	console.error(`Controversy coverage gate FAILED (${failures.length}):`);
	for (const f of failures) {
		const detail = f.missing ? `missing: ${f.missing.join(' | ')}` : f.reason;
		console.error(`  - ${f.slug}: ${f.label}  [${detail}]`);
	}
	console.error('\nState the record plainly in the body (see "Fair treatment across types" in');
	console.error(
		'docs/writing-system/people-profile-standard.md), or set the entry to "open" on purpose.'
	);
	process.exit(1);
}

console.log(
	`Controversy coverage OK: ${covered.length} covered, ${openGaps.length} open gap(s)` +
		(showOpen ? '' : ' (run with --open to list)')
);
