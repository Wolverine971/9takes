// output/personality-analysis-experiment/batch-type3-rework-v2/verify-fixed-line.mjs
import assert from 'node:assert/strict';
import sharp from 'sharp';

const root = 'output/personality-analysis-experiment/batch-type3-rework-v2';
const people = [
	['madonna', 'Madonna'],
	['margaret-qualley', 'Margaret-Qualley'],
	['michael-le', 'Michael-Le'],
	['patrick-starr', 'Patrick-Starr'],
	['riyaz-aly', 'Riyaz-Aly'],
	['stable-ronaldo', 'Stable-Ronaldo'],
	['ted-bundy', 'Ted-Bundy'],
	['xochitl-gomez', 'Xochitl-Gomez'],
	['n3on', 'N3on'],
	['tate-mcrae', 'Tate-McRae']
];
const line = await sharp('face-line-template.png')
	.extract({ left: 324, top: 428, width: 433, height: 125 })
	.png()
	.toBuffer();

for (const [slug, name] of people) {
	const poster = `${root}/${slug}/poster.png`;
	const actual = `${root}/${slug}/${name}-final.png`;
	const expected = await sharp(poster)
		.composite([{ input: line, left: 324, top: 428 }])
		.png()
		.toBuffer();
	const actualBuffer = await sharp(actual).png().toBuffer();
	assert.deepEqual(
		actualBuffer,
		expected,
		`${slug}: final does not contain the unchanged fixed overlay`
	);
}

console.log(
	`Verified ${people.length}/10 portraits use the unchanged 433x125 line at x=324, y=428.`
);
