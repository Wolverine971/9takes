// src/routes/personality-analysis/+page.server.ts
import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { Database } from '../../../database.types';
import { normalizePersonalitySlug } from '$lib/utils/personalityAnalysis';

type FamousPersonRow = Database['public']['Tables']['blogs_famous_people']['Row'];
type PersonPost = Pick<FamousPersonRow, 'person' | 'enneagram' | 'lastmod' | 'date'> & {
	slug: string;
};

export const load: PageServerLoad = async ({ locals }) => {
	const supabase = locals.supabase;
	const { data: personData, error: personDataError } = await supabase
		.from('blogs_famous_people')
		.select('person,enneagram,lastmod,date')
		.eq('published', true);
	if (personDataError) {
		console.log(personDataError);

		throw error(404, { message: 'Error getting posts' });
	}
	const posts: PersonPost[] = (personData ?? []).map((e) => ({
		...e,
		slug: normalizePersonalitySlug(e.person)
	}));

	const uniqueTypes = Array.from(new Set(posts.map((obj) => obj.enneagram)));

	// Store objects of unique types
	const uniqueObjects: PersonPost[] = [];

	// Iterate through unique types
	uniqueTypes.forEach((enneagram) => {
		// Find objects with current type
		const objectsWithType = posts.filter((obj) => obj.enneagram === enneagram);

		// Sort objects by date_created
		objectsWithType.sort(
			(a, b) =>
				new Date(b.lastmod ?? b.date ?? 0).getTime() - new Date(a.lastmod ?? a.date ?? 0).getTime()
		);

		// Push first 3 objects to uniqueObjects
		uniqueObjects.push(...objectsWithType.slice(0, 5));
	});

	const sortedByLastmod = [...posts].sort(
		(a, b) =>
			new Date(b.lastmod ?? b.date ?? 0).getTime() - new Date(a.lastmod ?? a.date ?? 0).getTime()
	);
	const featured = sortedByLastmod.slice(0, 2);
	const featuredSlugs = new Set(featured.map((p) => p.slug));
	const recentlyUpdated = sortedByLastmod.filter((p) => !featuredSlugs.has(p.slug)).slice(0, 4);

	return { people: uniqueObjects, featured, recentlyUpdated, totalPeople: posts.length };
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
