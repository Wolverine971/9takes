// src/routes/admin/poster-generator/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { safeGetSession, supabase } = locals;
	const { session } = await safeGetSession();

	if (!session?.user?.id) {
		throw redirect(302, '/questions');
	}

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
			{ id: 'religious', path: '/blogs/s-researching-religious-texts.webp', name: 'Religious Texts' },
			{ id: 'cage', path: '/blogs/s-open-cage-color.webp', name: 'Open Cage' },
			{ id: 'statues', path: '/blogs/s-greek-statues-arguing.webp', name: 'Greek Statues' }
		]
	};
};
