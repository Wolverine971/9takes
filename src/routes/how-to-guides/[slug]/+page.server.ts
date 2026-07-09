// src/routes/how-to-guides/[slug]/+page.server.ts
import {
	loadBlogPostMetadata,
	selectHowToRelatedPosts,
	type RawBlogModules
} from '$lib/server/relatedBlogPosts';
import type { PageServerLoad } from './$types';

const RAW_GUIDE_MODULES = import.meta.glob(
	[`/src/blog/guides/*.{md,svx,svelte.md}`, '!**/personality-maxing-notes.md'],
	{
		query: '?raw',
		import: 'default'
	}
) as RawBlogModules;

export const load: PageServerLoad = async ({ params }) => {
	const posts = await loadBlogPostMetadata(RAW_GUIDE_MODULES);

	return {
		posts: selectHowToRelatedPosts(posts, params.slug)
	};
};
