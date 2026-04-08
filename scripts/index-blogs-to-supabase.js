// scripts/index-blogs-to-supabase.js
// #!/usr/bin/env node

/**
 * Script to index file-backed blog content into Supabase search tables.
 *
 * Usage:
 *   node scripts/index-blogs-to-supabase.js            # Index changed blogs
 *   node scripts/index-blogs-to-supabase.js --dry-run  # Preview actions
 *   node scripts/index-blogs-to-supabase.js --force    # Re-index all scanned blogs
 *   node scripts/index-blogs-to-supabase.js --if-env   # Exit 0 when Supabase env is missing
 *
 * Environment variables required for write mode:
 *   SUPABASE_URL or PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_KEY
 */

import { createHash } from 'node:crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { marked } from 'marked';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import matter from 'gray-matter';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// ============================================
// CONFIGURATION - All blog directories
// ============================================
const BLOG_DIRECTORIES = [
	// Main enneagram content (includes mental-health subdirectory)
	{ path: 'src/blog/enneagram', category: 'enneagram', route: '/enneagram-corner' },

	// Community content
	{ path: 'src/blog/community', category: 'community', route: '/community' },

	// How-to guides
	{ path: 'src/blog/guides', category: 'guides', route: '/how-to-guides' },

	// Pop culture content
	{ path: 'src/blog/pop-culture', category: 'pop-culture', route: '/pop-culture' },

	// Topical content
	{ path: 'src/blog/topical', category: 'topical', route: '/blog/topical' },

	// Life situations
	{ path: 'src/blog/life-situations', category: 'life-situations', route: '/enneagram-corner' },

	// Generational content
	{ path: 'src/blog/generational', category: 'generational', route: '/enneagram-corner' },

	// Historical content
	{ path: 'src/blog/historical', category: 'historical', route: '/enneagram-corner' },

	// Situational content
	{ path: 'src/blog/situational', category: 'situational', route: '/enneagram-corner' },

	// Overview content
	{ path: 'src/blog/overview', category: 'overview', route: '/enneagram-corner' },

	// Lifestyle content
	{ path: 'src/blog/life-style', category: 'life-style', route: '/enneagram-corner' }

	// NOTE: src/blog/people is handled separately via blogs_famous_people
];

const ROUTE_MAP = {
	enneagram: '/enneagram-corner',
	'mental-health': '/enneagram-corner/mental-health',
	community: '/community',
	guides: '/how-to-guides',
	'pop-culture': '/pop-culture',
	topical: '/blog/topical',
	'life-situations': '/enneagram-corner',
	generational: '/enneagram-corner',
	historical: '/enneagram-corner',
	situational: '/enneagram-corner',
	overview: '/enneagram-corner',
	'life-style': '/enneagram-corner'
};

const SKIP_PATTERNS = [
	'.instagram.md',
	'.twitter.md',
	'.reddit.md',
	'.review.md',
	'/drafts/',
	'-outline.md',
	'DRAFTS-INDEX.md',
	'OUTLINES-SUMMARY.md',
	'template.md',
	'topic-map.md'
];

const TRACKED_BLOG_PATH_PREFIX = 'src/blog/';

function hasSupabaseServiceEnv() {
	return Boolean(SUPABASE_URL && SUPABASE_SERVICE_KEY);
}

function createSupabaseServiceClient() {
	if (!hasSupabaseServiceEnv()) {
		throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables');
	}

	return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
}

/**
 * Recursively find all markdown files in a directory.
 */
async function findMarkdownFiles(dir, fileList = []) {
	try {
		const files = await fs.readdir(dir);

		for (const file of files) {
			const filePath = path.join(dir, file);
			const stat = await fs.stat(filePath);

			if (stat.isDirectory()) {
				await findMarkdownFiles(filePath, fileList);
				continue;
			}

			if (!file.endsWith('.md') && !file.endsWith('.mdx')) {
				continue;
			}

			const shouldSkip = SKIP_PATTERNS.some((pattern) => filePath.includes(pattern));
			if (!shouldSkip) {
				fileList.push(filePath);
			}
		}
	} catch (error) {
		console.error(`Error reading directory ${dir}:`, error.message);
	}

	return fileList;
}

function generateSlug(filePath, category) {
	const fileName = path.basename(filePath, path.extname(filePath));
	const relativePath = filePath.split(`src/blog/${category}/`)[1];

	if (relativePath && relativePath.includes('/')) {
		const subdir = path.dirname(relativePath);
		return `${subdir}/${fileName}`;
	}

	return fileName;
}

function extractSubcategory(filePath, baseCategory) {
	const relativePath = filePath.split(`src/blog/${baseCategory}/`)[1];
	if (relativePath && relativePath.includes('/')) {
		return path.dirname(relativePath);
	}
	return baseCategory;
}

function generateUrl(slug, category, subcategory) {
	if (subcategory && ROUTE_MAP[subcategory]) {
		return `${ROUTE_MAP[subcategory]}/${slug.split('/').pop()}`;
	}

	const baseRoute = ROUTE_MAP[category] || '/enneagram-corner';

	if (slug.includes('/')) {
		const parts = slug.split('/');
		const subdir = parts[0];
		const fileName = parts[parts.length - 1];

		if (ROUTE_MAP[subdir]) {
			return `${ROUTE_MAP[subdir]}/${fileName}`;
		}
	}

	return `${baseRoute}/${slug}`;
}

function normalizeInlineMarkdownText(text) {
	return text
		.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		.replace(/`([^`]+)`/g, '$1')
		.replace(/[*_~#]+/g, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function normalizeMarkdownForSearch(text) {
	return text
		.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		.replace(/`([^`]+)`/g, '$1')
		.replace(/[*_~]+/g, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/[ \t]+\n/g, '\n')
		.replace(/\n[ \t]+/g, '\n')
		.replace(/[ \t]{2,}/g, ' ');
}

/**
 * Clean markdown content for storage.
 * Removes Svelte-only syntax and noisy formatting while preserving searchable text.
 */
function cleanContent(content) {
	let cleaned = content;

	cleaned = cleaned.replace(/```[\s\S]*?```/g, ' ');
	cleaned = cleaned.replace(/<script[\s\S]*?<\/script>/gi, ' ');
	cleaned = cleaned.replace(/<svelte:head[\s\S]*?<\/svelte:head>/gi, ' ');
	cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, ' ');
	cleaned = cleaned.replace(/<[A-Z][a-zA-Z0-9]*\s*\/>/g, ' ');
	cleaned = cleaned.replace(/<[A-Z][a-zA-Z0-9]*[^>]*>/g, ' ');
	cleaned = cleaned.replace(/<\/[A-Z][a-zA-Z0-9]*>/g, ' ');
	cleaned = normalizeMarkdownForSearch(cleaned);
	cleaned = cleaned.replace(/\s*\n\s*/g, '\n');
	cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

	return cleaned.trim();
}

function extractHeadings(content) {
	const headings = [];
	const tokens = marked.lexer(content);

	for (const token of tokens) {
		if (token.type !== 'heading') {
			continue;
		}

		const text = normalizeInlineMarkdownText(token.text || '');
		if (text) {
			headings.push(text);
		}
	}

	return headings;
}

function extractTags(data, content, category) {
	const tags = new Set();

	tags.add(category);

	if (data.type && Array.isArray(data.type)) {
		data.type.forEach((value) => tags.add(String(value)));
	}

	const typeMatches = content.match(/type\s*(\d)/gi);
	if (typeMatches) {
		const uniqueTypes = [
			...new Set(typeMatches.map((match) => match.match(/\d/)?.[0]).filter(Boolean))
		];
		uniqueTypes.forEach((value) => tags.add(`type-${value}`));
	}

	const topicKeywords = [
		'relationships',
		'career',
		'stress',
		'growth',
		'communication',
		'anxiety',
		'depression',
		'addiction',
		'therapy',
		'mental-health',
		'workplace',
		'dating',
		'marriage',
		'leadership',
		'team',
		'compatibility',
		'trauma',
		'healing',
		'self-improvement',
		'personality',
		'emotions',
		'conflict',
		'family',
		'parenting',
		'friendship'
	];

	const lowerContent = content.toLowerCase();
	topicKeywords.forEach((keyword) => {
		if (lowerContent.includes(keyword)) {
			tags.add(keyword);
		}
	});

	return [...tags].sort((left, right) => left.localeCompare(right));
}

function buildContentHash(entry) {
	const hashSource = {
		slug: entry.slug,
		title: entry.title,
		description: entry.description,
		headings: entry.headings,
		content: entry.content,
		author: entry.author,
		date: entry.date,
		lastmod: entry.lastmod,
		changefreq: entry.changefreq,
		priority: entry.priority,
		published: entry.published,
		blog: entry.blog,
		enneagram: entry.enneagram,
		type: [...entry.type].sort((left, right) => left.localeCompare(right)),
		tags: [...entry.tags].sort((left, right) => left.localeCompare(right)),
		category: entry.category,
		loc: entry.loc,
		url: entry.url,
		pic: entry.pic,
		path: entry.path
	};

	return createHash('sha256').update(JSON.stringify(hashSource)).digest('hex');
}

async function parseMarkdownFile(filePath, dirConfig) {
	const fileContent = await fs.readFile(filePath, 'utf8');
	const { data, content } = matter(fileContent);

	if (data.published === false) {
		return null;
	}

	const slug = generateSlug(filePath, dirConfig.category);
	const subcategory = extractSubcategory(filePath, dirConfig.category);
	const cleanedContent = cleanContent(content);
	const headings = extractHeadings(cleanedContent);
	const tags = extractTags(data, cleanedContent, dirConfig.category);
	const url = generateUrl(slug, dirConfig.category, subcategory);

	let enneagram = data.enneagram || null;
	if (!enneagram && data.type?.includes('nine-types')) {
		const match = filePath.match(/enneagram-type-(\d)/);
		if (match) {
			enneagram = Number.parseInt(match[1], 10);
		}
	}

	const entry = {
		slug,
		title: data.title || path.basename(filePath, path.extname(filePath)),
		description: data.description || '',
		content: cleanedContent,
		headings,
		author: data.author || 'DJ Wayne',
		date: data.date || null,
		lastmod: data.lastmod || data.date || null,
		changefreq: data.changefreq || 'weekly',
		priority: data.priority || '0.6',
		published: data.published !== false,
		blog: data.blog !== false,
		enneagram,
		type: Array.isArray(data.type) ? data.type.map(String) : [],
		tags,
		category: subcategory,
		loc: data.loc || url,
		url,
		pic: data.pic || '',
		path: filePath
	};

	return {
		...entry,
		content_hash: buildContentHash(entry)
	};
}

function validateUniqueSlugs(entries) {
	const seen = new Map();
	const duplicates = [];

	for (const entry of entries) {
		const existing = seen.get(entry.slug);
		if (existing) {
			duplicates.push(`${entry.slug}: ${existing.path} <> ${entry.path}`);
			continue;
		}
		seen.set(entry.slug, entry);
	}

	if (duplicates.length > 0) {
		throw new Error(`Duplicate search slugs detected:\n- ${duplicates.join('\n- ')}`);
	}
}

async function loadExistingEntries(supabase) {
	const { data, error } = await supabase
		.from('blogs_content')
		.select('id, slug, content_hash, published, path')
		.like('path', `${TRACKED_BLOG_PATH_PREFIX}%`);

	if (error) {
		throw new Error(`Failed to load existing indexed blogs: ${error.message}`);
	}

	return new Map((data || []).map((row) => [row.slug, row]));
}

function getEntryOperation(existing, entry, force = false) {
	if (!existing) {
		return 'insert';
	}

	if (force) {
		return 'update';
	}

	if (!existing.content_hash) {
		return 'update';
	}

	if (existing.content_hash !== entry.content_hash) {
		return 'update';
	}

	if (existing.published !== entry.published) {
		return 'update';
	}

	if (existing.path !== entry.path) {
		return 'update';
	}

	return 'skip';
}

function normalizeDate(value) {
	if (!value) {
		return null;
	}

	return new Date(value).toISOString().split('T')[0];
}

function normalizeTimestamp(value) {
	if (!value) {
		return null;
	}

	return new Date(value).toISOString();
}

async function syncRemovedEntries(existingEntries, activeSlugs, options = {}, supabase) {
	const { dryRun = false } = options;
	const staleEntries = [...existingEntries.values()].filter(
		(entry) =>
			typeof entry.path === 'string' &&
			entry.path.startsWith(TRACKED_BLOG_PATH_PREFIX) &&
			!activeSlugs.has(entry.slug) &&
			entry.published !== false
	);

	let deactivated = 0;
	let errors = 0;

	for (const staleEntry of staleEntries) {
		if (dryRun) {
			console.log(
				`[DRY RUN] Would unpublish stale index row: ${staleEntry.slug} (${staleEntry.path || 'unknown path'})`
			);
			deactivated++;
			continue;
		}

		const { error } = await supabase
			.from('blogs_content')
			.update({
				published: false,
				indexed_at: new Date().toISOString()
			})
			.eq('slug', staleEntry.slug);

		if (error) {
			console.error(`Error unpublishing stale row ${staleEntry.slug}:`, error.message);
			errors++;
			continue;
		}

		deactivated++;
		console.log(`Unpublished stale row: ${staleEntry.slug}`);
	}

	return { deactivated, errors };
}

async function upsertToSupabase(
	entries,
	options = {},
	supabase = null,
	existingEntries = new Map()
) {
	const { dryRun = false, force = false } = options;

	console.log(`\nProcessing ${entries.length} blog entries...`);

	let inserted = 0;
	let updated = 0;
	let skipped = 0;
	let errors = 0;

	for (const entry of entries) {
		const existing = existingEntries.get(entry.slug);
		const operation = getEntryOperation(existing, entry, force);

		if (operation === 'skip') {
			skipped++;
			continue;
		}

		if (dryRun) {
			console.log(
				`[DRY RUN] Would ${operation}: ${entry.slug} (${entry.category}) -> ${entry.url}`
			);
			if (operation === 'insert') {
				inserted++;
			} else {
				updated++;
			}
			continue;
		}

		try {
			const payload = {
				...entry,
				date: normalizeDate(entry.date),
				lastmod: normalizeTimestamp(entry.lastmod),
				indexed_at: new Date().toISOString()
			};

			const { error } = await supabase.from('blogs_content').upsert(payload, {
				onConflict: 'slug'
			});

			if (error) {
				console.error(`Error upserting ${entry.slug}:`, error.message);
				errors++;
				continue;
			}

			if (operation === 'insert') {
				inserted++;
				console.log(`Inserted: ${entry.slug}`);
			} else {
				updated++;
				console.log(`Updated: ${entry.slug}`);
			}

			existingEntries.set(entry.slug, {
				...(existing || {}),
				slug: entry.slug,
				path: entry.path,
				content_hash: entry.content_hash,
				published: entry.published
			});
		} catch (error) {
			console.error(`Error processing ${entry.slug}:`, error.message);
			errors++;
		}
	}

	const activeSlugs = new Set(entries.map((entry) => entry.slug));
	const staleSyncResult =
		dryRun || supabase
			? await syncRemovedEntries(existingEntries, activeSlugs, options, supabase)
			: { deactivated: 0, errors: 0 };

	return {
		inserted,
		updated,
		skipped,
		errors: errors + staleSyncResult.errors,
		deactivated: staleSyncResult.deactivated
	};
}

async function main() {
	const args = process.argv.slice(2);
	const dryRun = args.includes('--dry-run');
	const force = args.includes('--force');
	const ifEnv = args.includes('--if-env');

	console.log('='.repeat(70));
	console.log('Blog Content Indexer for Supabase - ALL DIRECTORIES');
	console.log('='.repeat(70));

	if (dryRun) {
		console.log('Mode: DRY RUN (no changes will be made)');
	}
	if (force) {
		console.log('Mode: FORCE (re-indexing all scanned content)');
	}

	if (!hasSupabaseServiceEnv() && ifEnv) {
		console.log('\nSkipping blog search sync: missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
		return;
	}

	if (!hasSupabaseServiceEnv() && !dryRun) {
		throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables');
	}

	let supabase = null;
	let existingEntries = new Map();
	if (hasSupabaseServiceEnv()) {
		supabase = createSupabaseServiceClient();
		try {
			existingEntries = await loadExistingEntries(supabase);
		} catch (error) {
			if (!dryRun) {
				throw error;
			}

			supabase = null;
			console.warn(`Warning: ${error.message}. Continuing dry run without remote index state.`);
		}
	}

	console.log(`\nDirectories to scan: ${BLOG_DIRECTORIES.length}`);
	BLOG_DIRECTORIES.forEach((directory) =>
		console.log(`  - ${directory.path} -> ${directory.route}`)
	);

	const allEntries = [];
	const categoryCounts = {};

	for (const directory of BLOG_DIRECTORIES) {
		console.log(`\n${'─'.repeat(50)}`);
		console.log(`Scanning: ${directory.path}`);

		const files = await findMarkdownFiles(directory.path);
		console.log(`Found ${files.length} markdown files`);
		categoryCounts[directory.category] = files.length;

		for (const file of files) {
			try {
				const entry = await parseMarkdownFile(file, directory);
				if (entry) {
					allEntries.push(entry);
				}
			} catch (error) {
				console.error(`Error parsing ${file}:`, error.message);
			}
		}
	}

	validateUniqueSlugs(allEntries);

	console.log(`\n${'─'.repeat(50)}`);
	console.log('Category Summary:');
	Object.entries(categoryCounts)
		.filter(([, count]) => count > 0)
		.sort((left, right) => right[1] - left[1])
		.forEach(([category, count]) => {
			console.log(`  ${category}: ${count} files`);
		});

	console.log(`\nTotal entries to process: ${allEntries.length}`);

	const results = await upsertToSupabase(allEntries, { dryRun, force }, supabase, existingEntries);

	console.log('\n' + '='.repeat(70));
	console.log('FINAL SUMMARY');
	console.log('='.repeat(70));
	console.log(`  Inserted:    ${results.inserted}`);
	console.log(`  Updated:     ${results.updated}`);
	console.log(`  Skipped:     ${results.skipped}`);
	console.log(`  Unpublished: ${results.deactivated}`);
	console.log(`  Errors:      ${results.errors}`);
	console.log('='.repeat(70));
	console.log('\nDone!');
}

const isDirectExecution =
	Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectExecution) {
	main().catch((error) => {
		console.error(error.message);
		process.exit(1);
	});
}

export {
	BLOG_DIRECTORIES,
	buildContentHash,
	cleanContent,
	extractHeadings,
	extractTags,
	findMarkdownFiles,
	generateSlug,
	getEntryOperation,
	parseMarkdownFile,
	validateUniqueSlugs
};
