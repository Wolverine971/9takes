// scripts/personBlogParser.js
//
// Usage:
//   node scripts/personBlogParser.js                    # Process all people
//   node scripts/personBlogParser.js Malcolm-Gladwell   # Process single person
//   node scripts/personBlogParser.js --changed          # Process changed drafts only
//   node scripts/personBlogParser.js --changed Malcolm-Gladwell
//   node scripts/personBlogParser.js --grades-only --changed
//   node scripts/personBlogParser.js --grades-only Malcolm-Gladwell
//
import { promises as fs } from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import matter from 'gray-matter';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { pathToFileURL } from 'url';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const EXCLUDED_FILE_BASENAMES = new Set([
	'person-template.md',
	'POLITICIAN_FACT_CHECK_REPORT.md',
	'david-perrel-thiel-essay.md'
]);
const EXCLUDED_FILE_SUFFIXES = ['-research.md', '-updated-sections.md'];

function createSupabaseServiceClient() {
	if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
		throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables');
	}

	return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
}

export function getLetterGrade(overall) {
	if (overall >= 9.5) return 'A+';
	if (overall >= 9.0) return 'A';
	if (overall >= 8.5) return 'B+';
	if (overall >= 8.0) return 'B';
	if (overall >= 7.0) return 'C';
	if (overall >= 6.0) return 'D';
	return 'F';
}

export function normalizeScore(value) {
	if (value === null || value === undefined || value === '') return null;
	const n = Number(value);
	return Number.isFinite(n) ? n : null;
}

export function normalizeContentQuality(raw) {
	if (raw === null) return null;
	if (raw === undefined) return undefined;

	// Allow shorthand numeric grade via content_grade: 8.7
	if (typeof raw === 'number' || (typeof raw === 'string' && raw.trim() !== '')) {
		const overall = normalizeScore(raw);
		if (overall === null) return undefined;
		return {
			overall,
			letter: getLetterGrade(overall),
			graded_at: new Date().toISOString().slice(0, 10)
		};
	}

	if (typeof raw !== 'object' || Array.isArray(raw)) {
		return undefined;
	}

	const hook = normalizeScore(raw.hook);
	const enneagram = normalizeScore(raw.enneagram);
	const evidence = normalizeScore(raw.evidence);
	const writing = normalizeScore(raw.writing);
	const originality = normalizeScore(raw.originality);
	const overall = normalizeScore(raw.overall);
	const letter =
		typeof raw.letter === 'string' && raw.letter.trim() !== ''
			? raw.letter.trim().toUpperCase()
			: overall !== null
				? getLetterGrade(overall)
				: null;
	const gradedAt =
		typeof raw.graded_at === 'string' && raw.graded_at.trim() !== '' ? raw.graded_at.trim() : null;

	const normalized = {};
	if (hook !== null) normalized.hook = hook;
	if (enneagram !== null) normalized.enneagram = enneagram;
	if (evidence !== null) normalized.evidence = evidence;
	if (writing !== null) normalized.writing = writing;
	if (originality !== null) normalized.originality = originality;
	if (overall !== null) normalized.overall = overall;
	if (letter !== null) normalized.letter = letter;
	if (gradedAt !== null) normalized.graded_at = gradedAt;

	return Object.keys(normalized).length > 0 ? normalized : undefined;
}

export function shouldProcessMarkdownFile(filePath) {
	const basename = path.basename(filePath);

	if (EXCLUDED_FILE_BASENAMES.has(basename)) {
		return false;
	}

	return !EXCLUDED_FILE_SUFFIXES.some((suffix) => basename.endsWith(suffix));
}

export function filterProcessableMarkdownFiles(markdownFiles) {
	return markdownFiles.filter((filePath) => shouldProcessMarkdownFile(filePath));
}

/**
 * Recursively finds all markdown files in a directory
 * @param {string} dir - Directory to search
 * @param {Array} fileList - Accumulator for found files
 * @returns {Promise<Array>} - List of markdown file paths
 */
async function findMarkdownFiles(dir, fileList = []) {
	const files = await fs.readdir(dir);

	for (const file of files) {
		const filePath = path.join(dir, file);
		const stat = await fs.stat(filePath);

		if (stat.isDirectory()) {
			// Recurse into subdirectories
			await findMarkdownFiles(filePath, fileList);
		} else if (file.endsWith('.md') || file.endsWith('.mdx')) {
			fileList.push(filePath);
		}
	}

	return fileList;
}

/**
 * Extract JSON-LD from HTML content
 * @param {string} content - HTML content
 * @returns {string|null} - JSON-LD string or null if not found
 */
export function extractJsonLd(content) {
	const ldJsonRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/;
	const match = content.match(ldJsonRegex);

	if (match && match[1]) {
		return match[1].trim();
	}

	return null;
}

/**
 * Clean up HTML content by removing imported components and their HTML
 * @param {string} content - HTML content
 * @returns {string} - Cleaned HTML content
 */
export function cleanupContent(content) {
	// Remove import statements
	let cleanedContent = content.replace(/<script>[\s\S]*?<\/script>/g, '');

	// Remove PopCard and other component HTML
	cleanedContent = cleanedContent.replace(/<div\s+style="display: flex;[\s\S]*?<\/div>/g, '');

	// Remove BlogPurpose component
	cleanedContent = cleanedContent.replace(/<BlogPurpose\s*\/>/g, '');

	// Remove HTML comments
	cleanedContent = cleanedContent.replace(/<!--[\s\S]*?-->/g, '');

	// Remove svelte:head tags and content
	cleanedContent = cleanedContent.replace(/<svelte:head>[\s\S]*?<\/svelte:head>/g, '');

	return cleanedContent;
}

/**
 * Parse a markdown file and extract necessary data
 * @param {string} filePath - Path to markdown file
 * @returns {Object} - Parsed blog data
 */
export async function parseMarkdownFile(filePath) {
	const fileContent = await fs.readFile(filePath, 'utf8');
	const { data, content } = matter(fileContent);
	const hasContentQualityField =
		Object.prototype.hasOwnProperty.call(data, 'content_quality') ||
		Object.prototype.hasOwnProperty.call(data, 'content_grade');
	const contentQualityRaw = Object.prototype.hasOwnProperty.call(data, 'content_quality')
		? data.content_quality
		: data.content_grade;
	const normalizedContentQuality = normalizeContentQuality(contentQualityRaw);
	const hasValidContentQuality =
		contentQualityRaw === null || normalizedContentQuality !== undefined;

	// Extract JSON-LD
	const jsonld_snippet = extractJsonLd(content);

	// Clean up content
	const cleanedContent = cleanupContent(content);

	// Create the database record
	return {
		title: data.title || '',
		meta_title: data.meta_title || '',
		persona_title: data.persona_title || '',
		description: data.description || '',
		author: data.author || '',
		date: data.date || '',
		loc: data.loc || '',
		lastmod: data.lastmod || '',
		changefreq: data.changefreq || '',
		priority: data.priority || '',
		published: data.published !== undefined ? data.published : true,
		enneagram: data.enneagram || null,
		type: Array.isArray(data.type) ? data.type : [],
		person: data.person || '',
		suggestions: Array.isArray(data.suggestions) ? data.suggestions : [],
		wikipedia: data.wikipedia || '',
		twitter: data.twitter || '',
		instagram: data.instagram || '',
		tiktok: data.tiktok || '',
		content: cleanedContent,
		jsonld_snippet: jsonld_snippet || '',
		content_quality: normalizedContentQuality,
		_has_content_quality: hasContentQualityField,
		_has_valid_content_quality: hasValidContentQuality
	};
}

/**
 * Main function to process all markdown files and prepare for database
 * @param {string} rootDir - Root directory to start searching
 * @returns {Promise<Array>} - Array of parsed blog entries
 */
async function processBlogEntries(rootDir) {
	const markdownFiles = filterProcessableMarkdownFiles(await findMarkdownFiles(rootDir));
	return processBlogFiles(markdownFiles);
}

/**
 * Process a specific list of markdown files
 * @param {Array<string>} markdownFiles - Markdown file paths
 * @returns {Promise<Array>} - Array of parsed blog entries
 */
async function processBlogFiles(markdownFiles) {
	const blogEntries = [];

	for (const filePath of markdownFiles) {
		try {
			const blogData = await parseMarkdownFile(filePath);
			blogEntries.push(blogData);
			console.log(`Processed: ${filePath}`);
		} catch (error) {
			console.error(`Error processing ${filePath}:`, error);
		}
	}

	return blogEntries;
}

/**
 * Get changed draft markdown files from git status
 * @returns {Array<string>} - Changed draft markdown files
 */
function getChangedDraftMarkdownFiles() {
	let output = '';
	try {
		output = execSync('git status --short src/blog/people/drafts', {
			encoding: 'utf8'
		});
	} catch (error) {
		console.error('Error reading changed draft files from git:', error);
		return [];
	}

	return output
		.split('\n')
		.map((line) => line.match(/^..\s+(.+)$/)?.[1]?.trim())
		.filter(Boolean)
		.map((entry) => (entry.includes(' -> ') ? entry.split(' -> ').at(-1) : entry))
		.filter((filePath) => filePath.endsWith('.md') || filePath.endsWith('.mdx'))
		.filter((filePath) => shouldProcessMarkdownFile(filePath));
}

/**
 * Save blog entries to a JSON file (for review before DB insertion)
 * @param {Array} entries - Blog entries
 * @param {string} outputPath - Path to save JSON file
 */
async function saveBlogEntriesToJson(entries, outputPath) {
	await fs.writeFile(outputPath, JSON.stringify(entries, null, 2));
	console.log(`Saved ${entries.length} blog entries to ${outputPath}`);
}

/**
 * Upsert blog entries into Supabase blogs_famous_people table
 * @param {Array} entries - Blog entries to insert
 */
async function insertIntoSupabase(entries, options = {}) {
	const supabase = createSupabaseServiceClient();
	const gradesOnly = options.gradesOnly === true;

	console.log(`Processing ${entries.length} blog entries...`);

	const fields = {
		title: '',
		meta_title: '',
		persona_title: '',
		description: '',
		author: '',
		date: '',
		loc: '',
		lastmod: '',
		changefreq: '',
		priority: '',
		published: true,
		enneagram: null,
		type: [],
		person: '',
		suggestions: [],
		wikipedia: '',
		twitter: '',
		instagram: '',
		tiktok: '',
		content: '',
		jsonld_snippet: '',
		content_quality: null
	};

	for (const entry of entries) {
		try {
			if (!entry.person) {
				console.error(`Skipping entry with missing person slug: ${entry.title || 'Untitled'}`);
				continue;
			}

			const record = {};
			for (const key of Object.keys(fields)) {
				record[key] = entry[key] !== undefined ? entry[key] : fields[key];
			}

			// Only update content_quality when explicitly present in frontmatter.
			if (!entry._has_content_quality || !entry._has_valid_content_quality) {
				delete record.content_quality;
			}
			if (entry._has_content_quality && !entry._has_valid_content_quality) {
				console.warn(`Invalid content_quality for ${entry.person}; preserving DB value`);
			}

			if (gradesOnly) {
				if (!entry._has_content_quality) {
					console.log(`Skipped (no content_quality): ${entry.person}`);
					continue;
				}
				if (!entry._has_valid_content_quality) {
					console.log(`Skipped (invalid content_quality): ${entry.person}`);
					continue;
				}

				const { data: existing, error: existingError } = await supabase
					.from('blogs_famous_people')
					.select('id')
					.eq('person', entry.person)
					.maybeSingle();

				if (existingError) {
					console.error(`Error checking existing row for ${entry.person}:`, existingError);
					continue;
				}

				if (!existing) {
					console.error(
						`Error updating ${entry.person}: row not found (grades-only mode does not insert new rows)`
					);
					continue;
				}

				const gradePayload =
					record.content_quality === undefined
						? { content_quality: null }
						: { content_quality: record.content_quality };
				const { error } = await supabase
					.from('blogs_famous_people')
					.update(gradePayload)
					.eq('id', existing.id);

				if (error) {
					console.error(`Error updating grade for ${entry.person}:`, error);
				} else {
					const gradePreview = gradePayload.content_quality?.overall ?? 'null';
					console.log(`Updated grade: ${entry.person} (overall=${gradePreview})`);
				}
				continue;
			}

			// Check if record exists by person slug
			const { data: existing, error: existingError } = await supabase
				.from('blogs_famous_people')
				.select('id,published')
				.eq('person', entry.person)
				.maybeSingle();

			if (existingError) {
				console.error(`Error checking existing row for ${entry.person}:`, existingError);
				continue;
			}

			if (existing) {
				// Preserve DB publish state for existing rows.
				const updateRecord = { ...record };
				delete updateRecord.published;

				const { error } = await supabase
					.from('blogs_famous_people')
					.update(updateRecord)
					.eq('id', existing.id);

				if (error) {
					console.error(`Error updating ${entry.person}:`, error);
				} else {
					console.log(
						`Updated: ${entry.title} (${entry.person}, id=${existing.id}, published preserved=${existing.published})`
					);
				}
			} else {
				// Force net-new rows to remain unpublished for manual release.
				const insertRecord = { ...record, published: false };
				const { error } = await supabase.from('blogs_famous_people').insert(insertRecord);

				if (error) {
					console.error(`Error inserting ${entry.person}:`, error);
				} else {
					console.log(`Inserted: ${entry.title} (${entry.person}, published=false)`);
				}
			}
		} catch (error) {
			console.error(`Error processing ${entry.title}:`, error);
		}
	}

	console.log('Processing complete!');
}

async function main() {
	try {
		const args = process.argv.slice(2);
		const changedOnly = args.includes('--changed');
		const gradesOnly = args.includes('--grades-only');
		const personFilter = args.find((arg) => !arg.startsWith('--')); // Optional: e.g. "Malcolm-Gladwell"
		let blogEntries = [];

		if (changedOnly) {
			const changedDraftFiles = getChangedDraftMarkdownFiles();
			if (changedDraftFiles.length === 0) {
				console.log('No changed draft markdown files found in src/blog/people/drafts');
				return;
			}
			console.log(`Found ${changedDraftFiles.length} changed draft files`);
			blogEntries = await processBlogFiles(changedDraftFiles);
		} else {
			const rootDir = 'src/blog/people/drafts';
			blogEntries = await processBlogEntries(rootDir);
		}

		if (personFilter) {
			blogEntries = blogEntries.filter((e) => e.person === personFilter);
			if (blogEntries.length === 0) {
				console.error(`No blog entry found for person: ${personFilter}`);
				process.exit(1);
			}
			console.log(`Filtered to: ${personFilter}`);
		}

		console.log(`Found ${blogEntries.length} entries to process`);
		await insertIntoSupabase(blogEntries, { gradesOnly });

		console.log('Processing complete!');
	} catch (error) {
		console.error('Error processing blog entries:', error);
	}
}

const isDirectRun =
	process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isDirectRun) {
	main();
}
