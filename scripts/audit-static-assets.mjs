// scripts/audit-static-assets.mjs
import { createHash } from 'node:crypto';
import { createReadStream, existsSync } from 'node:fs';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const KIB = 1024;
const MIB = KIB * KIB;
const ROOT = process.cwd();
const STATIC_DIR = path.join(ROOT, 'static');
const SOURCE_ASSET_DIR = path.join(ROOT, 'source-assets');
const ASSET_POLICY_PATH = path.join(ROOT, 'scripts', 'static-asset-policy.json');
const VERCEL_CONFIG_PATH = path.join(ROOT, 'vercel.json');
const SOURCE_DIRS = ['src', 'scripts'];
const RASTER_EXTENSIONS = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.webp']);
const TEXT_EXTENSIONS = new Set([
	'.css',
	'.html',
	'.js',
	'.json',
	'.md',
	'.mdx',
	'.mjs',
	'.scss',
	'.svelte',
	'.ts'
]);

function formatBytes(bytes) {
	if (bytes >= MIB) return `${(bytes / MIB).toFixed(2)} MiB`;
	if (bytes >= KIB) return `${(bytes / KIB).toFixed(1)} KiB`;
	return `${bytes} B`;
}

async function walkFiles(root) {
	const files = [];
	const directories = [root];

	while (directories.length > 0) {
		const directory = directories.pop();
		for (const entry of await readdir(directory, { withFileTypes: true })) {
			const entryPath = path.join(directory, entry.name);
			if (entry.isDirectory()) directories.push(entryPath);
			else if (entry.isFile()) files.push(entryPath);
		}
	}

	return files;
}

function addMetric(map, key, bytes) {
	const current = map.get(key) ?? { count: 0, bytes: 0 };
	current.count += 1;
	current.bytes += bytes;
	map.set(key, current);
}

function topLevel(relativePath) {
	return relativePath.split(path.sep)[1] ?? '(root)';
}

function hashFile(file) {
	return new Promise((resolve, reject) => {
		const hash = createHash('sha256');
		const stream = createReadStream(file);
		stream.on('data', (chunk) => hash.update(chunk));
		stream.on('error', reject);
		stream.on('end', () => resolve(hash.digest('hex')));
	});
}

async function readSourceSignals() {
	const directAssetPaths = new Set();
	const blogPicStems = new Set();
	const sourceFiles = [];

	for (const sourceDir of SOURCE_DIRS) {
		const absoluteDir = path.join(ROOT, sourceDir);
		for (const file of await walkFiles(absoluteDir)) {
			const isTestFile = /\.(?:spec|test)\.[^.]+$/i.test(file);
			if (
				TEXT_EXTENSIONS.has(path.extname(file).toLowerCase()) &&
				!isTestFile &&
				file !== ASSET_POLICY_PATH
			) {
				sourceFiles.push(file);
			}
		}
	}

	for (const file of sourceFiles) {
		const text = await readFile(file, 'utf8');
		for (const match of text.matchAll(/\/(?:blogs|books|brand|icons|types)\/[^"'`\s)\]}>?,]+/g)) {
			directAssetPaths.add(match[0].split(/[?#]/, 1)[0]);
		}

		if (file.endsWith('.md') || file.endsWith('.mdx')) {
			for (const match of text.matchAll(/^\s*pic:\s*['"]?([^'"\s#]+)['"]?/gm)) {
				blogPicStems.add(match[1]);
			}
		}
	}

	return { directAssetPaths, blogPicStems, sourceFileCount: sourceFiles.length };
}

function printMetricTable(title, metrics) {
	console.log(`\n${title}`);
	for (const [key, value] of [...metrics.entries()].sort((a, b) => b[1].bytes - a[1].bytes)) {
		console.log(
			`${key.padEnd(16)} ${String(value.count).padStart(5)}  ${formatBytes(value.bytes)}`
		);
	}
}

const staticFiles = await walkFiles(STATIC_DIR);
const sourceAssetFiles = existsSync(SOURCE_ASSET_DIR) ? await walkFiles(SOURCE_ASSET_DIR) : [];
const assetPolicy = JSON.parse(await readFile(ASSET_POLICY_PATH, 'utf8'));
const vercelConfig = JSON.parse(await readFile(VERCEL_CONFIG_PATH, 'utf8'));
const { directAssetPaths, blogPicStems, sourceFileCount } = await readSourceSignals();
const rows = [];
const byDirectory = new Map();
const byExtension = new Map();

for (const file of staticFiles) {
	const stats = await stat(file);
	const relativePath = path.relative(ROOT, file);
	const extension = path.extname(file).toLowerCase() || '(none)';
	const row = { file, relativePath, bytes: stats.size, extension };

	addMetric(byDirectory, topLevel(relativePath), stats.size);
	addMetric(byExtension, extension, stats.size);

	if (RASTER_EXTENSIONS.has(extension)) {
		try {
			const metadata = await sharp(file, { animated: false }).metadata();
			row.width = metadata.width ?? null;
			row.height = metadata.height ?? null;
			row.format = metadata.format ?? null;
			row.alpha = metadata.hasAlpha ?? false;
		} catch (error) {
			row.metadataError = error instanceof Error ? error.message : String(error);
		}
	}

	rows.push(row);
}

const fileSet = new Set(rows.map((row) => row.relativePath));
const largeAssetThreshold = assetPolicy.largeAssetThresholdBytes;
const reviewedLargeAssets = new Map(
	assetPolicy.reviewedLargeAssets.map((entry) => [entry.path, entry])
);
const largeAssetRows = rows.filter((row) => row.bytes > largeAssetThreshold);
const unreviewedLargeAssets = largeAssetRows.filter(
	(row) => !reviewedLargeAssets.has(row.relativePath)
);
const staleLargeAssetReviews = [...reviewedLargeAssets.keys()].filter((reviewedPath) => {
	const row = rows.find((candidate) => candidate.relativePath === reviewedPath);
	return !row || row.bytes <= largeAssetThreshold;
});
const blogRows = rows.filter((row) =>
	row.relativePath.startsWith(`static${path.sep}blogs${path.sep}`)
);
const portraitRows = rows.filter((row) =>
	row.relativePath.startsWith(`static${path.sep}types${path.sep}`)
);
const archivedBlogMasters = [];
let archivedSourceBytes = 0;
for (const file of sourceAssetFiles) {
	archivedSourceBytes += (await stat(file)).size;
	if (!file.startsWith(path.join(SOURCE_ASSET_DIR, 'blogs') + path.sep)) continue;
	if (path.extname(file).toLowerCase() !== '.png') continue;

	const stats = await stat(file);
	const name = path.basename(file);
	const deliveryPath = path.join(STATIC_DIR, 'blogs', name.replace(/\.png$/i, '.webp'));
	archivedBlogMasters.push({
		file,
		name,
		bytes: stats.size,
		deliveryPath,
		hasDelivery: existsSync(deliveryPath),
		directlyReferenced: directAssetPaths.has(`/blogs/${name}`)
	});
}
const pairedBlogMasters = blogRows.filter((row) => {
	if (row.extension !== '.png') return false;
	const webpPath = row.relativePath.replace(/\.png$/i, '.webp');
	return fileSet.has(webpPath);
});
const referencedPngMasters = pairedBlogMasters.filter((row) => {
	const url = `/${row.relativePath.slice('static/'.length).split(path.sep).join('/')}`;
	return directAssetPaths.has(url);
});
const sourceOnlyBlogMasters = pairedBlogMasters.filter(
	(row) => !referencedPngMasters.includes(row)
);
const sourceOnlyBlogMasterBytes = sourceOnlyBlogMasters.reduce(
	(total, row) => total + row.bytes,
	0
);
const fullBlogWebps = blogRows.filter(
	(row) => row.extension === '.webp' && !path.basename(row.relativePath).startsWith('s-')
);
const thumbBlogWebps = blogRows.filter(
	(row) => row.extension === '.webp' && path.basename(row.relativePath).startsWith('s-')
);
const fullPortraits = portraitRows.filter(
	(row) => row.extension === '.webp' && !path.basename(row.relativePath).startsWith('s-')
);
const portraitThumbs = portraitRows.filter(
	(row) => row.extension === '.webp' && path.basename(row.relativePath).startsWith('s-')
);

console.log('9takes static asset audit (read-only)');
console.log(`Files: ${rows.length}`);
console.log(`Source files scanned for direct references: ${sourceFileCount}`);
console.log(`Frontmatter blog pic stems: ${blogPicStems.size}`);
console.log(`Direct static asset paths found in source: ${directAssetPaths.size}`);
console.log(
	`Archived source assets: ${sourceAssetFiles.length} (${formatBytes(archivedSourceBytes)})`
);
printMetricTable('By top-level path', byDirectory);
printMetricTable('By extension', byExtension);

console.log('\nVariant inventory');
console.log(
	`Blog PNG masters with same-stem WebP: ${pairedBlogMasters.length} (${formatBytes(pairedBlogMasters.reduce((total, row) => total + row.bytes, 0))})`
);
console.log(
	`  Directly referenced PNG masters: ${referencedPngMasters.length} (${formatBytes(referencedPngMasters.reduce((total, row) => total + row.bytes, 0))})`
);
console.log(
	`  Source-only candidates (no direct PNG path): ${sourceOnlyBlogMasters.length} (${formatBytes(sourceOnlyBlogMasterBytes)})`
);
console.log(
	`Archived blog PNG masters outside static: ${archivedBlogMasters.length} (${formatBytes(archivedBlogMasters.reduce((total, row) => total + row.bytes, 0))})`
);
console.log(
	`  Missing same-stem WebP delivery files: ${archivedBlogMasters.filter((row) => !row.hasDelivery).length}`
);
console.log(
	`  Direct legacy PNG references in source: ${archivedBlogMasters.filter((row) => row.directlyReferenced).length}`
);
console.log(
	`Blog full WebP delivery files: ${fullBlogWebps.length} (${formatBytes(fullBlogWebps.reduce((total, row) => total + row.bytes, 0))})`
);
console.log(
	`Blog thumbnail WebP delivery files: ${thumbBlogWebps.length} (${formatBytes(thumbBlogWebps.reduce((total, row) => total + row.bytes, 0))})`
);
console.log(
	`Famous-person full portraits: ${fullPortraits.length} (${formatBytes(fullPortraits.reduce((total, row) => total + row.bytes, 0))})`
);
console.log(
	`Famous-person portrait thumbnails: ${portraitThumbs.length} (${formatBytes(portraitThumbs.reduce((total, row) => total + row.bytes, 0))})`
);

console.log(`\nReviewed public assets over ${formatBytes(largeAssetThreshold)}`);
for (const row of largeAssetRows.sort((a, b) => b.bytes - a.bytes)) {
	const review = reviewedLargeAssets.get(row.relativePath);
	console.log(
		`${formatBytes(row.bytes).padStart(10)}  ${(review?.classification ?? 'UNREVIEWED').padEnd(30)}  ${row.relativePath}`
	);
}

const redirectMap = new Map((vercelConfig.redirects ?? []).map((entry) => [entry.source, entry]));
const archivedDeliveryResults = [];
for (const entry of assetPolicy.archivedDeliveryPairs) {
	const sourcePath = path.join(ROOT, entry.sourcePath);
	const deliveryPath = path.join(ROOT, entry.deliveryPath);
	const legacyStaticPath = path.join(STATIC_DIR, entry.legacyUrl.slice(1));
	const redirect = redirectMap.get(entry.legacyUrl);
	const actualHash = existsSync(sourcePath) ? await hashFile(sourcePath) : null;
	archivedDeliveryResults.push({
		...entry,
		sourceExists: existsSync(sourcePath),
		deliveryExists: existsSync(deliveryPath),
		legacyStaticExists: existsSync(legacyStaticPath),
		hashMatches: actualHash === entry.sha256,
		redirectMatches:
			redirect?.destination === `/${entry.deliveryPath.slice('static/'.length)}` &&
			redirect?.permanent === true,
		directlyReferenced: directAssetPaths.has(entry.legacyUrl)
	});
}

console.log('\nArchived delivery-pair integrity');
for (const result of archivedDeliveryResults) {
	const passed =
		result.sourceExists &&
		result.deliveryExists &&
		!result.legacyStaticExists &&
		result.hashMatches &&
		result.redirectMatches &&
		!result.directlyReferenced;
	console.log(`${passed ? '✓' : '✗'} ${result.sourcePath} -> ${result.deliveryPath}`);
}

console.log('\nLargest raster assets');
for (const row of rows
	.filter((candidate) => RASTER_EXTENSIONS.has(candidate.extension))
	.sort((a, b) => b.bytes - a.bytes)
	.slice(0, 30)) {
	const dimensions = row.width && row.height ? `${row.width}x${row.height}` : 'unknown';
	console.log(
		`${formatBytes(row.bytes).padStart(10)}  ${dimensions.padStart(11)}  ${row.relativePath}`
	);
}

console.log('\nLargest famous-person portraits');
for (const row of fullPortraits.sort((a, b) => b.bytes - a.bytes).slice(0, 20)) {
	const dimensions = row.width && row.height ? `${row.width}x${row.height}` : 'unknown';
	console.log(
		`${formatBytes(row.bytes).padStart(10)}  ${dimensions.padStart(11)}  ${row.relativePath}`
	);
}

const hashes = new Map();
for (const row of rows) {
	if (row.bytes === 0) continue;
	const key = `${row.bytes}:${await hashFile(row.file)}`;
	const matches = hashes.get(key) ?? [];
	matches.push(row);
	hashes.set(key, matches);
}
const duplicateGroups = [...hashes.values()]
	.filter((matches) => matches.length > 1)
	.sort((a, b) => b[0].bytes * (b.length - 1) - a[0].bytes * (a.length - 1));
const duplicateWaste = duplicateGroups.reduce(
	(total, matches) => total + matches[0].bytes * (matches.length - 1),
	0
);

console.log(
	`\nExact duplicate groups: ${duplicateGroups.length} (${formatBytes(duplicateWaste)} redundant)`
);
for (const matches of duplicateGroups.slice(0, 20)) {
	console.log(`${formatBytes(matches[0].bytes)} x${matches.length}`);
	for (const row of matches) console.log(`  ${row.relativePath}`);
}

const previewSvgPath = path.join(SOURCE_ASSET_DIR, 'brand', '9takes-preview.svg');
if (existsSync(previewSvgPath)) {
	const previewStats = await stat(previewSvgPath);
	const previewText = await readFile(previewSvgPath, 'utf8');
	const embeddedImages = [...previewText.matchAll(/data:image\/[^;]+;base64,/g)].length;
	const imageElements = [...previewText.matchAll(/<image\b/g)].length;
	console.log('\nArchived preview SVG');
	console.log(`Size: ${formatBytes(previewStats.size)}`);
	console.log(`Embedded base64 images: ${embeddedImages}`);
	console.log(`Image elements: ${imageElements}`);
}

console.log('\nAssessment guardrail');
console.log('This script does not delete, move, resize, or recompress any asset.');

const missingArchivedDeliveries = archivedBlogMasters.filter((row) => !row.hasDelivery);
if (missingArchivedDeliveries.length > 0) {
	console.error('\nArchived source masters missing same-stem WebP delivery files:');
	for (const row of missingArchivedDeliveries) console.error(`- ${row.name}`);
	process.exitCode = 1;
}

if (unreviewedLargeAssets.length > 0) {
	console.error('\nUnreviewed public assets exceed the large-asset threshold:');
	for (const row of unreviewedLargeAssets) console.error(`- ${row.relativePath}`);
	process.exitCode = 1;
}

if (staleLargeAssetReviews.length > 0) {
	console.error('\nLarge-asset policy entries are missing or no longer exceed the threshold:');
	for (const reviewedPath of staleLargeAssetReviews) console.error(`- ${reviewedPath}`);
	process.exitCode = 1;
}

const invalidArchivedDeliveries = archivedDeliveryResults.filter(
	(result) =>
		!result.sourceExists ||
		!result.deliveryExists ||
		result.legacyStaticExists ||
		!result.hashMatches ||
		!result.redirectMatches ||
		result.directlyReferenced
);
if (invalidArchivedDeliveries.length > 0) {
	console.error('\nArchived delivery-pair policy failed:');
	for (const result of invalidArchivedDeliveries) console.error(`- ${result.sourcePath}`);
	process.exitCode = 1;
}
