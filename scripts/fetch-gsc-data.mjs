// scripts/fetch-gsc-data.mjs
//
// Pull Google Search Console performance data for 9takes.com into docs/data/gsc/
// so the seo-content-strategist agent can work from real query data.
//
// Auth: reuses the existing Google service account
//   id-takes-gmail-service-account@smart-mark-302504.iam.gserviceaccount.com
// with the private key already in .env (PRIVATE_gmail_private_key).
//
// One-time setup (manual, ~5 minutes):
//   1. https://console.cloud.google.com/apis/library/searchconsole.googleapis.com
//      -> project "smart-mark-302504" -> Enable
//   2. https://search.google.com/search-console -> 9takes property -> Settings
//      -> Users and permissions -> Add user
//      -> id-takes-gmail-service-account@smart-mark-302504.iam.gserviceaccount.com
//      -> Permission: "Full" (restricted users cannot read query data via API)
//
// Usage:
//   node scripts/fetch-gsc-data.mjs               # last 90 days
//   node scripts/fetch-gsc-data.mjs --days 28     # custom window
//
// Output (CSV, newest run wins, dated by run date):
//   docs/data/gsc/YYYY-MM-DD-queries.csv   top 1000 queries (clicks, impressions, ctr, position)
//   docs/data/gsc/YYYY-MM-DD-pages.csv     top 1000 pages
//   docs/data/gsc/YYYY-MM-DD-page-query.csv top 5000 page+query pairs (for per-article analysis)
//   docs/data/gsc/latest.json              pointer + run metadata, read by the SEO agent

import { google } from 'googleapis';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = resolve(REPO_ROOT, 'docs/data/gsc');
const SERVICE_ACCOUNT_EMAIL =
	'id-takes-gmail-service-account@smart-mark-302504.iam.gserviceaccount.com';
// GSC property. If the site is registered as a domain property use 'sc-domain:9takes.com'.
const SITE_CANDIDATES = ['sc-domain:9takes.com', 'https://9takes.com/', 'https://www.9takes.com/'];

// The env value is a JSON blob: {"privateKey":"-----BEGIN PRIVATE KEY-----\n..."}
// (same format src/lib/email/sender.ts consumes). Unwrap it, with a fallback for
// a raw PEM value in case the format ever changes.
function unwrapKey(raw) {
	let v = raw.trim();
	// strip one layer of surrounding quotes if present (.env quoting)
	if (v.startsWith('"') && v.endsWith('"') && !v.startsWith('"{')) v = v.slice(1, -1);
	if (v.startsWith('"{') && v.endsWith('}"')) v = v.slice(1, -1);
	if (v.startsWith('{')) {
		const parsed = JSON.parse(v);
		if (!parsed.privateKey)
			throw new Error('privateKey field missing from PRIVATE_gmail_private_key JSON');
		return parsed.privateKey;
	}
	return v.replace(/\\n/g, '\n');
}

function loadPrivateKey() {
	if (process.env.PRIVATE_gmail_private_key)
		return unwrapKey(process.env.PRIVATE_gmail_private_key);
	for (const f of ['.env.local', '.env']) {
		try {
			const txt = readFileSync(resolve(REPO_ROOT, f), 'utf8');
			const m = txt.match(/^PRIVATE_gmail_private_key=(.*)$/m);
			if (m) return unwrapKey(m[1]);
		} catch {
			/* file missing, try next */
		}
	}
	throw new Error('PRIVATE_gmail_private_key not found in env, .env.local, or .env');
}

const daysArg = process.argv.indexOf('--days');
const days = daysArg !== -1 ? Number(process.argv[daysArg + 1]) : 90;
const end = new Date();
end.setDate(end.getDate() - 2); // GSC data lags ~2 days
const start = new Date(end);
start.setDate(start.getDate() - days);
const fmt = (d) => d.toISOString().slice(0, 10);

const auth = new google.auth.JWT({
	email: SERVICE_ACCOUNT_EMAIL,
	key: loadPrivateKey(),
	scopes: ['https://www.googleapis.com/auth/webmasters.readonly']
});
const sc = google.searchconsole({ version: 'v1', auth });

async function resolveSite() {
	const { data } = await sc.sites.list();
	const entries = data.siteEntry ?? [];
	for (const candidate of SITE_CANDIDATES) {
		if (entries.some((e) => e.siteUrl === candidate)) return candidate;
	}
	throw new Error(
		`Service account has no access to any of: ${SITE_CANDIDATES.join(', ')}.\n` +
			`Sites it CAN see: ${entries.map((e) => e.siteUrl).join(', ') || '(none)'}\n` +
			`Fix: add ${SERVICE_ACCOUNT_EMAIL} as a Full user on the 9takes Search Console property.`
	);
}

async function query(site, dimensions, rowLimit) {
	const { data } = await sc.searchanalytics.query({
		siteUrl: site,
		requestBody: {
			startDate: fmt(start),
			endDate: fmt(end),
			dimensions,
			rowLimit,
			dataState: 'final'
		}
	});
	return data.rows ?? [];
}

const csvEscape = (v) =>
	/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v);

function writeCsv(file, header, rows) {
	const lines = [header.join(',')];
	for (const r of rows) {
		lines.push(
			[
				...r.keys.map(csvEscape),
				r.clicks,
				r.impressions,
				(r.ctr * 100).toFixed(2),
				r.position.toFixed(1)
			].join(',')
		);
	}
	writeFileSync(file, lines.join('\n') + '\n');
	console.log(`wrote ${file} (${rows.length} rows)`);
}

const site = await resolveSite();
console.log(`Querying ${site} from ${fmt(start)} to ${fmt(end)} (${days} days)`);
mkdirSync(OUT_DIR, { recursive: true });
const runDate = new Date().toISOString().slice(0, 10);

const [queries, pages, pageQuery] = await Promise.all([
	query(site, ['query'], 1000),
	query(site, ['page'], 1000),
	query(site, ['page', 'query'], 5000)
]);

writeCsv(
	resolve(OUT_DIR, `${runDate}-queries.csv`),
	['query', 'clicks', 'impressions', 'ctr_pct', 'position'],
	queries
);
writeCsv(
	resolve(OUT_DIR, `${runDate}-pages.csv`),
	['page', 'clicks', 'impressions', 'ctr_pct', 'position'],
	pages
);
writeCsv(
	resolve(OUT_DIR, `${runDate}-page-query.csv`),
	['page', 'query', 'clicks', 'impressions', 'ctr_pct', 'position'],
	pageQuery
);

writeFileSync(
	resolve(OUT_DIR, 'latest.json'),
	JSON.stringify(
		{
			runDate,
			site,
			window: { startDate: fmt(start), endDate: fmt(end), days },
			files: {
				queries: `${runDate}-queries.csv`,
				pages: `${runDate}-pages.csv`,
				pageQuery: `${runDate}-page-query.csv`
			}
		},
		null,
		2
	) + '\n'
);
console.log('wrote latest.json');
