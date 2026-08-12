#!/usr/bin/env node
// scripts/capture-entity-gap-experiment.mjs

// Capture a narrow Search Console baseline/checkpoint for Emerging Entity Gap
// experiments without replacing docs/data/gsc/latest.json or the normal CSVs.
//
// Usage:
//   node scripts/capture-entity-gap-experiment.mjs \
//     --label 2026-08-12-baseline \
//     --days 28 \
//     --slugs ashby,john-coogan,leila-hormozi

import { google } from 'googleapis';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = resolve(REPO_ROOT, 'docs/data/gsc/experiments');
const SERVICE_ACCOUNT_EMAIL =
	'id-takes-gmail-service-account@smart-mark-302504.iam.gserviceaccount.com';
const SITE_CANDIDATES = ['sc-domain:9takes.com', 'https://9takes.com/', 'https://www.9takes.com/'];
const EXACT_NAME_QUERY_OVERRIDES = new Map([['ashby', 'ashby florence']]);
const BIOGRAPHY_QUERY_PATTERN =
	/\b(?:who is|bio|biography|age|birthday|born|wife|husband|spouse|partner|boyfriend|girlfriend|parents?|family|real name|maiden name|from|college|education|height|tall|net worth|ethnicity|heritage|wikipedia|wiki|background|children|kids)\b/i;
const PERSONALITY_QUERY_PATTERN = /\b(?:enneagram|personality|mbti|type\s*[1-9])\b/i;

function readOption(argv, name, fallback) {
	const index = argv.indexOf(name);
	const inline = argv.find((argument) => argument.startsWith(`${name}=`));
	if (inline) return inline.slice(name.length + 1);
	if (index >= 0) return argv[index + 1];
	return fallback;
}

function parseArgs(argv) {
	const label = readOption(argv, '--label', `${new Date().toISOString().slice(0, 10)}-checkpoint`);
	const days = Number(readOption(argv, '--days', '28'));
	const slugs = String(readOption(argv, '--slugs', ''))
		.split(',')
		.map((slug) => slug.trim().toLowerCase())
		.filter(Boolean);

	if (!/^[a-z0-9][a-z0-9-]*$/.test(label)) {
		throw new Error('--label must contain only lowercase letters, numbers, and hyphens');
	}
	if (!Number.isInteger(days) || days < 7 || days > 90) {
		throw new Error('--days must be an integer from 7 to 90');
	}
	if (slugs.length === 0 || slugs.some((slug) => !/^[a-z0-9-]+$/.test(slug))) {
		throw new Error('--slugs must be a comma-separated list of personality profile slugs');
	}

	return { label, days, slugs: [...new Set(slugs)] };
}

function unwrapKey(raw) {
	let value = raw.trim();
	if (value.startsWith('"') && value.endsWith('"') && !value.startsWith('"{')) {
		value = value.slice(1, -1);
	}
	if (value.startsWith('"{') && value.endsWith('}"')) value = value.slice(1, -1);
	if (value.startsWith('{')) {
		const parsed = JSON.parse(value);
		if (!parsed.privateKey) throw new Error('privateKey field missing from auth JSON');
		return parsed.privateKey;
	}
	return value.replace(/\\n/g, '\n');
}

function loadPrivateKey() {
	if (process.env.PRIVATE_gmail_private_key) {
		return unwrapKey(process.env.PRIVATE_gmail_private_key);
	}
	for (const fileName of ['.env.local', '.env']) {
		try {
			const source = readFileSync(resolve(REPO_ROOT, fileName), 'utf8');
			const match = source.match(/^PRIVATE_gmail_private_key=(.*)$/m);
			if (match) return unwrapKey(match[1]);
		} catch {
			// Continue to the next supported env file.
		}
	}
	throw new Error('PRIVATE_gmail_private_key not found');
}

function formatDate(date) {
	return date.toISOString().slice(0, 10);
}

function slugFromPage(page) {
	try {
		const url = new URL(page);
		if (url.hostname !== '9takes.com' && url.hostname !== 'www.9takes.com') return null;
		const match = url.pathname.match(/^\/personality-analysis\/([^/]+)\/?$/i);
		return match ? match[1].toLowerCase() : null;
	} catch {
		return null;
	}
}

function isDocumentUrl(page) {
	try {
		const url = new URL(page);
		return !url.hash && !url.search;
	} catch {
		return false;
	}
}

function createMetric() {
	return { clicks: 0, impressions: 0, weightedPosition: 0 };
}

function addRow(metric, row) {
	const impressions = Number(row.impressions ?? 0);
	metric.clicks += Number(row.clicks ?? 0);
	metric.impressions += impressions;
	metric.weightedPosition += Number(row.position ?? 0) * impressions;
}

function finalizeMetric(metric) {
	return {
		clicks: metric.clicks,
		impressions: metric.impressions,
		ctr_pct: metric.impressions > 0 ? (metric.clicks / metric.impressions) * 100 : 0,
		position: metric.impressions > 0 ? metric.weightedPosition / metric.impressions : null
	};
}

function queryFamily(query, exactName) {
	const normalized = query.trim().toLowerCase();
	if (normalized === exactName) return 'exact_name';
	if (BIOGRAPHY_QUERY_PATTERN.test(normalized)) return 'biography';
	if (PERSONALITY_QUERY_PATTERN.test(normalized)) return 'personality';
	return 'other';
}

const args = parseArgs(process.argv.slice(2));
const endDate = new Date();
endDate.setUTCDate(endDate.getUTCDate() - 2);
const startDate = new Date(endDate);
startDate.setUTCDate(startDate.getUTCDate() - (args.days - 1));

const auth = new google.auth.JWT({
	email: SERVICE_ACCOUNT_EMAIL,
	key: loadPrivateKey(),
	scopes: ['https://www.googleapis.com/auth/webmasters.readonly']
});
const searchConsole = google.searchconsole({ version: 'v1', auth });

async function resolveSite() {
	const { data } = await searchConsole.sites.list();
	const entries = data.siteEntry ?? [];
	const site = SITE_CANDIDATES.find((candidate) =>
		entries.some((entry) => entry.siteUrl === candidate)
	);
	if (site) return site;
	throw new Error(`Service account cannot access a 9takes Search Console property`);
}

async function query(site, dimensions) {
	const { data } = await searchConsole.searchanalytics.query({
		siteUrl: site,
		requestBody: {
			startDate: formatDate(startDate),
			endDate: formatDate(endDate),
			dimensions,
			rowLimit: 25_000,
			dataState: 'final'
		}
	});
	return data.rows ?? [];
}

const site = await resolveSite();
const [pageRows, pageQueryRows] = await Promise.all([
	query(site, ['page']),
	query(site, ['page', 'query'])
]);
const selectedSlugs = new Set(args.slugs);
const profiles = Object.fromEntries(
	args.slugs.map((slug) => [
		slug,
		{
			page: createMetric(),
			pageVariants: new Map(),
			families: {
				exact_name: createMetric(),
				biography: createMetric(),
				personality: createMetric(),
				other: createMetric()
			},
			queries: []
		}
	])
);

for (const row of pageRows) {
	const pageUrl = String(row.keys?.[0] ?? '');
	const slug = slugFromPage(pageUrl);
	if (!slug || !selectedSlugs.has(slug)) continue;
	const variantMetric = profiles[slug].pageVariants.get(pageUrl) ?? createMetric();
	addRow(variantMetric, row);
	profiles[slug].pageVariants.set(pageUrl, variantMetric);
	if (isDocumentUrl(pageUrl)) addRow(profiles[slug].page, row);
}

for (const row of pageQueryRows) {
	const slug = slugFromPage(row.keys?.[0]);
	if (!slug || !selectedSlugs.has(slug)) continue;
	if (!isDocumentUrl(String(row.keys?.[0] ?? ''))) continue;
	const queryText = String(row.keys?.[1] ?? '').trim();
	if (!queryText) continue;
	const exactName = EXACT_NAME_QUERY_OVERRIDES.get(slug) ?? slug.replaceAll('-', ' ');
	const family = queryFamily(queryText, exactName);
	addRow(profiles[slug].families[family], row);
	profiles[slug].queries.push({
		page: String(row.keys?.[0] ?? ''),
		query: queryText,
		family,
		clicks: Number(row.clicks ?? 0),
		impressions: Number(row.impressions ?? 0),
		ctr_pct: Number(row.ctr ?? 0) * 100,
		position: Number(row.position ?? 0)
	});
}

for (const profile of Object.values(profiles)) {
	profile.page = finalizeMetric(profile.page);
	profile.page_variants = [...profile.pageVariants.entries()]
		.map(([page, metric]) => ({ page, ...finalizeMetric(metric) }))
		.sort((a, b) => b.impressions - a.impressions);
	delete profile.pageVariants;
	profile.families = Object.fromEntries(
		Object.entries(profile.families).map(([family, metric]) => [family, finalizeMetric(metric)])
	);
	profile.queries.sort((a, b) => b.impressions - a.impressions || b.clicks - a.clicks);
	profile.queries = profile.queries.slice(0, 100);
}

const output = {
	label: args.label,
	captured_at: new Date().toISOString(),
	site,
	window: {
		start_date: formatDate(startDate),
		end_date: formatDate(endDate),
		days: args.days
	},
	notes: [
		'Case variants of the same document URL are consolidated by lowercase slug.',
		'Fragment URLs are listed under page_variants but excluded from page and query-family metrics.',
		'Query families are rule-based; inspect the retained query rows before drawing conclusions.',
		'Search Console metrics are observational and can move with demand, rank, snippet, or seasonality.'
	],
	profiles
};

mkdirSync(OUT_DIR, { recursive: true });
const outputPath = resolve(OUT_DIR, `${args.label}.json`);
writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(`wrote ${outputPath}`);
for (const [slug, profile] of Object.entries(profiles)) {
	console.log(
		`${slug}: ${profile.page.clicks} clicks / ${profile.page.impressions} impressions / ${profile.page.ctr_pct.toFixed(2)}% CTR / position ${profile.page.position?.toFixed(1) ?? '-'}`
	);
}
