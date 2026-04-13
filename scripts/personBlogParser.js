// scripts/personBlogParser.js
//
// Usage:
//   node scripts/personBlogParser.js                    # Process all people
//   node scripts/personBlogParser.js Malcolm-Gladwell   # Process single person
//   node scripts/personBlogParser.js --changed          # Process changed drafts only
//   node scripts/personBlogParser.js --changed Malcolm-Gladwell
//   node scripts/personBlogParser.js --grades-only --changed
//   node scripts/personBlogParser.js --grades-only Malcolm-Gladwell
//   node scripts/personBlogParser.js Malcolm-Gladwell --publish
//   node scripts/personBlogParser.js --publish          # Publish top eligible unpublished draft
//
import { promises as fs } from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import matter from 'gray-matter';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { pathToFileURL } from 'url';
import {
	buildPersonalityImagePath,
	buildPersonalityAnalysisUrl,
	normalizePersonalityAnalysisUrl,
	normalizePersonalitySlug,
	normalizePersonalitySuggestions
} from './lib/personalitySeo.js';

dotenv.config();

/**
 * @typedef {Record<string, unknown> | unknown[]} JsonLdSnippet
 */

/**
 * @typedef {{
 *   hook?: number,
 *   enneagram?: number,
 *   evidence?: number,
 *   writing?: number,
 *   originality?: number,
 *   overall?: number,
 *   letter?: string,
 *   graded_at?: string
 * }} ContentQuality
 */

/**
 * @typedef {{
 *   title: string,
 *   meta_title: string,
 *   persona_title: string,
 *   description: string,
 *   author: string,
 *   date: string,
 *   loc: string,
 *   lastmod: string,
 *   changefreq: string,
 *   priority: string,
 *   published: boolean,
 *   enneagram: string | number | null,
 *   type: string[],
 *   person: string,
 *   suggestions: string[],
 *   wikipedia: string,
 *   twitter: string,
 *   instagram: string,
 *   tiktok: string,
 *   content: string,
 *   jsonld_snippet: JsonLdSnippet | null,
 *   content_quality?: ContentQuality | null
 * }} BlogRecord
 */

/**
 * @typedef {BlogRecord & {
 *   _has_content_quality: boolean,
 *   _has_valid_content_quality: boolean
 * }} PersonBlogEntry
 */

/**
 * @typedef {{ gradesOnly?: boolean }} InsertIntoSupabaseOptions
 */

/**
 * @typedef {{
 *   processed: number,
 *   updated: number,
 *   inserted: number,
 *   gradesUpdated: number,
 *   skipped: number,
 *   errors: string[]
 * }} InsertIntoSupabaseResult
 */

/**
 * @typedef {{
 *   fullPath: string,
 *   thumbnailPath: string,
 *   fullExists: boolean,
 *   thumbnailExists: boolean
 * }} PublishImageStatus
 */

/**
 * @typedef {{
 *   filePath: string,
 *   frontmatter: Record<string, unknown>,
 *   content: string,
 *   entry: PersonBlogEntry,
 *   wordCount: number,
 *   sectionCount: number,
 *   qualityOverall: number | null,
 *   imageStatus: PublishImageStatus,
 *   blockers: string[],
 *   dbPublished?: boolean
 * }} PublishCandidate
 */

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const BLOG_HISTORY_SIGNATURE_SENTINEL_ID = 2147483648;
const PEOPLE_DRAFTS_DIR = 'src/blog/people/drafts';
const PUBLISH_MIN_CONTENT_GRADE = 8.5;
const PUBLISH_MIN_WORD_COUNT = 1200;
const PUBLISH_MIN_SECTION_COUNT = 4;
const EXCLUDED_FILE_BASENAMES = new Set([
	'person-template.md',
	'POLITICIAN_FACT_CHECK_REPORT.md',
	'david-perrel-thiel-essay.md'
]);
const EXCLUDED_FILE_SUFFIXES = ['-research.md', '-updated-sections.md'];
const REQUIRED_PUBLISH_FRONTMATTER_FIELDS = [
	'title',
	'meta_title',
	'persona_title',
	'description',
	'author',
	'date',
	'loc',
	'lastmod',
	'changefreq',
	'priority',
	'published',
	'enneagram',
	'type',
	'person',
	'suggestions'
];
const UNFINISHED_DRAFT_PATTERNS = [
	{
		label: 'todo_marker',
		pattern: /\b(TODO|TBD|FIXME|PLACEHOLDER|LOREM IPSUM|INSERT QUOTE|ADD QUOTE|ADD SOURCE)\b/i
	},
	{
		label: 'outline_marker',
		pattern: /\b(outline only|skeleton draft|bare bones|stub draft|unfinished draft)\b/i
	}
];

function createSupabaseServiceClient() {
	if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
		throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables');
	}

	return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
}

/**
 * Fail early when the remote database still has the broken integer-based
 * cleanup function signature for blogs_famous_people history.
 * @param {ReturnType<typeof createSupabaseServiceClient>} supabase
 * @returns {Promise<void>}
 */
async function assertBlogHistorySchemaCompatible(supabase) {
	const { error } = await supabase.rpc('cleanup_blogs_famous_people_history', {
		p_famous_people_id: BLOG_HISTORY_SIGNATURE_SENTINEL_ID,
		p_keep_count: 1
	});

	if (!error) {
		return;
	}

	const code = typeof error.code === 'string' ? error.code : '';
	const message = `${error.message || ''} ${error.hint || ''}`;
	const schemaMismatch =
		code === '22003' ||
		code === '42883' ||
		code === 'PGRST202' ||
		code === 'PGRST203' ||
		/cleanup_blogs_famous_people_history|out of range for type integer/i.test(message);

	if (schemaMismatch) {
		throw new Error(
			'Supabase blog history schema is outdated. Apply supabase/migrations/20260401_fix_blogs_famous_people_history_signature.sql, then rerun pnpm run push:people.'
		);
	}

	throw new Error(`Unable to verify Supabase blog history schema: ${error.message}`);
}

/**
 * @param {number} overall
 * @returns {string}
 */
export function getLetterGrade(overall) {
	if (overall >= 9.5) return 'A+';
	if (overall >= 9.0) return 'A';
	if (overall >= 8.5) return 'B+';
	if (overall >= 8.0) return 'B';
	if (overall >= 7.0) return 'C';
	if (overall >= 6.0) return 'D';
	return 'F';
}

/**
 * @param {unknown} value
 * @returns {number | null}
 */
export function normalizeScore(value) {
	if (value === null || value === undefined || value === '') return null;
	const n = Number(value);
	return Number.isFinite(n) ? n : null;
}

/**
 * @param {unknown} raw
 * @returns {ContentQuality | null | undefined}
 */
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

	const qualityInput = /** @type {Record<string, unknown>} */ (raw);
	const hook = normalizeScore(qualityInput.hook);
	const enneagram = normalizeScore(qualityInput.enneagram);
	const evidence = normalizeScore(qualityInput.evidence);
	const writing = normalizeScore(qualityInput.writing);
	const originality = normalizeScore(qualityInput.originality);
	const overall = normalizeScore(qualityInput.overall);
	const letter =
		typeof qualityInput.letter === 'string' && qualityInput.letter.trim() !== ''
			? qualityInput.letter.trim().toUpperCase()
			: overall !== null
				? getLetterGrade(overall)
				: null;
	const gradedAt =
		typeof qualityInput.graded_at === 'string' && qualityInput.graded_at.trim() !== ''
			? qualityInput.graded_at.trim()
			: null;

	/** @type {ContentQuality} */
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

/**
 * @param {string} filePath
 * @returns {boolean}
 */
export function shouldProcessMarkdownFile(filePath) {
	const basename = path.basename(filePath);

	if (EXCLUDED_FILE_BASENAMES.has(basename)) {
		return false;
	}

	return !EXCLUDED_FILE_SUFFIXES.some((suffix) => basename.endsWith(suffix));
}

/**
 * @param {string[]} markdownFiles
 * @returns {string[]}
 */
export function filterProcessableMarkdownFiles(markdownFiles) {
	return markdownFiles.filter((filePath) => shouldProcessMarkdownFile(filePath));
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
function isNonEmptyString(value) {
	return typeof value === 'string' && value.trim().length > 0;
}

/**
 * @param {Record<string, unknown>} data
 * @param {string} field
 * @returns {boolean}
 */
function hasPublishFrontmatterField(data, field) {
	if (!Object.prototype.hasOwnProperty.call(data, field)) {
		return false;
	}

	const value = data[field];
	if (field === 'published') {
		return typeof value === 'boolean';
	}
	if (field === 'enneagram') {
		const enneagram = Number(value);
		return Number.isInteger(enneagram) && enneagram >= 1 && enneagram <= 9;
	}
	if (field === 'type' || field === 'suggestions') {
		return Array.isArray(value) && value.length > 0;
	}

	return isNonEmptyString(value);
}

/**
 * @param {Record<string, unknown>} data
 * @returns {string[]}
 */
export function getMissingPublishFrontmatterFields(data) {
	return REQUIRED_PUBLISH_FRONTMATTER_FIELDS.filter(
		(field) => !hasPublishFrontmatterField(data, field)
	);
}

/**
 * @param {string} content
 * @returns {number}
 */
export function countPublishableWords(content) {
	const withoutMarkdownComments = cleanupContent(content);
	const plainText = withoutMarkdownComments
		.replace(/<[^>]+>/g, ' ')
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/\[[^\]]+\]\([^)]+\)/g, ' ')
		.replace(/[#*_`>~-]+/g, ' ');
	return plainText.match(/[A-Za-z0-9][A-Za-z0-9'-]*/g)?.length ?? 0;
}

/**
 * @param {string} content
 * @returns {number}
 */
export function countPublishableSections(content) {
	return content.match(/^##\s+\S+/gm)?.length ?? 0;
}

/**
 * @param {string} content
 * @returns {string[]}
 */
export function findUnfinishedDraftMarkers(content) {
	const cleanedContent = cleanupContent(content);
	return UNFINISHED_DRAFT_PATTERNS.filter(({ pattern }) => pattern.test(cleanedContent)).map(
		({ label }) => label
	);
}

/**
 * @param {string} filePath
 * @returns {Promise<boolean>}
 */
async function fileExists(filePath) {
	try {
		await fs.access(filePath);
		return true;
	} catch {
		return false;
	}
}

/**
 * @param {PersonBlogEntry} entry
 * @returns {Promise<PublishImageStatus>}
 */
export async function getPublishImageStatus(entry) {
	const fullImagePath = buildPersonalityImagePath(entry.enneagram, entry.person);
	const thumbnailImagePath = buildPersonalityImagePath(entry.enneagram, entry.person, 'thumbnail');
	const fullPath = fullImagePath
		? path.join(process.cwd(), 'static', fullImagePath.replace(/^\//, ''))
		: '';
	const thumbnailPath = thumbnailImagePath
		? path.join(process.cwd(), 'static', thumbnailImagePath.replace(/^\//, ''))
		: '';

	return {
		fullPath,
		thumbnailPath,
		fullExists: fullPath ? await fileExists(fullPath) : false,
		thumbnailExists: thumbnailPath ? await fileExists(thumbnailPath) : false
	};
}

/**
 * @param {string} [timeZone]
 * @returns {string}
 */
function getTodayInLocalTime(timeZone = process.env.TZ || 'America/New_York') {
	return new Intl.DateTimeFormat('en-CA', {
		timeZone,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	}).format(new Date());
}

/**
 * Recursively finds all markdown files in a directory
 * @param {string} dir - Directory to search
 * @param {string[]} [fileList=[]] - Accumulator for found files
 * @returns {Promise<string[]>} - List of markdown file paths
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
 * @returns {JsonLdSnippet | null} - Parsed JSON-LD object or null if not found/invalid
 */
export function extractJsonLd(content) {
	const ldJsonRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/;
	const match = content.match(ldJsonRegex);

	if (match && match[1]) {
		try {
			let parsed = JSON.parse(match[1].trim());

			for (let attempts = 0; attempts < 2 && typeof parsed === 'string'; attempts += 1) {
				parsed = JSON.parse(parsed);
			}

			if (parsed && typeof parsed === 'object') {
				return parsed;
			}
		} catch (error) {
			console.warn('Failed to parse JSON-LD block:', error);
		}
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
 * @returns {Promise<PersonBlogEntry>} - Parsed blog data
 */
export async function parseMarkdownFile(filePath) {
	const fileContent = await fs.readFile(filePath, 'utf8');
	const { data, content } = matter(fileContent);
	const normalizedPerson = normalizePersonalitySlug(data.person || '');
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
		loc: normalizedPerson
			? buildPersonalityAnalysisUrl(normalizedPerson)
			: normalizePersonalityAnalysisUrl(data.loc || '', normalizedPerson),
		lastmod: data.lastmod || '',
		changefreq: data.changefreq || '',
		priority: data.priority || '',
		published: data.published !== undefined ? data.published : true,
		enneagram: data.enneagram || null,
		type: Array.isArray(data.type) ? data.type : [],
		person: normalizedPerson,
		suggestions: normalizePersonalitySuggestions(data.suggestions),
		wikipedia: data.wikipedia || '',
		twitter: data.twitter || '',
		instagram: data.instagram || '',
		tiktok: data.tiktok || '',
		content: cleanedContent,
		jsonld_snippet,
		content_quality: normalizedContentQuality,
		_has_content_quality: hasContentQualityField,
		_has_valid_content_quality: hasValidContentQuality
	};
}

/**
 * Main function to process all markdown files and prepare for database
 * @param {string} rootDir - Root directory to start searching
 * @returns {Promise<PersonBlogEntry[]>} - Array of parsed blog entries
 */
async function processBlogEntries(rootDir) {
	const markdownFiles = filterProcessableMarkdownFiles(await findMarkdownFiles(rootDir));
	return processBlogFiles(markdownFiles);
}

/**
 * Process a specific list of markdown files
 * @param {string[]} markdownFiles - Markdown file paths
 * @returns {Promise<PersonBlogEntry[]>} - Array of parsed blog entries
 */
async function processBlogFiles(markdownFiles) {
	/** @type {PersonBlogEntry[]} */
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
 * @returns {string[]} - Changed draft markdown files
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

	/** @type {string[]} */
	const changedFiles = [];

	for (const line of output.split('\n')) {
		const entry = line.match(/^..\s+(.+)$/)?.[1]?.trim();
		if (!entry) continue;

		const filePath = entry.includes(' -> ') ? (entry.split(' -> ').at(-1) ?? '') : entry;
		if (!filePath) continue;
		if (!filePath.endsWith('.md') && !filePath.endsWith('.mdx')) continue;
		if (!shouldProcessMarkdownFile(filePath)) continue;
		changedFiles.push(filePath);
	}

	return changedFiles;
}

/**
 * Save blog entries to a JSON file (for review before DB insertion)
 * @param {PersonBlogEntry[]} entries - Blog entries
 * @param {string} outputPath - Path to save JSON file
 */
async function saveBlogEntriesToJson(entries, outputPath) {
	await fs.writeFile(outputPath, JSON.stringify(entries, null, 2));
	console.log(`Saved ${entries.length} blog entries to ${outputPath}`);
}

/**
 * @param {string} filePath
 * @returns {Promise<PublishCandidate>}
 */
export async function readPublishCandidate(filePath) {
	const fileContent = await fs.readFile(filePath, 'utf8');
	const { data, content } = matter(fileContent);
	const entry = await parseMarkdownFile(filePath);
	const imageStatus = await getPublishImageStatus(entry);
	const qualityOverall = normalizeScore(entry.content_quality?.overall);
	const wordCount = countPublishableWords(content);
	const sectionCount = countPublishableSections(content);
	const unfinishedMarkers = findUnfinishedDraftMarkers(content);
	const missingFields = getMissingPublishFrontmatterFields(data);
	const blockers = [];

	if (missingFields.length > 0) {
		blockers.push(`missing_frontmatter:${missingFields.join(',')}`);
	}
	if (!entry._has_content_quality) {
		blockers.push('missing_content_quality');
	} else if (!entry._has_valid_content_quality || qualityOverall === null) {
		blockers.push('invalid_content_quality');
	} else if (qualityOverall < PUBLISH_MIN_CONTENT_GRADE) {
		blockers.push(`content_quality_below_${PUBLISH_MIN_CONTENT_GRADE}:${qualityOverall}`);
	}
	if (wordCount < PUBLISH_MIN_WORD_COUNT) {
		blockers.push(`too_short:${wordCount}_words`);
	}
	if (sectionCount < PUBLISH_MIN_SECTION_COUNT) {
		blockers.push(`too_few_sections:${sectionCount}`);
	}
	for (const marker of unfinishedMarkers) {
		blockers.push(`unfinished_marker:${marker}`);
	}
	if (!imageStatus.fullExists) {
		blockers.push('missing_full_image');
	}
	if (!imageStatus.thumbnailExists) {
		blockers.push('missing_thumbnail_image');
	}

	return {
		filePath,
		frontmatter: data,
		content,
		entry,
		wordCount,
		sectionCount,
		qualityOverall,
		imageStatus,
		blockers
	};
}

/**
 * @param {ReturnType<typeof createSupabaseServiceClient>} supabase
 * @returns {Promise<Map<string, boolean>>}
 */
async function getDbPublishedStatusMap(supabase) {
	const { data, error } = await supabase.from('blogs_famous_people').select('person,published');

	if (error) {
		throw new Error(`Unable to read blogs_famous_people publish states: ${error.message}`);
	}

	const publishedMap = new Map();
	for (const row of data ?? []) {
		const person = normalizePersonalitySlug(row.person);
		if (!person) continue;
		publishedMap.set(person, row.published === true);
	}

	return publishedMap;
}

/**
 * @param {PublishCandidate[]} candidates
 * @param {Map<string, boolean>} publishedMap
 * @param {boolean} hasExplicitPerson
 * @returns {PublishCandidate | null}
 */
export function selectPublishCandidate(candidates, publishedMap, hasExplicitPerson) {
	for (const candidate of candidates) {
		const dbPublished = publishedMap.get(candidate.entry.person) === true;
		candidate.dbPublished = dbPublished;
		if (!hasExplicitPerson && dbPublished) {
			candidate.blockers.push('already_published');
		}
	}

	const eligibleCandidates = candidates.filter((candidate) => candidate.blockers.length === 0);
	if (eligibleCandidates.length === 0) {
		return null;
	}

	return eligibleCandidates.sort((a, b) => {
		const gradeDelta = (b.qualityOverall ?? 0) - (a.qualityOverall ?? 0);
		if (gradeDelta !== 0) return gradeDelta;

		const bDate = new Date(b.entry.lastmod || b.entry.date || 0).getTime();
		const aDate = new Date(a.entry.lastmod || a.entry.date || 0).getTime();
		if (bDate !== aDate) return bDate - aDate;

		return a.entry.person.localeCompare(b.entry.person);
	})[0];
}

/**
 * @param {PublishCandidate[]} candidates
 * @param {number} [limit=8]
 * @returns {string}
 */
function formatPublishCandidateBlockers(candidates, limit = 8) {
	return candidates
		.slice(0, limit)
		.map((candidate) => {
			const label = candidate.entry.person || path.basename(candidate.filePath);
			return `- ${label}: ${candidate.blockers.join('; ') || 'eligible'}`;
		})
		.join('\n');
}

/**
 * @param {string} value
 * @returns {string}
 */
function quoteYamlSingle(value) {
	return `'${value.replace(/'/g, "''")}'`;
}

/**
 * @param {string} text
 * @returns {string}
 */
function escapeRegExp(text) {
	return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * @param {string} frontmatter
 * @param {string} key
 * @param {string} value
 * @returns {string}
 */
function replaceFrontmatterScalarLine(frontmatter, key, value) {
	const pattern = new RegExp(`^(${escapeRegExp(key)}\\s*:\\s*).*$`, 'm');
	if (!pattern.test(frontmatter)) {
		throw new Error(`Missing frontmatter field: ${key}`);
	}

	return frontmatter.replace(pattern, `$1${value}`);
}

/**
 * Update publish-owned frontmatter fields without re-serializing YAML.
 * This preserves existing quote style, inline arrays, folded strings, and field order.
 * @param {string} fileContent
 * @param {string} publishDate
 * @returns {string}
 */
export function updatePublishFrontmatterContent(fileContent, publishDate) {
	const frontmatterMatch = fileContent.match(/^(---\r?\n)([\s\S]*?)(\r?\n---)([\s\S]*)$/);
	if (!frontmatterMatch) {
		throw new Error('Missing YAML frontmatter block');
	}

	const [, opening, frontmatterContent, closing, body] = frontmatterMatch;
	let updatedFrontmatter = replaceFrontmatterScalarLine(
		frontmatterContent,
		'date',
		quoteYamlSingle(publishDate)
	);
	updatedFrontmatter = replaceFrontmatterScalarLine(
		updatedFrontmatter,
		'lastmod',
		quoteYamlSingle(publishDate)
	);
	updatedFrontmatter = replaceFrontmatterScalarLine(updatedFrontmatter, 'published', 'true');

	return `${opening}${updatedFrontmatter}${closing}${body}`;
}

/**
 * @param {string} filePath
 * @param {string} publishDate
 * @returns {Promise<void>}
 */
async function updateDraftFrontmatterForPublish(filePath, publishDate) {
	const fileContent = await fs.readFile(filePath, 'utf8');
	await fs.writeFile(filePath, updatePublishFrontmatterContent(fileContent, publishDate), 'utf8');
}

/**
 * @param {ReturnType<typeof createSupabaseServiceClient>} supabase
 * @param {PersonBlogEntry} entry
 * @param {string} publishDate
 * @returns {Promise<Record<string, unknown>>}
 */
async function publishSupabaseEntry(supabase, entry, publishDate) {
	const publishedAt = new Date().toISOString();
	const { data: existing, error: lookupError } = await supabase
		.from('blogs_famous_people')
		.select('id,person,published_at,first_published_at')
		.ilike('person', entry.person)
		.maybeSingle();

	if (lookupError) {
		throw new Error(`Unable to read publish metadata for ${entry.person}: ${lookupError.message}`);
	}

	const firstPublishedAt = existing?.first_published_at || existing?.published_at || publishedAt;
	const { data, error } = await supabase
		.from('blogs_famous_people')
		.update({
			published: true,
			date: publishDate,
			lastmod: publishDate,
			published_at: publishedAt,
			first_published_at: firstPublishedAt
		})
		.ilike('person', entry.person)
		.select('id,person,published,date,lastmod,published_at,first_published_at,content_quality')
		.maybeSingle();

	if (error) {
		throw new Error(`Unable to publish ${entry.person}: ${error.message}`);
	}
	if (!data) {
		throw new Error(`Unable to publish ${entry.person}: row not found after sync`);
	}
	if (data.published !== true || data.date !== publishDate || data.lastmod !== publishDate) {
		throw new Error(`Unable to verify published row for ${entry.person}`);
	}

	const contentSlug = normalizePersonalitySlug(data.person || entry.person);
	const { error: eventError } = await supabase.from('content_release_events').insert({
		content_type: 'people',
		content_slug: contentSlug,
		path: `/personality-analysis/${contentSlug}`,
		event_type:
			existing?.published_at || existing?.first_published_at ? 'republished' : 'published',
		event_at: publishedAt,
		source: 'personBlogParser',
		metadata: {
			blog_id: data.id,
			publish_date: publishDate
		}
	});

	if (eventError) {
		throw new Error(`Unable to record release event for ${entry.person}: ${eventError.message}`);
	}

	return data;
}

/**
 * @param {{ skipGenAll?: boolean }} [options]
 * @returns {void}
 */
function runGenAll(options = {}) {
	if (options.skipGenAll) {
		console.log('Skipped pnpm gen:all (--skip-gen-all)');
		return;
	}

	console.log('Running pnpm gen:all...');
	execSync('pnpm gen:all', { stdio: 'inherit' });
}

/**
 * @param {{ personFilter?: string, changedOnly?: boolean, skipGenAll?: boolean }} options
 * @returns {Promise<void>}
 */
async function publishPersonBlog(options) {
	const normalizedPersonFilter = normalizePersonalitySlug(options.personFilter);
	const hasExplicitPerson = Boolean(normalizedPersonFilter);
	const draftFiles = options.changedOnly
		? getChangedDraftMarkdownFiles()
		: filterProcessableMarkdownFiles(await findMarkdownFiles(PEOPLE_DRAFTS_DIR));

	if (draftFiles.length === 0) {
		throw new Error('No draft markdown files found to evaluate for publishing');
	}

	const candidates = [];
	for (const filePath of draftFiles) {
		try {
			const candidate = await readPublishCandidate(filePath);
			if (hasExplicitPerson && candidate.entry.person !== normalizedPersonFilter) {
				continue;
			}
			candidates.push(candidate);
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			if (hasExplicitPerson) {
				throw new Error(`Unable to evaluate ${filePath}: ${message}`);
			}
			console.warn(`Skipping ${filePath}: ${message}`);
		}
	}

	if (hasExplicitPerson && candidates.length === 0) {
		throw new Error(`No blog entry found for person: ${options.personFilter}`);
	}

	const supabase = createSupabaseServiceClient();
	const publishedMap = await getDbPublishedStatusMap(supabase);
	const selected = selectPublishCandidate(candidates, publishedMap, hasExplicitPerson);

	if (!selected) {
		const blockerSummary = formatPublishCandidateBlockers(candidates);
		throw new Error(
			`No publishable draft found. Checked ${candidates.length} candidate(s).\n${blockerSummary}`
		);
	}

	const publishDate = getTodayInLocalTime();
	console.log(`Selected for publish: ${selected.entry.person} (${selected.filePath})`);
	console.log(`Content grade: ${selected.qualityOverall}`);
	console.log(`Word count: ${selected.wordCount}`);
	console.log(`Full image: ${selected.imageStatus.fullPath}`);
	console.log(`Thumbnail image: ${selected.imageStatus.thumbnailPath}`);

	await updateDraftFrontmatterForPublish(selected.filePath, publishDate);
	const updatedEntry = await parseMarkdownFile(selected.filePath);
	const syncResult = await insertIntoSupabase([updatedEntry]);

	if (syncResult.errors.length > 0) {
		throw new Error(`Content sync failed before publish:\n${syncResult.errors.join('\n')}`);
	}

	const verifiedRow = await publishSupabaseEntry(supabase, updatedEntry, publishDate);
	runGenAll({ skipGenAll: options.skipGenAll });

	console.log('\nPublish complete.');
	console.log(`Person: ${updatedEntry.person}`);
	console.log(`Date/lastmod: ${publishDate}`);
	console.log(`Supabase row id: ${verifiedRow.id}`);
	console.log(`Published: ${verifiedRow.published}`);
}

/**
 * Upsert blog entries into Supabase blogs_famous_people table
 * @param {PersonBlogEntry[]} entries - Blog entries to insert
 * @param {InsertIntoSupabaseOptions} [options={}] - Insert options
 * @returns {Promise<InsertIntoSupabaseResult>}
 */
async function insertIntoSupabase(entries, options = {}) {
	const supabase = createSupabaseServiceClient();
	const gradesOnly = options.gradesOnly === true;
	const result = {
		processed: entries.length,
		updated: 0,
		inserted: 0,
		gradesUpdated: 0,
		skipped: 0,
		errors: []
	};

	console.log(`Processing ${entries.length} blog entries...`);

	if (!gradesOnly && entries.length > 0) {
		await assertBlogHistorySchemaCompatible(supabase);
	}

	/** @type {BlogRecord} */
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
		jsonld_snippet: null,
		content_quality: null
	};

	for (const entry of entries) {
		try {
			if (!entry.person) {
				console.error(`Skipping entry with missing person slug: ${entry.title || 'Untitled'}`);
				result.skipped += 1;
				continue;
			}

			const { _has_content_quality, _has_valid_content_quality, ...entryRecord } = entry;
			/** @type {BlogRecord} */
			const record = { ...fields, ...entryRecord };

			// Only update content_quality when explicitly present in frontmatter.
			if (!_has_content_quality || !_has_valid_content_quality) {
				delete record.content_quality;
			}
			if (_has_content_quality && !_has_valid_content_quality) {
				console.warn(`Invalid content_quality for ${entry.person}; preserving DB value`);
			}

			if (gradesOnly) {
				if (!_has_content_quality) {
					console.log(`Skipped (no content_quality): ${entry.person}`);
					result.skipped += 1;
					continue;
				}
				if (!_has_valid_content_quality) {
					console.log(`Skipped (invalid content_quality): ${entry.person}`);
					result.skipped += 1;
					continue;
				}

				const { data: existing, error: existingError } = await supabase
					.from('blogs_famous_people')
					.select('id')
					.ilike('person', entry.person)
					.maybeSingle();

				if (existingError) {
					console.error(`Error checking existing row for ${entry.person}:`, existingError);
					result.errors.push(
						`Error checking existing row for ${entry.person}: ${existingError.message}`
					);
					continue;
				}

				if (!existing) {
					const message = `Error updating ${entry.person}: row not found (grades-only mode does not insert new rows)`;
					console.error(message);
					result.errors.push(message);
					continue;
				}

				/** @type {{ content_quality: ContentQuality | null }} */
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
					result.errors.push(`Error updating grade for ${entry.person}: ${error.message}`);
				} else {
					const gradePreview = gradePayload.content_quality?.overall ?? 'null';
					console.log(`Updated grade: ${entry.person} (overall=${gradePreview})`);
					result.gradesUpdated += 1;
				}
				continue;
			}

			// Check if record exists by person slug
			const { data: existing, error: existingError } = await supabase
				.from('blogs_famous_people')
				.select('id,published')
				.ilike('person', entry.person)
				.maybeSingle();

			if (existingError) {
				console.error(`Error checking existing row for ${entry.person}:`, existingError);
				result.errors.push(
					`Error checking existing row for ${entry.person}: ${existingError.message}`
				);
				continue;
			}

			if (existing) {
				// Preserve DB publish state for existing rows.
				const { published: _published, ...updateRecord } = record;

				const { error } = await supabase
					.from('blogs_famous_people')
					.update(updateRecord)
					.eq('id', existing.id);

				if (error) {
					console.error(`Error updating ${entry.person}:`, error);
					result.errors.push(`Error updating ${entry.person}: ${error.message}`);
				} else {
					console.log(
						`Updated: ${entry.title} (${entry.person}, id=${existing.id}, published preserved=${existing.published})`
					);
					result.updated += 1;
				}
			} else {
				// Force net-new rows to remain unpublished for manual release.
				const insertRecord = { ...record, published: false };
				const { error } = await supabase.from('blogs_famous_people').insert(insertRecord);

				if (error) {
					console.error(`Error inserting ${entry.person}:`, error);
					result.errors.push(`Error inserting ${entry.person}: ${error.message}`);
				} else {
					console.log(`Inserted: ${entry.title} (${entry.person}, published=false)`);
					result.inserted += 1;
				}
			}
		} catch (error) {
			console.error(`Error processing ${entry.title}:`, error);
			result.errors.push(
				`Error processing ${entry.title}: ${error instanceof Error ? error.message : String(error)}`
			);
		}
	}

	console.log('Processing complete!');
	return result;
}

/**
 * @returns {Promise<void>}
 */
async function main() {
	try {
		const args = process.argv.slice(2);
		const changedOnly = args.includes('--changed');
		const gradesOnly = args.includes('--grades-only');
		const publish = args.includes('--publish');
		const skipGenAll = args.includes('--skip-gen-all');
		const personFilter = args.find((arg) => !arg.startsWith('--')); // Optional: e.g. "Malcolm-Gladwell"
		const normalizedPersonFilter = normalizePersonalitySlug(personFilter);
		/** @type {PersonBlogEntry[]} */
		let blogEntries = [];

		if (publish) {
			if (gradesOnly) {
				throw new Error('--publish cannot be combined with --grades-only');
			}

			await publishPersonBlog({ personFilter, changedOnly, skipGenAll });
			return;
		}

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
			blogEntries = blogEntries.filter(
				(e) => normalizePersonalitySlug(e.person) === normalizedPersonFilter
			);
			if (blogEntries.length === 0) {
				console.error(`No blog entry found for person: ${personFilter}`);
				process.exit(1);
			}
			console.log(`Filtered to: ${normalizedPersonFilter}`);
		}

		console.log(`Found ${blogEntries.length} entries to process`);
		await insertIntoSupabase(blogEntries, { gradesOnly });

		console.log('Processing complete!');
	} catch (error) {
		console.error('Error processing blog entries:', error);
		process.exitCode = 1;
	}
}

const isDirectRun =
	process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isDirectRun) {
	main();
}
