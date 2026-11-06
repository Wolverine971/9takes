#!/usr/bin/env node
// scripts/rebrand-shots.mjs
// Before/after screenshot harness for the Cold Light rollout.
//
// Capture a run (sequential, polite, read-only — never logs in, never submits forms):
//   node scripts/rebrand-shots.mjs capture --base https://9takes.com --out /path/to/before
//   node scripts/rebrand-shots.mjs capture --base http://127.0.0.1:5173 --out /path/to/after --only home,questions
//
// Compare two runs (writes a side-by-side contact sheet):
//   node scripts/rebrand-shots.mjs compare /path/to/before /path/to/after [--out /path/to/sheet-dir]
//
// Options (capture):
//   --base <url>          required. Site origin to visit.
//   --out <dir>           required. Output dir for PNGs + summary.json + index.html.
//   --only <a,b,c>        route names to include (see ROUTES below).
//   --viewports <list>    phone,desktop (default both).
//   --delay <ms>          pause between page visits (default 1500).
//   --allow-analytics     do NOT block analytics/tracking requests (blocked by default so
//                         harness runs never pollute 9takes analytics).
//
// Per route + viewport it records: HTTP status, full-page PNG (capped at 16,000 device px
// tall), and on phone: horizontal page scroll, elements whose right edge passes the
// viewport (clipped overflow that `.app-wrapper { overflow-x: hidden }` would hide), and
// tappable elements in the first screen smaller than 44×44 CSS px (inline text links exempt).
//
// Docs: docs/design/cold-light-rollout/README.md

import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const require = createRequire('/Users/djwayne/9takes/package.json');

export const ROUTES = [
	{ name: 'home', path: '/' },
	{ name: 'questions', path: '/questions' },
	{ name: 'question-detail', path: '/questions/what-were-you-like-as-a-kid-in-3-words' },
	{ name: 'personality-analysis', path: '/personality-analysis' },
	{ name: 'person-detail', path: '/personality-analysis/chris-pratt' },
	{ name: 'community', path: '/community' },
	{ name: 'community-post', path: '/community/be-gentle-when-youre-right' },
	{ name: 'enneagram-corner', path: '/enneagram-corner' },
	{
		name: 'enneagram-corner-post',
		path: '/enneagram-corner/attachment-styles-and-enneagram-types'
	},
	{ name: 'how-to-guides', path: '/how-to-guides' },
	{ name: 'how-to-guide-post', path: '/how-to-guides/dating-dynamics-by-enneagram-type' },
	{ name: 'pop-culture', path: '/pop-culture' },
	{ name: 'pop-culture-post', path: '/pop-culture/breaking-points-enneagram-analysis' },
	{ name: 'enneagram-test', path: '/enneagram-test' },
	{ name: 'book-session', path: '/book-session' },
	{ name: 'about', path: '/about' },
	{ name: 'login', path: '/login' },
	{ name: 'register', path: '/register' },
	{ name: 'not-found', path: '/rebrand-shots-404-check' }
];

const VIEWPORTS = {
	phone: {
		viewport: { width: 390, height: 844 },
		deviceScaleFactor: 2,
		isMobile: true,
		hasTouch: true,
		userAgent:
			'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1 9takes-rebrand-shots'
	},
	desktop: {
		viewport: { width: 1440, height: 900 },
		deviceScaleFactor: 1,
		isMobile: false,
		hasTouch: false,
		userAgent:
			'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36 9takes-rebrand-shots'
	}
};

const MAX_DEVICE_PX = 16000;
const BLOCKED_HOSTS = [
	'posthog.com',
	'google-analytics.com',
	'googletagmanager.com',
	'doubleclick.net',
	'vercel-insights.com',
	'vitals.vercel-insights.com'
];
const BLOCKED_PATHS = [
	'/api/analytics',
	'/api/track',
	'/_vercel/insights',
	'/_vercel/speed-insights'
];

function parseArgs(argv) {
	const out = { _: [] };
	for (let i = 0; i < argv.length; i++) {
		const a = argv[i];
		if (a.startsWith('--')) {
			const key = a.slice(2);
			const next = argv[i + 1];
			if (next == null || next.startsWith('--')) out[key] = true;
			else {
				out[key] = next;
				i++;
			}
		} else out._.push(a);
	}
	return out;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function settle(page) {
	await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
	await page.evaluate(() => document.fonts?.ready).catch(() => {});
	// Trigger lazy images / intersection observers, then return to top.
	await page
		.evaluate(async () => {
			const step = window.innerHeight * 0.8;
			const max = Math.min(document.documentElement.scrollHeight, 30000);
			for (let y = 0; y < max; y += step) {
				window.scrollTo(0, y);
				await new Promise((r) => setTimeout(r, 60));
			}
			window.scrollTo(0, 0);
		})
		.catch(() => {});
	await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
	await sleep(400);
}

async function declineCookieBanner(page) {
	// Only ever clicks an explicit decline/essential-only control inside a cookie/consent container.
	const clicked = await page
		.evaluate(() => {
			const containers = [
				...document.querySelectorAll(
					'[id*="cookie" i],[class*="cookie" i],[id*="consent" i],[class*="consent" i]'
				)
			];
			for (const c of containers) {
				const btn = [...c.querySelectorAll('button,a,[role="button"]')].find((b) =>
					/\b(decline|reject|deny|essential only|necessary only|only necessary)\b/i.test(
						b.textContent || ''
					)
				);
				if (btn) {
					btn.click();
					return true;
				}
			}
			return false;
		})
		.catch(() => false);
	if (clicked) await sleep(300);
	return clicked;
}

async function phoneChecks(page) {
	return page.evaluate(() => {
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		const doc = document.documentElement;
		const describe = (el) => {
			const r = el.getBoundingClientRect();
			let label = el.tagName.toLowerCase();
			if (el.id) label += `#${el.id}`;
			const cls = (typeof el.className === 'string' ? el.className : '')
				.split(/\s+/)
				.filter((c) => c && !c.startsWith('svelte-'))
				.slice(0, 2);
			if (cls.length) label += '.' + cls.join('.');
			const text = (
				el.getAttribute('aria-label') ||
				el.textContent ||
				el.getAttribute('title') ||
				''
			)
				.replace(/\s+/g, ' ')
				.trim()
				.slice(0, 40);
			return {
				el: label,
				text,
				w: Math.round(r.width),
				h: Math.round(r.height),
				x: Math.round(r.left),
				y: Math.round(r.top)
			};
		};
		const isVisible = (el) => {
			const s = getComputedStyle(el);
			if (s.visibility === 'hidden' || s.display === 'none' || Number(s.opacity) === 0)
				return false;
			const r = el.getBoundingClientRect();
			return r.width > 0 && r.height > 0;
		};
		const inScrollableX = (el) => {
			for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
				const ox = getComputedStyle(p).overflowX;
				if (ox === 'auto' || ox === 'scroll') return true;
			}
			return false;
		};

		// Horizontal overflow
		const horizontalScroll = doc.scrollWidth > vw + 1;
		const overflowing = [];
		for (const el of document.body.querySelectorAll('*')) {
			if (!isVisible(el)) continue;
			const r = el.getBoundingClientRect();
			if (r.right > vw + 1 && r.width > 0 && !inScrollableX(el)) {
				// keep only the outermost offenders
				if (!overflowing.some((o) => o.node.contains(el))) overflowing.push({ node: el });
			}
		}

		// Tap targets in the first screen
		const selector =
			'a[href],button,input:not([type="hidden"]),select,textarea,summary,[role="button"],[role="link"],[role="tab"],[role="checkbox"],[role="switch"],[tabindex]:not([tabindex="-1"])';
		const small = [];
		let tappable = 0;
		for (const el of document.querySelectorAll(selector)) {
			if (!isVisible(el)) continue;
			const r = el.getBoundingClientRect();
			if (r.bottom <= 0 || r.top >= vh || r.right <= 0 || r.left >= vw) continue;
			// Inline links inside running text are exempt (WCAG 2.5.8 inline exception).
			if (el.tagName === 'A' && getComputedStyle(el).display === 'inline') {
				const parentText = (el.parentElement?.textContent || '').trim().length;
				const ownText = (el.textContent || '').trim().length;
				if (parentText > ownText + 20) continue;
			}
			tappable++;
			if (r.width < 44 || r.height < 44) small.push(describe(el));
		}

		return {
			scrollWidth: doc.scrollWidth,
			innerWidth: vw,
			horizontalScroll,
			overflowingCount: overflowing.length,
			overflowing: overflowing.slice(0, 8).map((o) => describe(o.node)),
			tappableFirstScreen: tappable,
			smallTapTargetCount: small.length,
			smallTapTargets: small.slice(0, 25)
		};
	});
}

async function capture(opts) {
	const base = String(opts.base || '').replace(/\/$/, '');
	const outDir = opts.out && resolve(String(opts.out));
	if (!base || !outDir) {
		console.error(
			'usage: rebrand-shots.mjs capture --base <url> --out <dir> [--only a,b] [--viewports phone,desktop]'
		);
		process.exit(2);
	}
	const only = opts.only ? String(opts.only).split(',') : null;
	const routes = ROUTES.filter((r) => !only || only.includes(r.name));
	const viewportNames = opts.viewports ? String(opts.viewports).split(',') : Object.keys(VIEWPORTS);
	const delay = Number(opts.delay ?? 1500);
	mkdirSync(outDir, { recursive: true });

	const { chromium } = require('@playwright/test');
	const browser = await chromium.launch();
	const summary = {
		base,
		capturedAt: new Date().toISOString(),
		viewports: Object.fromEntries(viewportNames.map((v) => [v, VIEWPORTS[v].viewport])),
		routes: []
	};

	for (const route of routes) {
		const entry = { name: route.name, path: route.path, shots: {} };
		for (const vpName of viewportNames) {
			const vp = VIEWPORTS[vpName];
			const context = await browser.newContext({
				...vp,
				reducedMotion: 'reduce',
				colorScheme: 'dark'
			});
			if (!opts['allow-analytics']) {
				await context.route('**/*', (req) => {
					const url = new URL(req.request().url());
					if (
						BLOCKED_HOSTS.some((h) => url.hostname.endsWith(h)) ||
						BLOCKED_PATHS.some((p) => url.pathname.startsWith(p))
					)
						return req.abort();
					return req.continue();
				});
			}
			const page = await context.newPage();
			const shot = { file: `${route.name}--${vpName}.png` };
			const t0 = Date.now();
			try {
				const res = await page.goto(base + route.path, { waitUntil: 'load', timeout: 45000 });
				shot.status = res?.status() ?? null;
				shot.finalUrl = page.url();
				await settle(page);
				shot.cookieBannerDeclined = await declineCookieBanner(page);
				const height = await page.evaluate(() => document.documentElement.scrollHeight);
				const maxCss = Math.floor(MAX_DEVICE_PX / vp.deviceScaleFactor);
				shot.pageHeight = height;
				shot.truncated = height > maxCss;
				if (vpName === 'phone') shot.checks = await phoneChecks(page);
				await page.screenshot({
					path: join(outDir, shot.file),
					// fullPage stays on so a clip taller than the viewport isn't cut to one screen.
					fullPage: true,
					clip: shot.truncated
						? { x: 0, y: 0, width: vp.viewport.width, height: maxCss }
						: undefined,
					animations: 'disabled'
				});
			} catch (err) {
				shot.error = String(err?.message || err).split('\n')[0];
			}
			shot.ms = Date.now() - t0;
			entry.shots[vpName] = shot;
			await context.close();
			const c = shot.checks;
			console.log(
				`  ${route.name.padEnd(24)} ${vpName.padEnd(8)} ${String(shot.status ?? 'ERR').padEnd(4)}` +
					(c
						? ` hscroll=${c.horizontalScroll ? 'YES' : 'no'} overflowEls=${c.overflowingCount} smallTaps=${c.smallTapTargetCount}/${c.tappableFirstScreen}`
						: '') +
					(shot.truncated ? ' (truncated)' : '') +
					(shot.error ? ` ERROR ${shot.error}` : '')
			);
			await sleep(delay);
		}
		summary.routes.push(entry);
	}
	await browser.close();

	const phone = summary.routes.map((r) => r.shots.phone?.checks).filter(Boolean);
	summary.totals = {
		routes: summary.routes.length,
		horizontalScroll: phone.filter((c) => c.horizontalScroll).length,
		routesWithClippedOverflow: phone.filter((c) => c.overflowingCount > 0).length,
		smallTapTargets: phone.reduce((s, c) => s + c.smallTapTargetCount, 0),
		errors: summary.routes.flatMap((r) => Object.values(r.shots)).filter((s) => s.error).length
	};
	writeFileSync(join(outDir, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');
	writeFileSync(
		join(outDir, 'index.html'),
		renderSheet([{ label: base, dir: outDir, summary }], outDir)
	);
	console.log(`\n✓ ${summary.routes.length} routes → ${outDir}`);
	console.log(`  ${JSON.stringify(summary.totals)}`);
}

function esc(s) {
	return String(s ?? '').replace(
		/[&<>"]/g,
		(c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]
	);
}

function checkBadge(c) {
	if (!c) return '';
	const bad = (b) => (b ? ' bad' : '');
	return `<div class="checks"><span class="chip${bad(c.horizontalScroll)}">h-scroll: ${c.horizontalScroll ? 'YES' : 'no'}</span><span class="chip${bad(c.overflowingCount)}">clipped overflow: ${c.overflowingCount}</span><span class="chip${bad(c.smallTapTargetCount)}">taps &lt;44: ${c.smallTapTargetCount}/${c.tappableFirstScreen}</span></div>${
		c.smallTapTargets?.length
			? `<details><summary>small tap targets</summary><ul>${c.smallTapTargets.map((t) => `<li><code>${esc(t.el)}</code> ${t.w}×${t.h} — ${esc(t.text)}</li>`).join('')}</ul></details>`
			: ''
	}${
		c.overflowing?.length
			? `<details><summary>overflowing elements</summary><ul>${c.overflowing.map((t) => `<li><code>${esc(t.el)}</code> x=${t.x} w=${t.w} — ${esc(t.text)}</li>`).join('')}</ul></details>`
			: ''
	}`;
}

function renderSheet(runs, sheetDir) {
	const names = [...new Set(runs.flatMap((r) => r.summary.routes.map((x) => x.name)))];
	const vps = [...new Set(runs.flatMap((r) => Object.keys(r.summary.viewports)))];
	const rows = names
		.map((name) => {
			const path = runs
				.map((r) => r.summary.routes.find((x) => x.name === name)?.path)
				.find(Boolean);
			const sections = vps
				.map((vp) => {
					const cells = runs
						.map((run) => {
							const shot = run.summary.routes.find((x) => x.name === name)?.shots?.[vp];
							if (!shot) return `<div class="cell empty">not captured</div>`;
							const src = relative(sheetDir, join(run.dir, shot.file));
							return `<div class="cell"><div class="meta">${esc(run.label)} · ${shot.status ?? 'ERR'}${shot.truncated ? ' · truncated' : ''}${shot.error ? ` · ${esc(shot.error)}` : ''}</div>${
								shot.error
									? ''
									: `<a href="${esc(src)}" target="_blank"><img loading="lazy" src="${esc(src)}" alt="${esc(name)} ${vp}"></a>`
							}${checkBadge(shot.checks)}</div>`;
						})
						.join('');
					return `<div class="vp vp-${vp}"><h3>${vp}</h3><div class="pair">${cells}</div></div>`;
				})
				.join('');
			return `<section id="${esc(name)}"><h2>${esc(name)} <code>${esc(path)}</code></h2>${sections}</section>`;
		})
		.join('\n');
	const toc = names.map((n) => `<a href="#${esc(n)}">${esc(n)}</a>`).join(' ');
	return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Rebrand shots</title>
<style>
:root{--bg:#01010d;--surface:#0c0b22;--text:#f4f2ff;--muted:#bdb8da;--rule:rgba(207,194,255,.14);--bad:#ff8a8a;--ok:#88f9c0}
*{box-sizing:border-box}body{margin:0;padding:16px;background:var(--bg);color:var(--text);font:14px/1.45 system-ui,sans-serif}
h1{font-size:20px;margin:0 0 4px}h2{font-size:16px;margin:32px 0 8px;border-top:1px solid var(--rule);padding-top:16px}h3{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin:12px 0 6px}
code{color:var(--muted)}nav{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0 0}nav a{color:var(--muted)}
.pair{display:grid;grid-template-columns:repeat(${runs.length},minmax(0,1fr));gap:12px;align-items:start}
.vp-phone .cell img{max-width:390px}.cell{background:var(--surface);border:1px solid var(--rule);border-radius:10px;padding:8px;min-width:0}
.cell img{display:block;width:100%;height:auto;max-height:2400px;object-fit:cover;object-position:top;border-radius:4px}
.meta{color:var(--muted);font-size:12px;margin-bottom:6px}.checks{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.chip{font-size:12px;padding:2px 8px;border-radius:999px;border:1px solid var(--rule);color:var(--ok)}.chip.bad{color:var(--bad)}
details{margin-top:6px;font-size:12px;color:var(--muted)}ul{margin:4px 0;padding-left:18px}.empty{color:var(--muted)}
@media (max-width:700px){.pair{grid-template-columns:1fr}}
</style></head><body>
<h1>Rebrand shots</h1><div class="meta">${runs.map((r) => `${esc(r.label)} — ${esc(r.summary.capturedAt)} — ${esc(JSON.stringify(r.summary.totals ?? {}))}`).join('<br>')}</div>
<nav>${toc}</nav>
${rows}
</body></html>
`;
}

function compare(opts) {
	const [beforeDir, afterDir] = opts._.slice(1).map((d) => resolve(d));
	if (!beforeDir || !afterDir) {
		console.error('usage: rebrand-shots.mjs compare <beforeDir> <afterDir> [--out <dir>]');
		process.exit(2);
	}
	const load = (dir) => {
		const p = join(dir, 'summary.json');
		if (!existsSync(p)) throw new Error(`missing ${p}`);
		return JSON.parse(readFileSync(p, 'utf8'));
	};
	const before = load(beforeDir);
	const after = load(afterDir);
	const sheetDir = resolve(String(opts.out || join(afterDir, '..', 'compare')));
	mkdirSync(sheetDir, { recursive: true });
	const html = renderSheet(
		[
			{ label: `before (${before.base})`, dir: beforeDir, summary: before },
			{ label: `after (${after.base})`, dir: afterDir, summary: after }
		],
		sheetDir
	);
	writeFileSync(join(sheetDir, 'index.html'), html);

	console.log(
		'route                    h-scroll   clipped-overflow   small-taps (phone, before → after)'
	);
	let regressions = 0;
	for (const r of after.routes) {
		const a = r.shots.phone?.checks;
		const b = before.routes.find((x) => x.name === r.name)?.shots.phone?.checks;
		if (!a) continue;
		const fmt = (x, y) => `${x ?? '–'} → ${y}`;
		if (
			a.horizontalScroll ||
			(b && a.smallTapTargetCount > b.smallTapTargetCount) ||
			(b && a.overflowingCount > b.overflowingCount)
		)
			regressions++;
		console.log(
			`  ${r.name.padEnd(22)} ${fmt(b ? (b.horizontalScroll ? 'YES' : 'no') : null, a.horizontalScroll ? 'YES' : 'no').padEnd(10)} ${fmt(b?.overflowingCount, a.overflowingCount).padEnd(18)} ${fmt(b?.smallTapTargetCount, a.smallTapTargetCount)}`
		);
	}
	console.log(`\n✓ contact sheet → ${join(sheetDir, 'index.html')}`);
	if (regressions)
		console.log(
			`  ${regressions} route(s) have h-scroll or more overflow/small taps than before — review.`
		);
}

const opts = parseArgs(process.argv.slice(2));
const cmd = opts._[0];
if (cmd === 'capture') await capture(opts);
else if (cmd === 'compare') compare(opts);
else {
	console.error(
		'usage:\n  rebrand-shots.mjs capture --base <url> --out <dir> [--only a,b] [--viewports phone,desktop] [--delay ms]\n  rebrand-shots.mjs compare <beforeDir> <afterDir> [--out <dir>]'
	);
	process.exit(2);
}
