// output/personality-analysis-experiment/batch-types5-6-next-10/build-portraits.mjs
import sharp from 'sharp';

const root = 'output/personality-analysis-experiment/batch-types6-7-next-10';
const canvasSize = 1080;
const target = { x: 540, y: 490 };
const people = [
	{
		slug: 'samara-weaving',
		name: 'Samara-Weaving',
		width: 1008,
		height: 1561,
		left: [425.129, 470.458],
		right: [569.537, 476.096],
		correction: -2.235,
		eyeDistance: 160
	},
	{
		slug: 'volodymyr-zelensky',
		name: 'Volodymyr-Zelensky',
		width: 3488,
		height: 4724,
		left: [1657.974, 903.872],
		right: [2077.504, 915.543],
		correction: -1.593,
		eyeDistance: 160
	},
	{
		slug: 'zooey-deschanel',
		name: 'Zooey-Deschanel',
		width: 1122,
		height: 1402,
		left: [534.359, 502.598],
		right: [708.985, 500.858],
		correction: 0.571,
		eyeDistance: 160
	},
	{
		slug: 'florence-pugh',
		name: 'Florence-Pugh',
		width: 1024,
		height: 1536,
		left: [449.234, 651.404],
		right: [611.719, 647.76],
		correction: 1.285,
		eyeDistance: 160
	},
	{
		slug: 'jeff-goldblum',
		name: 'Jeff-Goldblum',
		width: 1023,
		height: 1537,
		left: [405.35, 583.619],
		right: [563.801, 570.938],
		correction: 4.575,
		eyeDistance: 160
	},
	{
		slug: 'julia-roberts',
		name: 'Julia-Roberts',
		width: 1024,
		height: 1536,
		left: [446.069, 461.845],
		right: [574.93, 460.907],
		correction: 0.417,
		eyeDistance: 160
	},
	{
		slug: 'ksi',
		name: 'KSI',
		width: 1024,
		height: 1536,
		left: [454.289, 534.169],
		right: [620.205, 530.961],
		correction: 1.108,
		eyeDistance: 160
	},
	{
		slug: 'lele-pons',
		name: 'Lele-Pons',
		width: 1024,
		height: 1536,
		left: [483.334, 423.455],
		right: [604.574, 406.091],
		correction: 8.15,
		eyeDistance: 160
	},
	{
		slug: 'lizzo',
		name: 'Lizzo',
		width: 1402,
		height: 1122,
		left: [673.447, 342.745],
		right: [827.827, 358.423],
		correction: -5.799,
		eyeDistance: 160
	},
	{
		slug: 'marie-antoinette',
		name: 'Marie-Antoinette',
		width: 1110,
		height: 1417,
		left: [472.676, 544.065],
		right: [596.679, 543.701],
		correction: 0.168,
		eyeDistance: 126
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

const line = await sharp('face-line-template.png')
	.extract({ left: 324, top: 428, width: 433, height: 125 })
	.png()
	.toBuffer();

for (const person of people) {
	const directory = `${root}/${person.slug}`;
	const { data: rotated, info: rotatedInfo } = await sharp(`${directory}/cutout-clean.png`)
		.rotate(person.correction, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
		.png()
		.toBuffer({ resolveWithObject: true });
	const rawEyeDistance = Math.hypot(
		person.right[0] - person.left[0],
		person.right[1] - person.left[1]
	);
	const scale = person.eyeDistance / rawEyeDistance;
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
	const scaledMidpoint = {
		x: (rotatedMidpoint.x * scaledWidth) / rotatedInfo.width,
		y: (rotatedMidpoint.y * scaledHeight) / rotatedInfo.height
	};
	const framed = await cropWithPadding(
		scaled,
		scaledWidth,
		scaledHeight,
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
	await sharp(poster).toFile(`${directory}/poster.png`);
	await sharp(poster)
		.composite([{ input: line, left: 324, top: 428 }])
		.png()
		.toFile(`${directory}/${person.name}-final.png`);
	console.log(JSON.stringify({ slug: person.slug, scale, bounds: await alphaBounds(clean) }));
}
