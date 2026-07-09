// src/lib/server/relatedBlogPosts.spec.ts
import { describe, expect, it, vi } from 'vitest';
import {
	loadBlogPostMetadata,
	selectCommunityRelatedPosts,
	selectHowToRelatedPosts,
	selectPopCultureRelatedPosts,
	type RawBlogModules
} from './relatedBlogPosts';

function post(overrides: Partial<App.BlogPost> & Pick<App.BlogPost, 'slug'>): App.BlogPost {
	return {
		title: overrides.title ?? overrides.slug,
		author: overrides.author ?? 'DJ Wayne',
		description: overrides.description ?? `${overrides.slug} description`,
		date: overrides.date ?? '2026-01-01',
		loc: overrides.loc ?? '',
		lastmod: overrides.lastmod ?? overrides.date ?? '2026-01-01',
		changefreq: overrides.changefreq ?? 'monthly',
		priority: overrides.priority ?? '0.6',
		published: overrides.published ?? true,
		...overrides,
		slug: overrides.slug
	};
}

describe('loadBlogPostMetadata', () => {
	it('parses raw frontmatter and caches each module graph', async () => {
		const resolver = vi.fn(
			async () => `---
title: Cached post
author: DJ Wayne
description: Cached description
date: '2026-01-01'
lastmod: '2026-01-02'
published: true
---

Body`
		);
		const modules: RawBlogModules = {
			'/src/blog/guides/cached-post.md': resolver
		};

		const first = await loadBlogPostMetadata(modules);
		const second = await loadBlogPostMetadata(modules);

		expect(resolver).toHaveBeenCalledTimes(1);
		expect(first).toBe(second);
		expect(first[0]).toMatchObject({
			slug: 'cached-post',
			title: 'Cached post',
			published: true
		});
	});
});

describe('selectHowToRelatedPosts', () => {
	it('returns the newest published siblings without the current article', () => {
		const posts = [
			post({ slug: 'current', lastmod: '2026-07-01' }),
			post({ slug: 'older', lastmod: '2026-05-01' }),
			post({ slug: 'newest', lastmod: '2026-07-08' }),
			post({ slug: 'draft', lastmod: '2026-07-09', published: false })
		];

		expect(selectHowToRelatedPosts(posts, 'current').map(({ slug }) => slug)).toEqual([
			'newest',
			'older'
		]);
	});
});

describe('selectCommunityRelatedPosts', () => {
	it('matches Enneagram or type labels, then sorts by recency', () => {
		const posts = [
			post({ slug: 'current', enneagram: 5, type: ['analysis'], lastmod: '2026-07-01' }),
			post({ slug: 'same-enneagram', enneagram: '5', lastmod: '2026-06-01' }),
			post({ slug: 'same-type-newer', type: ['analysis', 'culture'], lastmod: '2026-07-08' }),
			post({ slug: 'unrelated', enneagram: 2, type: ['relationships'], lastmod: '2026-07-09' })
		];

		expect(selectCommunityRelatedPosts(posts, 'current').map(({ slug }) => slug)).toEqual([
			'same-type-newer',
			'same-enneagram'
		]);
	});
});

describe('selectPopCultureRelatedPosts', () => {
	it('prefers taxonomy similarity before recency and uses recency as the tiebreaker', () => {
		const posts = [
			post({
				slug: 'current',
				lastmod: '2026-07-01',
				popCulture: { category: 'tech-business', subcategory: 'ai-power', series: 'ai-race' }
			}),
			post({
				slug: 'same-series-older',
				lastmod: '2026-05-01',
				popCulture: { category: 'tech-business', subcategory: 'ai-power', series: 'ai-race' }
			}),
			post({
				slug: 'same-subcategory-newer',
				lastmod: '2026-07-08',
				popCulture: { category: 'tech-business', subcategory: 'ai-power' }
			}),
			post({
				slug: 'unrelated-newest',
				lastmod: '2026-07-09',
				popCulture: { category: 'politics-power', subcategory: 'presidents' }
			})
		];

		expect(selectPopCultureRelatedPosts(posts, 'current').map(({ slug }) => slug)).toEqual([
			'same-series-older',
			'same-subcategory-newer',
			'unrelated-newest'
		]);
	});
});
