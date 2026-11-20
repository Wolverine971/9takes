// src/routes/admin/asset-generators/poster-generator/+page.server.ts
import type { PageServerLoad } from './$types';
import { requireAdmin } from '$lib/server/adminAuth';

export const load: PageServerLoad = async ({ locals }) => {
	// This load checks admin itself; it does not rely on the layout load having run.
	const { supabase } = await requireAdmin(locals);

	// Load recent questions for quick selection
	const { data: questions } = await supabase
		.from('questions')
		.select('id, question, url')
		.order('created_at', { ascending: false })
		.limit(20);

	return {
		questions: questions || [],
		backgrounds: [
			{ id: 'greek_pantheon', path: '/greek_pantheon.png', name: 'Greek Pantheon' },
			{ id: 'philosopher', path: '/philosopher-gathering.png', name: 'Philosophers' },
			{ id: 'acropolis', path: '/acrop.png', name: 'Acropolis' },
			{
				id: 'religious',
				path: '/blogs/s-researching-religious-texts.webp',
				name: 'Religious Texts'
			},
			{ id: 'cage', path: '/blogs/s-open-cage-color.webp', name: 'Open Cage' },
			{ id: 'statues', path: '/blogs/s-greek-statues-arguing.webp', name: 'Greek Statues' }
		]
	};
};
