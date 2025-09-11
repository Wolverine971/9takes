// src/routes/admin/drafts/+page.ts
import type { PageLoad } from './$types';
import { slugFromPath } from '$lib/slugFromPath';

export const load: PageLoad = async () => {
	const modules = import.meta.glob(`/src/blog/people/drafts/*.{md,svx,svelte.md}`);

	const postPromises = Object.entries(modules).map(([path, resolver]) =>
		resolver().then(
			(post) =>
				({
					...(post as unknown as App.MdsvexFile).metadata,
					slug: slugFromPath(path),
					path: path
				}) as App.BlogPost & { path: string }
		)
	);

	const posts = await Promise.all(postPromises);

	// Sort by last modified date, most recent first
	posts.sort((a, b) => (new Date(a.lastmod || a.date) > new Date(b.lastmod || b.date) ? -1 : 1));

	return {
		drafts: posts
	};
};
