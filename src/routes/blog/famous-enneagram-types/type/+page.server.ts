// routes/blog/famous-enneagram-types/type/+page.server.ts
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event: any) => {
	throw redirect(301, '/personality-analysis');
};
