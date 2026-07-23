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
const appIconSource = await readFile(approvedLogoPath);

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
				background: '#080706'
			}
		})
			.composite([{ input: foreground, left: inset, top: inset }])
			.flatten({ background: '#080706' })
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
		.flatten({ background: '#0a0807' })
		.png({ compressionLevel: 9, adaptiveFiltering: true })
		.toFile(outputPath);
}

const appIcons = [
	['9takes-nine-mask-logo-192.png', 192],
	['9takes-nine-mask-logo-512.png', 512],
	['apple-touch-icon-nine-mask.png', 180],
	['app-icon-nine-mask-192.png', 192],
	['app-icon-nine-mask-512.png', 512],
	['app-icon-nine-mask-maskable-512.png', 512, 51],
	['android-chrome-nine-mask-192x192.png', 192],
	['android-chrome-nine-mask-512x512.png', 512],
	// Keep the standard legacy filenames current for external references that have not refreshed yet.
	['apple-touch-icon-v2.png', 180],
	['apple-touch-icon.png', 180],
	['app-icon-192.png', 192],
	['app-icon-512.png', 512],
	['app-icon-maskable-512.png', 512, 51],
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
				<stop offset="0" stop-color="#3a2412" stop-opacity="0.8" />
				<stop offset="1" stop-color="#0a0807" stop-opacity="0" />
			</radialGradient>
		</defs>
		<rect width="1200" height="630" fill="#0a0807" />
		<rect width="1200" height="630" fill="url(#glow)" />
		<rect y="0" width="1200" height="10" fill="#f59e0b" />
		<text x="610" y="255" fill="#faf8f4" font-family="Inter, Arial, sans-serif" font-size="82" font-weight="800">9takes</text>
		<text x="610" y="315" fill="#f59e0b" font-family="Inter, Arial, sans-serif" font-size="21" font-weight="700" letter-spacing="5">NINE PERSPECTIVES</text>
		<text x="610" y="390" fill="#a8a095" font-family="Inter, Arial, sans-serif" font-size="28">One situation, 9 ways to see it.</text>
	</svg>
`);

await sharp({
	create: { width: 1200, height: 630, channels: 3, background: '#0a0807' }
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
