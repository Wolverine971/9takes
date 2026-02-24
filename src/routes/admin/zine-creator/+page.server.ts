// src/routes/admin/zine-creator/+page.server.ts
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	throw redirect(308, '/admin/asset-generators/zine-creator');
};
