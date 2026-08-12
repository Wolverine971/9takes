// output/personality-analysis-experiment/batch-type3-rework-v2/prepare-patrick-outpaint.mjs
import sharp from 'sharp';

const source =
	'output/personality-analysis-experiment/batch-type3-rework-v2/replacement-candidates/patrick-starr-et.jpg';
const output =
	'output/personality-analysis-experiment/batch-type3-rework-v2/replacement-candidates/patrick-starr-et-outpaint-input.png';
const inset = await sharp(source).png().toBuffer();
await sharp({
	create: { width: 1280, height: 1280, channels: 3, background: '#00ff00' }
})
	.composite([{ input: inset, left: 0, top: 280 }])
	.png()
	.toFile(output);
