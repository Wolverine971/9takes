// scripts/lib/imageVariants.mjs
//
// Plans, checks and writes the phone-sized AVIF variants in static/variants/ (config and
// URL builders: src/lib/imageVariants.js). A variant is fresh when the manifest records the
// same source hash and encode settings it was made with, so replacing or re-tinting a hero
// or portrait makes its variant stale, and the next run rebuilds it.
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import {
	BLOG_HERO_PHONE,
	PORTRAIT_PHONE,
	TYPE_DOSSIER_IMAGE
} from '../../src/lib/imageVariants.js';

export const MANIFEST_PATH = 'scripts/image-variants.manifest.json';
export const VARIANTS_ROOT = 'static/variants';
/** A variant heavier than this is reported: the point of the variant is a light LCP file. */
export const HEAVY_VARIANT_BYTES = 150 * 1024;

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---/;
const PIC_LINE = /^pic:\s*(?:'([^']*)'|"([^"]*)"|([^#\r\n]*))/m;

/** The `pic` value from a markdown file's frontmatter, or '' when unset. */
export function readPic(markdown) {
	const frontmatter = FRONTMATTER.exec(markdown)?.[1];
	if (!frontmatter) return '';
	const match = PIC_LINE.exec(frontmatter);
	return (match?.[1] ?? match?.[2] ?? match?.[3] ?? '').trim();
}

function walk(dir, keep) {
	if (!fs.existsSync(dir)) return [];
	return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const entryPath = path.join(dir, entry.name);
		if (entry.isDirectory()) return walk(entryPath, keep);
		return entry.isFile() && keep(entry.name) ? [entryPath] : [];
	});
}

const toPosix = (file) => file.split(path.sep).join('/');

/**
 * Every variant that should exist: one per hero a post's frontmatter names (drafts
 * included, so previews match production), one per full portrait, and the type dossier image.
 * @returns {{ source: string, output: string, width: number, quality: number, kind: string }[]}
 */
export function planVariants(root = process.cwd()) {
	const plan = new Map();

	for (const file of walk(path.join(root, 'src/blog'), (name) => name.endsWith('.md'))) {
		const pic = readPic(fs.readFileSync(file, 'utf8'));
		if (!pic) continue;
		const source = `${BLOG_HERO_PHONE.sourceDir}/${pic}.webp`;
		if (!fs.existsSync(path.join(root, source))) continue;
		plan.set(source, {
			kind: 'blog-hero',
			source,
			output: `${BLOG_HERO_PHONE.outputDir}/${pic}.avif`,
			width: BLOG_HERO_PHONE.width,
			quality: BLOG_HERO_PHONE.quality
		});
	}

	const typesDir = path.join(root, PORTRAIT_PHONE.sourceDir);
	for (const folder of fs.existsSync(typesDir) ? fs.readdirSync(typesDir) : []) {
		if (!/^[1-9]s$/.test(folder)) continue;
		for (const name of fs.readdirSync(path.join(typesDir, folder))) {
			if (!name.endsWith('.webp') || name.startsWith('s-')) continue;
			const source = `${PORTRAIT_PHONE.sourceDir}/${folder}/${name}`;
			plan.set(source, {
				kind: 'portrait',
				source,
				output: `${PORTRAIT_PHONE.outputDir}/${folder}/${name.replace(/\.webp$/, '.avif')}`,
				width: PORTRAIT_PHONE.width,
				quality: PORTRAIT_PHONE.quality
			});
		}
	}

	if (fs.existsSync(path.join(root, TYPE_DOSSIER_IMAGE.source))) {
		plan.set(TYPE_DOSSIER_IMAGE.source, {
			kind: 'type-dossier',
			source: TYPE_DOSSIER_IMAGE.source,
			output: TYPE_DOSSIER_IMAGE.output,
			width: TYPE_DOSSIER_IMAGE.width,
			quality: TYPE_DOSSIER_IMAGE.quality
		});
	}

	return [...plan.values()].sort((a, b) => a.output.localeCompare(b.output));
}

/** What the manifest stores per output: source content hash plus the encode settings. */
export function fingerprint(sourceBytes, { width, quality }) {
	return `${createHash('sha1').update(sourceBytes).digest('hex').slice(0, 16)}:w${width}:q${quality}`;
}

export function readManifest(root = process.cwd()) {
	const file = path.join(root, MANIFEST_PATH);
	return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
}

/**
 * Compare the plan with what is on disk.
 * @returns {{ todo: object[], orphans: string[], heavy: { output: string, bytes: number }[] }}
 *   `todo` entries carry `reason: 'missing' | 'stale'` and the fingerprint to record.
 */
export function diffVariants(root = process.cwd(), plan = planVariants(root)) {
	const manifest = readManifest(root);
	const planned = new Set(plan.map((item) => item.output));
	const todo = [];
	const heavy = [];

	for (const item of plan) {
		const print = fingerprint(fs.readFileSync(path.join(root, item.source)), item);
		const outputPath = path.join(root, item.output);
		if (!fs.existsSync(outputPath)) todo.push({ ...item, fingerprint: print, reason: 'missing' });
		else if (manifest[item.output] !== print)
			todo.push({ ...item, fingerprint: print, reason: 'stale' });
		else {
			const bytes = fs.statSync(outputPath).size;
			if (bytes > HEAVY_VARIANT_BYTES) heavy.push({ output: item.output, bytes });
		}
	}

	const orphans = walk(path.join(root, VARIANTS_ROOT), (name) => name.endsWith('.avif'))
		.map((file) => toPosix(path.relative(root, file)))
		.filter((file) => !planned.has(file))
		.sort();

	return { todo, orphans, heavy };
}

async function encode(root, item) {
	const { default: sharp } = await import('sharp');
	const outputPath = path.join(root, item.output);
	fs.mkdirSync(path.dirname(outputPath), { recursive: true });
	// rotate() bakes in any EXIF orientation, which browsers apply and sharp otherwise drops.
	await sharp(path.join(root, item.source))
		.rotate()
		.resize({ width: item.width, withoutEnlargement: true })
		.avif({ quality: item.quality, effort: 4 })
		.toFile(outputPath);
	return fs.statSync(outputPath).size;
}

/**
 * Write every missing or stale variant, delete orphans, and rewrite the manifest.
 * @returns {Promise<{ written: { output: string, reason: string, bytes: number }[], removed: string[], total: number }>}
 */
export async function generateVariants(root = process.cwd(), { concurrency = 6 } = {}) {
	const plan = planVariants(root);
	const { todo, orphans } = diffVariants(root, plan);
	const manifest = readManifest(root);
	const written = [];

	const queue = [...todo];
	await Promise.all(
		Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
			for (let item = queue.shift(); item; item = queue.shift()) {
				const bytes = await encode(root, item);
				manifest[item.output] = item.fingerprint;
				written.push({ output: item.output, reason: item.reason, bytes });
			}
		})
	);

	for (const orphan of orphans) fs.rmSync(path.join(root, orphan));

	const planned = new Set(plan.map((item) => item.output));
	const next = Object.fromEntries(
		Object.entries(manifest)
			.filter(([output]) => planned.has(output))
			.sort(([a], [b]) => a.localeCompare(b))
	);
	const serialized = `${JSON.stringify(next, null, '\t')}\n`;
	const manifestFile = path.join(root, MANIFEST_PATH);
	if (!fs.existsSync(manifestFile) || fs.readFileSync(manifestFile, 'utf8') !== serialized) {
		fs.writeFileSync(manifestFile, serialized);
	}

	written.sort((a, b) => a.output.localeCompare(b.output));
	return { written, removed: orphans, total: plan.length };
}
