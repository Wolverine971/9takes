import { redirect } from '@sveltejs/kit';

export const load = async (event: any) => {
	throw redirect(301, '/how-to-guides/' + event.params.slug);
};