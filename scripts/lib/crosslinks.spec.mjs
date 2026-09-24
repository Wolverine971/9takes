// scripts/lib/crosslinks.spec.mjs
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
	REPO_ROOT,
	SECTION_RULES,
	buildLinkGraph,
	displayNameFromTitle,
	findUnrenderedMarkdown,
	extractInternalLinks,
	normalizeInternalHref,
	normalizePersonalitySlug
} from './blogLinkGraph.js';
import {
	buildTargetPhrases,
	diversify,
	findBestMention,
	proseLines,
	stem
} from './crosslinkOpportunities.js';
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

describe('review fixes (2026-09-23)', () => {
	it('ignores links inside HTML comments but keeps line numbers', () => {
		const body =
			'intro line\n<!--\nnote: [x](/pop-culture/hidden)\n-->\n[real](/pop-culture/shown)';
		const links = extractInternalLinks(body);
		expect(links.map((l) => l.url)).toEqual(['/pop-culture/shown']);
		expect(links[0].line).toBe(5);
	});

	it('never throws on malformed %-escapes', () => {
		expect(() => normalizeInternalHref('/personality-analysis/100%-real')).not.toThrow();
	});

	it('treats hub pages as real and mental-health aliases as redirects, not broken', () => {
		const posts = [
			post(
				'/pop-culture/a',
				'[hub](/enneagram-corner/mental-health) [alias](/enneagram-corner/enneagram-therapy-guide)'
			),
			{
				...post('/enneagram-corner/mental-health/enneagram-therapy-guide', 'x'),
				rel: 'enneagram/mental-health/enneagram-therapy-guide.md'
			}
		];
		const graph = buildLinkGraph({ posts, people: new Map(), redirects: new Map() });
		const a = graph.get('/pop-culture/a');
		expect(a.broken).toEqual([]);
		expect(a.viaRedirect).toEqual([
			{
				url: '/enneagram-corner/enneagram-therapy-guide',
				to: '/enneagram-corner/mental-health/enneagram-therapy-guide'
			}
		]);
	});

	it('derives person display names from titles with or without a colon', () => {
		expect(displayNameFromTitle('Aaron Pierre: An Enneagram Type 1 Analysis')).toBe('Aaron Pierre');
		expect(displayNameFromTitle("Drake's Enneagram Type")).toBe('Drake');
		expect(displayNameFromTitle('Jensen Huang Enneagram Type 6')).toBe('Jensen Huang');
	});

	it('only matches single-word names when they stand alone', () => {
		const target = { url: '/personality-analysis/prince', kind: 'person', title: 'Prince' };
		const [phrase] = buildTargetPhrases(target, { docFrequency: () => 0 });
		expect(phrase.re.test('Prince Andrew flew in.')).toBe(false);
		expect(phrase.re.test('the Fresh Prince of Bel-Air')).toBe(false);
		expect(phrase.re.test('a song by Prince played on')).toBe(true);
	});

	it('diversify caps work per target and per source', () => {
		const c = (s, t, score) => ({ score, source: { url: s }, target: { url: t } });
		const picked = diversify(
			[c('a', 'x', 9), c('a', 'y', 8), c('a', 'z', 7), c('b', 'x', 6), c('b', 'x', 5)],
			{ limit: 10, perTarget: 1, perSource: 2 }
		);
		expect(picked.map((p) => `${p.source.url}${p.target.url}`)).toEqual(['ax', 'ay']);
	});

	it('gate freezes only the failing dimension of a grandfathered post', () => {
		const node = (inCount, outCount) => ({
			url: '/pop-culture/p',
			kind: 'blog',
			inCount,
			outCount,
			broken: [],
			post: { rel: 'pop-culture/p.md' }
		});
		const baseline = { grandfathered: { '/pop-culture/p': { in: 1, out: 22 } } };
		const run = (n) => evaluateGate(new Map([[n.url, n]]), baseline);
		expect(run(node(1, 21)).regressions).toEqual([]); // trimming a healthy side is fine
		expect(run(node(0, 22)).regressions[0].dims).toEqual(['in']); // failing side got worse
		expect(run(node(1, 2)).regressions[0].dims).toEqual(['out']); // healthy side newly failing
		expect(run(node(3, 21)).improved.map((n) => n.url)).toEqual(['/pop-culture/p']);
	});
});

describe('SECTION_RULES stay in sync with the [slug] route globs', () => {
	const routes = {
		'enneagram/mental-health': 'src/routes/enneagram-corner/mental-health/[slug]/+page.ts',
		enneagram: 'src/routes/enneagram-corner/[slug]/+page.ts',
		community: 'src/routes/community/[slug]/+page.ts',
		guides: 'src/routes/how-to-guides/[slug]/+page.ts',
		'pop-culture': 'src/routes/pop-culture/[slug]/+page.ts'
	};

	for (const [dir, file] of Object.entries(routes)) {
		it(`${dir} ↔ ${file}`, () => {
			const source = fs.readFileSync(path.join(REPO_ROOT, file), 'utf8');
			const globBlock = source.match(/import\.meta\.glob\(\s*\[([\s\S]*?)\]/)[1];
			const patterns = [...globBlock.matchAll(/[`'"]([^`'"]+)[`'"]/g)].map((m) => m[1]);
			const include = patterns.find((p) => !p.startsWith('!'));
			expect(include).toContain(`/src/blog/${dir}/`);
			const rule = SECTION_RULES.find((r) => r.dir === dir);
			expect(rule).toBeTruthy();
			// Every route exclusion must also be excluded by the rule.
			for (const excl of patterns.filter((p) => p.startsWith('!') && !p.includes('/drafts/'))) {
				const sample = excl
					.replace(/^!\*\*\//, '')
					.replace(/\*/g, 'sample')
					.replace(/\{md,svx,svelte\.md\}/, 'md');
				expect(
					sample === 'template.md' || rule.exclude.some((re) => re.test(sample)),
					`${excl} not mirrored in SECTION_RULES for ${dir}`
				).toBe(true);
			}
		});
	}
});

describe('findUnrenderedMarkdown', () => {
	it('flags markdown inside a one-paragraph callout, not when blank lines let MDsvex parse it', () => {
		const tight =
			'<QuickAnswer question="q">\n**Bold** and [a link](/pop-culture/x).\n</QuickAnswer>';
		const spaced =
			'<QuickAnswer question="q">\n\n**Bold** and [a link](/pop-culture/x).\n\n</QuickAnswer>';
		const html =
			'<QuickAnswer question="q">\n<strong>Bold</strong> and <a href="/x">a link</a>.\n</QuickAnswer>';
		expect(findUnrenderedMarkdown(tight)).toEqual([
			{ line: 2, text: '**Bold** and [a link](/pop-culture/x).' }
		]);
		expect(findUnrenderedMarkdown(spaced)).toEqual([]);
		expect(findUnrenderedMarkdown(html)).toEqual([]);
	});
});
