// scripts/lib/jevLinkAudit.spec.mjs
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { chunkQuestions, createJevClient, estimateTokens } from './jevClient.js';
import {
	DEFAULT_CONFIG,
	alreadyLinks,
	hasQuestion,
	anchorParagraphs,
	applyCaps,
	competition,
	linkQuestion,
	linkStrength,
	paragraphsOf,
	readableText,
	selectDestinations,
	tierFor
} from './jevLinkAudit.js';

const node = (url, extra = {}) => ({
	kind: 'blog',
	url,
	title: url,
	post: { description: '' },
	inBlog: new Set(),
	inCount: 3,
	outBlog: [],
	outPeople: [],
	outOther: [],
	...extra
});

const gscOf = (pages, queries = {}) => ({
	pages: new Map(Object.entries(pages)),
	queries: new Map(Object.entries(queries))
});

describe('selectDestinations', () => {
	const graph = new Map(
		[
			node('/enneagram-corner/striking'),
			node('/enneagram-corner/hub', { inCount: 120 }),
			node('/enneagram-corner/enneagram-type-4'),
			node('/enneagram-corner/loser-twin'),
			node('/enneagram-corner/page-one-result'),
			node('/personality-analysis/unlinked', { kind: 'person', inBlog: new Set() }),
			node('/personality-analysis/linked', { kind: 'person', inBlog: new Set(['/a', '/b']) })
		].map((n) => [n.url, n])
	);
	const gsc = gscOf({
		'/enneagram-corner/striking': { impressions: 5000, position: 9 },
		'/enneagram-corner/hub': { impressions: 5000, position: 9 },
		'/enneagram-corner/enneagram-type-4': { impressions: 5000, position: 20 },
		'/enneagram-corner/loser-twin': { impressions: 5000, position: 9 },
		'/enneagram-corner/page-one-result': { impressions: 5000, position: 1.5 },
		'/personality-analysis/unlinked': { impressions: 900, position: 8 },
		'/personality-analysis/linked': { impressions: 900, position: 8 }
	});
	const config = { ...DEFAULT_CONFIG, twins: { '/enneagram-corner/loser-twin': '/x' } };

	it('keeps striking-distance posts and under-linked people, drops hubs, type pages, twins, top-3', () => {
		const urls = selectDestinations({ graph, gsc, config }).map((d) => d.url);
		expect(urls).toEqual(['/enneagram-corner/striking', '/personality-analysis/unlinked']);
	});

	it('adds live questions as destinations', () => {
		const dests = selectDestinations({
			graph: new Map(),
			gsc,
			questions: [
				{ url: 'whats-your-biggest-fear', question_formatted: "What's your biggest fear?" }
			],
			config
		});
		expect(dests).toMatchObject([{ kind: 'question', url: '/questions/whats-your-biggest-fear' }]);
	});
});

describe('tierFor', () => {
	const blog = { kind: 'blog' };
	const person = { kind: 'person' };
	const question = { kind: 'question' };
	const anchor = { mode: 'anchor', probability: 0.8 };
	const goodBridge = { mode: 'bridge', fit: 0.9 };
	const weakBridge = { mode: 'bridge', fit: 0.5 };

	it('inserts on existing wording once the page-level strength clears the bar', () => {
		expect(tierFor({ dest: blog, wide: 0.72, competes: 0, placement: anchor })).toBe('INSERT');
		expect(tierFor({ dest: blog, wide: 0.6, competes: 0, placement: anchor })).toBeNull();
	});

	it('queues an added sentence only for blog posts, with a strong page AND paragraph fit', () => {
		expect(tierFor({ dest: blog, wide: 0.9, competes: 0, placement: goodBridge })).toBe('QUEUE');
		expect(tierFor({ dest: blog, wide: 0.9, competes: 0, placement: weakBridge })).toBeNull();
		expect(tierFor({ dest: blog, wide: 0.75, competes: 0, placement: goodBridge })).toBeNull();
		expect(tierFor({ dest: person, wide: 0.99, competes: 0, placement: goodBridge })).toBeNull();
	});

	it('links a person only where the post names them, at a low sanity floor', () => {
		expect(tierFor({ dest: person, wide: 0.45, competes: 0, placement: anchor })).toBe('INSERT');
		expect(tierFor({ dest: person, wide: 0.3, competes: 0, placement: anchor })).toBeNull();
		expect(
			tierFor({ dest: person, wide: 0.9, competes: 0, placement: { mode: 'unnamed' } })
		).toBeNull();
	});

	it('marks competing pages AVOID, but never questions', () => {
		expect(tierFor({ dest: blog, wide: 0.99, competes: 0.5, placement: anchor })).toBe('AVOID');
		expect(tierFor({ dest: question, wide: 0.9, competes: 0.9, placement: goodBridge })).toBe(
			'QUESTION'
		);
		expect(tierFor({ dest: question, wide: 0.75, competes: 0, placement: goodBridge })).toBeNull();
	});
});

describe('applyCaps', () => {
	it('keeps the most valuable added sentences per source and per destination', () => {
		const pair = (source, dest, wide, score = 1) => ({
			tier: 'QUEUE',
			wide,
			source: { url: source },
			dest: { url: dest, score }
		});
		const pairs = [
			pair('/s1', '/d1', 0.9),
			pair('/s1', '/d2', 0.95),
			pair('/s1', '/d3', 0.99),
			pair('/s2', '/d3', 0.8)
		];
		applyCaps(pairs, { insertPerSource: 8, queuePerSource: 2, queuePerDestination: 1 });
		expect(pairs.map((p) => p.tier)).toEqual([null, 'QUEUE', 'QUEUE', null]);
		expect(pairs[0].capped).toBe('QUEUE');
	});
});

describe('competition', () => {
	it('is the share of the destination impressions the source also shows up for', () => {
		const gsc = gscOf(
			{},
			{
				'/dest': [
					{ query: 'enneagram dating', impressions: 60 },
					{ query: 'type 4 dating', impressions: 40 }
				],
				'/source': [{ query: 'enneagram dating', impressions: 5 }]
			}
		);
		expect(competition(gsc, '/source', '/dest')).toEqual({
			share: 0.6,
			sharedQueries: ['enneagram dating']
		});
		expect(competition(gsc, '/other', '/dest').share).toBe(0);
	});
});

describe('page text and paragraphs', () => {
	it('strips link URLs, scripts and markup but keeps the words', () => {
		const body =
			'<script>import X from "y";</script>\nRead [the guide](/enneagram-corner/x) and <a href="/y">this</a>.';
		expect(readableText(body)).toBe('Read the guide and this.');
	});

	it('finds the paragraph whose own wording names the destination', () => {
		const body = [
			'A long paragraph about something else entirely, nothing to see here.',
			'Here the post talks about Zendaya and why her typing matters for the reader.'
		].join('\n');
		const hits = anchorParagraphs(paragraphsOf(body), [
			{ text: 'Zendaya', weight: 3, re: /Zendaya/ }
		]);
		expect(hits).toMatchObject([{ key: 'L2', anchor: 'Zendaya' }]);
	});

	it('skips targets the source already links, including /questions hrefs with a query', () => {
		const source = node('/a', { outOther: ['/questions/foo?ref=blog'] });
		expect(alreadyLinks(source, '/questions/foo')).toBe(true);
		expect(alreadyLinks(source, '/questions/bar')).toBe(false);
	});
});

describe('hasQuestion', () => {
	it('sees a StrategicQuestion box or a question link, not the questions index or categories', () => {
		expect(hasQuestion(node('/a', { post: { body: '<StrategicQuestion question="x" />' } }))).toBe(
			true
		);
		expect(hasQuestion(node('/a', { outOther: ['/questions/whats-your-biggest-fear'] }))).toBe(
			true
		);
		expect(
			hasQuestion(node('/a', { outOther: ['/questions', '/questions/categories/love'] }))
		).toBe(false);
	});
});

describe('linkQuestion / linkStrength', () => {
	it('asks a 4-level rubric and maps it to 0..1', () => {
		const q = linkQuestion({ kind: 'blog', title: 'T', description: '' });
		expect(q.type).toBe('score');
		expect(q.criteria).toHaveLength(4);
		expect(linkStrength({ score: 3 })).toBe(1);
		expect(linkStrength({ score: 1.5 })).toBe(0.5);
		expect(linkStrength(undefined)).toBe(0);
	});
});

describe('jevClient', () => {
	it('packs questions into as few requests as fit the window', () => {
		const state = { text: 'x'.repeat(4100 * 20) }; // ~20k tokens
		const questions = Object.fromEntries(
			Array.from({ length: 200 }, (_, i) => [
				`q${i}`,
				{ type: 'noul', instructions: 'y'.repeat(200) }
			])
		);
		const chunks = chunkQuestions(state, questions);
		expect(chunks.length).toBeGreaterThan(1);
		expect(chunks.flatMap(Object.keys)).toHaveLength(200);
		for (const chunk of chunks) {
			expect(estimateTokens(state) + estimateTokens(chunk)).toBeLessThan(32000);
		}
	});

	it('caches answers on disk and retries 429s', async () => {
		const cacheDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jev-'));
		const ok = {
			answers: { a: { type: 'noul', noul: 0.9 } },
			usage: { input_tokens: 10, cost: 0.1 }
		};
		const fetchImpl = vi
			.fn()
			.mockResolvedValueOnce({
				ok: false,
				status: 429,
				headers: new Map([['retry-after', '0']]),
				text: async () => 'slow down'
			})
			.mockResolvedValueOnce({ ok: true, json: async () => ok });
		const jev = createJevClient({ apiKey: 'k', cacheDir, fetchImpl, maxRetries: 2 });
		const first = await jev.decide({ s: 1 }, { a: { type: 'noul', instructions: 'i' } });
		const second = await jev.decide({ s: 1 }, { a: { type: 'noul', instructions: 'i' } });
		expect(first.answers.a.noul).toBe(0.9);
		expect(second.cached).toBe(true);
		expect(fetchImpl).toHaveBeenCalledTimes(2);
		expect(jev.stats).toMatchObject({ calls: 1, cached: 1, cost: 0.1 });
	});
});
