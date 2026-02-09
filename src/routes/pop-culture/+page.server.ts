// src/routes/pop-culture/+page.server.ts
import { slugFromPath } from '$lib/slugFromPath';
import type { PageServerLoad } from './$types';

const MAX_POSTS = 50;

export const load: PageServerLoad = async () => {
	const modules = import.meta.glob(`/src/blog/pop-culture/*.{md,svx,svelte.md}`);

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
	const publishedPosts = posts.filter((post) => post.published).slice(0, MAX_POSTS);

	publishedPosts.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));

	const sortedByLastmod = [...publishedPosts].sort(
		(a, b) => new Date(b.lastmod || b.date).getTime() - new Date(a.lastmod || a.date).getTime()
	);
	const featured = sortedByLastmod.slice(0, 1);
	const featuredSlugs = new Set(featured.map((p) => p.slug));
	const recentlyUpdated = sortedByLastmod.filter((p) => !featuredSlugs.has(p.slug)).slice(0, 3);

	return { popCultureBlogs: publishedPosts, featured, recentlyUpdated };
};
