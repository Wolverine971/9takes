// scripts/capture-dossiers.mjs
//
// Capture each Enneagram type dossier as a static image for use as the
// blog `pic:` frontmatter image. Saves PNG to /tmp, then runs cwebp twice
// (full-quality + ~20KB small) into static/blogs/.
//
// Requires: dev server running on http://localhost:5173
// Usage: node scripts/capture-dossiers.mjs

import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { mkdirSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const TYPES = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const BASE_URL = process.env.BASE_URL ?? 'http://localhost:5173';
const TMP = path.join('/tmp', 'enneagram-dossiers');
const DEST = path.join(ROOT, 'static', 'blogs');

if (!existsSync(TMP)) mkdirSync(TMP, { recursive: true });
if (!existsSync(DEST)) mkdirSync(DEST, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
	viewport: { width: 1200, height: 900 },
	deviceScaleFactor: 2
});
const page = await context.newPage();

for (const n of TYPES) {
	const slug = `enneagram-type-${n}-dossier`;
	const url = `${BASE_URL}/enneagram-corner/enneagram-type-${n}`;
	console.log(`\n→ ${url}`);

	await page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 });

	const card = page.locator('.dossier-card').first();
	await card.waitFor({ state: 'visible', timeout: 10_000 });
	await card.scrollIntoViewIfNeeded();

	// Wait for the dossier image to fully load (it has loading="lazy")
	await page.evaluate(async () => {
		const imgs = Array.from(document.querySelectorAll('.dossier-image'));
		await Promise.all(
			imgs.map((img) =>
				img.complete && img.naturalWidth > 0
					? Promise.resolve()
					: new Promise((res) => {
							img.addEventListener('load', res, { once: true });
							img.addEventListener('error', res, { once: true });
						})
			)
		);
		await document.fonts.ready;
	});

	// Settle for any layout shift after fonts/images
	await page.waitForTimeout(400);

	const pngPath = path.join(TMP, `${slug}.png`);
	await card.screenshot({ path: pngPath });
	const pngSize = statSync(pngPath).size;
	console.log(`  png saved (${(pngSize / 1024).toFixed(0)}KB) → ${pngPath}`);

	const webpPath = path.join(DEST, `${slug}.webp`);
	const sWebpPath = path.join(DEST, `s-${slug}.webp`);

	execFileSync('cwebp', [pngPath, '-o', webpPath], { stdio: 'inherit' });
	execFileSync('cwebp', ['-sns', '70', '-f', '50', '-size', '20000', pngPath, '-o', sWebpPath], {
		stdio: 'inherit'
	});

	console.log(
		`  webp ${(statSync(webpPath).size / 1024).toFixed(0)}KB · s-webp ${(
			statSync(sWebpPath).size / 1024
		).toFixed(0)}KB`
	);
}

await browser.close();
console.log('\n✓ done. Update each enneagram-type-N.md frontmatter pic field.');
