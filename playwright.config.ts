// playwright.config.ts
// Mobile smoke suite only (e2e/). Unit tests stay on vitest (`pnpm test`).
import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: 'e2e',
	timeout: 60_000,
	fullyParallel: true,
	retries: process.env.CI ? 1 : 0,
	reporter: [['list']],
	use: {
		baseURL: process.env.SMOKE_BASE_URL ?? 'http://localhost:5173',
		// iPhone-class viewport — matches the 2026-06-11 mobile audit
		viewport: { width: 390, height: 844 },
		isMobile: true,
		hasTouch: true,
		deviceScaleFactor: 3,
		userAgent:
			'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
	},
	webServer: {
		command: 'pnpm dev',
		url: 'http://localhost:5173',
		reuseExistingServer: true,
		timeout: 120_000
	}
});
