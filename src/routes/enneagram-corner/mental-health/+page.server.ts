// src/routes/enneagram-corner/mental-health/+page.server.ts
import type { PageServerLoad } from './$types';
import { buildSectionView, loadCornerPosts } from '$lib/server/enneagramCornerSections';

export const load = (async () => {
	const posts = await loadCornerPosts();
	return { view: buildSectionView(posts, 'mental-health') };
}) satisfies PageServerLoad;
