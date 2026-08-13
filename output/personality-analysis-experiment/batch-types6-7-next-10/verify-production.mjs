// output/personality-analysis-experiment/batch-types5-6-next-10/verify-production.mjs
import assert from 'node:assert/strict';
import { stat } from 'node:fs/promises';
import sharp from 'sharp';

const items = [
	['Samara-Weaving', 6],
	['Volodymyr-Zelensky', 6],
	['Zooey-Deschanel', 6],
	['Florence-Pugh', 7],
	['Jeff-Goldblum', 7],
	['Julia-Roberts', 7],
	['KSI', 7],
	['Lele-Pons', 7],
	['Lizzo', 7],
	['Marie-Antoinette', 7]
];
for (const [name, type] of items) {
	for (const [prefix, size] of [
		['', 1080],
		['s-', 480]
	]) {
		const path = `static/types/${type}s/${prefix}${name}.webp`;
		const metadata = await sharp(path).metadata();
		const file = await stat(path);
		assert.equal(metadata.width, size, `${path}: wrong width`);
		assert.equal(metadata.height, size, `${path}: wrong height`);
		assert.equal(metadata.hasAlpha, true, `${path}: missing transparency`);
		assert.ok(file.size > 10_000, `${path}: suspiciously small`);
	}
}
console.log(`Verified ${items.length}/10 production pairs: 1080px + 480px, alpha present.`);
