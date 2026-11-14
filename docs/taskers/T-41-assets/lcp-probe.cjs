// docs/taskers/T-41-assets/lcp-probe.cjs
//
// Throttled mobile LCP probe used for the T-41 item M plan (2026-10-03, re-run 2026-11-14).
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
//   html-control         passes the document through r.fetch unchanged: the fair baseline for
//                        hero-small, because both skip the throttle for the HTML itself
//   hero-small           points the hero (or personality portrait) at its `s-` file only, as a
//                        file-weight stand-in for a right-sized variant (added 2026-11-14)
//   no-phone-source      strips the phone AVIF <source> and preload, i.e. the page before the
//                        phone image variants shipped; compare against html-control
//   preload-fonts        adds a font preload for every woff2 the page uses, ahead of the
//                        stylesheets; compare against html-control
// Variants combine with `+`, e.g. VARIANTS='hero-small+css-free'.
//
// The site's own /api/analytics, /api/track and /api/cta-event calls are blocked, so probe
// loads are not recorded as visits. Each line also reports the LCP element, the hero file
// size, and CSS/font counts and bytes (2026-11-14).
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
// preload-fonts: the woff2 files each path requests, in request order (filled by a quick
// unthrottled load before that path's runs)
const fontUrlsByPath = {};

async function collectFontUrls(browser, path) {
	const ctx = await browser.newContext({ viewport: { width: 412, height: 823 }, isMobile: true });
	const page = await ctx.newPage();
	const urls = [];
	page.on('request', (r) => {
		if (/\.woff2(\?|$)/.test(r.url()) && !urls.includes(r.url())) urls.push(r.url());
	});
	await page.route(/googletagmanager|posthog|google-analytics|vercel-insights|recaptcha/, (r) =>
		r.abort()
	);
	await page.route(/\/api\/(analytics|track|cta-event)\//, (r) => r.abort());
	await page.goto(BASE + path, { waitUntil: 'load', timeout: 120000 });
	await page.waitForTimeout(1500);
	await ctx.close();
	return urls;
}

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
	await page.route(/\/api\/(analytics|track|cta-event)\//, (r) => r.abort());
	const serveFromMemory = (re, type) =>
		page.route(re, async (r) =>
			r.fulfill({ status: 200, body: await fetchCached(r.request().url()), contentType: type })
		);
	if (variant.includes('css-free')) await serveFromMemory(/\.css(\?|$)/, 'text/css');
	if (variant.includes('fonts-free')) await serveFromMemory(/\.woff2?$/, 'font/woff2');
	// Controls for the what-if: both pass the document through r.fetch (so the HTML itself
	// skips the throttle in both), and differ only in which hero file the page asks for.
	if (
		variant.includes('html-control') ||
		variant.includes('preload-fonts') ||
		variant.includes('hero-small') ||
		variant.includes('no-phone-source')
	) {
		await page.route(
			(u) => u.pathname === path,
			async (r) => {
				const resp = await r.fetch();
				let html = await resp.text();
				if (variant.includes('preload-fonts')) {
					// what a <link rel=preload as=font> for each font the page uses would do
					const tags = (fontUrlsByPath[path] || [])
						.map(
							(u) =>
								`<link rel="preload" as="font" type="font/woff2" href="${u.replace(BASE, '')}" crossorigin>`
						)
						.join('');
					html = html.replace(/<link [^>]*rel="stylesheet"/, (m) => tags + m);
				}
				if (variant.includes('no-phone-source')) {
					// the page as it was before the phone AVIF variants (2026-11-14)
					html = html
						.replace(/<source[^>]*type="image\/avif"[^>]*>/g, '')
						.replace(/<link rel="preload"[^>]*type="image\/avif"[^>]*>/g, '')
						.replace(/(<link rel="preload"[^>]*type="image\/webp")\s+media="[^"]*"/g, '$1');
				}
				if (variant.includes('hero-small')) {
					// blog hero: use only the existing small file; portrait: swap to its s- file
					html = html.replace(
						/<img src="(\/blogs\/)([^"]+)" srcset="[^"]*"([^>]*class="image-card__img)/,
						(m, dir, file, rest) => `<img src="${dir}s-${file.replace(/^s-/, '')}"${rest}`
					);
					html = html.replace(/(\/types\/[^"\/]+\/)(?!s-)([^"\/]+\.webp)/g, (m, dir, file) =>
						/class="portrait-image|rel="preload"/.test(html) ? `${dir}s-${file}` : m
					);
				}
				r.fulfill({ response: resp, body: html });
			}
		);
	}
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
				window.__lcp.push({
					t: e.startTime,
					url: e.url,
					tag: e.element && e.element.tagName,
					cls: e.element && String(e.element.className).slice(0, 80),
					txt: e.element && (e.element.textContent || '').trim().slice(0, 60),
					size: e.size
				});
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
		const nav = performance.getEntriesByType('navigation')[0] || {};
		const css = rs.filter((r) => /\.css(\?|$)/.test(r.name));
		const fonts = rs.filter((r) => /\.woff2?$/.test(r.name));
		const sum = (a, k) => a.reduce((n, r) => n + (r[k] || 0), 0);
		return {
			ttfb: nav.responseStart,
			htmlKB: Math.round((nav.transferSize || 0) / 1024),
			htmlDone: nav.responseEnd,
			cssN: css.length,
			cssKB: Math.round(sum(css, 'transferSize') / 1024),
			cssRawKB: Math.round(sum(css, 'decodedBodySize') / 1024),
			fontN: fonts.length,
			fontKB: Math.round(sum(fonts, 'transferSize') / 1024),
			fontNames: fonts.map((r) => r.name.split('/').pop()),
			fontsDone: Math.max(0, ...fonts.map((r) => r.responseEnd)),
			lcpCls: last.cls,
			lcpTxt: last.txt,
			lcpUrl: last.url,
			imgDone: img ? img.responseEnd : null,
			imgKB: img ? Math.round((img.transferSize || 0) / 1024) : null,
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
		if (VARIANTS.some((v) => v.includes('preload-fonts')))
			fontUrlsByPath[path] = await collectFontUrls(browser, path);
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
					ttfb: med('ttfb'),
					htmlDone: med('htmlDone'),
					htmlKB: runs[0].htmlKB,
					cssN: runs[0].cssN,
					cssKB: runs[0].cssKB,
					cssRawKB: runs[0].cssRawKB,
					fontN: runs[0].fontN,
					fontKB: runs[0].fontKB,
					fontNames: runs[0].fontNames,
					fontsDone: med('fontsDone'),
					imgDone: med('imgDone'),
					imgKB: runs[0].imgKB,
					lcpCls: runs[0].lcpCls,
					lcpTxt: runs[0].lcpTxt,
					lcpUrl: runs[0].lcpUrl,
					lcpTags: runs.map((r) => r.lcpTag),
					fcpRuns: runs.map((r) => Math.round(r.fcp)),
					lcpRuns: runs.map((r) => Math.round(r.lcp))
				})
			);
		}
	}
	await browser.close();
})();
