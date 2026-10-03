// docs/taskers/T-41-assets/visual-diff/corpus.mjs
// Usage: node corpus.mjs <baseUrl> <outDir>
// For every published post: saves SSR HTML, then records a per-element computed-style hash
// (all properties) + layout rect for no-JS mobile, no-JS desktop, and hydrated mobile.
// Analytics/tracking requests are aborted so nothing is written to production.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(
	'/Users/djwayne/9takes/.claude/worktrees/agent-abb1b63ce7d7b773a/package.json'
);
const { chromium } = require('@playwright/test');

const base = process.argv[2];
const outDir = process.argv[3];
const urls = JSON.parse(fs.readFileSync(new URL('./all-posts.json', import.meta.url), 'utf8'));
fs.mkdirSync(path.join(outDir, 'html'), { recursive: true });
fs.mkdirSync(path.join(outDir, 'styles'), { recursive: true });
const fname = (u) => u.slice(1).replace(/\//g, '__');

// 1) SSR HTML, fixed order right after a fresh (seeded) server start.
const sheetCounts = {};
for (const u of urls) {
	const res = await fetch(base + u, { redirect: 'manual' });
	const html = await res.text();
	fs.writeFileSync(path.join(outDir, 'html', fname(u) + '.html'), html);
	sheetCounts[u] = {
		status: res.status,
		sheets: (html.match(/<link[^>]*rel="stylesheet"/g) ?? []).length,
		inline: (html.match(/<style[^>]*>/g) ?? []).length
	};
}
fs.writeFileSync(path.join(outDir, 'sheets.json'), JSON.stringify(sheetCounts, null, 2));

// 2) Computed-style hashes.
const BLOCK =
	/\/api\/analytics\/|\/api\/track|posthog|google-analytics|googletagmanager|recaptcha|vercel-insights|_vercel\/(insights|speed)/;
const browser = await chromium.launch();
const modes = [
	{ name: 'nojs-mobile', js: false, viewport: { width: 412, height: 915 } },
	{ name: 'nojs-desktop', js: false, viewport: { width: 1280, height: 900 } },
	{ name: 'js-mobile', js: true, viewport: { width: 412, height: 915 } }
];
for (const mode of modes) {
	const context = await browser.newContext({ viewport: mode.viewport, javaScriptEnabled: mode.js });
	await context.addInitScript(() => {
		let s = 7;
		Math.random = () => {
			s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
			return s / 4294967296;
		};
	});
	await context.route('**/*', (route) =>
		BLOCK.test(route.request().url()) ? route.abort() : route.continue()
	);
	const page = await context.newPage();
	for (const u of urls) {
		try {
			await page.goto(base + u, { waitUntil: mode.js ? 'networkidle' : 'load', timeout: 60000 });
		} catch (e) {
			console.log('goto failed', mode.name, u, e.message);
		}
		if (mode.js) await page.waitForTimeout(500);
		// Freeze time-dependent animation state identically for both builds.
		// (addStyleTag waits for a load event that never fires with JS disabled.)
		await page.evaluate(() => {
			const s = document.createElement('style');
			s.textContent =
				'*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}';
			document.head.appendChild(s);
		});
		const rows = await page.evaluate(() => {
			const fnv = (str) => {
				let h = 0x811c9dc5;
				for (let i = 0; i < str.length; i++) {
					h ^= str.charCodeAt(i);
					h = Math.imul(h, 0x01000193);
				}
				return (h >>> 0).toString(36);
			};
			const out = [];
			for (const el of document.body.querySelectorAll('*')) {
				if (el.closest('script,style,noscript,template')) continue;
				const serialize = (cs, prefix) =>
					Array.from({ length: cs.length }, (_, i) => cs[i])
						.sort()
						.map((k) => prefix + k + ':' + cs.getPropertyValue(k))
						.join(';');
				let s = serialize(getComputedStyle(el), '');
				for (const pseudo of ['::before', '::after']) {
					const ps = getComputedStyle(el, pseudo);
					if (ps.content && ps.content !== 'none' && ps.content !== 'normal') {
						s += ';' + serialize(ps, pseudo);
					}
				}
				const cls = [...el.classList].filter((c) => !/^svelte-/.test(c)).join('.');
				const r = el.getBoundingClientRect();
				out.push([
					`${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${cls ? '.' + cls : ''}`,
					[r.x, r.y, r.width, r.height].map(Math.round).join(','),
					fnv(s)
				]);
			}
			return out;
		});
		fs.writeFileSync(
			path.join(outDir, 'styles', `${mode.name}-${fname(u)}.json`),
			JSON.stringify(rows)
		);
	}
	await context.close();
}
await browser.close();
console.log('done', urls.length);
