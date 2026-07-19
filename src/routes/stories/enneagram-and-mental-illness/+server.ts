// src/routes/stories/enneagram-and-mental-illness/+server.ts
import type { RequestHandler } from './$types';
import storyHtml from './story.html?raw';

export const prerender = true;

export const GET: RequestHandler = () =>
	new Response(storyHtml, {
		headers: {
			'Cache-Control': 'public, max-age=0, s-maxage=86400',
			'Content-Type': 'text/html; charset=utf-8',
			'X-Content-Type-Options': 'nosniff'
		}
	});
