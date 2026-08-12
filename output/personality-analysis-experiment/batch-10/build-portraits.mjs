// output/personality-analysis-experiment/batch-10/build-portraits.mjs
import sharp from 'sharp';

const root = 'output/personality-analysis-experiment/batch-10';
const faceLinePath = 'face-line-template.png';
const canvasSize = 1080;
const targetEyeMidpoint = { x: 540, y: 500 };
const targetEyeDistance = 176;

const people = [
	{
		slug: 'ben-shapiro',
		name: 'Ben-Shapiro',
		type: 1,
		width: 1689,
		height: 2471,
		left: [619.315, 955.627],
		right: [1067.867, 938.972],
		correction: 2.126
	},
	{
		slug: 'caitlin-clark',
		name: 'Caitlin-Clark',
		type: 1,
		width: 1040,
		height: 760,
		left: [468.883, 229.391],
		right: [577.053, 230.041],
		correction: -0.344
	},
	{
		slug: 'james-clear',
		name: 'James-Clear',
		type: 1,
		width: 1400,
		height: 1400,
		left: [648.861, 529.51],
		right: [815.857, 565.688],
		correction: -12.224
	},
	{
		slug: 'judge-judy',
		name: 'Judge-Judy',
		type: 1,
		width: 675,
		height: 675,
		left: [296.075, 160.613],
		right: [365.755, 158.221],
		correction: 1.966
	},
	{
		slug: 'lea-michele',
		name: 'Lea-Michele',
		type: 1,
		width: 4024,
		height: 6048,
		left: [1461.98, 2027.025],
		right: [2230.784, 2073.055],
		correction: -3.426
	},
	{
		slug: 'mahatma-gandhi',
		name: 'Mahatma-Gandhi',
		type: 1,
		width: 2620,
		height: 3270,
		left: [1300.115, 528.796],
		right: [1583.766, 539.383],
		correction: -1.13
	},
	{
		slug: 'martha-stewart',
		name: 'Martha-Stewart',
		type: 1,
		width: 400,
		height: 400,
		left: [172.076, 103.15],
		right: [222.016, 113.995],
		correction: -12.252
	},
	{
		slug: 'peter-attia',
		name: 'Peter-Attia',
		type: 1,
		width: 1000,
		height: 1000,
		left: [401.373, 397.19],
		right: [619.355, 404.216],
		correction: -1.846
	},
	{
		slug: 'audrey-hepburn',
		name: 'Audrey-Hepburn',
		type: 2,
		width: 819,
		height: 1024,
		left: [306.97, 400.561],
		right: [463.464, 402.054],
		correction: 0.507
	},
	{
		slug: 'brene-brown',
		name: 'Brene-Brown',
		type: 2,
		width: 1500,
		height: 1875,
		left: [617.217, 567.272],
		right: [781.117, 561.368],
		correction: 2.063
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
	if (slug !== 'audrey-hepburn') return input;
	const { data, info } = await sharp(input)
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });
	const output = Buffer.from(data);

	// The textured backdrop touches the left edge of Audrey's hair in the
	// source. Remove only the area left of the actual upper-hair silhouette.
	for (let y = 0; y <= 400; y += 1) {
		const hairBoundary = Math.max(330, Math.round(534 - 0.6 * y));
		for (let x = 0; x < hairBoundary; x += 1) {
			output[(y * info.width + x) * 4 + 3] = 0;
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
	const scale = targetEyeDistance / rawEyeDistance;
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
