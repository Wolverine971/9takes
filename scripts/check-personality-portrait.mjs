#!/usr/bin/env node
// scripts/check-personality-portrait.mjs
// Validate one generated personality portrait pair, then print the exact
// styleguide URL used for dark/light visual review.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const REPO_ROOT = path.resolve(path.dirname(SCRIPT_PATH), '..');
const DEFAULT_PORTRAIT_ROOT = path.join(REPO_ROOT, 'static', 'types');
const DEFAULT_PREVIEW_ORIGIN = 'http://127.0.0.1:5173';
const SLUG_PATTERN = /^[A-Za-z0-9][A-Za-z0-9.-]*$/;

/**
 * @typedef {object} PortraitAsset
 * @property {string} path
 * @property {number} bytes
 * @property {string | null} format
 * @property {number | null} width
 * @property {number | null} height
 * @property {boolean} hasAlpha
 */

/**
 * @typedef {object} PortraitInspectionOptions
 * @property {number} type
 * @property {string} slug
 * @property {string} [portraitRoot]
 * @property {string} [origin]
 */

/**
 * @typedef {{ help: true, json: boolean, origin: string, portraitRoot: string } | { help: false, json: boolean, type: number, slug: string, origin: string, portraitRoot: string }} ParsedPortraitArgs
 */

/** @param {string[]} argv @param {number} index @param {string} flag */
function takeValue(argv, index, flag) {
	const value = argv[index + 1];
	if (!value || value.startsWith('--')) {
		throw new Error(`${flag} requires a value`);
	}
	return value;
}

/** @param {string[]} argv @returns {ParsedPortraitArgs} */
export function parsePortraitArgs(argv) {
	/** @type {string[]} */
	const positionals = [];
	let typeValue = '';
	let slug = '';
	let origin = process.env.PORTRAIT_PREVIEW_ORIGIN || DEFAULT_PREVIEW_ORIGIN;
	let portraitRoot = process.env.PERSONALITY_IMAGE_OUTPUT_ROOT || DEFAULT_PORTRAIT_ROOT;
	let json = false;
	let help = false;

	for (let index = 0; index < argv.length; index += 1) {
		const argument = argv[index];
		if (argument === '--') {
			continue;
		} else if (argument === '--help' || argument === '-h') {
			help = true;
		} else if (argument === '--json') {
			json = true;
		} else if (argument === '--type') {
			typeValue = takeValue(argv, index, '--type');
			index += 1;
		} else if (argument.startsWith('--type=')) {
			typeValue = argument.slice('--type='.length);
		} else if (argument === '--slug') {
			slug = takeValue(argv, index, '--slug');
			index += 1;
		} else if (argument.startsWith('--slug=')) {
			slug = argument.slice('--slug='.length);
		} else if (argument === '--origin') {
			origin = takeValue(argv, index, '--origin');
			index += 1;
		} else if (argument.startsWith('--origin=')) {
			origin = argument.slice('--origin='.length);
		} else if (argument === '--root') {
			portraitRoot = takeValue(argv, index, '--root');
			index += 1;
		} else if (argument.startsWith('--root=')) {
			portraitRoot = argument.slice('--root='.length);
		} else if (argument.startsWith('--')) {
			throw new Error(`Unknown option: ${argument}`);
		} else {
			positionals.push(argument);
		}
	}

	if (help) return { help: true, json, origin, portraitRoot };

	if (!typeValue && positionals.length > 0) typeValue = positionals.shift() ?? '';
	if (!slug && positionals.length > 0) slug = positionals.shift() ?? '';
	if (positionals.length > 0) throw new Error(`Unexpected argument: ${positionals[0]}`);

	const type = Number(typeValue);
	if (!Number.isInteger(type) || type < 1 || type > 9) {
		throw new Error('Enneagram type must be a single number from 1 through 9');
	}
	if (!slug || slug.startsWith('s-') || !SLUG_PATTERN.test(slug)) {
		throw new Error('Portrait slug must be filename-safe and must not begin with s-');
	}
	if (slug.endsWith('.webp')) {
		throw new Error('Portrait slug must not include the .webp extension');
	}

	let previewOrigin;
	try {
		previewOrigin = new URL(origin);
	} catch {
		throw new Error(`Invalid preview origin: ${origin}`);
	}
	if (!['http:', 'https:'].includes(previewOrigin.protocol)) {
		throw new Error('Preview origin must use http or https');
	}

	return {
		help: false,
		json,
		type,
		slug,
		origin: previewOrigin.origin,
		portraitRoot: path.resolve(portraitRoot)
	};
}

/** @param {string} assetPath @returns {Promise<PortraitAsset | null>} */
async function readAsset(assetPath) {
	try {
		const [stat, metadata] = await Promise.all([fs.stat(assetPath), sharp(assetPath).metadata()]);
		return {
			path: assetPath,
			bytes: stat.size,
			format: metadata.format ?? null,
			width: metadata.width ?? null,
			height: metadata.height ?? null,
			hasAlpha: metadata.hasAlpha ?? false
		};
	} catch (error) {
		if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
			return null;
		}
		throw error;
	}
}

/** @param {{ type: number, slug: string, origin?: string }} options */
export function buildPortraitPreviewUrl({ type, slug, origin = DEFAULT_PREVIEW_ORIGIN }) {
	const url = new URL('/styleguide', origin);
	url.searchParams.set('portraitType', String(type));
	url.searchParams.set('portraitSlug', slug);
	url.hash = 'portrait-preflight';
	return url.toString();
}

/** @param {PortraitInspectionOptions} options */
export async function inspectPortraitPair({
	type,
	slug,
	portraitRoot = DEFAULT_PORTRAIT_ROOT,
	origin = DEFAULT_PREVIEW_ORIGIN
}) {
	const typeDirectory = path.join(path.resolve(portraitRoot), `${type}s`);
	const fullPath = path.join(typeDirectory, `${slug}.webp`);
	const thumbnailPath = path.join(typeDirectory, `s-${slug}.webp`);
	const duplicateThumbnailPath = path.join(typeDirectory, `s-s-${slug}.webp`);
	const [full, thumbnail, duplicateThumbnail] = await Promise.all([
		readAsset(fullPath),
		readAsset(thumbnailPath),
		readAsset(duplicateThumbnailPath)
	]);
	/** @type {string[]} */
	const errors = [];
	/** @type {string[]} */
	const warnings = [];

	if (!full) errors.push(`Missing full portrait: ${path.relative(REPO_ROOT, fullPath)}`);
	if (!thumbnail) errors.push(`Missing thumbnail: ${path.relative(REPO_ROOT, thumbnailPath)}`);
	if (duplicateThumbnail) {
		errors.push(
			`Invalid duplicate thumbnail exists: ${path.relative(REPO_ROOT, duplicateThumbnailPath)}`
		);
	}

	/** @type {Array<[string, PortraitAsset | null]>} */
	const assets = [
		['Full portrait', full],
		['Thumbnail', thumbnail]
	];
	for (const [label, asset] of assets) {
		if (!asset) continue;
		if (asset.format !== 'webp')
			errors.push(`${label} must be WebP; found ${asset.format ?? 'unknown'}`);
		if (!asset.width || !asset.height) errors.push(`${label} has unreadable dimensions`);
	}

	if (full?.width && full.width > 1200) {
		errors.push(`Full portrait width is ${full.width}px; the pipeline ceiling is 1200px`);
	}
	if (thumbnail?.width && thumbnail.width > 480) {
		errors.push(`Thumbnail width is ${thumbnail.width}px; the pipeline ceiling is 480px`);
	}

	if (full?.width && full.height && thumbnail?.width && thumbnail.height) {
		const fullRatio = full.width / full.height;
		const thumbnailRatio = thumbnail.width / thumbnail.height;
		if (Math.abs(fullRatio - thumbnailRatio) > 0.01) {
			errors.push('Full portrait and thumbnail do not share the same aspect ratio');
		}
		if (thumbnail.width > full.width || thumbnail.height > full.height) {
			errors.push('Thumbnail dimensions must not exceed the full portrait dimensions');
		}
		if (full.width < 480) {
			warnings.push(
				`Full portrait is only ${full.width}px wide; card crops may look soft on dense displays`
			);
		}
	}

	if (full?.bytes && thumbnail?.bytes && thumbnail.bytes >= full.bytes) {
		warnings.push('Thumbnail file is not smaller than the full portrait');
	}

	return {
		ok: errors.length === 0,
		type,
		slug,
		full,
		thumbnail,
		errors,
		warnings,
		previewUrl: buildPortraitPreviewUrl({ type, slug, origin })
	};
}

/** @param {number} bytes */
function formatBytes(bytes) {
	if (bytes < 1024) return `${bytes} B`;
	return `${(bytes / 1024).toFixed(1)} KB`;
}

/** @param {string} label @param {PortraitAsset | null} asset */
function formatAsset(label, asset) {
	if (!asset) return `${label}: missing`;
	return `${label}: ${asset.width}×${asset.height} ${asset.format?.toUpperCase()} · ${formatBytes(asset.bytes)} · ${asset.hasAlpha ? 'alpha' : 'opaque'}`;
}

function printHelp() {
	console.log(`Usage:
  pnpm portrait:check -- <type 1-9> <Person-Name>
  pnpm portrait:check -- --type <1-9> --slug <Person-Name> [--origin URL] [--json]

Validates the full/thumbnail WebP pair without modifying it, then prints the exact
/styleguide publishing-preview URL. Use --root to validate a non-default output directory.`);
}

async function main() {
	let options;
	try {
		options = parsePortraitArgs(process.argv.slice(2));
	} catch (error) {
		console.error(`✗ ${error instanceof Error ? error.message : String(error)}`);
		printHelp();
		process.exitCode = 1;
		return;
	}

	if (options.help) {
		printHelp();
		return;
	}

	const result = await inspectPortraitPair(options);
	if (options.json) {
		console.log(JSON.stringify(result, null, 2));
	} else {
		console.log(
			result.ok
				? '✓ Personality portrait preflight passed'
				: '✗ Personality portrait preflight failed'
		);
		console.log(formatAsset('  Full', result.full));
		console.log(formatAsset('  Thumb', result.thumbnail));
		for (const warning of result.warnings) console.warn(`  Warning: ${warning}`);
		for (const error of result.errors) console.error(`  Error: ${error}`);
		if (result.ok) {
			console.log(`  Review: ${result.previewUrl}`);
			console.log(
				'  Toggle the styleguide theme and inspect both hero and square crops before publishing.'
			);
		}
	}

	if (!result.ok) process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === SCRIPT_PATH) {
	await main();
}
