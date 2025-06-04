// routes/about/+page.server.ts
import type { PageServerLoad } from './$types';

/** @type {import('./$types').PageLoad} */
export const load: PageServerLoad = async (event) => {
	const session = event.locals.session;
	return {
		session
	};
};
