// src/routes/pop-culture/[slug]/+page.ts
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { slugFromPath } from '$lib/slugFromPath';
import { getPopCultureSimilarityScore } from '$lib/data/popCultureTaxonomy';

function getPostSortTime(post: Pick<App.BlogPost, 'lastmod' | 'date'>): number {
	return new Date(post.lastmod || post.date).getTime();
}

export const load: PageLoad = async ({ params }) => {
	const modules = import.meta.glob([
		`/src/blog/pop-culture/*.{md,svx,svelte.md}`,
		'!**/*-twitter.md',
		'!**/incel-exit-post.md',
		'!**/template.md'
	]);

	let match: { path?: string; resolver?: App.MdsvexResolver } = {};

	for (const [path, resolver] of Object.entries(modules)) {
		if (slugFromPath(path) === params.slug) {
			match = { path, resolver: resolver as unknown as App.MdsvexResolver };
			break;
		}
	}

	const post = await match?.resolver?.();

	if (!post || !post.metadata.published) {
		throw error(404, {
			message: `Post not found: ${params.slug}`
		});
	}

	const currentPost = post.metadata as App.BlogPost;

	// Get related posts for suggestions (excluding current), preferring the
	// same pop-culture category, subcategory, and series before recency.
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
		.filter((p) => p.published && p.slug !== params.slug)
		.sort((a, b) => {
			const scoreDiff =
				getPopCultureSimilarityScore(currentPost.popCulture, b.popCulture) -
				getPopCultureSimilarityScore(currentPost.popCulture, a.popCulture);

			if (scoreDiff !== 0) return scoreDiff;
			return getPostSortTime(b) - getPostSortTime(a);
		})
		.slice(0, 6);

	return {
		component: post.default,
		frontmatter: post.metadata,
		slug: params.slug,
		posts: publishedPosts
	};
};
