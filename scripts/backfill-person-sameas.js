// scripts/backfill-person-sameas.js
// #!/usr/bin/env node

/**
 * Backfill `Person.sameAs` (plus `wikidata_qid` and `imdb_id`) data on
 * `blogs_famous_people` rows. Closes the follow-up wave punted from
 * Bucket 1 — see docs/seo/buckets/2026-05-07-bucket-1-engineering-hygiene.md
 * Section "Follow-up wave: Person.sameAs for top 100".
 *
 * Pipeline (per row):
 *   1. Pull existing `same_as`, `wikidata_qid`, `imdb_id` from the matching
 *      `src/blog/people/drafts/<Slug>.md` frontmatter (if present).
 *      ~58 of 402 drafts already have this data populated — we use it
 *      first to avoid hitting Wikidata for known answers.
 *   2. If the DB row has empty/null fields and the draft has values,
 *      backfill the DB row from the draft.
 *   3. If both are empty, queue the row for a Wikidata lookup
 *      (wbsearchentities by `person` name).
 *   4. For each lookup hit: resolve QID → Wikipedia URL via wbgetentities
 *      sitelinks; resolve IMDb nconst via Wikidata claim P345.
 *   5. Patch the DB row, and (when --write-frontmatter is set) sync the
 *      result back to the draft frontmatter so the two stay aligned.
 *
 * Safety:
 *   - --dry-run is the default. You must pass --apply to write anything.
 *   - Wikidata lookups are rate-limited to 1 req / 200ms (with a polite
 *     User-Agent string). Wikipedia/IMDb URLs are validated before
 *     persisting (no guessed Wikipedia slugs).
 *   - --limit=N caps how many rows are processed in one run (default 100).
 *
 * Usage:
 *   node scripts/backfill-person-sameas.js                     # dry-run, top 100 by recency
 *   node scripts/backfill-person-sameas.js --apply             # actually write
 *   node scripts/backfill-person-sameas.js --apply --limit=25  # process 25 rows
 *   node scripts/backfill-person-sameas.js --rank=traffic      # rank by analytics views (90d)
 *   node scripts/backfill-person-sameas.js --rank=alpha        # alphabetic by slug
 *   node scripts/backfill-person-sameas.js --apply --write-frontmatter
 *
 * Environment:
 *   SUPABASE_URL or PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_KEY
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import matter from 'gray-matter';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const DRAFTS_DIR = path.join(REPO_ROOT, 'src/blog/people/drafts');

const USER_AGENT = '9takes-sameAs-backfill/1.0 (https://9takes.com; djwayne35@gmail.com)';
const WIKIDATA_API = 'https://www.wikidata.org/w/api.php';
const WIKIDATA_RATE_LIMIT_MS = 200;

const args = parseArgs(process.argv.slice(2));

if (args.help) {
	printUsage();
	process.exit(0);
}

const DRY_RUN = !args.apply;
const LIMIT = Number.isFinite(args.limit) ? args.limit : 100;
const RANK = args.rank || 'recent'; // recent | traffic | alpha
const WRITE_FRONTMATTER = Boolean(args['write-frontmatter']);

main().catch((err) => {
	console.error('FATAL:', err);
	process.exit(1);
});

async function main() {
	console.log(`\n=== backfill-person-sameas ===`);
	console.log(`mode: ${DRY_RUN ? 'DRY RUN (no writes)' : 'APPLY (will write)'}`);
	console.log(`limit: ${LIMIT}`);
	console.log(`rank: ${RANK}`);
	console.log(`write frontmatter: ${WRITE_FRONTMATTER ? 'yes' : 'no'}\n`);

	const supabase = createSupabase();
	const drafts = await readAllDrafts();
	console.log(`Loaded ${drafts.size} draft frontmatter records from src/blog/people/drafts/`);

	const ranked = await rankBlogsFamousPeople(supabase, RANK, LIMIT * 3);
	console.log(
		`Loaded ${ranked.length} candidate rows from blogs_famous_people (ranked by ${RANK})`
	);

	const work = [];

	for (const row of ranked) {
		if (work.length >= LIMIT) break;
		const draft = drafts.get(row.slug);
		const plan = planRow(row, draft);
		if (plan.action === 'skip') continue;
		work.push({ row, draft, plan });
	}

	console.log(`\nIdentified ${work.length} rows to act on (within limit ${LIMIT}).`);
	console.log(
		`  - from-frontmatter: ${work.filter((w) => w.plan.action === 'from-frontmatter').length}`
	);
	console.log(
		`  - lookup-needed:    ${work.filter((w) => w.plan.action === 'lookup-needed').length}\n`
	);

	let processed = 0;
	let dbUpdated = 0;
	let frontmatterUpdated = 0;

	for (const item of work) {
		processed++;
		const label = `[${processed}/${work.length}] ${item.row.slug}`;

		if (item.plan.action === 'from-frontmatter') {
			console.log(`${label}  fill DB from frontmatter`);
			if (!DRY_RUN) {
				await updateDbRow(supabase, item.row.id, item.plan.values);
				dbUpdated++;
			}
			continue;
		}

		// lookup-needed
		const personName = item.row.person || prettyFromSlug(item.row.slug);
		console.log(`${label}  Wikidata lookup for "${personName}"`);
		const lookup = await lookupViaWikidata(personName);
		if (!lookup) {
			console.log(`${label}    no confident Wikidata match — skipping`);
			continue;
		}
		console.log(
			`${label}    matched QID=${lookup.qid}` +
				(lookup.imdb ? ` IMDb=${lookup.imdb}` : '') +
				(lookup.wikipedia ? ` Wiki=${shortUrl(lookup.wikipedia)}` : '')
		);

		const merged = mergeValues(item.plan.values || {}, {
			same_as: dedupeUrls([
				...(item.plan.values?.same_as || []),
				...(lookup.wikipedia ? [lookup.wikipedia] : [])
			]),
			wikidata_qid: lookup.qid,
			imdb_id: lookup.imdb || null
		});

		if (!DRY_RUN) {
			await updateDbRow(supabase, item.row.id, merged);
			dbUpdated++;
			if (WRITE_FRONTMATTER && item.draft) {
				await writeFrontmatter(item.draft, merged);
				frontmatterUpdated++;
			}
		}

		await sleep(WIKIDATA_RATE_LIMIT_MS);
	}

	console.log(`\n=== summary ===`);
	console.log(`Processed:            ${processed}`);
	console.log(`DB rows updated:      ${dbUpdated}${DRY_RUN ? ' (would, dry-run)' : ''}`);
	if (WRITE_FRONTMATTER) {
		console.log(`Frontmatter updated:  ${frontmatterUpdated}${DRY_RUN ? ' (would, dry-run)' : ''}`);
	}
	console.log(`\nDone.\n`);
}

// ---- planning ---------------------------------------------------------------

function planRow(row, draft) {
	const dbHas = {
		same_as: nonEmptyArray(row.same_as),
		wikidata_qid: nonEmptyString(row.wikidata_qid),
		imdb_id: nonEmptyString(row.imdb_id)
	};
	if (dbHas.same_as && dbHas.wikidata_qid) {
		// already populated; nothing to do
		return { action: 'skip' };
	}

	const draftValues = draft
		? {
				same_as: nonEmptyArray(draft.same_as) ? draft.same_as : [],
				wikidata_qid: nonEmptyString(draft.wikidata_qid) ? draft.wikidata_qid : null,
				imdb_id: nonEmptyString(draft.imdb_id) ? draft.imdb_id : null
			}
		: { same_as: [], wikidata_qid: null, imdb_id: null };

	const draftHasAnything =
		draftValues.same_as.length > 0 || draftValues.wikidata_qid || draftValues.imdb_id;

	if (draftHasAnything) {
		// Merge: prefer DB existing values where present, fill gaps from draft
		return {
			action: 'from-frontmatter',
			values: {
				same_as: dedupeUrls([...(row.same_as || []), ...draftValues.same_as]),
				wikidata_qid: row.wikidata_qid || draftValues.wikidata_qid,
				imdb_id: row.imdb_id || draftValues.imdb_id
			}
		};
	}

	return { action: 'lookup-needed', values: { same_as: row.same_as || [] } };
}

// ---- DB helpers -------------------------------------------------------------

function createSupabase() {
	const url = process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
	const key = process.env.SUPABASE_SERVICE_KEY;
	if (!url || !key) {
		console.error('Missing SUPABASE_URL/SUPABASE_SERVICE_KEY env. See script header.');
		process.exit(2);
	}
	return createClient(url, key, { auth: { persistSession: false } });
}

async function rankBlogsFamousPeople(supabase, rank, fetchLimit) {
	// `blogs_famous_people` has no `slug` column — slug is derived from the
	// path segment after `/personality-analysis/` in `loc`.
	let query = supabase
		.from('blogs_famous_people')
		.select('id, loc, person, title, same_as, wikidata_qid, imdb_id, published_at, lastmod')
		.eq('published', true)
		.like('loc', '%/personality-analysis/%');

	if (rank === 'recent' || rank === 'traffic') {
		query = query.order('lastmod', { ascending: false, nullsFirst: false });
	} else if (rank === 'alpha') {
		query = query.order('person', { ascending: true });
	}

	const { data, error } = await query.limit(fetchLimit);
	if (error) throw error;

	// Derive `slug` on the JS side so the rest of the pipeline can use it.
	const rows = (data || [])
		.map((row) => ({ ...row, slug: deriveSlug(row.loc) }))
		.filter((row) => row.slug);

	if (rank !== 'traffic') return rows;

	// Traffic ranking: aggregate visits per /personality-analysis/<slug> path
	// over the last 90 days and resort.
	const since = new Date();
	since.setDate(since.getDate() - 90);
	const { data: visits, error: vErr } = await supabase
		.from('page_analytics_visits')
		.select('path')
		.gte('started_at', since.toISOString())
		.like('path', '/personality-analysis/%');
	if (vErr) {
		console.warn('Traffic rank fallback (analytics read failed):', vErr.message);
		return rows;
	}
	const counts = new Map();
	for (const v of visits || []) {
		const slug = (v.path || '').replace('/personality-analysis/', '').split(/[/?#]/)[0];
		if (!slug) continue;
		counts.set(slug, (counts.get(slug) || 0) + 1);
	}
	return rows.sort((a, b) => (counts.get(b.slug) || 0) - (counts.get(a.slug) || 0));
}

function deriveSlug(loc) {
	if (!loc || typeof loc !== 'string') return null;
	const idx = loc.indexOf('/personality-analysis/');
	if (idx < 0) return null;
	const tail = loc.slice(idx + '/personality-analysis/'.length);
	const slug = tail.split(/[/?#]/)[0];
	return slug || null;
}

async function updateDbRow(supabase, id, values) {
	const patch = {};
	if (values.same_as && values.same_as.length > 0) patch.same_as = values.same_as;
	if (values.wikidata_qid) patch.wikidata_qid = values.wikidata_qid;
	if (values.imdb_id) patch.imdb_id = values.imdb_id;
	if (Object.keys(patch).length === 0) return;
	const { error } = await supabase.from('blogs_famous_people').update(patch).eq('id', id);
	if (error) throw error;
}

// ---- frontmatter helpers ----------------------------------------------------

async function readAllDrafts() {
	const map = new Map();
	let entries;
	try {
		entries = await fs.readdir(DRAFTS_DIR);
	} catch (err) {
		console.warn(`Could not read drafts dir ${DRAFTS_DIR}:`, err.message);
		return map;
	}
	for (const entry of entries) {
		if (!entry.endsWith('.md')) continue;
		const filePath = path.join(DRAFTS_DIR, entry);
		try {
			const raw = await fs.readFile(filePath, 'utf8');
			const fm = matter(raw).data || {};
			const slug = (fm.slug || entry.replace(/\.md$/, '').toLowerCase()).toString();
			map.set(slug, {
				path: filePath,
				slug,
				name: fm.name || fm.title || null,
				same_as: Array.isArray(fm.same_as) ? fm.same_as : [],
				wikidata_qid: fm.wikidata_qid || null,
				imdb_id: fm.imdb_id || null
			});
		} catch (err) {
			console.warn(`  parse failed for ${entry}:`, err.message);
		}
	}
	return map;
}

async function writeFrontmatter(draft, values) {
	const raw = await fs.readFile(draft.path, 'utf8');
	const parsed = matter(raw);
	const fm = parsed.data || {};
	if (values.same_as && values.same_as.length > 0) fm.same_as = values.same_as;
	if (values.wikidata_qid) fm.wikidata_qid = values.wikidata_qid;
	if (values.imdb_id) fm.imdb_id = values.imdb_id;
	const next = matter.stringify(parsed.content, fm);
	await fs.writeFile(draft.path, next, 'utf8');
}

// ---- Wikidata lookup --------------------------------------------------------

async function lookupViaWikidata(personName) {
	const search = await wikidataFetch(WIKIDATA_API, {
		action: 'wbsearchentities',
		search: personName,
		language: 'en',
		type: 'item',
		limit: '5',
		format: 'json'
	});
	const candidates = (search?.search || []).filter((s) => s.id && s.id.startsWith('Q'));
	if (candidates.length === 0) return null;

	// Pick the first hit that mentions human-relevant words in description, to
	// avoid matching companies/places of the same name. Heuristic only.
	const top =
		candidates.find((c) =>
			/actor|musician|writer|founder|politician|comedian|athlete|host|producer|director|artist|model|chef|entrepreneur|philosopher|author|poet|scientist|journalist|youtuber|streamer|rapper|singer/i.test(
				c.description || ''
			)
		) || candidates[0];

	await sleep(WIKIDATA_RATE_LIMIT_MS);
	const entities = await wikidataFetch(WIKIDATA_API, {
		action: 'wbgetentities',
		ids: top.id,
		props: 'sitelinks/urls|claims',
		sitefilter: 'enwiki',
		format: 'json'
	});
	const entity = entities?.entities?.[top.id];
	if (!entity) return { qid: top.id };

	const wikipedia = entity.sitelinks?.enwiki?.url || null;
	const imdb = extractImdbFromClaims(entity.claims);
	return { qid: top.id, wikipedia, imdb };
}

function extractImdbFromClaims(claims) {
	const arr = claims?.P345; // P345 = IMDb ID
	if (!Array.isArray(arr) || arr.length === 0) return null;
	for (const c of arr) {
		const v = c?.mainsnak?.datavalue?.value;
		if (typeof v === 'string' && /^nm[0-9]+$/.test(v)) return v;
	}
	return null;
}

async function wikidataFetch(url, params) {
	const qs = new URLSearchParams(params).toString();
	const res = await fetch(`${url}?${qs}`, {
		headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' }
	});
	if (!res.ok) {
		console.warn(`  wikidata ${res.status} for ${qs.slice(0, 80)}`);
		return null;
	}
	return res.json();
}

// ---- utils ------------------------------------------------------------------

function dedupeUrls(arr) {
	const seen = new Set();
	const out = [];
	for (const u of arr || []) {
		if (typeof u !== 'string') continue;
		const k = u.trim();
		if (!k) continue;
		if (seen.has(k)) continue;
		seen.add(k);
		out.push(k);
	}
	return out;
}

function nonEmptyArray(v) {
	return (
		Array.isArray(v) && v.length > 0 && v.some((x) => typeof x === 'string' && x.trim().length > 0)
	);
}

function nonEmptyString(v) {
	return typeof v === 'string' && v.trim().length > 0;
}

function mergeValues(a, b) {
	return { ...a, ...b };
}

function prettyFromSlug(slug) {
	return slug
		.split('-')
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(' ');
}

function shortUrl(u) {
	return u.replace(/^https?:\/\//, '').slice(0, 60);
}

function sleep(ms) {
	return new Promise((r) => setTimeout(r, ms));
}

function parseArgs(argv) {
	const out = { _: [] };
	for (const a of argv) {
		if (a === '--apply') out.apply = true;
		else if (a === '--dry-run') out.apply = false;
		else if (a === '--write-frontmatter') out['write-frontmatter'] = true;
		else if (a === '--help' || a === '-h') out.help = true;
		else if (a.startsWith('--limit=')) out.limit = parseInt(a.slice(8), 10);
		else if (a.startsWith('--rank=')) out.rank = a.slice(7);
		else out._.push(a);
	}
	return out;
}

function printUsage() {
	console.log(`Usage: node scripts/backfill-person-sameas.js [options]

Options:
  --apply                  Write to the DB (default is dry-run).
  --limit=N                Process at most N rows (default 100).
  --rank=recent|traffic|alpha
                           How to rank candidates. Default: recent (lastmod DESC).
                           traffic: 90d page_analytics_visits aggregate.
                           alpha:   alphabetic by slug.
  --write-frontmatter      Also patch src/blog/people/drafts/<slug>.md frontmatter
                           when the DB row gets new values via Wikidata lookup.
  --dry-run                Explicit dry-run (this is the default).
  --help                   Show this help.

Environment:
  SUPABASE_URL or PUBLIC_SUPABASE_URL
  SUPABASE_SERVICE_KEY     (required for --apply mode)
`);
}
