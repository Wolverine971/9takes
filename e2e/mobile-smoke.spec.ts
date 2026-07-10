// e2e/mobile-smoke.spec.ts
// Mobile smoke test (2026-06-11 mobile audit follow-up). For each key route:
//   1. the server renders it with HTTP 200 (catches SSR crashes — a $derived
//      TDZ bug once 500'd every question detail page in production while
//      client-side navigation kept working, so nobody noticed),
//   2. nothing forces horizontal scroll at 390px,
//   3. no console errors / unhandled page errors.
// Run with `pnpm test:smoke` (starts an isolated dev server on :5199 by default).
import { test, expect, type Page } from '@playwright/test';

const STATIC_ROUTES = [
	'/',
	'/questions',
	'/community',
	'/enneagram-corner',
	'/pop-culture',
	'/how-to-guides',
	'/personality-analysis',
	'/book-session',
	'/login',
	'/register',
	'/about'
];

/** Console noise that isn't a product bug (dev tooling, third-party hiccups). */
const IGNORED_CONSOLE = [/\[vite\]/, /\[HMR\]/, /Download the React DevTools/];

function collectErrors(page: Page): string[] {
	const errors: string[] = [];
	page.on('console', (msg) => {
		if (msg.type() === 'error' && !IGNORED_CONSOLE.some((re) => re.test(msg.text()))) {
			errors.push(msg.text());
		}
	});
	page.on('pageerror', (err) => {
		errors.push(`pageerror: ${err.message}`);
	});
	return errors;
}

async function smokeCheck(page: Page, route: string) {
	const errors = collectErrors(page);

	const response = await page.goto(route, { waitUntil: 'load' });
	expect(response, `${route} should respond`).toBeTruthy();
	expect(response!.status(), `${route} should render server-side without errors`).toBe(200);

	// Let hydration and late layout settle before measuring
	await page.waitForLoadState('networkidle');

	const overflow = await page.evaluate(() => {
		const docWidth = document.documentElement.scrollWidth;
		const viewport = window.innerWidth;
		if (docWidth <= viewport + 1) return null;
		// Name the widest offender so the failure is actionable
		let worst: Element | null = null;
		let worstRight = viewport;
		for (const el of document.querySelectorAll('body *')) {
			const right = el.getBoundingClientRect().right;
			if (right > worstRight) {
				worstRight = right;
				worst = el;
			}
		}
		const tag = worst
			? `${worst.tagName.toLowerCase()}${worst.id ? '#' + worst.id : ''}.${[...worst.classList].join('.')}`
			: 'unknown';
		return { docWidth, viewport, offender: tag };
	});
	expect(overflow, `${route} should not scroll horizontally at 390px`).toBeNull();

	expect(errors, `${route} should log no console errors`).toEqual([]);
}

for (const route of STATIC_ROUTES) {
	test(`mobile smoke: ${route}`, async ({ page }) => {
		await smokeCheck(page, route);
	});
}

test('mobile smoke: question detail (SSR)', async ({ page }) => {
	// Resolve a real slug from the listing so the test tracks live content
	await page.goto('/questions', { waitUntil: 'load' });
	const href = await page
		.locator('a[href^="/questions/"]:not([href$="/categories"]):not([href$="/create"])')
		.first()
		.getAttribute('href');
	expect(href, 'questions listing should link to at least one question').toBeTruthy();

	await smokeCheck(page, href!);
});

test('mobile smoke: article detail (SSR)', async ({ page }) => {
	await page.goto('/enneagram-corner', { waitUntil: 'load' });
	const href = await page.locator('a[href^="/enneagram-corner/"]').first().getAttribute('href');
	expect(href, 'enneagram-corner should link to at least one article').toBeTruthy();

	await smokeCheck(page, href!);
});

test('mobile smoke: personality dossier (SSR)', async ({ page }) => {
	await page.goto('/personality-analysis', { waitUntil: 'load' });
	const href = await page.locator('a[href^="/personality-analysis/"]').first().getAttribute('href');
	expect(href, 'personality-analysis should link to at least one dossier').toBeTruthy();

	await smokeCheck(page, href!);
});
