// src/routes/pop-culture/[slug]/+page.ts
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { slugFromPath } from '$lib/slugFromPath';

export const load: PageLoad = async ({ params }) => {
	const modules = import.meta.glob(`/src/blog/pop-culture/*.{md,svx,svelte.md}`);

	let match: { path?: string; resolver?: App.MdsvexResolver } = {};

	for (const [path, resolver] of Object.entries(modules)) {
		if (slugFromPath(path) === params.slug) {
			match = { path, resolver: resolver as unknown as App.MdsvexResolver };
			break;
		}
	}

	const post = await match?.resolver?.();

	if (!post) {
		throw error(404, {
			message: `Post not found: ${params.slug}`
		});
	}

	// Get all posts for suggestions (excluding current)
	const postPromises = Object.entries(modules).map(([path, resolver]) =>
		resolver().then(
			(post) =>
				({
					slug: slugFromPath(path),
					...(post as unknown as App.MdsvexFile).metadata
				}) as App.BlogPost
		)
	);

	const posts = await Promise.all(postPromises);
	const publishedPosts = posts
		.filter((p) => p.published && p.slug !== params.slug)
		.sort((a, b) => (new Date(b.date) > new Date(a.date) ? 1 : -1))
		.slice(0, 3); // Get 3 suggestions

	return {
		component: post.default,
		frontmatter: post.metadata,
		slug: params.slug,
		posts: publishedPosts
	};
};
