// output/personality-analysis-experiment/batch-types5-6-next-10/export-production.mjs
import sharp from 'sharp';

const root = 'output/personality-analysis-experiment/batch-types5-6-next-10';
const items = [
	['Christopher-Nolan', 'christopher-nolan', 5],
	['Daniel-Day-Lewis', 'daniel-day-lewis', 5],
	['Steve-Martin', 'steve-martin', 5],
	['Yang-Zhilin', 'yang-zhilin', 5],
	['Zach-King', 'zach-king', 5],
	['Daniel-Radcliffe', 'daniel-radcliffe', 6],
	['Jimmy-Kimmel', 'jimmy-kimmel', 6],
	['John-Krasinski', 'john-krasinski', 6],
	['Noah-Wyle', 'noah-wyle', 6],
	['Sadie-Sink', 'sadie-sink', 6]
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
