// output/personality-analysis-experiment/batch-types7-8-next-10/create-replacement-sheet.mjs
import sharp from 'sharp';

const root = 'output/personality-analysis-experiment/batch-types7-8-next-10';
const items = [
	['Shakira', 'shakira', 'Shakira'],
	['Travis Kelce', 'travis-kelce', 'Travis-Kelce']
];
const size = 540;
const labelHeight = 52;
const layers = [];

for (const [index, [label, slug, filename]] of items.entries()) {
	const portrait = await sharp(`${root}/${slug}/${filename}-final.png`)
		.resize(size, size)
		.flatten({ background: '#f2f2f2' })
		.png()
		.toBuffer();
	const labelSvg = Buffer.from(
		`<svg width="${size}" height="${labelHeight}"><rect width="100%" height="100%" fill="#f2f2f2"/><text x="50%" y="34" text-anchor="middle" font-family="Arial" font-size="22" fill="#161616">${label}</text></svg>`
	);
	layers.push(
		{ input: portrait, left: index * size, top: 0 },
		{ input: labelSvg, left: index * size, top: size }
	);
}

await sharp({
	create: {
		width: size * items.length,
		height: size + labelHeight,
		channels: 3,
		background: '#e6e6e6'
	}
})
	.composite(layers)
	.png()
	.toFile(`${root}/replacement-sheet-shakira-travis-kelce.png`);
