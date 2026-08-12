// output/personality-analysis-experiment/batch-type3-next-10/build-portraits.mjs
import sharp from 'sharp';

const root = 'output/personality-analysis-experiment/batch-type3-next-10';
const faceLinePath = 'face-line-template.png';
const canvasSize = 1080;
const targetEyeMidpoint = { x: 540, y: 500 };
const targetEyeDistance = 176;

const people = [
	{
		slug: 'kiernan-shipka',
		name: 'Kiernan-Shipka',
		width: 1000,
		height: 1250,
		left: [396.093, 333.648],
		right: [515.022, 321.551],
		correction: 5.808
	},
	{
		slug: 'madonna',
		name: 'Madonna',
		width: 4500,
		height: 4500,
		left: [1904.543, 756.342],
		right: [2190.579, 776.243],
		correction: -3.98
	},
	{
		slug: 'margaret-qualley',
		name: 'Margaret-Qualley',
		width: 1200,
		height: 1500,
		left: [492.277, 443.527],
		right: [715.283, 444.915],
		correction: -0.357
	},
	{
		slug: 'michael-le',
		name: 'Michael-Le',
		width: 2065,
		height: 1580,
		left: [972.089, 398.968],
		right: [1293.463, 458.345],
		correction: -10.468
	},
	{
		slug: 'n3on',
		name: 'N3on',
		width: 1200,
		height: 840,
		left: [475.329, 349.803],
		right: [702.194, 350.739],
		correction: -0.236
	},
	{
		slug: 'patrick-starr',
		name: 'Patrick-Starr',
		width: 1080,
		height: 1080,
		left: [476.297, 360.238],
		right: [594.148, 363.639],
		correction: -1.653
	},
	{
		slug: 'pete-buttigieg',
		name: 'Pete-Buttigieg',
		width: 2588,
		height: 3235,
		left: [1079.766, 1022.119],
		right: [1405.431, 996.867],
		correction: 4.434
	},
	{
		slug: 'plaqueboymax',
		name: 'PlaqueBoyMax',
		width: 640,
		height: 640,
		left: [272.344, 216.978],
		right: [373.017, 219.303],
		correction: -1.323
	}
];

const pair = [
	{
		slug: 'nancy-pelosi',
		width: 3000,
		height: 3750,
		left: [1278.812, 1245.5],
		right: [1787.691, 1236.208],
		correction: 1.046,
		target: { x: 315, y: 500 }
	},
	{
		slug: 'chuck-schumer',
		width: 4032,
		height: 5040,
		left: [1741.17, 1096.713],
		right: [2123.335, 1080.94],
		correction: 2.363,
		target: { x: 765, y: 500 }
	}
];

const line = await sharp(faceLinePath)
	.resize({ width: canvasSize, height: canvasSize, fit: 'fill' })
	.png()
	.toBuffer();

const compactLine = await sharp(faceLinePath)
	.extract({ left: 324, top: 428, width: 433, height: 125 })
	.resize({ width: 332, height: 96, fit: 'fill' })
	.png()
	.toBuffer();

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
			let minimumAlpha = 255;
			for (let dy = -1; dy <= 1; dy += 1) {
				for (let dx = -1; dx <= 1; dx += 1) {
					const nx = x + dx;
					const ny = y + dy;
					if (nx < 0 || nx >= info.width || ny < 0 || ny >= info.height) {
						minimumAlpha = 0;
						continue;
					}
					minimumAlpha = Math.min(minimumAlpha, data[(ny * info.width + nx) * 4 + 3]);
				}
			}
			output[(y * info.width + x) * 4 + 3] = minimumAlpha;
		}
	}

	return sharp(output, { raw: info }).png().toBuffer();
}

async function keepLargestAlphaComponent(input) {
	const { data, info } = await sharp(input)
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });
	const total = info.width * info.height;
	const labels = new Int32Array(total);
	const queue = new Int32Array(total);
	const sizes = [0];
	let label = 0;

	for (let seed = 0; seed < total; seed += 1) {
		if (labels[seed] || data[seed * 4 + 3] <= 8) continue;
		label += 1;
		let head = 0;
		let tail = 0;
		let size = 0;
		labels[seed] = label;
		queue[tail++] = seed;

		while (head < tail) {
			const index = queue[head++];
			size += 1;
			const x = index % info.width;
			const y = Math.floor(index / info.width);
			const neighbors = [];
			if (x > 0) neighbors.push(index - 1);
			if (x + 1 < info.width) neighbors.push(index + 1);
			if (y > 0) neighbors.push(index - info.width);
			if (y + 1 < info.height) neighbors.push(index + info.width);
			for (const neighbor of neighbors) {
				if (labels[neighbor] || data[neighbor * 4 + 3] <= 8) continue;
				labels[neighbor] = label;
				queue[tail++] = neighbor;
			}
		}
		sizes[label] = size;
	}

	let largestLabel = 0;
	for (let index = 1; index < sizes.length; index += 1) {
		if (sizes[index] > (sizes[largestLabel] ?? 0)) largestLabel = index;
	}

	const output = Buffer.from(data);
	for (let index = 0; index < total; index += 1) {
		if (labels[index] !== largestLabel) output[index * 4 + 3] = 0;
	}
	return sharp(output, { raw: info }).png().toBuffer();
}

async function normalize(person, eyeDistance = targetEyeDistance, midpoint = targetEyeMidpoint) {
	const source = `${root}/${person.slug}/cutout.png`;
	const { data: rotated, info: rotatedInfo } = await sharp(source)
		.rotate(person.correction, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
		.png()
		.toBuffer({ resolveWithObject: true });

	const rawEyeDistance = Math.hypot(
		person.right[0] - person.left[0],
		person.right[1] - person.left[1]
	);
	const scale = eyeDistance / rawEyeDistance;
	const scaledWidth = Math.round(rotatedInfo.width * scale);
	const scaledHeight = Math.round(rotatedInfo.height * scale);
	const scaled = await sharp(rotated)
		.resize({ width: scaledWidth, height: scaledHeight, fit: 'fill' })
		.png()
		.toBuffer();

	const rawMidpoint = {
		x: (person.left[0] + person.right[0]) / 2,
		y: (person.left[1] + person.right[1]) / 2
	};
	const rotatedMidpoint = rotatePoint(
		rawMidpoint,
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
	const cropLeft = Math.round(scaledMidpoint.x - midpoint.x);
	const cropTop = Math.round(scaledMidpoint.y - midpoint.y);
	const framed = await cropWithPadding(scaled, scaledWidth, scaledHeight, cropLeft, cropTop);
	const contracted = await contractAlpha(framed);
	const clean = await keepLargestAlphaComponent(contracted);
	return { clean, scale, cropLeft, cropTop };
}

async function posterize(input) {
	return sharp(input)
		.modulate({ brightness: 1.02, saturation: 0.2 })
		.linear(1.08, -8)
		.sharpen({ sigma: 0.6 })
		.png()
		.toBuffer();
}

for (const person of people) {
	const directory = `${root}/${person.slug}`;
	const posterPath = `${directory}/poster.png`;
	const finalPath = `${directory}/${person.name}-final.png`;
	const normalized = await normalize(person);
	const poster = await posterize(normalized.clean);

	await sharp(poster).toFile(posterPath);
	await sharp(poster)
		.composite([{ input: line, left: 0, top: 8 }])
		.png()
		.toFile(finalPath);

	console.log(
		JSON.stringify({
			slug: person.slug,
			correction: person.correction,
			scale: Number(normalized.scale.toFixed(4)),
			cropLeft: normalized.cropLeft,
			cropTop: normalized.cropTop,
			finalPath
		})
	);
}

const pairLayers = [];
for (const person of pair) {
	const normalized = await normalize(person, 135, person.target);
	pairLayers.push({ input: await posterize(normalized.clean), left: 0, top: 0 });
}

const pairPoster = await sharp({
	create: {
		width: canvasSize,
		height: canvasSize,
		channels: 4,
		background: { r: 0, g: 0, b: 0, alpha: 0 }
	}
})
	.composite(pairLayers)
	.png()
	.toBuffer();

const pairDirectory = `${root}/pelosi-schumer-dynamic`;
await sharp(pairPoster).toFile(`${pairDirectory}/poster.png`);
await sharp(pairPoster)
	.composite([
		{ input: compactLine, left: pair[0].target.x - 166, top: pair[0].target.y - 48 },
		{ input: compactLine, left: pair[1].target.x - 166, top: pair[1].target.y - 48 }
	])
	.png()
	.toFile(`${pairDirectory}/Pelosi-Schumer-Dynamic-final.png`);
