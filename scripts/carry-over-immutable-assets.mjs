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
// 404s. SvelteKit catches that, wipes the body and renders `+error.svelte`, so
// a perfectly good page renders as an error page for Google. Same failure hits
// real visitors on stale HTML.
//
// Fix: after the build, read the manifest published by the deploy that is live
// right now, download any of its still-needed files that this build does not
// already contain (hashed names only change when content changes, so this is
// normally a few hundred files), and publish a merged manifest for the next
// build to read.
//
// Fail-open by design: any network or parsing problem logs a warning and exits
// 0. A missing carry-over is a slow SEO leak; a failed build is an outage.
//
// Manifest format (version 2), published at /_app/carryover-manifest.json:
//
//   { version: 2, updatedAt, files: { [path]: { firstSeen, lastSeen, inBuild? } } }
//
//   firstSeen  when a build first emitted the file (diagnostics + tie-break only)
//   lastSeen   the last time HTML that references the file was being served
//   inBuild    true when the deploy that wrote the manifest emitted the file
//              itself, so its own HTML references it
//
// Retention and the cap's priority are measured from lastSeen, never firstSeen.
// Measuring from firstSeen (the version 1 rule) made a long-lived chunk look
// "old" the moment it was finally re-hashed, so it was pruned or cut by the cap
// exactly when stale HTML still needed it. The Vite 8 upgrade (2026-09-23)
// re-hashed ~1,150 assets at once; that whole batch then sorted as oldest, and
// the 2026-09-28 build dropped files the 2026-09-25 HTML still loaded.
//
// Version 1 manifests (`files: { [path]: firstSeen }`) are still read: every
// entry is treated as emitted by the live deploy, so the transition build
// restarts the clock for all of them. That over-retains one generation of
// carried files (bounded by the caps) instead of under-retaining any.

import { existsSync } from 'node:fs';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const OUTPUT_DIR = '.vercel/output/static';
const IMMUTABLE_DIR = '_app/immutable';
const MANIFEST_PATH = '_app/carryover-manifest.json';
const MANIFEST_VERSION = 2;
const CARRIED_EXTENSIONS = new Set(['.js', '.css']);

// A retired asset only needs to outlive Google's render queue and any stale
// HTML in a visitor's browser cache, counted from the last moment that HTML was
// served. Ten days is far past both and still prunes.
const DEFAULT_RETENTION_DAYS = 10;
// Guard rails so a pathological build can't balloon the deployment or hang the
// build. A full client build is ~1,130 js/css files and ~28 MB, so these hold a
// complete re-hash (dependency or bundler bump) plus ten days of normal churn
// (80-340 files per deploy). Vercel has no output file-count limit; ~3,000
// downloads at 16-way concurrency add seconds, not minutes, to the build.
export const MAX_CARRIED_FILES = 3000;
export const MAX_CARRIED_BYTES = 150 * 1024 * 1024;
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
	// Either manifest version; planCarryOver normalizes the entries.
	return body && typeof body.files === 'object' && body.files ? body.files : {};
}

/**
 * Read one live-manifest entry in either format. Version 1 stored a bare
 * firstSeen number and did not record which files the live deploy emitted, so
 * assume all of them: restarting the clock for an asset that was only being
 * carried costs one extra generation of retention, while guessing the other
 * way is the bug this format replaces.
 *
 * @param {unknown} value
 * @returns {{ firstSeen: number, lastSeen: number, inBuild: boolean } | null}
 */
export function normalizeManifestEntry(value) {
	if (typeof value === 'number') {
		return Number.isFinite(value) ? { firstSeen: value, lastSeen: value, inBuild: true } : null;
	}
	if (!value || typeof value !== 'object') return null;

	const record = /** @type {Record<string, unknown>} */ (value);
	const firstSeen = Number.isFinite(record.firstSeen) ? Number(record.firstSeen) : null;
	const lastSeen = Number.isFinite(record.lastSeen) ? Number(record.lastSeen) : null;
	if (firstSeen === null && lastSeen === null) return null;

	return {
		firstSeen: firstSeen ?? /** @type {number} */ (lastSeen),
		lastSeen: lastSeen ?? /** @type {number} */ (firstSeen),
		inBuild: record.inBuild === true
	};
}

/**
 * Decide what this build should pull forward. Exported for tests: the pruning
 * rule is the part that silently rots if it is wrong.
 *
 * `liveFiles` is the `files` map of the manifest the live deploy published
 * (either version); `currentFiles` are the immutable assets this build emitted.
 */
export function planCarryOver({
	liveFiles,
	currentFiles,
	now,
	retentionDays,
	maxFiles = MAX_CARRIED_FILES
}) {
	const cutoff = now - retentionDays * 24 * 60 * 60 * 1000;
	const present = new Set(currentFiles);
	const manifest = {};
	const toDownload = [];
	let expired = 0;

	for (const file of currentFiles) {
		// This build's HTML references these until the next deploy replaces it;
		// that deploy advances lastSeen again when it retires them.
		const live = normalizeManifestEntry(liveFiles[file]);
		manifest[file] = { firstSeen: live?.firstSeen ?? now, lastSeen: now, inBuild: true };
	}

	for (const [file, value] of Object.entries(liveFiles)) {
		if (present.has(file)) continue;
		if (!CARRIED_EXTENSIONS.has(path.extname(file))) continue;
		const entry = normalizeManifestEntry(value);
		if (!entry) continue;

		// The live deploy keeps serving HTML that references its own assets until
		// this build replaces it, so those were last seen now. Assets it was only
		// carrying keep the date their own HTML was retired.
		const lastSeen = entry.inBuild ? now : entry.lastSeen;
		if (lastSeen < cutoff) {
			expired += 1;
			continue;
		}
		toDownload.push({ file, firstSeen: entry.firstSeen, lastSeen });
	}

	// Most recently retired first, so the cap keeps the assets most likely to
	// still be requested. Ties (a whole build retired at once) fall back to
	// newer-first, then name, so any cut is deterministic.
	toDownload.sort(
		(a, b) =>
			b.lastSeen - a.lastSeen ||
			b.firstSeen - a.firstSeen ||
			(a.file < b.file ? -1 : a.file > b.file ? 1 : 0)
	);
	const capped = toDownload.slice(0, maxFiles);
	return { manifest, toDownload: capped, skipped: toDownload.length - capped.length, expired };
}

/** Record an asset this build carried forward (shared with the tests). */
export function recordCarried(manifest, entry) {
	manifest[entry.file] = { firstSeen: entry.firstSeen, lastSeen: entry.lastSeen };
}

async function downloadAll({ baseUrl, toDownload, outputDir, manifest, dryRun }) {
	let carriedBytes = 0;
	let carried = 0;
	let failed = 0;
	let overBytes = 0;
	const queue = [...toDownload];

	async function worker() {
		while (queue.length) {
			const entry = queue.shift();
			if (!entry) return;
			// The queue is most-recent-first, so the byte cap drops the oldest tail.
			if (carriedBytes >= MAX_CARRIED_BYTES) {
				overBytes += 1;
				continue;
			}
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
				recordCarried(manifest, entry);
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
	return { carried, carriedBytes, failed, overBytes };
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
	const now = Date.now();
	const { manifest, toDownload, skipped, expired } = planCarryOver({
		liveFiles,
		currentFiles,
		now,
		retentionDays: args.retentionDays
	});

	const { carried, carriedBytes, failed, overBytes } = await downloadAll({
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
			JSON.stringify({ version: MANIFEST_VERSION, updatedAt: now, files: manifest }, null, 0)
		);
	}

	const overCap = skipped + overBytes;
	console.log(
		`[carry-over] build has ${currentFiles.length} assets; carried ${carried} from the live deploy ` +
			`(${(carriedBytes / 1024 / 1024).toFixed(2)} MB)` +
			`${failed ? `, ${failed} unavailable` : ''}${overCap ? `, ${overCap} over cap` : ''}` +
			`${expired ? `, ${expired} past ${args.retentionDays}-day retention` : ''}` +
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
