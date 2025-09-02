// src/routes/enneagram-corner/+page.ts
import type { PageServerLoad } from './$types';
import { slugFromPath } from '$lib/slugFromPath';

// const MAX_POSTS = 20;

export const load: PageServerLoad = async () => {
	const modules = import.meta.glob(`/src/blog/enneagram/**/*.{md,svx,svelte.md}`);

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
	const publishedPosts = posts.filter((post) => post.published); //.slice(0, MAX_POSTS);

	const uniqueTypes = Array.from(new Set(publishedPosts.map((obj) => obj?.type?.[0])));

	// Store objects of unique types
	const uniqueObjects: any[] = [];

	// Iterate through unique types
	uniqueTypes.forEach((type) => {
		if (type === 'nine-types') {
			const objectsWithType = publishedPosts.filter((obj) => obj?.type?.[0] === 'nine-types');
			uniqueObjects.push(...objectsWithType);
			return;
		}

		// Find objects with current type
		const objectsWithType = publishedPosts.filter((obj) => obj?.type?.[0] === type);

		// Sort objects by date_created
		objectsWithType.sort((a, b) => new Date(b.lastmod) - new Date(a.lastmod));

		// Push first 3 objects to uniqueObjects
		uniqueObjects.push(...objectsWithType.slice(0, 5));
	});

	return { enneagramBlogs: uniqueObjects };
};
