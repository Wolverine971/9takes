// src/lib/server/analyticsPageLastModified.spec.ts
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it, vi } from 'vitest';
import {
	readBlogLastModifiedFrontmatter,
	resolveAnalyticsPathsLastModified
} from './analyticsPageLastModified';

describe('readBlogLastModifiedFrontmatter', () => {
	it('matches the metadata MDsvex compiles: unquoted YAML dates become ISO strings', () => {
		const raw = [
			'---',
			'title: Example',
			'published: true',
			'date: 2025-01-15',
			"lastmod: '2025-03-02'",
			'loc: https://9takes.com/how-to-guides/example',
			'---',
			'',
			'Body text.'
		].join('\n');

		expect(readBlogLastModifiedFrontmatter(raw)).toEqual({
			published: true,
			date: '2025-01-15T00:00:00.000Z',
			lastmod: '2025-03-02',
			loc: 'https://9takes.com/how-to-guides/example'
		});
	});

	it('returns empty fields for a file without frontmatter and null for non-text', () => {
		expect(readBlogLastModifiedFrontmatter('Just a body.')).toEqual({});
		expect(readBlogLastModifiedFrontmatter(undefined)).toBeNull();
	});

	it('returns null for unparseable frontmatter instead of failing the whole index', () => {
		const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
		expect(readBlogLastModifiedFrontmatter('---\ntitle: [unclosed\n---\n')).toBeNull();
		consoleError.mockRestore();
	});
});

describe('resolveAnalyticsPathsLastModified', () => {
	it('indexes published guides from their raw frontmatter', async () => {
		const guidesDir = path.join(process.cwd(), 'src/blog/guides');
		const guide = readdirSync(guidesDir)
			.filter((file) => file.endsWith('.md') && file !== 'personality-maxing-notes.md')
			.map((file) => {
				const { data } = matter(readFileSync(path.join(guidesDir, file), 'utf8'), {});
				const publicPath =
					typeof data.loc === 'string' && data.loc
						? new URL(data.loc).pathname
						: `/how-to-guides/${file.replace(/\.md$/, '')}`;
				return { publicPath, data };
			})
			.find(({ data }) => data.published === true && (data.lastmod || data.date));
		expect(guide).toBeDefined();

		const expected = JSON.parse(JSON.stringify(guide!.data.lastmod || guide!.data.date));
		const resolved = await resolveAnalyticsPathsLastModified({} as any, [
			guide!.publicPath,
			'/not-a-tracked-page'
		]);

		expect(resolved.get(guide!.publicPath)).toBe(String(expected).trim());
		expect(resolved.get('/not-a-tracked-page')).toBeNull();
	});
});
