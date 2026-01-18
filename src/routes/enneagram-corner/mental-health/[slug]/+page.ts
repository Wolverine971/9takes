// src/routes/enneagram-corner/mental-health/[slug]/+page.ts
import type { PageLoad } from './$types';
import { slugFromPath } from '$lib/slugFromPath';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params, data }) => {
	// Import only main mental health blog posts (excluding social media versions)
	const modules = import.meta.glob(`/src/blog/enneagram/mental-health/*.{md,svx,svelte.md}`);

	let match: { path?: string; resolver?: App.MdsvexResolver } = {};
	for (const [path, resolver] of Object.entries(modules)) {
		// Skip social media versions
		if (
			path.includes('.instagram.') ||
			path.includes('.twitter.') ||
			path.includes('.reddit.') ||
			path.includes('.review.')
		) {
			continue;
		}
		if (slugFromPath(path) === params.slug) {
			match = { path, resolver: resolver as unknown as App.MdsvexResolver };
			break;
		}
	}

	const post = await match?.resolver?.();

	if (!post || !post?.metadata?.published) {
		throw error(404, {
			message: `Couldn't find the mental health blog post`
		});
	}

	return {
		...data, // Pass through server data (posts)
		component: post.default,
		frontmatter: post.metadata as App.BlogPost,
		slug: params.slug
	};
};
