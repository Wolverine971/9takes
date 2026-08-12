// output/personality-analysis-experiment/batch-next-10/final-contact-sheet.mjs
import sharp from 'sharp';

const people = [
	['Corina Conf', 'static/types/7s/Corinna-Kopf.webp'],
	[
		'Dalton Caldwell',
		'output/personality-analysis-experiment/batch-next-10/dalton-caldwell/Dalton-Caldwell-final.png'
	],
	[
		'David Beckham',
		'output/personality-analysis-experiment/batch-next-10/david-beckham/David-Beckham-final.png'
	],
	[
		'Gal Gadot',
		'output/personality-analysis-experiment/batch-next-10/gal-gadot/Gal-Gadot-final.png'
	],
	[
		'Halle Berry',
		'output/personality-analysis-experiment/batch-next-10/halle-berry/Halle-Berry-final.png'
	],
	[
		'Jackson Wang',
		'output/personality-analysis-experiment/batch-next-10/jackson-wang/Jackson-Wang-final.png'
	],
	['James Charles — lifestyle', 'static/types/3s/James-Charles.webp'],
	[
		'Jared Kushner',
		'output/personality-analysis-experiment/batch-next-10/jared-kushner/Jared-Kushner-final.png'
	],
	[
		'Josh Richards',
		'output/personality-analysis-experiment/batch-next-10/josh-richards/Josh-Richards-final.png'
	],
	['Jynxzi', 'output/personality-analysis-experiment/batch-next-10/jynxzi/Jynxzi-final.png']
];

const root = 'output/personality-analysis-experiment/batch-next-10';
const tile = 320;
const captionHeight = 50;
const columns = 5;
const composites = [];

for (let index = 0; index < people.length; index += 1) {
	const [label, file] = people[index];
	const left = (index % columns) * tile;
	const top = Math.floor(index / columns) * (tile + captionHeight);
	const portrait = await sharp(file).resize(tile, tile).png().toBuffer();
	const caption = Buffer.from(
		`<svg width="${tile}" height="${captionHeight}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#171717"/><text x="16" y="32" fill="white" font-family="Arial, sans-serif" font-size="20">${label}</text></svg>`
	);
	composites.push({ input: portrait, left, top });
	composites.push({ input: caption, left, top: top + tile });
}

await sharp({
	create: {
		width: columns * tile,
		height: 2 * (tile + captionHeight),
		channels: 4,
		background: { r: 0, g: 0, b: 0, alpha: 0 }
	}
})
	.composite(composites)
	.png()
	.toFile(`${root}/final-contact-sheet.png`);
