// docs/taskers/T-41-assets/visual-diff/compare.mjs
// Usage: node compare.mjs <dirA> <dirB> [--show N]
// Compares two corpus captures: normalized SSR HTML (asset tags / build hashes stripped)
// and per-element computed-style hashes + layout rects.
import fs from 'node:fs';
import path from 'node:path';

const [a, b] = process.argv.slice(2, 4);
const show = Number(process.argv[process.argv.indexOf('--show') + 1] || 5);

export const normalizeHtml = (html) =>
	html
		.replace(/<link[^>]*_app\/immutable[^>]*>/g, '')
		.replace(/<style id="svelte-[^"]*">[\s\S]*?<\/style>/g, '')
		.replace(/_app\/immutable\/[^"' )\]]+/g, '_app/X')
		.replace(/__sveltekit_[a-z0-9]+/g, '__sveltekit_X')
		.replace(/version:\s*"[^"]*"/g, 'version:"X"')
		.replace(/\n\s*\n/g, '\n')
		.replace(/[ \t]+\n/g, '\n');

let htmlDiffs = 0;
const htmlFiles = fs.readdirSync(path.join(a, 'html'));
for (const f of htmlFiles) {
	const x = normalizeHtml(fs.readFileSync(path.join(a, 'html', f), 'utf8'));
	const y = normalizeHtml(fs.readFileSync(path.join(b, 'html', f), 'utf8'));
	if (x !== y) {
		htmlDiffs++;
		if (htmlDiffs <= show) {
			let i = 0;
			while (i < x.length && x[i] === y[i]) i++;
			console.log(
				`HTML DIFF ${f} @${i}\n  A: ${x.slice(i - 80, i + 160)}\n  B: ${y.slice(i - 80, i + 160)}`
			);
		}
	}
}
console.log(
	`HTML: ${htmlFiles.length - htmlDiffs}/${htmlFiles.length} identical after normalization`
);

const byMode = {};
const styleFiles = fs.readdirSync(path.join(a, 'styles'));
const diffPages = [];
for (const f of styleFiles) {
	const mode = f.split('-').slice(0, 2).join('-');
	byMode[mode] ??= { pages: 0, identical: 0, styleDiffEls: 0, rectDiffEls: 0 };
	byMode[mode].pages++;
	const x = JSON.parse(fs.readFileSync(path.join(a, 'styles', f), 'utf8'));
	const y = JSON.parse(fs.readFileSync(path.join(b, 'styles', f), 'utf8'));
	let styleDiff = 0;
	let rectDiff = 0;
	const examples = [];
	if (x.length !== y.length) {
		examples.push(`element count ${x.length} vs ${y.length}`);
	}
	const n = Math.min(x.length, y.length);
	for (let i = 0; i < n; i++) {
		if (x[i][0] !== y[i][0]) {
			examples.push(`#${i} id ${x[i][0]} vs ${y[i][0]}`);
			break;
		}
		if (x[i][2] !== y[i][2]) {
			styleDiff++;
			if (examples.length < 3) examples.push(`#${i} style ${x[i][0]}`);
		}
		if (x[i][1] !== y[i][1]) {
			rectDiff++;
			if (examples.length < 3) examples.push(`#${i} rect ${x[i][0]} ${x[i][1]} -> ${y[i][1]}`);
		}
	}
	byMode[mode].styleDiffEls += styleDiff;
	byMode[mode].rectDiffEls += rectDiff;
	if (!styleDiff && !rectDiff && x.length === y.length) byMode[mode].identical++;
	else diffPages.push({ f, styleDiff, rectDiff, examples });
}
console.table(byMode);
for (const d of diffPages.slice(0, show))
	console.log(d.f, d.styleDiff, d.rectDiff, d.examples.join(' | '));
if (diffPages.length > show) console.log(`... ${diffPages.length - show} more differing pages`);
fs.writeFileSync('compare-last.json', JSON.stringify(diffPages, null, 2));
