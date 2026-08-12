// output/personality-analysis-experiment/batch-20/source-contact-sheet.mjs
import sharp from 'sharp';

const sources = [
	['Peter Attia v2', '../peter-attia-v2/source.jpg'],
	['Jacinda Ardern', 'jacinda-ardern/source.jpg'],
	['Madelaine Petsch', 'madelaine-petsch/source.jpg'],
	['Richard Simmons', 'richard-simmons/source.jpg'],
	['Simon Sinek', 'simon-sinek/source.jpg'],
	['Andy Cohen', 'andy-cohen/source.jpg'],
	['Ava Max', 'ava-max/source.jpg'],
	['Bruno Mars', 'bruno-mars/source.jpg'],
	['Chase Infiniti', 'chase-infiniti/source.jpg'],
	['Chiara Ferragni', 'chiara-ferragni/source.jpg'],
	['Cleopatra', 'cleopatra/source.jpg']
];

const root = 'output/personality-analysis-experiment/batch-20';
const tileWidth = 300;
const tileHeight = 360;
const imageHeight = 320;
const columns = 4;
const rows = Math.ceil(sources.length / columns);

const composites = [];
for (let index = 0; index < sources.length; index += 1) {
	const [label, relativePath] = sources[index];
	const input = relativePath.startsWith('../')
		? `output/personality-analysis-experiment/${relativePath.slice(3)}`
		: `${root}/${relativePath}`;
	const image = await sharp(input)
		.resize({ width: tileWidth, height: imageHeight, fit: 'contain', background: '#202020' })
		.jpeg()
		.toBuffer();
	const x = (index % columns) * tileWidth;
	const y = Math.floor(index / columns) * tileHeight;
	composites.push({ input: image, left: x, top: y });
	composites.push({
		input: Buffer.from(
			`<svg width="${tileWidth}" height="40"><rect width="100%" height="100%" fill="#111"/><text x="12" y="27" fill="white" font-family="Arial" font-size="19">${label}</text></svg>`
		),
		left: x,
		top: y + imageHeight
	});
}

await sharp({
	create: {
		width: columns * tileWidth,
		height: rows * tileHeight,
		channels: 3,
		background: '#202020'
	}
})
	.composite(composites)
	.jpeg({ quality: 90 })
	.toFile(`${root}/source-contact-sheet.jpg`);
