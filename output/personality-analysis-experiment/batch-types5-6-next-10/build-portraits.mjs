// output/personality-analysis-experiment/batch-types5-6-next-10/build-portraits.mjs
import sharp from 'sharp';

const root = 'output/personality-analysis-experiment/batch-types5-6-next-10';
const canvasSize = 1080;
const target = { x: 540, y: 490 };
const people = [
	{
		slug: 'christopher-nolan',
		name: 'Christopher-Nolan',
		width: 1018,
		height: 1527,
		left: [352.393, 665.522],
		right: [580.794, 656.972],
		correction: 2.144,
		eyeDistance: 160
	},
	{
		slug: 'daniel-day-lewis',
		name: 'Daniel-Day-Lewis',
		width: 1023,
		height: 1537,
		left: [435.923, 522.743],
		right: [582.781, 514.818],
		correction: 3.089,
		eyeDistance: 160
	},
	{
		slug: 'steve-martin',
		name: 'Steve-Martin',
		width: 1025,
		height: 1535,
		left: [432.715, 494.937],
		right: [596.452, 491.501],
		correction: 1.202,
		eyeDistance: 160
	},
	{
		slug: 'yang-zhilin',
		name: 'Yang-Zhilin',
		width: 1023,
		height: 1537,
		left: [415.59, 459.745],
		right: [621.697, 463.371],
		correction: -1.008,
		eyeDistance: 160
	},
	{
		slug: 'zach-king',
		name: 'Zach-King',
		width: 1023,
		height: 1537,
		left: [463.462, 511.39],
		right: [639.935, 508.178],
		correction: 1.043,
		eyeDistance: 160
	},
	{
		slug: 'daniel-radcliffe',
		name: 'Daniel-Radcliffe',
		width: 936,
		height: 1404,
		left: [378.654, 473.154],
		right: [518.606, 468.943],
		correction: 1.723,
		eyeDistance: 150
	},
	{
		slug: 'jimmy-kimmel',
		name: 'Jimmy-Kimmel',
		width: 1023,
		height: 1537,
		left: [406.933, 589.509],
		right: [572.834, 591.095],
		correction: -0.548,
		eyeDistance: 160
	},
	{
		slug: 'john-krasinski',
		name: 'John-Krasinski',
		width: 1920,
		height: 2880,
		left: [654.805, 1281.719],
		right: [1159.379, 1265.276],
		correction: 1.866,
		eyeDistance: 150
	},
	{
		slug: 'noah-wyle',
		name: 'Noah-Wyle',
		width: 1920,
		height: 2400,
		left: [808.809, 573.118],
		right: [1010.993, 548.958],
		correction: 6.814,
		eyeDistance: 160
	},
	{
		slug: 'sadie-sink',
		name: 'Sadie-Sink',
		width: 1067,
		height: 1475,
		left: [510.461, 492.957],
		right: [640.854, 468.417],
		correction: 10.659,
		eyeDistance: 150
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
