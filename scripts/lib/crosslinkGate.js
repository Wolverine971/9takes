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
/**
 * A grandfathered post only has its FAILING dimension frozen. A dimension regresses
 * when it is below the bar now AND either it was at/above the bar when recorded (a
 * new failure) or it dropped below its recorded count. A dimension at/above the bar
 * is free to move, so trimming links on the healthy side never fails CI.
 */
function regressedDimensions(node, entry, thresholds) {
	const dims = [
		['in', node.inCount, entry.in, thresholds.minIn],
		['out', node.outCount, entry.out, thresholds.minOut]
	];
	return dims
		.filter(([, now, recorded, min]) => now < min && (recorded >= min || now < recorded))
		.map(([name]) => name);
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
		if (!entry) {
			if (below) failures.push(node);
		} else if (!below) {
			improved.push(node);
		} else {
			const dims = regressedDimensions(node, entry, thresholds);
			if (dims.length) regressions.push({ node, entry, dims });
		}
	}

	const broken = [...graph.values()]
		.filter((n) => n.kind !== 'person')
		.flatMap((n) => n.broken.map((to) => ({ from: n.url, file: `src/blog/${n.post.rel}`, to })));

	// Markdown inside a one-paragraph callout renders as literal text, and any link
	// there is counted by the graph but invisible to readers.
	const unrendered = posts.flatMap((n) =>
		(n.post.unrenderedMarkdown ?? []).map((hit) => ({
			file: `src/blog/${n.post.rel}`,
			line: hit.line + (n.post.bodyLineOffset ?? 0),
			text: hit.text
		}))
	);

	return {
		failures,
		regressions,
		broken,
		unrendered,
		improved,
		grandfatheredCount: Object.keys(grandfathered).length
	};
}

/**
 * Ratchet: drop entries that now pass (or whose post is no longer live). For a
 * dimension still below the bar, keep the higher of recorded and current (so a
 * regression stays visible); a dimension at/above the bar just records current.
 * Never adds entries.
 */
export function tightenBaseline(graph, baseline, thresholds = GATE_THRESHOLDS) {
	const next = { ...baseline, thresholds, grandfathered: {} };
	for (const [url, entry] of Object.entries(baseline.grandfathered)) {
		const node = graph.get(url);
		if (!node || node.kind !== 'blog') continue;
		if (!belowBar(node, thresholds)) continue;
		next.grandfathered[url] = {
			in: node.inCount < thresholds.minIn ? Math.max(entry.in, node.inCount) : node.inCount,
			out: node.outCount < thresholds.minOut ? Math.max(entry.out, node.outCount) : node.outCount
		};
	}
	return next;
}

export function grandfatherEntry(node) {
	return { in: node.inCount, out: node.outCount };
}
