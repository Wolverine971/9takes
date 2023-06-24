import type { PageServerLoad } from './$types';
import { slugFromPath } from '$lib/slugFromPath';

const MAX_POSTS = 20;

export const load: PageServerLoad = async ({ url }) => {
	const modules = import.meta.glob(`/src/blog/enneagram/*.{md,svx,svelte.md}`);

	const postPromises = Object.entries(modules).map(([path, resolver]) =>
		resolver().then(
			(post) =>
			({
				...(post as unknown as App.MdsvexFile).metadata,
				slug: slugFromPath(path),
			} as App.BlogPost)
		)
	);

	const posts = await Promise.all(postPromises);
	const publishedPosts = posts.filter((post) => post.published); //.slice(0, MAX_POSTS);

	publishedPosts.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));

	return { enneagramBlogs: publishedPosts };
};
