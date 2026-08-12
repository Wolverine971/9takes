// output/personality-analysis-experiment/batch-type4-next-10/key-frank.mjs
import sharp from 'sharp';

const input = 'output/personality-analysis-experiment/batch-type4-next-10/frank-ocean/source.jpg';
const output = 'output/personality-analysis-experiment/batch-type4-next-10/frank-ocean/cutout.png';
const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
for (let i = 0; i < data.length; i += 4) {
	const r = data[i];
	const g = data[i + 1];
	const b = data[i + 2];
	const greenStrength = g - Math.max(r, b);
	const luminance = (r + g + b) / 3;
	let alpha = 255;
	if (g > 140 && greenStrength > 32) alpha = 0;
	else if (g > 110 && greenStrength > 18)
		alpha = Math.max(0, Math.min(255, (42 - greenStrength) * 10));
	data[i + 3] = alpha;
	if (alpha > 0 && alpha < 255 && g > r && g > b) {
		data[i + 1] = Math.round(Math.min(g, (r + b) / 2 + luminance * 0.08));
	}
}
await sharp(data, { raw: info }).png().toFile(output);
