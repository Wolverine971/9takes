#!/usr/bin/env node
// scripts/check-crosslinks.mjs

/**
 * Cross-link publish gate (runs in `pnpm lint` and CI).
 *
 * Fails when:
 *   - a live post links to a page that is not live (draft, deleted person, typo)
 *   - a live post that is NOT grandfathered has < 3 inbound or < 3 outbound links
 *   - a grandfathered post lost links since the baseline was recorded
 *   - markdown ([link](/x), **bold**) sits inside a one-paragraph QuickAnswer/Callout/InsightBox,
 *     where MDsvex renders it as literal text
 *
 * Usage:
 *   pnpm crosslinks:check
 *   pnpm crosslinks:check -- --update-baseline     # ratchet: drop fixed posts, raise counts (never adds)
 *   pnpm crosslinks:check -- --accept <url>        # grandfather one post on purpose (escape hatch)
 *   pnpm crosslinks:check -- --init-baseline       # one-time bootstrap from current state
 *
 * Fixing a failure: `pnpm gen:crosslinks -- --target <url>` lists sentences in other posts
 * that already mention the page; `--source <url>` lists outbound ideas.
 */

import {
	buildLinkGraph,
	loadBlogCorpus,
	loadEnneagramRedirects,
	loadPeople,
	normalizeInternalHref
} from './lib/blogLinkGraph.js';
import {
	BASELINE_FILE,
	GATE_THRESHOLDS,
	evaluateGate,
	grandfatherEntry,
	loadBaseline,
	saveBaseline,
	tightenBaseline
} from './lib/crosslinkGate.js';

const args = process.argv.slice(2);
const has = (flag) => args.includes(flag);
const valueOf = (flag) => {
	const index = args.indexOf(flag);
	return index === -1 ? null : args[index + 1];
};

const redirects = loadEnneagramRedirects();
const graph = buildLinkGraph({
	posts: loadBlogCorpus({ redirects }),
	people: loadPeople(),
	redirects
});
const blogPosts = [...graph.values()].filter((n) => n.kind === 'blog');

if (has('--init-baseline')) {
	if (loadBaseline()) {
		console.error(
			`Baseline already exists at ${BASELINE_FILE}. Use --update-baseline to ratchet it.`
		);
		process.exit(1);
	}
	const grandfathered = {};
	for (const node of blogPosts) {
		if (node.inCount < GATE_THRESHOLDS.minIn || node.outCount < GATE_THRESHOLDS.minOut) {
			grandfathered[node.url] = grandfatherEntry(node);
		}
	}
	saveBaseline({
		createdAt: new Date().toISOString().slice(0, 10),
		thresholds: GATE_THRESHOLDS,
		grandfathered
	});
	console.log(`Baseline created: ${Object.keys(grandfathered).length} posts grandfathered.`);
	process.exit(0);
}

let baseline = loadBaseline();
if (!baseline) {
	console.error(`No baseline at ${BASELINE_FILE}. Run: pnpm crosslinks:check -- --init-baseline`);
	process.exit(1);
}

if (has('--accept')) {
	const url = normalizeInternalHref(valueOf('--accept') ?? '');
	const node = url && graph.get(url);
	if (!node || node.kind !== 'blog') {
		console.error(`--accept needs a live blog post URL (got "${valueOf('--accept')}")`);
		process.exit(1);
	}
	baseline.grandfathered[url] = grandfatherEntry(node);
	saveBaseline(baseline);
	console.log(`Grandfathered ${url} at in ${node.inCount}, out ${node.outCount}.`);
	process.exit(0);
}

if (has('--update-baseline')) {
	const before = Object.keys(baseline.grandfathered).length;
	baseline = tightenBaseline(graph, baseline);
	saveBaseline(baseline);
	console.log(
		`Baseline ratcheted: ${before} → ${Object.keys(baseline.grandfathered).length} grandfathered posts.`
	);
}

const { failures, regressions, broken, unrendered, improved, grandfatheredCount } = evaluateGate(
	graph,
	baseline
);
const { minIn, minOut } = GATE_THRESHOLDS;
let failed = false;

if (broken.length) {
	failed = true;
	console.error(`\n✖ ${broken.length} broken internal link(s) in live posts:`);
	for (const b of broken) console.error(`  ${b.file}: ${b.to}`);
}

if (unrendered.length) {
	failed = true;
	console.error(
		`\n✖ ${unrendered.length} markdown snippet(s) inside a one-paragraph callout render as literal text.`
	);
	console.error(
		'  Use HTML there (<a href="/...">, <strong>) or put blank lines inside the block:'
	);
	for (const u of unrendered) console.error(`  ${u.file}:${u.line}  ${u.text}`);
}

if (failures.length) {
	failed = true;
	console.error(
		`\n✖ ${failures.length} live post(s) below the cross-link bar (${minIn}+ in, ${minOut}+ out):`
	);
	for (const node of failures) {
		console.error(
			`  ${node.url}  in ${node.inCount}, out ${node.outCount}  (src/blog/${node.post.rel})`
		);
		if (node.inCount < minIn) console.error(`    → pnpm gen:crosslinks -- --target ${node.url}`);
		if (node.outCount < minOut) console.error(`    → pnpm gen:crosslinks -- --source ${node.url}`);
	}
}

if (regressions.length) {
	failed = true;
	console.error(`\n✖ ${regressions.length} grandfathered post(s) lost links:`);
	for (const { node, entry, dims } of regressions) {
		console.error(`  (${dims.join(' + ')} below the bar and worse than recorded)`);
		console.error(
			`  ${node.url}  in ${entry.in}→${node.inCount}, out ${entry.out}→${node.outCount}`
		);
	}
}

if (improved.length) {
	console.log(
		`\n↑ ${improved.length} grandfathered post(s) now pass. Lock it in: pnpm crosslinks:check -- --update-baseline`
	);
}

if (failed) {
	console.error('\nCross-link gate failed.');
	process.exit(1);
}
console.log(
	`✓ Cross-link gate: ${blogPosts.length} live posts, 0 broken links, ${grandfatheredCount} grandfathered below the bar.`
);
