// src/routes/blog/famous-enneagram-types/+page.server.ts
import { redirect } from '@sveltejs/kit';

export const load = async (event: any) => {
	throw redirect(301, '/how-to-guides');
};
