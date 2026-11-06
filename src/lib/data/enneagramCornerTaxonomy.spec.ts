// src/lib/data/enneagramCornerTaxonomy.spec.ts
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import {
	CORNER_SECTIONS,
	getPostLane,
	getPostSections,
	getSubtopicProblems
} from './enneagramCornerTaxonomy.js';
import { CORNER_SECTION_COPY } from './enneagramCornerSectionCopy';
import { buildSectionView, toCornerPost } from '$lib/server/enneagramCornerSections';
import type { CornerPost } from '$lib/types/enneagramCorner';

const BLOG_DIR = join(process.cwd(), 'src/blog/enneagram');
const SKIP_FILE = /\.(instagram|twitter|reddit|review)\.md$|^blog-optimization-strategies\.md$/;

function listPostFiles(dir: string): string[] {
	return readdirSync(dir).flatMap((name) => {
		const full = join(dir, name);
		if (statSync(full).isDirectory()) return name === 'drafts' ? [] : listPostFiles(full);
		return /\.(md|svx)$/.test(name) && !SKIP_FILE.test(name) ? [full] : [];
	});
}

function post(overrides: Partial<CornerPost>): CornerPost {
	return {
		slug: 'post',
		href: '/enneagram-corner/post',
		title: 'Post',
		description: '',
		pic: null,
		date: '2026-01-01',
		lastmod: '2026-01-01',
		published: true,
		type: [],
		subtopics: [],
		...overrides
	};
}

describe('enneagram corner taxonomy', () => {
	it('uses each subtopic slug once, and never a section slug', () => {
		const sectionSlugs = CORNER_SECTIONS.map((s) => s.slug);
		const subtopicSlugs = CORNER_SECTIONS.flatMap((s) => s.subtopics.map((t) => t.slug));
		expect(new Set(subtopicSlugs).size).toBe(subtopicSlugs.length);
		expect(subtopicSlugs.filter((slug) => sectionSlugs.includes(slug))).toEqual([]);
	});

	it('has page copy for every section', () => {
		for (const section of CORNER_SECTIONS) {
			const copy = CORNER_SECTION_COPY[section.slug];
			expect(copy, section.slug).toBeDefined();
			expect(copy.title.endsWith(copy.titleQuiet), section.slug).toBe(true);
		}
	});

	it('matches the sitemap subtopic list (all sections except mental-health)', () => {
		const sitemap = readFileSync(join(process.cwd(), 'scripts/generate-sitemap.js'), 'utf8');
		const block = sitemap.match(/ENNEAGRAM_SUBTOPIC_SLUGS = \[([\s\S]*?)\]/)?.[1] ?? '';
		const slugs = [...block.matchAll(/'([\w-]+)'/g)].map((m) => m[1]).sort();
		const expected = CORNER_SECTIONS.map((s) => s.slug)
			.filter((slug) => slug !== 'mental-health')
			.sort();
		expect(slugs).toEqual(expected);
	});

	it('every live Enneagram Corner post has a valid subtopic for each of its sections', () => {
		const problems = listPostFiles(BLOG_DIR).flatMap((file) => {
			const data = matter(readFileSync(file, 'utf8')).data;
			return getSubtopicProblems(data).map((problem) => `${file}: ${problem}`);
		});
		// Fix: add `subtopics: [...]` under `type:` (slugs in enneagramCornerTaxonomy.js),
		// then run `pnpm audit:corner-subtopics`.
		expect(problems).toEqual([]);
	});

	it('cross-lists a post on every section its subtopics name', () => {
		const ghosted = { type: ['situational'], subtopics: ['real-life-dating', 'dating'] };
		expect(getPostSections(ghosted).sort()).toEqual(['relationships', 'situational']);
		expect(getPostLane(ghosted, 'relationships')?.slug).toBe('dating');
		expect(getPostLane(ghosted, 'situational')?.slug).toBe('real-life-dating');
	});

	it('flags missing and unknown subtopics on published posts only', () => {
		expect(getSubtopicProblems({ type: ['relationships'], published: true })).toEqual([
			'no subtopic for section "relationships"'
		]);
		expect(getSubtopicProblems({ type: ['relationships'], published: false })).toEqual([]);
		expect(
			getSubtopicProblems({ type: ['relationships'], subtopics: ['nope'], published: false })
		).toEqual(['unknown subtopic "nope"']);
	});
});

describe('buildSectionView', () => {
	it('groups posts into lanes, drops empty lanes, and skips drafts', () => {
		const view = buildSectionView(
			[
				post({ slug: 'a', type: ['relationships'], subtopics: ['dating'] }),
				post({ slug: 'b', type: ['situational'], subtopics: ['real-life-dating', 'dating'] }),
				post({ slug: 'c', type: ['relationships'], subtopics: ['couples'] }),
				post({ slug: 'd', type: ['relationships'], subtopics: ['couples'], published: false })
			],
			'relationships'
		);
		expect(view.total).toBe(3);
		expect(view.lanes.map((lane) => [lane.slug, lane.posts.map((p) => p.slug)])).toEqual([
			['couples', ['c']],
			['dating', ['a', 'b']]
		]);
		expect(view.emptyLanes).toContain('friendship');
	});

	it('orders nine-types lanes by type number', () => {
		const view = buildSectionView(
			[9, 1, 8].map((n) =>
				post({ slug: `enneagram-type-${n}`, type: ['nine-types'], subtopics: ['gut-types'] })
			),
			'nine-types'
		);
		expect(view.lanes[0].posts.map((p) => p.slug)).toEqual([
			'enneagram-type-1',
			'enneagram-type-8',
			'enneagram-type-9'
		]);
	});

	it('links mental-health folder posts under /mental-health/', () => {
		expect(
			toCornerPost('/src/blog/enneagram/mental-health/enneagram-therapy-guide.md', {
				title: 'T'
			})?.href
		).toBe('/enneagram-corner/mental-health/enneagram-therapy-guide');
		expect(toCornerPost('/src/blog/enneagram/enneagram-faqs.md', { title: 'T' })?.href).toBe(
			'/enneagram-corner/enneagram-faqs'
		);
	});
});
