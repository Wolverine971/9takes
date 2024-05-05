import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event: any) => {
	throw redirect(300, '/blog/enneagram');
};
