// output/personality-analysis-experiment/batch-type3-rework-v2/prepare-fixed-line-people.mjs
import fs from 'node:fs/promises';
import sharp from 'sharp';

const root = 'output/personality-analysis-experiment/batch-type3-rework-v2';
const qualityRoot = 'output/personality-analysis-experiment/batch-type3-quality-fixes';

for (const slug of ['n3on', 'tate-mcrae']) {
	await fs.mkdir(`${root}/${slug}`, { recursive: true });
	await fs.copyFile(`${qualityRoot}/${slug}/source.jpg`, `${root}/${slug}/source.jpg`);
	await fs.copyFile(`${qualityRoot}/${slug}/cutout.png`, `${root}/${slug}/cutout.png`);
}

await sharp(`${root}/replacement-candidates/patrick-starr-volta.jpg`)
	.flatten({ background: '#ffffff' })
	.jpeg({ quality: 96, chromaSubsampling: '4:4:4' })
	.toFile(`${root}/patrick-starr/source-new.jpg`);
await fs.rename(`${root}/patrick-starr/source-new.jpg`, `${root}/patrick-starr/source.jpg`);

const metadata = await sharp(`${root}/patrick-starr/source.jpg`).metadata();
console.log(`Prepared fixed-line sources; Patrick Starrr is ${metadata.width}x${metadata.height}.`);
