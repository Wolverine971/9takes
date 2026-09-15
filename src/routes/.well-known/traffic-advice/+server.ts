// src/routes/.well-known/traffic-advice/+server.ts
import type { RequestHandler } from './$types';

// Chrome's private prefetch proxy checks this file before prefetching pages from
// Google Search results. Opt in fully so it stops probing a 404.
const TRAFFIC_ADVICE = JSON.stringify([{ user_agent: 'prefetch-proxy', fraction: 1 }]);

export const GET: RequestHandler = () =>
	new Response(TRAFFIC_ADVICE, {
		headers: {
			'Content-Type': 'application/trafficadvice+json',
			'Cache-Control': 'public, max-age=86400, s-maxage=86400'
		}
	});
