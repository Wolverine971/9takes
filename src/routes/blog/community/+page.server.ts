// routes/blog/community/+page.server.ts
import { redirect } from '@sveltejs/kit';
// import { PageServerLoad } from "./$types";

export const load = async () => {
	throw redirect(302, '/community');
};
