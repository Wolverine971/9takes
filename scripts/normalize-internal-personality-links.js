// scripts/normalize-internal-personality-links.js
import fg from 'fast-glob';
import fs from 'fs/promises';

import { normalizePersonalitySlug } from './lib/personalitySeo.js';

const TARGETS = ['src/blog/**/*.{md,svx,svelte.md}', 'src/routes/calendar/events.json'];
const IGNORE = ['src/blog/people/drafts/**'];
const LINK_PATTERN = /(https:\/\/9takes\.com)?(\/personality-analysis\/)([A-Za-z0-9-]+)/g;

async function main() {
	const paths = await fg(TARGETS, {
		ignore: IGNORE,
		onlyFiles: true
	});

	let changedFiles = 0;
	let replacedLinks = 0;

	for (const path of paths) {
		const original = await fs.readFile(path, 'utf8');
		let fileReplacements = 0;

		const normalized = original.replace(LINK_PATTERN, (match, origin = '', prefix, slug) => {
			const normalizedSlug = normalizePersonalitySlug(slug);
			if (normalizedSlug === slug) {
				return match;
			}

			fileReplacements += 1;
			return `${origin}${prefix}${normalizedSlug}`;
		});

		if (normalized === original) {
			continue;
		}

		await fs.writeFile(path, normalized, 'utf8');
		changedFiles += 1;
		replacedLinks += fileReplacements;
		console.log(`updated ${path} (${fileReplacements} links)`);
	}

	console.log(`normalized ${replacedLinks} links across ${changedFiles} files`);
}

main().catch((error) => {
	console.error('Failed to normalize internal personality links:', error);
	process.exitCode = 1;
});
