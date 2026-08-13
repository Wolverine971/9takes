// output/personality-analysis-experiment/batch-types5-6-next-10/create-contact-sheet.mjs
import sharp from 'sharp';

const root = 'output/personality-analysis-experiment/batch-types6-7-next-10';
const items = [
	['Samara Weaving', 'samara-weaving', 'Samara-Weaving'],
	['Volodymyr Zelensky', 'volodymyr-zelensky', 'Volodymyr-Zelensky'],
	['Zooey Deschanel', 'zooey-deschanel', 'Zooey-Deschanel'],
	['Florence Pugh', 'florence-pugh', 'Florence-Pugh'],
	['Jeff Goldblum', 'jeff-goldblum', 'Jeff-Goldblum'],
	['Julia Roberts', 'julia-roberts', 'Julia-Roberts'],
	['KSI', 'ksi', 'KSI'],
	['Lele Pons', 'lele-pons', 'Lele-Pons'],
	['Lizzo', 'lizzo', 'Lizzo'],
	['Marie Antoinette', 'marie-antoinette', 'Marie-Antoinette']
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
	const labelSvg = Buffer.from(
		`<svg width="${size}" height="${labelHeight}"><rect width="100%" height="100%" fill="#f2f2f2"/><text x="50%" y="23" text-anchor="middle" font-family="Arial" font-size="16" fill="#161616">${label}</text></svg>`
	);
	layers.push({ input: portrait, left: x, top: y }, { input: labelSvg, left: x, top: y + size });
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
