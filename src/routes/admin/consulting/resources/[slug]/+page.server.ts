// src/routes/admin/consulting/resources/[slug]/+page.server.ts
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { renderConsultingResourceMarkdown } from '$lib/server/consultingResource';

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
		.select('id, title, slug, description, updated_at, is_pinned')
		.eq('category', resource.category)
		.neq('slug', params.slug)
		.order('is_pinned', { ascending: false })
		.order('sort_order', { ascending: true })
		.order('title', { ascending: true })
		.limit(5);

	return {
		resource,
		relatedResources: relatedResources || [],
		renderedHtml: renderConsultingResourceMarkdown(resource.content)
	};
};
