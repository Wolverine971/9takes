import { supabase } from '$lib/supabase';
import type { Actions } from './$types';

import type { PageServerLoad } from './$types';
import { slugFromPath } from '$lib/slugFromPath';

export const load: PageServerLoad = async ({
	url,
	params
}): Promise<{ people: App.BlogPost[]; slug: string }> => {
	const slug = params.slug;

	const posts: any = await getAllPosts(slug);
	const publishedPosts = posts;

	publishedPosts.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));

	return { people: publishedPosts, slug };
};

const getAllPosts = async (type) => {
	const celebrities = import.meta.glob(`/src/blog/people/celebrities/*.{md,svx,svelte.md}`);
	const comedians = import.meta.glob(`/src/blog/people/comedians/*.{md,svx,svelte.md}`);
	const creators = import.meta.glob(`/src/blog/people/creators/*.{md,svx,svelte.md}`);
	const lifestyleInfluencers = import.meta.glob(
		`/src/blog/people/lifestyle-influencers/*.{md,svx,svelte.md}`
	);
	const movieStars = import.meta.glob(`/src/blog/people/movie-stars/*.{md,svx,svelte.md}`);
	const newMovieStars = import.meta.glob(`/src/blog/people/new-movie-stars/*.{md,svx,svelte.md}`);
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
		newMovieStars,
		historical,
		musicians,
		politicians,
		techies,
		tiktokers
	];

	const body = [];
	const typeString = type.toString();

	for (const category in imports) {
		for (const path in imports[category]) {
			body.push(
				imports[category][path]().then(({ metadata }) => {
					const parts = path.split('/');
					const slug = slugFromPath(parts[parts.length - 1]);

					if (metadata && metadata.published && metadata.enneagram.toString() === typeString) {
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
			const blog_type = 'personality-analysis';
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
