// src/routes/enneagram-corner/[slug]/+page.ts
import type { PageLoad } from './$types';
import { slugFromPath } from '$lib/slugFromPath';
import { error, redirect } from '@sveltejs/kit';

const redirectMap = {
	'enneagram-communication-overview': 'enneagram-communication-guide',
	'enneagram-communication-in-relationships': 'relationship-communication-guide'
};

export const load: PageLoad = async ({ params, data }) => {
	if (redirectMap[params.slug]) {
		// throw error(301, redirectMap[params.slug]);
		throw redirect(302, redirectMap[params.slug]);
	}
	const modules = import.meta.glob(`/src/blog/enneagram/**/*.{md,svx,svelte.md}`);

	let match: { path?: string; resolver?: App.MdsvexResolver } = {};
	for (const [path, resolver] of Object.entries(modules)) {
		if (slugFromPath(path) === params.slug) {
			match = { path, resolver: resolver as unknown as App.MdsvexResolver };
			break;
		}
	}

	const post = await match?.resolver?.();

	// publishedPosts.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));

	if (!post || !post?.metadata?.published) {
		// throw error(404); // Couldn't resolve the post
		throw error(404, {
			message: `Couldn't find the blog`
		});
	}

	return {
		...data, // Pass through server data (posts)
		component: post.default,
		frontmatter: post.metadata as App.BlogPost,
		slug: params.slug
	};
};
