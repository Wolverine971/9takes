// output/personality-analysis-experiment/batch-types5-6-next-10/verify-fixed-line.mjs
import assert from 'node:assert/strict';
import sharp from 'sharp';

const root = 'output/personality-analysis-experiment/batch-types5-6-next-10';
const people = [
	['christopher-nolan', 'Christopher-Nolan'],
	['daniel-day-lewis', 'Daniel-Day-Lewis'],
	['steve-martin', 'Steve-Martin'],
	['yang-zhilin', 'Yang-Zhilin'],
	['zach-king', 'Zach-King'],
	['daniel-radcliffe', 'Daniel-Radcliffe'],
	['jimmy-kimmel', 'Jimmy-Kimmel'],
	['john-krasinski', 'John-Krasinski'],
	['noah-wyle', 'Noah-Wyle'],
	['sadie-sink', 'Sadie-Sink']
];
const line = await sharp('face-line-template.png')
	.extract({ left: 324, top: 428, width: 433, height: 125 })
	.png()
	.toBuffer();
for (const [slug, name] of people) {
	const expected = await sharp(`${root}/${slug}/poster.png`)
		.composite([{ input: line, left: 324, top: 428 }])
		.png()
		.toBuffer();
	const actual = await sharp(`${root}/${slug}/${name}-final.png`).png().toBuffer();
	assert.deepEqual(actual, expected, `${slug}: changed fixed overlay`);
}
console.log(
	`Verified ${people.length}/10 portraits use the unchanged 433x125 line at x=324, y=428.`
);
