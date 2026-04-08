// src/routes/api/search/+server.ts
import { parseEnneagramParam, parseLimit, parseOffset } from '$lib/server/blogSearchUtils';
import { parseUniversalSearchScope, searchUniversal } from '$lib/server/universalSearch';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
	try {
		const query = (url.searchParams.get('q') || '').trim();
		const enneagramParam = url.searchParams.get('enneagram');
		const category = url.searchParams.get('category')?.trim() || null;
		const type = url.searchParams.get('type')?.trim() || null;
		const limit = parseLimit(url.searchParams.get('limit'));
		const offset = parseOffset(url.searchParams.get('offset'));
		const scope = parseUniversalSearchScope(url.searchParams.get('scope'));

		if (!query || query.length < 2) {
			return json(
				{
					results: [],
					query: query || '',
					scope,
					filters: { enneagram: null, category: null, type: null },
					total: 0,
					error: 'Search query must be at least 2 characters'
				},
				{ status: 400 }
			);
		}

		if (query.length > 200) {
			return json(
				{
					results: [],
					query,
					scope,
					filters: { enneagram: null, category: null, type: null },
					total: 0,
					error: 'Search query too long'
				},
				{ status: 400 }
			);
		}

		const enneagramFilter = parseEnneagramParam(enneagramParam);
		if (enneagramParam && enneagramFilter === null) {
			return json(
				{
					results: [],
					query,
					scope,
					filters: { enneagram: null, category, type },
					total: 0,
					error: 'Invalid enneagram filter'
				},
				{ status: 400 }
			);
		}

		const result = await searchUniversal(locals.supabase, query, {
			scope,
			enneagram: enneagramFilter,
			category,
			type,
			limit,
			offset
		});

		return json({
			results: result.results,
			query,
			scope,
			filters: {
				enneagram: enneagramFilter,
				category,
				type
			},
			total: result.total
		});
	} catch (error) {
		console.error('Universal search error:', error);
		return json(
			{
				results: [],
				query: url.searchParams.get('q') || '',
				scope: parseUniversalSearchScope(url.searchParams.get('scope')),
				filters: { enneagram: null, category: null, type: null },
				total: 0,
				error: 'Search failed'
			},
			{ status: 500 }
		);
	}
};
