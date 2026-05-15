// scripts/audit-cluster-tags.mjs
// Lint-style audit: lists every published person (from famousTypes.ts)
// whose type[] array has no recognized cluster tag.
//
// Use after adding new people, or after pnpm gen:famous-types regenerates
// the snapshot from Supabase. Exit code is non-zero when issues are found
// so this can be wired into CI later.
//
// Run: node scripts/audit-cluster-tags.mjs

import fs from 'node:fs';

const CLUSTER_TAGS = new Set([
	'screen-icon',
	'rising-star',
	'tv-comedy-crossover',
	'celebrity-image',
	'podcaster',
	'news-commentator',
	'business-creator',
	'streamer',
	'viral-entertainer',
	'lifestyle-builder',
	'pop-star',
	'rapper',
	'alternative-artist',
	'singer-songwriter',
	'music-crossover',
	'modern-leader',
	'historical-leader',
	'movement-leader',
	'royalty',
	'political-spouse',
	'campaign-politician',
	'historical-scientist',
	'historical-artist',
	'big-tech-founder',
	'investor',
	'frontier-builder',
	'business-operator',
	'tech-interpreter',
	'stand-up',
	'sketch-comic',
	'satire-host',
	'internet-comic',
	'novelist',
	'strategy-writer',
	'business-interpreter'
]);

// Top-level category types — a person needs at least one of these to be
// placed on a category page at all.
const CATEGORY_TYPES = new Set([
	'movieStar',
	'newMovieStar',
	'celebrity',
	'creator',
	'influencer',
	'tiktoker',
	'lifestyleInfluencer',
	'journalist',
	'musician',
	'politician',
	'historical',
	'activist',
	'techie',
	'entrepreneur',
	'business',
	'comedian',
	'author',
	'psychology',
	'essay'
]);

const src = fs.readFileSync('src/lib/components/molecules/famousTypes.ts', 'utf8');
const entryRegex =
	/\{\s*name:\s*'([^']+)'[^}]*?link:\s*(true|false)[^}]*?types:\s*\[([^\]]*)\][^}]*?\}/g;

const seen = new Set();
const missingClusters = [];
const orphans = [];

let m;
while ((m = entryRegex.exec(src)) !== null) {
	const slug = m[1];
	if (seen.has(slug)) continue;
	seen.add(slug);
	if (m[2] !== 'true') continue;
	const types = (m[3].match(/'([^']+)'/g) || []).map((s) => s.replace(/'/g, ''));

	const hasCategory = types.some((t) => CATEGORY_TYPES.has(t));
	const hasCluster = types.some((t) => CLUSTER_TAGS.has(t));

	if (!hasCategory) {
		orphans.push({ slug, types });
	} else if (!hasCluster) {
		missingClusters.push({ slug, types });
	}
}

if (orphans.length > 0) {
	console.log(`\n❌ ORPHANS — published people with no category-level type (${orphans.length}):`);
	for (const p of orphans) console.log(`   ${p.slug.padEnd(30)} [${p.types.join(', ')}]`);
}

if (missingClusters.length > 0) {
	console.log(`\n⚠️  MISSING CLUSTER TAG (${missingClusters.length}):`);
	console.log('    These published people land in the "Other…" fallback bucket.');
	console.log(
		'    Add a cluster tag to their frontmatter type[] array and run pnpm push:people.\n'
	);
	for (const p of missingClusters) console.log(`   ${p.slug.padEnd(30)} [${p.types.join(', ')}]`);
}

if (orphans.length === 0 && missingClusters.length === 0) {
	console.log('✅ All published people have a category type and a cluster tag.');
	process.exit(0);
} else {
	console.log(`\nTotal issues: ${orphans.length + missingClusters.length}`);
	process.exit(1);
}
