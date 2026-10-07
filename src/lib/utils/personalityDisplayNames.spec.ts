// src/lib/utils/personalityDisplayNames.spec.ts
//
// The H1, breadcrumbs and Person JSON-LD on every personality page use
// formatPersonalityDisplayName(), which builds the name from the slug. Slugs
// lose accents, apostrophes, initials and internal capitals ("Conan Obrien",
// "Beyonce Knowles"), so every published profile's display name must appear in
// its own article. Fix a failure by adding an entry to
// PERSONALITY_DISPLAY_NAME_OVERRIDES in personalityAnalysis.ts.
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { formatPersonalityDisplayName } from './personalityAnalysis';

const DRAFTS_DIR = path.join(process.cwd(), 'src', 'blog', 'people', 'drafts');

function publishedDrafts() {
	return readdirSync(DRAFTS_DIR)
		.filter((file) => file.endsWith('.md') && file !== 'person-template.md')
		.map((file) => {
			const { data, content } = matter(readFileSync(path.join(DRAFTS_DIR, file), 'utf8'));
			return { file, data, text: `${data.title ?? ''}\n${data.description ?? ''}\n${content}` };
		})
		.filter(({ data }) => data.published === true && typeof data.person === 'string');
}

describe('personality display names', () => {
	it("match each article's own spelling of the person's name", () => {
		const mismatches = publishedDrafts()
			.map(({ file, data, text }) => ({
				file,
				text: text.replace(/’/g, "'"),
				name: formatPersonalityDisplayName(data.person as string)
			}))
			.filter(({ name, text }) => name.length > 0 && !text.includes(name))
			.map(({ file, name }) => `${file}: "${name}"`);

		expect(mismatches).toEqual([]);
	});
});
