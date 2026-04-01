// scripts/generate-sitemap.js
import { execFileSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import pkg from 'fast-glob';
import dotenv from 'dotenv';
import matter from 'gray-matter';
import {
	buildPersonalityImagePath,
	normalizePersonalityAnalysisUrl,
	normalizePersonalitySlug
} from './lib/personalitySeo.js';

const { glob } = pkg;

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_URL = 'https://9takes.com';
const SITE_ROOT = path.join(__dirname, '..');

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

let supabase = null;

const ENNEAGRAM_SUBTOPIC_SLUGS = [
	'overview',
	'nine-types',
	'development',
	'relationships',
	'workplace',
	'resources',
	'situational'
];

const PERSONALITY_CATEGORY_DEFINITIONS = [
	{ slug: 'film-tv', rawTypes: ['movieStar', 'newMovieStar', 'celebrity'] },
	{
		slug: 'creator-media',
		rawTypes: ['creator', 'influencer', 'tiktoker', 'lifestyleInfluencer', 'journalist']
	},
	{ slug: 'music', rawTypes: ['musician'] },
	{ slug: 'politics-public', rawTypes: ['politician', 'historical', 'activist'] },
	{ slug: 'tech-business', rawTypes: ['techie', 'entrepreneur', 'business'] },
	{ slug: 'comedy', rawTypes: ['comedian'] },
	{ slug: 'authors-thinkers', rawTypes: ['author', 'psychology', 'essay'] }
];

const ROUTE_FILES = {
	home: ['src/routes/+page.svelte', 'src/routes/+page.server.ts', 'src/routes/+page.ts'],
	blog: [
		'src/routes/blog/+page.svelte',
		'src/routes/blog/+page.server.ts',
		'src/routes/blog/+layout.svelte'
	],
	about: ['src/routes/about/+page.svelte', 'src/routes/about/+page.server.ts'],
	bookSession: [
		'src/routes/book-session/+page.svelte',
		'src/routes/book-session/+page.server.ts',
		'src/routes/book-session/+page.ts'
	],
	community: ['src/routes/community/+page.svelte', 'src/routes/community/+page.server.ts'],
	enneagramCorner: [
		'src/routes/enneagram-corner/+page.svelte',
		'src/routes/enneagram-corner/+page.server.ts'
	],
	enneagramMentalHealth: [
		'src/routes/enneagram-corner/mental-health/+page.svelte',
		'src/routes/enneagram-corner/mental-health/+page.server.ts'
	],
	enneagramSubtopic: [
		'src/routes/enneagram-corner/subtopic/[slug]/+page.svelte',
		'src/routes/enneagram-corner/subtopic/[slug]/+page.server.ts'
	],
	howToGuides: [
		'src/routes/how-to-guides/+page.svelte',
		'src/routes/how-to-guides/+page.server.ts'
	],
	personalityAnalysis: [
		'src/routes/personality-analysis/+page.svelte',
		'src/routes/personality-analysis/+page.server.ts'
	],
	personalityCategories: [
		'src/routes/personality-analysis/categories/+page.svelte',
		'src/routes/personality-analysis/categories/+page.server.ts'
	],
	personalityCategory: [
		'src/routes/personality-analysis/categories/[slug]/+page.svelte',
		'src/routes/personality-analysis/categories/[slug]/+page.server.ts'
	],
	personalityType: [
		'src/routes/personality-analysis/type/[slug]/+page.svelte',
		'src/routes/personality-analysis/type/[slug]/+page.server.ts'
	],
	questions: [
		'src/routes/questions/+page.svelte',
		'src/routes/questions/+page.server.ts',
		'src/routes/questions/+page.ts'
	],
	blogExperiment: [
		'src/routes/blog/experiment/+page.svelte',
		'src/routes/blog/experiment/+page.server.ts'
	]
};

const gitDateCache = new Map();

function getSupabase() {
	if (supabase) return supabase;

	if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
		throw new Error('Missing Supabase environment variables');
	}

	supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
	return supabase;
}

function formatLastmod(value) {
	if (!value) return null;

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return null;

	return date.toISOString().slice(0, 10);
}

function normalizeTypeKey(value) {
	return String(value ?? '')
		.replace(/[^a-z0-9]/gi, '')
		.toLowerCase();
}

function normalizeTypeList(value) {
	let raw = [];

	if (Array.isArray(value)) {
		raw = value.map(String);
	} else if (value && typeof value === 'object') {
		raw = Object.values(value).map(String);
	} else if (typeof value === 'string' && value.trim().length > 0) {
		raw = value
			.split(',')
			.map((item) => item.trim())
			.filter(Boolean);
	}

	const seen = new Set();
	const normalized = [];

	for (const item of raw) {
		const cleaned = item.trim().replace(/^['"]|['"]$/g, '');
		const key = normalizeTypeKey(cleaned);
		if (!key || seen.has(key)) continue;
		seen.add(key);
		normalized.push(cleaned);
	}

	return normalized;
}

function getPrimaryPostType(value) {
	return normalizeTypeList(value)[0] ?? null;
}

function getPersonalityCategorySlugs(value) {
	const typeKeys = new Set(normalizeTypeList(value).map((type) => normalizeTypeKey(type)));

	return PERSONALITY_CATEGORY_DEFINITIONS.filter((category) =>
		category.rawTypes.some((rawType) => typeKeys.has(normalizeTypeKey(rawType)))
	).map((category) => category.slug);
}

function getPathname(loc) {
	if (typeof loc !== 'string' || loc.trim().length === 0) return '';

	try {
		return new URL(loc).pathname.replace(/\/+$/, '') || '/';
	} catch {
		return (
			loc
				.replace(SITE_URL, '')
				.replace(/[?#].*$/, '')
				.replace(/\/+$/, '') || '/'
		);
	}
}

function getLatestDate(values) {
	let latest = null;
	let latestTimestamp = Number.NEGATIVE_INFINITY;

	for (const value of values) {
		const lastmod = formatLastmod(value);
		if (!lastmod) continue;

		const timestamp = Date.parse(lastmod);
		if (!Number.isFinite(timestamp) || timestamp <= latestTimestamp) continue;

		latest = lastmod;
		latestTimestamp = timestamp;
	}

	return latest;
}

function maxLastmod(...values) {
	return getLatestDate(
		values.flatMap((value) => {
			if (Array.isArray(value)) return value;
			return value == null ? [] : [value];
		})
	);
}

function getLatestItemDate(items, selector) {
	return getLatestDate(items.map(selector));
}

function getLatestGitDate(paths) {
	const validPaths = paths.filter(Boolean);
	if (validPaths.length === 0) return null;

	const cacheKey = validPaths.join('|');
	if (gitDateCache.has(cacheKey)) {
		return gitDateCache.get(cacheKey);
	}

	try {
		const output = execFileSync('git', ['log', '-1', '--format=%cs', '--', ...validPaths], {
			cwd: SITE_ROOT,
			encoding: 'utf-8',
			stdio: ['ignore', 'pipe', 'ignore']
		}).trim();
		const lastmod = formatLastmod(output);
		gitDateCache.set(cacheKey, lastmod);
		return lastmod;
	} catch {
		gitDateCache.set(cacheKey, null);
		return null;
	}
}

function isEnneagramPost(post) {
	return typeof post.sourceCategory === 'string' && post.sourceCategory.startsWith('enneagram');
}

function isMentalHealthPost(post) {
	const pathname = getPathname(post.loc);
	return (
		isEnneagramPost(post) &&
		(post.sourceCategory === 'enneagram/mental-health' ||
			normalizeTypeKey(getPrimaryPostType(post.type)) === normalizeTypeKey('mental-health') ||
			pathname.includes('/enneagram-corner/mental-health/') ||
			pathname.includes('enneagram-and-mental-illness'))
	);
}

function isPersonalityTypePost(person, enneagram) {
	return String(person.enneagram ?? '') === String(enneagram);
}

function isPersonalityCategoryPost(person, categorySlug) {
	return getPersonalityCategorySlugs(person.type).includes(categorySlug);
}

function resolveStaticLastmod({
	contentDates = [],
	routePaths = [],
	fallbackLastmod = null,
	siteFallbackLastmod = null
}) {
	return (
		maxLastmod(contentDates, getLatestGitDate(routePaths), fallbackLastmod) ?? siteFallbackLastmod
	);
}

export function buildStaticPages({ posts, peoplePosts, questions }) {
	const latestAllPosts = getLatestItemDate(posts, (post) => post.lastmod ?? post.date);
	const latestBlogContent = getLatestItemDate(posts, (post) =>
		post.sourceCategory === 'community' ||
		post.sourceCategory === 'guides' ||
		post.sourceCategory === 'pop-culture' ||
		isEnneagramPost(post)
			? (post.lastmod ?? post.date)
			: null
	);
	const latestPeople = getLatestItemDate(peoplePosts, (person) => person.lastmod ?? person.date);
	const latestQuestions = getLatestItemDate(questions, (question) => question.updated_at);
	const latestCommunity = getLatestItemDate(posts, (post) =>
		post.sourceCategory === 'community' ? (post.lastmod ?? post.date) : null
	);
	const latestGuides = getLatestItemDate(posts, (post) =>
		post.sourceCategory === 'guides' ? (post.lastmod ?? post.date) : null
	);
	const latestEnneagram = getLatestItemDate(posts, (post) =>
		isEnneagramPost(post) ? (post.lastmod ?? post.date) : null
	);
	const latestMentalHealth = getLatestItemDate(posts, (post) =>
		isMentalHealthPost(post) ? (post.lastmod ?? post.date) : null
	);
	const siteFallbackLastmod = maxLastmod(
		latestAllPosts,
		latestPeople,
		latestQuestions,
		getLatestGitDate(['src/routes'])
	);

	return [
		{
			loc: `${SITE_URL}`,
			lastmod: resolveStaticLastmod({
				contentDates: [latestPeople, latestQuestions],
				routePaths: ROUTE_FILES.home,
				siteFallbackLastmod
			})
		},
		{
			loc: `${SITE_URL}/blog`,
			lastmod: resolveStaticLastmod({
				contentDates: [latestBlogContent, latestPeople],
				routePaths: ROUTE_FILES.blog,
				siteFallbackLastmod
			})
		},
		{
			loc: `${SITE_URL}/about`,
			lastmod: resolveStaticLastmod({
				routePaths: ROUTE_FILES.about,
				siteFallbackLastmod
			})
		},
		{
			loc: `${SITE_URL}/book-session`,
			lastmod: resolveStaticLastmod({
				routePaths: ROUTE_FILES.bookSession,
				fallbackLastmod: '2025-05-22',
				siteFallbackLastmod
			})
		},
		{
			loc: `${SITE_URL}/community`,
			lastmod: resolveStaticLastmod({
				contentDates: [latestCommunity],
				routePaths: ROUTE_FILES.community,
				siteFallbackLastmod
			})
		},
		{
			loc: `${SITE_URL}/enneagram-corner`,
			lastmod: resolveStaticLastmod({
				contentDates: [latestEnneagram],
				routePaths: ROUTE_FILES.enneagramCorner,
				siteFallbackLastmod
			})
		},
		{
			loc: `${SITE_URL}/enneagram-corner/mental-health`,
			lastmod: resolveStaticLastmod({
				contentDates: [latestMentalHealth],
				routePaths: ROUTE_FILES.enneagramMentalHealth,
				siteFallbackLastmod
			})
		},
		...ENNEAGRAM_SUBTOPIC_SLUGS.map((slug) => ({
			loc: `${SITE_URL}/enneagram-corner/subtopic/${slug}`,
			lastmod: resolveStaticLastmod({
				contentDates: [
					getLatestItemDate(posts, (post) =>
						normalizeTypeKey(getPrimaryPostType(post.type)) === normalizeTypeKey(slug)
							? (post.lastmod ?? post.date)
							: null
					)
				],
				routePaths: ROUTE_FILES.enneagramSubtopic,
				fallbackLastmod: '2024-05-04',
				siteFallbackLastmod
			})
		})),
		{
			loc: `${SITE_URL}/how-to-guides`,
			lastmod: resolveStaticLastmod({
				contentDates: [latestGuides],
				routePaths: ROUTE_FILES.howToGuides,
				siteFallbackLastmod
			})
		},
		{
			loc: `${SITE_URL}/personality-analysis`,
			lastmod: resolveStaticLastmod({
				contentDates: [latestPeople],
				routePaths: ROUTE_FILES.personalityAnalysis,
				siteFallbackLastmod
			})
		},
		{
			loc: `${SITE_URL}/personality-analysis/categories`,
			lastmod: resolveStaticLastmod({
				contentDates: [latestPeople],
				routePaths: ROUTE_FILES.personalityCategories,
				siteFallbackLastmod
			})
		},
		...PERSONALITY_CATEGORY_DEFINITIONS.map((category) => ({
			loc: `${SITE_URL}/personality-analysis/categories/${category.slug}`,
			lastmod: resolveStaticLastmod({
				contentDates: [
					getLatestItemDate(peoplePosts, (person) =>
						isPersonalityCategoryPost(person, category.slug)
							? (person.lastmod ?? person.date)
							: null
					)
				],
				routePaths: ROUTE_FILES.personalityCategory,
				siteFallbackLastmod
			})
		})),
		{
			loc: `${SITE_URL}/questions`,
			lastmod: resolveStaticLastmod({
				contentDates: [latestQuestions],
				routePaths: ROUTE_FILES.questions,
				siteFallbackLastmod
			})
		},
		...Array.from({ length: 9 }, (_, index) => {
			const enneagram = index + 1;
			return {
				loc: `${SITE_URL}/personality-analysis/type/${enneagram}`,
				lastmod: resolveStaticLastmod({
					contentDates: [
						getLatestItemDate(peoplePosts, (person) =>
							isPersonalityTypePost(person, enneagram) ? (person.lastmod ?? person.date) : null
						)
					],
					routePaths: ROUTE_FILES.personalityType,
					fallbackLastmod: '2024-08-29',
					siteFallbackLastmod
				})
			};
		}),
		{
			loc: `${SITE_URL}/blog/experiment`,
			lastmod: resolveStaticLastmod({
				routePaths: ROUTE_FILES.blogExperiment,
				fallbackLastmod: '2024-09-13',
				siteFallbackLastmod
			})
		}
	];
}

function renderUrlEntry(entry) {
	const imageBlock = entry.imageLoc
		? `
    <image:image>
      <image:loc>${entry.imageLoc}</image:loc>
    </image:image>`
		: '';

	return `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>${imageBlock}
  </url>`;
}

function dedupeEntries(entries) {
	const byLoc = new Map();

	for (const entry of entries) {
		if (!entry.loc || !entry.lastmod) continue;
		byLoc.set(entry.loc, entry);
	}

	return [...byLoc.values()];
}

async function getAllPosts() {
	const categories = [
		'community',
		'guides',
		'enneagram',
		'enneagram/mental-health',
		'generational',
		'historical',
		'life-situations',
		'people',
		'pop-culture',
		'situational',
		'topical'
	];

	const posts = [];

	for (const category of categories) {
		const files = await glob(`src/blog/${category}/*.{md,svx,svelte.md}`, {
			cwd: path.join(__dirname, '..'),
			absolute: true
		});

		for (const file of files) {
			try {
				const content = await fs.readFile(file, 'utf-8');
				const { data: metadata } = matter(content);

				if (metadata.published && metadata.loc) {
					posts.push({
						...metadata,
						sourceCategory: category
					});
				}
			} catch (error) {
				console.warn(`Could not read ${path.basename(file)}: ${error.message}`);
			}
		}
	}

	return posts;
}

async function getQuestions() {
	const supabase = getSupabase();
	const { data, error } = await supabase
		.from('questions')
		.select('url, updated_at')
		.eq('flagged', false)
		.eq('removed', false)
		.eq('tagged', true)
		.order('updated_at');

	if (error) {
		console.warn('Error fetching questions:', error.message);
		return [];
	}

	return data ?? [];
}

async function getFamousPeople() {
	const supabase = getSupabase();
	const { data, error } = await supabase
		.from('blogs_famous_people')
		.select('*')
		.eq('published', true)
		.order('lastmod')
		.order('person');

	if (error) {
		console.warn('Error fetching famous people posts:', error.message);
		return [];
	}

	return (data ?? []).map((person) => ({
		...person,
		slug: normalizePersonalitySlug(person.person)
	}));
}

function buildPostEntry(post) {
	const loc =
		post.loc?.includes('personality-analysis') || post.person
			? normalizePersonalityAnalysisUrl(post.loc, post.person ?? post.slug)
			: post.loc;

	const lastmod = formatLastmod(post.lastmod ?? post.date);
	if (!loc || !lastmod) return null;

	if (post.person || loc.includes('/personality-analysis/')) {
		const imagePath = buildPersonalityImagePath(post.enneagram, post.person ?? post.slug);
		return {
			loc,
			lastmod,
			...(imagePath && { imageLoc: `${SITE_URL}${imagePath}` })
		};
	}

	if (post.pic) {
		return {
			loc,
			lastmod,
			imageLoc: `${SITE_URL}/blogs/${post.pic}.webp`
		};
	}

	return { loc, lastmod };
}

async function generateSitemap() {
	console.log('Generating sitemap...');

	const [posts, peoplePosts, questions] = await Promise.all([
		getAllPosts(),
		getFamousPeople(),
		getQuestions()
	]);
	const staticPages = buildStaticPages({ posts, peoplePosts, questions });

	const dynamicEntries = [
		...posts.map(buildPostEntry),
		...peoplePosts.map(buildPostEntry),
		...questions.map((question) => ({
			loc: `${SITE_URL}/questions/${question.url}`,
			lastmod: formatLastmod(question.updated_at)
		}))
	].filter(Boolean);

	const entries = dedupeEntries([...staticPages, ...dynamicEntries]).sort((a, b) =>
		a.loc.localeCompare(b.loc)
	);

	const xml = `<?xml version="1.0" encoding="utf-8" standalone="yes" ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.map(renderUrlEntry).join('\n')}
</urlset>`;

	const sitemapPath = path.join(__dirname, '..', 'static', 'sitemap.xml');
	await fs.writeFile(sitemapPath, xml, 'utf-8');

	const stats = await fs.stat(sitemapPath);
	console.log(`Sitemap generated at static/sitemap.xml (${(stats.size / 1024).toFixed(2)} KB)`);
	console.log(`Total URLs: ${entries.length}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
	generateSitemap().catch((error) => {
		console.error('Error generating sitemap:', error);
		process.exit(1);
	});
}
