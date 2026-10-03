// src/lib/utils/articleChorusSlot.spec.ts
import { describe, expect, it } from 'vitest';
import { ENNEAGRAM_TYPE_DOSSIER_SLOT_MARKER } from './articleSlots';
import {
	buildArticleFlow,
	findChorusSlotIndex,
	type ArticleFlowSegment
} from './articleChorusSlot';

/** One paragraph of exactly `words` words (each word is 5 visible chars). */
function para(words: number, label = 'w'): string {
	const word = label.padEnd(5, 'x').slice(0, 5);
	return `<p>${Array.from({ length: words }, () => word).join(' ')}</p>\n`;
}

function section(id: string, words: number): string {
	return `<h2 id="${id}">${id}</h2>\n${para(words)}`;
}

/** Ten equal sections: boundaries before s1..s9 sit at 10%, 20%, ... 90%. */
function tenSections(wordsEach = 100): string {
	return Array.from({ length: 10 }, (_, i) => section(`s${i}`, wordsEach)).join('');
}

function proseOf(segments: ArticleFlowSegment[]): string {
	return segments.map((segment) => (segment.kind === 'prose' ? segment.html : '')).join('');
}

function kinds(segments: ArticleFlowSegment[]): string[] {
	return segments.map((segment) => segment.kind);
}

describe('findChorusSlotIndex', () => {
	it('cuts right before the top-level h2 nearest 40% of the visible text', () => {
		const html = tenSections();
		const index = findChorusSlotIndex(html);

		expect(index).toBe(html.indexOf('<h2 id="s4">'));
	});

	it('weighs visible text, not markup, when measuring the 40% point', () => {
		// A huge attribute payload early on must not drag the cut forward.
		const heavyAttrs = `<p data-blob="${'z'.repeat(20_000)}">short</p>\n`;
		const html = heavyAttrs + tenSections();

		expect(findChorusSlotIndex(html)).toBe(html.indexOf('<h2 id="s4">'));
	});

	it('prefers the earlier boundary on an exact tie', () => {
		// Boundaries at 30% and 50% are equally far from 40%.
		const html = section('a', 300) + section('b', 200) + section('c', 500);

		expect(findChorusSlotIndex(html)).toBe(html.indexOf('<h2 id="b">'));
	});

	it.each([
		['blockquote', (inner: string) => `<blockquote>${inner}</blockquote>`],
		['list item', (inner: string) => `<ul><li>${inner}</li></ul>`],
		['table cell', (inner: string) => `<table><tbody><tr><td>${inner}</td></tr></tbody></table>`],
		[
			'disclosure',
			(inner: string) =>
				`<details class="enneagram-rabbit-hole"><summary>More</summary>${inner}</details>`
		],
		['callout', (inner: string) => `<div class="aside-box">${inner}</div>`]
	])('never cuts at an h2 nested inside a %s', (_label, wrap) => {
		const nested = wrap(`<h2 id="nested">nested</h2>${para(20)}`);
		const html =
			section('a', 400) +
			nested +
			para(400) +
			// The only legal boundary is far from 40% but still inside the window.
			section('late', 200);

		const index = findChorusSlotIndex(html);
		expect(index).not.toBe(html.indexOf('<h2 id="nested">'));
		expect(index === null || html.startsWith('<h2 id="late">', index)).toBe(true);
	});

	it('returns null when the article is too short', () => {
		expect(findChorusSlotIndex(tenSections(10))).toBeNull();
	});

	it('returns null when no top-level boundary falls between 25% and 60%', () => {
		const html = section('intro', 100) + para(800) + section('outro', 100);

		expect(findChorusSlotIndex(html)).toBeNull();
	});

	it('returns null for an article without h2 sections', () => {
		expect(findChorusSlotIndex(para(2000))).toBeNull();
		expect(findChorusSlotIndex('')).toBeNull();
	});

	it('skips a boundary that sits right after a component card', () => {
		const card =
			'<div id="component-blogpurpose-0" data-component-placeholder="BlogPurpose"><p>card</p></div>\n';
		const html =
			section('s0', 100) +
			section('s1', 100) +
			section('s2', 100) +
			section('s3', 100) +
			card +
			section('s4', 100) +
			section('s5', 100) +
			section('s6', 100) +
			section('s7', 100) +
			section('s8', 100) +
			section('s9', 100);

		// s4 (40%) is right after the card, so the next-closest boundary wins.
		expect(findChorusSlotIndex(html)).toBe(html.indexOf('<h2 id="s3">'));
	});

	it('keeps a paragraph of prose between the Chorus and the dossier', () => {
		const html = tenSections().replace(
			'<h2 id="s4">',
			`${ENNEAGRAM_TYPE_DOSSIER_SLOT_MARKER}\n<h2 id="s4">`
		);
		const index = findChorusSlotIndex(html);

		expect(index).not.toBe(html.indexOf('<h2 id="s4">'));
		expect(index).toBe(html.indexOf('<h2 id="s3">'));
	});

	it('survives comments, void and self-closing tags, and ">" inside attribute values', () => {
		const html =
			'<!-- <h2 id="commented">not real</h2> -->\n' +
			section('s0', 100).replace('<p>', '<p title="a > b">') +
			section('s1', 100).replace('</p>', '<br /><img src="x.webp" alt="x"></p>') +
			section('s2', 100) +
			section('s3', 100) +
			section('s4', 100) +
			section('s5', 100) +
			section('s6', 100) +
			section('s7', 100) +
			section('s8', 100) +
			section('s9', 100);

		expect(findChorusSlotIndex(html)).toBe(html.indexOf('<h2 id="s4">'));
	});

	it('is deterministic', () => {
		const html = tenSections();
		expect(findChorusSlotIndex(html)).toBe(findChorusSlotIndex(html));
	});
});

describe('buildArticleFlow', () => {
	it('matches the dossier-only split when the Chorus is off', () => {
		const html = `${section('a', 100)}${ENNEAGRAM_TYPE_DOSSIER_SLOT_MARKER}${section('b', 100)}`;
		const flow = buildArticleFlow(html, { withChorus: false });

		expect(flow).toEqual({
			segments: [
				{ kind: 'prose', html: section('a', 100) },
				{ kind: 'dossier' },
				{ kind: 'prose', html: section('b', 100) }
			],
			hasDossierSlot: true,
			hasChorusSlot: false
		});
	});

	it('places the Chorus mid-article in an article without a dossier', () => {
		const html = tenSections();
		const flow = buildArticleFlow(html, { withChorus: true });

		expect(kinds(flow.segments)).toEqual(['prose', 'chorus', 'prose']);
		expect(flow.hasChorusSlot).toBe(true);
		expect(flow.segments[2]).toEqual({
			kind: 'prose',
			html: html.slice(html.indexOf('<h2 id="s4">'))
		});
		expect(proseOf(flow.segments)).toBe(html);
	});

	it('composes when the dossier comes first', () => {
		const html = tenSections().replace(
			'<h2 id="s1">',
			`${ENNEAGRAM_TYPE_DOSSIER_SLOT_MARKER}\n<h2 id="s1">`
		);
		const flow = buildArticleFlow(html, { withChorus: true });

		expect(kinds(flow.segments)).toEqual(['prose', 'dossier', 'prose', 'chorus', 'prose']);
		expect(proseOf(flow.segments)).toBe(html.replace(ENNEAGRAM_TYPE_DOSSIER_SLOT_MARKER, ''));
	});

	it('composes when the Chorus comes first', () => {
		const html = tenSections().replace(
			'<h2 id="s8">',
			`${ENNEAGRAM_TYPE_DOSSIER_SLOT_MARKER}\n<h2 id="s8">`
		);
		const flow = buildArticleFlow(html, { withChorus: true });

		expect(kinds(flow.segments)).toEqual(['prose', 'chorus', 'prose', 'dossier', 'prose']);
		expect(proseOf(flow.segments)).toBe(html.replace(ENNEAGRAM_TYPE_DOSSIER_SLOT_MARKER, ''));
	});

	it('leaves every heading and id in place', () => {
		const html = tenSections();
		const prose = proseOf(buildArticleFlow(html, { withChorus: true }).segments);

		expect(prose.match(/<h2 id="[^"]+">/g)).toEqual(html.match(/<h2 id="[^"]+">/g));
	});

	it('falls back to no mid-article slot for a short article', () => {
		const html = tenSections(10);
		const flow = buildArticleFlow(html, { withChorus: true });

		expect(flow).toEqual({
			segments: [{ kind: 'prose', html }],
			hasDossierSlot: false,
			hasChorusSlot: false
		});
	});

	it('always starts with a prose segment, even for empty content', () => {
		expect(buildArticleFlow('', { withChorus: true }).segments).toEqual([
			{ kind: 'prose', html: '' }
		]);
		expect(
			kinds(buildArticleFlow(`${ENNEAGRAM_TYPE_DOSSIER_SLOT_MARKER}${section('a', 50)}`).segments)
		).toEqual(['prose', 'dossier', 'prose']);
	});
});
