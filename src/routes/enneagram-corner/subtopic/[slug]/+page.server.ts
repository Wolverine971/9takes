// src/routes/enneagram-corner/subtopic/[slug]/+page.server.ts
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { slugFromPath } from '$lib/slugFromPath';

// Must stay in sync with sectionMeta in EnneagramCategoryIntro.svelte and
// ENNEAGRAM_SUBTOPIC_SLUGS in scripts/generate-sitemap.js. Unknown slugs 404
// so we never serve duplicate overview content on arbitrary indexable URLs.
const KNOWN_SUBTOPICS = [
	'overview',
	'nine-types',
	'development',
	'relationships',
	'workplace',
	'resources',
	'situational'
];

export const load: PageServerLoad = async ({
	params
}): Promise<{ posts: App.BlogPost[]; slug: string }> => {
	const slug = params.slug;

	if (!KNOWN_SUBTOPICS.includes(slug)) {
		throw error(404, 'Subtopic not found');
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
	// Match any type tag, not just the primary one, so multi-topic posts
	// (e.g. ['situational', 'relationships']) surface on every relevant hub.
	const publishedPosts = posts.filter((post) => post.published && post.type?.includes(slug));

	publishedPosts.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));

	return { posts: publishedPosts, slug };
};
