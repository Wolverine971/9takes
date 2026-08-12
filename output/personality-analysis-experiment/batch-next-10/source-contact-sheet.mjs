// output/personality-analysis-experiment/batch-next-10/source-contact-sheet.mjs
import sharp from 'sharp';

const root = 'output/personality-analysis-experiment/batch-next-10';
const sources = [
	['David Beckham', 'david-beckham/source.jpg'],
	['Gal Gadot', 'gal-gadot/source.jpg'],
	['Halle Berry', 'halle-berry/source.jpg'],
	['Jackson Wang', 'jackson-wang/source.jpg'],
	['Jared Kushner', 'jared-kushner/source.jpg'],
	['Josh Richards', 'josh-richards/source.jpg'],
	['Jynxzi — Forbes', 'jynxzi/source-forbes.jpg'],
	['Jynxzi — alternate', 'jynxzi/source-alt.webp']
];

const tileWidth = 300;
const tileHeight = 360;
const imageHeight = 320;
const columns = 4;
const rows = Math.ceil(sources.length / columns);
const composites = [];

for (let index = 0; index < sources.length; index += 1) {
	const [label, relativePath] = sources[index];
	const image = await sharp(`${root}/${relativePath}`)
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
