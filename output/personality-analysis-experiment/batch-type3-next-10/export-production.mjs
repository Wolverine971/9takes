// output/personality-analysis-experiment/batch-type3-next-10/export-production.mjs
import sharp from 'sharp';

const root = 'output/personality-analysis-experiment/batch-type3-next-10';
const outputDirectory = 'static/types/3s';
const items = [
	['Kiernan-Shipka', `${root}/kiernan-shipka/Kiernan-Shipka-final.png`],
	['Madonna', `${root}/madonna/Madonna-final.png`],
	['Margaret-Qualley', `${root}/margaret-qualley/Margaret-Qualley-final.png`],
	['Marie-Kondo', 'static/types/9s/Marie-Kondo.webp'],
	['Michael-Le', `${root}/michael-le/Michael-Le-final.png`],
	['N3on', `${root}/n3on/N3on-final.png`],
	['Patrick-Starr', `${root}/patrick-starr/Patrick-Starr-final.png`],
	['Pelosi-Schumer-Dynamic', `${root}/pelosi-schumer-dynamic/Pelosi-Schumer-Dynamic-final.png`],
	['Pete-Buttigieg', `${root}/pete-buttigieg/Pete-Buttigieg-final.png`],
	['PlaqueBoyMax', `${root}/plaqueboymax/PlaqueBoyMax-final.png`]
];

for (const [name, input] of items) {
	await sharp(input)
		.resize(1080, 1080, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
		.webp({ quality: 92, alphaQuality: 100, smartSubsample: true })
		.toFile(`${outputDirectory}/${name}.webp`);

	await sharp(input)
		.resize(480, 480, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
		.webp({ quality: 88, alphaQuality: 100, smartSubsample: true })
		.toFile(`${outputDirectory}/s-${name}.webp`);
}
