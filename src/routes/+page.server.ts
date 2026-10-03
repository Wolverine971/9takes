// src/routes/+page.server.ts
import type { PageServerLoad } from './$types';
import { loadHomepageLiveTake } from '$lib/server/homepageLiveTake';

export const load: PageServerLoad = async (event) => {
	// The live take is personal: visitors who already answered get their unlocked
	// answers, so `/` must never be served from a shared cache.
	event.setHeaders({ 'cache-control': 'private, no-store' });
	return { live: await loadHomepageLiveTake(event) };
};
