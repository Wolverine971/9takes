// src/lib/blogEmbedCss.spec.ts
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { isBlogEmbedComponent } from './blogEmbedCss.js';

const root = process.cwd();

// Styled components a post embeds that every post page already links on its own, so
// injecting their CSS would not save a request.
const LINKED_BY_POST_PAGES = new Set([
	'src/lib/components/atoms/PopCard.svelte', // imported by every blog [slug] page
	'src/lib/components/atoms/Modal.svelte' // in the atoms barrel the root layout loads
]);

const walk = (dir: string, out: string[] = []): string[] => {
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) walk(full, out);
		else out.push(full);
	}
	return out;
};

const svelteImports = (file: string): string[] =>
	[...fs.readFileSync(file, 'utf8').matchAll(/from\s+['"]([^'"]+\.svelte)['"]/g)]
		.map(([, spec]) =>
			spec.startsWith('$lib/')
				? path.join(root, 'src/lib', spec.slice('$lib/'.length))
				: spec.startsWith('.')
					? path.resolve(path.dirname(file), spec)
					: null
		)
		.filter((resolved): resolved is string => !!resolved && fs.existsSync(resolved));

const postFiles = () =>
	walk(path.join(root, 'src/blog')).filter(
		(file) => /\.(md|svx)$/.test(file) && !/[\\/](drafts|people)[\\/]/.test(file)
	);

describe('isBlogEmbedComponent', () => {
	it('matches listed files and directories, with absolute or relative paths', () => {
		expect(isBlogEmbedComponent(`${root}/src/lib/components/blog/callouts/Callout.svelte`)).toBe(
			true
		);
		expect(isBlogEmbedComponent('src/lib/components/molecules/VoiceRecorder.svelte')).toBe(true);
		expect(isBlogEmbedComponent('C:\\9takes\\src\\lib\\components\\blog\\stress\\X.svelte')).toBe(
			true
		);
	});

	it('leaves blog page chrome and shared atoms alone', () => {
		expect(isBlogEmbedComponent(`${root}/src/lib/components/blog/TableOfContents.svelte`)).toBe(
			false
		);
		expect(isBlogEmbedComponent(`${root}/src/lib/components/atoms/Modal.svelte`)).toBe(false);
		expect(isBlogEmbedComponent(`${root}/src/lib/components/blog/callouts/index.ts`)).toBe(false);
		expect(isBlogEmbedComponent(undefined)).toBe(false);
	});
});

describe('blog embed CSS coverage', () => {
	it('injects the CSS of every styled component a post embeds', () => {
		const seen = new Set<string>();
		const queue = postFiles().flatMap(svelteImports);
		while (queue.length) {
			const file = queue.pop()!;
			if (seen.has(file)) continue;
			seen.add(file);
			queue.push(...svelteImports(file));
		}

		const uncovered = [...seen]
			.map((file) => path.relative(root, file).replaceAll('\\', '/'))
			.filter(
				(file) =>
					/<style[\s>]/.test(fs.readFileSync(path.join(root, file), 'utf8')) &&
					!isBlogEmbedComponent(file) &&
					!LINKED_BY_POST_PAGES.has(file)
			)
			.sort();

		// A styled component listed here links its stylesheet on every post page. Add it to
		// BLOG_EMBED_CSS_PATHS in src/lib/blogEmbedCss.js.
		expect(uncovered).toEqual([]);
		expect(seen.size).toBeGreaterThan(10);
	});
});
