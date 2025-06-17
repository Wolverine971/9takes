// routes/personality-analysis/type/[slug]/+page.server.ts
import { supabase } from '$lib/supabase';
import type { Actions } from './$types';

import type { PageServerLoad } from './$types';
import { slugFromPath } from '$lib/slugFromPath';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({
	url,
	params
}): Promise<{ people: App.BlogPost[]; slug: string }> => {
	const slug = params.slug;

	const { data: personData, error: personDataError } = await supabase
		.from('blogs_famous_people')
		.select('*')
		.eq('published', true)
		.eq('enneagram', slug);

	if (personDataError) {
		console.log(personDataError);

		throw error(404, { message: 'Error getting posts' });
	}
	const posts: any = personData;

	// const posts: any = await getAllPosts(slug);
	const publishedPosts = posts.map((e) => {
		return { ...e, slug: e.person };
	});

	publishedPosts.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));

	return { people: publishedPosts, slug };
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
