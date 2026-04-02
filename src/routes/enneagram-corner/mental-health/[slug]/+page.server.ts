// src/routes/enneagram-corner/mental-health/[slug]/+page.server.ts

import { dev } from '$app/environment';
import { slugFromPath } from '$lib/slugFromPath';
import matter from 'gray-matter';
import type { PageServerLoad } from './$types';

const MAX_POSTS = 6;

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	if (!dev) {
		setHeaders({
			// Keep article requests uncached so hooks.server can inspect every fetch.
			'Cache-Control': 'private, no-store'
		});
	} else {
		setHeaders({
			'Cache-Control': 'no-store'
		});
	}

	const modules = import.meta.glob(
		[
			`/src/blog/enneagram/mental-health/*.{md,svx,svelte.md}`,
			'!**/*.instagram.md',
			'!**/*.twitter.md',
			'!**/*.reddit.md',
			'!**/*.review.md'
		],
		{
			query: '?raw',
			import: 'default',
			eager: true
		}
	);

	const posts = Object.entries(modules).map(([path, raw]) => {
		const { data: metadata } = matter(raw as string);
		return {
			...(metadata as App.BlogPost),
			slug: slugFromPath(path)
		};
	});

	const publishedPosts = posts
		.filter((post) => post.published)
		.filter((post) => post.blog)
		.filter((post) => params.slug !== post.slug)
		.sort(() => 0.5 - Math.random())
		.slice(0, MAX_POSTS);

	return {
		posts: publishedPosts
	};
};
