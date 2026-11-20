// src/routes/admin/consulting/resources/+page.server.ts
import type { PageServerLoad } from './$types';
import { requireAdmin } from '$lib/server/adminAuth';

export const load: PageServerLoad = async ({ locals }) => {
	// This load checks admin itself; it does not rely on the layout load having run.
	const { supabase } = await requireAdmin(locals);

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

	// Group by category (include any unexpected categories instead of dropping them)
	const groupedResources = (resources || []).reduce((acc: Record<string, any[]>, resource) => {
		const category = resource.category || 'uncategorized';
		if (!acc[category]) {
			acc[category] = [];
		}
		acc[category].push(resource);
		return acc;
	}, {});

	return {
		resources: resources || [],
		groupedResources
	};
};
