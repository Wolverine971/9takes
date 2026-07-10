// playwright.config.ts
// Mobile smoke suite only (e2e/). Unit tests stay on vitest (`pnpm test`).
import { defineConfig } from '@playwright/test';

const smokeBaseUrl = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:5199';
const smokeUrl = new URL(smokeBaseUrl);
const smokePort = smokeUrl.port;

if (smokeUrl.protocol !== 'http:' || !smokePort) {
	throw new Error('SMOKE_BASE_URL must be an explicit local HTTP URL with a port');
}

export default defineConfig({
	testDir: 'e2e',
	timeout: 60_000,
	fullyParallel: true,
	retries: process.env.CI ? 1 : 0,
	reporter: [['list']],
	use: {
		baseURL: smokeBaseUrl,
		// iPhone-class viewport — matches the 2026-06-11 mobile audit
		viewport: { width: 390, height: 844 },
		isMobile: true,
		hasTouch: true,
		deviceScaleFactor: 3,
		userAgent:
			'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
	},
	webServer: {
		command: `pnpm exec vite dev --host ${smokeUrl.hostname} --port ${smokePort} --strictPort`,
		url: smokeBaseUrl,
		// Never attach the suite to an unrelated Vite app that happens to own a common dev port.
		reuseExistingServer: false,
		timeout: 120_000
	}
});
