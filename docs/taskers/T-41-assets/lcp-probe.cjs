// docs/taskers/T-41-assets/lcp-probe.cjs
//
// Throttled mobile LCP probe used for the T-41 item M plan (2026-10-03).
// Lighthouse-like conditions: 412px viewport, 150 ms RTT, 1.6 Mbps down, 4x CPU,
// third-party analytics blocked. Prints the median of RUNS loads per variant.
//
//   node docs/taskers/T-41-assets/lcp-probe.cjs [baseUrl] [path ...]
//   BASE defaults to https://9takes.com; RUNS=5 by default.
//
// Variants:
//   baseline             the page as served
//   css-free             every .css response is served from memory (zero network cost):
//                        the ceiling for any CSS work (critical CSS, fewer sheets)
//   fonts-free           same for .woff/.woff2
//   hero-eager           rewrites a lazy PopCard hero (`image-card__img`) to eager +
//                        fetchpriority=high and adds an image preload (MDsvex posts only)
//
// Do not add a cache-busting query string: personality pages are ISR, and a new query
// string misses the ISR cache and measures an origin render instead.
const { chromium } = require('@playwright/test');

const BASE =
	process.argv[2] && process.argv[2].startsWith('http') ? process.argv[2] : 'https://9takes.com';
const PATHS = process.argv.slice(2).filter((a) => a.startsWith('/'));
const RUNS = Number(process.env.RUNS || 5);
const VARIANTS = (process.env.VARIANTS || 'baseline,css-free,fonts-free,hero-eager').split(',');
const cache = {};

async function fetchCached(url) {
	if (!cache[url]) cache[url] = Buffer.from(await (await fetch(url)).arrayBuffer());
	return cache[url];
}

async function measure(browser, path, variant) {
	const ctx = await browser.newContext({
		viewport: { width: 412, height: 823 },
		deviceScaleFactor: 1.75,
		isMobile: true,
		hasTouch: true,
		userAgent:
			'Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36'
	});
	const page = await ctx.newPage();
	const cdp = await ctx.newCDPSession(page);
	await cdp.send('Network.enable');
	await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
	await cdp.send('Network.emulateNetworkConditions', {
		offline: false,
		latency: 150,
		downloadThroughput: (1638.4 * 1024) / 8,
		uploadThroughput: (675 * 1024) / 8
	});
	await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
	await page.route(/googletagmanager|posthog|google-analytics|vercel-insights|recaptcha/, (r) =>
		r.abort()
	);
	const serveFromMemory = (re, type) =>
		page.route(re, async (r) =>
			r.fulfill({ status: 200, body: await fetchCached(r.request().url()), contentType: type })
		);
	if (variant.includes('css-free')) await serveFromMemory(/\.css(\?|$)/, 'text/css');
	if (variant.includes('fonts-free')) await serveFromMemory(/\.woff2?$/, 'font/woff2');
	if (variant.includes('hero-eager')) {
		await page.route(
			(u) => u.pathname === path,
			async (r) => {
				const resp = await r.fetch();
				let html = await resp.text();
				html = html.replace(
					/(<img src="([^"]+)"[^>]*?)loading="lazy"([^>]*class="image-card__img)/,
					(m, a, src, b) => a + 'loading="eager" fetchpriority="high"' + b
				);
				const src = (html.match(/<img src="([^"]+)"[^>]*class="image-card__img/) || [])[1];
				if (src)
					html = html.replace(
						'</title>',
						`</title><link rel="preload" as="image" href="${src}" fetchpriority="high">`
					);
				r.fulfill({ response: resp, body: html });
			}
		);
	}
	await page.addInitScript(() => {
		window.__lcp = [];
		window.__fcp = null;
		new PerformanceObserver((l) => {
			for (const e of l.getEntries())
				window.__lcp.push({ t: e.startTime, url: e.url, tag: e.element && e.element.tagName });
		}).observe({ type: 'largest-contentful-paint', buffered: true });
		new PerformanceObserver((l) => {
			for (const e of l.getEntries())
				if (e.name === 'first-contentful-paint') window.__fcp = e.startTime;
		}).observe({ type: 'paint', buffered: true });
	});
	await page.goto(BASE + path, { waitUntil: 'load', timeout: 120000 });
	await page.waitForTimeout(2500);
	const res = await page.evaluate(() => {
		const rs = performance.getEntriesByType('resource');
		const last = window.__lcp[window.__lcp.length - 1] || {};
		const img = last.url ? rs.find((r) => r.name === last.url) : null;
		return {
			fcp: window.__fcp,
			lcp: last.t,
			lcpTag: last.tag,
			cssDone: Math.max(0, ...rs.filter((r) => r.name.endsWith('.css')).map((r) => r.responseEnd)),
			imgStart: img ? img.startTime : null
		};
	});
	await ctx.close();
	return res;
}

(async () => {
	const browser = await chromium.launch();
	for (const path of PATHS.length
		? PATHS
		: ['/enneagram-corner/enneagram-and-mental-illness', '/personality-analysis/zendaya']) {
		for (const variant of VARIANTS) {
			const runs = [];
			for (let i = 0; i < RUNS; i++) runs.push(await measure(browser, path, variant));
			const med = (k) => {
				const v = runs
					.map((r) => r[k])
					.filter((x) => x != null)
					.sort((a, b) => a - b);
				return v.length ? Math.round(v[Math.floor(v.length / 2)]) : null;
			};
			console.log(
				JSON.stringify({
					path,
					variant,
					fcp: med('fcp'),
					lcp: med('lcp'),
					lcpTag: runs[0].lcpTag,
					cssDone: med('cssDone'),
					imgStart: med('imgStart'),
					lcpRuns: runs.map((r) => Math.round(r.lcp))
				})
			);
		}
	}
	await browser.close();
})();
