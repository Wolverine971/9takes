// scripts/index-blogs-to-supabase.js
// #!/usr/bin/env node

/**
 * Script to index ALL blog content to Supabase for full-text search
 *
 * Usage:
 *   node scripts/index-blogs-to-supabase.js           # Index all blogs
 *   node scripts/index-blogs-to-supabase.js --dry-run # Preview without writing
 *   node scripts/index-blogs-to-supabase.js --force   # Re-index all (even if exists)
 *
 * Environment variables required:
 *   SUPABASE_URL or PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_KEY
 */

import { createClient } from '@supabase/supabase-js';
import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
	console.error('Error: Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables');
	process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

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

	// NOTE: src/blog/people is handled separately via blogs_famous_people table
];

// URL route mapping for categories and subcategories
const ROUTE_MAP = {
	// Main categories
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

// Skip patterns for social media variants, drafts, and templates
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

/**
 * Recursively find all markdown files in a directory
 */
async function findMarkdownFiles(dir, fileList = []) {
	try {
		const files = await fs.readdir(dir);

		for (const file of files) {
			const filePath = path.join(dir, file);
			const stat = await fs.stat(filePath);

			if (stat.isDirectory()) {
				await findMarkdownFiles(filePath, fileList);
			} else if (file.endsWith('.md') || file.endsWith('.mdx')) {
				// Check if file should be skipped
				const shouldSkip = SKIP_PATTERNS.some((pattern) => filePath.includes(pattern));
				if (!shouldSkip) {
					fileList.push(filePath);
				}
			}
		}
	} catch (error) {
		console.error(`Error reading directory ${dir}:`, error.message);
	}

	return fileList;
}

/**
 * Generate slug from file path
 */
function generateSlug(filePath, category) {
	const fileName = path.basename(filePath, path.extname(filePath));

	// Check if it's in a subdirectory (like mental-health)
	const relativePath = filePath.split(`src/blog/${category}/`)[1];
	if (relativePath && relativePath.includes('/')) {
		const subdir = path.dirname(relativePath);
		return `${subdir}/${fileName}`;
	}

	return fileName;
}

/**
 * Extract subcategory from file path
 */
function extractSubcategory(filePath, baseCategory) {
	const relativePath = filePath.split(`src/blog/${baseCategory}/`)[1];
	if (relativePath && relativePath.includes('/')) {
		return path.dirname(relativePath);
	}
	return baseCategory;
}

/**
 * Generate URL for a blog post based on category
 */
function generateUrl(slug, category, subcategory) {
	// Check if there's a specific route for the subcategory
	if (subcategory && ROUTE_MAP[subcategory]) {
		return `${ROUTE_MAP[subcategory]}/${slug.split('/').pop()}`;
	}

	// Use the main category route
	const baseRoute = ROUTE_MAP[category] || '/enneagram-corner';

	// If slug contains a path (like mental-health/something), handle it
	if (slug.includes('/')) {
		const parts = slug.split('/');
		const subdir = parts[0];
		const fileName = parts[parts.length - 1];

		// Check if subdir has a specific route
		if (ROUTE_MAP[subdir]) {
			return `${ROUTE_MAP[subdir]}/${fileName}`;
		}
	}

	return `${baseRoute}/${slug}`;
}

/**
 * Clean markdown content for storage
 * Removes Svelte script blocks and component tags while preserving content
 */
function cleanContent(content) {
	let cleaned = content;

	// Remove script blocks
	cleaned = cleaned.replace(/<script[\s\S]*?<\/script>/gi, '');

	// Remove svelte:head blocks
	cleaned = cleaned.replace(/<svelte:head[\s\S]*?<\/svelte:head>/gi, '');

	// Remove HTML comments
	cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');

	// Remove common Svelte component self-closing tags
	cleaned = cleaned.replace(/<[A-Z][a-zA-Z]*\s*\/>/g, '');

	// Remove Svelte component opening/closing tags but keep inner content
	cleaned = cleaned.replace(/<[A-Z][a-zA-Z]*[^>]*>/g, '');
	cleaned = cleaned.replace(/<\/[A-Z][a-zA-Z]*>/g, '');

	// Clean up excessive whitespace
	cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
	cleaned = cleaned.trim();

	return cleaned;
}

/**
 * Extract tags from content (hashtags, keywords, etc.)
 */
function extractTags(data, content, category) {
	const tags = new Set();

	// Add category as a tag
	tags.add(category);

	// Add type as tags
	if (data.type && Array.isArray(data.type)) {
		data.type.forEach((t) => tags.add(t));
	}

	// Extract enneagram type mentions from content
	const typeMatches = content.match(/type\s*(\d)/gi);
	if (typeMatches) {
		const uniqueTypes = [...new Set(typeMatches.map((m) => m.match(/\d/)[0]))];
		uniqueTypes.forEach((t) => tags.add(`type-${t}`));
	}

	// Common topic keywords to look for
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

	return [...tags];
}

/**
 * Parse a markdown file and prepare for database
 */
async function parseMarkdownFile(filePath, dirConfig) {
	const fileContent = await fs.readFile(filePath, 'utf8');
	const { data, content } = matter(fileContent);

	// Skip unpublished content
	if (data.published === false) {
		return null;
	}

	const slug = generateSlug(filePath, dirConfig.category);
	const subcategory = extractSubcategory(filePath, dirConfig.category);
	const cleanedContent = cleanContent(content);
	const tags = extractTags(data, cleanedContent, dirConfig.category);
	const url = generateUrl(slug, dirConfig.category, subcategory);

	// Determine enneagram number from content or title
	let enneagram = data.enneagram || null;
	if (!enneagram && data.type?.includes('nine-types')) {
		const match = filePath.match(/enneagram-type-(\d)/);
		if (match) {
			enneagram = parseInt(match[1]);
		}
	}

	return {
		slug,
		title: data.title || path.basename(filePath, '.md'),
		description: data.description || '',
		content: cleanedContent,
		author: data.author || 'DJ Wayne',
		date: data.date || null,
		lastmod: data.lastmod || data.date || null,
		changefreq: data.changefreq || 'weekly',
		priority: data.priority || '0.6',
		published: data.published !== false,
		blog: data.blog !== false,
		enneagram,
		type: Array.isArray(data.type) ? data.type : [],
		tags,
		category: subcategory,
		loc: data.loc || url,
		url,
		pic: data.pic || '',
		path: filePath
	};
}

/**
 * Upsert blog entries to Supabase
 */
async function upsertToSupabase(entries, options = {}) {
	const { dryRun = false, force = false } = options;

	console.log(`\nProcessing ${entries.length} blog entries...`);

	let inserted = 0;
	let updated = 0;
	let skipped = 0;
	let errors = 0;

	for (const entry of entries) {
		try {
			if (dryRun) {
				console.log(`[DRY RUN] Would upsert: ${entry.slug} (${entry.category}) -> ${entry.url}`);
				inserted++;
				continue;
			}

			// Check if entry exists
			const { data: existing } = await supabase
				.from('blogs_content')
				.select('id, lastmod')
				.eq('slug', entry.slug)
				.single();

			if (existing && !force) {
				// Skip if lastmod hasn't changed
				const existingDate = new Date(existing.lastmod).getTime();
				const newDate = new Date(entry.lastmod).getTime();

				if (existingDate >= newDate) {
					skipped++;
					continue;
				}
			}

			// Upsert the entry
			const { error } = await supabase.from('blogs_content').upsert(
				{
					...entry,
					// Convert date strings to proper format
					date: entry.date ? new Date(entry.date).toISOString().split('T')[0] : null,
					lastmod: entry.lastmod ? new Date(entry.lastmod).toISOString() : null
				},
				{
					onConflict: 'slug'
				}
			);

			if (error) {
				console.error(`Error upserting ${entry.slug}:`, error.message);
				errors++;
			} else {
				if (existing) {
					updated++;
					console.log(`Updated: ${entry.slug}`);
				} else {
					inserted++;
					console.log(`Inserted: ${entry.slug}`);
				}
			}
		} catch (err) {
			console.error(`Error processing ${entry.slug}:`, err.message);
			errors++;
		}
	}

	return { inserted, updated, skipped, errors };
}

/**
 * Update search vectors for existing blogs_famous_people
 */
async function updateFamousPeopleSearchVectors() {
	console.log('\nUpdating search vectors for blogs_famous_people...');

	const { error } = await supabase.rpc('exec_sql', {
		sql: `
            UPDATE blogs_famous_people
            SET search_vector =
                setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
                setweight(to_tsvector('english', COALESCE(person, '')), 'A') ||
                setweight(to_tsvector('english', COALESCE(description, '')), 'B') ||
                setweight(to_tsvector('english', COALESCE(array_to_string(type, ' '), '')), 'B') ||
                setweight(to_tsvector('english', COALESCE(content, '')), 'C')
            WHERE search_vector IS NULL OR search_vector = '';
        `
	});

	if (error) {
		// The RPC might not exist, that's okay - the migration handles it
		console.log('Note: Run the migration to update famous_people search vectors');
	} else {
		console.log('Updated search vectors for blogs_famous_people');
	}
}

/**
 * Main execution
 */
async function main() {
	const args = process.argv.slice(2);
	const dryRun = args.includes('--dry-run');
	const force = args.includes('--force');

	console.log('='.repeat(70));
	console.log('Blog Content Indexer for Supabase - ALL DIRECTORIES');
	console.log('='.repeat(70));

	if (dryRun) {
		console.log('Mode: DRY RUN (no changes will be made)');
	}
	if (force) {
		console.log('Mode: FORCE (re-indexing all content)');
	}

	console.log(`\nDirectories to scan: ${BLOG_DIRECTORIES.length}`);
	BLOG_DIRECTORIES.forEach((d) => console.log(`  - ${d.path} -> ${d.route}`));

	const allEntries = [];
	const categoryCounts = {};

	// Process each blog directory
	for (const dir of BLOG_DIRECTORIES) {
		console.log(`\n${'─'.repeat(50)}`);
		console.log(`Scanning: ${dir.path}`);

		const files = await findMarkdownFiles(dir.path);
		console.log(`Found ${files.length} markdown files`);
		categoryCounts[dir.category] = files.length;

		for (const file of files) {
			try {
				const entry = await parseMarkdownFile(file, dir);
				if (entry) {
					allEntries.push(entry);
				}
			} catch (err) {
				console.error(`Error parsing ${file}:`, err.message);
			}
		}
	}

	console.log(`\n${'─'.repeat(50)}`);
	console.log('Category Summary:');
	Object.entries(categoryCounts)
		.filter(([, count]) => count > 0)
		.sort((a, b) => b[1] - a[1])
		.forEach(([cat, count]) => {
			console.log(`  ${cat}: ${count} files`);
		});

	console.log(`\nTotal entries to process: ${allEntries.length}`);

	// Upsert to Supabase
	const results = await upsertToSupabase(allEntries, { dryRun, force });

	// Summary
	console.log('\n' + '='.repeat(70));
	console.log('FINAL SUMMARY');
	console.log('='.repeat(70));
	console.log(`  Inserted: ${results.inserted}`);
	console.log(`  Updated:  ${results.updated}`);
	console.log(`  Skipped:  ${results.skipped}`);
	console.log(`  Errors:   ${results.errors}`);
	console.log('='.repeat(70));

	if (!dryRun && results.errors === 0) {
		// Optionally update famous people search vectors
		await updateFamousPeopleSearchVectors();
	}

	console.log('\nDone!');
}

main().catch(console.error);
