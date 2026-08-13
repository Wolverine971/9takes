// src/routes/manifesto/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => ({
	session: locals.session
});
