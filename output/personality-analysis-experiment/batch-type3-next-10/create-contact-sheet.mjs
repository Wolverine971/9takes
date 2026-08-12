// output/personality-analysis-experiment/batch-type3-next-10/create-contact-sheet.mjs
import sharp from 'sharp';

const root = 'output/personality-analysis-experiment/batch-type3-next-10';
const items = [
	['Kiernan Shipka', `${root}/kiernan-shipka/Kiernan-Shipka-final.png`],
	['Madonna', `${root}/madonna/Madonna-final.png`],
	['Margaret Qualley', `${root}/margaret-qualley/Margaret-Qualley-final.png`],
	['Marie Kondo', 'static/types/9s/Marie-Kondo.webp'],
	['Michael Le', `${root}/michael-le/Michael-Le-final.png`],
	['N3on', `${root}/n3on/N3on-final.png`],
	['Patrick Starrr', `${root}/patrick-starr/Patrick-Starr-final.png`],
	['Pelosi + Schumer', `${root}/pelosi-schumer-dynamic/Pelosi-Schumer-Dynamic-final.png`],
	['Pete Buttigieg', `${root}/pete-buttigieg/Pete-Buttigieg-final.png`],
	['PlaqueBoyMax', `${root}/plaqueboymax/PlaqueBoyMax-final.png`]
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
	const image = await sharp(path)
		.resize(imageSize, imageSize, { fit: 'contain' })
		.flatten({ background: '#f2f2f2' })
		.png()
		.toBuffer();
	const text = Buffer.from(`
    <svg width="${imageSize}" height="${labelHeight}">
      <rect width="100%" height="100%" fill="#f2f2f2"/>
      <text x="50%" y="20" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#161616">${label}</text>
    </svg>
  `);
	layers.push({ input: image, left: x, top: y });
	layers.push({ input: text, left: x, top: y + imageSize });
}

await sharp({
	create: {
		width: columns * tileWidth,
		height: 2 * tileHeight,
		channels: 3,
		background: '#e6e6e6'
	}
})
	.composite(layers)
	.png()
	.toFile(`${root}/final-contact-sheet.png`);
