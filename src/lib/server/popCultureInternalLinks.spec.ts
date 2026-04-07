import { describe, expect, it } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import fastGlob from 'fast-glob';

type PopCulturePost = {
	file: string;
	route: string;
	published: boolean;
	content: string;
};

const POP_CULTURE_FILE_GLOB = 'src/blog/pop-culture/*.md';
const LINK_PATTERNS = [
	/\]\((\/pop-culture\/[^)#?\s]+)(?:[#?][^)]+)?\)/g,
	/href=['"](\/pop-culture\/[^'"#?\s]+)(?:[#?][^'"]*)?['"]/g
];

describe('published pop-culture internal links', () => {
	it('only points to live pop-culture routes', async () => {
		const posts = await loadPopCulturePosts();
		const issues: string[] = [];

		for (const sourcePost of posts.values()) {
			if (!sourcePost.published) continue;

			for (const targetRoute of collectPopCultureLinks(sourcePost.content)) {
				const targetPost = posts.get(targetRoute);

				if (!targetPost) {
				issues.push(`${sourcePost.route} -> ${targetRoute} (missing target file)`);
				continue;
				}

				if (!targetPost.published) {
					issues.push(`${sourcePost.route} -> ${targetRoute} (${path.basename(targetPost.file)})`);
				}
			}
		}

		expect(issues).toEqual([]);
	});
});

async function loadPopCulturePosts(): Promise<Map<string, PopCulturePost>> {
	const files = (await fastGlob(POP_CULTURE_FILE_GLOB)).sort();
	const posts = new Map<string, PopCulturePost>();

	for (const file of files) {
		const raw = await fs.readFile(file, 'utf8');
		const { frontmatter, content } = splitFrontmatter(raw);
		const route = `/pop-culture/${path.basename(file).replace(/\.(svelte\.md|md|svx)$/i, '')}`;

		posts.set(route, {
			file,
			route,
			published: /^published:\s*true\s*$/m.test(frontmatter),
			content
		});
	}

	return posts;
}

function splitFrontmatter(raw: string): { frontmatter: string; content: string } {
	const match = raw.match(/^---\n([\s\S]*?)\n---\n?/);
	return {
		frontmatter: match?.[1] ?? '',
		content: match ? raw.slice(match[0].length) : raw
	};
}

function collectPopCultureLinks(content: string): string[] {
	const links = new Set<string>();

	for (const pattern of LINK_PATTERNS) {
		pattern.lastIndex = 0;
		let match: RegExpExecArray | null = null;

		while ((match = pattern.exec(content))) {
			links.add(match[1].replace(/\/$/, ''));
		}
	}

	return [...links];
}
