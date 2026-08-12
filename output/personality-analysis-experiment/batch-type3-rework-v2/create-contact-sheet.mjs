// output/personality-analysis-experiment/batch-type3-rework-v2/create-contact-sheet.mjs
import sharp from 'sharp';

const root = 'output/personality-analysis-experiment/batch-type3-rework-v2';
const items = [
	['Madonna', `${root}/madonna/Madonna-final.png`],
	['Margaret Qualley', `${root}/margaret-qualley/Margaret-Qualley-final.png`],
	['Michael Le', `${root}/michael-le/Michael-Le-final.png`],
	['Patrick Starrr', `${root}/patrick-starr/Patrick-Starr-final.png`],
	['Riyaz Aly', `${root}/riyaz-aly/Riyaz-Aly-final.png`],
	['Stable Ronaldo', `${root}/stable-ronaldo/Stable-Ronaldo-final.png`],
	['Ted Bundy', `${root}/ted-bundy/Ted-Bundy-final.png`],
	['Xochitl Gomez', `${root}/xochitl-gomez/Xochitl-Gomez-final.png`],
	['N3on', `${root}/n3on/N3on-final.png`],
	['Tate McRae', `${root}/tate-mcrae/Tate-McRae-final.png`]
];
const columns = 4;
const imageSize = 320;
const labelHeight = 34;
const tileWidth = 340;
const layers = [];
for (let index = 0; index < items.length; index += 1) {
	const [label, path] = items[index];
	const x = (index % columns) * tileWidth + 10;
	const y = Math.floor(index / columns) * (imageSize + labelHeight);
	const portrait = await sharp(path)
		.resize(imageSize, imageSize, { fit: 'contain' })
		.flatten({ background: '#f2f2f2' })
		.png()
		.toBuffer();
	const text = Buffer.from(
		`<svg width="${imageSize}" height="${labelHeight}"><rect width="100%" height="100%" fill="#f2f2f2"/><text x="50%" y="23" text-anchor="middle" font-family="Arial" font-size="16" fill="#161616">${label}</text></svg>`
	);
	layers.push({ input: portrait, left: x, top: y }, { input: text, left: x, top: y + imageSize });
}
const rows = Math.ceil(items.length / columns);
await sharp({
	create: {
		width: columns * tileWidth,
		height: rows * (imageSize + labelHeight),
		channels: 3,
		background: '#e6e6e6'
	}
})
	.composite(layers)
	.png()
	.toFile(`${root}/contact-sheet.png`);
