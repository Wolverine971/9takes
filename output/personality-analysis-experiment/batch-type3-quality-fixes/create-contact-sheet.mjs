// output/personality-analysis-experiment/batch-type3-quality-fixes/create-contact-sheet.mjs
import sharp from 'sharp';

const root = 'output/personality-analysis-experiment/batch-type3-quality-fixes';
const items = [
	['Madonna (fixed)', `${root}/madonna/Madonna-final.png`],
	['Margaret Qualley (fixed)', `${root}/margaret-qualley/Margaret-Qualley-final.png`],
	['Michael Le (fixed)', `${root}/michael-le/Michael-Le-final.png`],
	['N3on (fixed)', `${root}/n3on/N3on-final.png`],
	['Patrick Starrr (fixed)', `${root}/patrick-starr/Patrick-Starr-final.png`],
	['Riyaz Aly', `${root}/riyaz-aly/Riyaz-Aly-final.png`],
	['Stable Ronaldo', `${root}/stable-ronaldo/Stable-Ronaldo-final.png`],
	['Tate McRae', `${root}/tate-mcrae/Tate-McRae-final.png`],
	['Ted Bundy', `${root}/ted-bundy/Ted-Bundy-final.png`],
	['Xochitl Gomez', `${root}/xochitl-gomez/Xochitl-Gomez-final.png`]
];

const columns = 5;
const tileWidth = 320;
const imageSize = 290;
const labelHeight = 30;
const tileHeight = imageSize + labelHeight;
const layers = [];

for (let index = 0; index < items.length; index += 1) {
	const [label, path] = items[index];
	const x = (index % columns) * tileWidth + 15;
	const y = Math.floor(index / columns) * tileHeight;
	const portrait = await sharp(path)
		.resize(imageSize, imageSize, { fit: 'contain' })
		.flatten({ background: '#f2f2f2' })
		.png()
		.toBuffer();
	const text = Buffer.from(`
    <svg width="${imageSize}" height="${labelHeight}">
      <rect width="100%" height="100%" fill="#f2f2f2"/>
      <text x="50%" y="20" text-anchor="middle" font-family="Arial, sans-serif" font-size="15" fill="#161616">${label}</text>
    </svg>
  `);
	layers.push({ input: portrait, left: x, top: y });
	layers.push({ input: text, left: x, top: y + imageSize });
}

await sharp({
	create: { width: columns * tileWidth, height: 2 * tileHeight, channels: 3, background: '#e6e6e6' }
})
	.composite(layers)
	.png()
	.toFile(`${root}/final-contact-sheet.png`);
