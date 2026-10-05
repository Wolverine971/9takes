// scripts/blog-image-variants.mjs
// Turn an image DJ generated in ChatGPT into the 9takes blog image variant set:
// source-assets/blogs/{slug}.png (master), static/blogs/{slug}.webp (full, longest edge 1200, q82),
// and static/blogs/s-{slug}.webp (480px thumbnail, q72). No API calls, no cost.
//
// Usage:
//   node scripts/blog-image-variants.mjs <slug> <path/to/chatgpt-image.png|jpg|webp>
//
// Then set `pic: '<slug>'` in the post's frontmatter.

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const SOURCE_DIR = path.join(ROOT, 'source-assets', 'blogs');
const DELIVERY_DIR = path.join(ROOT, 'static', 'blogs');

const [slug, input] = process.argv.slice(2);
if (!slug || !input) {
	console.error('Usage: node scripts/blog-image-variants.mjs <slug> <source-image>');
	process.exit(1);
}
if (!fs.existsSync(input)) {
	console.error(`Source image not found: ${input}`);
	process.exit(1);
}

fs.mkdirSync(SOURCE_DIR, { recursive: true });
fs.mkdirSync(DELIVERY_DIR, { recursive: true });

// Lossless master stays outside static/ so deploys don't ship source artwork.
const pngPath = path.join(SOURCE_DIR, `${slug}.png`);
await sharp(input).png().toFile(pngPath);

const meta = await sharp(input).metadata();
await sharp(input)
	.resize({ width: Math.min(meta.width || 1200, 1200), withoutEnlargement: true })
	.webp({ quality: 82 })
	.toFile(path.join(DELIVERY_DIR, `${slug}.webp`));
await sharp(input)
	.resize({ width: 480, withoutEnlargement: true })
	.webp({ quality: 72 })
	.toFile(path.join(DELIVERY_DIR, `s-${slug}.webp`));

const kb = (f) => `${(fs.statSync(f).size / 1024).toFixed(0)}KB`;
console.log(`[variants] source ${meta.width}x${meta.height}`);
console.log(
	`[variants] wrote: ${slug}.png ${kb(pngPath)} | ${slug}.webp ${kb(path.join(DELIVERY_DIR, `${slug}.webp`))} | s-${slug}.webp ${kb(path.join(DELIVERY_DIR, `s-${slug}.webp`))}`
);
