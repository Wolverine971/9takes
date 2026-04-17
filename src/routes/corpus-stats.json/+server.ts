// src/routes/corpus-stats.json/+server.ts
// Raw dataset endpoint referenced by the schema.org Dataset's DataDownload.
import type { RequestHandler } from './$types';
import corpusStats from '$lib/data/corpus-stats.json';

export const prerender = true;

export const GET: RequestHandler = async () => {
	return new Response(JSON.stringify(corpusStats, null, 2), {
		headers: {
			'content-type': 'application/json; charset=utf-8',
			'cache-control': 'public, max-age=3600, stale-while-revalidate=86400'
		}
	});
};
