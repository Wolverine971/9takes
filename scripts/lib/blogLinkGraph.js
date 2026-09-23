// scripts/lib/blogLinkGraph.js

/**
 * Shared internal-link graph for the MDsvex blog corpus + personality-analysis pages.
 *
 * Used by scripts/generate-crosslink-report.js (report + opportunity queue) and
 * scripts/check-crosslinks.mjs (publish gate). Liveness mirrors the SvelteKit
 * routes, not a guess: a blog file is live when a route glob serves it AND its
 * frontmatter `published` is truthy (the same check the [slug]/+page.ts loaders
 * make before throwing 404). Keep SECTION_RULES in sync with those globs.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

export const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const BLOG_DIR = path.join(REPO_ROOT, 'src/blog');
export const PEOPLE_DRAFTS_DIR = path.join(REPO_ROOT, 'src/blog/people/drafts');
export const FAMOUS_TYPES_FILE = path.join(
	REPO_ROOT,
	'src/lib/components/molecules/famousTypes.ts'
);
export const ENNEAGRAM_SLUG_ROUTE = path.join(
	REPO_ROOT,
	'src/routes/enneagram-corner/[slug]/+page.ts'
);
export const GSC_DIR = path.join(REPO_ROOT, 'docs/data/gsc');

const SOCIAL_VARIANT = /\.(instagram|twitter|reddit|review)\.md$/;

// Mirrors the import.meta.glob patterns in src/routes/<section>/[slug]/+page.ts.
// Order matters: mental-health must match before the enneagram catch-all.
export const SECTION_RULES = [
	{
		section: 'enneagram-corner',
		dir: 'enneagram/mental-health',
		base: '/enneagram-corner/mental-health',
		exclude: [SOCIAL_VARIANT]
	},
	{
		section: 'enneagram-corner',
		dir: 'enneagram',
		base: '/enneagram-corner',
		exclude: [SOCIAL_VARIANT, /^blog-optimization-strategies\.md$/]
	},
	{
		section: 'community',
		dir: 'community',
		base: '/community',
		exclude: [/^societal-ticking-time-bombs-fact-check\.md$/]
	},
	{
		section: 'how-to-guides',
		dir: 'guides',
		base: '/how-to-guides',
		exclude: [/^personality-maxing-notes\.md$/]
	},
	{
		section: 'pop-culture',
		dir: 'pop-culture',
		base: '/pop-culture',
		exclude: [/-twitter\.md$/, /^incel-exit-post\.md$/]
	}
];

export const BLOG_URL_PREFIX = /^\/(enneagram-corner|community|how-to-guides|pop-culture)\//;
export const PEOPLE_URL_PREFIX = '/personality-analysis/';
const TYPE_PAGE = /^\/enneagram-corner\/enneagram-type-[1-9]$/;
const NON_PERSON_PEOPLE_PATHS = /^\/personality-analysis\/(type|categories|map)(\/|$)/;
const ASSET_EXT = /\.(png|jpe?g|webp|avif|svg|gif|pdf|mp4|mp3|xml|txt|json)$/i;

export function isTypePage(url) {
	return TYPE_PAGE.test(url);
}

export function isPersonUrl(url) {
	return url.startsWith(PEOPLE_URL_PREFIX) && !NON_PERSON_PEOPLE_PATHS.test(url);
}

export function sectionOf(url) {
	if (url.startsWith(PEOPLE_URL_PREFIX)) return 'people';
	return url.split('/')[1] || '';
}

/** Port of normalizePersonalitySlug in src/lib/utils/personalityAnalysis.ts. */
export function normalizePersonalitySlug(slug) {
	if (typeof slug !== 'string') return '';
	return slug
		.trim()
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/['\u2019.]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

/**
 * Strip origin, query, hash, trailing slash; canonicalize person slugs the way
 * the personality-analysis route does. Returns null for non-internal hrefs.
 */
export function normalizeInternalHref(href) {
	if (!href) return null;
	let value = String(href).trim();
	value = value.replace(/^https?:\/\/(www\.)?9takes\.com/i, '');
	if (!value.startsWith('/') || value.startsWith('//')) return null;
	value = value.split('#')[0].split('?')[0];
	if (value.length > 1) value = value.replace(/\/+$/, '');
	if (!value || ASSET_EXT.test(value)) return null;
	if (value.startsWith(PEOPLE_URL_PREFIX) && !NON_PERSON_PEOPLE_PATHS.test(value)) {
		const slug = value.slice(PEOPLE_URL_PREFIX.length).split('/')[0];
		const canonical = normalizePersonalitySlug(decodeURIComponent(slug));
		if (canonical) value = `${PEOPLE_URL_PREFIX}${canonical}`;
	}
	return value;
}

const LINK_PATTERNS = [
	// markdown: [anchor](/path) — anchor captured when present
	/\[([^\]]*)\]\(\s*<?((?:https?:\/\/(?:www\.)?9takes\.com)?\/[^)\s>]*)>?(?:\s+"[^"]*")?\s*\)/g,
	// html / svelte: href="/path", href={'/path'}, href={`/path`}
	/href\s*=\s*\{?\s*["'`]((?:https?:\/\/(?:www\.)?9takes\.com)?\/[^"'`]*)["'`]/g,
	// component props / object literals: link: '/path', url="/path"
	/\b(?:link|url|to)\s*[:=]\s*["'`]((?:https?:\/\/(?:www\.)?9takes\.com)?\/[^"'`]*)["'`]/g
];

/**
 * Extract internal link targets from a markdown/svelte body.
 * Returns unique normalized paths in first-seen order with the 1-based line of first use.
 */
export function extractInternalLinks(body) {
	const found = new Map();
	const lineStarts = [0];
	for (let i = 0; i < body.length; i++) if (body[i] === '\n') lineStarts.push(i + 1);
	const lineOf = (index) => {
		let lo = 0;
		let hi = lineStarts.length - 1;
		while (lo < hi) {
			const mid = (lo + hi + 1) >> 1;
			if (lineStarts[mid] <= index) lo = mid;
			else hi = mid - 1;
		}
		return lo + 1;
	};

	for (const [i, pattern] of LINK_PATTERNS.entries()) {
		pattern.lastIndex = 0;
		for (const match of body.matchAll(pattern)) {
			const href = i === 0 ? match[2] : match[1];
			const url = normalizeInternalHref(href);
			if (!url) continue;
			if (!found.has(url)) {
				found.set(url, { url, line: lineOf(match.index), anchor: i === 0 ? match[1] : null });
			}
		}
	}
	return [...found.values()].sort((a, b) => a.line - b.line);
}

function walkMarkdown(dir, out = []) {
	if (!fs.existsSync(dir)) return out;
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			if (entry.name === 'drafts' || entry.name === 'people') continue;
			walkMarkdown(full, out);
		} else if (entry.name.endsWith('.md')) {
			out.push(full);
		}
	}
	return out;
}

/** Slugs the enneagram-corner route 301s elsewhere (superseded posts). */
export function loadEnneagramRedirects(routeFile = ENNEAGRAM_SLUG_ROUTE) {
	const redirects = new Map();
	if (!fs.existsSync(routeFile)) return redirects;
	const source = fs.readFileSync(routeFile, 'utf8');
	const block = source.match(/permanentRedirectMap[^{]*\{([\s\S]*?)\n\};/);
	if (!block) return redirects;
	for (const m of block[1].matchAll(/'([a-z0-9-]+)'\s*:\s*'([^']+)'/g)) {
		redirects.set(`/enneagram-corner/${m[1]}`, m[2]);
	}
	return redirects;
}

function routeFor(rel) {
	const dir = path.posix.dirname(rel);
	const file = path.posix.basename(rel);
	for (const rule of SECTION_RULES) {
		if (dir !== rule.dir) continue;
		if (file === 'template.md' || rule.exclude.some((re) => re.test(file))) {
			return { rule, url: null, excluded: true };
		}
		return { rule, url: `${rule.base}/${file.replace(/\.md$/, '')}`, excluded: false };
	}
	return { rule: null, url: null, excluded: false };
}

function wordCount(text) {
	return text
		.replace(/<script[\s\S]*?<\/script>/g, ' ')
		.replace(/<[^>]+>/g, ' ')
		.split(/\s+/)
		.filter(Boolean).length;
}

/**
 * Load every non-draft markdown file under src/blog and classify it.
 * status: live | draft | redirected | no-frontmatter | excluded | not-routable
 */
export function loadBlogCorpus({ blogDir = BLOG_DIR, redirects = loadEnneagramRedirects() } = {}) {
	const files = walkMarkdown(blogDir).map((full) =>
		path.relative(blogDir, full).split(path.sep).join('/')
	);
	const posts = [];

	for (const rel of files.sort()) {
		const raw = fs.readFileSync(path.join(blogDir, rel), 'utf8');
		let data = {};
		let body = raw;
		let parseError = null;
		try {
			const parsed = matter(raw);
			data = parsed.data ?? {};
			body = parsed.content;
		} catch (error) {
			parseError = String(error.message).split('\n')[0];
		}

		const route = routeFor(rel);
		const hasFrontmatter = Object.keys(data).length > 0;
		const published = Boolean(data.published);
		let status;
		if (!route.rule) status = 'not-routable';
		else if (route.excluded) status = 'excluded';
		else if (!hasFrontmatter) status = 'no-frontmatter';
		else if (published) status = 'live';
		else if (route.url && redirects.has(route.url)) status = 'redirected';
		else status = 'draft';

		posts.push({
			rel,
			url: route.url,
			section: route.url ? sectionOf(route.url) : null,
			slug: path.posix.basename(rel, '.md'),
			status,
			live: status === 'live',
			title: typeof data.title === 'string' ? data.title : null,
			metaTitle: typeof data.meta_title === 'string' ? data.meta_title : null,
			description: typeof data.description === 'string' ? data.description : null,
			date: data.date ? String(data.date).slice(0, 10) : null,
			enneagram: data.enneagram ?? null,
			type: Array.isArray(data.type) ? data.type : data.type ? [data.type] : [],
			popCulture: data.popCulture ?? null,
			redirectTo: route.url ? (redirects.get(route.url) ?? null) : null,
			parseError,
			words: wordCount(body),
			body,
			// body line N lives at file line N + bodyLineOffset
			bodyLineOffset: raw.split('\n').length - body.split('\n').length,
			links: extractInternalLinks(body)
		});
	}
	return posts;
}

function titleCaseSlug(slug) {
	return slug
		.split('-')
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}

/**
 * Published personality-analysis pages. Roster = famousTypes.ts entries with
 * link: true (generated from the DB at build time) plus local drafts marked
 * published (covers rows added since the last gen:famous-types run).
 * Display names come from the draft title ("Aaron Pierre: An Enneagram…").
 */
export function loadPeople({
	famousTypesFile = FAMOUS_TYPES_FILE,
	draftsDir = PEOPLE_DRAFTS_DIR
} = {}) {
	const people = new Map();
	const add = (slug, fields) => {
		const url = `${PEOPLE_URL_PREFIX}${slug}`;
		const existing = people.get(url) ?? {
			url,
			slug,
			name: titleCaseSlug(slug),
			enneagram: null,
			links: [],
			body: '',
			draftFile: null
		};
		people.set(url, { ...existing, ...fields });
	};

	if (fs.existsSync(famousTypesFile)) {
		const source = fs.readFileSync(famousTypesFile, 'utf8');
		let currentType = null;
		for (const line of source.split('\n')) {
			const typeMatch = line.match(/^\s*(\d):\s*\[/);
			if (typeMatch) currentType = Number(typeMatch[1]);
			const person = line.match(/name:\s*'([^']+)',\s*link:\s*(true|false)/);
			if (person && person[2] === 'true') {
				add(normalizePersonalitySlug(person[1]), { enneagram: currentType });
			}
		}
	}

	if (fs.existsSync(draftsDir)) {
		for (const file of fs.readdirSync(draftsDir).filter((f) => f.endsWith('.md'))) {
			const raw = fs.readFileSync(path.join(draftsDir, file), 'utf8');
			let parsed;
			try {
				parsed = matter(raw);
			} catch {
				continue;
			}
			const data = parsed.data ?? {};
			const body = parsed.content;
			const fromLoc = typeof data.loc === 'string' ? normalizeInternalHref(data.loc) : null;
			const slug =
				fromLoc && fromLoc.startsWith(PEOPLE_URL_PREFIX)
					? fromLoc.slice(PEOPLE_URL_PREFIX.length)
					: normalizePersonalitySlug(file.replace(/\.md$/, ''));
			const url = `${PEOPLE_URL_PREFIX}${slug}`;
			if (!people.has(url) && !data.published) continue;
			const titleName = typeof data.title === 'string' ? data.title.split(':')[0].trim() : '';
			add(slug, {
				name: titleName && titleName.length <= 40 ? titleName : titleCaseSlug(slug),
				enneagram: people.get(url)?.enneagram ?? (Number(data.enneagram) || null),
				links: extractInternalLinks(body),
				body,
				draftFile: path.relative(REPO_ROOT, path.join(draftsDir, file))
			});
		}
	}
	return people;
}

/**
 * Build the link graph over live blog posts + published people pages.
 * Nodes are keyed by URL. Edge counts are unique (source, target) pairs.
 */
export function buildLinkGraph({ posts, people, redirects = loadEnneagramRedirects() }) {
	const nodes = new Map();
	for (const post of posts.filter((p) => p.live)) {
		nodes.set(post.url, {
			kind: isTypePage(post.url) ? 'type-page' : 'blog',
			url: post.url,
			section: post.section,
			title: post.title,
			post,
			inBlog: new Set(),
			inPeople: new Set(),
			outBlog: [],
			outPeople: [],
			outOther: [],
			broken: [],
			viaRedirect: []
		});
	}
	for (const person of people.values()) {
		nodes.set(person.url, {
			kind: 'person',
			url: person.url,
			section: 'people',
			title: person.name,
			person,
			inBlog: new Set(),
			inPeople: new Set(),
			outBlog: [],
			outPeople: [],
			outOther: [],
			broken: [],
			viaRedirect: []
		});
	}

	const classify = (source, links) => {
		for (const { url } of links) {
			if (url === source.url) continue;
			const target = nodes.get(url);
			if (target && target.kind !== 'person') {
				source.outBlog.push(url);
				(source.kind === 'person' ? target.inPeople : target.inBlog).add(source.url);
			} else if (target) {
				source.outPeople.push(url);
				(source.kind === 'person' ? target.inPeople : target.inBlog).add(source.url);
			} else if (redirects.has(url)) {
				source.viaRedirect.push({ url, to: redirects.get(url) });
			} else if (BLOG_URL_PREFIX.test(url) && !url.startsWith('/enneagram-corner/subtopic/')) {
				source.broken.push(url);
			} else if (isPersonUrl(url)) {
				source.broken.push(url);
			} else {
				source.outOther.push(url);
			}
		}
	};

	for (const node of nodes.values()) {
		const links = node.kind === 'person' ? node.person.links : node.post.links;
		classify(node, links);
	}

	for (const node of nodes.values()) {
		node.inCount = node.inBlog.size + node.inPeople.size;
		node.outCount = node.outBlog.length + node.outPeople.length;
	}
	return nodes;
}

function parseCsvLine(line) {
	const cells = [];
	let cell = '';
	let quoted = false;
	for (let i = 0; i < line.length; i++) {
		const ch = line[i];
		if (quoted) {
			if (ch === '"' && line[i + 1] === '"') {
				cell += '"';
				i++;
			} else if (ch === '"') quoted = false;
			else cell += ch;
		} else if (ch === '"') quoted = true;
		else if (ch === ',') {
			cells.push(cell);
			cell = '';
		} else cell += ch;
	}
	cells.push(cell);
	return cells;
}

function parseCsv(text) {
	const lines = text.split('\n').filter((line) => line.trim());
	const header = parseCsvLine(lines.shift());
	return lines.map((line) => {
		const cells = parseCsvLine(line);
		const row = {};
		header.forEach((col, idx) => {
			const value = cells[idx] ?? '';
			row[col] = ['clicks', 'impressions', 'ctr_pct', 'position'].includes(col)
				? Number(value)
				: value;
		});
		return row;
	});
}

/** Latest Google Search Console drop (docs/data/gsc/latest.json). Null when absent. */
export function loadGsc(gscDir = GSC_DIR) {
	const pointer = path.join(gscDir, 'latest.json');
	if (!fs.existsSync(pointer)) return null;
	const latest = JSON.parse(fs.readFileSync(pointer, 'utf8'));
	const toPath = (page) => normalizeInternalHref(page) ?? '/';
	const pages = new Map();
	const pagesFile = path.join(gscDir, latest.files.pages);
	if (fs.existsSync(pagesFile)) {
		// GSC reports #fragment (jump-link) and mixed-case variants as separate
		// rows. Keep the canonical row's impressions/position (fragment rows share
		// the same SERP, so summing impressions would double count) and add every
		// variant's clicks. Without a canonical row, the biggest variant stands in.
		const rows = parseCsv(fs.readFileSync(pagesFile, 'utf8'));
		for (const row of rows) {
			const key = toPath(row.page);
			const isCanonical =
				row.page.replace(/^https?:\/\/(www\.)?9takes\.com/i, '').replace(/\/$/, '') === key;
			const prev = pages.get(key);
			const clicks = (prev?.clicks ?? 0) + row.clicks;
			const replace =
				!prev ||
				(isCanonical && !prev.canonical) ||
				(!prev.canonical && row.impressions > prev.impressions);
			pages.set(
				key,
				replace
					? { clicks, impressions: row.impressions, position: row.position, canonical: isCanonical }
					: { ...prev, clicks }
			);
		}
		for (const stats of pages.values()) {
			stats.ctr = stats.impressions
				? Math.round((stats.clicks / stats.impressions) * 10000) / 100
				: 0;
			delete stats.canonical;
		}
	}
	const queries = new Map();
	const pqFile = path.join(gscDir, latest.files.pageQuery ?? '');
	if (latest.files.pageQuery && fs.existsSync(pqFile)) {
		for (const row of parseCsv(fs.readFileSync(pqFile, 'utf8'))) {
			const key = toPath(row.page);
			if (!queries.has(key)) queries.set(key, []);
			queries.get(key).push({
				query: row.query,
				clicks: row.clicks,
				impressions: row.impressions,
				position: row.position
			});
		}
	}
	return { runDate: latest.runDate, window: latest.window, pages, queries };
}
