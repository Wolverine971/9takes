// output/personality-analysis-experiment/batch-type3-rework-v2/export-production.mjs
import sharp from 'sharp';

const root = 'output/personality-analysis-experiment/batch-type3-rework-v2';
const outputDirectory = 'static/types/3s';
const items = [
	['Madonna', `${root}/madonna/Madonna-final.png`],
	['Margaret-Qualley', `${root}/margaret-qualley/Margaret-Qualley-final.png`],
	['Michael-Le', `${root}/michael-le/Michael-Le-final.png`],
	['Patrick-Starr', `${root}/patrick-starr/Patrick-Starr-final.png`],
	['Riyaz-Aly', `${root}/riyaz-aly/Riyaz-Aly-final.png`],
	['Stable-Ronaldo', `${root}/stable-ronaldo/Stable-Ronaldo-final.png`],
	['Ted-Bundy', `${root}/ted-bundy/Ted-Bundy-final.png`],
	['Xochitl-Gomez', `${root}/xochitl-gomez/Xochitl-Gomez-final.png`],
	['N3on', `${root}/n3on/N3on-final.png`],
	['Tate-McRae', `${root}/tate-mcrae/Tate-McRae-final.png`]
];
for (const [name, input] of items) {
	await sharp(input)
		.webp({ quality: 92, alphaQuality: 100, smartSubsample: true })
		.toFile(`${outputDirectory}/${name}.webp`);
	await sharp(input)
		.resize(480, 480, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
		.webp({ quality: 88, alphaQuality: 100, smartSubsample: true })
		.toFile(`${outputDirectory}/s-${name}.webp`);
}
