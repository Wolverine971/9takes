// Only reviewed occupation tags are shipped. Publication status, personality type
// and article content still come from the published database row.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { normalizePersonalitySlug } from './lib/personalitySeo.js';

const draftDirectory = fileURLToPath(new URL('../src/blog/people/drafts/', import.meta.url));

export function readReviewedPersonTypes() {
	/** @type {Record<string, string[]>} */
	const reviewed = {};
	for (const file of fs.readdirSync(draftDirectory).sort()) {
		if (!file.endsWith('.md')) continue;
		const { data } = matter(fs.readFileSync(path.join(draftDirectory, file), 'utf8'), {});
		if (data.niche_reviewed !== true) continue;
		const slug = normalizePersonalitySlug(data.person);
		if (
			!slug ||
			Object.hasOwn(reviewed, slug) ||
			!Array.isArray(data.type) ||
			!data.type.length ||
			!data.type.every((tag) => typeof tag === 'string' && tag.trim())
		) {
			throw new Error(`Invalid or duplicate reviewed niche entry in ${file}`);
		}
		reviewed[slug] = data.type;
	}
	return reviewed;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	const output = new URL('../src/lib/generated/reviewedPersonTypes.json', import.meta.url);
	fs.writeFileSync(output, JSON.stringify(readReviewedPersonTypes(), null, '\t') + '\n');
}
