// src/routes/pop-culture/[slug]/+page.server.ts

import {
	loadBlogPostMetadata,
	selectPopCultureRelatedPosts,
	type RawBlogModules
} from '$lib/server/relatedBlogPosts';
import type { PageServerLoad } from './$types';

const RAW_POP_CULTURE_MODULES = import.meta.glob(
	[
		`/src/blog/pop-culture/*.{md,svx,svelte.md}`,
		'!**/*-twitter.md',
		'!**/incel-exit-post.md',
		'!**/template.md'
	],
	{
		query: '?raw',
		import: 'default'
	}
) as RawBlogModules;

export const load: PageServerLoad = async ({ params }) => {
	const posts = await loadBlogPostMetadata(RAW_POP_CULTURE_MODULES);

	return {
		posts: selectPopCultureRelatedPosts(posts, params.slug)
	};
};
