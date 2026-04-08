// src/routes/api/blog/typeahead/+server.ts
import { searchBlogTypeahead } from '$lib/server/blogSearch';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
	try {
		const query = url.searchParams.get('q')?.trim();

		if (!query || query.length < 2) {
			return json({ results: [], query: query || '' });
		}

		if (query.length > 200) {
			return json({ results: [], query, error: 'Search query too long' }, { status: 400 });
		}

		const results = await searchBlogTypeahead(locals.supabase, query, 10);
		return json({ results, query });
	} catch (error) {
		console.error('Typeahead search error:', error);
		return json(
			{ results: [], query: url.searchParams.get('q') || '', error: 'Search failed' },
			{ status: 500 }
		);
	}
};
