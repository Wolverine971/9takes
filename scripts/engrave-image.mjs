#!/usr/bin/env node
// scripts/engrave-image.mjs
/**
 * Deterministic engraving experiment, inspired by banknote printing.
 * Original implementation; does not contain the referenced Figma shader's code.
 *
 * node scripts/engrave-image.mjs [source.webp] [output-directory]
 * Originals are never overwritten. Run again to regenerate the same variants.
 */
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { basename, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const input = resolve(
	process.argv[2] ?? join(root, 'static/images/home-reimagined/community-circle-neo-noir-v2.webp')
);
const destination = resolve(process.argv[3] ?? join(root, 'docs/design/texture-test'));
const stem = basename(input, extname(input));
const presets = [
	{ name: 'subtle', amount: 0.28, paper: [232, 224, 205], ink: [32, 48, 67], grain: 3.5 },
	{ name: 'engraved', amount: 0.9, paper: [237, 229, 210], ink: [32, 49, 70], grain: 4.5 }
];
const clamp = (value, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, value));
const mix = (a, b, t) => a * (1 - t) + b * t;
function smoothstep(a, b, value) {
	const t = clamp((value - a) / (b - a));
	return t * t * (3 - 2 * t);
}
function noise(x, y, seed = 1) {
	let n = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(seed, 1442695041);
	n = Math.imul(n ^ (n >>> 13), 1274126177);
	return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
}
function line(position, spacing, width) {
	const phase = ((position % spacing) + spacing) % spacing;
	const distance = Math.min(phase, spacing - phase);
	return 1 - smoothstep(width / 2 - 0.45, width / 2 + 0.45, distance);
}

const decoded = await sharp(input)
	.rotate()
	.flatten({ background: '#eee5d3' })
	.toColourspace('srgb')
	.removeAlpha()
	.raw()
	.toBuffer({ resolveWithObject: true });
const { width, height } = decoded.info;
const source = decoded.data;
const soft = await sharp(source, { raw: { width, height, channels: 3 } })
	.blur(5)
	.raw()
	.toBuffer();
const luminance = new Float32Array(width * height);
const blurredLuminance = new Float32Array(width * height);
const histogram = new Uint32Array(256);
for (let i = 0; i < luminance.length; i++) {
	const p = i * 3;
	luminance[i] = (0.2126 * source[p] + 0.7152 * source[p + 1] + 0.0722 * source[p + 2]) / 255;
	blurredLuminance[i] = (0.2126 * soft[p] + 0.7152 * soft[p + 1] + 0.0722 * soft[p + 2]) / 255;
	histogram[Math.round(luminance[i] * 255)]++;
}
// Lift this dark illustration into the tonal range of ink on paper while
// retaining its silhouettes; percentile normalization also works on other images.
function percentile(fraction) {
	let count = 0;
	for (let i = 0; i < 256; i++) {
		count += histogram[i];
		if (count >= luminance.length * fraction) return i / 255;
	}
	return 1;
}
const black = percentile(0.005);
const white = Math.max(black + 0.1, percentile(0.995));
await mkdir(destination, { recursive: true });
const outputs = [];

for (const preset of presets) {
	const output = Buffer.alloc(width * height * 3);
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const i = y * width + x;
			const p = i * 3;
			const r = source[p] / 255;
			const g = source[p + 1] / 255;
			const b = source[p + 2] / 255;
			const tone = Math.pow(clamp((luminance[i] - black) / (white - black)), 0.72);
			const shadow = 1 - tone;
			const normalizedX = (x * 1774) / width;
			const normalizedY = (y * 887) / height;
			// Bending is guided by a smoothed version of the source, so neighboring
			// lines wrap through the subject without changing its underlying geometry.
			const flow =
				12 * blurredLuminance[i] +
				27 * Math.sin(normalizedX / 83) +
				13 * Math.sin(normalizedY / 94) +
				9 * Math.sin((normalizedX + normalizedY) / 137);
			const spacing = 3.8;
			const primary = line(
				normalizedY + normalizedX * 0.2 + flow,
				spacing,
				0.25 + 2.3 * Math.pow(shadow, 1.7)
			);
			const cross = line(
				normalizedX * 0.77 - normalizedY * 0.64 + flow * 0.75,
				spacing * 1.19,
				0.35 + shadow * 0.75
			);
			const hatch = Math.max(primary, cross * smoothstep(0.35, 0.95, shadow) * 0.7);
			// A sparse pair of intersecting wave fields suggests guilloche engraving.
			const loopA = line(normalizedX + 28 * Math.sin(normalizedY / 43), 22, 0.6);
			const loopB = line(normalizedY + 23 * Math.sin(normalizedX / 53), 24, 0.6);
			const ornament = Math.max(loopA, loopB) * 0.075 * (0.4 + tone);
			const grain = (noise(x, y) - 0.5) * preset.grain;
			const fibers = (noise(Math.floor(x / 2), Math.floor(y / 9), 7) - 0.5) * 1.6;
			const wear = noise(x, y, 19) > 0.976 ? 0.12 : 0;
			const inkAmount = clamp(0.15 * shadow + hatch * 0.77 + ornament - wear * shadow);
			// Retain a warm accent plate in lamplight, skin, and rust-colored clothing.
			const warmth =
				smoothstep(0.025, 0.2, r - b) * smoothstep(0, 0.035, r - g) * smoothstep(0.12, 0.4, r);
			const accent = [185, 128, 62];
			for (let c = 0; c < 3; c++) {
				const ink = mix(preset.ink[c], accent[c], warmth * 0.8);
				const paper = mix(preset.paper[c], [238, 211, 154][c], warmth * 0.58);
				const printed =
					mix(mix(paper, ink, inkAmount), mix(ink, paper, tone), 0.12) + grain + fibers;
				output[p + c] = Math.round(clamp(mix(source[p + c], printed, preset.amount), 0, 255));
			}
		}
	}
	const outputPath = join(destination, `${stem}-${preset.name}.webp`);
	if (outputPath === input) throw new Error('Refusing to overwrite the source image.');
	const full = await sharp(output, { raw: { width, height, channels: 3 } })
		.webp({ quality: 90, effort: 6 })
		.toFile(outputPath);
	const smallPath = join(destination, `${stem}-${preset.name}-small.webp`);
	const small = await sharp(output, { raw: { width, height, channels: 3 } })
		.resize({ width: Math.min(888, width) })
		.webp({ quality: 86, effort: 6 })
		.toFile(smallPath);
	outputs.push({
		preset: preset.name,
		path: outputPath,
		width,
		height,
		bytes: full.size,
		smallPath,
		smallBytes: small.size
	});
}
await writeFile(
	join(destination, `${stem}-recipe.json`),
	JSON.stringify(
		{
			source: input,
			implementation: '9takes custom banknote-inspired filter v1',
			presets,
			outputs
		},
		null,
		2
	) + '\n'
);
console.log(JSON.stringify(outputs, null, 2));
