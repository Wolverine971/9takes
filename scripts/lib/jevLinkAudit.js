// scripts/lib/jevLinkAudit.js

/**
 * Jev-judged internal-link audit (the "tweet-style" link dealer, widened):
 * every live blog post is read once and asked, for each destination page, "is there an
 * honest reader-serving reason to link there?". Pairs that pass are placed: Jev picks the
 * paragraph whose existing wording can carry the link (INSERT) or, failing that, where one
 * added sentence would fit (QUEUE). Pages that compete for the same searches are AVOID.
 *
 * Code decides everything Jev is bad at (counting, dates, search-demand math); Jev only
 * answers the judgment calls. Destinations come from the link graph + Search Console:
 *   - blog posts in striking distance that are not saturated hubs or losing duplicate twins
 *   - people pages with search demand and at most one contextual blog link
 *   - live /questions pages (flagged questions 404, so they are never destinations)
 */

import { isTypePage } from './blogLinkGraph.js';
import { buildTargetPhrases, proseLines, targetPriority } from './crosslinkOpportunities.js';

export const DEFAULT_CONFIG = {
	// A page with this many inbound links is a hub; more links will not move it.
	saturatedInbound: 50,
	blog: { minImpressions: 300, positionMin: 3, positionMax: 35 },
	people: { minImpressions: 200, maxBlogInbound: 1 },
	// loser URL → the twin Google already prefers. Losers are never destinations.
	twins: {},
	thresholds: {
		// Whole-page link strength (rubric score / 3) needed to try placing a link.
		// 0.7 kept 59% of accepted links and 15% of rejected word matches in calibration.
		wide: 0.7,
		// Paragraph-choice probability needed to call an existing phrase an anchor.
		anchor: 0.5,
		// Adding a sentence just to hold a link is the least organic move, so it needs a
		// stronger whole-page reason AND the chosen paragraph itself must score this high.
		queue: 0.8,
		// People are linked at their first mention (exact, case-sensitive name match), the
		// web convention. Naming them is the evidence; this is only a sanity floor.
		person: 0.4,
		paragraphFit: 0.85,
		// Question links are opt-in by design: stricter, and at most one per post.
		question: 0.8,
		// Share of the destination's search impressions that the source also ranks for.
		competes: 0.2
	},
	maxAnchorParagraphs: 30,
	maxBridgeParagraphs: 150,
	// Caps keep the queue reviewable and stop one post from becoming a link farm.
	caps: { insertPerSource: 8, queuePerSource: 2, queuePerDestination: 3 }
};

/** Body text a reader sees: no code, scripts, styles, comments, or link URLs. */
export function readableText(body) {
	return body
		.replace(/<script[\s\S]*?<\/script>/gi, '')
		.replace(/<style[\s\S]*?<\/style>/gi, '')
		.replace(/<!--[\s\S]*?-->/g, '')
		.replace(/```[\s\S]*?```/g, '')
		.replace(/!\[[^\]]*\]\([^)]*\)/g, '')
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/<a\b[^>]*>([\s\S]*?)<\/a>/gi, '$1')
		.replace(/<[^>]+>/g, ' ')
		.replace(/[ \t]+/g, ' ')
		.replace(/\n\s*\n\s*\n+/g, '\n\n')
		.trim();
}

/** Prose paragraphs eligible to carry a link, keyed by source line ("L42"). */
export function paragraphsOf(body) {
	return proseLines(body).map((line) => ({
		key: `L${line.line}`,
		line: line.line,
		masked: line.masked,
		text: readableText(line.text)
	}));
}

export function selectDestinations({ graph, gsc, questions = [], config = DEFAULT_CONFIG }) {
	const stats = (url) => gsc?.pages.get(url) ?? { impressions: 0, position: null, clicks: 0 };
	const losers = new Set(Object.keys(config.twins ?? {}));
	const out = [];
	for (const node of graph.values()) {
		const s = stats(node.url);
		if (node.kind === 'blog') {
			if (isTypePage(node.url) || losers.has(node.url)) continue;
			if (node.inCount >= config.saturatedInbound) continue;
			if (s.impressions < config.blog.minImpressions || s.position == null) continue;
			if (s.position < config.blog.positionMin || s.position > config.blog.positionMax) continue;
			out.push({
				kind: 'blog',
				url: node.url,
				title: node.title,
				description: node.post?.description ?? '',
				node,
				...targetPriority(node, gsc)
			});
		} else if (node.kind === 'person') {
			if (s.impressions < config.people.minImpressions) continue;
			if (node.inBlog.size > config.people.maxBlogInbound) continue;
			out.push({
				kind: 'person',
				url: node.url,
				title: node.title,
				description: node.description ?? '',
				enneagram: node.enneagram,
				node,
				...targetPriority(node, gsc)
			});
		}
	}
	for (const q of questions) {
		out.push({
			kind: 'question',
			url: `/questions/${q.url}`,
			title: q.question_formatted ?? q.question,
			description: '',
			node: null,
			score: 0,
			impressions: stats(`/questions/${q.url}`).impressions,
			position: stats(`/questions/${q.url}`).position,
			inbound: 0
		});
	}
	return out;
}

/** One-line description of a destination, as Jev sees it. */
export function destinationCard(dest) {
	const clip = (text, n = 220) => (text.length > n ? `${text.slice(0, n - 1)}…` : text);
	if (dest.kind === 'person') {
		const type = dest.enneagram ? ` (Enneagram Type ${dest.enneagram})` : '';
		const about = dest.description ? `: ${clip(dest.description)}` : '';
		return `9takes' personality analysis of ${dest.title}${type}${about}`;
	}
	if (dest.kind === 'question') {
		return `the 9takes discussion question "${dest.title}", where readers answer before seeing how the nine types answered`;
	}
	return `the 9takes article "${dest.title}"${dest.description ? `: ${clip(dest.description)}` : ''}`;
}

/**
 * The whole-page "honest reason" question for one destination: a 4-level rubric.
 * On the 2026-09-23 calibration set (107 accepted links vs 47 rejected word matches)
 * this rubric separated them best (AUC 0.84) against three yes/no wordings (0.71–0.80).
 * Read the answer with `linkStrength` (0 = unrelated … 1 = direct).
 */
export function linkQuestion(dest, scope = 'page') {
	if (dest.kind === 'question') {
		return {
			type: 'score',
			instructions: `How naturally would inviting this ${scope}'s reader to answer ${destinationCard(dest)} fit?`,
			criteria: [
				'Unrelated, or shares only a word in a different sense',
				'Same broad area, but no passage about that situation',
				'A passage touches the situation the question asks about',
				'A passage is about exactly that situation, so a reader would want to answer it'
			]
		};
	}
	return {
		type: 'score',
		instructions: `How strongly does this ${scope} connect to ${destinationCard(dest)}?`,
		criteria: [
			'Unrelated: shares at most a word or name used in a different sense',
			'Loosely related: same broad area, no passage about it',
			'Related: a passage touches the same subject',
			'Direct: a passage is about the same subject, so a link clearly helps the reader'
		]
	};
}

/** 0–1 strength from a `linkQuestion` answer. */
export function linkStrength(answer) {
	if (!answer) return 0;
	if (typeof answer.score === 'number') return answer.score / 3;
	return answer.noul ?? 0;
}

export function alreadyLinks(source, url) {
	return (
		source.outBlog.includes(url) ||
		source.outPeople.includes(url) ||
		(source.outOther ?? []).some((href) => String(href).split(/[?#]/)[0] === url)
	);
}

/**
 * How much of the destination's search demand the source also shows up for.
 * A link from a page that competes for the same query tells Google two pages
 * answer it, which is the cannibalization this audit exists to avoid.
 */
export function competition(gsc, sourceUrl, destUrl) {
	const destRows = gsc?.queries.get(destUrl) ?? [];
	const sourceQueries = new Set((gsc?.queries.get(sourceUrl) ?? []).map((row) => row.query));
	let shared = 0;
	let total = 0;
	const sharedQueries = [];
	for (const row of destRows) {
		total += row.impressions;
		if (sourceQueries.has(row.query)) {
			shared += row.impressions;
			sharedQueries.push(row.query);
		}
	}
	return { share: total ? shared / total : 0, sharedQueries: sharedQueries.slice(0, 5) };
}

/** Paragraphs whose existing wording names the destination, strongest phrase first. */
export function anchorParagraphs(paragraphs, phrases, limit = DEFAULT_CONFIG.maxAnchorParagraphs) {
	const hits = [];
	for (const paragraph of paragraphs) {
		let best = null;
		for (const phrase of phrases) {
			const match = phrase.re.exec(paragraph.masked);
			if (match && (!best || phrase.weight > best.weight)) {
				best = { anchor: match[0], weight: phrase.weight, kind: phrase.kind };
			}
		}
		if (best) hits.push({ ...paragraph, ...best });
	}
	return hits.sort((a, b) => b.weight - a.weight).slice(0, limit);
}

export function phrasesFor(dest, { curated, gsc, docFrequency }) {
	if (dest.kind === 'question' || !dest.node) return [];
	return buildTargetPhrases(dest.node, { curated, gsc, docFrequency });
}

/** Jev question: which paragraph's existing wording should carry the link? */
export function anchorChoiceQuestion(dest, candidates) {
	const criteria = Object.fromEntries(
		candidates.map((p) => [p.key, `Paragraph ${p.key}, linking the words "${p.anchor}"`])
	);
	criteria.none = `No listed paragraph is actually about this; the words appear in a different sense or only in passing`;
	return {
		type: 'choice',
		instructions: `Pick the paragraph that is itself about the subject of ${destinationCard(dest)}, where the quoted words would make an honest, helpful link to it.`,
		criteria
	};
}

/** Jev question: where would one added sentence pointing to the destination fit? */
export function bridgeChoiceQuestion(dest, paragraphs) {
	const criteria = Object.fromEntries(paragraphs.map((p) => [p.key, `After paragraph ${p.key}`]));
	criteria.none = 'Nowhere on this page; any sentence pointing there would feel forced';
	return {
		type: 'choice',
		instructions: `Pick the paragraph after which one added sentence pointing readers to ${destinationCard(dest)} would fit most naturally.`,
		criteria
	};
}

export function paragraphState(dest, paragraphs) {
	return {
		destination: destinationCard(dest),
		paragraphs: Object.fromEntries(paragraphs.map((p) => [p.key, p.text]))
	};
}

/** Final tier for one judged pair. */
export function tierFor({ dest, wide, competes, placement, config = DEFAULT_CONFIG }) {
	const t = config.thresholds;
	if (dest.kind !== 'question' && competes >= t.competes) return 'AVOID';
	const fits = placement?.mode === 'bridge' && (placement.fit ?? 0) >= t.paragraphFit;
	if (dest.kind === 'question') return wide >= t.question && fits ? 'QUESTION' : null;
	if (wide < (dest.kind === 'person' ? t.person : t.wide)) return null;
	if (placement?.mode === 'anchor' && placement.probability >= t.anchor) return 'INSERT';
	// People are only linked where the post already names them (no sentence written to add a celebrity).
	if (dest.kind === 'blog' && wide >= t.queue && fits) return 'QUEUE';
	return null;
}

/**
 * Greedy cap by value (destination priority × link strength) so one post never gets a
 * pile of new links and one destination never absorbs the whole queue.
 */
export function applyCaps(pairs, caps = DEFAULT_CONFIG.caps) {
	const value = (p) => (p.dest.score || 0.5) * p.wide;
	const count = new Map();
	const bump = (key) => count.set(key, (count.get(key) ?? 0) + 1);
	for (const p of [...pairs]
		.filter((x) => x.tier === 'INSERT' || x.tier === 'QUEUE')
		.sort((a, b) => value(b) - value(a))) {
		const src = `${p.tier}:${p.source.url}`;
		const dst = `${p.tier}:${p.dest.url}`;
		const over =
			p.tier === 'INSERT'
				? (count.get(src) ?? 0) >= caps.insertPerSource
				: (count.get(src) ?? 0) >= caps.queuePerSource ||
					(count.get(dst) ?? 0) >= caps.queuePerDestination;
		if (over) {
			p.capped = p.tier;
			p.tier = null;
			continue;
		}
		bump(src);
		bump(dst);
	}
	return pairs;
}
