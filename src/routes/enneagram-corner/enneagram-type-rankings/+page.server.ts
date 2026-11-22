// src/routes/enneagram-corner/enneagram-type-rankings/+page.server.ts
//
// The "Which Enneagram type is the most…" hub: every pick we make, plus what
// readers say. A row shows once its post is published (in dev, drafts show too,
// marked). Reader results ride along for every row; the page reveals a row's
// results only after the reader votes on it.
import { dev } from '$app/environment';
import type { PageServerLoad } from './$types';
import { loadCornerPosts } from '$lib/server/enneagramCornerSections';
import { loadSuperlativeSummary, type SuperlativeSummary } from '$lib/server/superlativeVotes';
import {
	MIN_LIVE_ROWS_FOR_INDEX,
	SUPERLATIVE_GROUPS,
	SUPERLATIVE_TRAITS
} from '$lib/data/superlativeRankings.js';
import { logger } from '$lib/utils/logger';

export const load: PageServerLoad = async ({ setHeaders }) => {
	const posts = await loadCornerPosts();
	const publishedPaths = new Set(posts.filter((post) => post.published).map((post) => post.href));

	const rows = SUPERLATIVE_TRAITS.map((row) => ({
		...row,
		isLive: publishedPaths.has(row.postPath)
	})).filter((row) => row.isLive || dev);
	const liveCount = rows.filter((row) => row.isLive).length;

	let summary: SuperlativeSummary = {};
	try {
		summary = await loadSuperlativeSummary();
	} catch (error) {
		// The picks still render; reader results just wait.
		logger.warn('Superlative summary unavailable', { error });
	}

	// Results move with votes, so the shared copy stays short-lived.
	setHeaders({ 'Cache-Control': 'public, max-age=0, s-maxage=120, stale-while-revalidate=600' });

	return {
		groups: SUPERLATIVE_GROUPS.filter((group) => rows.some((row) => row.group === group.slug)),
		rows,
		summary: Object.fromEntries(rows.map((row) => [row.trait, summary[row.trait] ?? null])),
		noindex: liveCount < MIN_LIVE_ROWS_FOR_INDEX
	};
};
