// scripts/personBlogParser.js
//
// Usage:
//   node scripts/personBlogParser.js Malcolm-Gladwell   # Dry-run one existing person (default)
//   node scripts/personBlogParser.js --changed          # Dry-run changed drafts
//   node scripts/personBlogParser.js --changed Malcolm-Gladwell
//   node scripts/personBlogParser.js Malcolm-Gladwell --apply \
//     --expected-content-hash=<md5> --approve-fields=content,description
//   node scripts/personBlogParser.js --grades-only Malcolm-Gladwell # Dry-run grade change
//   node scripts/personBlogParser.js Malcolm-Gladwell --publish
//   node scripts/personBlogParser.js --publish          # Publish top eligible unpublished draft
//
import { promises as fs } from 'fs';
import { execFileSync, execSync } from 'child_process';
import { createHash } from 'crypto';
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
 *   discoverability?: number,
 *   overall?: number,
 *   letter?: string,
 *   rubric_version?: number,
 *   graded_at?: string,
 *   caps_applied?: string[],
 *   confidence?: string,
 *   anchor?: string,
 *   needs_review?: boolean,
 *   first_overall?: number,
 *   regrade_overall?: number,
 *   grade_stability_delta?: number
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
 *   content_quality?: ContentQuality | null,
 *   keywords?: string[] | null,
 *   same_as?: string[] | null,
 *   faqs?: Array<{ question: string, answer: string, anchor?: string }> | null,
 *   wikidata_qid?: string | null,
 *   imdb_id?: string | null,
 *   birth_date?: string | null,
 *   birth_place?: string | null,
 *   nationality?: string | null,
 *   occupation?: string[] | null,
 *   knows_about?: string[] | null,
 *   citations?: string[] | null
 * }} BlogRecord
 */

/**
 * @typedef {BlogRecord & {
 *   _has_content_quality: boolean,
 *   _has_valid_content_quality: boolean,
 *   _explicit_fields: string[]
 * }} PersonBlogEntry
 */

/**
 * @typedef {{
 *   gradesOnly?: boolean,
 *   apply?: boolean,
 *   expectedContentHash?: string | null,
 *   approvedFields?: string[],
 *   publishSync?: boolean,
 *   supabase?: ReturnType<typeof createSupabaseServiceClient>
 * }} InsertIntoSupabaseOptions
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
 *   sourceAudit?: SourceAuditSummary | null,
 *   dbPublished?: boolean
 * }} PublishCandidate
 *
 * @typedef {{
 *   quotes_total?: number,
 *   inline?: number,
 *   vague?: number,
 *   untagged?: number,
 *   untagged_in_epigraph_or_cold_open?: boolean,
 *   any_untagged_load_bearing_slot?: boolean
 * }} SourceAuditSummary
 */

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const BLOG_HISTORY_SIGNATURE_SENTINEL_ID = 2147483648;
const PEOPLE_ATOMIC_UPDATE_RPC = 'update_blogs_famous_people_if_unchanged';
const PEOPLE_DRAFTS_DIR = 'src/blog/people/drafts';
const PUBLISH_MIN_CONTENT_GRADE = 8.5;
// Audit 2026-06-10: v1 grades clustered 8.5-9.4 and were discoverability-blind. Publishing
// requires a rubric-v2 grade and the v2 discoverability gate (>=7). Re-grade with /grade_blog.
const PUBLISH_REQUIRED_RUBRIC_VERSION = 2;
const PUBLISH_MIN_DISCOVERABILITY = 7;
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
export const PERSON_BLOG_MANAGED_FIELDS = Object.freeze([
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
	'suggestions',
	'wikipedia',
	'twitter',
	'instagram',
	'tiktok',
	'content',
	'jsonld_snippet',
	'content_quality',
	'keywords',
	'same_as',
	'faqs',
	'wikidata_qid',
	'imdb_id',
	'birth_date',
	'birth_place',
	'nationality',
	'occupation',
	'knows_about',
	'citations'
]);
export const NON_PUBLISH_LOCKED_FIELDS = Object.freeze([
	'date',
	'loc',
	'lastmod',
	'published',
	'enneagram',
	'type',
	'person'
]);
const DERIVED_DATABASE_FIELDS = new Set(['search_vector']);

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
	const discoverability = normalizeScore(qualityInput.discoverability);
	const rubricVersionRaw = Number(qualityInput.rubric_version);
	const rubricVersion =
		Number.isInteger(rubricVersionRaw) && rubricVersionRaw > 0 ? rubricVersionRaw : null;
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
	const capsApplied = normalizeStringArray(qualityInput.caps_applied);
	const confidence = normalizeTrimmedString(qualityInput.confidence);
	const anchor = normalizeTrimmedString(qualityInput.anchor);
	const needsReview =
		typeof qualityInput.needs_review === 'boolean'
			? qualityInput.needs_review
			: typeof qualityInput.needsReview === 'boolean'
				? qualityInput.needsReview
				: null;
	const firstOverall = normalizeScore(
		qualityInput.first_overall ?? qualityInput.first_grade ?? qualityInput.pre_revision_overall
	);
	const regradeOverall = normalizeScore(
		qualityInput.regrade_overall ?? qualityInput.final_overall ?? qualityInput.post_revision_overall
	);
	const gradeStabilityDelta = normalizeScore(
		qualityInput.grade_stability_delta ?? qualityInput.grade_delta
	);

	/** @type {ContentQuality} */
	const normalized = {};
	if (hook !== null) normalized.hook = hook;
	if (enneagram !== null) normalized.enneagram = enneagram;
	if (evidence !== null) normalized.evidence = evidence;
	if (writing !== null) normalized.writing = writing;
	if (originality !== null) normalized.originality = originality;
	if (discoverability !== null) normalized.discoverability = discoverability;
	if (rubricVersion !== null) normalized.rubric_version = rubricVersion;
	if (overall !== null) normalized.overall = overall;
	if (letter !== null) normalized.letter = letter;
	if (gradedAt !== null) normalized.graded_at = gradedAt;
	if (capsApplied) normalized.caps_applied = capsApplied;
	if (confidence) normalized.confidence = confidence;
	if (anchor) normalized.anchor = anchor;
	if (needsReview !== null) normalized.needs_review = needsReview;
	if (firstOverall !== null) normalized.first_overall = firstOverall;
	if (regradeOverall !== null) normalized.regrade_overall = regradeOverall;
	if (gradeStabilityDelta !== null) normalized.grade_stability_delta = gradeStabilityDelta;

	return Object.keys(normalized).length > 0 ? normalized : undefined;
}

/**
 * @typedef {{ question: string, answer: string, anchor?: string }} NormalizedFaq
 */

/**
 * Normalize an array of strings: trim, drop empty, dedupe case-insensitively.
 * Returns null for empty/non-array input so callers can skip the DB column.
 * @param {unknown} raw
 * @returns {string[] | null}
 */
export function normalizeStringArray(raw) {
	if (!Array.isArray(raw)) return null;
	const seen = new Set();
	const out = [];
	for (const item of raw) {
		if (typeof item !== 'string') continue;
		const trimmed = item.trim();
		if (!trimmed) continue;
		const key = trimmed.toLowerCase();
		if (seen.has(key)) continue;
		seen.add(key);
		out.push(trimmed);
	}
	return out.length > 0 ? out : null;
}

/**
 * Validate and normalize a single absolute HTTPS URL.
 * Rejects sentinel values ("none", "n/a"), blank, non-URL, non-HTTPS.
 * @param {unknown} value
 * @returns {string | null}
 */
function normalizeHttpsUrl(value) {
	if (typeof value !== 'string') return null;
	const trimmed = value.trim();
	if (!trimmed) return null;
	const lower = trimmed.toLowerCase();
	if (lower === 'none' || lower === 'n/a') return null;
	try {
		const url = new URL(trimmed);
		if (url.protocol !== 'https:') return null;
		return url.toString();
	} catch {
		return null;
	}
}

/**
 * Normalize a list of HTTPS URLs (used for same_as and citations):
 * HTTPS only, dedupe case-insensitively, ignoring trailing slash.
 * @param {unknown} raw
 * @param {string} [fieldLabel]
 * @returns {string[] | null}
 */
export function normalizeUrlArray(raw, fieldLabel = 'url_array') {
	if (!Array.isArray(raw)) return null;
	const seen = new Set();
	const out = [];
	for (const item of raw) {
		const url = normalizeHttpsUrl(item);
		if (!url) {
			if (typeof item === 'string' && item.trim()) {
				console.warn(`[${fieldLabel}] rejected non-HTTPS or invalid URL: ${item}`);
			}
			continue;
		}
		const key = url.toLowerCase().replace(/\/$/, '');
		if (seen.has(key)) continue;
		seen.add(key);
		out.push(url);
	}
	return out.length > 0 ? out : null;
}

/**
 * Validate Wikidata QID against ^Q[1-9]\d*$ (matches DB CHECK constraint).
 * @param {unknown} raw
 * @param {string} [personSlug]
 * @returns {string | null}
 */
export function normalizeWikidataQid(raw, personSlug = '') {
	if (raw === null || raw === undefined || raw === '') return null;
	if (typeof raw !== 'string') return null;
	const trimmed = raw.trim();
	if (!trimmed) return null;
	if (!/^Q[1-9]\d*$/.test(trimmed)) {
		console.warn(`[${personSlug || 'wikidata_qid'}] rejected invalid QID: ${raw}`);
		return null;
	}
	return trimmed;
}

/**
 * Validate IMDb nconst against ^nm\d+$ (matches DB CHECK constraint).
 * @param {unknown} raw
 * @param {string} [personSlug]
 * @returns {string | null}
 */
export function normalizeImdbId(raw, personSlug = '') {
	if (raw === null || raw === undefined || raw === '') return null;
	if (typeof raw !== 'string') return null;
	const trimmed = raw.trim();
	if (!trimmed) return null;
	if (!/^nm\d+$/.test(trimmed)) {
		console.warn(`[${personSlug || 'imdb_id'}] rejected invalid IMDb id: ${raw}`);
		return null;
	}
	return trimmed;
}

/**
 * Validate ISO 8601 YYYY-MM-DD birth_date. Handles both string and Date input
 * (YAML auto-parses unquoted YYYY-MM-DD into a Date object).
 * @param {unknown} raw
 * @param {string} [personSlug]
 * @returns {string | null}
 */
export function normalizeBirthDate(raw, personSlug = '') {
	if (raw === null || raw === undefined || raw === '') return null;
	if (raw instanceof Date && !Number.isNaN(raw.getTime())) {
		return raw.toISOString().slice(0, 10);
	}
	if (typeof raw !== 'string') return null;
	const trimmed = raw.trim();
	if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
		console.warn(`[${personSlug || 'birth_date'}] rejected non-ISO date: ${raw}`);
		return null;
	}
	const parsed = new Date(`${trimmed}T00:00:00Z`);
	if (Number.isNaN(parsed.getTime())) {
		console.warn(`[${personSlug || 'birth_date'}] rejected unparseable date: ${raw}`);
		return null;
	}
	if (parsed.toISOString().slice(0, 10) !== trimmed) {
		console.warn(`[${personSlug || 'birth_date'}] rejected invalid calendar date: ${raw}`);
		return null;
	}
	return trimmed;
}

/**
 * Trim a string field; return null if empty or non-string.
 * @param {unknown} raw
 * @returns {string | null}
 */
export function normalizeTrimmedString(raw) {
	if (typeof raw !== 'string') return null;
	const trimmed = raw.trim();
	return trimmed ? trimmed : null;
}

/**
 * Normalize FAQs: require non-empty question + answer strings. Drop invalid
 * items with a warning. Dedupe by lowercase question. Optional anchor kept
 * when present.
 *
 * Note: the plan calls for a visible-source validation pass (heading/QuickAnswer/
 * details match in the rendered body) before emission. Authors are expected
 * to only write FAQs backed by visible content; a lightweight body-scan check
 * can be added as a follow-up once the content flow settles.
 *
 * @param {unknown} raw
 * @param {string} [personSlug]
 * @returns {NormalizedFaq[] | null}
 */
export function normalizeFaqs(raw, personSlug = '') {
	if (!Array.isArray(raw)) return null;
	const seen = new Set();
	const out = [];
	for (const item of raw) {
		if (!item || typeof item !== 'object' || Array.isArray(item)) continue;
		const record = /** @type {Record<string, unknown>} */ (item);
		const question = typeof record.question === 'string' ? record.question.trim() : '';
		const answer = typeof record.answer === 'string' ? record.answer.trim() : '';
		if (!question || !answer) {
			console.warn(
				`[${personSlug || 'faqs'}] dropped FAQ missing question or answer: ${JSON.stringify(item)}`
			);
			continue;
		}
		const key = question.toLowerCase();
		if (seen.has(key)) continue;
		seen.add(key);
		/** @type {NormalizedFaq} */
		const normalized = { question, answer };
		const anchor = typeof record.anchor === 'string' ? record.anchor.trim() : '';
		if (anchor) normalized.anchor = anchor;
		out.push(normalized);
	}
	return out.length > 0 ? out : null;
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

	cleanedContent = cleanedContent.replace(
		/(https:\/\/9takes\.com)?(\/personality-analysis\/)([A-Za-z0-9-]+)/g,
		(match, origin = '', prefix, slug) =>
			`${origin ?? ''}${prefix}${normalizePersonalitySlug(slug)}`
	);

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

	// New structured-data fields (Phase 2 of people-jsonld-unification).
	// Each field is optional and validated; invalid items are dropped with a
	// warning so a typo in one field never blocks the whole push.
	const keywords = normalizeStringArray(data.keywords);
	const same_as = normalizeUrlArray(data.same_as, `${normalizedPerson || 'same_as'}:same_as`);
	const faqs = normalizeFaqs(data.faqs, normalizedPerson);
	const wikidata_qid = normalizeWikidataQid(data.wikidata_qid, normalizedPerson);
	const imdb_id = normalizeImdbId(data.imdb_id, normalizedPerson);
	const birth_date = normalizeBirthDate(data.birth_date, normalizedPerson);
	const birth_place = normalizeTrimmedString(data.birth_place);
	const nationality = normalizeTrimmedString(data.nationality);
	const occupation = normalizeStringArray(data.occupation);
	const knows_about = normalizeStringArray(data.knows_about);
	const citations = normalizeUrlArray(
		data.citations,
		`${normalizedPerson || 'citations'}:citations`
	);
	const explicitFields = new Set(Object.keys(data));
	explicitFields.add('content');
	if (jsonld_snippet !== null) explicitFields.add('jsonld_snippet');
	if (hasContentQualityField) explicitFields.add('content_quality');

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
		keywords,
		same_as,
		faqs,
		wikidata_qid,
		imdb_id,
		birth_date,
		birth_place,
		nationality,
		occupation,
		knows_about,
		citations,
		_has_content_quality: hasContentQualityField,
		_has_valid_content_quality: hasValidContentQuality,
		_explicit_fields: [...explicitFields]
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
 * @param {ContentQuality | null | undefined} quality
 * @returns {number | null}
 */
function getGradeStabilityDelta(quality) {
	if (!quality) return null;
	const explicit = normalizeScore(quality.grade_stability_delta);
	if (explicit !== null) return explicit;
	const first = normalizeScore(quality.first_overall);
	const regrade = normalizeScore(quality.regrade_overall);
	if (first !== null && regrade !== null) return Math.abs(first - regrade);
	return null;
}

/**
 * @param {string} filePath
 * @returns {SourceAuditSummary | null}
 */
function runPublishSourceAudit(filePath) {
	const scriptPath = path.join(process.cwd(), 'scripts', 'blog-source-audit.mjs');
	try {
		const output = execFileSync(process.execPath, [scriptPath, filePath, '--json'], {
			encoding: 'utf8',
			stdio: ['ignore', 'pipe', 'pipe']
		});
		const parsed = JSON.parse(output);
		return parsed?.summary && typeof parsed.summary === 'object' ? parsed.summary : null;
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		console.warn(`Unable to run source audit for ${filePath}: ${message}`);
		return null;
	}
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
	const sourceAudit = runPublishSourceAudit(filePath);
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
	} else {
		const rubricVersion = entry.content_quality?.rubric_version ?? null;
		const discoverability = normalizeScore(entry.content_quality?.discoverability);
		if (rubricVersion === null || rubricVersion < PUBLISH_REQUIRED_RUBRIC_VERSION) {
			blockers.push(`stale_grade_rubric_v${rubricVersion ?? 1}:re-run /grade_blog`);
		} else if (discoverability === null) {
			blockers.push('missing_discoverability_score:re-run /grade_blog');
		} else if (discoverability < PUBLISH_MIN_DISCOVERABILITY) {
			blockers.push(`discoverability_below_${PUBLISH_MIN_DISCOVERABILITY}:${discoverability}`);
		}
		const capsApplied = entry.content_quality?.caps_applied ?? [];
		if (Array.isArray(capsApplied) && capsApplied.length > 0) {
			blockers.push(`active_content_caps:${capsApplied.join(',')}`);
		}
		if (entry.content_quality?.needs_review === true) {
			blockers.push('content_quality_needs_review');
		}
		const gradeStabilityDelta = getGradeStabilityDelta(entry.content_quality);
		if (gradeStabilityDelta === null) {
			blockers.push('missing_grade_stability_delta:run supervised grade/regrade');
		} else if (gradeStabilityDelta > 0.3) {
			blockers.push(`grade_unstable:${gradeStabilityDelta.toFixed(1)}_delta`);
		}
	}
	if (!sourceAudit) {
		blockers.push('source_audit_unavailable:run scripts/blog-source-audit.mjs');
	} else if (sourceAudit.untagged_in_epigraph_or_cold_open === true) {
		blockers.push('source_standard_failed:untagged_epigraph_or_cold_open');
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
		sourceAudit,
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
 * @param {{ published?: boolean | null; published_at?: string | null; first_published_at?: string | null } | null | undefined} existing
 * @param {string} publishedAt
 * @returns {string}
 */
export function resolveFirstPublishedAt(existing, publishedAt) {
	const hasPriorPublication = Boolean(
		existing?.first_published_at || existing?.published_at || existing?.published === true
	);

	return hasPriorPublication
		? existing?.first_published_at || existing?.published_at || publishedAt
		: publishedAt;
}

/**
 * @param {{ published?: boolean | null; published_at?: string | null; first_published_at?: string | null } | null | undefined} existing
 * @returns {'published' | 'republished'}
 */
export function resolveReleaseEventType(existing) {
	const hasPriorPublication = Boolean(
		existing?.first_published_at || existing?.published_at || existing?.published === true
	);

	return hasPriorPublication ? 'republished' : 'published';
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
		.select('id,person,published,created_at,published_at,first_published_at')
		.ilike('person', entry.person)
		.maybeSingle();

	if (lookupError) {
		throw new Error(`Unable to read publish metadata for ${entry.person}: ${lookupError.message}`);
	}

	const firstPublishedAt = resolveFirstPublishedAt(existing, publishedAt);
	const releaseEventType = resolveReleaseEventType(existing);
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
		event_type: releaseEventType,
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
	const syncResult = await insertIntoSupabase([updatedEntry], {
		apply: true,
		publishSync: true
	});

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
 * @param {unknown} value
 * @returns {unknown}
 */
function canonicalizeForComparison(value) {
	if (value instanceof Date) return value.toISOString();
	if (Array.isArray(value)) return value.map(canonicalizeForComparison);
	if (value && typeof value === 'object') {
		return Object.fromEntries(
			Object.entries(/** @type {Record<string, unknown>} */ (value))
				.sort(([a], [b]) => a.localeCompare(b))
				.map(([key, nested]) => [key, canonicalizeForComparison(nested)])
		);
	}
	return value === undefined ? null : value;
}

/**
 * @param {unknown} left
 * @param {unknown} right
 * @returns {boolean}
 */
export function peopleFieldValuesEqual(left, right) {
	return (
		JSON.stringify(canonicalizeForComparison(left)) ===
		JSON.stringify(canonicalizeForComparison(right))
	);
}

/**
 * The database RPC compares this full parser-managed snapshot while holding the
 * target row lock. That catches metadata drift as well as content drift.
 * @param {Record<string, unknown>} row
 * @returns {Record<string, unknown>}
 */
export function buildPeopleManagedSnapshot(row) {
	return Object.fromEntries(
		PERSON_BLOG_MANAGED_FIELDS.map((field) => [field, row[field] === undefined ? null : row[field]])
	);
}

/**
 * @param {unknown} content
 * @returns {string}
 */
export function hashPeopleContent(content) {
	return createHash('md5')
		.update(typeof content === 'string' ? content : '')
		.digest('hex');
}

/**
 * @param {string} field
 * @param {unknown} value
 * @returns {unknown}
 */
function normalizeLockedField(field, value) {
	if (field === 'enneagram' && value !== null && value !== undefined) return String(value);
	return value;
}

/**
 * Build a fail-closed update plan. Only fields explicitly represented by the
 * draft are candidates; protected release/identity fields are never patched.
 * @param {Record<string, unknown> | null | undefined} existing
 * @param {PersonBlogEntry} entry
 * @param {{ gradesOnly?: boolean }} [options]
 */
export function buildNonPublishUpdatePlan(existing, entry, options = {}) {
	if (!existing) {
		throw new Error(
			`Existing-row-only update refused: ${entry.person || 'unknown person'} was not found`
		);
	}
	if (normalizePersonalitySlug(existing.person) !== normalizePersonalitySlug(entry.person)) {
		throw new Error(
			`Target mismatch: draft ${entry.person} does not match live row ${String(existing.person || '')}`
		);
	}

	const explicitFields = new Set(entry._explicit_fields || []);
	explicitFields.add('content');
	if (!entry._has_content_quality || !entry._has_valid_content_quality) {
		explicitFields.delete('content_quality');
	}

	const candidateFields = options.gradesOnly
		? ['content_quality']
		: PERSON_BLOG_MANAGED_FIELDS.filter((field) => !NON_PUBLISH_LOCKED_FIELDS.includes(field));
	/** @type {Record<string, unknown>} */
	const patch = {};
	const diff = [];

	for (const field of candidateFields) {
		if (!explicitFields.has(field)) continue;
		const after = entry[field];
		const before = existing[field] === undefined ? null : existing[field];
		if (peopleFieldValuesEqual(before, after)) continue;
		patch[field] = after === undefined ? null : after;
		diff.push({ field, before, after: patch[field] });
	}

	const protectedDrift = NON_PUBLISH_LOCKED_FIELDS.flatMap((field) => {
		const before = normalizeLockedField(field, existing[field]);
		const local = normalizeLockedField(field, entry[field]);
		return peopleFieldValuesEqual(before, local)
			? []
			: [{ field, live: existing[field], local: entry[field] }];
	});

	return {
		id: existing.id,
		person: String(existing.person || entry.person),
		expectedContentHash: hashPeopleContent(existing.content),
		localContentHash: hashPeopleContent(entry.content),
		expectedManaged: buildPeopleManagedSnapshot(existing),
		patch,
		diff,
		protectedDrift
	};
}

/**
 * Applying requires the reviewed hash and the exact changed-field set printed
 * by the dry run. Missing or extra approvals fail closed.
 * @param {ReturnType<typeof buildNonPublishUpdatePlan>} plan
 * @param {{ expectedContentHash?: string | null, approvedFields?: string[] }} options
 */
export function assertNonPublishPlanApproved(plan, options) {
	if (plan.protectedDrift.length > 0) {
		throw new Error(
			`Protected field drift must be reconciled before update: ${plan.protectedDrift
				.map(({ field }) => field)
				.join(', ')}`
		);
	}
	if (!options.expectedContentHash || options.expectedContentHash !== plan.expectedContentHash) {
		throw new Error(
			`Expected content hash mismatch. Review the dry run and pass --expected-content-hash=${plan.expectedContentHash}`
		);
	}

	const changed = [...new Set(plan.diff.map(({ field }) => field))].sort();
	const approved = [...new Set(options.approvedFields || [])].sort();
	if (!peopleFieldValuesEqual(changed, approved)) {
		throw new Error(
			`Approved fields must exactly match the dry-run diff. Changed: ${changed.join(', ') || '(none)'}. Approved: ${approved.join(', ') || '(none)'}`
		);
	}
}

/**
 * @param {unknown} value
 * @param {string} field
 * @returns {unknown}
 */
function previewPeopleFieldValue(value, field) {
	if (field === 'content') {
		return {
			hash: hashPeopleContent(value),
			characters: typeof value === 'string' ? value.length : 0
		};
	}
	return value;
}

/**
 * @param {ReturnType<typeof buildNonPublishUpdatePlan>} plan
 * @returns {void}
 */
export function printNonPublishUpdatePlan(plan) {
	console.log(`\nPeople update preview: ${plan.person} (id=${String(plan.id)})`);
	console.log(`Expected live content hash: ${plan.expectedContentHash}`);
	console.log(`Local parsed content hash:  ${plan.localContentHash}`);
	console.log(
		`Protected fields: ${NON_PUBLISH_LOCKED_FIELDS.join(', ')} (preserved by code and RPC)`
	);
	if (plan.protectedDrift.length > 0) {
		console.log('BLOCKED protected-field drift:');
		for (const drift of plan.protectedDrift) {
			console.log(
				JSON.stringify({
					field: drift.field,
					live: previewPeopleFieldValue(drift.live, drift.field),
					local: previewPeopleFieldValue(drift.local, drift.field)
				})
			);
		}
	}
	if (plan.diff.length === 0) {
		console.log('No parser-managed field changes.');
		return;
	}
	console.log('Field-by-field diff:');
	for (const change of plan.diff) {
		console.log(
			JSON.stringify({
				field: change.field,
				before: previewPeopleFieldValue(change.before, change.field),
				after: previewPeopleFieldValue(change.after, change.field)
			})
		);
	}
	console.log(`Approval token: --approve-fields=${plan.diff.map(({ field }) => field).join(',')}`);
}

/**
 * @param {Record<string, unknown>} before
 * @param {Record<string, unknown>} after
 * @param {ReturnType<typeof buildNonPublishUpdatePlan>} plan
 * @returns {string[]}
 */
export function verifyNonPublishUpdate(before, after, plan) {
	const errors = [];
	for (const [field, expected] of Object.entries(plan.patch)) {
		if (!peopleFieldValuesEqual(after[field], expected)) {
			errors.push(`${field} does not match the approved draft value`);
		}
	}
	for (const [field, value] of Object.entries(before)) {
		if (Object.prototype.hasOwnProperty.call(plan.patch, field)) continue;
		if (DERIVED_DATABASE_FIELDS.has(field)) continue;
		if (!peopleFieldValuesEqual(value, after[field])) {
			errors.push(`${field} changed without approval`);
		}
	}
	const expectedContent =
		typeof plan.patch.content === 'string' ? plan.patch.content : String(before.content || '');
	if (hashPeopleContent(after.content) !== hashPeopleContent(expectedContent)) {
		errors.push('live content hash does not match the reviewed parsed content hash');
	}
	return errors;
}

/**
 * @returns {BlogRecord}
 */
function getEmptyBlogRecord() {
	return {
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
		content_quality: null,
		keywords: null,
		same_as: null,
		faqs: null,
		wikidata_qid: null,
		imdb_id: null,
		birth_date: null,
		birth_place: null,
		nationality: null,
		occupation: null,
		knows_about: null,
		citations: null
	};
}

/**
 * Publish owns release metadata and deliberately retains the legacy insert path.
 * It is isolated from the non-publish tasker path.
 * @param {ReturnType<typeof createSupabaseServiceClient>} supabase
 * @param {PersonBlogEntry} entry
 * @param {InsertIntoSupabaseResult} result
 */
async function syncEntryForPublish(supabase, entry, result) {
	const {
		_has_content_quality,
		_has_valid_content_quality,
		_explicit_fields: _explicitFields,
		...entryRecord
	} = entry;
	/** @type {BlogRecord} */
	const record = { ...getEmptyBlogRecord(), ...entryRecord };
	if (!_has_content_quality || !_has_valid_content_quality) delete record.content_quality;

	const { data: existing, error: existingError } = await supabase
		.from('blogs_famous_people')
		.select('id,published')
		.ilike('person', entry.person)
		.maybeSingle();
	if (existingError) throw new Error(existingError.message);

	if (existing) {
		const { published: _published, ...updateRecord } = record;
		const { error } = await supabase
			.from('blogs_famous_people')
			.update(updateRecord)
			.eq('id', existing.id);
		if (error) throw new Error(error.message);
		result.updated += 1;
		return;
	}

	const { error } = await supabase
		.from('blogs_famous_people')
		.insert({ ...record, published: false });
	if (error) throw new Error(error.message);
	result.inserted += 1;
}

/**
 * Preview or atomically update existing blogs_famous_people rows.
 * Non-publish mode is dry-run by default and never inserts.
 * @param {PersonBlogEntry[]} entries
 * @param {InsertIntoSupabaseOptions} [options={}]
 * @returns {Promise<InsertIntoSupabaseResult>}
 */
export async function insertIntoSupabase(entries, options = {}) {
	const supabase = options.supabase || createSupabaseServiceClient();
	const gradesOnly = options.gradesOnly === true;
	const apply = options.apply === true;
	const publishSync = options.publishSync === true;
	/** @type {InsertIntoSupabaseResult} */
	const result = {
		processed: entries.length,
		updated: 0,
		inserted: 0,
		gradesUpdated: 0,
		skipped: 0,
		errors: []
	};

	if (apply && !publishSync && entries.length !== 1) {
		throw new Error('Fail-closed apply requires exactly one person');
	}
	if (publishSync && !apply) {
		throw new Error('Internal publish sync requires apply mode');
	}
	if ((apply || publishSync) && entries.length > 0) {
		await assertBlogHistorySchemaCompatible(supabase);
	}

	console.log(
		`${apply ? 'Applying' : 'Dry-run previewing'} ${entries.length} people blog entr${entries.length === 1 ? 'y' : 'ies'}...`
	);

	for (const entry of entries) {
		try {
			if (!entry.person) throw new Error(`Missing person slug: ${entry.title || 'Untitled'}`);

			if (publishSync) {
				await syncEntryForPublish(supabase, entry, result);
				continue;
			}
			if (gradesOnly && (!entry._has_content_quality || !entry._has_valid_content_quality)) {
				console.log(
					`Skipped (${entry._has_content_quality ? 'invalid' : 'no'} content_quality): ${entry.person}`
				);
				result.skipped += 1;
				continue;
			}

			const { data: existing, error: existingError } = await supabase
				.from('blogs_famous_people')
				.select('*')
				.ilike('person', entry.person)
				.maybeSingle();
			if (existingError) throw new Error(`Live-row lookup failed: ${existingError.message}`);
			if (!existing) {
				throw new Error(
					`Existing-row-only update refused: ${entry.person} was not found; no row was inserted`
				);
			}

			const plan = buildNonPublishUpdatePlan(existing, entry, { gradesOnly });
			printNonPublishUpdatePlan(plan);
			if (!apply) continue;

			assertNonPublishPlanApproved(plan, {
				expectedContentHash: options.expectedContentHash,
				approvedFields: options.approvedFields
			});
			if (plan.diff.length === 0) {
				console.log(`No-op verified: ${entry.person}`);
				result.skipped += 1;
				continue;
			}

			const { error: updateError } = await supabase.rpc(PEOPLE_ATOMIC_UPDATE_RPC, {
				p_id: existing.id,
				p_expected_content_hash: plan.expectedContentHash,
				p_expected_managed: plan.expectedManaged,
				p_patch: plan.patch
			});
			if (updateError) {
				const migrationHint =
					updateError.code === 'PGRST202' ||
					/update_blogs_famous_people_if_unchanged/i.test(updateError.message)
						? ' Apply the hardened people-update migration before retrying.'
						: '';
				throw new Error(`Atomic update refused: ${updateError.message}.${migrationHint}`);
			}

			const { data: verified, error: verifyReadError } = await supabase
				.from('blogs_famous_people')
				.select('*')
				.eq('id', existing.id)
				.maybeSingle();
			if (verifyReadError || !verified) {
				throw new Error(`Post-write read failed: ${verifyReadError?.message || 'row not found'}`);
			}
			const verificationErrors = verifyNonPublishUpdate(existing, verified, plan);
			if (verificationErrors.length > 0) {
				throw new Error(`Post-write verification failed: ${verificationErrors.join('; ')}`);
			}

			if (Object.prototype.hasOwnProperty.call(plan.patch, 'content')) {
				const { data: history, error: historyError } = await supabase
					.from('blogs_famous_people_history')
					.select('id,new_content,changed_at')
					.eq('famous_people_id', existing.id)
					.order('changed_at', { ascending: false })
					.order('id', { ascending: false })
					.limit(1)
					.maybeSingle();
				if (
					historyError ||
					!history ||
					hashPeopleContent(history.new_content) !== plan.localContentHash
				) {
					throw new Error(
						`History snapshot verification failed: ${historyError?.message || 'latest snapshot does not match'}`
					);
				}
			}

			if (gradesOnly) result.gradesUpdated += 1;
			else result.updated += 1;
			console.log(
				`Verified update: ${entry.person}; lastmod=${String(verified.lastmod)}; published=${String(verified.published)}`
			);
		} catch (error) {
			const message = `Error processing ${entry.person || entry.title}: ${
				error instanceof Error ? error.message : String(error)
			}`;
			console.error(message);
			result.errors.push(message);
		}
	}

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
		const apply = args.includes('--apply');
		const explicitDryRun = args.includes('--dry-run');
		const expectedContentHashArg = args.find((arg) => arg.startsWith('--expected-content-hash='));
		const approvedFieldsArg = args.find((arg) => arg.startsWith('--approve-fields='));
		const expectedContentHash = expectedContentHashArg?.slice('--expected-content-hash='.length);
		const approvedFields = (approvedFieldsArg?.slice('--approve-fields='.length) || '')
			.split(',')
			.map((field) => field.trim())
			.filter(Boolean);
		const personFilter = args.find((arg) => !arg.startsWith('--')); // Optional: e.g. "Malcolm-Gladwell"
		const normalizedPersonFilter = normalizePersonalitySlug(personFilter);
		/** @type {PersonBlogEntry[]} */
		let blogEntries = [];

		if (publish) {
			if (gradesOnly) {
				throw new Error('--publish cannot be combined with --grades-only');
			}
			if (apply || explicitDryRun || expectedContentHashArg || approvedFieldsArg) {
				throw new Error(
					'--publish is a distinct release workflow; do not combine it with non-publish preview/apply flags'
				);
			}

			await publishPersonBlog({ personFilter, changedOnly, skipGenAll });
			return;
		}
		if (apply && explicitDryRun) {
			throw new Error('--apply cannot be combined with --dry-run');
		}
		if (apply && !personFilter) {
			throw new Error('--apply requires an explicit single person slug');
		}
		if (!apply && (expectedContentHashArg || approvedFieldsArg)) {
			throw new Error(
				'--expected-content-hash and --approve-fields are apply-only; run the dry preview first'
			);
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
		const syncResult = await insertIntoSupabase(blogEntries, {
			gradesOnly,
			apply,
			expectedContentHash,
			approvedFields
		});
		if (syncResult.errors.length > 0) {
			throw new Error(`People sync failed:\n${syncResult.errors.join('\n')}`);
		}

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
