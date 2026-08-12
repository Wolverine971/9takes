// output/personality-analysis-experiment/batch-type4-next-10/verify-production.mjs
import assert from 'node:assert/strict';
import { stat } from 'node:fs/promises';
import sharp from 'sharp';

const names = [
	'Adam-Driver',
	'Colleen-Hoover',
	'Frank-Ocean',
	'Hunter-Biden',
	'Janelle-Monae',
	'Jonathan-Graff',
	'Machine-Gun-Kelly',
	'Maddie-Phillips',
	'Nicholas-Galitzine',
	'Oscar-Isaac'
];
for (const name of names) {
	for (const [prefix, size] of [
		['', 1080],
		['s-', 480]
	]) {
		const path = `static/types/4s/${prefix}${name}.webp`;
		const metadata = await sharp(path).metadata();
		const file = await stat(path);
		assert.equal(metadata.width, size, `${path}: wrong width`);
		assert.equal(metadata.height, size, `${path}: wrong height`);
		assert.equal(metadata.hasAlpha, true, `${path}: missing transparency`);
		assert.ok(file.size > 10_000, `${path}: suspiciously small`);
	}
}
console.log(`Verified ${names.length}/10 production pairs: 1080px + 480px, alpha present.`);
