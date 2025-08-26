// src/routes/enneagram-corner/mental-health/[slug]/+page.ts
import type { PageLoad } from './$types';
import { slugFromPath } from '$lib/slugFromPath';
import { error } from '@sveltejs/kit';

const MAX_POSTS = 6;

export const load: PageLoad = async ({ params }) => {
	// Import only mental health blog posts
	const modules = import.meta.glob(`/src/blog/enneagram/mental-health/*.{md,svx,svelte.md}`);

	let match: { path?: string; resolver?: App.MdsvexResolver } = {};
	for (const [path, resolver] of Object.entries(modules)) {
		if (slugFromPath(path) === params.slug) {
			match = { path, resolver: resolver as unknown as App.MdsvexResolver };
			break;
		}
	}

	const post = await match?.resolver?.();

	// Get other mental health posts for suggestions
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
	const publishedPosts = posts
		.filter((post) => post.published)
		.filter((post) => post.blog)
		.filter((post) => params.slug !== post.slug)
		.sort(() => 0.5 - Math.random())
		.slice(0, MAX_POSTS);

	if (!post || !post?.metadata?.published) {
		throw error(404, {
			message: `Couldn't find the mental health blog post`
		});
	}

	return {
		component: post.default,
		frontmatter: post.metadata as App.BlogPost,
		slug: params.slug,
		posts: publishedPosts
	};
};
