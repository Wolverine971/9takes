// scripts/carry-over-immutable-assets.mjs
//
// Keeps the previous deploys' hashed client assets reachable on the production
// domain so a page served by deploy A can still finish hydrating after deploy B
// goes live.
//
// Why this exists: Vercel serves only the newest deployment's files from
// 9takes.com, and every deploy re-hashes the chunks it changed. When Googlebot
// fetches HTML from deploy A and renders it minutes later (after deploy B is
// live), the `import('./nodes/NN.js')` that SvelteKit runs during hydration
// 404s. SvelteKit catches that, wipes the body and renders `+error.svelte`,
// which carries `noindex, nofollow` — so a perfectly good page gets recorded by
// Google as "Excluded by 'noindex' tag" and drops out of the index until it is
// recrawled. Same failure hits real visitors on stale HTML.
//
// Fix: after the build, read the manifest published by the deploy that is live
// right now, download any of its still-fresh files that this build does not
// already contain (hashed names only change when content changes, so this is
// normally a handful of files), and publish a merged manifest for the next
// build to read.
//
// Fail-open by design: any network or parsing problem logs a warning and exits
// 0. A missing carry-over is a slow SEO leak; a failed build is an outage.

import { existsSync } from 'node:fs';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const OUTPUT_DIR = '.vercel/output/static';
const IMMUTABLE_DIR = '_app/immutable';
const MANIFEST_PATH = '_app/carryover-manifest.json';
const CARRIED_EXTENSIONS = new Set(['.js', '.css']);

// A deploy's assets only need to outlive Google's render queue and any stale
// HTML in a visitor's browser cache. Ten days is far past both and still prunes.
const DEFAULT_RETENTION_DAYS = 10;
// Guard rails so a pathological build (dependency bump re-hashing everything)
// can't balloon the deployment or hang the build.
const MAX_CARRIED_FILES = 600;
const MAX_CARRIED_BYTES = 60 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 15000;
const CONCURRENCY = 16;

function parseArgs(argv) {
	const args = {
		dryRun: false,
		baseUrl: 'https://9takes.com',
		retentionDays: DEFAULT_RETENTION_DAYS,
		force: false
	};
	for (let i = 0; i < argv.length; i += 1) {
		const arg = argv[i];
		if (arg === '--dry-run') args.dryRun = true;
		else if (arg === '--force') args.force = true;
		else if (arg === '--base-url') args.baseUrl = argv[++i];
		else if (arg === '--retention-days') args.retentionDays = Number(argv[++i]);
	}
	return args;
}

async function listFiles(dir, base = dir) {
	const out = [];
	let entries;
	try {
		entries = await readdir(dir, { withFileTypes: true });
	} catch {
		return out;
	}
	for (const entry of entries) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) out.push(...(await listFiles(full, base)));
		else out.push(path.relative(base, full).split(path.sep).join('/'));
	}
	return out;
}

async function fetchWithTimeout(url, init = {}) {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
	try {
		return await fetch(url, { ...init, signal: controller.signal });
	} finally {
		clearTimeout(timer);
	}
}

async function readLiveManifest(baseUrl) {
	const url = `${baseUrl}/${MANIFEST_PATH}?ts=${Date.now()}`;
	const response = await fetchWithTimeout(url, { headers: { 'cache-control': 'no-cache' } });
	if (!response.ok) {
		console.log(
			`[carry-over] no manifest on ${baseUrl} (HTTP ${response.status}) — first run, nothing to carry`
		);
		return {};
	}
	const body = await response.json();
	return body && typeof body.files === 'object' && body.files ? body.files : {};
}

/**
 * Decide what this build should pull forward. Exported for tests: the pruning
 * rule is the part that silently rots if it is wrong.
 */
export function planCarryOver({ liveFiles, currentFiles, now, retentionDays }) {
	const cutoff = now - retentionDays * 24 * 60 * 60 * 1000;
	const present = new Set(currentFiles);
	const manifest = {};
	const toDownload = [];

	for (const file of currentFiles) {
		// Files in this build restart the clock only if they are new to us.
		manifest[file] = liveFiles[file] ?? now;
	}

	for (const [file, firstSeen] of Object.entries(liveFiles)) {
		if (present.has(file)) continue;
		if (typeof firstSeen !== 'number' || firstSeen < cutoff) continue;
		if (!CARRIED_EXTENSIONS.has(path.extname(file))) continue;
		toDownload.push({ file, firstSeen });
	}

	// Newest first, so the cap keeps the assets most likely to still be needed.
	toDownload.sort((a, b) => b.firstSeen - a.firstSeen);
	const capped = toDownload.slice(0, MAX_CARRIED_FILES);
	return { manifest, toDownload: capped, skipped: toDownload.length - capped.length };
}

async function downloadAll({ baseUrl, toDownload, outputDir, manifest, dryRun }) {
	let carriedBytes = 0;
	let carried = 0;
	let failed = 0;
	const queue = [...toDownload];

	async function worker() {
		while (queue.length) {
			const entry = queue.shift();
			if (!entry) return;
			if (carriedBytes >= MAX_CARRIED_BYTES) return;
			const url = `${baseUrl}/${entry.file}`;
			try {
				const response = await fetchWithTimeout(url);
				if (!response.ok) {
					failed += 1;
					continue;
				}
				const buffer = Buffer.from(await response.arrayBuffer());
				carriedBytes += buffer.byteLength;
				carried += 1;
				manifest[entry.file] = entry.firstSeen;
				if (dryRun) continue;
				const destination = path.join(outputDir, entry.file);
				await mkdir(path.dirname(destination), { recursive: true });
				await writeFile(destination, buffer);
			} catch {
				failed += 1;
			}
		}
	}

	await Promise.all(
		Array.from({ length: Math.min(CONCURRENCY, Math.max(queue.length, 1)) }, worker)
	);
	return { carried, carriedBytes, failed };
}

async function main() {
	const args = parseArgs(process.argv.slice(2));

	if (!process.env.VERCEL && !args.force && !args.dryRun) {
		console.log('[carry-over] not a Vercel build — skipping (use --force to run locally)');
		return;
	}

	const outputDir = path.resolve(OUTPUT_DIR);
	const immutableDir = path.join(outputDir, IMMUTABLE_DIR);
	if (!existsSync(immutableDir)) {
		console.warn(`[carry-over] ${IMMUTABLE_DIR} not found — did the build run? Skipping.`);
		return;
	}

	const currentFiles = (await listFiles(immutableDir)).map((file) => `${IMMUTABLE_DIR}/${file}`);
	const liveFiles = await readLiveManifest(args.baseUrl);
	const { manifest, toDownload, skipped } = planCarryOver({
		liveFiles,
		currentFiles,
		now: Date.now(),
		retentionDays: args.retentionDays
	});

	const { carried, carriedBytes, failed } = await downloadAll({
		baseUrl: args.baseUrl,
		toDownload,
		outputDir,
		manifest,
		dryRun: args.dryRun
	});

	if (!args.dryRun) {
		const manifestFile = path.join(outputDir, MANIFEST_PATH);
		await mkdir(path.dirname(manifestFile), { recursive: true });
		await writeFile(
			manifestFile,
			JSON.stringify({ updatedAt: Date.now(), files: manifest }, null, 0)
		);
	}

	console.log(
		`[carry-over] build has ${currentFiles.length} assets; carried ${carried} from the live deploy ` +
			`(${(carriedBytes / 1024 / 1024).toFixed(2)} MB)` +
			`${failed ? `, ${failed} unavailable` : ''}${skipped ? `, ${skipped} over cap` : ''}` +
			`${args.dryRun ? ' [dry run]' : ''}`
	);
}

const invokedDirectly =
	process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (invokedDirectly) {
	main().catch((error) => {
		// Never fail the build over this.
		console.warn(`[carry-over] skipped: ${error?.message ?? error}`);
	});
}
