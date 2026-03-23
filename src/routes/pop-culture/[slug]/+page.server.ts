// src/routes/pop-culture/[slug]/+page.server.ts

import { dev } from '$app/environment';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders }) => {
	if (!dev) {
		setHeaders({
			// Keep article requests uncached so hooks.server can inspect every fetch.
			'Cache-Control': 'private, no-store'
		});
	} else {
		setHeaders({
			'Cache-Control': 'no-store'
		});
	}

	// Additional load logic can be added here if needed
	return {};
};
