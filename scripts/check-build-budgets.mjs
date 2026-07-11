// scripts/check-build-budgets.mjs
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const MIB = 1024 * 1024;
const ROOT = process.cwd();
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_DIR = path.join(ROOT, '.svelte-kit', 'output', 'client');
const STATIC_DIR = path.join(ROOT, 'static');
const MANIFEST_PATH = path.join(CLIENT_DIR, '.vite', 'manifest.json');
const BUDGET_PATH = path.join(SCRIPT_DIR, 'build-budgets.json');
const ASSET_POLICY_PATH = path.join(SCRIPT_DIR, 'static-asset-policy.json');
const RUNTIME_ASSET_EXTENSIONS = new Set([
	'.avif',
	'.gif',
	'.jpeg',
	'.jpg',
	'.mp4',
	'.otf',
	'.pdf',
	'.png',
	'.svg',
	'.ttf',
	'.webm',
	'.webp',
	'.woff',
	'.woff2'
]);

if (!existsSync(MANIFEST_PATH)) {
	console.error(
		`Build budget check requires ${path.relative(ROOT, MANIFEST_PATH)}. Run pnpm build first.`
	);
	process.exit(1);
}

function walkFiles(root) {
	const files = [];
	const directories = [root];

	while (directories.length > 0) {
		const directory = directories.pop();
		for (const entry of readdirSync(directory, { withFileTypes: true })) {
			const entryPath = path.join(directory, entry.name);
			if (entry.isDirectory()) directories.push(entryPath);
			else if (entry.isFile()) files.push(entryPath);
		}
	}

	return files;
}

function bytesIn(files) {
	return files.reduce((total, file) => total + statSync(file).size, 0);
}

function formatBytes(bytes) {
	if (bytes >= MIB) return `${(bytes / MIB).toFixed(2)} MiB`;
	if (bytes >= 1024) return `${(bytes / 1024).toFixed(2)} KiB`;
	return `${bytes} B`;
}

function findGlobalCss(manifest) {
	const rootNode = Object.entries(manifest).find(([key]) =>
		key.endsWith('/generated/client-optimized/nodes/0.js')
	);

	if (!rootNode) {
		throw new Error(
			`Could not find the root layout entry in ${path.relative(ROOT, MANIFEST_PATH)}`
		);
	}

	const cssFiles = rootNode[1].css ?? [];
	if (cssFiles.length === 0) {
		throw new Error('The root layout entry does not declare any CSS assets');
	}

	return cssFiles
		.map((relativePath) => {
			const absolutePath = path.join(CLIENT_DIR, relativePath);
			return { path: relativePath, bytes: statSync(absolutePath).size };
		})
		.sort((a, b) => b.bytes - a.bytes)[0];
}

const budgets = JSON.parse(readFileSync(BUDGET_PATH, 'utf8'));
const assetPolicy = JSON.parse(readFileSync(ASSET_POLICY_PATH, 'utf8'));
const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
const clientFiles = walkFiles(CLIENT_DIR);
const runtimeAssets = walkFiles(STATIC_DIR).filter((file) =>
	RUNTIME_ASSET_EXTENSIONS.has(path.extname(file).toLowerCase())
);
const globalCss = findGlobalCss(manifest);
const runtimeAssetRows = runtimeAssets
	.map((file) => ({ path: path.relative(ROOT, file), bytes: statSync(file).size }))
	.sort((a, b) => b.bytes - a.bytes);
const portraitAssetRows = runtimeAssetRows.filter((asset) =>
	asset.path.startsWith(`static${path.sep}types${path.sep}`)
);
const blogPngMastersInStatic = runtimeAssets.filter((file) => {
	if (!file.startsWith(path.join(STATIC_DIR, 'blogs') + path.sep)) return false;
	if (path.extname(file).toLowerCase() !== '.png') return false;
	return existsSync(file.replace(/\.png$/i, '.webp'));
}).length;

const metrics = {
	globalCssBytes: globalCss.bytes,
	clientOutputBytes: bytesIn(clientFiles),
	runtimeAssetBytes: runtimeAssetRows.reduce((total, asset) => total + asset.bytes, 0),
	runtimeAssetsOver1MiB: runtimeAssetRows.filter((asset) => asset.bytes > MIB).length,
	runtimeAssetsOver5MiB: runtimeAssetRows.filter((asset) => asset.bytes > 5 * MIB).length,
	largestRuntimeAssetBytes: runtimeAssetRows[0]?.bytes ?? 0,
	portraitAssetBytes: portraitAssetRows.reduce((total, asset) => total + asset.bytes, 0),
	portraitAssetFiles: portraitAssetRows.length,
	blogPngMastersInStatic
};

const labels = {
	globalCssBytes: 'Root/global CSS',
	clientOutputBytes: 'Client deploy output',
	runtimeAssetBytes: 'Runtime media/fonts',
	runtimeAssetsOver1MiB: 'Runtime assets over 1 MiB',
	runtimeAssetsOver5MiB: 'Runtime assets over 5 MiB',
	largestRuntimeAssetBytes: 'Largest runtime asset',
	portraitAssetBytes: 'Protected portrait library',
	portraitAssetFiles: 'Protected portrait files',
	blogPngMastersInStatic: 'Paired blog PNG masters in static'
};
const byteMetrics = new Set([
	'globalCssBytes',
	'clientOutputBytes',
	'runtimeAssetBytes',
	'largestRuntimeAssetBytes',
	'portraitAssetBytes'
]);
const failures = [];
const reviewedLargeAssetPaths = new Set(assetPolicy.reviewedLargeAssets.map((entry) => entry.path));
const largeRuntimeAssets = runtimeAssetRows.filter(
	(asset) => asset.bytes > assetPolicy.largeAssetThresholdBytes
);
const unreviewedLargeAssets = largeRuntimeAssets.filter(
	(asset) => !reviewedLargeAssetPaths.has(asset.path)
);
const staleLargeAssetReviews = [...reviewedLargeAssetPaths].filter(
	(reviewedPath) => !largeRuntimeAssets.some((asset) => asset.path === reviewedPath)
);

for (const [key, maximum] of Object.entries(budgets)) {
	const actual = metrics[key];
	if (typeof actual !== 'number') throw new Error(`Unknown build-budget metric: ${key}`);

	const format = byteMetrics.has(key) ? formatBytes : (value) => String(value);
	const passed = actual <= maximum;
	console.log(`${passed ? '✓' : '✗'} ${labels[key]}: ${format(actual)} / ${format(maximum)}`);

	if (!passed) failures.push(`${labels[key]} exceeded its budget by ${format(actual - maximum)}`);
}

console.log(`  Global stylesheet: ${globalCss.path}`);
if (runtimeAssetRows[0]) {
	console.log(
		`  Largest runtime asset: ${runtimeAssetRows[0].path} (${formatBytes(runtimeAssetRows[0].bytes)})`
	);
}
const largeAssetPolicyPassed =
	unreviewedLargeAssets.length === 0 && staleLargeAssetReviews.length === 0;
console.log(
	`${largeAssetPolicyPassed ? '✓' : '✗'} Reviewed large public assets: ${largeRuntimeAssets.length} / ${reviewedLargeAssetPaths.size}`
);
if (unreviewedLargeAssets.length > 0) {
	failures.push(
		`Unreviewed large public assets: ${unreviewedLargeAssets.map((asset) => asset.path).join(', ')}`
	);
}
if (staleLargeAssetReviews.length > 0) {
	failures.push(`Stale large-asset reviews: ${staleLargeAssetReviews.join(', ')}`);
}

if (failures.length > 0) {
	console.error('\nBuild budget check failed:');
	for (const failure of failures) console.error(`- ${failure}`);
	console.error(`\nBudgets are defined in ${path.relative(ROOT, BUDGET_PATH)}.`);
	process.exitCode = 1;
} else {
	console.log('\n✓ Build and runtime-asset budgets are within the ratchet.');
}
