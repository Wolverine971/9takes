// routes/blog/famous-enneagram-types/[slug]/+page.server.ts
import { redirect } from '@sveltejs/kit';

export const load = async (event: any) => {
	throw redirect(301, '/personality-analysis/' + event.params.slug);
};
