// src/routes/community/+page.server.ts
import type { PageServerLoad } from './$types';
import { slugFromPath } from '$lib/slugFromPath';

const MAX_POSTS = 20;

export const load: PageServerLoad = async ({ url }) => {
	const modules = import.meta.glob([
		`/src/blog/community/*.{md,svx,svelte.md}`,
		'!**/societal-ticking-time-bombs-fact-check.md'
	]);

	const postPromises = Object.entries(modules).map(([path, resolver]) =>
		resolver().then(
			(post) =>
				({
					...(post as unknown as App.MdsvexFile).metadata,
					slug: slugFromPath(path)
				}) as App.BlogPost
		)
	);

	const posts = await Promise.all(postPromises);
	const publishedPosts = posts.filter((post) => post.published); //.slice(0, MAX_POSTS);

	publishedPosts.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));

	const sortedByLastmod = [...publishedPosts].sort(
		(a, b) => new Date(b.lastmod || b.date).getTime() - new Date(a.lastmod || a.date).getTime()
	);
	const featured = sortedByLastmod.slice(0, 2);
	const featuredSlugs = new Set(featured.map((p) => p.slug));
	const recentlyUpdated = sortedByLastmod.filter((p) => !featuredSlugs.has(p.slug)).slice(0, 4);

	return { posts: publishedPosts, featured, recentlyUpdated };
};
