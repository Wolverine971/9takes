// Measure the baked-in violet eye marks without rewriting the portrait assets.
// Run with gen:personality-image-map after adding or replacing a portrait.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../', import.meta.url));
const portraitRoot = path.join(root, 'static/types');
const output = path.join(root, 'src/lib/generated/personalityPortraitAlignment.json');
const files = (await fs.readdir(portraitRoot, { recursive: true }))
	.filter((file) => /^[1-9]s\/s-.*\.webp$/.test(file))
	.sort();
const alignment = {};

for (const file of files) {
	const { data, info } = await sharp(path.join(portraitRoot, file))
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });
	// The rail crops square source images to 4:5, so their full vertical span
	// remains visible. Don't apply that geometry to a future non-square source.
	if (info.width !== info.height) throw new Error(`Non-square portrait: ${file}`);
	const rows = new Uint32Array(info.height);
	let count = 0;
	for (let y = 0; y < info.height; y += 1) {
		for (let x = 0; x < info.width; x += 1) {
			const offset = (y * info.width + x) * 4;
			const r = data[offset];
			const g = data[offset + 1];
			const b = data[offset + 2];
			const a = data[offset + 3];
			if (a > 100 && b > r * 1.12 && r > g * 1.3 && b - g > 35 && r > 45) {
				rows[y] += 1;
				count += 1;
			}
		}
	}
	if (count < info.width * info.height * 0.01) {
		throw new Error(`No reliable violet eye mark: ${file}`);
	}
	// Trim sparse antialiasing/brush tips before finding the visual center.
	let cumulative = 0;
	let top;
	let bottom;
	for (let y = 0; y < rows.length; y += 1) {
		cumulative += rows[y];
		if (top === undefined && cumulative >= count * 0.05) top = y;
		if (cumulative >= count * 0.95) {
			bottom = y;
			break;
		}
	}
	const center = (top + bottom + 1) / (2 * info.height);
	if (center < 0.3 || center > 0.6) throw new Error(`Review eye mark position: ${file}`);
	alignment[`/types/${file}`] = Number(center.toFixed(6));
}

await fs.writeFile(output, `${JSON.stringify(alignment, null, '\t')}\n`);
console.log(`Measured ${files.length} portrait eye marks.`);
