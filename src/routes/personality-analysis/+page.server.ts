// routes/personality-analysis/+page.server.ts
import { supabase } from '$lib/supabase';
import type { Actions } from './$types';

import type { PageServerLoad } from './$types';
import { slugFromPath } from '$lib/slugFromPath';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url }): Promise<{ people: App.BlogPost[] }> => {

	const { data: personData, error: personDataError } = await supabase
		.from('blogs_famous_people')
		.select('*')
		.eq('published', true)
	if (personDataError) {
		console.log(personDataError)

		throw error(404, { message: 'Error getting posts' });
	}
	const posts: any = personData.map(e => { return { ...e, slug: e.person } })


	const uniqueTypes = Array.from(new Set(posts.map((obj) => obj?.enneagram)));

	// Store objects of unique types
	const uniqueObjects: any[] = [];

	// Iterate through unique types
	uniqueTypes.forEach((enneagram) => {
		// Find objects with current type
		const objectsWithType = posts.filter((obj) => obj?.enneagram === enneagram);

		// Sort objects by date_created
		objectsWithType.sort((a, b) => new Date(b.lastmod) - new Date(a.lastmod))

		// Push first 3 objects to uniqueObjects
		uniqueObjects.push(...objectsWithType.slice(0, 5));
	});

	return { people: uniqueObjects };
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
	},
	getAllBlogsFromDB: async () => {
		const posts: any = await getAllPosts();
		const publishedPosts = posts.filter((post) => post.published);

		try {
			const { data: famousPeople, error: famousPeopleError } = await supabase
				.from('blogs_famous_people')
				.insert(
					publishedPosts.map((post) => {
						return {
							title: post.title,
							description: post.description,
							author: post.author,
							date: post.date,
							loc: post.loc,
							lastmod: post.lastmod,
							changefreq: post.changefreq,
							priority: post.priority,
							published: post.published,
							enneagram: post.enneagram,
							type: post.type,
							person: post.person,
							wikipedia: post.wikipedia,
							twitter: post.twitter,
							instagram: post.instagram,
							tiktok: post.tiktok,
							path: post.path,
							slug: post.slug
						};
					})
				)
				.select();

			if (famousPeopleError) {
				console.log(famousPeopleError);
			}
		} catch (error) {
			console.log(error);
		}
	}
};
