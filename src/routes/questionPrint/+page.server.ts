// src/routes/questionPrint/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { safeGetSession } = event.locals;
	const { session } = await safeGetSession();

	return {
		session
	};
};
