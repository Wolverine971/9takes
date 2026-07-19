#!/usr/bin/env node
// scripts/people-corpus-audit.mjs
// Reproducible, read-only inventory for the published people corpus.
//
// Joins live blogs_famous_people rows, local drafts, and the current GSC pages
// export. It never calls insert/update/upsert/RPC. Deep editorial signals reuse
// the existing deterministic quality, source, and same-type audit scripts.
//
// Usage:
//   node scripts/people-corpus-audit.mjs --output=/tmp/people-audit.json
//   node scripts/people-corpus-audit.mjs --person=dua-lipa
//   node scripts/people-corpus-audit.mjs --person=dua-lipa --skip-deep

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import {
	PERSON_BLOG_MANAGED_FIELDS,
	hashPeopleContent,
	parseMarkdownFile
} from './personBlogParser.js';
import { normalizePersonalitySlug } from './lib/personalitySeo.js';

dotenv.config();

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DRAFTS_DIR = path.join(REPO_ROOT, 'src/blog/people/drafts');
const GSC_DIR = path.join(REPO_ROOT, 'docs/data/gsc');
const argv = process.argv.slice(2);
const personArg = argv.find((arg) => arg.startsWith('--person='));
const outputArg = argv.find((arg) => arg.startsWith('--output='));
const personFilter = normalizePersonalitySlug(personArg?.slice('--person='.length));
const outputPath = outputArg ? path.resolve(REPO_ROOT, outputArg.slice('--output='.length)) : null;
const skipDeep = argv.includes('--skip-deep');
const compact = argv.includes('--compact');

if (argv.includes('--help')) {
	console.log(`Usage: node scripts/people-corpus-audit.mjs [options]

Options:
  --person=<slug>   Audit one published person.
  --output=<path>   Write JSON to a file instead of stdout.
  --skip-deep       Skip quality/source/same-type subprocesses.
  --compact         Emit compact JSON.`);
	process.exit(0);
}

function stableValue(value) {
	if (Array.isArray(value)) return value.map(stableValue);
	if (value && typeof value === 'object') {
		return Object.fromEntries(
			Object.entries(value)
				.sort(([left], [right]) => left.localeCompare(right))
				.map(([key, nested]) => [key, stableValue(nested)])
		);
	}
	return value === undefined ? null : value;
}

function hashJson(value) {
	return createHash('md5')
		.update(JSON.stringify(stableValue(value)))
		.digest('hex');
}

function metadataFieldsForLocal(local) {
	if (!local?._explicit_fields) {
		return PERSON_BLOG_MANAGED_FIELDS.filter((field) => field !== 'content');
	}
	const explicit = new Set(local._explicit_fields);
	return PERSON_BLOG_MANAGED_FIELDS.filter((field) => field !== 'content' && explicit.has(field));
}

function metadataSnapshot(row, fields = PERSON_BLOG_MANAGED_FIELDS) {
	return Object.fromEntries(
		fields
			.filter((field) => field !== 'content')
			.map((field) => [field, normalizeMetadataField(field, row?.[field])])
	);
}

function metadataDiffFields(live, local, fields) {
	if (!local) return PERSON_BLOG_MANAGED_FIELDS.filter((field) => field !== 'content');
	return fields.filter(
		(field) =>
			hashJson(normalizeMetadataField(field, live?.[field])) !==
			hashJson(normalizeMetadataField(field, local?.[field]))
	);
}

function normalizeMetadataField(field, value) {
	if (value === undefined) return null;
	if (field === 'enneagram' && value !== null) return String(value);
	if (
		(field === 'date' || field === 'lastmod' || field === 'birth_date') &&
		value instanceof Date
	) {
		return value.toISOString().slice(0, 10);
	}
	return value;
}

function countOccurrences(text, needle) {
	return typeof text === 'string' ? text.split(needle).length - 1 : 0;
}

// Mirrors the attribution exemptions in scripts/blog-lint.sh.
function countProseEmDashes(content) {
	const withoutComments = String(content || '').replace(/<!--[\s\S]*?-->/g, '');
	let count = 0;
	for (const sourceLine of withoutComments.split('\n')) {
		const line = sourceLine.replace(/["”'’]\s*—/g, '').replace(/^[>\s]*[_*]*—/, '');
		count += countOccurrences(line, '—');
	}
	return count;
}

function countWords(content) {
	return (
		String(content || '')
			.replace(/<[^>]+>/g, ' ')
			.replace(/https?:\/\/\S+/g, ' ')
			.replace(/[#_*`[\]()>{}|]/g, ' ')
			.match(/\b[\p{L}\p{N}][\p{L}\p{N}'’.-]*\b/gu)?.length ?? 0
	);
}

function gradeReading(contentQuality) {
	if (!contentQuality || typeof contentQuality !== 'object' || Array.isArray(contentQuality)) {
		return { state: 'missing', rubric_version: null, dimensions: null };
	}
	const rubricVersion = Number(contentQuality.rubric_version || 0);
	const dimensions = Object.fromEntries(
		['hook', 'enneagram', 'evidence', 'writing', 'originality', 'discoverability', 'overall']
			.filter((field) => contentQuality[field] !== undefined)
			.map((field) => [field, contentQuality[field]])
	);
	return {
		state: rubricVersion >= 2 ? 'v2' : 'pre-v2',
		rubric_version: rubricVersion || null,
		dimensions
	};
}

function parseCsv(text) {
	const rows = [];
	let row = [];
	let field = '';
	let quoted = false;
	for (let index = 0; index < text.length; index += 1) {
		const char = text[index];
		if (quoted) {
			if (char === '"' && text[index + 1] === '"') {
				field += '"';
				index += 1;
			} else if (char === '"') quoted = false;
			else field += char;
			continue;
		}
		if (char === '"') quoted = true;
		else if (char === ',') {
			row.push(field);
			field = '';
		} else if (char === '\n') {
			row.push(field.replace(/\r$/, ''));
			rows.push(row);
			row = [];
			field = '';
		} else field += char;
	}
	if (field || row.length) {
		row.push(field);
		rows.push(row);
	}
	const [headers = [], ...dataRows] = rows;
	return dataRows
		.filter((values) => values.some(Boolean))
		.map((values) =>
			Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']))
		);
}

function normalizeGscPage(page) {
	try {
		const url = new URL(page);
		return url.pathname.replace(/\/+$/, '').toLowerCase();
	} catch {
		return String(page || '')
			.replace(/^https?:\/\/[^/]+/i, '')
			.replace(/\/+$/, '')
			.toLowerCase();
	}
}

async function loadGsc() {
	const pointer = JSON.parse(await fs.readFile(path.join(GSC_DIR, 'latest.json'), 'utf8'));
	const pagesPath = path.join(GSC_DIR, pointer.files.pages);
	const rows = parseCsv(await fs.readFile(pagesPath, 'utf8'));
	const totals = new Map();
	for (const row of rows) {
		const page = normalizeGscPage(row.page);
		const current = totals.get(page) || { clicks: 0, impressions: 0 };
		current.clicks += Number(row.clicks || 0);
		current.impressions += Number(row.impressions || 0);
		totals.set(page, current);
	}
	return {
		run_date: pointer.runDate,
		window: pointer.window,
		pages_file: path.relative(REPO_ROOT, pagesPath),
		totals
	};
}

async function findDrafts() {
	const entries = await fs.readdir(DRAFTS_DIR, { withFileTypes: true });
	return entries
		.filter(
			(entry) =>
				entry.isFile() &&
				/\.mdx?$/.test(entry.name) &&
				!/-research\.md$|-updated-sections\.md$/.test(entry.name)
		)
		.map((entry) => path.join(DRAFTS_DIR, entry.name));
}

async function loadLocalDraftMap() {
	const draftMap = new Map();
	for (const filePath of await findDrafts()) {
		const entry = await parseMarkdownFile(filePath);
		if (!entry.person) continue;
		if (draftMap.has(entry.person)) {
			throw new Error(`Duplicate local person slug: ${entry.person}`);
		}
		draftMap.set(entry.person, { entry, filePath });
	}
	return draftMap;
}

function runJsonAudit(script, args) {
	try {
		const stdout = execFileSync(
			process.execPath,
			[path.join(REPO_ROOT, script), ...args, '--json'],
			{
				cwd: REPO_ROOT,
				encoding: 'utf8',
				maxBuffer: 20 * 1024 * 1024
			}
		);
		return { ok: true, report: JSON.parse(stdout) };
	} catch (error) {
		return {
			ok: false,
			error: error instanceof Error ? error.message : String(error)
		};
	}
}

function deepSignals(filePath) {
	if (skipDeep || !filePath) return null;
	const quality = runJsonAudit('scripts/blog-quality-report.mjs', [filePath]);
	const source = runJsonAudit('scripts/blog-source-audit.mjs', [filePath]);
	const similarity = runJsonAudit('scripts/same-type-similarity.mjs', [filePath, '--n', '8']);
	return {
		contrast_pairs: quality.ok ? quality.report.contrast_pairs : { error: quality.error },
		head_term: quality.ok ? quality.report.head_term : { error: quality.error },
		answer_block: quality.ok ? quality.report.answer_block : { error: quality.error },
		source_audit: source.ok ? source.report.summary : { error: source.error },
		same_type_similarity: similarity.ok
			? {
					tripped: similarity.report.tripped,
					trip_threshold: similarity.report.trip_threshold,
					max_score: similarity.report.noise_floor?.max ?? null,
					trip_pairs: similarity.report.trip_pairs
				}
			: { error: similarity.error }
	};
}

function createReadOnlySupabaseClient() {
	const url = process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
	const key =
		process.env.SUPABASE_SERVICE_KEY ||
		process.env.PUBLIC_SUPABASE_ANON_KEY ||
		process.env.SUPABASE_ANON_KEY;
	if (!url || !key) throw new Error('Missing Supabase URL/key environment variables');
	return createClient(url, key);
}

async function loadPublishedRows() {
	let query = createReadOnlySupabaseClient()
		.from('blogs_famous_people')
		.select('*')
		.eq('published', true)
		.order('id', { ascending: true })
		.range(0, 999);
	if (personFilter) query = query.ilike('person', personFilter);
	const { data, error } = await query;
	if (error) throw new Error(`Unable to read published people rows: ${error.message}`);
	return data || [];
}

const [liveRows, localDrafts, gsc] = await Promise.all([
	loadPublishedRows(),
	loadLocalDraftMap(),
	loadGsc()
]);

if (personFilter && liveRows.length === 0) {
	throw new Error(`Published person not found: ${personFilter}`);
}

const rows = [];
for (const live of liveRows) {
	const slug = normalizePersonalitySlug(live.person);
	const local = localDrafts.get(slug) || null;
	const localEntry = local?.entry || null;
	const wordCount = countWords(live.content);
	const rawEmDashes = countOccurrences(live.content, '—');
	const proseEmDashes = countProseEmDashes(live.content);
	const gscPath = `/personality-analysis/${slug}`;
	const gscReading = gsc.totals.get(gscPath) || { clicks: 0, impressions: 0 };
	const comparedMetadataFields = metadataFieldsForLocal(localEntry);
	const metadataDifferences = metadataDiffFields(live, localEntry, comparedMetadataFields);
	const liveMetadataSnapshot = metadataSnapshot(live, comparedMetadataFields);
	const localMetadataSnapshot = metadataSnapshot(localEntry, comparedMetadataFields);

	rows.push({
		id: live.id,
		person: live.person,
		canonical_slug: slug,
		local_draft: local ? path.relative(REPO_ROOT, local.filePath) : null,
		gsc: gscReading,
		parity: {
			live_content_hash: hashPeopleContent(live.content),
			local_content_hash: localEntry ? hashPeopleContent(localEntry.content) : null,
			content_match: localEntry
				? hashPeopleContent(localEntry.content) === hashPeopleContent(live.content)
				: false,
			live_metadata_hash: hashJson(liveMetadataSnapshot),
			local_metadata_hash: localEntry ? hashJson(localMetadataSnapshot) : null,
			metadata_match: localEntry
				? hashJson(localMetadataSnapshot) === hashJson(liveMetadataSnapshot)
				: false,
			metadata_fields_compared: comparedMetadataFields,
			metadata_diff_fields: metadataDifferences,
			live_lastmod: live.lastmod,
			local_lastmod: localEntry?.lastmod ?? null,
			lastmod_match: localEntry ? String(localEntry.lastmod) === String(live.lastmod) : false
		},
		prose: {
			raw_em_dashes: rawEmDashes,
			prose_em_dashes: proseEmDashes,
			word_count: wordCount,
			prose_em_dashes_per_1000_words:
				wordCount > 0 ? Number(((proseEmDashes / wordCount) * 1000).toFixed(2)) : 0
		},
		grade: gradeReading(live.content_quality),
		signals: deepSignals(local?.filePath || null)
	});
}

const report = {
	generated_at: new Date().toISOString(),
	read_only: true,
	filters: {
		person: personFilter || null,
		deep_signals: !skipDeep
	},
	gsc: {
		run_date: gsc.run_date,
		window: gsc.window,
		pages_file: gsc.pages_file,
		case_insensitive_aggregation: true
	},
	summary: {
		published_rows: rows.length,
		local_content_matches: rows.filter((row) => row.parity.content_match).length,
		local_metadata_matches: rows.filter((row) => row.parity.metadata_match).length,
		lastmod_matches: rows.filter((row) => row.parity.lastmod_match).length,
		raw_em_dashes: rows.reduce((sum, row) => sum + row.prose.raw_em_dashes, 0),
		prose_em_dashes: rows.reduce((sum, row) => sum + row.prose.prose_em_dashes, 0),
		grade_states: Object.fromEntries(
			['missing', 'pre-v2', 'v2'].map((state) => [
				state,
				rows.filter((row) => row.grade.state === state).length
			])
		)
	},
	rows
};

const serialized = JSON.stringify(report, null, compact ? 0 : 2) + '\n';
if (outputPath) {
	await fs.mkdir(path.dirname(outputPath), { recursive: true });
	await fs.writeFile(outputPath, serialized, 'utf8');
	console.log(`People corpus audit written: ${outputPath}`);
	console.log(JSON.stringify(report.summary, null, 2));
} else {
	process.stdout.write(serialized);
}
