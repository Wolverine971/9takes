// scripts/lib/crosslinkGate.js

/**
 * Cross-link publish gate. A live blog post needs GATE_THRESHOLDS.minIn inbound
 * links (from live blog posts or people pages) and minOut outbound links (to live
 * blog posts or people pages). Posts that were already below the bar when the
 * gate shipped are grandfathered in docs/crosslinks/baseline.json and may not get
 * worse; the baseline only shrinks (ratchet). Broken internal links always fail.
 */

import fs from 'node:fs';
import path from 'node:path';
import { REPO_ROOT, isTypePage } from './blogLinkGraph.js';

export const GATE_THRESHOLDS = Object.freeze({ minIn: 3, minOut: 3 });
export const BASELINE_FILE = path.join(REPO_ROOT, 'docs/crosslinks/baseline.json');

export function loadBaseline(file = BASELINE_FILE) {
	if (!fs.existsSync(file)) return null;
	return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export function saveBaseline(baseline, file = BASELINE_FILE) {
	const sorted = Object.fromEntries(
		Object.entries(baseline.grandfathered).sort(([a], [b]) => a.localeCompare(b))
	);
	fs.mkdirSync(path.dirname(file), { recursive: true });
	fs.writeFileSync(file, `${JSON.stringify({ ...baseline, grandfathered: sorted }, null, '\t')}\n`);
}

function belowBar(node, thresholds) {
	return node.inCount < thresholds.minIn || node.outCount < thresholds.minOut;
}

/**
 * Evaluate the graph against the gate.
 * Returns { failures, regressions, broken, improved, grandfatheredCount }.
 */
export function evaluateGate(graph, baseline, thresholds = GATE_THRESHOLDS) {
	const grandfathered = baseline?.grandfathered ?? {};
	const posts = [...graph.values()].filter((n) => n.kind === 'blog' && !isTypePage(n.url));
	const failures = [];
	const regressions = [];
	const improved = [];

	for (const node of posts) {
		const entry = grandfathered[node.url];
		const below = belowBar(node, thresholds);
		if (below && !entry) {
			failures.push(node);
		} else if (entry && (node.inCount < entry.in || node.outCount < entry.out)) {
			regressions.push({ node, entry });
		} else if (entry && !below) {
			improved.push(node);
		}
	}

	const broken = [...graph.values()]
		.filter((n) => n.kind !== 'person')
		.flatMap((n) => n.broken.map((to) => ({ from: n.url, file: `src/blog/${n.post.rel}`, to })));

	return {
		failures,
		regressions,
		broken,
		improved,
		grandfatheredCount: Object.keys(grandfathered).length
	};
}

/**
 * Ratchet: drop entries that now pass (or whose post is no longer live) and
 * raise recorded counts to current values. Never adds entries.
 */
export function tightenBaseline(graph, baseline) {
	const next = { ...baseline, grandfathered: {} };
	for (const [url, entry] of Object.entries(baseline.grandfathered)) {
		const node = graph.get(url);
		if (!node || node.kind !== 'blog') continue;
		if (!belowBar(node, baseline.thresholds ?? GATE_THRESHOLDS)) continue;
		next.grandfathered[url] = {
			in: Math.max(entry.in, node.inCount),
			out: Math.max(entry.out, node.outCount)
		};
	}
	return next;
}

export function grandfatherEntry(node) {
	return { in: node.inCount, out: node.outCount };
}
