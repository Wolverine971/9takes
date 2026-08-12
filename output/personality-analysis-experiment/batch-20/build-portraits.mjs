// output/personality-analysis-experiment/batch-20/build-portraits.mjs
import sharp from 'sharp';

const root = 'output/personality-analysis-experiment/batch-20';
const faceLinePath = 'face-line-template.png';
const canvasSize = 1080;
const targetEyeMidpoint = { x: 540, y: 500 };
const targetEyeDistance = 176;

const people = [
	{
		slug: 'peter-attia-v2',
		name: 'Peter-Attia',
		type: 1,
		width: 800,
		height: 1200,
		left: [342.82, 255.595],
		right: [485.712, 258.289],
		correction: -1.08,
		eyeDistance: 188
	},
	{
		slug: 'jacinda-ardern',
		name: 'Jacinda-Ardern',
		type: 2,
		width: 6100,
		height: 4068,
		left: [2701.747, 1211.193],
		right: [3250.883, 1261.584],
		correction: -5.243
	},
	{
		slug: 'madelaine-petsch',
		name: 'Madelaine-Petsch',
		type: 2,
		width: 1280,
		height: 1600,
		left: [512.723, 587.959],
		right: [777.045, 585.618],
		correction: 0.507
	},
	{
		slug: 'richard-simmons',
		name: 'Richard-Simmons',
		type: 2,
		width: 1386,
		height: 797,
		left: [591.779, 392.167],
		right: [708.278, 389.869],
		correction: 1.13
	},
	{
		slug: 'simon-sinek',
		name: 'Simon-Sinek',
		type: 2,
		width: 930,
		height: 930,
		left: [401.359, 284.397],
		right: [543.447, 276.53],
		correction: 3.169
	},
	{
		slug: 'andy-cohen',
		name: 'Andy-Cohen',
		type: 3,
		width: 3000,
		height: 3195,
		left: [1440.273, 797.714],
		right: [1680.903, 796.993],
		correction: 0.172
	},
	{
		slug: 'ava-max',
		name: 'Ava-Max',
		type: 3,
		width: 1334,
		height: 2000,
		left: [484.416, 351.725],
		right: [675.72, 289.507],
		correction: 18.016
	},
	{
		slug: 'bruno-mars',
		name: 'Bruno-Mars',
		type: 3,
		width: 1000,
		height: 1500,
		left: [387.845, 559.186],
		right: [586.755, 518.677],
		correction: 11.511
	},
	{
		slug: 'chase-infiniti',
		name: 'Chase-Infiniti',
		type: 3,
		width: 980,
		height: 1372,
		left: [395.207, 412.515],
		right: [572.42, 426.097],
		correction: -3.747
	},
	{
		slug: 'chiara-ferragni',
		name: 'Chiara-Ferragni',
		type: 3,
		width: 540,
		height: 675,
		left: [266.259, 197.268],
		right: [337.365, 195.973],
		correction: 0.546
	},
	{
		slug: 'cleopatra',
		name: 'Cleopatra',
		type: 3,
		width: 473,
		height: 1000,
		left: [163.869, 279.582],
		right: [309.23, 280.882],
		correction: -1.14
	}
];

const line = await sharp(faceLinePath)
	.resize({ width: canvasSize, height: canvasSize, fit: 'fill' })
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

async function applySubjectBounds(input, slug) {
	if (slug !== 'cleopatra') return input;
	const { data, info } = await sharp(input)
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });
	const output = Buffer.from(data);

	// The museum plinth segmentation retains a little dark floor near the
	// bottom corners. Keep the bust and centered plinth while trimming that
	// detached-looking floor texture.
	for (let y = 850; y < info.height; y += 1) {
		const halfWidth = Math.round(235 - (y - 850) * 0.15);
		const minimumX = Math.max(0, 540 - halfWidth);
		const maximumX = Math.min(info.width - 1, 540 + halfWidth);
		for (let x = 0; x < info.width; x += 1) {
			if (x < minimumX || x > maximumX) {
				output[(y * info.width + x) * 4 + 3] = 0;
			}
		}
	}

	return sharp(output, { raw: info }).png().toBuffer();
}

for (const person of people) {
	const directory = `${root}/${person.slug}`;
	const source = `${directory}/cutout.png`;
	const posterPath = `${directory}/poster.png`;
	const finalPath = `${directory}/${person.name}-final.png`;

	const { data: rotated, info: rotatedInfo } = await sharp(source)
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
	const cropLeft = Math.round(scaledMidpoint.x - targetEyeMidpoint.x);
	const cropTop = Math.round(scaledMidpoint.y - targetEyeMidpoint.y);
	const framed = await cropWithPadding(scaled, scaledWidth, scaledHeight, cropLeft, cropTop);
	const contractedFramed = await contractAlpha(framed);
	const boundedFramed = await applySubjectBounds(contractedFramed, person.slug);
	const cleanFramed = await keepLargestAlphaComponent(boundedFramed);

	const poster = await sharp(cleanFramed)
		.modulate({ brightness: 1.02, saturation: 0.2 })
		.linear(1.08, -8)
		.sharpen({ sigma: 0.6 })
		.png()
		.toBuffer();

	await sharp(poster).toFile(posterPath);
	await sharp(poster)
		.composite([{ input: line, left: 0, top: 8 }])
		.png()
		.toFile(finalPath);

	console.log(
		JSON.stringify({
			slug: person.slug,
			type: person.type,
			correction: person.correction,
			scale: Number(scale.toFixed(4)),
			cropLeft,
			cropTop,
			finalPath
		})
	);
}
