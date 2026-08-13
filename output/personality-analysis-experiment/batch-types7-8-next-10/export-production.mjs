import sharp from 'sharp';

const root = 'output/personality-analysis-experiment/batch-types7-8-next-10';
const items = [
	['Shakira', 'shakira', 7],
	['Spencer-X', 'spencer-x', 7],
	['Stavros-Halkias', 'stavros-halkias', 7],
	['Steve-Irwin', 'steve-irwin', 7],
	['Tana-Mongeau', 'tana-mongeau', 7],
	['Travis-Kelce', 'travis-kelce', 7],
	['Bryce-Hall', 'bryce-hall', 8],
	['Duke-Dennis', 'duke-dennis', 8],
	['Idris-Elba', 'idris-elba', 8],
	['Jenna-Marbles', 'jenna-marbles', 8]
];

for (const [name, slug, type] of items) {
	const input = `${root}/${slug}/${name}-final.png`;
	const outputDirectory = `static/types/${type}s`;
	await sharp(input).webp({ quality: 92, alphaQuality: 100, smartSubsample: true }).toFile(`${outputDirectory}/${name}.webp`);
	await sharp(input).resize(480, 480).webp({ quality: 88, alphaQuality: 100, smartSubsample: true }).toFile(`${outputDirectory}/s-${name}.webp`);
}
