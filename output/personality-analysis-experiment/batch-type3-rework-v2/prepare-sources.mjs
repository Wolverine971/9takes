// output/personality-analysis-experiment/batch-type3-rework-v2/prepare-sources.mjs
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const root = 'output/personality-analysis-experiment/batch-type3-rework-v2';
const candidates = `${root}/replacement-candidates`;
const people = [
	['madonna', `${candidates}/madonna.webp`],
	['margaret-qualley', `${candidates}/margaret-qualley-movieland.jpg`],
	['michael-le', `${candidates}/michael-le.jpg`],
	['patrick-starr', `${candidates}/patrick-starr-elle.jpg`],
	['riyaz-aly', `${candidates}/riyaz-aly.jpg`],
	['stable-ronaldo', `${candidates}/stable-ronaldo-youtube.jpg`],
	[
		'ted-bundy',
		'output/personality-analysis-experiment/batch-type3-quality-fixes/ted-bundy/source.jpg'
	],
	['xochitl-gomez', `${candidates}/xochitl-gomez-nalip.jpg`]
];

for (const [slug, input] of people) {
	const directory = `${root}/${slug}`;
	await mkdir(directory, { recursive: true });
	await sharp(input)
		.flatten({ background: '#ffffff' })
		.jpeg({ quality: 96, chromaSubsampling: '4:4:4' })
		.toFile(`${directory}/source.jpg`);
}
