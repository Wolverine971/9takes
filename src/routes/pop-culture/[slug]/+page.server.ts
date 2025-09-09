// src/routes/pop-culture/[slug]/+page.server.ts

import { dev } from '$app/environment';
import type { PageServerLoad } from './$types';

// Cache for 5 minutes in production
const MAX_AGE = 60 * 5;

export const load: PageServerLoad = async ({ setHeaders }) => {
	// Set HTTP Cache-Control headers
	if (!dev) {
		setHeaders({
			'Cache-Control': `public, max-age=${MAX_AGE}, s-maxage=${MAX_AGE}, stale-while-revalidate=300`
		});
	} else {
		// In dev mode, disable caching for instant updates
		setHeaders({
			'Cache-Control': 'no-store'
		});
	}

	// Additional load logic can be added here if needed
	return {};
};
