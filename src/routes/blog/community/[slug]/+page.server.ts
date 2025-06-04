// routes/blog/community/[slug]/+page.server.ts
import { redirect } from '@sveltejs/kit';
// import { PageServerLoad } from "./$types";

export const load = async (event) => {
	throw redirect(302, '/community/' + event.params.slug);
};
