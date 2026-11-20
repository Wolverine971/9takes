// docs/growth/audits/2026-11-16-gsc-pages.mjs
const { google } = await import(process.cwd() + '/node_modules/googleapis/build/src/index.js');
import { readFileSync } from 'node:fs';
function unwrapKey(raw) {
	let v = raw.trim();
	if (v.startsWith('"') && v.endsWith('"') && !v.startsWith('"{')) v = v.slice(1, -1);
	if (v.startsWith('"{') && v.endsWith('}"')) v = v.slice(1, -1);
	if (v.startsWith('{')) return JSON.parse(v).privateKey;
	return v.replace(/\\n/g, '\n');
}
let key;
for (const f of ['.env.local', '.env']) {
	try {
		const m = readFileSync(f, 'utf8').match(/^PRIVATE_gmail_private_key=(.*)$/m);
		if (m) {
			key = unwrapKey(m[1]);
			break;
		}
	} catch {}
}
const auth = new google.auth.JWT({
	email: 'id-takes-gmail-service-account@smart-mark-302504.iam.gserviceaccount.com',
	key,
	scopes: ['https://www.googleapis.com/auth/webmasters.readonly']
});
const sc = google.searchconsole({ version: 'v1', auth });
const q = async (s, e) =>
	(
		await sc.searchanalytics.query({
			siteUrl: 'sc-domain:9takes.com',
			requestBody: {
				startDate: s,
				endDate: e,
				dimensions: ['page'],
				dataState: 'all',
				rowLimit: 2000
			}
		})
	).data.rows ?? [];
const before = await q('2026-11-09', '2026-11-11');
const after = await q('2026-11-14', '2026-11-15');
const a = new Map(after.map((r) => [r.keys[0].split('#')[0], 0]));
for (const r of after) {
	const k = r.keys[0].split('#')[0];
	a.set(k, (a.get(k) || 0) + r.impressions);
}
const b = new Map();
for (const r of before) {
	const k = r.keys[0].split('#')[0];
	b.set(k, (b.get(k) || 0) + r.impressions);
}
const rows = [...b]
	.map(([k, v]) => [k, v / 3, (a.get(k) || 0) / 2])
	.sort((x, y) => y[1] - x[1])
	.slice(0, 12);
for (const r of rows)
	console.log(r[0].replace('https://9takes.com', ''), Math.round(r[1]), Math.round(r[2]));
let gone = 0,
	kept = 0;
for (const [k, v] of b) {
	if (v >= 30) {
		if ((a.get(k) || 0) < 1) gone++;
		else kept++;
	}
}
console.log('pages >=30 impr before: zero after', gone, 'nonzero', kept);
for (const u of rows.slice(0, 3).map((r) => r[0])) {
	const { data } = await sc.urlInspection.index.inspect({
		requestBody: { inspectionUrl: u, siteUrl: 'sc-domain:9takes.com' }
	});
	const i = data.inspectionResult.indexStatusResult;
	console.log(
		u,
		i.verdict,
		i.coverageState,
		i.lastCrawlTime,
		i.robotsTxtState,
		i.indexingState,
		i.pageFetchState
	);
}
