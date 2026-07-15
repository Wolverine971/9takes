// scripts/.tmp-gsc-tail.mjs
// Date-sliced, paginated GSC query extractor to defeat the 1000-row cap.
import { google } from 'googleapis';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const REPO_ROOT = '/Users/djwayne/9takes';
const SERVICE_ACCOUNT_EMAIL =
	'id-takes-gmail-service-account@smart-mark-302504.iam.gserviceaccount.com';

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
			const txt = readFileSync(resolve(REPO_ROOT, f), 'utf8');
			const m = txt.match(/^PRIVATE_gmail_private_key=(.*)$/m);
			if (m) return unwrapKey(m[1]);
		} catch {}
	}
	throw new Error('key not found');
}
const auth = new google.auth.JWT({
	email: SERVICE_ACCOUNT_EMAIL,
	key: loadPrivateKey(),
	scopes: ['https://www.googleapis.com/auth/webmasters.readonly']
});
const sc = google.searchconsole({ version: 'v1', auth });
const SITE = 'sc-domain:9takes.com';

async function pagedQuery(body) {
	const out = [];
	let startRow = 0;
	for (;;) {
		const { data } = await sc.searchanalytics.query({
			siteUrl: SITE,
			requestBody: { ...body, rowLimit: 25000, startRow, dataState: 'final' }
		});
		const rows = data.rows ?? [];
		out.push(...rows);
		if (rows.length < 25000) break;
		startRow += 25000;
		if (startRow > 100000) break;
	}
	return out;
}

// Week slices across the same 90d window as the 2026-07-06 run
const slices = [];
let s = new Date('2026-04-05');
const END = new Date('2026-07-04');
while (s < END) {
	const e = new Date(s);
	e.setDate(e.getDate() + 6);
	slices.push([s.toISOString().slice(0, 10), (e > END ? END : e).toISOString().slice(0, 10)]);
	s = new Date(e);
	s.setDate(s.getDate() + 1);
}

const agg = new Map();
for (const [startDate, endDate] of slices) {
	const rows = await pagedQuery({ startDate, endDate, dimensions: ['query'] });
	console.error(`${startDate}..${endDate}: ${rows.length} rows`);
	for (const r of rows) {
		const q = r.keys[0];
		const cur = agg.get(q) ?? { clicks: 0, impressions: 0, posSum: 0 };
		cur.clicks += r.clicks;
		cur.impressions += r.impressions;
		cur.posSum += r.position * r.impressions;
		agg.set(q, cur);
	}
}
const out = [...agg.entries()].map(([q, v]) => ({
	query: q,
	clicks: v.clicks,
	impressions: v.impressions,
	ctr: v.clicks / v.impressions,
	position: v.posSum / v.impressions
}));
out.sort((a, b) => b.impressions - a.impressions);
const esc = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
writeFileSync(
	'/private/tmp/claude-501/-Users-djwayne-9takes/b5841754-daed-4083-9873-93ed1aecb817/scratchpad/gsc-full-tail.csv',
	[
		'query,clicks,impressions,ctr_pct,position',
		...out.map((r) =>
			[esc(r.query), r.clicks, r.impressions, (r.ctr * 100).toFixed(2), r.position.toFixed(1)].join(
				','
			)
		)
	].join('\n') + '\n'
);
console.error(`TOTAL unique queries: ${out.length}`);
console.error(
	`TOTAL impressions: ${out.reduce((a, b) => a + b.impressions, 0)}  clicks: ${out.reduce((a, b) => a + b.clicks, 0)}`
);
