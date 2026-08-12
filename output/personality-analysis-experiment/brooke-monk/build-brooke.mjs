// output/personality-analysis-experiment/brooke-monk/build-brooke.mjs
import sharp from 'sharp';

const root = 'output/personality-analysis-experiment/brooke-monk';
const source = `${root}/Brooke-Monk-cutout-native.png`;
const posterCutout = `${root}/Brooke-Monk-poster-cutout.png`;
const final = `${root}/Brooke-Monk-final-v3.png`;
const faceLine = 'face-line-template.png';
const rotationDegrees = 11.492;
const zoom = 1.3;

const croppedSubject = await sharp(source)
	.resize({ width: 1180 })
	.extract({ left: 50, top: 0, width: 1080, height: 1050 })
	.png()
	.toBuffer();

const composedSubject = await sharp(croppedSubject)
	.extend({
		top: 30,
		bottom: 0,
		left: 0,
		right: 0,
		background: { r: 0, g: 0, b: 0, alpha: 0 }
	})
	.modulate({ brightness: 1.02, saturation: 0.2 })
	.linear(1.08, -8)
	.sharpen({ sigma: 0.6 })
	.png()
	.toBuffer();

const { data: rotatedSubject, info: rotatedInfo } = await sharp(composedSubject)
	.rotate(rotationDegrees, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
	.png()
	.toBuffer({ resolveWithObject: true });

const zoomedWidth = Math.round(rotatedInfo.width * zoom);
const zoomedHeight = Math.round(rotatedInfo.height * zoom);
const zoomedSubject = await sharp(rotatedSubject)
	.resize({ width: zoomedWidth, height: zoomedHeight, fit: 'fill' })
	.png()
	.toBuffer();

const cropLeft = Math.round((zoomedWidth - 1080) / 2 - 30);
const cropTop = Math.round((zoomedHeight - 1080) / 2 - 42);
const alignedSubject = await sharp(zoomedSubject)
	.extract({ left: cropLeft, top: cropTop, width: 1080, height: 1080 })
	.png()
	.toBuffer();

await sharp(alignedSubject).toFile(posterCutout);

const line = await sharp(faceLine)
	.resize({ width: 972, height: 1080, fit: 'fill' })
	.png()
	.toBuffer();

await sharp(alignedSubject)
	.composite([{ input: line, left: 54, top: 8 }])
	.png()
	.toFile(final);

console.log({
	source,
	rotationDegrees,
	zoom,
	cropLeft,
	cropTop,
	posterCutout,
	final
});
