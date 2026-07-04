// scripts/audit-orphan-blogs.mjs
// READ-ONLY. Finds published, file-based blog posts that are orphaned or
// near-orphaned (0-1 inbound internal links from other blog posts). Orphans
// bleed crawl budget and PageRank because nothing points to them. Cross-
// references GSC impressions when available so fixes can be prioritized.

import fs from 'fs/promises';
import pkg from 'fast-glob';
import matter from 'gray-matter';
const { glob } = pkg;

const files = await glob('src/blog/**/*.md', { ignore: ['**/drafts/**', '**/*.bak'] });

// Build the published set: slug + loc + path.
const posts = [];
const allContent = new Map();
for (const f of files) {
	const raw = await fs.readFile(f, 'utf-8');
	allContent.set(f, raw);
	const { data } = matter(raw);
	if (!data.published || !data.loc) continue;
	const loc = String(data.loc);
	const slug = loc.replace(/^https?:\/\/9takes\.com\//, '').replace(/\/$/, '');
	posts.push({ file: f, loc, slug, title: data.title || '' });
}

// Optional GSC impressions per page.
const imp = new Map();
try {
	const latest = JSON.parse(await fs.readFile('docs/data/gsc/latest.json', 'utf-8'));
	const csv = await fs.readFile(`docs/data/gsc/${latest.files.pages}`, 'utf-8');
	for (const line of csv.split('\n').slice(1)) {
		const [page, , impressions] = line.split(',');
		if (page) imp.set(page.replace(/\/$/, ''), Number(impressions) || 0);
	}
} catch {
	/* no GSC data */
}

// Count inbound links: how many OTHER blog files reference this post's slug path.
function inboundCount(slug, selfFile) {
	const needle = `/${slug.split('/').slice(1).join('/')}`; // path after section, e.g. /astrology-and-the-enneagram
	const full = slug; // e.g. enneagram-corner/astrology-and-the-enneagram
	let n = 0;
	for (const [f, content] of allContent) {
		if (f === selfFile) continue;
		if (content.includes(full) || content.includes(`/${full}`) || content.includes(needle)) n++;
	}
	return n;
}

const scored = posts
	.map((p) => ({
		...p,
		inbound: inboundCount(p.slug, p.file),
		impressions: imp.get(p.loc.replace(/\/$/, '')) ?? 0
	}))
	.sort((a, b) => a.inbound - b.inbound || b.impressions - a.impressions);

const orphans = scored.filter((p) => p.inbound === 0);
const near = scored.filter((p) => p.inbound === 1);

console.log(`\n=== Orphan blog audit: ${posts.length} published file-based posts ===`);
console.log(`Orphans (0 inbound): ${orphans.length} | near-orphans (1 inbound): ${near.length}`);

console.log(`\n=== ORPHANS (0 inbound internal links), by GSC impressions ===`);
for (const p of orphans.sort((a, b) => b.impressions - a.impressions)) {
	console.log(`  imp=${String(p.impressions).padStart(5)}  ${p.slug}`);
}

console.log(`\n=== NEAR-ORPHANS (1 inbound), top 15 by impressions ===`);
for (const p of near.sort((a, b) => b.impressions - a.impressions).slice(0, 15)) {
	console.log(`  imp=${String(p.impressions).padStart(5)}  inbound=${p.inbound}  ${p.slug}`);
}
