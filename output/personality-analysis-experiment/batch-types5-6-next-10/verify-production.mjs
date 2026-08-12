// output/personality-analysis-experiment/batch-types5-6-next-10/verify-production.mjs
import assert from 'node:assert/strict';
import { stat } from 'node:fs/promises';
import sharp from 'sharp';

const items = [
	['Christopher-Nolan', 5],
	['Daniel-Day-Lewis', 5],
	['Steve-Martin', 5],
	['Yang-Zhilin', 5],
	['Zach-King', 5],
	['Daniel-Radcliffe', 6],
	['Jimmy-Kimmel', 6],
	['John-Krasinski', 6],
	['Noah-Wyle', 6],
	['Sadie-Sink', 6]
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
