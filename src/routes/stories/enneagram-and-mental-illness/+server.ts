// src/routes/stories/enneagram-and-mental-illness/+server.ts
import type { RequestHandler } from './$types';
import storyHtml from './story.html?raw';

export const prerender = true;

export const GET: RequestHandler = () =>
	new Response(storyHtml, {
		headers: {
			'Content-Security-Policy':
				"default-src 'self'; script-src https://cdn.ampproject.org; script-src-attr 'none'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; media-src 'self' https:; connect-src 'self' https://cdn.ampproject.org; object-src 'none'; base-uri 'none'; frame-ancestors 'self'; form-action 'self'",
			'Cache-Control': 'public, max-age=0, s-maxage=86400',
			'Content-Type': 'text/html; charset=utf-8',
			'X-Content-Type-Options': 'nosniff'
		}
	});
