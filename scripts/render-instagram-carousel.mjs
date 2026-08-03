// scripts/render-instagram-carousel.mjs
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';

const [, , sourceArgument, outputArgument] = process.argv;

if (!sourceArgument || !outputArgument) {
	console.error('Usage: node scripts/render-instagram-carousel.mjs <source.html> <output-dir>');
	process.exit(1);
}

const sourcePath = path.resolve(sourceArgument);
const outputDirectory = path.resolve(outputArgument);

if (!fs.existsSync(sourcePath)) {
	console.error(`Source HTML does not exist: ${sourcePath}`);
	process.exit(1);
}

fs.mkdirSync(outputDirectory, { recursive: true });

const browser = await chromium.launch({ headless: true });

try {
	const page = await browser.newPage({
		viewport: { width: 1160, height: 1430 },
		deviceScaleFactor: 1
	});
	await page.goto(pathToFileURL(sourcePath).href, { waitUntil: 'load' });
	await page.evaluate(() => document.fonts.ready);

	const slides = page.locator('.slide');
	const count = await slides.count();

	if (count === 0) throw new Error('No elements with class .slide were found.');

	for (let index = 0; index < count; index += 1) {
		const filename = `${String(index + 1).padStart(2, '0')}.png`;
		const outputPath = path.join(outputDirectory, filename);
		await slides.nth(index).screenshot({ path: outputPath, animations: 'disabled' });
		console.log(outputPath);
	}
} finally {
	await browser.close();
}
