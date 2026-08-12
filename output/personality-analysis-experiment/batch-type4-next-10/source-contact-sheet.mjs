// output/personality-analysis-experiment/batch-type4-next-10/source-contact-sheet.mjs
import sharp from 'sharp';

const root = 'output/personality-analysis-experiment/batch-type4-next-10';
const items = [
	['Adam Driver', 'adam-driver'],
	['Colleen Hoover', 'colleen-hoover'],
	['Frank Ocean', 'frank-ocean'],
	['Hunter Biden', 'hunter-biden'],
	['Janelle Monáe', 'janelle-monae'],
	['Jonathan Groff', 'jonathan-groff'],
	['Machine Gun Kelly', 'machine-gun-kelly'],
	['Maddie Phillips', 'maddie-phillips'],
	['Nicholas Galitzine', 'nicholas-galitzine'],
	['Oscar Isaac', 'oscar-isaac']
];
const columns = 5;
const imageWidth = 260;
const imageHeight = 340;
const labelHeight = 34;
const layers = [];
for (const [index, [label, slug]] of items.entries()) {
	const x = (index % columns) * imageWidth;
	const y = Math.floor(index / columns) * (imageHeight + labelHeight);
	const portrait = await sharp(`${root}/${slug}/source.jpg`)
		.resize(imageWidth, imageHeight, { fit: 'contain', background: '#e8e8e8' })
		.flatten({ background: '#e8e8e8' })
		.jpeg({ quality: 90 })
		.toBuffer();
	const labelSvg = Buffer.from(
		`<svg width="${imageWidth}" height="${labelHeight}"><rect width="100%" height="100%" fill="#f4f4f4"/><text x="50%" y="23" text-anchor="middle" font-family="Arial" font-size="16" fill="#151515">${label}</text></svg>`
	);
	layers.push(
		{ input: portrait, left: x, top: y },
		{ input: labelSvg, left: x, top: y + imageHeight }
	);
}
await sharp({
	create: {
		width: columns * imageWidth,
		height: 2 * (imageHeight + labelHeight),
		channels: 3,
		background: '#dddddd'
	}
})
	.composite(layers)
	.jpeg({ quality: 92 })
	.toFile(`${root}/source-contact-sheet.jpg`);
