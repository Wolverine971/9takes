// src/routes/api/blog/search/+server.ts
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
		const query = url.searchParams.get('q')?.trim();
		const enneagram = url.searchParams.get('enneagram');
		const category = url.searchParams.get('category');
		const type = url.searchParams.get('type');
		const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100);
		const offset = parseInt(url.searchParams.get('offset') || '0');

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

		// Parse filters
		const enneagramFilter = enneagram ? parseInt(enneagram) : null;

		// Try using the RPC function first (more efficient)
		const { data: rpcResults, error: rpcError } = await supabase.rpc('search_all_blogs', {
			search_query: query,
			filter_enneagram: enneagramFilter,
			filter_category: category,
			filter_type: type,
			result_limit: limit,
			result_offset: offset
		});

		if (!rpcError && rpcResults) {
			// RPC function exists and worked
			const results: SearchResult[] = rpcResults.map((row: any) => ({
				...row,
				url: generateUrl(row.source, row.slug, row.category)
			}));

			return json({
				results,
				query,
				filters: {
					enneagram: enneagramFilter,
					category,
					type
				},
				total: results.length
			});
		}

		// Fallback: Manual search if RPC doesn't exist
		console.log('RPC not available, using fallback search');

		const allResults: SearchResult[] = [];

		// Search blogs_content
		let contentQuery = supabase
			.from('blogs_content')
			.select('id, slug, title, description, enneagram, type, tags, category, lastmod')
			.eq('published', true)
			.or(`title.ilike.%${query}%,description.ilike.%${query}%,content.ilike.%${query}%`);

		if (enneagramFilter) {
			contentQuery = contentQuery.eq('enneagram', enneagramFilter);
		}
		if (category) {
			contentQuery = contentQuery.eq('category', category);
		}
		if (type) {
			contentQuery = contentQuery.contains('type', [type]);
		}

		const { data: contentData } = await contentQuery.limit(limit);

		if (contentData) {
			contentData.forEach((row: any) => {
				allResults.push({
					id: row.id,
					source: 'content',
					slug: row.slug,
					title: row.title,
					description: row.description,
					enneagram: row.enneagram,
					type: row.type || [],
					tags: row.tags || [],
					category: row.category,
					lastmod: row.lastmod,
					rank: 1, // Simple ranking in fallback mode
					url: generateUrl('content', row.slug, row.category)
				});
			});
		}

		// Search blogs_famous_people
		let peopleQuery = supabase
			.from('blogs_famous_people')
			.select('id, person, title, description, enneagram, type, tags, category, lastmod')
			.eq('published', true)
			.or(
				`title.ilike.%${query}%,description.ilike.%${query}%,person.ilike.%${query}%,content.ilike.%${query}%`
			);

		if (enneagramFilter) {
			peopleQuery = peopleQuery.eq('enneagram', enneagramFilter);
		}
		if (category) {
			peopleQuery = peopleQuery.eq('category', category);
		}
		if (type) {
			peopleQuery = peopleQuery.contains('type', [type]);
		}

		const { data: peopleData } = await peopleQuery.limit(limit);

		if (peopleData) {
			peopleData.forEach((row: any) => {
				allResults.push({
					id: row.id,
					source: 'famous_people',
					slug: row.person,
					title: row.title,
					description: row.description,
					enneagram: row.enneagram,
					type: row.type || [],
					tags: row.tags || [],
					category: row.category,
					lastmod: row.lastmod,
					rank: 1,
					url: `/personality-analysis/${row.person}`
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

		return json({
			results: paginatedResults,
			query,
			filters: {
				enneagram: enneagramFilter,
				category,
				type
			},
			total: allResults.length
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

// URL route mapping for all categories
const ROUTE_MAP: Record<string, string> = {
	// Main categories
	enneagram: '/enneagram-corner',
	'mental-health': '/enneagram-corner/mental-health',
	community: '/community',
	guides: '/how-to-guides',
	'pop-culture': '/pop-culture',
	topical: '/blog/topical',
	'life-situations': '/enneagram-corner',
	generational: '/enneagram-corner',
	historical: '/enneagram-corner',
	situational: '/enneagram-corner',
	overview: '/enneagram-corner',
	'life-style': '/enneagram-corner'
};

/**
 * Generate URL based on content source and category
 */
function generateUrl(source: string, slug: string, category: string | null): string {
	if (source === 'famous_people') {
		return `/personality-analysis/${slug}`;
	}

	// Handle slugs that contain paths (like mental-health/something)
	if (slug.includes('/')) {
		const parts = slug.split('/');
		const subdir = parts[0];
		const fileName = parts[parts.length - 1];

		// Check if subdir has a specific route
		if (ROUTE_MAP[subdir]) {
			return `${ROUTE_MAP[subdir]}/${fileName}`;
		}
	}

	// Use the category route mapping
	const baseRoute = category && ROUTE_MAP[category] ? ROUTE_MAP[category] : '/enneagram-corner';

	// Extract just the filename if slug contains a path
	const finalSlug = slug.includes('/') ? slug.split('/').pop() : slug;

	return `${baseRoute}/${finalSlug}`;
}

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
