// routes/enneagram-corner/subtopic/[slug]/+page.server.ts
import type { PageServerLoad } from './$types';
import { slugFromPath } from '$lib/slugFromPath';

export const load: PageServerLoad = async ({
	url,
	params
}): Promise<{ posts: App.BlogPost[]; slug: string }> => {
	const slug = params.slug;

	const modules = import.meta.glob(`/src/blog/enneagram/*.{md,svx,svelte.md}`);

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
	const publishedPosts = posts.filter((post) => post.published && post.type?.[0] === slug); //.slice(0, MAX_POSTS);

	publishedPosts.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));

	return { posts: publishedPosts, slug };
};
