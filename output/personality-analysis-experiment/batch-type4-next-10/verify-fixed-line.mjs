// output/personality-analysis-experiment/batch-type4-next-10/verify-fixed-line.mjs
import assert from 'node:assert/strict';
import sharp from 'sharp';

const root = 'output/personality-analysis-experiment/batch-type4-next-10';
const people = [
	['adam-driver', 'Adam-Driver'],
	['colleen-hoover', 'Colleen-Hoover'],
	['frank-ocean', 'Frank-Ocean'],
	['hunter-biden', 'Hunter-Biden'],
	['janelle-monae', 'Janelle-Monae'],
	['jonathan-groff', 'Jonathan-Groff'],
	['machine-gun-kelly', 'Machine-Gun-Kelly'],
	['maddie-phillips', 'Maddie-Phillips'],
	['nicholas-galitzine', 'Nicholas-Galitzine'],
	['oscar-isaac', 'Oscar-Isaac']
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
