// src/routes/sitemap.xml/+server.ts
import fs from 'fs';
import path from 'path';

export const GET = async () => {
	const sitemapPath = path.join(process.cwd(), 'static', 'sitemap.xml');
	const sitemap = fs.readFileSync(sitemapPath, 'utf-8');

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
};
