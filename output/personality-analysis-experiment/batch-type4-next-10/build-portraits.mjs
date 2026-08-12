// output/personality-analysis-experiment/batch-type4-next-10/build-portraits.mjs
import sharp from 'sharp';

const root = 'output/personality-analysis-experiment/batch-type4-next-10';
const canvasSize = 1080;
const target = { x: 540, y: 490 };
const targetEyeDistance = 176;
const people = [
	{
		slug: 'adam-driver',
		name: 'Adam-Driver',
		width: 1920,
		height: 2880,
		left: [800.821, 704.7],
		right: [1097.324, 687.348],
		correction: 3.349
	},
	{
		slug: 'colleen-hoover',
		name: 'Colleen-Hoover',
		width: 1860,
		height: 2325,
		left: [690.729, 777.555],
		right: [928.939, 728.798],
		correction: 11.568
	},
	{
		slug: 'frank-ocean',
		name: 'Frank-Ocean',
		width: 2000,
		height: 2400,
		left: [758.508, 722.443],
		right: [1112.125, 715.388],
		correction: 1.143,
		eyeDistance: 160
	},
	{
		slug: 'hunter-biden',
		name: 'Hunter-Biden',
		width: 1377,
		height: 1142,
		left: [613.252, 481.443],
		right: [759.646, 483.561],
		correction: -0.829,
		eyeDistance: 160
	},
	{
		slug: 'janelle-monae',
		name: 'Janelle-Monae',
		width: 905,
		height: 1206,
		left: [384.716, 474.527],
		right: [537.426, 472.743],
		correction: 0.669,
		eyeDistance: 150
	},
	{
		slug: 'jonathan-groff',
		name: 'Jonathan-Groff',
		width: 768,
		height: 895,
		left: [357.099, 213.445],
		right: [433.651, 214.517],
		correction: -0.802
	},
	{
		slug: 'machine-gun-kelly',
		name: 'Machine-Gun-Kelly',
		width: 1440,
		height: 960,
		left: [607.56, 299.081],
		right: [720.732, 300.91],
		correction: -0.926,
		eyeDistance: 150
	},
	{
		slug: 'maddie-phillips',
		name: 'Maddie-Phillips',
		width: 1023,
		height: 1537,
		left: [430.572, 512.277],
		right: [577.561, 495.027],
		correction: 6.693,
		eyeDistance: 160
	},
	{
		slug: 'nicholas-galitzine',
		name: 'Nicholas-Galitzine',
		width: 1361,
		height: 2050,
		left: [576.16, 706.463],
		right: [910.949, 735.318],
		correction: -4.926
	},
	{
		slug: 'oscar-isaac',
		name: 'Oscar-Isaac',
		width: 5760,
		height: 3840,
		left: [2786.521, 1327.151],
		right: [3339.917, 1297.748],
		correction: 3.041
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
	const scale = (person.eyeDistance ?? targetEyeDistance) / rawEyeDistance;
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
