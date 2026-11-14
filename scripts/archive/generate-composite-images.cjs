#!/usr/bin/env node

/**
 * Generate composite blog images from picGroup entries.
 *
 * Creates 2200x1080 composites matching trump-biden-contrast.webp dimensions.
 * People overlap movie-poster style, bottom-aligned, on a transparent background
 * so the page's dark theme shows through.
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const STATIC_DIR = path.join(__dirname, '..', 'static');
const BLOGS_IMG_DIR = path.join(STATIC_DIR, 'blogs');
const BLOG_SRC_DIR = path.join(__dirname, '..', 'src', 'blog');

const CANVAS_W = 2200;
const CANVAS_H = 1080;

/**
 * Layout configs per image count.
 * Images are bottom-aligned and sized to fill most of the canvas height.
 * Stride = horizontal offset between consecutive images.
 * group_width = imageSize + (n-1) * stride ≈ CANVAS_W
 */
function getLayout(n) {
	const configs = {
		2: { imageSize: 1080, stride: 1120 }, // full height, 40px gap (matches trump-biden)
		3: { imageSize: 1000, stride: 600 }, // 40% overlap
		4: { imageSize: 900, stride: 433 }, // 52% overlap
		5: { imageSize: 800, stride: 350 }, // 56% overlap
		6: { imageSize: 700, stride: 300 } // 57% overlap
	};
	return configs[n] || configs[6];
}

function parseFrontmatter(content) {
	const match = content.match(/^---\n([\s\S]*?)\n---/);
	if (!match) return null;
	return match[1];
}

function extractPic(frontmatter) {
	const picMatch = frontmatter.match(/^pic:\s*'([^']*)'/m);
	return picMatch ? picMatch[1] : '';
}

function extractPicGroup(frontmatter) {
	const items = [];
	const regex = /-\s*image:\s*'([^']+)'\s*\n\s*text:\s*'([^']+)'\s*\n\s*enneagramType:\s*(\d+)/g;
	let m;
	while ((m = regex.exec(frontmatter)) !== null) {
		items.push({ image: m[1], text: m[2], enneagramType: parseInt(m[3]) });
	}
	return items;
}

function slugFromPath(filePath) {
	return path.basename(filePath, '.md');
}

async function createComposite(picGroup, outputPath) {
	const n = picGroup.length;
	const { imageSize, stride } = getLayout(n);

	// Bottom-align: images sit at the bottom of the canvas
	const yOffset = CANVAS_H - imageSize;

	// Center the group horizontally
	const groupWidth = imageSize + (n - 1) * stride;
	const xStart = Math.floor((CANVAS_W - groupWidth) / 2);

	const composites = [];
	for (let i = 0; i < n; i++) {
		const imgPath = path.join(STATIC_DIR, picGroup[i].image);
		if (!fs.existsSync(imgPath)) {
			console.warn(`  WARNING: Missing image ${imgPath} — skipping blog`);
			return false;
		}

		const resized = await sharp(imgPath).resize(imageSize, imageSize, { fit: 'cover' }).toBuffer();

		const x = xStart + i * stride;
		composites.push({ input: resized, left: Math.max(0, x), top: Math.max(0, yOffset) });
	}

	// Transparent canvas — page dark theme shows through
	await sharp({
		create: {
			width: CANVAS_W,
			height: CANVAS_H,
			channels: 4,
			background: { r: 0, g: 0, b: 0, alpha: 0 }
		}
	})
		.composite(composites)
		.webp({ quality: 85 })
		.toFile(outputPath);

	return true;
}

function updateFrontmatterPic(filePath, picValue) {
	let content = fs.readFileSync(filePath, 'utf-8');
	content = content.replace(/^pic:\s*'[^']*'/m, `pic: '${picValue}'`);
	fs.writeFileSync(filePath, content, 'utf-8');
}

async function main() {
	const forceRegenerate = process.argv.includes('--force');
	const files = glob.sync(path.join(BLOG_SRC_DIR, '**', '*.md'));
	let created = 0;
	let skipped = 0;

	for (const filePath of files) {
		const content = fs.readFileSync(filePath, 'utf-8');
		const frontmatter = parseFrontmatter(content);
		if (!frontmatter) continue;

		const pic = extractPic(frontmatter);
		const picGroup = extractPicGroup(frontmatter);

		if (picGroup.length < 2) continue;

		const slug = slugFromPath(filePath);
		const outputName = `${slug}-composite`;
		const outputPath = path.join(BLOGS_IMG_DIR, `${outputName}.webp`);

		// Skip hand-crafted pics unless forcing
		if (pic !== '' && !pic.endsWith('-composite') && !forceRegenerate) continue;

		if (fs.existsSync(outputPath) && !forceRegenerate) {
			console.log(`  EXISTS: ${outputName}.webp — skipping`);
			skipped++;
			continue;
		}

		console.log(`  Creating: ${outputName}.webp (${picGroup.length} images)`);
		const success = await createComposite(picGroup, outputPath);
		if (success) {
			updateFrontmatterPic(filePath, outputName);
			created++;
			console.log(`  OK: ${outputName}.webp`);
		} else {
			skipped++;
		}
	}

	console.log(`\nDone: ${created} created, ${skipped} skipped`);
}

main().catch(console.error);
