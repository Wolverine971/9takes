// output/personality-analysis-experiment/batch-type3-rework-v2/build-portraits.mjs
import sharp from 'sharp';

const root = 'output/personality-analysis-experiment/batch-type3-rework-v2';
const canvasSize = 1080;
const target = { x: 540, y: 490 };
const targetEyeDistance = 176;
const people = [
	{
		slug: 'madonna',
		name: 'Madonna',
		width: 1333,
		height: 1772,
		left: [652.793, 242.347],
		right: [756.497, 234.569],
		correction: 4.29
	},
	{
		slug: 'margaret-qualley',
		name: 'Margaret-Qualley',
		width: 3840,
		height: 5761,
		left: [1362.441, 2638.383],
		right: [2330.439, 2673.553],
		correction: -2.081
	},
	{
		slug: 'michael-le',
		name: 'Michael-Le',
		width: 1254,
		height: 1254,
		left: [602.0, 363.0],
		right: [789.0, 350.0],
		correction: 3.978
	},
	{
		slug: 'patrick-starr',
		name: 'Patrick-Starr',
		width: 1254,
		height: 1254,
		left: [546.504, 573.968],
		right: [658.108, 583.965],
		correction: -5.119,
		aboveEyeScale: 0.75
	},
	{
		slug: 'riyaz-aly',
		name: 'Riyaz-Aly',
		width: 768,
		height: 461,
		left: [377.11, 122.89],
		right: [431.815, 147.493],
		correction: -24.215
	},
	{
		slug: 'stable-ronaldo',
		name: 'Stable-Ronaldo',
		width: 1672,
		height: 941,
		left: [732.943, 227.396],
		right: [824.758, 217.91],
		correction: 5.898
	},
	{
		slug: 'ted-bundy',
		name: 'Ted-Bundy',
		width: 1254,
		height: 1254,
		left: [536.747, 397.0],
		right: [673.717, 382.128],
		correction: 6.197
	},
	{
		slug: 'xochitl-gomez',
		name: 'Xochitl-Gomez',
		width: 1280,
		height: 1707,
		left: [627.061, 410.708],
		right: [813.727, 442.074],
		correction: -9.538
	},
	{
		slug: 'n3on',
		name: 'N3on',
		width: 613,
		height: 675,
		left: [281.718, 175.972],
		right: [390.726, 181.283],
		correction: -2.789
	},
	{
		slug: 'tate-mcrae',
		name: 'Tate-McRae',
		width: 1334,
		height: 2000,
		left: [553.543, 630.431],
		right: [692.546, 630.363],
		correction: 0.028
	}
];

function rotatePoint(point, sourceWidth, sourceHeight, outputWidth, outputHeight, degrees) {
	const radians = (degrees * Math.PI) / 180;
	const cos = Math.cos(radians);
	const sin = Math.sin(radians);
	const dx = point.x - sourceWidth / 2;
	const dy = point.y - sourceHeight / 2;
	return {
		x: cos * dx - sin * dy + outputWidth / 2,
		y: sin * dx + cos * dy + outputHeight / 2
	};
}

async function cropWithPadding(input, width, height, cropLeft, cropTop) {
	const padLeft = Math.max(0, -cropLeft);
	const padTop = Math.max(0, -cropTop);
	const adjustedLeft = cropLeft + padLeft;
	const adjustedTop = cropTop + padTop;
	const padRight = Math.max(0, adjustedLeft + canvasSize - (width + padLeft));
	const padBottom = Math.max(0, adjustedTop + canvasSize - (height + padTop));
	let padded = input;
	if (padLeft || padTop || padRight || padBottom) {
		padded = await sharp(input)
			.extend({
				left: padLeft,
				top: padTop,
				right: padRight,
				bottom: padBottom,
				background: { r: 0, g: 0, b: 0, alpha: 0 }
			})
			.png()
			.toBuffer();
	}
	return sharp(padded)
		.extract({ left: adjustedLeft, top: adjustedTop, width: canvasSize, height: canvasSize })
		.png()
		.toBuffer();
}

async function contractAlpha(input) {
	const { data, info } = await sharp(input)
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });
	const output = Buffer.from(data);
	for (let y = 0; y < info.height; y += 1) {
		for (let x = 0; x < info.width; x += 1) {
			let alpha = 255;
			for (let dy = -1; dy <= 1; dy += 1) {
				for (let dx = -1; dx <= 1; dx += 1) {
					const nx = x + dx;
					const ny = y + dy;
					alpha =
						nx < 0 || nx >= info.width || ny < 0 || ny >= info.height
							? 0
							: Math.min(alpha, data[(ny * info.width + nx) * 4 + 3]);
				}
			}
			output[(y * info.width + x) * 4 + 3] = alpha;
		}
	}
	return sharp(output, { raw: info }).png().toBuffer();
}

async function alphaBounds(input) {
	const { data, info } = await sharp(input)
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });
	let minX = info.width;
	let minY = info.height;
	let maxX = -1;
	let maxY = -1;
	for (let y = 0; y < info.height; y += 1) {
		for (let x = 0; x < info.width; x += 1) {
			if (data[(y * info.width + x) * 4 + 3] <= 8) continue;
			minX = Math.min(minX, x);
			minY = Math.min(minY, y);
			maxX = Math.max(maxX, x);
			maxY = Math.max(maxY, y);
		}
	}
	return { minX, minY, maxX, maxY };
}

async function makeLine() {
	return sharp('face-line-template.png')
		.extract({ left: 324, top: 428, width: 433, height: 125 })
		.png()
		.toBuffer();
}

for (const person of people) {
	const directory = `${root}/${person.slug}`;
	const { data: rotated, info: rotatedInfo } = await sharp(`${directory}/cutout.png`)
		.rotate(person.correction, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
		.png()
		.toBuffer({ resolveWithObject: true });
	const rawEyeDistance = Math.hypot(
		person.right[0] - person.left[0],
		person.right[1] - person.left[1]
	);
	const scale = targetEyeDistance / rawEyeDistance;
	const scaledWidth = Math.round(rotatedInfo.width * scale);
	const scaledHeight = Math.round(rotatedInfo.height * scale);
	const scaled = await sharp(rotated)
		.resize(scaledWidth, scaledHeight, { fit: 'fill' })
		.png()
		.toBuffer();
	const midpoint = {
		x: (person.left[0] + person.right[0]) / 2,
		y: (person.left[1] + person.right[1]) / 2
	};
	const rotatedMidpoint = rotatePoint(
		midpoint,
		person.width,
		person.height,
		rotatedInfo.width,
		rotatedInfo.height,
		person.correction
	);
	let scaledMidpoint = {
		x: (rotatedMidpoint.x * scaledWidth) / rotatedInfo.width,
		y: (rotatedMidpoint.y * scaledHeight) / rotatedInfo.height
	};
	let prepared = scaled;
	let preparedHeight = scaledHeight;
	if (person.aboveEyeScale) {
		const splitY = Math.max(1, Math.min(scaledHeight - 1, Math.round(scaledMidpoint.y)));
		const compressedHeight = Math.round(splitY * person.aboveEyeScale);
		const upper = await sharp(scaled)
			.extract({ left: 0, top: 0, width: scaledWidth, height: splitY })
			.resize(scaledWidth, compressedHeight, { fit: 'fill' })
			.png()
			.toBuffer();
		const lower = await sharp(scaled)
			.extract({ left: 0, top: splitY, width: scaledWidth, height: scaledHeight - splitY })
			.png()
			.toBuffer();
		preparedHeight = compressedHeight + scaledHeight - splitY;
		prepared = await sharp({
			create: {
				width: scaledWidth,
				height: preparedHeight,
				channels: 4,
				background: { r: 0, g: 0, b: 0, alpha: 0 }
			}
		})
			.composite([
				{ input: upper, left: 0, top: 0 },
				{ input: lower, left: 0, top: compressedHeight }
			])
			.png()
			.toBuffer();
		scaledMidpoint = { x: scaledMidpoint.x, y: compressedHeight };
	}
	const framed = await cropWithPadding(
		prepared,
		scaledWidth,
		preparedHeight,
		Math.round(scaledMidpoint.x - target.x),
		Math.round(scaledMidpoint.y - target.y)
	);
	const clean = await contractAlpha(framed);
	const poster = await sharp(clean)
		.modulate({ brightness: 1.02, saturation: 0.2 })
		.linear(1.08, -8)
		.sharpen({ sigma: 0.6 })
		.png()
		.toBuffer();
	const line = await makeLine();
	const lineMetadata = await sharp(line).metadata();
	await sharp(poster).toFile(`${directory}/poster.png`);
	await sharp(poster)
		.composite([
			{
				input: line,
				left: Math.round(target.x - lineMetadata.width / 2),
				top: Math.round(target.y - lineMetadata.height / 2)
			}
		])
		.png()
		.toFile(`${directory}/${person.name}-final.png`);
	console.log(
		JSON.stringify({
			slug: person.slug,
			eyeDistance: targetEyeDistance,
			targetY: target.y,
			bounds: await alphaBounds(clean)
		})
	);
}
