// src/routes/personality-analysis/type/[slug]/+page.server.ts
import type { Actions } from './$types';

import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { Database } from '../../../../../database.types';

type FamousPersonRow = Database['public']['Tables']['blogs_famous_people']['Row'];
type PersonPost = Pick<FamousPersonRow, 'person' | 'enneagram' | 'title' | 'date' | 'lastmod'> & {
	slug: string;
};

export const load: PageServerLoad = async ({
	params,
	locals
}): Promise<{ people: App.BlogPost[]; slug: string }> => {
	const supabase = locals.supabase;
	const slug = params.slug;

	const { data: personData, error: personDataError } = await supabase
		.from('blogs_famous_people')
		.select('person,enneagram,title,date,lastmod')
		.eq('published', true)
		.eq('enneagram', slug);

	if (personDataError) {
		console.log(personDataError);

		throw error(404, { message: 'Error getting posts' });
	}
	const posts: PersonPost[] = personData ?? [];

	// const posts: any = await getAllPosts(slug);
	const publishedPosts: PersonPost[] = posts.map((e) => {
		return { ...e, slug: e.person ?? '' };
	});

	publishedPosts.sort((a, b) =>
		new Date(a.date ?? a.lastmod ?? 0) > new Date(b.date ?? b.lastmod ?? 0) ? -1 : 1
	);

	return { people: publishedPosts as unknown as App.BlogPost[], slug };
};

export const actions: Actions = {
	createComment: async ({ request, getClientAddress, locals }) => {
		try {
			const supabase = locals.supabase as any;
			const body = Object.fromEntries(await request.formData());

			const comment = String(body.comment ?? '');
			const rawAuthorId = String(body.author_id ?? '');
			const author_id = rawAuthorId && rawAuthorId !== 'undefined' ? rawAuthorId : null;
			const blog_link = String(body.blog_link ?? '');
			const blog_type = 'personality-analysis';
			const ip = getClientAddress();
			const fingerprint = String(body.fingerprint ?? '');

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
