#!/usr/bin/env node
// scripts/audit-corner-subtopics.mjs
// Enneagram Corner subtopic audit: every published post in src/blog/enneagram
// needs a subtopic (frontmatter `subtopics`) for each section it lives in, and
// only slugs from src/lib/data/enneagramCornerTaxonomy.js are allowed.
//
// Usage:
//   pnpm audit:corner-subtopics            # problems + per-section lane counts; exit 1 on problems
//   pnpm audit:corner-subtopics -- --quiet # problems only
//
// Empty lanes are reported as content gaps, not failures.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import {
	CORNER_SECTIONS,
	getPostLane,
	getPostSections,
	getSubtopicProblems
} from '../src/lib/data/enneagramCornerTaxonomy.js';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const BLOG_DIR = join(ROOT, 'src/blog/enneagram');
const SKIP_FILE = /\.(instagram|twitter|reddit|review)\.md$|^blog-optimization-strategies\.md$/;
const quiet = process.argv.includes('--quiet');

/** Same file set the Enneagram Corner routes glob. */
export function listCornerPostFiles(dir = BLOG_DIR) {
	const files = [];
	for (const name of readdirSync(dir)) {
		const full = join(dir, name);
		if (statSync(full).isDirectory()) {
			if (name !== 'drafts') files.push(...listCornerPostFiles(full));
		} else if (/\.(md|svx)$/.test(name) && !SKIP_FILE.test(name)) {
			files.push(full);
		}
	}
	return files;
}

const posts = listCornerPostFiles().map((file) => ({
	file: relative(ROOT, file),
	...matter(readFileSync(file, 'utf8')).data
}));

const problems = posts.flatMap((post) =>
	getSubtopicProblems(post).map((problem) => `${post.file}: ${problem}`)
);

if (!quiet) {
	const published = posts.filter((post) => post.published);
	for (const section of CORNER_SECTIONS) {
		const members = published.filter((post) => getPostSections(post).includes(section.slug));
		console.log(`\n${section.title} (${section.slug}) · ${members.length} posts`);
		for (const subtopic of section.subtopics) {
			const count = members.filter(
				(post) => getPostLane(post, section.slug)?.slug === subtopic.slug
			).length;
			const flag = count === 0 ? '  ← content gap' : '';
			console.log(`  ${String(count).padStart(3)}  ${subtopic.title} [${subtopic.slug}]${flag}`);
		}
	}
	console.log('');
}

if (problems.length > 0) {
	console.error(`✗ ${problems.length} subtopic problem(s):`);
	for (const problem of problems) console.error(`  ${problem}`);
	console.error(
		'\nAdd `subtopics: [...]` under `type:` using slugs from src/lib/data/enneagramCornerTaxonomy.js.'
	);
	process.exit(1);
}

console.log(`✓ ${posts.length} Enneagram Corner posts tagged.`);
