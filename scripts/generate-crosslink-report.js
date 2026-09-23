// scripts/generate-crosslink-report.js

/**
 * Blog cross-link report + link-opportunity queue.
 *
 * Writes:
 *   docs/BLOG-CROSSLINK-INDEX.md            human report (live posts only, drafts listed separately)
 *   docs/crosslinks/link-opportunities.json queue for the /crosslink-queue agent
 *   docs/crosslinks/link-opportunities.md   same queue, readable
 *
 * Liveness mirrors the SvelteKit routes (see scripts/lib/blogLinkGraph.js), links to the
 * 9 type pages and to personality-analysis pages count, and Search Console data
 * (docs/data/gsc/latest.json) ranks what is worth linking.
 *
 * Usage:
 *   pnpm gen:crosslinks                                   # write report + queue
 *   pnpm gen:crosslinks -- --target <url|file>            # print link ideas INTO one page (no writes)
 *   pnpm gen:crosslinks -- --source <url|file>            # print link ideas FROM one page (no writes)
 *   pnpm gen:crosslinks -- --target <url> --limit 20
 */

import fs from 'node:fs';
import path from 'node:path';
import {
	REPO_ROOT,
	buildLinkGraph,
	isTypePage,
	loadBlogCorpus,
	loadEnneagramRedirects,
	loadGsc,
	loadPeople,
	normalizeInternalHref,
	sectionOf
} from './lib/blogLinkGraph.js';
import {
	MIN_MENTION_SCORE,
	diversify,
	findBridgeHosts,
	findOpportunities
} from './lib/crosslinkOpportunities.js';
import { GATE_THRESHOLDS, loadBaseline } from './lib/crosslinkGate.js';

const REPORT_FILE = path.join(REPO_ROOT, 'docs/BLOG-CROSSLINK-INDEX.md');
const CROSSLINK_DIR = path.join(REPO_ROOT, 'docs/crosslinks');
const QUEUE_JSON = path.join(CROSSLINK_DIR, 'link-opportunities.json');
const QUEUE_MD = path.join(CROSSLINK_DIR, 'link-opportunities.md');
const PHRASES_FILE = path.join(CROSSLINK_DIR, 'target-phrases.json');
const SKIPPED_FILE = path.join(CROSSLINK_DIR, 'skipped.json');

const args = process.argv.slice(2);
const argValue = (name) => {
	const index = args.indexOf(name);
	return index === -1 ? null : (args[index + 1] ?? null);
};
const TARGET_ARG = argValue('--target');
const SOURCE_ARG = argValue('--source');
const LIMIT = Number(argValue('--limit')) || null;

const today = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
const esc = (value) =>
	String(value ?? '')
		.replace(/\|/g, '\\|')
		.replace(/\n/g, ' ');
const short = (value, max = 70) => {
	const text = String(value ?? '');
	return text.length > max ? `${text.slice(0, max - 1)}…` : text;
};
const fmt = (n) => (n == null ? '—' : Number(n).toLocaleString('en-US'));
const pos = (n) => (n == null ? '—' : Number(n).toFixed(1));

function readJson(file, fallback) {
	try {
		return JSON.parse(fs.readFileSync(file, 'utf8'));
	} catch {
		return fallback;
	}
}

function resolvePageArg(value, posts) {
	if (!value) return null;
	const asUrl = normalizeInternalHref(value);
	if (asUrl) return asUrl;
	const rel = value.replace(/^\.?\/?src\/blog\//, '');
	const post = posts.find((p) => p.rel === rel || `src/blog/${p.rel}` === value);
	if (post?.url) return post.url;
	throw new Error(`Could not resolve "${value}" to a live page URL or src/blog file`);
}

// ---------------------------------------------------------------------------

const redirects = loadEnneagramRedirects();
const posts = loadBlogCorpus({ redirects });
const people = loadPeople();
const graph = buildLinkGraph({ posts, people, redirects });
const gsc = loadGsc();
const curated = Object.fromEntries(
	Object.entries(readJson(PHRASES_FILE, {})).filter(([key]) => key.startsWith('/'))
);
const skipped = new Set((readJson(SKIPPED_FILE, { skipped: [] }).skipped ?? []).map((s) => s.id));

const liveNodes = [...graph.values()].filter((n) => n.kind !== 'person');
const blogNodes = liveNodes.filter((n) => n.kind === 'blog');
const personNodes = [...graph.values()].filter((n) => n.kind === 'person');
const stats = (url) => gsc?.pages.get(url) ?? null;

// ---- one-off lookups -------------------------------------------------------
if (TARGET_ARG || SOURCE_ARG) {
	const onlyTarget = resolvePageArg(TARGET_ARG, posts);
	const onlySource = resolvePageArg(SOURCE_ARG, posts);
	const node = graph.get(onlyTarget ?? onlySource);
	if (!node) {
		console.error(
			`Not a live page: ${onlyTarget ?? onlySource} (unpublished drafts are not in the graph)`
		);
		process.exit(1);
	}
	const found = findOpportunities({ graph, posts, gsc, curated, skipped, onlyTarget, onlySource });
	console.log(`\n${node.title ?? node.url}\n${node.url}`);
	console.log(
		`in: ${node.inCount} (blog ${node.inBlog.size}, people ${node.inPeople.size})  out: ${node.outCount}`
	);
	console.log(`gate: needs ${GATE_THRESHOLDS.minIn}+ in and ${GATE_THRESHOLDS.minOut}+ out\n`);
	if (!found.length)
		console.log('No unlinked mentions found. Write a bridging sentence in a related post.');
	for (const o of found.slice(0, LIMIT ?? 15)) {
		const other = onlyTarget
			? `${o.source.file}:${o.line}`
			: `→ ${o.target.url}  (${o.source.file}:${o.line})`;
		console.log(`[${o.score}] ${other}\n    anchor "${o.anchor}" — ${o.excerpt}\n`);
	}
	process.exit(0);
}

// ---- health ----------------------------------------------------------------
const isolated = blogNodes.filter((n) => n.inCount === 0 && n.outCount === 0);
const zeroIn = blogNodes.filter((n) => n.inCount === 0);
const zeroOut = blogNodes.filter((n) => n.outCount === 0);
const belowGate = blogNodes.filter(
	(n) => n.inCount < GATE_THRESHOLDS.minIn || n.outCount < GATE_THRESHOLDS.minOut
);
const broken = liveNodes.flatMap((n) => n.broken.map((to) => ({ from: n.url, to })));
const viaRedirect = liveNodes.flatMap((n) => n.viaRedirect.map((r) => ({ from: n.url, ...r })));
// People pages live in the database; their local drafts mirror it. Fix in the draft, then
// `pnpm push:people -- <Person> --sync` (see CLAUDE.md) — never edit the DB by hand.
const peopleBroken = personNodes.flatMap((n) =>
	[...n.broken, ...n.viaRedirect.map((r) => r.url)].map((to) => ({
		from: n.url,
		file: n.person.draftFile,
		to
	}))
);
const baseline = loadBaseline();
const grandfathered = new Set(Object.keys(baseline?.grandfathered ?? {}));
const newGateFailures = belowGate.filter((n) => !grandfathered.has(n.url));

// ---- section flow ----------------------------------------------------------
const FROM = ['enneagram-corner', 'community', 'how-to-guides', 'pop-culture'];
const TO = [...FROM, 'people'];
const flow = Object.fromEntries(FROM.map((f) => [f, Object.fromEntries(TO.map((t) => [t, 0]))]));
for (const node of liveNodes) {
	for (const to of [...node.outBlog, ...node.outPeople]) flow[node.section][sectionOf(to)] += 1;
}
const postsPerSection = Object.fromEntries(
	FROM.map((f) => [f, liveNodes.filter((n) => n.section === f).length])
);
const medianIn = (section) => {
	const values = liveNodes
		.filter((n) => n.section === section && !isTypePage(n.url))
		.map((n) => n.inCount)
		.sort((a, b) => a - b);
	return values.length ? values[Math.floor(values.length / 2)] : 0;
};

// ---- opportunities ---------------------------------------------------------
// Weak single-word mentions (score 1) are only offered for gate debt, where any
// natural link beats a bridging sentence; the ranked lists keep the higher bar.
const all = findOpportunities({ graph, posts, gsc, curated, skipped, minScore: 1 });
const strong = all.filter((o) => o.mentionScore >= MIN_MENTION_SCORE);
const blogOpps = strong.filter((o) => o.target.kind !== 'person');
const personOpps = strong.filter((o) => o.target.kind === 'person');

const gateDebt = belowGate
	.sort((a, b) => (stats(b.url)?.impressions ?? 0) - (stats(a.url)?.impressions ?? 0))
	.map((node) => {
		const needIn = Math.max(0, GATE_THRESHOLDS.minIn - node.inCount);
		const needOut = Math.max(0, GATE_THRESHOLDS.minOut - node.outCount);
		const inbound = needIn ? all.filter((o) => o.target.url === node.url).slice(0, needIn + 2) : [];
		const outbound = needOut
			? all.filter((o) => o.source.url === node.url).slice(0, needOut + 2)
			: [];
		const bridgeHosts = inbound.length < needIn ? findBridgeHosts(graph, node.url, 3) : [];
		return {
			url: node.url,
			title: node.title,
			file: `src/blog/${node.post.rel}`,
			inCount: node.inCount,
			outCount: node.outCount,
			needIn,
			needOut,
			grandfathered: grandfathered.has(node.url),
			inbound,
			outbound,
			bridgeHosts
		};
	});

const topBlog = diversify(blogOpps, { limit: 40, perTarget: 3, perSource: 3 });
const peopleBridge = diversify(personOpps, { limit: 30, perTarget: 2, perSource: 3 });

const queue = {
	generatedAt: today(),
	gsc: gsc ? { runDate: gsc.runDate, window: gsc.window } : null,
	thresholds: GATE_THRESHOLDS,
	counts: {
		candidates: all.length,
		gateDebt: gateDebt.length,
		topBlog: topBlog.length,
		peopleBridge: peopleBridge.length,
		skipped: skipped.size
	},
	gateDebt,
	topBlog,
	peopleBridge
};

// ---- markdown helpers ------------------------------------------------------
const oppRow = (o) =>
	`| ${o.score} | \`${o.source.url}\` (L${o.line}) | \`${o.target.url}\` | "${esc(short(o.anchor, 40))}" | ${esc(short(o.excerpt, 140))} |`;
const oppTable = (rows) =>
	rows.length
		? `| Score | Source (line) | Target | Anchor | Sentence |\n|---|---|---|---|---|\n${rows.map(oppRow).join('\n')}\n`
		: '_None found._\n';

// ---- report ----------------------------------------------------------------
const statusCounts = posts.reduce(
	(acc, p) => ((acc[p.status] = (acc[p.status] ?? 0) + 1), acc),
	{}
);
const linksBlog = liveNodes.reduce((sum, n) => sum + n.outBlog.length, 0);
const linksPeople = liveNodes.reduce((sum, n) => sum + n.outPeople.length, 0);

let md = `# Blog Cross-Link Index

_Generated: ${today()} by \`pnpm gen:crosslinks\` (scripts/generate-crosslink-report.js)_
_Search data: ${gsc ? `GSC ${gsc.window.startDate} → ${gsc.window.endDate} (pulled ${gsc.runDate})` : 'none (docs/data/gsc/latest.json missing)'}_

**Scope.** Link counts cover **live posts only**: files a route actually serves with \`published: true\`
(the same rule the \`[slug]\` loaders use). Links to the 9 type pages and to personality-analysis pages count.
"In" = unique live blog posts + people pages linking to the page. Drafts, redirects, research notes and
social variants are listed separately at the bottom and never inflate the health numbers.

Link ideas to act on: [\`docs/crosslinks/link-opportunities.md\`](crosslinks/link-opportunities.md)
(worked weekly by \`/crosslink-queue\`). Publish gate: \`pnpm crosslinks:check\`
(every live post needs ${GATE_THRESHOLDS.minIn}+ in and ${GATE_THRESHOLDS.minOut}+ out; older gaps are grandfathered in \`docs/crosslinks/baseline.json\`).

---

## Health (live posts)

| Metric | Count |
|---|---|
| Live blog posts | ${blogNodes.length} (+ ${liveNodes.length - blogNodes.length} type pages) |
| Published people pages | ${personNodes.length} |
| Completely isolated (0 in, 0 out) | ${isolated.length} |
| 0 incoming | ${zeroIn.length} |
| 0 outgoing | ${zeroOut.length} |
| Below gate (<${GATE_THRESHOLDS.minIn} in or <${GATE_THRESHOLDS.minOut} out) | ${belowGate.length} (${newGateFailures.length} not grandfathered) |
| Broken internal links (live post → non-live page) | ${broken.length} |
| Links that go through a 301 | ${viaRedirect.length} |
| Broken/redirected links on people pages (draft mirror) | ${peopleBroken.length} |
| Body links: blog → blog / blog → people | ${fmt(linksBlog)} / ${fmt(linksPeople)} |

`;

if (zeroIn.length || zeroOut.length) {
	md += `**Zero-link posts:** ${[...new Set([...zeroIn, ...zeroOut])]
		.map((n) => `\`${n.url}\` (in ${n.inCount}, out ${n.outCount})`)
		.join(', ')}\n\n`;
}
if (broken.length) {
	md += `### Broken internal links\n\n| From | To |\n|---|---|\n${broken.map((b) => `| \`${b.from}\` | \`${b.to}\` |`).join('\n')}\n\n`;
}
if (peopleBroken.length) {
	md += `### Broken or redirected links on people pages\n\nFix in the draft, then sync with \`pnpm push:people -- <Person> --sync\`.\n\n| Draft | Linked |\n|---|---|\n${peopleBroken
		.map((b) => `| \`${b.file ?? b.from}\` | \`${b.to}\` |`)
		.join('\n')}\n\n`;
}
if (viaRedirect.length) {
	md += `### Links through a 301 (point them at the final URL)\n\n| From | Linked | Redirects to |\n|---|---|---|\n${viaRedirect
		.map((r) => `| \`${r.from}\` | \`${r.url}\` | \`${r.to}\` |`)
		.join('\n')}\n\n`;
}

md += `---

## Section flow

Where body links go. Rows = linking section, columns = linked section.

| From \\ To | ${TO.join(' | ')} | Stays in section | Posts | Median in |
|---|${TO.map(() => '---').join('|')}|---|---|---|
${FROM.map((f) => {
	const total = TO.reduce((sum, t) => sum + flow[f][t], 0);
	const stay = total ? Math.round((flow[f][f] / total) * 100) : 0;
	return `| ${f} | ${TO.map((t) => fmt(flow[f][t])).join(' | ')} | ${stay}% | ${postsPerSection[f]} | ${medianIn(f)} |`;
}).join('\n')}

---

## Under-linked pages with search demand

Live posts at Google position 4–30 with 1,000+ impressions, sorted by how few links they get
relative to demand. These are where an internal link is most likely to move a ranking.

| Page | Impressions | Clicks | Position | In | Out |
|---|---|---|---|---|---|
${blogNodes
	.map((n) => ({ n, s: stats(n.url) }))
	.filter(({ s }) => s && s.impressions >= 1000 && s.position >= 4 && s.position <= 30)
	.sort((a, b) => b.s.impressions / (1 + b.n.inCount) - a.s.impressions / (1 + a.n.inCount))
	.slice(0, 25)
	.map(
		({ n, s }) =>
			`| \`${n.url}\` | ${fmt(s.impressions)} | ${fmt(s.clicks)} | ${pos(s.position)} | ${n.inCount} | ${n.outCount} |`
	)
	.join('\n')}

## Dead ends with traffic

Live posts with 3 or fewer outgoing links, sorted by impressions. Readers land here and have nowhere to go.

| Page | Impressions | Clicks | Out | In |
|---|---|---|---|---|
${blogNodes
	.filter((n) => n.outCount <= 3)
	.sort((a, b) => (stats(b.url)?.impressions ?? 0) - (stats(a.url)?.impressions ?? 0))
	.slice(0, 20)
	.map(
		(n) =>
			`| \`${n.url}\` | ${fmt(stats(n.url)?.impressions)} | ${fmt(stats(n.url)?.clicks)} | ${n.outCount} | ${n.inCount} |`
	)
	.join('\n')}

## People bridge

People pages by search impressions and how many **blog posts** link to them in prose
(the FamousTypes block on type pages links every person, but that is not a contextual link).
${personNodes.filter((n) => n.inBlog.size > 0).length} of ${personNodes.length} people pages have at least one blog link.

| Person | Impressions | Clicks | Position | Blog links in | People links in |
|---|---|---|---|---|---|
${personNodes
	.filter((n) => stats(n.url))
	.sort((a, b) => stats(b.url).impressions - stats(a.url).impressions)
	.slice(0, 25)
	.map(
		(n) =>
			`| [${esc(n.title)}](${n.url}) | ${fmt(stats(n.url).impressions)} | ${fmt(stats(n.url).clicks)} | ${pos(stats(n.url).position)} | ${n.inBlog.size} | ${n.inPeople.size} |`
	)
	.join('\n')}

---

## Hubs

| In | Out | Impressions | Page |
|---|---|---|---|
${[...liveNodes]
	.sort((a, b) => b.inCount - a.inCount)
	.slice(0, 15)
	.map((n) => `| ${n.inCount} | ${n.outCount} | ${fmt(stats(n.url)?.impressions)} | \`${n.url}\` |`)
	.join('\n')}

---

## Not live (excluded from every number above)

| Status | Files | Meaning |
|---|---|---|
| draft | ${statusCounts.draft ?? 0} | Routable, \`published\` is false |
| redirected | ${statusCounts.redirected ?? 0} | Unpublished and the route 301s the slug to a newer post |
| no-frontmatter | ${statusCounts['no-frontmatter'] ?? 0} | Routable folder but no frontmatter (notes); 404s |
| excluded | ${statusCounts.excluded ?? 0} | Social variants and notes the route globs skip (\`.instagram/.twitter/.reddit/.review\`, \`-twitter\`) |
| not-routable | ${statusCounts['not-routable'] ?? 0} | Folders no route serves (templates, research notes) |

### Drafts

Unpublished posts in routable folders. Word count ≥2,500 with links already in place usually means close to done.

| Words | Date | Links out | Title | File |
|---|---|---|---|---|
${posts
	.filter((p) => p.status === 'draft')
	.sort((a, b) => b.words - a.words)
	.map((p) => {
		const live = p.links.filter((l) => graph.has(l.url)).length;
		return `| ${fmt(p.words)} | ${p.date ?? '—'} | ${live} | ${esc(short(p.title))} | \`${p.rel}\` |`;
	})
	.join('\n')}

### Redirected (superseded)

${posts
	.filter((p) => p.status === 'redirected')
	.map((p) => `- \`${p.rel}\` → \`${p.redirectTo}\``)
	.join('\n')}

### No frontmatter / not routable

${posts
	.filter((p) => p.status === 'no-frontmatter' || p.status === 'not-routable')
	.map((p) => `- \`${p.rel}\` (${p.status})`)
	.join('\n')}

---

## Complete live index

Sorted by impressions. In = blog + people pages linking in. Out = links to live blog + people pages.

| Impr. | Pos. | In (blog/people) | Out (blog/people) | Title | Page |
|---|---|---|---|---|---|
${[...liveNodes]
	.sort(
		(a, b) =>
			(stats(b.url)?.impressions ?? 0) - (stats(a.url)?.impressions ?? 0) || b.inCount - a.inCount
	)
	.map((n) => {
		const s = stats(n.url);
		return `| ${fmt(s?.impressions)} | ${pos(s?.position)} | ${n.inCount} (${n.inBlog.size}/${n.inPeople.size}) | ${n.outCount} (${n.outBlog.length}/${n.outPeople.length}) | ${esc(short(n.title))} | \`${n.url}\` |`;
	})
	.join('\n')}
`;

// ---- queue markdown ----------------------------------------------------------
let qmd = `# Link Opportunities

_Generated: ${today()} by \`pnpm gen:crosslinks\`. Worked by \`/crosslink-queue\`._
_Search data: ${gsc ? `GSC ${gsc.window.startDate} → ${gsc.window.endDate}` : 'none'}. ${strong.length} candidate links found (+${all.length - strong.length} weaker ones offered only for gate debt); ${skipped.size} suppressed in \`docs/crosslinks/skipped.json\`._

Each row is a sentence in a live post that already talks about another page without linking to it.
Score = target's search demand × link deficit × mention strength × source visibility (cross-section links get a bonus).
Line numbers are file lines at generation time; match on the sentence if the file has changed.

## 1. Gate debt (${gateDebt.length} posts below ${GATE_THRESHOLDS.minIn} in / ${GATE_THRESHOLDS.minOut} out)

Sorted by impressions. ${newGateFailures.length} of these are NOT grandfathered and fail \`pnpm crosslinks:check\`.

`;
for (const debt of gateDebt.slice(0, 40)) {
	qmd += `### \`${debt.url}\` — in ${debt.inCount}, out ${debt.outCount}${debt.grandfathered ? '' : ' — **failing gate**'}\n\n`;
	if (debt.needIn) {
		qmd += `Needs ${debt.needIn} more inbound link(s).\n\n`;
		if (debt.inbound.length) qmd += oppTable(debt.inbound);
		if (debt.bridgeHosts.length) {
			const hosts = debt.bridgeHosts
				.map((h) => `\`${h.url}\` (${h.reasons.join(', ') || 'related'})`)
				.join('; ');
			qmd += `${debt.inbound.length ? '\n' : ''}Best hosts for one bridging sentence: ${hosts}\n`;
		} else if (!debt.inbound.length) {
			qmd += '_No unlinked mentions and no obvious host post._\n';
		}
		qmd += '\n';
	}
	if (debt.needOut) {
		qmd += `Needs ${debt.needOut} more outbound link(s).\n\n`;
		qmd += debt.outbound.length
			? oppTable(debt.outbound)
			: '_No matched mentions. Link the type pages or posts this piece already discusses._\n';
		qmd += '\n';
	}
}
if (gateDebt.length > 40)
	qmd += `_…and ${gateDebt.length - 40} more in link-opportunities.json._\n\n`;

qmd += `## 2. Highest-value blog links

${oppTable(topBlog)}
## 3. People bridge (blog → personality-analysis)

${oppTable(peopleBridge)}`;

fs.mkdirSync(CROSSLINK_DIR, { recursive: true });
fs.writeFileSync(REPORT_FILE, md);
fs.writeFileSync(QUEUE_JSON, `${JSON.stringify(queue, null, '\t')}\n`);
fs.writeFileSync(QUEUE_MD, qmd);

console.log(`✅ ${path.relative(REPO_ROOT, REPORT_FILE)}`);
console.log(`✅ ${path.relative(REPO_ROOT, QUEUE_MD)} (+ .json)`);
console.log(
	`   live posts ${blogNodes.length} | isolated ${isolated.length} | 0-in ${zeroIn.length} | 0-out ${zeroOut.length} | below gate ${belowGate.length} (${newGateFailures.length} not grandfathered) | broken ${broken.length}`
);
console.log(
	`   opportunities ${all.length} | gate debt ${gateDebt.length} | top blog ${topBlog.length} | people bridge ${peopleBridge.length}`
);
