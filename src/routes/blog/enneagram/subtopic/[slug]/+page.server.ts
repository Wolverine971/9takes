// src/routes/blog/enneagram/subtopic/[slug]/+page.server.ts
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	throw redirect(302, '/enneagram-corner/subtopic/' + params.slug);
};
