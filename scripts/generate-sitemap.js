// scripts/generate-sitemap.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import pkg from 'fast-glob';
import dotenv from 'dotenv';
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
const TODAY = new Date().toISOString().slice(0, 10);

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
	console.error('Missing Supabase environment variables');
	process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const STATIC_PAGES = [
	{ loc: `${SITE_URL}`, lastmod: TODAY },
	{ loc: `${SITE_URL}/blog`, lastmod: TODAY },
	{ loc: `${SITE_URL}/about`, lastmod: TODAY },
	{ loc: `${SITE_URL}/book-session`, lastmod: '2025-05-22' },
	{ loc: `${SITE_URL}/community`, lastmod: TODAY },
	{ loc: `${SITE_URL}/enneagram-corner`, lastmod: TODAY },
	{ loc: `${SITE_URL}/enneagram-corner/mental-health`, lastmod: TODAY },
	{ loc: `${SITE_URL}/enneagram-corner/subtopic/overview`, lastmod: '2024-05-04' },
	{ loc: `${SITE_URL}/enneagram-corner/subtopic/nine-types`, lastmod: '2024-05-04' },
	{ loc: `${SITE_URL}/enneagram-corner/subtopic/development`, lastmod: '2024-05-04' },
	{ loc: `${SITE_URL}/enneagram-corner/subtopic/relationships`, lastmod: '2024-05-04' },
	{ loc: `${SITE_URL}/enneagram-corner/subtopic/workplace`, lastmod: '2024-05-04' },
	{ loc: `${SITE_URL}/enneagram-corner/subtopic/resources`, lastmod: '2024-05-04' },
	{ loc: `${SITE_URL}/enneagram-corner/subtopic/situational`, lastmod: '2024-05-04' },
	{ loc: `${SITE_URL}/how-to-guides`, lastmod: TODAY },
	{ loc: `${SITE_URL}/personality-analysis`, lastmod: TODAY },
	{ loc: `${SITE_URL}/personality-analysis/categories`, lastmod: TODAY },
	{ loc: `${SITE_URL}/personality-analysis/categories/film-tv`, lastmod: TODAY },
	{ loc: `${SITE_URL}/personality-analysis/categories/creator-media`, lastmod: TODAY },
	{ loc: `${SITE_URL}/personality-analysis/categories/music`, lastmod: TODAY },
	{ loc: `${SITE_URL}/personality-analysis/categories/politics-public`, lastmod: TODAY },
	{ loc: `${SITE_URL}/personality-analysis/categories/tech-business`, lastmod: TODAY },
	{ loc: `${SITE_URL}/personality-analysis/categories/comedy`, lastmod: TODAY },
	{ loc: `${SITE_URL}/personality-analysis/categories/authors-thinkers`, lastmod: TODAY },
	{ loc: `${SITE_URL}/questions`, lastmod: TODAY },
	...Array.from({ length: 9 }, (_, index) => ({
		loc: `${SITE_URL}/personality-analysis/type/${index + 1}`,
		lastmod: '2024-08-29'
	})),
	{ loc: `${SITE_URL}/blog/experiment`, lastmod: '2024-09-13' }
];

function formatLastmod(value) {
	if (!value) return null;

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return null;

	return date.toISOString().slice(0, 10);
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
				const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);

				if (!frontmatterMatch) continue;

				const metadata = {};
				const lines = frontmatterMatch[1].split('\n');

				for (const line of lines) {
					const colonIndex = line.indexOf(':');
					if (colonIndex <= 0) continue;

					const key = line.substring(0, colonIndex).trim();
					let value = line.substring(colonIndex + 1).trim();

					if (
						(value.startsWith('"') && value.endsWith('"')) ||
						(value.startsWith("'") && value.endsWith("'"))
					) {
						value = value.slice(1, -1);
					}

					if (value === 'true') value = true;
					else if (value === 'false') value = false;

					metadata[key] = value;
				}

				if (metadata.published && metadata.loc) {
					posts.push(metadata);
				}
			} catch (error) {
				console.warn(`Could not read ${path.basename(file)}: ${error.message}`);
			}
		}
	}

	return posts;
}

async function getQuestions() {
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

	const dynamicEntries = [
		...posts.map(buildPostEntry),
		...peoplePosts.map(buildPostEntry),
		...questions.map((question) => ({
			loc: `${SITE_URL}/questions/${question.url}`,
			lastmod: formatLastmod(question.updated_at)
		}))
	].filter(Boolean);

	const entries = dedupeEntries([...STATIC_PAGES, ...dynamicEntries]).sort((a, b) =>
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

generateSitemap().catch((error) => {
	console.error('Error generating sitemap:', error);
	process.exit(1);
});
