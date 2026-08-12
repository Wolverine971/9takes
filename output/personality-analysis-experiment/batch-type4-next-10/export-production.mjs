// output/personality-analysis-experiment/batch-type4-next-10/export-production.mjs
import sharp from 'sharp';

const root = 'output/personality-analysis-experiment/batch-type4-next-10';
const outputDirectory = 'static/types/4s';
const items = [
	['Adam-Driver', 'adam-driver'],
	['Colleen-Hoover', 'colleen-hoover'],
	['Frank-Ocean', 'frank-ocean'],
	['Hunter-Biden', 'hunter-biden'],
	['Janelle-Monae', 'janelle-monae'],
	['Jonathan-Graff', 'jonathan-groff', 'Jonathan-Groff'],
	['Machine-Gun-Kelly', 'machine-gun-kelly'],
	['Maddie-Phillips', 'maddie-phillips'],
	['Nicholas-Galitzine', 'nicholas-galitzine'],
	['Oscar-Isaac', 'oscar-isaac']
];
for (const [name, slug, inputName = name] of items) {
	const input = `${root}/${slug}/${inputName}-final.png`;
	await sharp(input)
		.webp({ quality: 92, alphaQuality: 100, smartSubsample: true })
		.toFile(`${outputDirectory}/${name}.webp`);
	await sharp(input)
		.resize(480, 480)
		.webp({ quality: 88, alphaQuality: 100, smartSubsample: true })
		.toFile(`${outputDirectory}/s-${name}.webp`);
}
