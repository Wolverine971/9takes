import { supabase } from '$lib/supabase';
import type { Actions } from './$types';
import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
import { slugFromPath } from '$lib/slugFromPath';

const MAX_POSTS = 20;

export const load: PageServerLoad = async ({ url }): Promise<{ people: App.BlogPost[] }> => {
	const modules = import.meta.glob(`/src/blog/people/*.{md,svx,svelte.md}`);

	const posts: any = await getAllPosts();
	// 	Object.entries(modules).map(([path, resolver]) =>
	// 	resolver().then(
	// 		(post) =>
	// 			({
	// 				slug: slugFromPath(path),
	// 				...(post as unknown as App.MdsvexFile).metadata
	// 			} as App.BlogPost)
	// 	)
	// );

	// const posts = await Promise.all(postPromises);
	const publishedPosts = posts.filter((post) => post.published); //.slice(0, MAX_POSTS);

	const uniqueTypes = Array.from(new Set(publishedPosts.map(obj => obj?.enneagram)));

	// Store objects of unique types
	const uniqueObjects: any[] = [];

	// Iterate through unique types
	uniqueTypes.forEach(enneagram => {
		// Find objects with current type
		const objectsWithType = publishedPosts.filter(obj => obj?.enneagram === enneagram);

		// Sort objects by date_created
		objectsWithType.sort((a, b) => new Date(b.lastmod) - new Date(a.lastmod));

		// Push first 3 objects to uniqueObjects
		uniqueObjects.push(...objectsWithType.slice(0, 3));
	});



	return { people: uniqueObjects };
};

const getAllPosts = async () => {
	const celebrities = import.meta.glob(`/src/blog/people/celebrities/*.{md,svx,svelte.md}`);
	const comedians = import.meta.glob(`/src/blog/people/comedians/*.{md,svx,svelte.md}`);
	const creators = import.meta.glob(`/src/blog/people/creators/*.{md,svx,svelte.md}`);
	const lifestyleInfluencers = import.meta.glob(
		`/src/blog/people/lifestyle-influencers/*.{md,svx,svelte.md}`
	);
	const movieStars = import.meta.glob(`/src/blog/people/movie-stars/*.{md,svx,svelte.md}`);
	const historical = import.meta.glob(`/src/blog/people/historical/*.{md,svx,svelte.md}`);
	const musicians = import.meta.glob(`/src/blog/people/musicians/*.{md,svx,svelte.md}`);
	const politicians = import.meta.glob(`/src/blog/people/politicians/*.{md,svx,svelte.md}`);
	const techies = import.meta.glob(`/src/blog/people/techies/*.{md,svx,svelte.md}`);
	const tiktokers = import.meta.glob(`/src/blog/people/tiktokers/*.{md,svx,svelte.md}`);

	const imports = [
		celebrities,
		comedians,
		creators,
		lifestyleInfluencers,
		movieStars,
		historical,
		musicians,
		politicians,
		techies,
		tiktokers
	];

	const body = [];

	for (const category in imports) {
		for (const path in imports[category]) {
			body.push(
				imports[category][path]().then(({ metadata }) => {
					const parts = path.split('/');
					const slug = slugFromPath(parts[parts.length - 1]);

					if (metadata && metadata.published) {
						return {
							...metadata, // may not be required for sitemap
							path,
							slug
						};
					}
				})
			);
		}
	}
	const posts = await Promise.all(body);

	return posts.filter((p) => {
		if (p?.published && p?.loc) {
			return true;
		}
	});
};

export const actions: Actions = {
	createComment: async ({ request, getClientAddress }) => {
		try {
			const body = Object.fromEntries(await request.formData());

			const comment = body.comment as string;
			const author_id = body.author_id === 'undefined' ? null : body.author_id;
			const blog_link = body.blog_link;
			const blog_type = 'famous-enneagram-types';
			const ip = getClientAddress();
			const fingerprint = body.fingerprint as string;

			const { data: insertedComment, error: insertedCommentError } = await supabase
				.from('blog_comments')
				.insert({
					comment,
					blog_link,
					blog_type,
					author_id,
					ip,
					fingerprint
				})
				.select();

			if (insertedCommentError) {
				console.log(insertedCommentError);
			}
			return insertedComment;
		} catch (e) {
			console.log(e);
			return null;
		}
	}
};
