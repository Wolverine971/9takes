// scripts/analyze-blog-jsonld.mjs
// READ-ONLY. Catalogs hand-rolled application/ld+json blocks in src/blog/**.
// Reports, per file: location (svelte:head vs body), whether it parses as JSON,
// the @types present, and whether it duplicates BlogPosting/Article (which
// BlogPageHead already emits canonically). No files are modified.

import fs from 'fs/promises';
import pkg from 'fast-glob';
const { glob } = pkg;

const SCRIPT_RE = /<script\s+type="application\/ld\+json"\s*>([\s\S]*?)<\/script>/gi;

function typesOf(node, acc) {
	if (Array.isArray(node)) {
		for (const n of node) typesOf(n, acc);
		return acc;
	}
	if (node && typeof node === 'object') {
		if (node['@type']) {
			const t = Array.isArray(node['@type']) ? node['@type'].join('+') : node['@type'];
			acc.push(t);
		}
		if (Array.isArray(node['@graph'])) for (const n of node['@graph']) typesOf(n, acc);
	}
	return acc;
}

const files = await glob('src/blog/**/*.md', { ignore: ['**/drafts/**', '**/*.bak'] });

const rows = [];
for (const file of files) {
	const content = await fs.readFile(file, 'utf-8');
	let m;
	SCRIPT_RE.lastIndex = 0;
	while ((m = SCRIPT_RE.exec(content)) !== null) {
		const raw = m[1].trim();
		const idx = m.index;
		// crude head/body detection: is the script inside a <svelte:head> region?
		const before = content.slice(0, idx);
		const lastOpen = before.lastIndexOf('<svelte:head>');
		const lastClose = before.lastIndexOf('</svelte:head>');
		const inHead = lastOpen > lastClose;

		let parsed = null;
		let valid = true;
		try {
			parsed = JSON.parse(raw);
		} catch {
			valid = false;
		}
		const types = valid ? typesOf(parsed, []) : [];
		const topLevelGraph = valid && parsed && Array.isArray(parsed['@graph']);
		rows.push({
			file: file.replace('src/blog/', ''),
			inHead,
			valid,
			graph: topLevelGraph,
			types
		});
	}
}

const dupTypes = new Set(['BlogPosting', 'Article', 'NewsArticle']);
let dupCount = 0,
	invalidCount = 0,
	hasFaq = 0;
const typeTally = {};

for (const r of rows) {
	const hasDup = r.types.some((t) => t.split('+').some((x) => dupTypes.has(x)));
	if (hasDup) dupCount++;
	if (!r.valid) invalidCount++;
	if (r.types.some((t) => t.includes('FAQPage'))) hasFaq++;
	for (const t of r.types) typeTally[t] = (typeTally[t] || 0) + 1;
}

console.log(`\n=== Blog JSON-LD analysis: ${rows.length} ld+json blocks across ${files.length} files ===`);
console.log(`In <svelte:head>: ${rows.filter((r) => r.inHead).length} | in body: ${rows.filter((r) => !r.inHead).length}`);
console.log(`Invalid JSON (cannot auto-edit safely): ${invalidCount}`);
console.log(`Blocks with duplicate BlogPosting/Article: ${dupCount}`);
console.log(`Blocks containing a unique FAQPage (must preserve): ${hasFaq}`);
console.log(`\n@type tally:`);
for (const [t, n] of Object.entries(typeTally).sort((a, b) => b[1] - a[1])) console.log(`  ${n.toString().padStart(3)}  ${t}`);

console.log(`\n=== Invalid-JSON blocks (need manual handling) ===`);
const bad = rows.filter((r) => !r.valid);
if (bad.length === 0) console.log('  (none — all blocks parse cleanly)');
else for (const r of bad) console.log(`  ${r.file}`);

console.log(`\n=== Blocks that are BlogPosting/Article ONLY (no FAQPage to preserve → whole script can be removed) ===`);
const dupOnly = rows.filter(
	(r) => r.valid && r.types.length > 0 && r.types.every((t) => t.split('+').some((x) => dupTypes.has(x)) || t === 'Person' || t === 'Organization' || t === 'ImageObject' || t === 'WebPage')
		&& !r.types.some((t) => t.includes('FAQPage'))
);
console.log(`  count: ${dupOnly.length}`);
for (const r of dupOnly.slice(0, 50)) console.log(`  ${r.file}  [${r.types.join(', ')}]`);
