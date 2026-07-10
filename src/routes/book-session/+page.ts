// src/routes/book-session/+page.ts
import type { PageLoad } from './$types';
import { withOwnedPageShell } from '$lib/layout/pageShell';

export const load: PageLoad = async ({ data }) => {
	return withOwnedPageShell({
		alreadySignedUp: data.alreadySignedUp,
		utmParams: data.utmParams
	});
};
