// scripts/lib/crosslinks.spec.mjs
import { describe, expect, it } from 'vitest';
import {
	buildLinkGraph,
	extractInternalLinks,
	normalizeInternalHref,
	normalizePersonalitySlug
} from './blogLinkGraph.js';
import { buildTargetPhrases, findBestMention, proseLines, stem } from './crosslinkOpportunities.js';
import { evaluateGate, tightenBaseline } from './crosslinkGate.js';

const post = (url, body, extra = {}) => ({
	rel: `${url.split('/')[1]}/${url.split('/').pop()}.md`,
	url,
	section: url.split('/')[1],
	live: true,
	title: url,
	body,
	links: extractInternalLinks(body),
	...extra
});

describe('normalizeInternalHref', () => {
	it('strips origin, query, hash and trailing slash', () => {
		expect(normalizeInternalHref('https://9takes.com/pop-culture/foo/?x=1#top')).toBe(
			'/pop-culture/foo'
		);
		expect(normalizeInternalHref('https://www.9takes.com/community/bar')).toBe('/community/bar');
	});

	it('canonicalizes person slugs like the personality-analysis route', () => {
		expect(normalizeInternalHref('/personality-analysis/Ariana-Grande')).toBe(
			'/personality-analysis/ariana-grande'
		);
		expect(normalizeInternalHref("/personality-analysis/charli-d'amelio")).toBe(
			'/personality-analysis/charli-damelio'
		);
		expect(normalizeInternalHref('/personality-analysis/type/9')).toBe(
			'/personality-analysis/type/9'
		);
	});

	it('ignores external links and assets', () => {
		expect(normalizeInternalHref('https://example.com/x')).toBeNull();
		expect(normalizeInternalHref('/blogs/pic.webp')).toBeNull();
		expect(normalizeInternalHref('//cdn.example.com/x')).toBeNull();
	});

	it('matches the TS normalizePersonalitySlug port', () => {
		expect(normalizePersonalitySlug('Brené Brown')).toBe('brene-brown');
		expect(normalizePersonalitySlug('J.K. Rowling')).toBe('jk-rowling');
	});
});

describe('extractInternalLinks', () => {
	it('finds markdown, html and component-prop links once each', () => {
		const body = [
			'See [stress](/enneagram-corner/enneagram-types-in-stress) and again [here](/enneagram-corner/enneagram-types-in-stress).',
			'<a class="x" href="/pop-culture/foo">foo</a>',
			"<MarqueeHorizontal displayList={[{name: 'a', link: '/community/bar'}]} />",
			'[external](https://example.com/nope)'
		].join('\n');
		const links = extractInternalLinks(body);
		expect(links.map((l) => l.url)).toEqual([
			'/enneagram-corner/enneagram-types-in-stress',
			'/pop-culture/foo',
			'/community/bar'
		]);
		expect(links[0]).toMatchObject({ line: 1, anchor: 'stress' });
	});
});

describe('buildLinkGraph', () => {
	it('counts type-page and people links, flags broken and redirected links', () => {
		const posts = [
			post(
				'/pop-culture/a',
				'[b](/pop-culture/b) [8](/enneagram-corner/enneagram-type-8) [T](/personality-analysis/taylor-swift) [gone](/pop-culture/draft) [old](/enneagram-corner/old-slug)'
			),
			post('/pop-culture/b', 'no links'),
			post('/enneagram-corner/enneagram-type-8', '[a](/pop-culture/a)')
		];
		const people = new Map([
			[
				'/personality-analysis/taylor-swift',
				{
					url: '/personality-analysis/taylor-swift',
					name: 'Taylor Swift',
					links: extractInternalLinks('[a](/pop-culture/a)')
				}
			]
		]);
		const redirects = new Map([['/enneagram-corner/old-slug', '/enneagram-corner/new-slug']]);
		const graph = buildLinkGraph({ posts, people, redirects });
		const a = graph.get('/pop-culture/a');
		expect(a.outCount).toBe(3);
		expect(a.broken).toEqual(['/pop-culture/draft']);
		expect(a.viaRedirect).toEqual([
			{ url: '/enneagram-corner/old-slug', to: '/enneagram-corner/new-slug' }
		]);
		expect(a.inCount).toBe(2); // type page + person page
		expect(graph.get('/enneagram-corner/enneagram-type-8').kind).toBe('type-page');
		expect(graph.get('/personality-analysis/taylor-swift').inBlog.size).toBe(1);
	});
});

describe('proseLines', () => {
	it('skips headings, components, comments, scripts and masks existing links', () => {
		const body = [
			'## A heading about depression',
			'<!--',
			'depression keyword notes',
			'-->',
			'<script>',
			"const depression = 'x';",
			'</script>',
			'<QuickAnswer question="depression?">',
			'A plain sentence that mentions [depression](/somewhere) and depression again.'
		].join('\n');
		const lines = proseLines(body);
		expect(lines.map((l) => l.line)).toEqual([9]);
		expect(lines[0].masked).not.toContain('[depression]');
		expect(lines[0].masked).toContain('depression again');
	});
});

describe('mention matching', () => {
	it('stems long words but matches short words whole', () => {
		expect(stem('depression')).toBe('depress');
		expect(stem('kristin')).toBe('kristin');
	});

	it('finds the best unlinked mention for a curated phrase', () => {
		const target = {
			url: '/enneagram-corner/astrology-and-the-enneagram',
			kind: 'blog',
			post: { body: '' },
			title: ''
		};
		const phrases = buildTargetPhrases(target, {
			curated: { [target.url]: ['astrology', 'zodiac sign'] },
			docFrequency: () => 0
		});
		const source = post(
			'/community/x',
			'Intro line that is long enough to count.\nNot your zodiac sign, and not astrology either, just patterns.'
		);
		const mention = findBestMention(source, phrases);
		expect(mention).toMatchObject({ line: 2, score: 6 });
		expect(['zodiac sign', 'astrology']).toContain(mention.anchor);
	});

	it('matches person names case-sensitively', () => {
		const target = { url: '/personality-analysis/drake', kind: 'person', title: 'Drake' };
		const phrases = buildTargetPhrases(target, { docFrequency: () => 0 });
		const source = post(
			'/pop-culture/y',
			'The ducks and a drake paddled across the pond all afternoon long.'
		);
		expect(findBestMention(source, phrases)).toBeNull();
	});
});

describe('cross-link gate', () => {
	const node = (url, inCount, outCount, broken = []) => ({
		url,
		kind: 'blog',
		inCount,
		outCount,
		broken,
		post: { rel: url.slice(1) + '.md' }
	});

	it('fails new under-linked posts, passes grandfathered ones, catches regressions and broken links', () => {
		const graph = new Map(
			[
				node('/pop-culture/new', 1, 5),
				node('/pop-culture/old', 1, 1),
				node('/pop-culture/worse', 0, 3),
				node('/pop-culture/fixed', 4, 4),
				node('/pop-culture/ok', 3, 3, ['/pop-culture/draft'])
			].map((n) => [n.url, n])
		);
		const baseline = {
			thresholds: { minIn: 3, minOut: 3 },
			grandfathered: {
				'/pop-culture/old': { in: 1, out: 1 },
				'/pop-culture/worse': { in: 1, out: 3 },
				'/pop-culture/fixed': { in: 1, out: 2 }
			}
		};
		const result = evaluateGate(graph, baseline);
		expect(result.failures.map((n) => n.url)).toEqual(['/pop-culture/new']);
		expect(result.regressions.map((r) => r.node.url)).toEqual(['/pop-culture/worse']);
		expect(result.improved.map((n) => n.url)).toEqual(['/pop-culture/fixed']);
		expect(result.broken).toEqual([
			{ from: '/pop-culture/ok', file: 'src/blog/pop-culture/ok.md', to: '/pop-culture/draft' }
		]);

		const tightened = tightenBaseline(graph, baseline);
		expect(Object.keys(tightened.grandfathered).sort()).toEqual([
			'/pop-culture/old',
			'/pop-culture/worse'
		]);
	});
});
