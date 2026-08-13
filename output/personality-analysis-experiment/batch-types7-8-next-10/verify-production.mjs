import assert from 'node:assert/strict';
import { stat } from 'node:fs/promises';
import sharp from 'sharp';

const items = [
	['Shakira', 7],
	['Spencer-X', 7],
	['Stavros-Halkias', 7],
	['Steve-Irwin', 7],
	['Tana-Mongeau', 7],
	['Travis-Kelce', 7],
	['Bryce-Hall', 8],
	['Duke-Dennis', 8],
	['Idris-Elba', 8],
	['Jenna-Marbles', 8]
];

for (const [name, type] of items) {
	for (const [prefix, size] of [['', 1080], ['s-', 480]]) {
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
