// docs/taskers/T-41-assets/visual-diff/detail-diff.mjs
// Usage: node detail-diff.mjs <urlA> <urlB> <width>
// No-JS: loads the same page from two servers and prints the computed-style properties
// that differ, grouped by property, with example elements.
import { createRequire } from 'node:module';
const require = createRequire(
	'/Users/djwayne/9takes/.claude/worktrees/agent-abb1b63ce7d7b773a/package.json'
);
const { chromium } = require('@playwright/test');
const [ua, ub, width = '412'] = process.argv.slice(2);
const browser = await chromium.launch();
const grab = async (url) => {
	const ctx = await browser.newContext({
		viewport: { width: Number(width), height: 900 },
		javaScriptEnabled: false
	});
	const page = await ctx.newPage();
	await page.goto(url, { waitUntil: 'load' });
	await page.evaluate(() => {
		const s = document.createElement('style');
		s.textContent = '*,*::before,*::after{animation:none!important;transition:none!important}';
		document.head.appendChild(s);
		for (const img of document.images) img.loading = 'eager';
	});
	// Wait until every image settles so layout (and used width/height values) is stable.
	await page.waitForFunction(() => [...document.images].every((i) => i.complete), null, {
		timeout: 30000
	});
	await page.waitForTimeout(300);
	const r = await page.evaluate(() =>
		[...document.body.querySelectorAll('*')].map((el) => {
			const cs = getComputedStyle(el);
			const o = {};
			for (let i = 0; i < cs.length; i++) o[cs[i]] = cs.getPropertyValue(cs[i]);
			const cls = [...el.classList].filter((c) => !/^svelte-/.test(c)).join('.');
			return {
				id: el.tagName.toLowerCase() + (cls ? '.' + cls : ''),
				text: (el.textContent || '').trim().slice(0, 40),
				o
			};
		})
	);
	await ctx.close();
	return r;
};
const a = await grab(ua);
const b = await grab(ub);
if (a.length !== b.length) console.log(`element count ${a.length} vs ${b.length}`);
const byProp = {};
for (let i = 0; i < Math.min(a.length, b.length); i++) {
	if (a[i].id !== b[i].id) {
		console.log(`element mismatch at #${i}: ${a[i].id} vs ${b[i].id}`);
		break;
	}
	for (const k of Object.keys(a[i].o)) {
		const norm = (v) => (v ?? '').replace(/localhost:418\d/g, 'localhost');
		if (norm(a[i].o[k]) !== norm(b[i].o[k])) {
			byProp[k] ??= { n: 0, ex: [] };
			byProp[k].n++;
			if (byProp[k].ex.length < 3)
				byProp[k].ex.push(`${a[i].id} "${a[i].text}": ${a[i].o[k]} -> ${b[i].o[k]}`);
		}
	}
}
console.log(`DIFF_PROPS ${Object.keys(byProp).length}`);
for (const [k, v] of Object.entries(byProp)
	.sort((x, y) => y[1].n - x[1].n)
	.slice(0, 25)) {
	console.log(`${k} (${v.n})`);
	for (const e of v.ex) console.log('    ' + e.slice(0, 220));
}
await browser.close();
