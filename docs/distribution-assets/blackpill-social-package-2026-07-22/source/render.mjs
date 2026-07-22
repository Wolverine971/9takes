import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';
import sharp from 'sharp';

const sourceDir = path.dirname(fileURLToPath(import.meta.url));
const packageDir = path.dirname(sourceDir);
const assetsDir = path.join(packageDir, 'assets');
const carouselDir = path.join(assetsDir, 'carousel');
const shareDir = path.join(assetsDir, 'share');

await fs.mkdir(carouselDir, { recursive: true });
await fs.mkdir(shareDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
	viewport: { width: 1300, height: 1450 },
	deviceScaleFactor: 1
});

await page.goto(pathToFileURL(path.join(sourceDir, 'carousel.html')).href, {
	waitUntil: 'networkidle'
});
await page.evaluate(() => document.fonts.ready);

const manifest = [];
const carouselFiles = [];
const slides = page.locator('.slide');

for (let index = 0; index < (await slides.count()); index += 1) {
	const slide = slides.nth(index);
	const name = await slide.getAttribute('data-name');
	const overflow = await slide.evaluate((root) =>
		Array.from(root.querySelectorAll('h1, h2, h3, p, strong, small, .footer, .landscape-return'))
			.filter((element) => element.scrollWidth > element.clientWidth + 4)
			.map((element) => ({
				tag: element.tagName,
				className: element.className,
				client: [element.clientWidth, element.clientHeight],
				scroll: [element.scrollWidth, element.scrollHeight],
				text: element.textContent?.trim().slice(0, 80)
			}))
	);
	if (overflow.length > 0) {
		throw new Error(`${name}: text overflow detected: ${JSON.stringify(overflow)}`);
	}
	const outputPath = path.join(carouselDir, `${name}.png`);
	await slide.screenshot({ path: outputPath, animations: 'disabled' });
	const metadata = await sharp(outputPath).metadata();
	if (metadata.width !== 1080 || metadata.height !== 1350) {
		throw new Error(`${name}: expected 1080x1350, got ${metadata.width}x${metadata.height}`);
	}
	const stat = await fs.stat(outputPath);
	manifest.push({
		file: path.relative(packageDir, outputPath),
		width: metadata.width,
		height: metadata.height,
		bytes: stat.size
	});
	carouselFiles.push(outputPath);
}

const landscapes = page.locator('.landscape');
for (let index = 0; index < (await landscapes.count()); index += 1) {
	const card = landscapes.nth(index);
	const name = await card.getAttribute('data-name');
	const overflow = await card.evaluate((root) =>
		Array.from(root.querySelectorAll('h1, h2, h3, p, strong, small, .footer, .landscape-return'))
			.filter((element) => element.scrollWidth > element.clientWidth + 4)
			.map((element) => ({
				tag: element.tagName,
				className: element.className,
				client: [element.clientWidth, element.clientHeight],
				scroll: [element.scrollWidth, element.scrollHeight],
				text: element.textContent?.trim().slice(0, 80)
			}))
	);
	if (overflow.length > 0) {
		throw new Error(`${name}: text overflow detected: ${JSON.stringify(overflow)}`);
	}
	const outputPath = path.join(shareDir, `${name}.png`);
	await card.screenshot({ path: outputPath, animations: 'disabled' });
	const metadata = await sharp(outputPath).metadata();
	if (metadata.width !== 1200 || metadata.height !== 675) {
		throw new Error(`${name}: expected 1200x675, got ${metadata.width}x${metadata.height}`);
	}
	const stat = await fs.stat(outputPath);
	manifest.push({
		file: path.relative(packageDir, outputPath),
		width: metadata.width,
		height: metadata.height,
		bytes: stat.size
	});
}

await browser.close();

const thumbWidth = 200;
const thumbHeight = 250;
const gap = 16;
const columns = 5;
const rows = 2;
const sheetWidth = columns * thumbWidth + (columns + 1) * gap;
const sheetHeight = rows * thumbHeight + (rows + 1) * gap;
const composites = [];

for (let index = 0; index < carouselFiles.length; index += 1) {
	const input = await sharp(carouselFiles[index]).resize(thumbWidth, thumbHeight).png().toBuffer();
	composites.push({
		input,
		left: gap + (index % columns) * (thumbWidth + gap),
		top: gap + Math.floor(index / columns) * (thumbHeight + gap)
	});
}

const contactSheet = path.join(assetsDir, 'contact-sheet.png');
await sharp({
	create: {
		width: sheetWidth,
		height: sheetHeight,
		channels: 4,
		background: '#0a0807'
	}
})
	.composite(composites)
	.png()
	.toFile(contactSheet);

const sheetMetadata = await sharp(contactSheet).metadata();
const sheetStat = await fs.stat(contactSheet);
manifest.push({
	file: path.relative(packageDir, contactSheet),
	width: sheetMetadata.width,
	height: sheetMetadata.height,
	bytes: sheetStat.size
});

await fs.writeFile(path.join(assetsDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

for (const item of manifest) {
	console.log(`${item.file} — ${item.width}x${item.height} — ${item.bytes} bytes`);
}
