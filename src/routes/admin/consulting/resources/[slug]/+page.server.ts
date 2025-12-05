// src/routes/admin/consulting/resources/[slug]/+page.server.ts
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
	const supabase = locals.supabase;

	const { data: resource, error: resourceError } = await supabase
		.from('consulting_resources')
		.select('*')
		.eq('slug', params.slug)
		.single();

	if (resourceError || !resource) {
		throw error(404, 'Resource not found');
	}

	// Get related resources in same category
	const { data: relatedResources } = await supabase
		.from('consulting_resources')
		.select('title, slug, description')
		.eq('category', resource.category)
		.neq('slug', params.slug)
		.limit(5);

	return {
		resource,
		relatedResources: relatedResources || []
	};
};
