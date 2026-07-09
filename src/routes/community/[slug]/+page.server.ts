// src/routes/community/[slug]/+page.server.ts
import {
	loadBlogPostMetadata,
	selectCommunityRelatedPosts,
	type RawBlogModules
} from '$lib/server/relatedBlogPosts';
import type { PageServerLoad } from './$types';

const RAW_COMMUNITY_MODULES = import.meta.glob(
	[`/src/blog/community/*.{md,svx,svelte.md}`, '!**/societal-ticking-time-bombs-fact-check.md'],
	{
		query: '?raw',
		import: 'default'
	}
) as RawBlogModules;

export const load: PageServerLoad = async ({ params }) => {
	const posts = await loadBlogPostMetadata(RAW_COMMUNITY_MODULES);

	return {
		posts: selectCommunityRelatedPosts(posts, params.slug)
	};
};
