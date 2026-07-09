// src/routes/pop-culture/[slug]/+page.ts
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { slugFromPath } from '$lib/slugFromPath';

export const load: PageLoad = async ({ params, data }) => {
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

	return {
		component: post.default,
		frontmatter: post.metadata,
		slug: params.slug,
		posts: data.posts
	};
};
