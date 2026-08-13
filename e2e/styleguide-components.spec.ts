import { expect, test, type Locator, type Page } from '@playwright/test';

const IGNORED_CONSOLE = [/\[vite\]/, /\[HMR\]/];
const themes = ['dark', 'light'] as const;

function collectErrors(page: Page): string[] {
	const errors: string[] = [];
	page.on('console', (message) => {
		if (
			message.type() === 'error' &&
			!IGNORED_CONSOLE.some((pattern) => pattern.test(message.text()))
		) {
			errors.push(message.text());
		}
	});
	page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
	return errors;
}

async function expectFamilyScreenshot(locator: Locator, family: string, theme: string) {
	await locator.scrollIntoViewIfNeeded();
	await expect(locator).toHaveScreenshot(`styleguide-${family}-${theme}.png`, {
		animations: 'disabled',
		caret: 'hide',
		maxDiffPixelRatio: 0.01
	});
}

async function verifyProductionComponents(page: Page, theme: (typeof themes)[number], view = '') {
	const errors = collectErrors(page);
	await page.addInitScript((preference) => {
		localStorage.setItem('9takes-theme', preference);
	}, theme);

	const response = await page.goto('/styleguide#s11', { waitUntil: 'load' });
	expect(response?.status()).toBe(200);
	await page.waitForLoadState('networkidle');

	const section = page.locator('#s11');
	await expect(section.locator('.sg-btn-grid .btn')).toHaveCount(16);
	await expect(section.locator('.sg-form-grid .field')).toHaveCount(3);
	await expect(section.locator('.sg-form-grid .control')).toHaveCount(3);
	await expect(section.locator('.spinner-container')).toHaveCount(3);
	await expect(section.locator('.skeleton')).toHaveCount(4);
	await expect(section.locator('.status-state')).toHaveCount(2);
	await expect(section.locator('.sg-btn, .sg-input, .sg-spinner, .sg-state')).toHaveCount(0);

	const semantics = await page.evaluate(() => ({
		mainCount: document.querySelectorAll('main').length,
		h1Count: document.querySelectorAll('h1').length,
		overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
	}));
	expect(semantics).toEqual({ mainCount: 1, h1Count: 1, overflow: 0 });

	const controlFontSizes = await section
		.locator('.control')
		.evaluateAll((controls) => [
			...new Set(controls.map((control) => getComputedStyle(control).fontSize))
		]);
	expect(controlFontSizes).toEqual(['16px']);

	const snapshotTheme = view ? `${view}-${theme}` : theme;
	await expectFamilyScreenshot(section.locator('.sg-btn-grid'), 'buttons', snapshotTheme);
	await expectFamilyScreenshot(section.locator('.sg-form-grid'), 'forms', snapshotTheme);
	await expectFamilyScreenshot(section.locator('.sg-spinner-row'), 'spinners', snapshotTheme);
	await expectFamilyScreenshot(section.locator('.sg-skeleton-demo'), 'skeletons', snapshotTheme);
	await expectFamilyScreenshot(
		section.locator('.sg-state-live').nth(0),
		'empty-state',
		snapshotTheme
	);
	await expectFamilyScreenshot(
		section.locator('.sg-state-live').nth(1),
		'error-state',
		snapshotTheme
	);

	expect(errors).toEqual([]);
}

for (const theme of themes) {
	test(`styleguide production components stay aligned on mobile in ${theme} mode`, async ({
		page
	}) => {
		await verifyProductionComponents(page, theme);
	});

	test(`styleguide production components stay aligned on desktop in ${theme} mode`, async ({
		page
	}) => {
		await page.setViewportSize({ width: 1440, height: 1000 });
		await verifyProductionComponents(page, theme, 'desktop');
	});
}
