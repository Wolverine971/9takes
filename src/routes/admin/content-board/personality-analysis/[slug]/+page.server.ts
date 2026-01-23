// src/routes/admin/content-board/personality-analysis/[slug]/+page.server.ts
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { slug } = params;
	const supabase = locals.supabase;
	const { session } = await locals.safeGetSession();

	// Ensure user is authenticated
	if (!session?.user?.id) {
		throw redirect(302, '/login');
	}

	// Check if user is admin
	const { data: profile } = await supabase
		.from('profiles')
		.select('admin')
		.eq('id', session.user.id)
		.single();

	if (!profile?.admin) {
		throw error(403, 'Forbidden - Admin access required');
	}

	// Fetch the content by person slug
	const { data, error: fetchError } = await supabase
		.from('blogs_famous_people')
		.select('*')
		.eq('person', slug)
		.single();

	if (fetchError || !data) {
		console.error('Error fetching content:', fetchError);
		throw error(404, `Content not found for "${slug}"`);
	}

	// Fetch history separately (last 5 changes)
	const { data: history } = await supabase
		.from('blogs_famous_people_history')
		.select('id, changed_at, old_content, new_content')
		.eq('famous_people_id', data.id)
		.order('changed_at', { ascending: false })
		.limit(5);

	// Fetch stage from content_people
	let stageData = null;
	if (data.loc) {
		const { data: stage } = await supabase
			.from('content_people')
			.select('stageName')
			.eq('loc', data.loc)
			.single();
		stageData = stage;
	}

	return {
		blog: {
			...data,
			history: history || [],
			stageName: stageData?.stageName || null
		}
	};
};
