// src/routes/api/blog/search/+server.ts
import {
	generateBlogUrl,
	normalizeTextArray,
	parseEnneagramParam,
	parseLimit,
	parseOffset
} from '$lib/server/blogSearchUtils';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

interface SearchResult {
	id: number;
	source: 'content' | 'famous_people';
	slug: string;
	title: string;
	description: string;
	enneagram: number | null;
	type: string[];
	tags: string[];
	category: string | null;
	lastmod: string | null;
	rank: number;
	url: string;
}

interface SearchResponse {
	results: SearchResult[];
	query: string;
	filters: {
		enneagram: number | null;
		category: string | null;
		type: string | null;
	};
	total: number;
}

/**
 * Blog Search API
 *
 * GET /api/blog/search?q=anxiety&enneagram=4&category=mental-health&type=relationships&limit=20&offset=0
 *
 * Query Parameters:
 * - q: Search query (required, min 2 chars)
 * - enneagram: Filter by enneagram type (1-9)
 * - category: Filter by category (mental-health, enneagram, etc.)
 * - type: Filter by content type (relationships, workplace, etc.)
 * - limit: Number of results (default 20, max 100)
 * - offset: Pagination offset (default 0)
 */
export const GET: RequestHandler = async ({ url, locals }) => {
	try {
		const supabase = locals.supabase;

		// Parse query parameters
		const query = (url.searchParams.get('q') || '').trim();
		const enneagramParam = url.searchParams.get('enneagram');
		const category = url.searchParams.get('category')?.trim() || null;
		const type = url.searchParams.get('type')?.trim() || null;
		const limit = parseLimit(url.searchParams.get('limit'));
		const offset = parseOffset(url.searchParams.get('offset'));

		// Validate query
		if (!query || query.length < 2) {
			return json(
				{
					results: [],
					query: query || '',
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
					filters: { enneagram: null, category, type },
					total: 0,
					error: 'Invalid enneagram filter'
				},
				{ status: 400 }
			);
		}

		// Try using the RPC function first (more efficient)
		const {
			data: rpcResults,
			error: rpcError,
			count: rpcCount
		} = await supabase.rpc(
			'search_all_blogs',
			{
				search_query: query,
				filter_enneagram: enneagramFilter,
				filter_category: category,
				filter_type: type,
				result_limit: limit,
				result_offset: offset
			},
			{ count: 'exact' }
		);

		if (!rpcError && rpcResults) {
			const results: SearchResult[] = rpcResults.map((row: any) => ({
				id: row.id,
				source: row.source === 'famous_people' ? 'famous_people' : 'content',
				slug: row.slug,
				title: row.title,
				description: row.description,
				enneagram: row.enneagram ?? null,
				type: normalizeTextArray(row.type),
				tags: normalizeTextArray(row.tags),
				category: row.category ?? null,
				lastmod: row.lastmod ?? null,
				rank: row.rank ?? 0,
				url: generateBlogUrl(row.source, row.slug, row.category ?? null)
			}));

			return json({
				results,
				query,
				filters: {
					enneagram: enneagramFilter,
					category,
					type
				},
				total: typeof rpcCount === 'number' ? rpcCount : results.length
			});
		}

		// Fallback: Manual search if RPC doesn't exist
		console.warn('RPC not available, using fallback search');

		const allResults: SearchResult[] = [];
		const fallbackLimit = Math.min(limit + offset, 200);

		const contentQuery = supabase
			.from('blogs_content')
			.select('id, slug, title, description, enneagram, type, tags, category, lastmod', {
				count: 'exact'
			})
			.eq('published', true)
			.textSearch('search_vector', query, { type: 'websearch' })
			.order('lastmod', { ascending: false, nullsLast: true })
			.limit(fallbackLimit);

		if (enneagramFilter) {
			contentQuery.eq('enneagram', enneagramFilter);
		}
		if (category) {
			contentQuery.eq('category', category);
		}
		if (type) {
			contentQuery.contains('type', [type]);
		}

		const peopleQuery = supabase
			.from('blogs_famous_people')
			.select('id, person, title, description, enneagram, type, tags, category, lastmod', {
				count: 'exact'
			})
			.eq('published', true)
			.textSearch('search_vector', query, { type: 'websearch' })
			.order('lastmod', { ascending: false, nullsLast: true })
			.limit(fallbackLimit);

		if (enneagramFilter) {
			peopleQuery.eq('enneagram', enneagramFilter);
		}
		if (category) {
			peopleQuery.eq('category', category);
		}
		if (type) {
			peopleQuery.contains('type', [type]);
		}

		const [
			{ data: contentData, count: contentCount, error: contentError },
			{ data: peopleData, count: peopleCount, error: peopleError }
		] = await Promise.all([contentQuery, peopleQuery]);

		if (contentError && peopleError) {
			throw new Error('Fallback search failed for both queries');
		}
		if (contentError) {
			console.error('Fallback content search error:', contentError);
		}
		if (peopleError) {
			console.error('Fallback famous people search error:', peopleError);
		}

		if (contentData) {
			contentData.forEach((row: any) => {
				allResults.push({
					id: row.id,
					source: 'content',
					slug: row.slug,
					title: row.title,
					description: row.description,
					enneagram: row.enneagram ?? null,
					type: normalizeTextArray(row.type),
					tags: normalizeTextArray(row.tags),
					category: row.category ?? null,
					lastmod: row.lastmod ?? null,
					rank: 0,
					url: generateBlogUrl('content', row.slug, row.category ?? null)
				});
			});
		}

		if (peopleData) {
			peopleData.forEach((row: any) => {
				allResults.push({
					id: row.id,
					source: 'famous_people',
					slug: row.person,
					title: row.title,
					description: row.description,
					enneagram: row.enneagram ?? null,
					type: normalizeTextArray(row.type),
					tags: normalizeTextArray(row.tags),
					category: row.category ?? null,
					lastmod: row.lastmod ?? null,
					rank: 0,
					url: generateBlogUrl('famous_people', row.person, row.category ?? null)
				});
			});
		}

		// Sort by lastmod (newest first) and limit
		allResults.sort((a, b) => {
			const dateA = a.lastmod ? new Date(a.lastmod).getTime() : 0;
			const dateB = b.lastmod ? new Date(b.lastmod).getTime() : 0;
			return dateB - dateA;
		});

		const paginatedResults = allResults.slice(offset, offset + limit);
		const total = (contentCount ?? 0) + (peopleCount ?? 0) || allResults.length;

		return json({
			results: paginatedResults,
			query,
			filters: {
				enneagram: enneagramFilter,
				category,
				type
			},
			total
		});
	} catch (error) {
		console.error('Blog search error:', error);
		return json(
			{
				results: [],
				query: url.searchParams.get('q') || '',
				filters: { enneagram: null, category: null, type: null },
				total: 0,
				error: 'Search failed'
			},
			{ status: 500 }
		);
	}
};

/**
 * POST endpoint for form submissions
 */
export const POST: RequestHandler = async ({ request, locals, url }) => {
	try {
		const body = await request.json();
		const searchUrl = new URL(url);

		// Convert body to query params
		if (body.q) searchUrl.searchParams.set('q', body.q);
		if (body.enneagram) searchUrl.searchParams.set('enneagram', body.enneagram);
		if (body.category) searchUrl.searchParams.set('category', body.category);
		if (body.type) searchUrl.searchParams.set('type', body.type);
		if (body.limit) searchUrl.searchParams.set('limit', body.limit);
		if (body.offset) searchUrl.searchParams.set('offset', body.offset);

		// Reuse GET handler logic
		return GET({ url: searchUrl, locals } as any);
	} catch (error) {
		console.error('Blog search POST error:', error);
		return json(
			{
				results: [],
				query: '',
				filters: { enneagram: null, category: null, type: null },
				total: 0,
				error: 'Search failed'
			},
			{ status: 500 }
		);
	}
};
