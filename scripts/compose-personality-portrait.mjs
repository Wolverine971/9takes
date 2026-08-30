#!/usr/bin/env node
// scripts/compose-personality-portrait.mjs

import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const REPO_ROOT = path.resolve(path.dirname(SCRIPT_PATH), '..');
const CANVAS_SIZE = 1080;

function usage() {
	console.error(`Usage:
  node scripts/compose-personality-portrait.mjs <cutout.png> <output.png> [options]

Options:
  --height <px>       Trimmed subject height on the 1080px canvas (default: 1120)
  --offset-x <px>     Horizontal offset from centered placement (default: 0)
  --offset-y <px>     Subject top edge on the canvas (default: 0)
  --erode <px>        Contract the alpha edge after resizing (default: 3)
  --brightness <n>    Subject brightness multiplier (default: 1)
  --contrast <n>      Subject contrast multiplier (default: 1.08)
  --anchor-x <px>     Face-center x in the original cutout
  --anchor-y <px>     Eye-center y in the original cutout
  --target-x <px>     Face-center x on the final canvas (default: 540)
  --target-y <px>     Eye-center y on the final canvas (default: 490)
  --template <path>   Overlay PNG (default: face-line-template.png)
`);
}

function takeNumber(argv, index, flag) {
	const raw = argv[index + 1];
	const value = Number(raw);
	if (!raw || !Number.isFinite(value)) throw new Error(`${flag} requires a number`);
	return value;
}

function parseArgs(argv) {
	if (argv.length < 2) throw new Error('Missing input or output path');
	const options = {
		input: path.resolve(argv[0]),
		output: path.resolve(argv[1]),
		height: 1120,
		offsetX: 0,
		offsetY: 0,
		erode: 3,
		brightness: 1,
		contrast: 1.08,
		anchorX: null,
		anchorY: null,
		targetX: 540,
		targetY: 490,
		template: path.join(REPO_ROOT, 'face-line-template.png')
	};

	for (let index = 2; index < argv.length; index += 1) {
		const argument = argv[index];
		if (argument === '--height') {
			options.height = Math.round(takeNumber(argv, index, argument));
			index += 1;
		} else if (argument === '--offset-x') {
			options.offsetX = Math.round(takeNumber(argv, index, argument));
			index += 1;
		} else if (argument === '--offset-y') {
			options.offsetY = Math.round(takeNumber(argv, index, argument));
			index += 1;
		} else if (argument === '--erode') {
			options.erode = Math.round(takeNumber(argv, index, argument));
			index += 1;
		} else if (argument === '--brightness') {
			options.brightness = takeNumber(argv, index, argument);
			index += 1;
		} else if (argument === '--contrast') {
			options.contrast = takeNumber(argv, index, argument);
			index += 1;
		} else if (argument === '--anchor-x') {
			options.anchorX = takeNumber(argv, index, argument);
			index += 1;
		} else if (argument === '--anchor-y') {
			options.anchorY = takeNumber(argv, index, argument);
			index += 1;
		} else if (argument === '--target-x') {
			options.targetX = takeNumber(argv, index, argument);
			index += 1;
		} else if (argument === '--target-y') {
			options.targetY = takeNumber(argv, index, argument);
			index += 1;
		} else if (argument === '--template') {
			const templatePath = argv[index + 1];
			if (!templatePath) throw new Error('--template requires a path');
			options.template = path.resolve(templatePath);
			index += 1;
		} else {
			throw new Error(`Unknown option: ${argument}`);
		}
	}

	if (options.height < 100 || options.height > 2400) {
		throw new Error('--height must be between 100 and 2400');
	}
	if (options.erode < 0 || options.erode > 24) {
		throw new Error('--erode must be between 0 and 24');
	}
	if ((options.anchorX === null) !== (options.anchorY === null)) {
		throw new Error('--anchor-x and --anchor-y must be provided together');
	}
	return options;
}

function erodeAlpha(data, width, height, radius) {
	if (radius === 0) return data;
	const horizontal = new Uint8Array(width * height);
	const eroded = new Uint8Array(width * height);

	for (let y = 0; y < height; y += 1) {
		for (let x = 0; x < width; x += 1) {
			let minimum = 255;
			for (let dx = -radius; dx <= radius; dx += 1) {
				const sampleX = x + dx;
				if (sampleX < 0 || sampleX >= width) {
					minimum = 0;
					break;
				}
				minimum = Math.min(minimum, data[(y * width + sampleX) * 4 + 3]);
			}
			horizontal[y * width + x] = minimum;
		}
	}

	for (let y = 0; y < height; y += 1) {
		for (let x = 0; x < width; x += 1) {
			let minimum = 255;
			for (let dy = -radius; dy <= radius; dy += 1) {
				const sampleY = y + dy;
				if (sampleY < 0 || sampleY >= height) {
					minimum = 0;
					break;
				}
				minimum = Math.min(minimum, horizontal[sampleY * width + x]);
			}
			eroded[y * width + x] = minimum;
		}
	}

	for (let index = 0; index < eroded.length; index += 1) {
		data[index * 4 + 3] = eroded[index];
	}
	return data;
}

async function main() {
	const options = parseArgs(process.argv.slice(2));
	const { data: trimmedData, info: trimmedInfo } = await sharp(options.input)
		.ensureAlpha()
		.trim({
			background: { r: 0, g: 0, b: 0, alpha: 0 },
			threshold: 8
		})
		.png()
		.toBuffer({ resolveWithObject: true });

	const resizedWidth = Math.round((trimmedInfo.width / trimmedInfo.height) * options.height);
	const { data, info } = await sharp(trimmedData)
		.recomb([
			[0.2126, 0.7152, 0.0722],
			[0.2126, 0.7152, 0.0722],
			[0.2126, 0.7152, 0.0722]
		])
		.modulate({ brightness: options.brightness })
		.linear(options.contrast, 128 * (1 - options.contrast))
		.resize({ width: resizedWidth, height: options.height, fit: 'fill' })
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });

	const refinedData = erodeAlpha(data, info.width, info.height, options.erode);
	let left;
	let top;
	if (options.anchorX !== null && options.anchorY !== null) {
		const trimLeft = Math.max(0, -(trimmedInfo.trimOffsetLeft ?? 0));
		const trimTop = Math.max(0, -(trimmedInfo.trimOffsetTop ?? 0));
		const scaleX = info.width / trimmedInfo.width;
		const scaleY = info.height / trimmedInfo.height;
		left = Math.round(options.targetX - (options.anchorX - trimLeft) * scaleX + options.offsetX);
		top = Math.round(options.targetY - (options.anchorY - trimTop) * scaleY + options.offsetY);
	} else {
		left = Math.round((CANVAS_SIZE - info.width) / 2 + options.offsetX);
		top = options.offsetY;
	}
	const sourceLeft = Math.max(0, -left);
	const sourceTop = Math.max(0, -top);
	const compositeLeft = Math.max(0, left);
	const compositeTop = Math.max(0, top);
	const visibleWidth = Math.min(info.width - sourceLeft, CANVAS_SIZE - compositeLeft);
	const visibleHeight = Math.min(info.height - sourceTop, CANVAS_SIZE - compositeTop);
	if (visibleWidth <= 0 || visibleHeight <= 0) {
		throw new Error('Subject placement falls entirely outside the canvas');
	}
	const subject = await sharp(refinedData, {
		raw: { width: info.width, height: info.height, channels: 4 }
	})
		.extract({
			left: sourceLeft,
			top: sourceTop,
			width: visibleWidth,
			height: visibleHeight
		})
		.png()
		.toBuffer();
	await sharp({
		create: {
			width: CANVAS_SIZE,
			height: CANVAS_SIZE,
			channels: 4,
			background: { r: 0, g: 0, b: 0, alpha: 0 }
		}
	})
		.composite([
			{ input: subject, left: compositeLeft, top: compositeTop },
			{ input: options.template, left: 0, top: 0 }
		])
		.png({ compressionLevel: 9 })
		.toFile(options.output);

	console.log(`Created ${options.output} (subject ${info.width}×${info.height} at ${left},${top})`);
}

main().catch((error) => {
	console.error(`✗ ${error instanceof Error ? error.message : String(error)}`);
	usage();
	process.exitCode = 1;
});
