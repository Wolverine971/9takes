// output/personality-analysis-experiment/batch-type3-quality-fixes/prepare-sources.mjs
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const root = 'output/personality-analysis-experiment/batch-type3-quality-fixes';
const finalFive =
	'output/personality-analysis-experiment/batch-type3-final-five/replacement-candidates';
const sources = [
	['madonna', `${root}/replacement-candidates/madonna-official.jpg`],
	[
		'margaret-qualley',
		'output/personality-analysis-experiment/batch-type3-next-10/margaret-qualley/source.jpg'
	],
	['michael-le', `${root}/replacement-candidates/michael-le-selfie.jpeg`],
	['n3on', `${root}/replacement-candidates/n3on-event.jpg`],
	['patrick-starr', `${root}/replacement-candidates/patrick-starr-uncropped.jpg`],
	['riyaz-aly', `${finalFive}/riyaz-aly-pink.jpg`],
	['stable-ronaldo', `${finalFive}/stable-ronaldo-july.jpg`],
	['tate-mcrae', `${finalFive}/tate-mcrae-v2.jpg`],
	['ted-bundy', `${finalFive}/ted-bundy-portrait.jpg`],
	['xochitl-gomez', `${finalFive}/xochitl-gomez.jpg`]
];

for (const [slug, input] of sources) {
	const directory = `${root}/${slug}`;
	await mkdir(directory, { recursive: true });
	await sharp(input)
		.flatten({ background: '#ffffff' })
		.jpeg({ quality: 96, chromaSubsampling: '4:4:4' })
		.toFile(`${directory}/source.jpg`);
}
