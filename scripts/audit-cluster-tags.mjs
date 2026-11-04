// scripts/audit-cluster-tags.mjs
// Lists published people (from the famousTypes.ts snapshot of the database) who
// have no cluster tag for the field they're filed under, so they land in "More"
// on their type hub card and "Other …" on the category page. Field and tag rules
// come from src/lib/personClusterTags.js, the same ones the blog pipeline checks.
//
// Fix: add a tag with scripts/add-cluster-tags.mjs, then push it live with
// scripts/push-cluster-tags.mjs (type is protected from the normal people sync).
// Exit code is non-zero when issues are found.
//
// Run: pnpm audit:cluster-tags  (after pnpm gen:famous-types for fresh data)

import fs from 'node:fs';
import { getMissingClusterField, getPrimaryField } from '../src/lib/personClusterTags.js';

const src = fs.readFileSync('src/lib/components/molecules/famousTypes.ts', 'utf8');
const entryRegex =
	/\{\s*name:\s*'([^']+)'[^}]*?link:\s*(true|false)[^}]*?types:\s*\[([^\]]*)\][^}]*?\}/g;

const seen = new Set();
/** @type {Array<{ slug: string, types: string[] }>} */
const orphans = [];
/** @type {Array<{ slug: string, field: string, types: string[] }>} */
const missing = [];

let m;
while ((m = entryRegex.exec(src)) !== null) {
	const slug = m[1];
	if (seen.has(slug)) continue;
	seen.add(slug);
	if (m[2] !== 'true') continue;
	const types = (m[3].match(/'([^']+)'/g) || []).map((s) => s.replace(/'/g, ''));
	const field = getMissingClusterField(types, slug);
	if (getPrimaryField(types, slug) === 'other') orphans.push({ slug, types });
	else if (field) missing.push({ slug, field, types });
}

if (orphans.length > 0) {
	console.log(`\n❌ ORPHANS: published people with no field-level type (${orphans.length}):`);
	for (const p of orphans) console.log(`   ${p.slug.padEnd(30)} [${p.types.join(', ')}]`);
}

if (missing.length > 0) {
	console.log(`\n⚠️  MISSING CLUSTER TAG (${missing.length}):`);
	console.log('    These published people land in "More" / "Other …" for their field.\n');
	for (const p of missing)
		console.log(`   ${p.slug.padEnd(30)} ${p.field.padEnd(17)} [${p.types.join(', ')}]`);
}

if (orphans.length === 0 && missing.length === 0) {
	console.log('✅ Every published person has a field and a cluster tag for it.');
	process.exit(0);
} else {
	console.log(`\nTotal issues: ${orphans.length + missing.length}`);
	process.exit(1);
}
