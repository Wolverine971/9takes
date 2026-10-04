// src/routes/admin/content-board/personality-analysis/[slug]/+page.server.ts
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { params, locals } = event;
	const { slug } = params;
	const supabase = locals.supabase;
	// hooks.server.ts already validated the JWT (auth.getUser) for this request.
	const session = locals.session;

	// Ensure user is authenticated
	if (!session?.user?.id) {
		throw redirect(302, '/login');
	}

	// The admin layout guard (parent) runs alongside the content fetch; a
	// non-admin gets its redirect and the fetched row is discarded.
	const [, { data, error: fetchError }] = await Promise.all([
		event.parent(),
		// Fetch the content by person slug
		supabase.from('blogs_famous_people').select('*').eq('person', slug).single()
	]);

	if (fetchError || !data) {
		console.error('Error fetching content:', fetchError);
		throw error(404, `Content not found for "${slug}"`);
	}

	const [{ data: history }, stageData] = await Promise.all([
		// Fetch history separately (last 3 changes)
		supabase
			.from('blogs_famous_people_history')
			.select('id, changed_at, new_content')
			.eq('famous_people_id', data.id)
			.order('changed_at', { ascending: false })
			.limit(3),
		// Fetch stage from content_people
		data.loc
			? supabase
					.from('content_people')
					.select('stageName')
					.eq('loc', data.loc)
					.single()
					.then(({ data: stage }) => stage)
			: null
	]);

	return {
		blog: {
			...data,
			history: history || [],
			stageName: stageData?.stageName || null
		}
	};
};
