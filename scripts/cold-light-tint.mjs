// scripts/cold-light-tint.mjs
// Apply the Cold Light tint ramp (docs/brand/cold-light.md, "The tint ramp") to an existing image.
// Greyscale (Rec.709 luminance) → optional auto-levels → 256-entry ramp LUT, using sharp raw buffers.
// Keeps dimensions, alpha and output format (by extension). No API calls, no image generation.
//
// Usage:
//   node scripts/cold-light-tint.mjs <in> <out> [--levels auto|off] [--cap source|off] [--thumb-width 480] [--max-width n]
//   node scripts/cold-light-tint.mjs --manifest <files.json> --out-dir <dir> [--levels auto|off]
//     files.json: ["static/blogs/foo.webp", ...] or [{ "in": "...", "out": "name.webp" }, ...]
//     (a bare string keeps the original basename in --out-dir)
//
// Quality: webp q82, or q72 when the output name starts with "s-" (matches blog-image-variants.mjs).
// jpg q82 (mozjpeg); png lossless.
//
// Byte cap (default --cap source): the tinted image is saturated in every pixel, which costs more
// chroma bits than the original, and many originals were saved below q82. To stay inside the
// runtimeAssetBytes build budget (scripts/build-budgets.json), lossy outputs step quality down by 4
// until they are no larger than the source file, flooring at q62 (full) / q56 (s- thumbs). If even
// the floor is larger, the floor is kept and the overage is reported. Pass --cap off to disable.
//
// Sizes: dimensions are kept, except that "s-" thumbnails wider than 480px are resized to 480 wide
// (the blog-image-variants.mjs convention; many legacy s- files are full resolution at very low
// quality and balloon when tinted). --max-width <n> optionally caps full-size outputs too
// (blog-image-variants.mjs uses 1200). Pass --thumb-width 0 to keep thumbnail dimensions.
//
// Levels (default auto): the ramp parks the bottom 30% of luminance in near-black indigo, so dim
// statue photos lose their shadow detail. "auto" clips the darkest/brightest 0.5% of the image
// (stretch capped at lo<=40, hi>=200 so full-range images barely move) and applies gamma 0.85
// to lift midtones before the LUT. Same parameters for every image; see scripts/lib/coldLightRamp.mjs.
// Pass --levels off for the literal ramp.

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { autoLevels, buildLevelsLut, buildRampLut } from './lib/coldLightRamp.mjs';

const RAMP = buildRampLut();

/** Tint one file. Returns { width, height, inBytes, outBytes, levels }. */
export async function tintFile(
	input,
	output,
	{ levels = 'auto', cap = 'source', thumbWidth = 480, maxWidth = 0 } = {}
) {
	const { data, info } = await sharp(input).raw().toBuffer({ resolveWithObject: true });
	const { width, height, channels } = info;
	const hasAlpha = channels === 2 || channels === 4;
	const colorChannels = hasAlpha ? channels - 1 : channels;
	const px = width * height;

	const grey = new Uint8Array(px);
	const hist = new Array(256).fill(0);
	for (let i = 0; i < px; i++) {
		const o = i * channels;
		const y =
			colorChannels >= 3 ? 0.2126 * data[o] + 0.7152 * data[o + 1] + 0.0722 * data[o + 2] : data[o];
		const g = Math.round(y);
		grey[i] = g;
		if (!hasAlpha || data[o + channels - 1] > 0) hist[g]++;
	}

	const lv = levels === 'off' ? { lo: 0, hi: 255, gamma: 1 } : autoLevels(hist);
	const levelLut = buildLevelsLut(lv);

	const outChannels = hasAlpha ? 4 : 3;
	const out = Buffer.alloc(px * outChannels);
	for (let i = 0; i < px; i++) {
		const v = levelLut[grey[i]] * 3;
		const o = i * outChannels;
		out[o] = RAMP[v];
		out[o + 1] = RAMP[v + 1];
		out[o + 2] = RAMP[v + 2];
		if (hasAlpha) out[o + 3] = data[i * channels + channels - 1];
	}

	fs.mkdirSync(path.dirname(output), { recursive: true });
	const ext = path.extname(output).toLowerCase();
	const thumb = path.basename(output).startsWith('s-');
	const inBytes = fs.statSync(input).size;
	const limit = thumb ? thumbWidth : maxWidth;
	const resizeTo = limit > 0 && width > limit ? limit : 0;
	const encode = (q) => {
		let img = sharp(out, { raw: { width, height, channels: outChannels } });
		if (resizeTo) img = img.resize({ width: resizeTo });
		if (ext === '.webp') return img.webp({ quality: q, effort: 6 }).toBuffer();
		if (ext === '.png') return img.png({ compressionLevel: 9 }).toBuffer();
		if (ext === '.jpg' || ext === '.jpeg')
			return img.jpeg({ quality: q, mozjpeg: true }).toBuffer();
		if (ext === '.avif') return img.avif({ quality: q - 22 }).toBuffer();
		throw new Error(`Unsupported output format: ${ext}`);
	};
	const start = thumb ? 72 : 82;
	const floor = thumb ? 56 : 62;
	let quality = start;
	let buf = await encode(quality);
	if (cap !== 'off' && ext !== '.png') {
		while (buf.length > inBytes && quality - 4 >= floor) {
			quality -= 4;
			buf = await encode(quality);
		}
	}
	fs.writeFileSync(output, buf);

	return {
		width: resizeTo || width,
		height: resizeTo ? Math.round((height * resizeTo) / width) : height,
		inBytes,
		outBytes: buf.length,
		quality,
		levels: lv
	};
}

function arg(name) {
	const i = process.argv.indexOf(name);
	return i === -1 ? undefined : process.argv[i + 1];
}

async function main() {
	const levels = arg('--levels') ?? 'auto';
	const cap = arg('--cap') ?? 'source';
	const thumbWidth = Number(arg('--thumb-width') ?? 480);
	const maxWidth = Number(arg('--max-width') ?? 0);
	const manifest = arg('--manifest');
	if (manifest) {
		const outDir = arg('--out-dir');
		if (!outDir) throw new Error('--manifest needs --out-dir');
		const entries = JSON.parse(fs.readFileSync(manifest, 'utf8'));
		let inTotal = 0;
		let outTotal = 0;
		for (const e of entries) {
			const input = typeof e === 'string' ? e : e.in;
			const name = typeof e === 'string' ? path.basename(e) : (e.out ?? path.basename(e.in));
			const r = await tintFile(input, path.join(outDir, name), {
				levels,
				cap,
				thumbWidth,
				maxWidth
			});
			inTotal += r.inBytes;
			outTotal += r.outBytes;
			console.log(
				`[tint] ${name} ${r.width}x${r.height} q${r.quality} ${r.inBytes}→${r.outBytes}B`
			);
		}
		console.log(
			`[tint] ${entries.length} files, ${inTotal}B → ${outTotal}B (Δ ${outTotal - inTotal}B)`
		);
		return;
	}
	const [input, output] = process.argv
		.slice(2)
		.filter((a, i, all) => !a.startsWith('--') && !all[i - 1]?.startsWith('--'));
	if (!input || !output) {
		console.error(
			'Usage: node scripts/cold-light-tint.mjs <in> <out> [--levels auto|off] [--cap source|off] [--thumb-width 480] [--max-width n]'
		);
		console.error('       node scripts/cold-light-tint.mjs --manifest <json> --out-dir <dir>');
		process.exit(1);
	}
	const r = await tintFile(input, output, { levels, cap, thumbWidth, maxWidth });
	console.log(
		`[tint] ${output} ${r.width}x${r.height} q${r.quality} ${r.inBytes}→${r.outBytes}B levels=${JSON.stringify(r.levels)}`
	);
}

if (import.meta.url === `file://${process.argv[1]}`) {
	main().catch((err) => {
		console.error(err.message);
		process.exit(1);
	});
}
