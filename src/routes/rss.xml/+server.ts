// src/routes/rss.xml/+server.ts
import { getPosts } from '$lib/getPosts';
import { buildRssXml } from '$lib/server/rssFeed';

export async function GET() {
	const posts = await getPosts();
	const body = buildRssXml(posts);

	const headers = {
		'Cache-Control': 'max-age=0, s-maxage=3600',
		'Content-Type': 'application/xml'
	};
	return new Response(body, { headers });
}
