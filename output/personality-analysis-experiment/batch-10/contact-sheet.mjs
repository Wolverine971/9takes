// output/personality-analysis-experiment/batch-10/contact-sheet.mjs
import sharp from 'sharp';

const people = [
	['ben-shapiro', 'Ben Shapiro'],
	['caitlin-clark', 'Caitlin Clark'],
	['james-clear', 'James Clear'],
	['judge-judy', 'Judge Judy'],
	['lea-michele', 'Lea Michele'],
	['mahatma-gandhi', 'Mahatma Gandhi'],
	['martha-stewart', 'Martha Stewart'],
	['peter-attia', 'Peter Attia'],
	['audrey-hepburn', 'Audrey Hepburn'],
	['brene-brown', 'Brené Brown']
];

const tileWidth = 320;
const tileHeight = 420;
const imageHeight = 370;
const columns = 5;

const composites = [];
for (let index = 0; index < people.length; index += 1) {
	const [slug, label] = people[index];
	const left = (index % columns) * tileWidth;
	const top = Math.floor(index / columns) * tileHeight;
	const image = await sharp(`output/personality-analysis-experiment/batch-10/${slug}/source.jpg`)
		.resize({ width: tileWidth, height: imageHeight, fit: 'cover', position: 'top' })
		.jpeg()
		.toBuffer();
	const caption = Buffer.from(`
    <svg width="${tileWidth}" height="50" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#171717"/>
      <text x="16" y="32" fill="white" font-family="Arial, sans-serif" font-size="20">${label}</text>
    </svg>
  `);
	composites.push({ input: image, left, top });
	composites.push({ input: caption, left, top: top + imageHeight });
}

await sharp({
	create: {
		width: columns * tileWidth,
		height: 2 * tileHeight,
		channels: 3,
		background: '#171717'
	}
})
	.composite(composites)
	.jpeg({ quality: 90 })
	.toFile('output/personality-analysis-experiment/batch-10/source-contact-sheet.jpg');
