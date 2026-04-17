// src/routes/corpus-stats/+page.ts
// Stats refresh at build-time, so cache aggressively at the edge.
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data, setHeaders }) => {
	setHeaders({
		'cache-control': 'public, max-age=3600, stale-while-revalidate=86400'
	});
	return data;
};
