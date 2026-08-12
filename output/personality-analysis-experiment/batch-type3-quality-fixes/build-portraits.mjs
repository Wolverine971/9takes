// output/personality-analysis-experiment/batch-type3-quality-fixes/build-portraits.mjs
import sharp from 'sharp';

const root = 'output/personality-analysis-experiment/batch-type3-quality-fixes';
const canvasSize = 1080;
const target = { x: 540, y: 500 };
const people = [
	{
		slug: 'madonna',
		name: 'Madonna',
		width: 1400,
		height: 750,
		left: [628.274, 259.118],
		right: [764.964, 259.858],
		correction: -0.31,
		eyeDistance: 160
	},
	{
		slug: 'margaret-qualley',
		name: 'Margaret-Qualley',
		width: 1200,
		height: 1500,
		left: [492.322, 443.192],
		right: [715.304, 445.428],
		correction: -0.575,
		eyeDistance: 160
	},
	{
		slug: 'michael-le',
		name: 'Michael-Le',
		width: 1120,
		height: 1400,
		left: [491.037, 610.031],
		right: [713.626, 612.98],
		correction: -0.759,
		eyeDistance: 160
	},
	{
		slug: 'n3on',
		name: 'N3on',
		width: 613,
		height: 675,
		left: [281.718, 175.972],
		right: [390.726, 181.283],
		correction: -2.789,
		eyeDistance: 160
	},
	{
		slug: 'patrick-starr',
		name: 'Patrick-Starr',
		width: 5040,
		height: 3360,
		left: [2229.599, 1317.727],
		right: [2754.686, 1313.744],
		correction: 0.435,
		eyeDistance: 156
	},
	{
		slug: 'riyaz-aly',
		name: 'Riyaz-Aly',
		width: 736,
		height: 736,
		left: [341.595, 184.976],
		right: [413.519, 196.139],
		correction: -8.823,
		eyeDistance: 160
	},
	{
		slug: 'stable-ronaldo',
		name: 'Stable-Ronaldo',
		width: 500,
		height: 700,
		left: [158.082, 230.256],
		right: [215.54, 214.742],
		correction: 15.11,
		eyeDistance: 145
	},
	{
		slug: 'tate-mcrae',
		name: 'Tate-McRae',
		width: 1334,
		height: 2000,
		left: [553.543, 630.431],
		right: [692.546, 630.363],
		correction: 0.028,
		eyeDistance: 145
	},
	{
		slug: 'ted-bundy',
		name: 'Ted-Bundy',
		width: 600,
		height: 849,
		left: [216.668, 359.93],
		right: [325.004, 345.83],
		correction: 7.415,
		eyeDistance: 160
	},
	{
		slug: 'xochitl-gomez',
		name: 'Xochitl-Gomez',
		width: 800,
		height: 1200,
		left: [335.808, 485.426],
		right: [533.669, 499.862],
		correction: -4.173,
		eyeDistance: 160
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

async function makeLine(eyeDistance) {
	const width = Math.round((eyeDistance * 433) / 176);
	const height = Math.round((width * 125) / 433);
	return sharp('face-line-template.png')
		.extract({ left: 324, top: 428, width: 433, height: 125 })
		.resize(width, height, { fit: 'fill' })
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
	const cropLeft = Math.round(scaledMidpoint.x - target.x);
	const cropTop = Math.round(scaledMidpoint.y - target.y);
	const framed = await cropWithPadding(scaled, scaledWidth, scaledHeight, cropLeft, cropTop);
	const clean = await contractAlpha(framed);
	const bounds = await alphaBounds(clean);
	const poster = await sharp(clean)
		.modulate({ brightness: 1.02, saturation: 0.2 })
		.linear(1.08, -8)
		.sharpen({ sigma: 0.6 })
		.png()
		.toBuffer();

	const line = await makeLine(person.eyeDistance);
	const lineMetadata = await sharp(line).metadata();
	const lineLeft = Math.round(target.x - lineMetadata.width / 2);
	const lineTop = Math.round(target.y - lineMetadata.height / 2);
	await sharp(poster).toFile(`${directory}/poster.png`);
	await sharp(poster)
		.composite([{ input: line, left: lineLeft, top: lineTop }])
		.png()
		.toFile(`${directory}/${person.name}-final.png`);

	console.log(
		JSON.stringify({
			slug: person.slug,
			correction: person.correction,
			eyeDistance: person.eyeDistance,
			scale: Number(scale.toFixed(4)),
			bounds
		})
	);
}
