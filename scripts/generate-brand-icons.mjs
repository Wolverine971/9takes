import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';

const root = resolve(import.meta.dirname, '..');
const brandDirectory = resolve(root, 'static/brand');
const appIconSource = await readFile(resolve(brandDirectory, '9takes-nine-bubble-app-icon-v3.png'));

async function render(source, size, outputPath, inset = 0) {
	const innerSize = size - inset * 2;
	if (inset > 0) {
		const mask = Buffer.from(`
			<svg xmlns="http://www.w3.org/2000/svg" width="${innerSize}" height="${innerSize}">
				<defs>
					<radialGradient id="fade" cx="50%" cy="50%" r="50%">
						<stop offset="82%" stop-color="white" />
						<stop offset="100%" stop-color="white" stop-opacity="0" />
					</radialGradient>
				</defs>
				<rect width="100%" height="100%" fill="url(#fade)" />
			</svg>
		`);
		const foreground = await sharp(source)
			.resize(innerSize, innerSize, { fit: 'fill', kernel: sharp.kernel.lanczos3 })
			.ensureAlpha()
			.composite([{ input: mask, blend: 'dest-in' }])
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
		const outputPath = resolve(brandDirectory, `favicon-${size}x${size}.png`);
		await render(appIconSource, size, outputPath);
		return readFile(outputPath);
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

await writeFile(resolve(root, 'static/favicon.ico'), createIco(faviconPngs, faviconSizes));

console.log(`Generated ${appIcons.length + faviconSizes.length} brand icon PNGs and favicon.ico.`);
