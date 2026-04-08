// src/routes/api/search/typeahead/+server.ts
import { parseUniversalSearchScope, searchUniversalTypeahead } from '$lib/server/universalSearch';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
	try {
		const query = url.searchParams.get('q')?.trim() || '';
		const scope = parseUniversalSearchScope(url.searchParams.get('scope'));
		const requestedLimit = Number(url.searchParams.get('limit'));
		const limit =
			Number.isInteger(requestedLimit) && requestedLimit > 0 ? Math.min(requestedLimit, 20) : 10;

		if (query.length < 2) {
			return json({ results: [], query, scope });
		}

		if (query.length > 200) {
			return json({ results: [], query, scope, error: 'Search query too long' }, { status: 400 });
		}

		const result = await searchUniversalTypeahead(locals.supabase, query, { scope, limit });
		return json(result);
	} catch (error) {
		console.error('Universal typeahead error:', error);
		return json(
			{
				results: [],
				query: url.searchParams.get('q') || '',
				scope: parseUniversalSearchScope(url.searchParams.get('scope')),
				error: 'Search failed'
			},
			{ status: 500 }
		);
	}
};
