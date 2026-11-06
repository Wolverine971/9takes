// scripts/generate-brand-icons.mjs
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';

const root = resolve(import.meta.dirname, '..');
const brandDirectory = resolve(root, 'static/brand');
const approvedLogoPath = resolve(
	root,
	'source-assets/brand',
	'exploration/2026-07-22/mask-logo-carousel-v1/9takes-nine-face-slot-logo-v1.png'
);
// Cold Light (2026-11-05): the nine-mask mark runs through the same indigo tint ramp
// as the statue images (logo recolor "A"). Ramp is keyed on luminance; the black point
// drops the source's near-black frame onto the page background (#01010D) exactly.
const PAGE_BACKGROUND = '#01010D';
const TINT_RAMP = [
	[0, [1, 1, 13]],
	[0.3, [22, 10, 70]],
	[0.62, [99, 49, 251]],
	[0.88, [190, 170, 255]],
	[1, [236, 230, 255]]
];
const TINT_GAIN = 1.08;
const TINT_BLACK_POINT = 0.065;

function sampleRamp(t) {
	for (let i = 1; i < TINT_RAMP.length; i++) {
		const [p0, c0] = TINT_RAMP[i - 1];
		const [p1, c1] = TINT_RAMP[i];
		if (t <= p1) {
			const k = (t - p0) / (p1 - p0);
			return c0.map((v, j) => v + (c1[j] - v) * k);
		}
	}
	return TINT_RAMP.at(-1)[1];
}

async function tint(input) {
	const { data, info } = await sharp(input)
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });
	const out = Buffer.alloc(data.length);
	for (let i = 0; i < data.length; i += 4) {
		const l = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
		const t = Math.min(1, Math.max(0, (l * TINT_GAIN - TINT_BLACK_POINT) / (1 - TINT_BLACK_POINT)));
		const [r, g, b] = sampleRamp(t);
		out[i] = Math.round(r);
		out[i + 1] = Math.round(g);
		out[i + 2] = Math.round(b);
		out[i + 3] = data[i + 3];
	}
	return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
		.png()
		.toBuffer();
}

const appIconSource = await tint(await readFile(approvedLogoPath));

await sharp(appIconSource)
	.resize(512, 512, { kernel: sharp.kernel.lanczos3 })
	.png({ compressionLevel: 9, adaptiveFiltering: true })
	.toFile(resolve(brandDirectory, '9takes-nine-mask-logo.png'));

async function render(source, size, outputPath, inset = 0) {
	const innerSize = size - inset * 2;
	if (inset > 0) {
		const foreground = await sharp(source)
			.resize(innerSize, innerSize, { fit: 'fill', kernel: sharp.kernel.lanczos3 })
			.png()
			.toBuffer();

		await sharp({
			create: {
				width: size,
				height: size,
				channels: 3,
				background: PAGE_BACKGROUND
			}
		})
			.composite([{ input: foreground, left: inset, top: inset }])
			.flatten({ background: PAGE_BACKGROUND })
			.removeAlpha()
			.png({ compressionLevel: 9, adaptiveFiltering: true })
			.toFile(outputPath);
		return;
	}

	let pipeline = sharp(source).resize(innerSize, innerSize, {
		fit: 'fill',
		kernel: sharp.kernel.lanczos3
	});
	if (size <= 64) {
		pipeline = pipeline.sharpen({ sigma: 0.7 });
	}

	await pipeline
		.flatten({ background: PAGE_BACKGROUND })
		.png({ compressionLevel: 9, adaptiveFiltering: true })
		.toFile(outputPath);
}

const appIcons = [
	['9takes-nine-mask-logo-192.png', 192],
	['9takes-nine-mask-logo-512.png', 512],
	['apple-touch-icon-nine-mask.png', 180],
	['app-icon-nine-mask-192.png', 192],
	['app-icon-nine-mask-512.png', 512],
	// Maskable inset keeps all nine faces inside the 40%-radius circular safe zone.
	['app-icon-nine-mask-maskable-512.png', 512, 96],
	['android-chrome-nine-mask-192x192.png', 192],
	['android-chrome-nine-mask-512x512.png', 512],
	// Keep the standard legacy filenames current for external references that have not refreshed yet.
	['apple-touch-icon-v2.png', 180],
	['apple-touch-icon.png', 180],
	['app-icon-192.png', 192],
	['app-icon-512.png', 512],
	['app-icon-maskable-512.png', 512, 96],
	['android-chrome-192x192.png', 192],
	['android-chrome-512x512.png', 512]
];

await Promise.all(
	appIcons.map(([filename, size, inset]) =>
		render(appIconSource, size, resolve(brandDirectory, filename), inset)
	)
);

const faviconSizes = [16, 32, 48];
const faviconPngs = await Promise.all(
	faviconSizes.map(async (size) => {
		const versionedOutputPath = resolve(brandDirectory, `favicon-nine-mask-${size}x${size}.png`);
		const legacyOutputPath = resolve(brandDirectory, `favicon-${size}x${size}.png`);
		await Promise.all([
			render(appIconSource, size, versionedOutputPath),
			render(appIconSource, size, legacyOutputPath)
		]);
		return readFile(versionedOutputPath);
	})
);

function createIco(pngs, sizes) {
	const headerSize = 6;
	const entrySize = 16;
	let imageOffset = headerSize + entrySize * pngs.length;
	const header = Buffer.alloc(headerSize);
	header.writeUInt16LE(0, 0);
	header.writeUInt16LE(1, 2);
	header.writeUInt16LE(pngs.length, 4);

	const entries = pngs.map((png, index) => {
		const size = sizes[index];
		const entry = Buffer.alloc(entrySize);
		entry.writeUInt8(size === 256 ? 0 : size, 0);
		entry.writeUInt8(size === 256 ? 0 : size, 1);
		entry.writeUInt8(0, 2);
		entry.writeUInt8(0, 3);
		entry.writeUInt16LE(1, 4);
		entry.writeUInt16LE(32, 6);
		entry.writeUInt32LE(png.length, 8);
		entry.writeUInt32LE(imageOffset, 12);
		imageOffset += png.length;
		return entry;
	});

	return Buffer.concat([header, ...entries, ...pngs]);
}

const faviconIco = createIco(faviconPngs, faviconSizes);
await Promise.all([
	writeFile(resolve(root, 'static/favicon-nine-mask.ico'), faviconIco),
	writeFile(resolve(root, 'static/favicon.ico'), faviconIco)
]);

const socialLogo = await sharp(appIconSource)
	.resize(450, 450, { kernel: sharp.kernel.lanczos3 })
	.png()
	.toBuffer();
const socialCardOverlay = Buffer.from(`
	<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
		<defs>
			<radialGradient id="glow" cx="22%" cy="20%" r="90%">
				<stop offset="0" stop-color="#26135f" stop-opacity="0.8" />
				<stop offset="1" stop-color="#01010D" stop-opacity="0" />
			</radialGradient>
		</defs>
		<rect width="1200" height="630" fill="#01010D" />
		<rect width="1200" height="630" fill="url(#glow)" />
		<rect y="0" width="1200" height="10" fill="#6331FB" />
		<text x="610" y="255" fill="#F4F2FF" font-family="Inter, Arial, sans-serif" font-size="82" font-weight="800">9takes</text>
		<text x="610" y="315" fill="#88F9C0" font-family="Inter, Arial, sans-serif" font-size="21" font-weight="700" letter-spacing="5">NINE PERSPECTIVES</text>
		<text x="610" y="390" fill="#A6A0C8" font-family="Inter, Arial, sans-serif" font-size="28">One situation, 9 ways to see it.</text>
	</svg>
`);

await sharp({
	create: { width: 1200, height: 630, channels: 3, background: PAGE_BACKGROUND }
})
	.composite([
		{ input: socialCardOverlay, left: 0, top: 0 },
		{ input: socialLogo, left: 90, top: 90 }
	])
	.png({ compressionLevel: 9, adaptiveFiltering: true })
	.toFile(resolve(brandDirectory, '9takes-nine-mask-social-card.png'));

console.log(
	`Generated the canonical nine-mask logo, ${appIcons.length + faviconSizes.length * 2} icon PNGs, two favicon ICO files, and the social card.`
);
