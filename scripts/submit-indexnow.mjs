// scripts/submit-indexnow.mjs
//
// Pings IndexNow with the pages that changed recently so Bing (and therefore
// ChatGPT search and Copilot, which both lean on Bing's index) picks them up in
// hours instead of waiting for a crawl.
//
// Why this exists: the 2026-09-14 Ahrefs audit flagged 64 pages whose content
// had changed but which had never been submitted anywhere. Google has its own
// crawl schedule; Bing gives us a push channel and we were not using it.
//
// How it works: read the sitemap this repo already generates
// (scripts/generate-sitemap.js writes static/sitemap.xml with a <lastmod> per
// URL), keep the URLs whose lastmod falls inside the window, drop the ones we
// already submitted at that same lastmod, and POST the rest to the shared
// IndexNow endpoint, which fans out to every participating engine.
//
// Spec: https://www.indexnow.org/documentation
//   POST https://api.indexnow.org/indexnow
//   Content-Type: application/json; charset=utf-8
//   { host, key, keyLocation, urlList }   — max 10,000 URLs per request
//
// Fail-open by design: a missing key, an unreachable endpoint or a 4xx all log
// and exit 0. A skipped ping costs us a few days of indexing latency; a failed
// build or a failed cron costs us the deploy.
//
// Usage:
//   node scripts/submit-indexnow.mjs              # submit the last 7 days
//   node scripts/submit-indexnow.mjs --days=30    # widen the window
//   node scripts/submit-indexnow.mjs --dry-run    # print, send nothing
//   node scripts/submit-indexnow.mjs --force      # ignore the state file
//
// Run it AFTER a deploy is live, never during the build: IndexNow fetches the
// URL soon after the ping, and a build-time ping would hand Bing the old page.

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_ROOT = path.join(__dirname, '..');

const SITE_URL = 'https://9takes.com';
const SITE_HOST = new URL(SITE_URL).host;

const ENDPOINT = 'https://api.indexnow.org/indexnow';
// The spec's hard ceiling for a single POST.
const MAX_URLS_PER_REQUEST = 10000;
const DEFAULT_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 20000;

const SITEMAP_PATH = path.join(SITE_ROOT, 'static', 'sitemap.xml');
const STATE_PATH = path.join(SITE_ROOT, 'docs', 'data', 'indexnow', 'last-submitted.json');

const SETUP_INSTRUCTIONS = `[indexnow] No INDEXNOW_KEY set — nothing submitted.

To turn this on (one-time, ~3 minutes):

  1. Generate a key (8-128 chars, hex digits and dashes only):
       node -e "console.log(crypto.randomUUID().replace(/-/g, ''))"

  2. Host it at the site root so IndexNow can verify ownership. Create
     static/<key>.txt whose ONLY contents are the key itself:
       printf '%s' "<key>" > static/<key>.txt
     SvelteKit serves static/ from the root, so it lands at
       ${SITE_URL}/<key>.txt
     Commit that file and deploy before the first submission.

  3. Set the env var so this script can read it:
       Vercel  -> Project Settings > Environment Variables > INDEXNOW_KEY
       locally -> add INDEXNOW_KEY=<key> to .env

  Do not commit the key to .env.example or any doc. Full write-up:
  docs/seo/indexnow.md`;

/**
 * @typedef {{ loc: string, lastmod: string | null }} SitemapEntry
 * @typedef {{ lastRunAt: string | null, urls: Record<string, string> }} SubmissionState
 * @typedef {{
 *   urls: string[],
 *   eligible: number,
 *   skippedUnchanged: number,
 *   skippedStale: number,
 *   overCap: number,
 *   lastmodByUrl: Record<string, string>
 * }} SubmissionPlan
 */

/**
 * @param {string[]} argv
 * @returns {{ days: number, dryRun: boolean, force: boolean }}
 */
export function parseArgs(argv) {
	const args = { days: DEFAULT_DAYS, dryRun: false, force: false };

	for (const arg of argv) {
		if (arg === '--dry-run') args.dryRun = true;
		else if (arg === '--force') args.force = true;
		else if (arg.startsWith('--days=')) {
			const parsed = Number(arg.slice('--days='.length));
			if (Number.isFinite(parsed) && parsed > 0) args.days = parsed;
		}
	}

	return args;
}

/**
 * Pulls <loc>/<lastmod> pairs out of the generated sitemap. Deliberately a
 * regex rather than an XML parser: the file is ours, its shape is fixed by
 * scripts/generate-sitemap.js, and this keeps the script dependency-free.
 *
 * @param {string} xml
 * @returns {SitemapEntry[]}
 */
export function parseSitemap(xml) {
	/** @type {SitemapEntry[]} */
	const entries = [];

	for (const block of xml.match(/<url>[\s\S]*?<\/url>/g) ?? []) {
		const loc = block.match(/<loc>([\s\S]*?)<\/loc>/)?.[1]?.trim();
		if (!loc) continue;

		const lastmod = block.match(/<lastmod>([\s\S]*?)<\/lastmod>/)?.[1]?.trim() ?? null;
		entries.push({ loc, lastmod: lastmod || null });
	}

	return entries;
}

/**
 * @param {unknown} raw
 * @returns {SubmissionState}
 */
export function normalizeState(raw) {
	if (!raw || typeof raw !== 'object') return { lastRunAt: null, urls: {} };

	const state = /** @type {Partial<SubmissionState>} */ (raw);
	const urls = state.urls && typeof state.urls === 'object' ? state.urls : {};

	/** @type {Record<string, string>} */
	const cleaned = {};
	for (const [url, lastmod] of Object.entries(urls)) {
		if (typeof lastmod === 'string' && lastmod) cleaned[url] = lastmod;
	}

	return {
		lastRunAt: typeof state.lastRunAt === 'string' ? state.lastRunAt : null,
		urls: cleaned
	};
}

/**
 * Decides what this run should send.
 *
 * The window is measured in whole UTC days, not in rolling 24h blocks: sitemap
 * lastmods are date-only, so `2026-09-20` parses to UTC midnight and a rolling
 * cutoff would drop pages edited *today* the moment the clock passed midnight
 * UTC. Flooring "now" to the start of its UTC day makes `--days=1` mean "edited
 * today", which is what anyone running it after a deploy expects.
 *
 * Three filters, in order:
 *   1. lastmod must parse and fall inside the window (an entry with no lastmod
 *      can't be judged fresh, so it is treated as stale).
 *   2. the URL must not already sit in the state file at that same lastmod —
 *      re-pinging unchanged pages is what gets a site rate-limited.
 *   3. the result is capped at the spec's 10,000-per-request limit; the oldest
 *      entries are dropped first so the freshest changes always go out.
 *
 * @param {{
 *   entries: SitemapEntry[],
 *   state?: SubmissionState,
 *   now?: number,
 *   days?: number,
 *   force?: boolean,
 *   maxUrls?: number
 * }} options
 * @returns {SubmissionPlan}
 */
export function planSubmission({
	entries,
	state = { lastRunAt: null, urls: {} },
	now = Date.now(),
	days = DEFAULT_DAYS,
	force = false,
	maxUrls = MAX_URLS_PER_REQUEST
}) {
	const cutoff = Math.floor(now / DAY_MS) * DAY_MS - days * DAY_MS;
	const submitted = state?.urls ?? {};

	/** @type {{ loc: string, lastmod: string, timestamp: number }[]} */
	const fresh = [];
	let skippedStale = 0;
	let skippedUnchanged = 0;

	for (const entry of entries) {
		const timestamp = entry.lastmod ? Date.parse(entry.lastmod) : Number.NaN;

		if (!Number.isFinite(timestamp) || timestamp < cutoff) {
			skippedStale += 1;
			continue;
		}

		if (!force && submitted[entry.loc] === entry.lastmod) {
			skippedUnchanged += 1;
			continue;
		}

		fresh.push({ loc: entry.loc, lastmod: /** @type {string} */ (entry.lastmod), timestamp });
	}

	// Newest first so the cap, if it ever bites, drops the least urgent pages.
	fresh.sort((a, b) => b.timestamp - a.timestamp || a.loc.localeCompare(b.loc));

	const selected = fresh.slice(0, Math.max(0, maxUrls));

	/** @type {Record<string, string>} */
	const lastmodByUrl = {};
	for (const item of selected) lastmodByUrl[item.loc] = item.lastmod;

	return {
		urls: selected.map((item) => item.loc),
		eligible: fresh.length,
		skippedUnchanged,
		skippedStale,
		overCap: fresh.length - selected.length,
		lastmodByUrl
	};
}

/**
 * @param {{ host?: string, key: string, keyLocation: string, urls: string[] }} options
 * @returns {{ host: string, key: string, keyLocation: string, urlList: string[] }}
 */
export function buildPayload({ host = SITE_HOST, key, keyLocation, urls }) {
	return { host, key, keyLocation, urlList: urls };
}

/**
 * Folds a successful submission into the state file. URLs that have dropped out
 * of the sitemap are pruned so the file tracks the live site rather than
 * growing forever.
 *
 * @param {{
 *   state: SubmissionState,
 *   submitted: Record<string, string>,
 *   knownUrls: Set<string>,
 *   submittedAt: string
 * }} options
 * @returns {SubmissionState}
 */
export function mergeState({ state, submitted, knownUrls, submittedAt }) {
	/** @type {Record<string, string>} */
	const urls = {};

	for (const [url, lastmod] of Object.entries({ ...state.urls, ...submitted })) {
		if (knownUrls.has(url)) urls[url] = lastmod;
	}

	return { lastRunAt: submittedAt, urls };
}

/**
 * The whole decision + network path, with every dependency injected so the
 * tests never touch the filesystem or the network.
 *
 * Returns rather than throws: callers translate the outcome into a log line and
 * always exit 0.
 *
 * @param {{
 *   sitemapXml: string,
 *   key?: string | null,
 *   keyLocation?: string,
 *   state?: SubmissionState,
 *   now?: number,
 *   days?: number,
 *   dryRun?: boolean,
 *   force?: boolean,
 *   maxUrls?: number,
 *   fetchImpl?: typeof fetch
 * }} options
 */
export async function runIndexNow({
	sitemapXml,
	key,
	keyLocation,
	state = { lastRunAt: null, urls: {} },
	now = Date.now(),
	days = DEFAULT_DAYS,
	dryRun = false,
	force = false,
	maxUrls = MAX_URLS_PER_REQUEST,
	fetchImpl = fetch
}) {
	const entries = parseSitemap(sitemapXml);
	const plan = planSubmission({ entries, state, now, days, force, maxUrls });

	// A missing key is a setup gap, not an error. Say so and stop — but in a
	// dry run there is nothing to authenticate, so still show the selection.
	if (!key && !dryRun) {
		return { outcome: 'missing-key', plan, nextState: null, httpStatus: null };
	}

	if (plan.urls.length === 0) {
		return { outcome: 'nothing-to-submit', plan, nextState: null, httpStatus: null };
	}

	if (dryRun) {
		return { outcome: 'dry-run', plan, nextState: null, httpStatus: null, missingKey: !key };
	}

	const resolvedKeyLocation = keyLocation || `${SITE_URL}/${key}.txt`;
	const payload = buildPayload({
		key: /** @type {string} */ (key),
		keyLocation: resolvedKeyLocation,
		urls: plan.urls
	});

	let response;
	try {
		response = await fetchImpl(ENDPOINT, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json; charset=utf-8' },
			body: JSON.stringify(payload),
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
		});
	} catch (error) {
		return {
			outcome: 'network-error',
			plan,
			nextState: null,
			httpStatus: null,
			error: error instanceof Error ? error.message : String(error)
		};
	}

	if (!response.ok) {
		// IndexNow puts the useful detail (which URL, which key) in the body.
		const body = await response
			.text()
			.then((text) => text.slice(0, 300))
			.catch(() => '');

		return { outcome: 'http-error', plan, nextState: null, httpStatus: response.status, body };
	}

	const nextState = mergeState({
		state,
		submitted: plan.lastmodByUrl,
		knownUrls: new Set(entries.map((entry) => entry.loc)),
		submittedAt: new Date(now).toISOString()
	});

	return { outcome: 'submitted', plan, nextState, httpStatus: response.status };
}

/**
 * @param {string} filePath
 * @returns {Promise<SubmissionState>}
 */
async function readState(filePath) {
	try {
		return normalizeState(JSON.parse(await readFile(filePath, 'utf-8')));
	} catch {
		// No state file yet (first run) or a corrupted one: start clean rather
		// than crash. Worst case we re-submit URLs we already sent once.
		return { lastRunAt: null, urls: {} };
	}
}

/**
 * @param {string} filePath
 * @param {SubmissionState} state
 */
async function writeState(filePath, state) {
	await mkdir(path.dirname(filePath), { recursive: true });
	// Tabs + trailing newline so the generated file satisfies `prettier --check .`
	// (the repo sets useTabs) and never fails `pnpm lint`.
	await writeFile(filePath, `${JSON.stringify(state, null, '\t')}\n`, 'utf-8');
}

/**
 * @param {SubmissionPlan} plan
 * @param {number} days
 */
function describePlan(plan, days) {
	return (
		`${plan.urls.length} URL(s) changed in the last ${days} day(s)` +
		` (${plan.skippedUnchanged} already submitted at that lastmod,` +
		` ${plan.skippedStale} outside the window` +
		`${plan.overCap > 0 ? `, ${plan.overCap} over the ${MAX_URLS_PER_REQUEST} cap` : ''})`
	);
}

async function main() {
	// Loaded here rather than at module scope so importing this file (the spec
	// does) never reaches for a .env.
	const { default: dotenv } = await import('dotenv');
	dotenv.config();

	const args = parseArgs(process.argv.slice(2));

	let sitemapXml;
	try {
		sitemapXml = await readFile(SITEMAP_PATH, 'utf-8');
	} catch {
		console.warn(
			`[indexnow] No sitemap at static/sitemap.xml — run \`pnpm gen:sitemap\` first. Nothing submitted.`
		);
		return;
	}

	const state = await readState(STATE_PATH);
	const key = process.env.INDEXNOW_KEY?.trim() || null;
	const keyLocation = process.env.INDEXNOW_KEY_LOCATION?.trim() || undefined;

	const result = await runIndexNow({
		sitemapXml,
		key,
		keyLocation,
		state,
		days: args.days,
		dryRun: args.dryRun,
		force: args.force
	});

	const { plan } = result;

	switch (result.outcome) {
		case 'missing-key':
			console.log(`[indexnow] ${describePlan(plan, args.days)}.`);
			console.log(SETUP_INSTRUCTIONS);
			return;

		case 'nothing-to-submit':
			console.log(
				`[indexnow] Nothing to submit: ${describePlan(plan, args.days)}.` +
					` Last run: ${state.lastRunAt ?? 'never'}.`
			);
			return;

		case 'dry-run': {
			console.log(`[indexnow] DRY RUN — ${describePlan(plan, args.days)}. Nothing sent.`);
			console.log(`[indexnow] POST ${ENDPOINT}`);
			console.log(
				`[indexnow] payload: ${JSON.stringify({
					host: SITE_HOST,
					key: key ? `${key.slice(0, 4)}…(${key.length} chars)` : '<INDEXNOW_KEY not set>',
					keyLocation: keyLocation || `${SITE_URL}/${key ?? '<key>'}.txt`,
					urlList: `[${plan.urls.length} URLs]`
				})}`
			);
			for (const url of plan.urls) console.log(`  ${url}  (${plan.lastmodByUrl[url]})`);
			if (result.missingKey) console.log(`\n${SETUP_INSTRUCTIONS}`);
			return;
		}

		case 'network-error':
			console.warn(
				`[indexnow] Submission failed (network): ${result.error}. ` +
					`${plan.urls.length} URL(s) left unsubmitted; they will be retried next run.`
			);
			return;

		case 'http-error':
			console.warn(
				`[indexnow] Submission failed: HTTP ${result.httpStatus}` +
					`${result.body ? ` — ${result.body}` : ''}. ` +
					`${plan.urls.length} URL(s) left unsubmitted; they will be retried next run.` +
					(result.httpStatus === 403
						? ` A 403 means the key file is missing or wrong — check ${SITE_URL}/<key>.txt.`
						: '')
			);
			return;

		case 'submitted':
		default:
			await writeState(STATE_PATH, /** @type {SubmissionState} */ (result.nextState));
			console.log(
				`[indexnow] Submitted ${plan.urls.length} URL(s) — HTTP ${result.httpStatus}. ` +
					`${describePlan(plan, args.days)}.`
			);
			console.log(
				`[indexnow] State written to docs/data/indexnow/last-submitted.json` +
					` (${Object.keys(/** @type {SubmissionState} */ (result.nextState).urls).length} URLs tracked).`
			);
	}
}

const invokedDirectly =
	process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (invokedDirectly) {
	main().catch((error) => {
		// Never let an IndexNow ping break a deploy or a cron chain.
		console.warn(`[indexnow] skipped: ${error?.message ?? error}`);
	});
}
