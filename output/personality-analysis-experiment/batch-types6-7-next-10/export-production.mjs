// output/personality-analysis-experiment/batch-types5-6-next-10/export-production.mjs
import sharp from 'sharp';

const root = 'output/personality-analysis-experiment/batch-types6-7-next-10';
const items = [
	['Samara-Weaving', 'samara-weaving', 6],
	['Volodymyr-Zelensky', 'volodymyr-zelensky', 6],
	['Zooey-Deschanel', 'zooey-deschanel', 6],
	['Florence-Pugh', 'florence-pugh', 7],
	['Jeff-Goldblum', 'jeff-goldblum', 7],
	['Julia-Roberts', 'julia-roberts', 7],
	['KSI', 'ksi', 7],
	['Lele-Pons', 'lele-pons', 7],
	['Lizzo', 'lizzo', 7],
	['Marie-Antoinette', 'marie-antoinette', 7]
];

for (const [name, slug, type] of items) {
	const input = `${root}/${slug}/${name}-final.png`;
	const outputDirectory = `static/types/${type}s`;
	await sharp(input)
		.webp({ quality: 92, alphaQuality: 100, smartSubsample: true })
		.toFile(`${outputDirectory}/${name}.webp`);
	await sharp(input)
		.resize(480, 480)
		.webp({ quality: 88, alphaQuality: 100, smartSubsample: true })
		.toFile(`${outputDirectory}/s-${name}.webp`);
}
