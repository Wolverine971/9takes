// output/personality-analysis-experiment/batch-10/final-contact-sheet.mjs
import sharp from 'sharp';

const people = [
	['ben-shapiro', 'Ben-Shapiro', 'Ben Shapiro'],
	['caitlin-clark', 'Caitlin-Clark', 'Caitlin Clark'],
	['james-clear', 'James-Clear', 'James Clear'],
	['judge-judy', 'Judge-Judy', 'Judge Judy'],
	['lea-michele', 'Lea-Michele', 'Lea Michele'],
	['mahatma-gandhi', 'Mahatma-Gandhi', 'Mahatma Gandhi'],
	['martha-stewart', 'Martha-Stewart', 'Martha Stewart'],
	['peter-attia', 'Peter-Attia', 'Peter Attia'],
	['audrey-hepburn', 'Audrey-Hepburn', 'Audrey Hepburn'],
	['brene-brown', 'Brene-Brown', 'Brené Brown']
];

const tile = 320;
const captionHeight = 50;
const columns = 5;
const composites = [];

for (let index = 0; index < people.length; index += 1) {
	const [slug, fileName, label] = people[index];
	const left = (index % columns) * tile;
	const top = Math.floor(index / columns) * (tile + captionHeight);
	const portrait = await sharp(
		`output/personality-analysis-experiment/batch-10/${slug}/${fileName}-final.png`
	)
		.resize(tile, tile)
		.png()
		.toBuffer();
	const caption = Buffer.from(`
    <svg width="${tile}" height="${captionHeight}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#171717"/>
      <text x="16" y="32" fill="white" font-family="Arial, sans-serif" font-size="20">${label}</text>
    </svg>
  `);
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
	.toFile('output/personality-analysis-experiment/batch-10/final-contact-sheet.png');
