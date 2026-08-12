// output/personality-analysis-experiment/batch-type4-next-10/create-contact-sheet.mjs
import sharp from 'sharp';

const root = 'output/personality-analysis-experiment/batch-type4-next-10';
const items = [
	['Adam Driver', 'adam-driver', 'Adam-Driver'],
	['Colleen Hoover', 'colleen-hoover', 'Colleen-Hoover'],
	['Frank Ocean', 'frank-ocean', 'Frank-Ocean'],
	['Hunter Biden', 'hunter-biden', 'Hunter-Biden'],
	['Janelle Monáe', 'janelle-monae', 'Janelle-Monae'],
	['Jonathan Groff', 'jonathan-groff', 'Jonathan-Groff'],
	['Machine Gun Kelly', 'machine-gun-kelly', 'Machine-Gun-Kelly'],
	['Maddie Phillips', 'maddie-phillips', 'Maddie-Phillips'],
	['Nicholas Galitzine', 'nicholas-galitzine', 'Nicholas-Galitzine'],
	['Oscar Isaac', 'oscar-isaac', 'Oscar-Isaac']
];
const columns = 5;
const size = 300;
const labelHeight = 34;
const layers = [];
for (const [index, [label, slug, filename]] of items.entries()) {
	const x = (index % columns) * size;
	const y = Math.floor(index / columns) * (size + labelHeight);
	const portrait = await sharp(`${root}/${slug}/${filename}-final.png`)
		.resize(size, size)
		.flatten({ background: '#f2f2f2' })
		.png()
		.toBuffer();
	const text = Buffer.from(
		`<svg width="${size}" height="${labelHeight}"><rect width="100%" height="100%" fill="#f2f2f2"/><text x="50%" y="23" text-anchor="middle" font-family="Arial" font-size="16" fill="#161616">${label}</text></svg>`
	);
	layers.push({ input: portrait, left: x, top: y }, { input: text, left: x, top: y + size });
}
await sharp({
	create: {
		width: columns * size,
		height: 2 * (size + labelHeight),
		channels: 3,
		background: '#e6e6e6'
	}
})
	.composite(layers)
	.png()
	.toFile(`${root}/contact-sheet.png`);
