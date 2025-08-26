// src/routes/admin/poster-generator/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = locals.session;

	if (!session?.user?.id) {
		throw redirect(302, '/questions');
	}

	return {
		// You can provide any data needed for the admin page here
		backgrounds: [
			{ id: 'purple-gradient', path: '/greek_pantheon.png', name: 'Greek Pantheon' },
			{ id: 'blue-abstract', path: '/philosopher-gathering.png', name: 'philosopher-gathering' },
			{ id: 'geometric', path: '/acrop.png', name: 'acrop' },
			{
				id: 'minimal',
				path: '/blogs/s-researching-religious-texts.webp',
				name: 'researching-religious-texts'
			},
			{ id: 'personality', path: '/blogs/s-open-cage-color.webp', name: 'open-cage' },
			{ id: 'personality2', path: '/blogs/s-greek-statues-arguing.webp', name: 'open-cage' }
		]
	};
};
