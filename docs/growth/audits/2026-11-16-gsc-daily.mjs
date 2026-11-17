// docs/growth/audits/2026-11-16-gsc-daily.mjs
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
for (const filt of [null, '/personality-analysis/', '/enneagram-corner/']) {
	const body = {
		startDate: '2026-11-01',
		endDate: '2026-11-16',
		dimensions: ['date'],
		dataState: 'all',
		rowLimit: 100
	};
	if (filt)
		body.dimensionFilterGroups = [
			{ filters: [{ dimension: 'page', operator: 'contains', expression: filt }] }
		];
	const { data } = await sc.searchanalytics.query({
		siteUrl: 'sc-domain:9takes.com',
		requestBody: body
	});
	console.log('== ' + (filt ?? 'site'));
	for (const r of data.rows ?? [])
		console.log(r.keys[0], r.clicks, Math.round(r.impressions), r.position.toFixed(1));
}
