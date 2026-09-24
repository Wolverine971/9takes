// scripts/lib/crosslinkOpportunities.js

/**
 * Link-opportunity engine: finds prose sentences in live blog posts that talk
 * about a target page (topic phrase or person name) without linking to it, and
 * ranks each (source → target) pair by what the link is worth:
 *
 *   target priority = search demand × striking-distance weight × link deficit
 *   pair score      = target priority × mention strength × source authority
 *                     × section-bridge bonus × crowding penalty
 *
 * Targets: live blog posts (not the 9 type pages; they are the most-linked
 * pages on the site) and published personality-analysis pages.
 * Phrases: curated (docs/crosslinks/target-phrases.json) + terms mined from
 * the target's own Google Search Console queries + person display names.
 */

import { sectionOf, isTypePage } from './blogLinkGraph.js';

const STOPWORDS = new Set(
	`a about after all also an and any are as at be been before being between both but by can
	could did do does doing for from had has have having her here hers him his how i if in into is
	it its just me more most my no nor not of off on once only or other our out over own same she
	should so some such than that the their them then there these they this those through to too
	under until up very was we were what when where which while who whom why will with would you
	your yours vs versus like get got make does dont doesnt isnt cant wont im ive youre`.split(/\s+/)
);

// Words that appear in almost every query for this site and carry no topic.
const GENERIC = new Set(
	`enneagram enneagrams type types typed personality personalities number numbers test tests quiz
	meaning means mean explained explanation guide examples example list chart best famous people
	person celebrities celebrity reddit wing wings one two three four five six seven eight nine
	9takes nine takes each every traits trait characteristics signs behavior patterns pattern`.split(
		/\s+/
	)
);

const TARGET_EXCERPT_CHARS = 220;

export function escapeRegExp(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Crude stem so "depression" also finds "depressed"/"depressive". */
export function stem(word) {
	return word.length <= 7 ? word : word.slice(0, word.length - 3);
}

function termRegExp(term) {
	const root = stem(term);
	// Long words match by stem ("depress" → depressed/depressive); short words
	// match whole-word (+plural) so "kris" never matches "Kristin".
	return root === term
		? new RegExp(`\\b${escapeRegExp(term)}s?\\b`, 'i')
		: new RegExp(`\\b${escapeRegExp(root)}\\w*`, 'i');
}

function phraseRegExp(phrase, caseSensitive = false) {
	return new RegExp(`(?<![\\w-])${escapeRegExp(phrase)}(?![\\w-])`, caseSensitive ? '' : 'i');
}

const mask = (match) => ' '.repeat(match.length);

/**
 * Prose lines eligible to carry a new contextual link, with 1-based body line
 * numbers. Existing links, tags, inline code, headings, tables, component
 * markup, and <script>/<style>/code-fence blocks are excluded or masked so a
 * suggestion never lands inside an existing link or a component prop.
 */
export function proseLines(body) {
	const out = [];
	let inFence = false;
	let inScript = false;
	let inStyle = false;
	let inComment = false;
	const lines = body.split('\n');
	for (let i = 0; i < lines.length; i++) {
		const text = lines[i];
		const trimmed = text.trim();
		if (inComment) {
			if (trimmed.includes('-->')) inComment = false;
			continue;
		}
		if (trimmed.startsWith('<!--')) {
			inComment = !trimmed.includes('-->');
			continue;
		}
		if (/^(```|~~~)/.test(trimmed)) {
			inFence = !inFence;
			continue;
		}
		if (inFence) continue;
		if (/<script\b/i.test(trimmed)) inScript = !/<\/script>/i.test(trimmed);
		else if (inScript) {
			if (/<\/script>/i.test(trimmed)) inScript = false;
			continue;
		}
		if (/<style\b/i.test(trimmed)) inStyle = !/<\/style>/i.test(trimmed);
		else if (inStyle) {
			if (/<\/style>/i.test(trimmed)) inStyle = false;
			continue;
		}
		if (!trimmed || trimmed.length < 25) continue;
		if (/^(#|\||<|\{|import\s|---|!\[|>\s*\[!)/.test(trimmed)) continue;
		const masked = text
			.replace(/\[([^\]]*)\]\([^)]*\)/g, mask)
			.replace(/<a\b[^>]*>[\s\S]*?<\/a>/gi, mask)
			.replace(/<[^>]+>/g, mask)
			.replace(/`[^`]*`/g, mask)
			.replace(/https?:\/\/\S+/g, mask);
		out.push({ line: i + 1, text, masked });
	}
	return out;
}

export function createDocFrequency(livePosts) {
	const bodies = livePosts.map((post) => post.body.toLowerCase());
	const cache = new Map();
	// Share of live posts matching a term (stemmed) or an explicit RegExp.
	return (termOrRegExp) => {
		const re = termOrRegExp instanceof RegExp ? termOrRegExp : termRegExp(termOrRegExp);
		const key = re.source;
		if (!cache.has(key)) {
			cache.set(key, bodies.filter((body) => re.test(body)).length / Math.max(1, bodies.length));
		}
		return cache.get(key);
	};
}

function titleBigrams(title) {
	const pairs = [];
	for (const part of title
		.toLowerCase()
		.replace(/[’']/g, '')
		.split(/[:|?!.,()—–-]+/)) {
		const words = part.split(/[^a-z0-9]+/).filter(Boolean);
		for (let i = 0; i < words.length - 1; i++) {
			const [a, b] = [words[i], words[i + 1]];
			const usable = (w) =>
				w.length >= 3 && !STOPWORDS.has(w) && !GENERIC.has(w) && !/^\d+$/.test(w);
			if (usable(a) && usable(b)) pairs.push([a, b.replace(/s$/, '')]);
		}
	}
	return pairs;
}

function countMatches(re, text) {
	return (text.match(new RegExp(re.source, 'gi')) ?? []).length;
}

function tokenize(text) {
	return text
		.toLowerCase()
		.replace(/[’']/g, '')
		.split(/[^a-z0-9]+/)
		.filter((token) => token.length >= 4 && !/^\d+$/.test(token))
		.filter((token) => !STOPWORDS.has(token) && !GENERIC.has(token));
}

/**
 * Phrases that signal a sentence is "about" the target.
 * weight 3 = curated or person name, 1.5 = mined from GSC queries, 1 = title term.
 */
export function buildTargetPhrases(node, { curated = {}, gsc = null, docFrequency }) {
	const phrases = [];
	const seen = new Set();
	const push = (text, weight, kind, caseSensitive = false) => {
		const key = text.toLowerCase();
		if (!text || seen.has(key)) return;
		seen.add(key);
		phrases.push({ text, weight, kind, re: phraseRegExp(text, caseSensitive) });
	};

	// Curated phrases with a capital letter are proper nouns → case-sensitive.
	for (const text of curated[node.url] ?? []) push(text, 3, 'curated', /[A-Z]/.test(text));

	if (node.kind === 'person') {
		const name = node.title;
		// Proper-noun match is case-sensitive. Single-word names ("Drake", "Prince") are
		// weaker evidence and must stand alone: not part of a longer capitalized name
		// like "Prince Andrew" or "Nick Drake".
		if (name && name.includes(' ')) push(name, 3, 'name', true);
		else if (name && !seen.has(name.toLowerCase())) {
			seen.add(name.toLowerCase());
			phrases.push({
				text: name,
				weight: 2,
				kind: 'name',
				re: new RegExp(
					`(?<![A-Z][\\w'’.-]*\\s)(?<![\\w-])${escapeRegExp(name)}(?![\\w-])(?!\\s+[A-Z])`
				)
			});
		}
		return phrases;
	}

	const ownBody = node.post.body.toLowerCase();
	const weights = new Map();
	for (const row of gsc?.queries.get(node.url) ?? []) {
		if (row.impressions < 10) continue;
		for (const token of new Set(tokenize(row.query))) {
			weights.set(token, (weights.get(token) ?? 0) + row.impressions);
		}
	}
	const mined = [...weights.entries()]
		// A mined term must be central to the target (3+ uses in its own body) and
		// rare across the corpus, or it matches half the site.
		.filter(([term]) => countMatches(termRegExp(term), ownBody) >= 3 && docFrequency(term) <= 0.12)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 4);
	for (const [term] of mined) {
		phrases.push({ text: term, weight: 1.5, kind: 'gsc', re: termRegExp(term) });
		seen.add(term);
	}

	// Title phrases: adjacent word pairs ("parenting styles", "first impression") are
	// precise; rare single title words are weak evidence on their own.
	const title = [node.title, node.post.metaTitle].filter(Boolean).join(' | ');
	for (const [first, second] of titleBigrams(title)) {
		const text = `${first} ${second}`;
		if (seen.has(text)) continue;
		const re = new RegExp(
			`(?<![\\w-])${escapeRegExp(first)}\\s+${escapeRegExp(second)}s?(?![\\w-])`,
			'i'
		);
		if (!re.test(ownBody) || docFrequency(re) > 0.1) continue;
		seen.add(text);
		phrases.push({ text, weight: 2, kind: 'title', re });
	}
	const titleTerms = [...new Set(tokenize(title))]
		.filter(
			(term) =>
				term.length >= 5 &&
				!seen.has(term) &&
				docFrequency(term) <= 0.08 &&
				countMatches(termRegExp(term), ownBody) >= 3
		)
		.slice(0, 3);
	for (const term of titleTerms) {
		seen.add(term);
		phrases.push({ text: term, weight: 1, kind: 'title', re: termRegExp(term) });
	}
	return phrases;
}

export function targetPriority(node, gsc) {
	const stats = gsc?.pages.get(node.url);
	const impressions = stats?.impressions ?? 0;
	const position = stats?.position ?? null;
	const positionWeight =
		position == null
			? 0.35
			: position <= 3
				? 0.45
				: position <= 20
					? 1
					: position <= 40
						? 0.6
						: 0.3;
	const demand = Math.log10(impressions + 10);
	// People pages are judged on editorial (blog) inbound; people→people links are plentiful.
	const inbound = node.kind === 'person' ? node.inBlog.size : node.inCount;
	return {
		score: demand * positionWeight * (1 / Math.sqrt(1 + inbound)),
		impressions,
		clicks: stats?.clicks ?? 0,
		position,
		inbound
	};
}

function excerptAround(text, index) {
	const clean = text.trim().replace(/\s+/g, ' ');
	if (clean.length <= TARGET_EXCERPT_CHARS) return clean;
	const at = Math.max(0, index - (text.length - text.trimStart().length));
	const start = Math.max(0, Math.min(at - 80, clean.length - TARGET_EXCERPT_CHARS));
	const end = start + TARGET_EXCERPT_CHARS;
	return `${start > 0 ? '…' : ''}${clean.slice(start, end)}${end < clean.length ? '…' : ''}`;
}

/** Best sentence in `source` to carry a link to `target`, or null. */
export function findBestMention(sourcePost, phrases) {
	let best = null;
	for (const line of proseLines(sourcePost.body)) {
		const hits = [];
		for (const phrase of phrases) {
			const match = phrase.re.exec(line.masked);
			if (match) hits.push({ phrase, match });
		}
		if (!hits.length) continue;
		const score = Math.min(
			6,
			hits.reduce((sum, hit) => sum + hit.phrase.weight, 0)
		);
		if (!best || score > best.score) {
			const lead = hits.sort((a, b) => b.phrase.weight - a.phrase.weight)[0];
			best = {
				score,
				line: line.line,
				anchor: lead.match[0],
				phrase: lead.phrase.text,
				phraseKind: lead.phrase.kind,
				excerpt: excerptAround(line.text, lead.match.index)
			};
		}
	}
	return best;
}

export const MIN_MENTION_SCORE = 1.5;

/**
 * Score every (live source post → target) pair that has a qualifying unlinked
 * mention. Returns candidates sorted best-first (not yet diversified).
 */
export function findOpportunities({
	graph,
	posts,
	gsc,
	curated = {},
	skipped = new Set(),
	onlyTarget,
	onlySource,
	minScore = MIN_MENTION_SCORE
}) {
	const livePosts = posts.filter((post) => post.live);
	const docFrequency = createDocFrequency(livePosts);
	const sources = [...graph.values()].filter((node) => node.kind !== 'person');
	const targets = [...graph.values()].filter(
		(node) => (node.kind === 'blog' || node.kind === 'person') && !isTypePage(node.url)
	);

	const candidates = [];
	for (const target of targets) {
		if (onlyTarget && target.url !== onlyTarget) continue;
		const phrases = buildTargetPhrases(target, { curated, gsc, docFrequency });
		if (!phrases.length) continue;
		const priority = targetPriority(target, gsc);

		for (const source of sources) {
			if (onlySource && source.url !== onlySource) continue;
			if (source.url === target.url) continue;
			if (source.outBlog.includes(target.url) || source.outPeople.includes(target.url)) continue;
			const id = `${source.url} -> ${target.url}`;
			if (skipped.has(id)) continue;

			// Cheap whole-body test before the line scan.
			if (!phrases.some((phrase) => phrase.re.test(source.post.body))) continue;
			const mention = findBestMention(source.post, phrases);
			if (!mention || mention.score < minScore) continue;

			const sourceStats = gsc?.pages.get(source.url);
			const authority = 0.6 + Math.log10((sourceStats?.impressions ?? 0) + 10) / 5;
			const bridge = sectionOf(source.url) !== sectionOf(target.url) ? 1.25 : 1;
			const crowding = source.outCount >= 40 ? 0.5 : source.outCount >= 25 ? 0.8 : 1;
			const score = priority.score * mention.score * authority * bridge * crowding;

			candidates.push({
				id,
				score: Math.round(score * 100) / 100,
				target: {
					url: target.url,
					title: target.title,
					kind: target.kind,
					section: sectionOf(target.url),
					impressions: priority.impressions,
					clicks: priority.clicks,
					position: priority.position,
					inbound: priority.inbound
				},
				source: {
					url: source.url,
					file: `src/blog/${source.post.rel}`,
					section: sectionOf(source.url),
					impressions: sourceStats?.impressions ?? 0,
					outCount: source.outCount
				},
				line: mention.line + (source.post.bodyLineOffset ?? 0),
				anchor: mention.anchor,
				phrase: mention.phrase,
				phraseKind: mention.phraseKind,
				mentionScore: mention.score,
				excerpt: mention.excerpt
			});
		}
	}
	return candidates.sort((a, b) => b.score - a.score);
}

/**
 * Greedy pick that spreads work across targets and sources so one hub post
 * does not absorb the whole queue.
 */
export function diversify(candidates, { limit = 60, perTarget = 3, perSource = 3 } = {}) {
	const byTarget = new Map();
	const bySource = new Map();
	const picked = [];
	for (const candidate of candidates) {
		if (picked.length >= limit) break;
		const t = byTarget.get(candidate.target.url) ?? 0;
		const s = bySource.get(candidate.source.url) ?? 0;
		if (t >= perTarget || s >= perSource) continue;
		byTarget.set(candidate.target.url, t + 1);
		bySource.set(candidate.source.url, s + 1);
		picked.push(candidate);
	}
	return picked;
}

/**
 * For a page nobody mentions: live posts where ONE bridging sentence would fit,
 * ranked by shared outbound links (co-citation), shared people, same section,
 * and shared pop-culture series/category or Enneagram number.
 */
export function findBridgeHosts(graph, targetUrl, limit = 3) {
	const target = graph.get(targetUrl);
	if (!target || target.kind === 'person') return [];
	const outSet = (node) =>
		new Set([...node.outBlog.filter((u) => !isTypePage(u)), ...node.outPeople]);
	const targetOut = outSet(target);
	const targetMeta = target.post;
	const hosts = [];
	for (const node of graph.values()) {
		if (node.kind !== 'blog' || node.url === targetUrl) continue;
		if (node.outBlog.includes(targetUrl)) continue;
		const nodeOut = outSet(node);
		const shared = [...nodeOut].filter((u) => targetOut.has(u));
		const union = new Set([...nodeOut, ...targetOut]).size || 1;
		const reasons = [];
		let score = shared.length / union;
		if (shared.length) reasons.push(`${shared.length} shared links`);
		if (node.section === target.section) {
			score += 0.15;
			reasons.push('same section');
		}
		const series = (p) => p.popCulture?.series ?? null;
		const category = (p) => p.popCulture?.category ?? null;
		if (series(node.post) && series(node.post) === series(targetMeta)) {
			score += 0.5;
			reasons.push(`series ${series(node.post)}`);
		} else if (category(node.post) && category(node.post) === category(targetMeta)) {
			score += 0.25;
			reasons.push(`category ${category(node.post)}`);
		}
		if (node.post.enneagram && String(node.post.enneagram) === String(targetMeta.enneagram)) {
			score += 0.2;
			reasons.push(`type ${node.post.enneagram}`);
		}
		if (node.outCount >= 40) score *= 0.5;
		if (score > 0.15)
			hosts.push({
				url: node.url,
				file: `src/blog/${node.post.rel}`,
				score: Math.round(score * 100) / 100,
				reasons
			});
	}
	return hosts.sort((a, b) => b.score - a.score).slice(0, limit);
}
