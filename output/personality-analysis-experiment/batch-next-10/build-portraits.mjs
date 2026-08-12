// output/personality-analysis-experiment/batch-next-10/build-portraits.mjs
import sharp from 'sharp';

const root = 'output/personality-analysis-experiment/batch-next-10';
const faceLinePath = 'face-line-template.png';
const canvasSize = 1080;
const targetEyeMidpoint = { x: 540, y: 500 };
const targetEyeDistance = 176;

const people = [
	{
		slug: 'dalton-caldwell',
		name: 'Dalton-Caldwell',
		type: 3,
		width: 2000,
		height: 2000,
		left: [876.1, 655.675],
		right: [1090.47, 654.908],
		correction: 0.205
	},
	{
		slug: 'david-beckham',
		name: 'David-Beckham',
		type: 3,
		width: 900,
		height: 900,
		left: [385.119, 415.259],
		right: [528.709, 415.385],
		correction: -0.05
	},
	{
		slug: 'gal-gadot',
		name: 'Gal-Gadot',
		type: 3,
		width: 1920,
		height: 2400,
		left: [801.501, 694.931],
		right: [1029.094, 665.486],
		correction: 7.372
	},
	{
		slug: 'halle-berry',
		name: 'Halle-Berry',
		type: 3,
		width: 1000,
		height: 1500,
		left: [248.885, 705.899],
		right: [512.593, 690.979],
		correction: 2.74
	},
	{
		slug: 'jackson-wang',
		name: 'Jackson-Wang',
		type: 3,
		width: 1080,
		height: 1373,
		left: [444.254, 471.983],
		right: [636.461, 464.4],
		correction: 2.259
	},
	{
		slug: 'jared-kushner',
		name: 'Jared-Kushner',
		type: 3,
		width: 2048,
		height: 3072,
		left: [959.291, 1073.865],
		right: [1264.761, 1088.099],
		correction: -2.339
	},
	{
		slug: 'josh-richards',
		name: 'Josh-Richards',
		type: 3,
		width: 1080,
		height: 1080,
		left: [466.146, 444.201],
		right: [642.457, 420.88],
		correction: 7.535
	},
	{
		slug: 'jynxzi',
		name: 'Jynxzi',
		type: 3,
		width: 1000,
		height: 999,
		left: [434.717, 283.423],
		right: [557.041, 282.341],
		correction: 0.507
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
	return input;
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
	let contractedFramed = await contractAlpha(framed);
	if (person.slug === 'jackson-wang') {
		contractedFramed = await contractAlpha(contractedFramed);
	}
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
