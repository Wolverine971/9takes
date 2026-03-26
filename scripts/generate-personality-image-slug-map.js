// scripts/generate-personality-image-slug-map.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');
const TYPES_DIR = path.join(ROOT_DIR, 'static', 'types');
const OUTPUT_PATH = path.join(ROOT_DIR, 'src', 'lib', 'generated', 'personalityImageSlugMap.json');

function normalizePersonalitySlug(slug) {
	return typeof slug === 'string' ? slug.trim().toLowerCase() : '';
}

async function collectImageSlugs() {
	const typeDirectories = await fs.readdir(TYPES_DIR, { withFileTypes: true });
	const slugMap = {};

	for (const entry of typeDirectories) {
		if (!entry.isDirectory()) continue;

		const typeDir = path.join(TYPES_DIR, entry.name);
		const files = await fs.readdir(typeDir, { withFileTypes: true });

		for (const file of files) {
			if (!file.isFile() || !file.name.endsWith('.webp')) continue;

			const baseName = file.name.replace(/^s-/, '').replace(/\.webp$/, '');
			const normalizedSlug = normalizePersonalitySlug(baseName);
			if (!normalizedSlug) continue;

			if (!slugMap[normalizedSlug]) {
				slugMap[normalizedSlug] = baseName;
			}
		}
	}

	return Object.fromEntries(Object.entries(slugMap).sort(([a], [b]) => a.localeCompare(b)));
}

async function main() {
	const slugMap = await collectImageSlugs();
	await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
	await fs.writeFile(OUTPUT_PATH, JSON.stringify(slugMap, null, 2) + '\n', 'utf8');
	console.log(
		`Wrote ${Object.keys(slugMap).length} personality image slug mappings to ${path.relative(ROOT_DIR, OUTPUT_PATH)}`
	);
}

main().catch((error) => {
	console.error('Failed to generate personality image slug map:', error);
	process.exit(1);
});
