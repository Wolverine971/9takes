// e2e/personality-portrait-preflight.spec.ts
import { expect, test, type Page } from '@playwright/test';

const IGNORED_CONSOLE = [/\[vite\]/, /\[HMR\]/];

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

test('portrait publishing fixture renders the checked pair in dark and light mode', async ({
	page
}) => {
	const errors = collectErrors(page);
	await page.addInitScript(() => localStorage.setItem('9takes-theme', 'dark'));

	const response = await page.goto(
		'/styleguide?portraitType=2&portraitSlug=Benny-Blanco#portrait-preflight',
		{ waitUntil: 'load' }
	);
	expect(response?.status()).toBe(200);
	await page.waitForLoadState('networkidle');

	const fixture = page.locator('[data-portrait-preflight]');
	await expect(fixture).toBeVisible();
	await expect(fixture.getByRole('heading', { name: 'Benny Blanco' })).toBeVisible();

	const images = fixture.locator('img[data-preflight-asset]');
	await expect(images).toHaveCount(2);
	await expect
		.poll(() =>
			images.evaluateAll((nodes) =>
				nodes.every((node) => (node as HTMLImageElement).naturalWidth > 0)
			)
		)
		.toBe(true);
	const switchToLight = page.getByRole('button', { name: 'Switch to light mode' });
	if ((await switchToLight.count()) === 0) {
		await page.getByRole('button', { name: 'Switch to dark mode' }).click();
	}
	await expect(switchToLight).toBeVisible();

	const darkTreatment = await images.first().evaluate((node) => ({
		filter: getComputedStyle(node).filter,
		blend: getComputedStyle(node).mixBlendMode,
		well: getComputedStyle(node.parentElement!).backgroundColor
	}));
	expect(darkTreatment).toEqual({
		filter: 'contrast(1.08) brightness(0.92) saturate(0.68)',
		blend: 'normal',
		well: 'rgb(44, 31, 40)'
	});

	await switchToLight.click();
	await expect
		.poll(() => images.first().evaluate((node) => getComputedStyle(node).filter))
		.toBe('contrast(1.02) brightness(0.99) saturate(0.58)');
	await expect
		.poll(() =>
			images.first().evaluate((node) => getComputedStyle(node.parentElement!).backgroundColor)
		)
		.toBe('rgb(246, 243, 251)');

	const widths = await page.evaluate(() => ({
		client: document.documentElement.clientWidth,
		scroll: document.documentElement.scrollWidth
	}));
	expect(widths.scroll).toBeLessThanOrEqual(widths.client + 1);
	expect(errors).toEqual([]);
});
