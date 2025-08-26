// src/routes/questionPrint/+page.server.ts
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	try {
		const session = event.locals.session;

		return {
			session
		};
	} catch (e) {
		console.log(e);
		throw error(500, {
			message: 'Error finding questions'
		});
	}
};
