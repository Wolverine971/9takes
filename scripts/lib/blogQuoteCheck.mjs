// scripts/lib/blogQuoteCheck.mjs
// Deterministic quote check for people profiles: every quotation in the article is
// searched for in the source text saved during research. No model calls, no network.
//
// It answers one question: do these exact words appear in a saved source? It cannot
// tell whether a quote is used in context, who said it, or what it was about. Those
// stay with the evidence reviewer and the verifier. A miss is a lead, not a verdict:
// audio quoted from captions, a paywalled source with no saved text, or a translated
// line can all miss honestly.
import { promises as fs } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const SNAPSHOT_EXTENSIONS = new Set(['.txt', '.md', '.vtt', '.srt', '.html', '.htm']);
/** Quotes shorter than this are titles, scare quotes and one-word answers. */
export const MIN_QUOTE_WORDS = 4;
const SHINGLE = 4;
/** Share of a quote's word runs found in one source before a miss counts as "altered". */
const ALTERED_OVERLAP = 0.6;

const ENTITIES = {
	'&nbsp;': ' ',
	'&#160;': ' ',
	'&amp;': '&',
	'&quot;': '"',
	'&#34;': '"',
	'&#39;': "'",
	'&apos;': "'",
	'&rsquo;': "'",
	'&lsquo;': "'",
	'&rdquo;': '"',
	'&ldquo;': '"',
	'&mdash;': ' ',
	'&ndash;': ' ',
	'&hellip;': ' '
};

/** Caption files repeat each line across rolling cues; collapse them to running text.
 * @param {string} text */
export function cleanCaptions(text) {
	const lines = [];
	for (const raw of text.split(/\r?\n/)) {
		const line = raw
			.replace(/<\d{1,2}:\d{2}:\d{2}[.,]\d{3}>/g, '')
			.replace(/<\/?c[^>]*>/g, '')
			.trim();
		if (!line || /^(WEBVTT|Kind:|Language:|NOTE\b)/.test(line)) continue;
		if (/^\d+$/.test(line) || /-->/.test(line)) continue;
		if (lines[lines.length - 1] === line) continue;
		lines.push(line);
	}
	return lines.join(' ');
}

/** Lowercase words only: punctuation, apostrophes, tags and caption markers removed.
 * @param {string} text */
export function normalizeForMatch(text) {
	return text
		.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/&[a-z#0-9]+;/gi, (entity) => ENTITIES[entity.toLowerCase()] ?? ' ')
		.replace(/\[\d{1,2}:\d{2}(?::\d{2})?(?:[.,]\d+)?\]/g, ' ')
		.replace(/>>+/g, ' ')
		.toLowerCase()
		.replace(/['’‘`]/g, '')
		.replace(/[^\p{L}\p{N}]+/gu, ' ')
		.trim();
}

/** @param {string} text */
function stripMarkdown(text) {
	return text
		.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
		.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
		.replace(/[*_`]/g, '');
}

/** @param {string} text */
const wordCount = (text) => normalizeForMatch(text).split(' ').filter(Boolean).length;

/**
 * Every quotation in the reader-visible article: text inside double quotation marks,
 * plus block quotes that carry no quotation marks of their own.
 * @param {string} markdown
 * @returns {{quotes: Array<{quote: string, near: string}>, unbalanced: string[], short: number}}
 */
export function extractQuotes(markdown) {
	const { data, content } = matter(markdown, {});
	const body = content
		.replace(/<!--[\s\S]*?-->/g, '')
		.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
		.replace(/<svelte:head>[\s\S]*?<\/svelte:head>/g, '')
		.replace(/```[\s\S]*?```/g, '');
	const metadata = [
		typeof data.description === 'string' ? data.description : '',
		...(Array.isArray(data.faqs)
			? data.faqs.map((/** @type {any} */ f) => (typeof f?.answer === 'string' ? f.answer : ''))
			: [])
	];
	/** @type {Array<{quote: string, near: string}>} */
	const quotes = [];
	const unbalanced = [];
	let short = 0;
	const add = (/** @type {string} */ quote, /** @type {string} */ near) => {
		const clean = stripMarkdown(quote).replace(/\s+/g, ' ').trim();
		if (!clean) return;
		if (wordCount(clean) < MIN_QUOTE_WORDS) short++;
		else quotes.push({ quote: clean, near });
	};
	for (const paragraph of [...body.split(/\n\s*\n/), ...metadata]) {
		const text = paragraph.trim();
		if (!text) continue;
		const near = stripMarkdown(text.replace(/^>\s?/gm, '')).replace(/\s+/g, ' ').slice(0, 90);
		// HTML attribute values are not quotations.
		const prose = text.replace(/<[^>]+>/g, ' ');
		// Directional marks cannot lose phase, so pair them directly, then look at
		// whatever straight marks remain in the same paragraph.
		const curly = /[“”]/.test(prose);
		for (const match of prose.matchAll(/“([^“”]+)”/g)) add(match[1], near);
		const rest = prose.replace(/“[^“”]+”/g, ' ');
		const marks = (rest.match(/"/g) || []).length;
		if (marks === 0) {
			if (!curly && /^>/.test(text)) {
				const lines = text
					.split('\n')
					.map((line) => line.replace(/^>\s?/, '').trim())
					.filter((line) => line && !/^([—–-]{1,2}\s|<cite)/.test(stripMarkdown(line).trim()));
				add(lines.join(' '), near);
			}
			continue;
		}
		// An odd count means an inch mark or a typo; pairing would check the prose
		// between quotes and skip the real ones, so hand the paragraph to a reader.
		if (marks % 2 === 1) {
			unbalanced.push(near);
			continue;
		}
		for (const match of rest.matchAll(/"([^"]+)"/g)) add(match[1], near);
	}
	return { quotes, unbalanced, short };
}

/**
 * @param {string} dir
 * @returns {Promise<Array<{id: string, file: string, norm: string}>>}
 */
export async function loadSnapshots(dir) {
	const names = await fs.readdir(dir).catch(() => /** @type {string[]} */ ([]));
	const snapshots = [];
	for (const name of names.sort()) {
		const ext = path.extname(name).toLowerCase();
		if (!SNAPSHOT_EXTENSIONS.has(ext) || name.startsWith('.')) continue;
		const file = path.join(dir, name);
		const stat = await fs.stat(file).catch(() => null);
		if (!stat?.isFile() || stat.size > 20 * 1024 * 1024) continue;
		const raw = await fs.readFile(file, 'utf8');
		const text = ext === '.vtt' || ext === '.srt' ? cleanCaptions(raw) : raw;
		const norm = normalizeForMatch(text);
		if (norm) snapshots.push({ id: name.slice(0, name.indexOf('.')), file: name, norm });
	}
	return snapshots;
}

/**
 * @param {string} markdown
 * @param {Array<{id: string, file: string, norm: string}>} snapshots
 */
export function matchQuotes(markdown, snapshots) {
	const { quotes, unbalanced, short } = extractQuotes(markdown);
	/** @type {Map<string, Set<string>>} */
	const grams = new Map();
	const gramsFor = (/** @type {{file: string, norm: string}} */ snapshot) => {
		let set = grams.get(snapshot.file);
		if (!set) {
			set = new Set();
			const words = snapshot.norm.split(' ');
			for (let i = 0; i + SHINGLE <= words.length; i++)
				set.add(words.slice(i, i + SHINGLE).join(' '));
			grams.set(snapshot.file, set);
		}
		return set;
	};
	let matched = 0;
	const misses = [];
	for (const { quote, near } of quotes) {
		const norm = normalizeForMatch(quote);
		if (snapshots.some((s) => s.norm.includes(norm))) {
			matched++;
			continue;
		}
		// Ellipses and bracketed insertions are honest edits: each remaining piece
		// must appear in the same source.
		const pieces = quote
			.split(/\s*(?:\.{3,}|…|\[[^\]]*\])\s*/)
			.map(normalizeForMatch)
			.filter((piece) => piece.split(' ').length >= 3);
		if (
			/\.{3,}|…|\[[^\]]*\]/.test(quote) &&
			pieces.length > 0 &&
			snapshots.some((s) => pieces.every((piece) => s.norm.includes(piece)))
		) {
			matched++;
			continue;
		}
		const words = norm.split(' ');
		const shingles = [];
		for (let i = 0; i + SHINGLE <= words.length; i++)
			shingles.push(words.slice(i, i + SHINGLE).join(' '));
		let best = { file: '', overlap: 0 };
		for (const snapshot of snapshots) {
			const set = gramsFor(snapshot);
			const overlap = shingles.filter((s) => set.has(s)).length / (shingles.length || 1);
			if (overlap > best.overlap) best = { file: snapshot.file, overlap };
		}
		const altered = best.overlap >= ALTERED_OVERLAP;
		misses.push({
			quote,
			near,
			status: altered ? 'altered' : 'not_found',
			...(best.file
				? { closest_snapshot: best.file, overlap: Math.round(best.overlap * 100) / 100 }
				: {}),
			note: altered
				? 'Most of these words are in the closest snapshot but not as one continuous passage. Check for a joined, trimmed, reordered or reworded quote.'
				: 'These words are in no saved source. Save the source text, fix the wording, or write it as paraphrase.'
		});
	}
	return {
		quotes_checked: quotes.length,
		matched,
		short_quotes_skipped: short,
		misses,
		unbalanced_paragraphs: unbalanced
	};
}

/**
 * @param {string} markdown
 * @param {string} snapshotDir
 * @param {Array<{id: string, access?: string}>} [sources] Evidence sources, to list those with no saved text.
 */
export async function checkQuotes(markdown, snapshotDir, sources = []) {
	const snapshots = await loadSnapshots(snapshotDir);
	if (!snapshots.length)
		return {
			available: false,
			snapshot_dir: snapshotDir,
			reason:
				'No saved source text found. Quotes were not checked by machine; check each one against its source.'
		};
	const saved = new Set(snapshots.map((s) => s.id));
	return {
		available: true,
		snapshot_dir: snapshotDir,
		snapshots: snapshots.length,
		...matchQuotes(markdown, snapshots),
		sources_without_snapshot: sources
			.filter((s) => s.access !== 'unavailable' && !saved.has(s.id))
			.map((s) => s.id)
	};
}
