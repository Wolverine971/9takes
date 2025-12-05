// src/routes/admin/consulting/resources/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const supabase = locals.supabase;

	// Fetch all resources
	const { data: resources, error } = await supabase
		.from('consulting_resources')
		.select('*')
		.order('is_pinned', { ascending: false })
		.order('sort_order', { ascending: true })
		.order('title', { ascending: true });

	if (error) {
		console.error('Error fetching resources:', error);
	}

	// Group by category
	const groupedResources: Record<string, any[]> = {
		playbook: [],
		framework: [],
		script: [],
		reference: [],
		exercise: []
	};

	(resources || []).forEach((resource) => {
		if (groupedResources[resource.category]) {
			groupedResources[resource.category].push(resource);
		}
	});

	return {
		resources: resources || [],
		groupedResources
	};
};
