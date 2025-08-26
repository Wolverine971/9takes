// src/routes/book-session/+page.ts
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data }) => {
	return {
		alreadySignedUp: data.alreadySignedUp,
		utmParams: data.utmParams
	};
};
