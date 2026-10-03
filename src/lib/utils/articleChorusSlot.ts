// src/lib/utils/articleChorusSlot.ts
//
// Where the give-first Chorus sits inside a personality article.
//
// Readers thin out fast on these pages: about 42% of engaged readers reach the
// halfway point and about 19% reach the bottom (2026-10 scroll data), so the
// Chorus goes at the section boundary nearest ~40% of the article instead of
// after the sources and FAQ. A boundary is the gap right before a top-level
// <h2>: the previous section has ended and nothing is nested (never inside a
// list, table, blockquote, disclosure, or callout). The HTML itself is never
// rewritten, only cut, so headings, ids, anchors, and the TOC are untouched.
//
// Pure and DOM-free: the page runs it during SSR and again on hydration, and
// both runs must cut at the same byte.
import { ENNEAGRAM_TYPE_DOSSIER_SLOT_MARKER } from './articleSlots';

export type ArticleFlowSegment =
	{ kind: 'prose'; html: string } | { kind: 'dossier' } | { kind: 'chorus' };

export type ArticleFlow = {
	segments: ArticleFlowSegment[];
	hasDossierSlot: boolean;
	hasChorusSlot: boolean;
};

export type ChorusSlotOptions = {
	/** Share of the article's visible text that should come before the Chorus. */
	targetRatio?: number;
	/** Boundaries outside [minRatio, maxRatio] are never used. */
	minRatio?: number;
	maxRatio?: number;
	/** Shorter articles keep the Chorus at the bottom. */
	minWords?: number;
	/** Visible characters of prose required between the Chorus and the dossier. */
	minCharsFromDossier?: number;
};

export const CHORUS_SLOT_DEFAULTS: Required<ChorusSlotOptions> = {
	targetRatio: 0.4,
	minRatio: 0.25,
	maxRatio: 0.6,
	minWords: 700,
	minCharsFromDossier: 400
};

const VOID_ELEMENTS = new Set([
	'area',
	'base',
	'br',
	'col',
	'embed',
	'hr',
	'img',
	'input',
	'link',
	'meta',
	'param',
	'source',
	'track',
	'wbr'
]);
const RAW_TEXT_ELEMENTS = new Set(['script', 'style', 'textarea', 'title']);

// Comments, or a start/end tag whose quoted attribute values may contain '>'.
const TAG_PATTERN =
	/<!--[\s\S]*?-->|<(\/?)([a-zA-Z][a-zA-Z0-9-]*)\b((?:[^>"']|"[^"]*"|'[^']*')*)>/g;
const ENTITY_PATTERN = /&(?:#\d+|#x[0-9a-f]+|[a-z][a-z0-9]*);/gi;

type Boundary = {
	/** Byte offset of the top-level <h2 that opens the next section. */
	index: number;
	/** Visible characters before the boundary. */
	charsBefore: number;
	/** Opening tag of the top-level element right before the boundary. */
	previousTopLevelTag: string | null;
};

type ArticleScan = {
	boundaries: Boundary[];
	totalChars: number;
	totalWords: number;
	/** Visible characters before the dossier slot, when the article has one. */
	dossierChars: number | null;
};

function visibleText(fragment: string): string {
	return fragment.replace(ENTITY_PATTERN, 'x');
}

function countVisibleChars(fragment: string): number {
	return visibleText(fragment).replace(/\s+/g, '').length;
}

function countWords(fragment: string): number {
	return visibleText(fragment).split(/\s+/).filter(Boolean).length;
}

function scanArticle(html: string): ArticleScan {
	const boundaries: Boundary[] = [];
	const stack: string[] = [];
	let totalChars = 0;
	let totalWords = 0;
	let dossierChars: number | null = null;
	let previousTopLevelTag: string | null = null;
	let cursor = 0;

	const pattern = new RegExp(TAG_PATTERN.source, 'g');
	let match: RegExpExecArray | null;

	while ((match = pattern.exec(html))) {
		const text = html.slice(cursor, match.index);
		totalChars += countVisibleChars(text);
		totalWords += countWords(text);
		cursor = pattern.lastIndex;

		const [raw, closingSlash, rawName] = match;
		if (!rawName) continue; // comment

		const name = rawName.toLowerCase();

		if (closingSlash) {
			const openIndex = stack.lastIndexOf(name);
			// A stray end tag closes nothing; a skipped one is closed implicitly.
			if (openIndex !== -1) stack.length = openIndex;
			continue;
		}

		if (raw.includes('data-article-slot="enneagram-type-dossier"') && dossierChars === null) {
			dossierChars = totalChars;
		}

		if (stack.length === 0) {
			if (name === 'h2' && totalChars > 0) {
				boundaries.push({ index: match.index, charsBefore: totalChars, previousTopLevelTag });
			}
			previousTopLevelTag = raw;
		}

		if (RAW_TEXT_ELEMENTS.has(name)) {
			// Skip the raw text (its '<' is not markup) along with the end tag.
			const end = html.toLowerCase().indexOf(`</${name}`, cursor);
			const close = end === -1 ? -1 : html.indexOf('>', end);
			const skipTo = close === -1 ? html.length : close + 1;
			const rawText = html.slice(cursor, end === -1 ? html.length : end);
			if (name !== 'script' && name !== 'style') {
				totalChars += countVisibleChars(rawText);
				totalWords += countWords(rawText);
			}
			cursor = skipTo;
			pattern.lastIndex = skipTo;
			continue;
		}

		const selfClosing = /\/\s*$/.test(match[3] ?? '');
		if (!VOID_ELEMENTS.has(name) && !selfClosing) stack.push(name);
	}

	const tail = html.slice(cursor);
	totalChars += countVisibleChars(tail);
	totalWords += countWords(tail);

	return { boundaries, totalChars, totalWords, dossierChars };
}

function isFurnitureTag(tag: string | null): boolean {
	return Boolean(tag && /data-component-placeholder|data-article-slot/.test(tag));
}

/**
 * Byte offset where the Chorus should be inserted, or null when the article is
 * too short or has no suitable boundary (the caller keeps the bottom position).
 *
 * The chosen boundary is the top-level section break whose share of visible
 * text before it is closest to `targetRatio` (ties go to the earlier one, which
 * more readers reach). Boundaries right after a card-like block (a component
 * placeholder or the dossier slot) or too close to the dossier are skipped so
 * two cards never stack.
 */
export function findChorusSlotIndex(html: string, options: ChorusSlotOptions = {}): number | null {
	if (!html) return null;
	const settings = { ...CHORUS_SLOT_DEFAULTS, ...options };
	const scan = scanArticle(html);

	if (scan.totalWords < settings.minWords || scan.totalChars === 0) return null;

	let best: { index: number; distance: number } | null = null;
	for (const boundary of scan.boundaries) {
		const ratio = boundary.charsBefore / scan.totalChars;
		if (ratio < settings.minRatio || ratio > settings.maxRatio) continue;
		if (isFurnitureTag(boundary.previousTopLevelTag)) continue;
		if (
			scan.dossierChars !== null &&
			Math.abs(boundary.charsBefore - scan.dossierChars) < settings.minCharsFromDossier
		) {
			continue;
		}

		// Rounded so float noise (0.4 - 0.3 > 0.5 - 0.4) cannot break a real tie.
		const distance = Math.round(Math.abs(ratio - settings.targetRatio) * 1e6);
		if (!best || distance < best.distance) best = { index: boundary.index, distance };
	}

	return best?.index ?? null;
}

/**
 * The article as an ordered list of prose runs and the blocks that interrupt
 * them: the author-placed dossier slot and the mid-article Chorus, in whichever
 * order they fall. The first segment is always prose (possibly empty); later
 * empty prose runs are dropped. Concatenating the prose runs gives back the
 * original HTML minus the dossier marker.
 */
export function buildArticleFlow(
	html: string,
	options: ChorusSlotOptions & { withChorus?: boolean } = {}
): ArticleFlow {
	const { withChorus = false, ...slotOptions } = options;
	const content = html ?? '';

	const dossierIndex = content.indexOf(ENNEAGRAM_TYPE_DOSSIER_SLOT_MARKER);
	const chorusIndex = withChorus ? findChorusSlotIndex(content, slotOptions) : null;

	const cuts: Array<{ index: number; length: number; block: 'dossier' | 'chorus' }> = [];
	if (dossierIndex !== -1) {
		cuts.push({
			index: dossierIndex,
			length: ENNEAGRAM_TYPE_DOSSIER_SLOT_MARKER.length,
			block: 'dossier'
		});
	}
	if (chorusIndex !== null) cuts.push({ index: chorusIndex, length: 0, block: 'chorus' });
	cuts.sort((a, b) => a.index - b.index);

	const segments: ArticleFlowSegment[] = [];
	let cursor = 0;
	for (const cut of cuts) {
		pushProse(segments, content.slice(cursor, cut.index));
		segments.push({ kind: cut.block });
		cursor = cut.index + cut.length;
	}
	pushProse(segments, content.slice(cursor));

	return {
		segments,
		hasDossierSlot: dossierIndex !== -1,
		hasChorusSlot: chorusIndex !== null
	};
}

function pushProse(segments: ArticleFlowSegment[], html: string): void {
	if (segments.length > 0 && html.trim() === '') return;
	segments.push({ kind: 'prose', html });
}
