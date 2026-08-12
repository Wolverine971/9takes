// output/personality-analysis-experiment/batch-type3-next-10/prepare-sources.mjs
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const root = 'output/personality-analysis-experiment/batch-type3-next-10';
const candidates = `${root}/replacement-candidates`;

const sources = [
	['kiernan-shipka', 'kiernan-shipka.jpg'],
	['madonna', 'madonna.jpg'],
	['margaret-qualley', 'margaret-qualley.jpg'],
	['michael-le', 'michael-le-contrast.webp'],
	['n3on', 'n3on.jpg'],
	['patrick-starr', 'patrick-starr.png'],
	['nancy-pelosi', 'nancy-pelosi-2019.jpg'],
	['chuck-schumer', 'chuck-schumer.jpg'],
	['pete-buttigieg', 'pete-buttigieg.jpg'],
	['plaqueboymax', 'plaqueboymax.jpg']
];

for (const [slug, filename] of sources) {
	const directory = `${root}/${slug}`;
	await mkdir(directory, { recursive: true });
	await sharp(`${candidates}/${filename}`)
		.flatten({ background: '#ffffff' })
		.jpeg({ quality: 96, chromaSubsampling: '4:4:4' })
		.toFile(`${directory}/source.jpg`);
}

await mkdir(`${root}/pelosi-schumer-dynamic`, { recursive: true });
