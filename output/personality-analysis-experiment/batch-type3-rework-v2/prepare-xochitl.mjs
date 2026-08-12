// output/personality-analysis-experiment/batch-type3-rework-v2/prepare-xochitl.mjs
import sharp from 'sharp';

await sharp(
	'output/personality-analysis-experiment/batch-type3-rework-v2/replacement-candidates/xochitl-gomez-nalip.jpg'
)
	.flatten({ background: '#ffffff' })
	.jpeg({ quality: 96, chromaSubsampling: '4:4:4' })
	.toFile(
		'output/personality-analysis-experiment/batch-type3-rework-v2/xochitl-gomez/source-new.jpg'
	);
