// src/routes/enneagram-corner/+page.server.ts
import type { PageServerLoad } from './$types';
import { slugFromPath } from '$lib/slugFromPath';

// const MAX_POSTS = 20;

export const load: PageServerLoad = async () => {
	type EnneagramIndexPost = Pick<
		App.BlogPost,
		'slug' | 'title' | 'description' | 'date' | 'lastmod' | 'published' | 'type' | 'pic'
	>;

	const modules = import.meta.glob([
		`/src/blog/enneagram/**/*.{md,svx,svelte.md}`,
		'!**/drafts/**',
		'!**/*.instagram.md',
		'!**/*.twitter.md',
		'!**/*.reddit.md',
		'!**/*.review.md',
		'!**/blog-optimization-strategies.md'
	]);

	const postPromises = Object.entries(modules).map(async ([path, resolver]) => {
		const post = await resolver();
		const metadata = (post as Partial<App.MdsvexFile>).metadata;
		if (!metadata?.title || !metadata?.description || !metadata?.date) {
			return null;
		}

		return {
			slug: slugFromPath(path),
			title: metadata.title,
			description: metadata.description,
			date: metadata.date,
			lastmod: metadata.lastmod ?? metadata.date,
			published: Boolean(metadata.published),
			type: Array.isArray(metadata.type) ? metadata.type : [],
			pic: metadata.pic
		} as EnneagramIndexPost;
	});

	const posts = (await Promise.all(postPromises)).filter(
		(post): post is EnneagramIndexPost => post !== null
	);
	const publishedPosts = posts.filter((post) => post.published); //.slice(0, MAX_POSTS);

	const uniqueTypes = Array.from(new Set(publishedPosts.map((obj) => obj?.type?.[0])));

	// Store objects of unique types
	const uniqueObjects: EnneagramIndexPost[] = [];
	// Total post count per topic (used by the page to render
	// "View all N reads · M more →" CTAs).
	const topicCounts: Record<string, number> = {};

	// Iterate through unique types
	uniqueTypes.forEach((type) => {
		if (!type) return;
		if (type === 'nine-types') {
			const objectsWithType = publishedPosts.filter((obj) => obj?.type?.[0] === 'nine-types');
			topicCounts[type] = objectsWithType.length;
			uniqueObjects.push(...objectsWithType);
			return;
		}

		// Find objects with current type
		const objectsWithType = publishedPosts.filter((obj) => obj?.type?.[0] === type);
		topicCounts[type] = objectsWithType.length;

		// Sort objects by date_created
		objectsWithType.sort((a, b) => new Date(b.lastmod).getTime() - new Date(a.lastmod).getTime());

		// Push first 6 objects (fills 2 full rows in the 3-col topic grid)
		uniqueObjects.push(...objectsWithType.slice(0, 6));
	});

	const sortedByLastmod = [...publishedPosts].sort(
		(a, b) => new Date(b.lastmod || b.date).getTime() - new Date(a.lastmod || a.date).getTime()
	);
	const featured = sortedByLastmod.slice(0, 2);
	const featuredSlugs = new Set(featured.map((p) => p.slug));
	const recentlyUpdated = sortedByLastmod.filter((p) => !featuredSlugs.has(p.slug)).slice(0, 4);

	// Earliest publish + latest update across the whole hub — feeds visible
	// "Last updated" surface and `datePublished`/`dateModified` in JSON-LD.
	let earliestPublish: string | null = null;
	let latestUpdate: string | null = null;
	for (const post of publishedPosts) {
		if (post.date) {
			const t = new Date(post.date).getTime();
			if (
				!Number.isNaN(t) &&
				(earliestPublish === null || t < new Date(earliestPublish).getTime())
			) {
				earliestPublish = post.date;
			}
		}
		const updated = post.lastmod ?? post.date;
		if (updated) {
			const t = new Date(updated).getTime();
			if (!Number.isNaN(t) && (latestUpdate === null || t > new Date(latestUpdate).getTime())) {
				latestUpdate = updated;
			}
		}
	}

	return {
		enneagramBlogs: uniqueObjects,
		featured,
		recentlyUpdated,
		topicCounts,
		earliestPublish,
		latestUpdate,
		totalPublished: publishedPosts.length
	};
};
