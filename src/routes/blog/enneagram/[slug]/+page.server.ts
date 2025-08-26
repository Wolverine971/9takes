// src/routes/blog/enneagram/[slug]/+page.server.ts
import { redirect } from '@sveltejs/kit';

export const load = async (event: any) => {
	throw redirect(301, '/enneagram-corner/' + event.params.slug);
};
