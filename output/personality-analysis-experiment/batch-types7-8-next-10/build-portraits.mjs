import sharp from 'sharp';

const root = 'output/personality-analysis-experiment/batch-types7-8-next-10';
const canvasSize = 1080;
const target = { x: 540, y: 490 };
const people = [
	{ slug: 'shakira', name: 'Shakira', width: 2160, height: 3840, left: [786.13, 1382.86], right: [1284.619, 1371.66], correction: 1.287, eyeDistance: 160 },
	{ slug: 'spencer-x', name: 'Spencer-X', width: 1024, height: 1536, left: [470.552, 409.382], right: [620.949, 424.412], correction: -5.707, eyeDistance: 160 },
	{ slug: 'stavros-halkias', name: 'Stavros-Halkias', width: 1024, height: 1536, left: [447.703, 527.62], right: [601.142, 522.617], correction: 1.867, eyeDistance: 160 },
	{ slug: 'steve-irwin', name: 'Steve-Irwin', width: 1023, height: 1537, left: [444.196, 524.178], right: [611.004, 526.751], correction: -0.884, eyeDistance: 160 },
	{ slug: 'tana-mongeau', name: 'Tana-Mongeau', width: 1024, height: 1536, left: [415.76, 488.523], right: [562.054, 495.472], correction: -2.719, eyeDistance: 160 },
	{ slug: 'travis-kelce', name: 'Travis-Kelce', width: 1043, height: 1508, left: [430.052, 464.824], right: [601.154, 464.626], correction: 0.066, eyeDistance: 160 },
	{ slug: 'bryce-hall', name: 'Bryce-Hall', width: 1023, height: 1537, left: [406.045, 481.311], right: [578.155, 471.502], correction: 3.262, eyeDistance: 160 },
	{ slug: 'duke-dennis', name: 'Duke-Dennis', width: 1023, height: 1537, left: [449.963, 547.999], right: [610.238, 551.751], correction: -1.341, eyeDistance: 160 },
	{ slug: 'idris-elba', name: 'Idris-Elba', width: 1024, height: 1536, left: [423.887, 453.394], right: [587.205, 450.096], correction: 1.157, eyeDistance: 160 },
	{ slug: 'jenna-marbles', name: 'Jenna-Marbles', width: 1054, height: 1492, left: [460.159, 388.264], right: [621.659, 397.884], correction: -3.409, eyeDistance: 160 }
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
			.extend({ left: padLeft, top: padTop, right: padRight, bottom: padBottom, background: { r: 0, g: 0, b: 0, alpha: 0 } })
			.png()
			.toBuffer();
	}
	return sharp(padded)
		.extract({ left: adjustedLeft, top: adjustedTop, width: canvasSize, height: canvasSize })
		.png()
		.toBuffer();
}

async function contractAlpha(input) {
	const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
	const output = Buffer.from(data);
	for (let y = 0; y < info.height; y += 1) {
		for (let x = 0; x < info.width; x += 1) {
			let alpha = 255;
			for (let dy = -1; dy <= 1; dy += 1) {
				for (let dx = -1; dx <= 1; dx += 1) {
					const nx = x + dx;
					const ny = y + dy;
					alpha = nx < 0 || nx >= info.width || ny < 0 || ny >= info.height
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
	const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
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
	const rawEyeDistance = Math.hypot(person.right[0] - person.left[0], person.right[1] - person.left[1]);
	const scale = person.eyeDistance / rawEyeDistance;
	const scaledWidth = Math.round(rotatedInfo.width * scale);
	const scaledHeight = Math.round(rotatedInfo.height * scale);
	const scaled = await sharp(rotated).resize(scaledWidth, scaledHeight, { fit: 'fill' }).png().toBuffer();
	const midpoint = { x: (person.left[0] + person.right[0]) / 2, y: (person.left[1] + person.right[1]) / 2 };
	const rotatedMidpoint = rotatePoint(midpoint, person.width, person.height, rotatedInfo.width, rotatedInfo.height, person.correction);
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
