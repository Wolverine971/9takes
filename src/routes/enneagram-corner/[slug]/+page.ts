// src/routes/enneagram-corner/[slug]/+page.ts
import type { PageLoad } from './$types';
import { slugFromPath } from '$lib/slugFromPath';
import { error, redirect } from '@sveltejs/kit';

const permanentRedirectMap: Record<string, string> = {
	'enneagram-communication-overview': '/enneagram-corner/relationship-communication-guide',
	'enneagram-communication-in-relationships': '/enneagram-corner/relationship-communication-guide',
	'enneagram-communication-guide': '/enneagram-corner/relationship-communication-guide',
	'enneagram-communication-styles': '/enneagram-corner/relationship-communication-guide',
	'enneagram-communication-tips': '/enneagram-corner/relationship-communication-guide',
	'enneagram-types-being-direct': '/enneagram-corner/relationship-communication-guide',
	'enneagram-types-overview': '/enneagram-corner/enneagram-tldr',
	'enneagram-test': '/enneagram-corner/enneagram-test-comparison-2026',
	'enneagram-anxiety-management-guide':
		'/enneagram-corner/mental-health/enneagram-anxiety-complete-guide',
	'anxiety-and-enneagram-types-guide':
		'/enneagram-corner/mental-health/enneagram-anxiety-complete-guide'
};

export const load: PageLoad = async ({ params, data, url }) => {
	const permanentTarget = permanentRedirectMap[params.slug];
	if (permanentTarget) {
		throw redirect(301, `${permanentTarget}${url.search}`);
	}
	const modules = import.meta.glob([
		`/src/blog/enneagram/**/*.{md,svx,svelte.md}`,
		'!**/drafts/**',
		'!**/*.instagram.md',
		'!**/*.twitter.md',
		'!**/*.reddit.md',
		'!**/*.review.md',
		'!**/blog-optimization-strategies.md'
	]);

	let match: { path?: string; resolver?: App.MdsvexResolver } = {};
	for (const [path, resolver] of Object.entries(modules)) {
		if (slugFromPath(path) === params.slug) {
			match = { path, resolver: resolver as unknown as App.MdsvexResolver };
			break;
		}
	}

	if (match.path?.includes('/mental-health/')) {
		throw redirect(301, `/enneagram-corner/mental-health/${params.slug}`);
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
