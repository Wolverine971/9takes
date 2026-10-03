// docs/taskers/T-41-assets/visual-diff/strict-all.mjs
// Strict no-JS computed-style diff (all images loaded, port-normalized) for every published
// post at mobile and desktop widths: baseline SSR (4181) vs fixed SSR (4182).
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const urls = JSON.parse(fs.readFileSync(new URL('./all-posts.json', import.meta.url), 'utf8'));
let clean = 0;
const bad = [];
for (const u of urls) {
	for (const width of ['412', '1280']) {
		const out = execFileSync(
			'node',
			[
				new URL('./detail-diff.mjs', import.meta.url).pathname,
				`http://localhost:4181${u}`,
				`http://localhost:4182${u}`,
				width
			],
			{ encoding: 'utf8' }
		);
		const n = Number(out.match(/DIFF_PROPS (\d+)/)?.[1] ?? -1);
		const mismatch = /element (count|mismatch)/.test(out);
		if (n === 0 && !mismatch) clean++;
		else {
			bad.push({ u, width, n });
			console.log(`--- ${width} ${u}\n${out}`);
		}
	}
}
console.log(`STRICT: ${clean}/${urls.length * 2} page-viewports identical`);
fs.writeFileSync(new URL('./strict-all.json', import.meta.url), JSON.stringify(bad, null, 2));
