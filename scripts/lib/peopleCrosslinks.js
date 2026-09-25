// scripts/lib/peopleCrosslinks.js
//
// People → people link opportunities: a personality-analysis page that names
// another person with a page, in running prose, without linking them.
// Targets are people pages that need links (few contextual links in); sources
// that are already link-heavy are left alone. Used by `pnpm gen:crosslinks`.

import fs from 'node:fs';
import path from 'node:path';
import { REPO_ROOT } from './blogLinkGraph.js';
import { escapeRegExp, proseLines } from './crosslinkOpportunities.js';

export const PEOPLE_LINK_DEFAULTS = Object.freeze({
	needMaxIn: 2, // a person page "needs links" with <= 2 contextual links in (blog + people)
	fillTo: 3, // stop suggesting once a target would reach 3
	sourceOutCap: 10, // people pages run p50 5 / p90 7 internal links; 10+ is already link-heavy
	perSource: 2 // new links per source page per pass
});

// One-word names may sit inside a longer name ("J Prince", "Prince Harry").
// These words after a one-word name still refer to the person ("Jynxzi Podcast").
const OK_AFTER_ONE_WORD = /^\s(?:Podcast|Show|Live|Tour|Stream|Streams|Clips)\b/;

/**
 * First mention of `name` in `body` that can carry a link, or null.
 * Skips headings, tables, components, existing links (via proseLines), plus
 * blockquotes, bold spans, and quoted speech. `typeClaim` is set when the
 * text right after the name claims a type that disagrees with `pageType`.
 */
export function findPersonMention(body, name, pageType = null) {
	const variants = new Set([name, name.replace(/'/g, '’'), name.replace(/’/g, "'")]);
	const re = new RegExp(
		`(?<![\\w\\-/\\[])(?:${[...variants].map(escapeRegExp).join('|')})(?![\\w\\-])`
	);
	const lines = body.split('\n');
	for (const line of proseLines(body)) {
		const match = re.exec(line.masked);
		if (!match) continue;
		const raw = lines[line.line - 1];
		const before = raw.slice(0, match.index);
		const after = raw.slice(match.index + match[0].length);
		if (!name.includes(' ')) {
			if (/[A-Z][\w.]*\s$/.test(before)) continue;
			if (/^\s[A-Z]/.test(after) && !OK_AFTER_ONE_WORD.test(after)) continue;
		}
		if (/^\s*>/.test(raw)) continue;
		if ((before.match(/\*\*/g) ?? []).length % 2 === 1) continue;
		if ((before.match(/["“”]/g) ?? []).length % 2 === 1) continue;
		const claim = raw
			.slice(match.index, match.index + 90)
			.match(/\b(?:Type|type)\s*(\d)\b|\b(\d)w\d\b|\ban?\s(\d)\b/);
		const claimed = claim ? Number(claim[1] ?? claim[2] ?? claim[3]) : null;
		return {
			bodyLine: line.line,
			col: match.index,
			anchor: match[0],
			raw,
			typeClaim: claimed && pageType && claimed !== pageType ? claimed : null
		};
	}
	return null;
}

/** 1-based file line where the draft's body starts (after frontmatter). */
function bodyOffset(draftFile, body) {
	try {
		const raw = fs.readFileSync(path.join(REPO_ROOT, draftFile), 'utf8');
		const at = raw.indexOf(body.slice(0, 200));
		return at > 0 ? raw.slice(0, at).split('\n').length - 1 : 0;
	} catch {
		return 0;
	}
}

/**
 * @param {{ graph: { nodes: Map<string, any> }, people: Map<string, any>, gsc?: any,
 *   skipped?: Set<string>, options?: Partial<typeof PEOPLE_LINK_DEFAULTS> }} input
 */
export function findPeopleToPeopleOpportunities({
	graph,
	people,
	gsc = null,
	skipped = new Set(),
	options = {}
}) {
	const opts = { ...PEOPLE_LINK_DEFAULTS, ...options };
	const nodes = graph.nodes ?? graph;
	const personNodes = [...nodes.values()].filter((n) => n.kind === 'person');
	const impressions = (url) => gsc?.pages?.get(url)?.impressions ?? 0;
	const position = (url) => gsc?.pages?.get(url)?.position ?? null;
	const inCount = (n) => n.inBlog.size + n.inPeople.size;
	const outCount = (n) => new Set([...n.outPeople, ...n.outBlog, ...(n.outOther ?? [])]).size;

	const targets = personNodes
		.filter((n) => inCount(n) <= opts.needMaxIn && people.get(n.url)?.name)
		.sort((a, b) => inCount(a) - inCount(b) || impressions(b.url) - impressions(a.url));
	const sources = personNodes.filter(
		(n) => people.get(n.url)?.draftFile && outCount(n) < opts.sourceOutCap
	);

	const candidates = [];
	for (const target of targets) {
		const person = people.get(target.url);
		for (const source of sources) {
			if (source.url === target.url || source.outPeople.includes(target.url)) continue;
			const id = `${source.url} -> ${target.url}`;
			if (skipped.has(id)) continue;
			const src = people.get(source.url);
			const hit = findPersonMention(src.body ?? '', person.name, person.enneagram);
			if (!hit) continue;
			candidates.push({
				id,
				source: { url: source.url, file: src.draftFile, outCount: outCount(source) },
				target: {
					url: target.url,
					name: person.name,
					inCount: inCount(target),
					impressions: impressions(target.url),
					position: position(target.url)
				},
				line: hit.bodyLine + bodyOffset(src.draftFile, src.body ?? ''),
				anchor: hit.anchor,
				excerpt: hit.raw.trim(),
				typeClaim: hit.typeClaim
			});
		}
	}

	candidates.sort(
		(a, b) =>
			a.target.inCount - b.target.inCount ||
			b.target.impressions - a.target.impressions ||
			a.source.outCount - b.source.outCount
	);
	const perTarget = new Map();
	const perSource = new Map();
	const picked = [];
	for (const c of candidates) {
		const t = perTarget.get(c.target.url) ?? 0;
		const s = perSource.get(c.source.url) ?? 0;
		if (t >= Math.max(0, opts.fillTo - c.target.inCount) || s >= opts.perSource) continue;
		perTarget.set(c.target.url, t + 1);
		perSource.set(c.source.url, s + 1);
		picked.push(c);
	}
	return { candidates, picked, targets };
}
