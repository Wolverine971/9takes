// scripts/fetch-gsc-page-trends.mjs
//
// Month-by-month Search Console history per page, for decay analysis
// ("which posts used to get traffic and fell off"). fetch-gsc-data.mjs gives one
// 90-day window; this gives the shape over time.
//
// Usage:
//   node scripts/fetch-gsc-page-trends.mjs             # last 16 months (GSC max)
//   node scripts/fetch-gsc-page-trends.mjs --months 6
//
// Output:
//   docs/data/gsc/YYYY-MM-DD-page-trends.csv  page,month,clicks,impressions,ctr_pct,position
//   (#fragment variants are folded into their base URL, impression-weighted position)

import { google } from 'googleapis';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = resolve(REPO_ROOT, 'docs/data/gsc');
const SERVICE_ACCOUNT_EMAIL =
	'id-takes-gmail-service-account@smart-mark-302504.iam.gserviceaccount.com';
const SITE = 'sc-domain:9takes.com';

function unwrapKey(raw) {
	let v = raw.trim();
	if (v.startsWith('"') && v.endsWith('"') && !v.startsWith('"{')) v = v.slice(1, -1);
	if (v.startsWith('"{') && v.endsWith('}"')) v = v.slice(1, -1);
	if (v.startsWith('{')) return JSON.parse(v).privateKey;
	return v.replace(/\\n/g, '\n');
}

function loadPrivateKey() {
	if (process.env.PRIVATE_gmail_private_key)
		return unwrapKey(process.env.PRIVATE_gmail_private_key);
	for (const f of ['.env.local', '.env']) {
		try {
			const m = readFileSync(resolve(REPO_ROOT, f), 'utf8').match(
				/^PRIVATE_gmail_private_key=(.*)$/m
			);
			if (m) return unwrapKey(m[1]);
		} catch {
			/* file missing, try next */
		}
	}
	throw new Error('PRIVATE_gmail_private_key not found in env, .env.local, or .env');
}

const monthsArg = process.argv.indexOf('--months');
const months = monthsArg !== -1 ? Number(process.argv[monthsArg + 1]) : 16;
const fmt = (d) => d.toISOString().slice(0, 10);

const auth = new google.auth.JWT({
	email: SERVICE_ACCOUNT_EMAIL,
	key: loadPrivateKey(),
	scopes: ['https://www.googleapis.com/auth/webmasters.readonly']
});
const sc = google.searchconsole({ version: 'v1', auth });

async function pagesFor(startDate, endDate) {
	const rows = [];
	while (true) {
		const { data } = await sc.searchanalytics.query({
			siteUrl: SITE,
			requestBody: {
				startDate,
				endDate,
				dimensions: ['page'],
				rowLimit: 25000,
				startRow: rows.length
			}
		});
		const batch = data.rows ?? [];
		rows.push(...batch);
		if (batch.length < 25000) break;
	}
	return rows;
}

const lagEnd = new Date();
lagEnd.setDate(lagEnd.getDate() - 3);
const out = ['page,month,clicks,impressions,ctr_pct,position'];
for (let i = months - 1; i >= 0; i--) {
	const first = new Date(Date.UTC(lagEnd.getUTCFullYear(), lagEnd.getUTCMonth() - i, 1));
	const last = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0));
	const end = last > lagEnd ? lagEnd : last;
	const month = fmt(first).slice(0, 7);
	const rows = await pagesFor(fmt(first), fmt(end));
	const byPage = new Map();
	for (const r of rows) {
		const page = r.keys[0].split('#')[0];
		const acc = byPage.get(page) ?? { clicks: 0, impressions: 0, posW: 0 };
		acc.clicks += r.clicks;
		acc.impressions += r.impressions;
		acc.posW += r.position * r.impressions;
		byPage.set(page, acc);
	}
	for (const [page, a] of byPage) {
		const ctr = a.impressions ? (a.clicks / a.impressions) * 100 : 0;
		const pos = a.impressions ? a.posW / a.impressions : 0;
		out.push(
			[
				/[",\n]/.test(page) ? `"${page.replace(/"/g, '""')}"` : page,
				month,
				a.clicks,
				a.impressions,
				ctr.toFixed(2),
				pos.toFixed(1)
			].join(',')
		);
	}
	console.log(`${month}${end === lagEnd ? ' (partial)' : ''}: ${byPage.size} pages`);
}

const file = resolve(OUT_DIR, `${fmt(new Date())}-page-trends.csv`);
writeFileSync(file, out.join('\n') + '\n');
console.log(`wrote ${file} (${out.length - 1} rows)`);
