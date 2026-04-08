// src/lib/server/blogIndexing.spec.ts
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
	cleanContent,
	extractHeadings,
	getEntryOperation,
	parseMarkdownFile
} from '../../../scripts/index-blogs-to-supabase.js';

const tempDirectories: string[] = [];

afterEach(async () => {
	await Promise.all(
		tempDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true }))
	);
});

describe('blog indexing helpers', () => {
	it('preserves markdown headings while stripping noisy markup', () => {
		const cleaned = cleanContent(`
## Searchable Heading

Paragraph with [linked text](https://example.com) and \`inline code\`.

<script>window.alert('x')</script>
<PromoBanner />
`);

		expect(cleaned).toContain('## Searchable Heading');
		expect(cleaned).toContain('Paragraph with linked text and inline code.');
		expect(cleaned).not.toContain('<script>');
		expect(cleaned).not.toContain('<PromoBanner');
	});

	it('extracts normalized headings for weighted indexing', () => {
		const headings = extractHeadings(`
# Top Level
## People & [Titles](https://example.com)
### **Subhead** with \`code\`
`);

		expect(headings).toEqual(['Top Level', 'People & Titles', 'Subhead with code']);
	});

	it('uses content hashes and publication state to decide sync operations', () => {
		const entry = {
			slug: 'search-strategy',
			content_hash: 'hash-1',
			published: true,
			path: 'src/blog/guides/search-strategy.md'
		};

		expect(getEntryOperation(null, entry, false)).toBe('insert');
		expect(getEntryOperation({ ...entry }, entry, false)).toBe('skip');
		expect(getEntryOperation({ ...entry, content_hash: 'hash-0' }, entry, false)).toBe('update');
		expect(getEntryOperation({ ...entry, published: false }, entry, false)).toBe('update');
		expect(getEntryOperation({ ...entry }, entry, true)).toBe('update');
	});

	it('parses markdown files into indexed blog records with headings and hashes', async () => {
		const directory = await mkdtemp(path.join(os.tmpdir(), 'blog-indexer-'));
		tempDirectories.push(directory);

		const blogRoot = path.join(directory, 'src', 'blog', 'guides');
		await mkdir(blogRoot, { recursive: true });
		const filePath = path.join(blogRoot, 'better-search.md');

		await writeFile(
			filePath,
			`---
title: Better Search
description: Designing a universal search
date: 2026-04-08
type:
  - how-to
---

## Why Search Matters

Search helps people find the right answer faster.
`,
			'utf8'
		);

		const entry = await parseMarkdownFile(filePath, {
			path: 'src/blog/guides',
			category: 'guides',
			route: '/how-to-guides'
		});

		expect(entry).not.toBeNull();
		expect(entry?.slug).toBe('better-search');
		expect(entry?.category).toBe('guides');
		expect(entry?.url).toBe('/how-to-guides/better-search');
		expect(entry?.headings).toEqual(['Why Search Matters']);
		expect(entry?.content_hash).toMatch(/^[a-f0-9]{64}$/);
		expect(entry?.tags).toContain('guides');
	});
});
