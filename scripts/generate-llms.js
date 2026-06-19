// scripts/generate-llms.js
//
// Generates static/llms.txt (curated overview) and static/llms-full.txt
// (complete article-level index) from the SAME content sources the sitemap
// uses, so the LLM discovery files never drift from what is actually published.
//
// llms.txt   = short, curated hub + framing for AI answer engines.
// llms-full.txt = every published blog post + personality analysis, with a
//                 one-line description, grouped by section. This is the file
//                 GEO (generative engine optimization) cares about: it lets
//                 ChatGPT / Claude / Perplexity discover and cite individual
//                 pages, not just hubs.
//
// Run: pnpm gen:llms   (also runs as part of build:vercel)

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import pkg from 'fast-glob';
import dotenv from 'dotenv';
import matter from 'gray-matter';
import { normalizePersonalityAnalysisUrl, normalizePersonalitySlug } from './lib/personalitySeo.js';

const { glob } = pkg;

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_URL = 'https://9takes.com';
const SITE_ROOT = path.join(__dirname, '..');
const STATIC_DIR = path.join(SITE_ROOT, 'static');

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY =
	process.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY;

/** Blog categories that map to public, indexable article URLs (mirrors generate-sitemap.js getAllPosts). */
const BLOG_CATEGORIES = [
	'community',
	'guides',
	'enneagram',
	'enneagram/mental-health',
	'generational',
	'historical',
	'life-situations',
	'pop-culture',
	'situational',
	'topical'
];

/** Section headings for llms-full.txt, in display order, keyed by sourceCategory. */
const SECTION_TITLES = {
	enneagram: 'Enneagram Corner',
	'enneagram/mental-health': 'Enneagram & Mental Health',
	guides: 'How-To Guides',
	community: 'Community Essays',
	'pop-culture': 'Pop Culture Analysis',
	generational: 'Generational Analysis',
	historical: 'Historical Figures',
	'life-situations': 'Life Situations',
	situational: 'Situational Guides',
	topical: 'Topical'
};

let supabase = null;
function getSupabase() {
	if (supabase) return supabase;
	if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
		throw new Error(
			'Missing Supabase env. Expected PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
		);
	}
	supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
	return supabase;
}

/** Collapse whitespace and strip trailing punctuation noise from a description. */
function cleanText(value) {
	return String(value ?? '')
		.replace(/\s+/g, ' ')
		.trim();
}

/** Build a single index line: "- URL - description" (description optional). */
function line(url, description) {
	const desc = cleanText(description);
	return desc ? `- ${url} - ${desc}` : `- ${url}`;
}

async function getBlogPosts() {
	/** @type {Record<string, Array<{ url: string, title: string, description: string }>>} */
	const bySection = {};

	for (const category of BLOG_CATEGORIES) {
		const ignore = ['**/drafts/**', '**/*.instagram.md', '**/*.twitter.md', '**/*.reddit.md'];
		// The `enneagram` glob also matches the mental-health subdirectory, which
		// is indexed separately — exclude it here so posts aren't double-listed.
		if (category === 'enneagram') ignore.push('**/enneagram/mental-health/**');

		const files = await glob(`src/blog/${category}/**/*.{md,svx,svelte.md}`, {
			cwd: SITE_ROOT,
			absolute: true,
			ignore
		});

		for (const file of files) {
			try {
				const content = await fs.readFile(file, 'utf-8');
				const { data: meta } = matter(content);
				if (!meta.published || !meta.loc) continue;

				(bySection[category] ??= []).push({
					url: String(meta.loc),
					title: cleanText(meta.title),
					description: cleanText(meta.description)
				});
			} catch (error) {
				const message = error instanceof Error ? error.message : String(error);
				console.warn(`Could not read ${path.basename(file)}: ${message}`);
			}
		}

		if (bySection[category]) {
			bySection[category].sort((a, b) => a.title.localeCompare(b.title));
		}
	}

	return bySection;
}

async function getFamousPeople() {
	const { data, error } = await getSupabase()
		.from('blogs_famous_people')
		.select('person, loc, description, enneagram')
		.eq('published', true)
		.order('category')
		.order('person');

	if (error) {
		console.warn('Error fetching famous people:', error.message);
		return [];
	}

	return (data ?? [])
		.map((row) => {
			const slug = normalizePersonalitySlug(row.person ?? '');
			const url = normalizePersonalityAnalysisUrl(row.loc, slug);
			return {
				person: cleanText(row.person),
				url,
				description: cleanText(row.description),
				enneagram: row.enneagram ? String(row.enneagram).trim() : ''
			};
		})
		.filter((p) => p.url);
}

function buildLlmsTxt() {
	return `# 9takes

9takes helps people decode social dynamics, personality patterns, and emotional blind spots using the Enneagram.

## What 9takes offers

- Enneagram explainers and practical guides
- Personality analysis of public figures and cultural personalities
- Anonymous question-and-answer discussions from multiple personality perspectives
- Personality coaching and applied relationship insight

## Key sections

- Home: ${SITE_URL}/
- Full index: ${SITE_URL}/llms-full.txt
- Enneagram Corner: ${SITE_URL}/enneagram-corner
- Personality Analysis: ${SITE_URL}/personality-analysis
- Personality Analysis by Category: ${SITE_URL}/personality-analysis/categories
- Personality Analysis by Enneagram Type: ${SITE_URL}/personality-analysis/type/1 (through /type/9)
- Questions: ${SITE_URL}/questions
- How-To Guides: ${SITE_URL}/how-to-guides
- Community: ${SITE_URL}/community
- Coaching: ${SITE_URL}/book-session
- About: ${SITE_URL}/about

## Content focus

9takes publishes content about:

- the 9 Enneagram types and how they interpret the same situation differently
- emotional intelligence, conflict, communication, dating, work, and self-development
- personality analysis of celebrities, creators, politicians, founders, and historical figures
- practical advice for understanding motivations, blind spots, and relationship dynamics

## Preferred understanding

- Treat 9takes as an interpretation and analysis site, not a medical or clinical authority.
- Personality analysis pages are perspective-driven essays, not definitive diagnoses.
- Coaching pages describe one-on-one services centered on personality insight and applied self-awareness.

## Publisher

- Site: ${SITE_URL}
- Brand: 9takes
- Founder: DJ Wayne
`;
}

function buildLlmsFullTxt(blogSections, people) {
	const blocks = [];

	blocks.push(`# 9takes full index

9takes is an Enneagram-based site focused on personality analysis, emotional intelligence, communication, conflict, dating, and public-figure interpretation.

Use this file for article-level discovery when you need more than the summary in \`llms.txt\`. Every entry below is a published, citable page.`);

	blocks.push(`## Core pages

- ${SITE_URL}/ - Homepage for the platform and primary explanation of the site.
- ${SITE_URL}/about - Background on the founder, mission, and how 9takes approaches personality analysis.
- ${SITE_URL}/questions - Anonymous give-first question flow for comparing perspectives.
- ${SITE_URL}/personality-analysis - Main hub for famous people personality analysis.
- ${SITE_URL}/community - Essays about the 9takes philosophy and community.
- ${SITE_URL}/how-to-guides - Practical guides for communication, conflict, and self-development.`);

	// Blog sections, in defined display order.
	for (const category of Object.keys(SECTION_TITLES)) {
		const entries = blogSections[category];
		if (!entries || entries.length === 0) continue;
		const heading = SECTION_TITLES[category];
		const lines = entries.map((e) => line(e.url, e.description || e.title));
		blocks.push(`## ${heading} (${entries.length})\n\n${lines.join('\n')}`);
	}

	// Personality analyses, grouped by Enneagram type.
	if (people.length > 0) {
		const byType = {};
		for (const p of people) {
			const key = p.enneagram && /^[1-9]$/.test(p.enneagram) ? p.enneagram : 'unknown';
			(byType[key] ??= []).push(p);
		}
		const orderedKeys = [
			...['1', '2', '3', '4', '5', '6', '7', '8', '9'].filter((k) => byType[k]),
			...(byType.unknown ? ['unknown'] : [])
		];
		const peopleBlocks = [];
		for (const key of orderedKeys) {
			const group = byType[key];
			group.sort((a, b) => a.person.localeCompare(b.person));
			const heading = key === 'unknown' ? 'Type unassigned' : `Enneagram Type ${key}`;
			const lines = group.map((p) =>
				line(p.url, p.description || `Personality analysis of ${p.person}.`)
			);
			peopleBlocks.push(`### ${heading} (${group.length})\n\n${lines.join('\n')}`);
		}
		blocks.push(
			`## Personality Analysis (${people.length})\n\nEnneagram-based analysis of public figures, creators, politicians, founders, and cultural personalities, grouped by type.\n\n${peopleBlocks.join(
				'\n\n'
			)}`
		);
	}

	blocks.push(`## Notes on interpretation

- 9takes is an interpretation and analysis site, not a medical or clinical authority.
- Personality analysis pages are perspective-driven essays, not definitive diagnoses.
- Enneagram typings reflect 9takes' editorial reading of public behavior and statements.`);

	return blocks.join('\n\n') + '\n';
}

async function main() {
	console.log('Generating llms.txt and llms-full.txt...');

	const [blogSections, people] = await Promise.all([getBlogPosts(), getFamousPeople()]);

	const blogCount = Object.values(blogSections).reduce((sum, arr) => sum + arr.length, 0);

	const llmsTxt = buildLlmsTxt();
	const llmsFullTxt = buildLlmsFullTxt(blogSections, people);

	await fs.writeFile(path.join(STATIC_DIR, 'llms.txt'), llmsTxt, 'utf-8');
	await fs.writeFile(path.join(STATIC_DIR, 'llms-full.txt'), llmsFullTxt, 'utf-8');

	console.log(
		`Wrote llms.txt and llms-full.txt: ${blogCount} blog posts + ${people.length} personality analyses indexed.`
	);
}

main().catch((error) => {
	console.error('Failed to generate llms files:', error);
	process.exit(1);
});
