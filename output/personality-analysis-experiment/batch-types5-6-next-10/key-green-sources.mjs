// output/personality-analysis-experiment/batch-types5-6-next-10/key-green-sources.mjs
import sharp from 'sharp';

const root = 'output/personality-analysis-experiment/batch-types5-6-next-10';
const people = [
	'daniel-day-lewis',
	'steve-martin',
	'yang-zhilin',
	'zach-king',
	'jimmy-kimmel',
	'sadie-sink'
];

for (const slug of people) {
	const input = `${root}/${slug}/source.png`;
	const output = `${root}/${slug}/cutout-clean.png`;
	const { data, info } = await sharp(input)
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });
	for (let i = 0; i < data.length; i += 4) {
		const r = data[i];
		const g = data[i + 1];
		const b = data[i + 2];
		const greenStrength = g - Math.max(r, b);
		const greenDistance = Math.hypot(r, 255 - g, b);
		let alpha = 255;
		if (greenDistance < 105 || (g > 135 && greenStrength > 35)) alpha = 0;
		else if (g > 105 && greenStrength > 16)
			alpha = Math.max(0, Math.min(255, (greenStrength - 16) * -8 + 255));
		data[i + 3] = alpha;
		if (alpha > 0 && g > r && g > b) data[i + 1] = Math.round(Math.min(g, (r + b) / 2 + 12));
	}
	await sharp(data, { raw: info }).png().toFile(output);
	console.log(`Wrote ${output}`);
}
