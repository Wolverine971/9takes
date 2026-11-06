// src/routes/+page.server.ts
import type { PageServerLoad } from './$types';
import { loadHomepageLiveTake } from '$lib/server/homepageLiveTake';
import { getLiveTakeTypes } from '$lib/server/homepageLiveTypes';

export const load: PageServerLoad = async (event) => {
	// The live take is personal: visitors who already answered get their unlocked
	// answers, so `/` must never be served from a shared cache.
	event.setHeaders({ 'cache-control': 'private, no-store' });
	const live = await loadHomepageLiveTake(event);
	// Types and timestamps only (never take text), so the locked card can say who answered.
	const liveTypes = live ? await getLiveTakeTypes(live.questionId) : null;
	return { live, liveTypes };
};
