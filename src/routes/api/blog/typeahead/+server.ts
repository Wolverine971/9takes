// src/routes/api/blog/typeahead/+server.ts
import { generateBlogUrl } from '$lib/server/blogSearchUtils';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

interface TypeaheadResult {
	id: number;
	source: 'content' | 'famous_people';
	title: string;
	slug: string;
	url: string;
	enneagram: number | null;
	category: string | null;
	headline: string; // The matching text snippet with highlights
	rank: number;
}

interface TypeaheadResponse {
	results: TypeaheadResult[];
	query: string;
}

/**
 * Blog Typeahead Search API
 *
 * GET /api/blog/typeahead?q=anxiety
 *
 * Returns fast typeahead results with highlighted matching text.
 * Optimized for speed with limited results (max 10).
 */
export const GET: RequestHandler = async ({ url, locals }) => {
	try {
		const supabase = locals.supabase;
		const query = url.searchParams.get('q')?.trim();

		if (!query || query.length < 2) {
			return json({ results: [], query: query || '' });
		}

		if (query.length > 200) {
			return json({ results: [], query, error: 'Search query too long' }, { status: 400 });
		}

		// Use the RPC function for typeahead with headline generation
		// Cast to any to bypass type checking until Supabase types are regenerated
		const { data: results, error: rpcError } = await supabase.rpc('typeahead_blog_search', {
			search_query: query,
			result_limit: 10
		});

		if (rpcError) {
			console.error('Typeahead RPC error:', rpcError);

			// Fallback to simpler query if RPC doesn't exist
			return await fallbackSearch(supabase, query);
		}

		const formattedResults: TypeaheadResult[] = (results || []).map((row: any) => ({
			id: row.id,
			source: row.source,
			title: row.title,
			slug: row.slug,
			url: generateBlogUrl(row.source, row.slug, row.category),
			enneagram: row.enneagram,
			category: row.category,
			headline: row.headline || row.title,
			rank: row.rank
		}));

		return json({ results: formattedResults, query });
	} catch (error) {
		console.error('Typeahead search error:', error);
		return json(
			{ results: [], query: url.searchParams.get('q') || '', error: 'Search failed' },
			{ status: 500 }
		);
	}
};

async function fallbackSearch(supabase: any, query: string): Promise<Response> {
	const allResults: TypeaheadResult[] = [];

	// Search blogs_content with full-text search
	const { data: contentData } = await supabase
		.from('blogs_content')
		.select('id, slug, title, description, content, enneagram, category')
		.eq('published', true)
		.textSearch('search_vector', query, { type: 'websearch' })
		.order('lastmod', { ascending: false, nullsLast: true })
		.limit(5);

	if (contentData) {
		for (const row of contentData) {
			allResults.push({
				id: row.id,
				source: 'content',
				title: row.title,
				slug: row.slug,
				url: generateBlogUrl('content', row.slug, row.category),
				enneagram: row.enneagram,
				category: row.category,
				headline: findMatchingSnippet(query, row.title, row.description, row.content),
				rank: 1
			});
		}
	}

	// Search blogs_famous_people
	const { data: peopleData } = await supabase
		.from('blogs_famous_people')
		.select('id, person, title, description, content, enneagram, category')
		.eq('published', true)
		.textSearch('search_vector', query, { type: 'websearch' })
		.order('lastmod', { ascending: false, nullsLast: true })
		.limit(5);

	if (peopleData) {
		for (const row of peopleData) {
			allResults.push({
				id: row.id,
				source: 'famous_people',
				title: row.title,
				slug: row.person,
				url: `/personality-analysis/${row.person}`,
				enneagram: row.enneagram,
				category: row.category,
				headline: findMatchingSnippet(query, row.title, row.person, row.description, row.content),
				rank: 1
			});
		}
	}

	return json({ results: allResults.slice(0, 10), query });
}

/**
 * Find a matching snippet in the text and highlight it
 */
function findMatchingSnippet(query: string, ...texts: (string | null)[]): string {
	const lowerQuery = query.toLowerCase();

	for (const text of texts) {
		if (!text) continue;

		const lowerText = text.toLowerCase();
		const index = lowerText.indexOf(lowerQuery);

		if (index !== -1) {
			// Get surrounding context (50 chars before and after)
			const start = Math.max(0, index - 50);
			const end = Math.min(text.length, index + query.length + 50);

			let snippet = text.slice(start, end);

			// Add ellipsis if we're not at the start/end
			if (start > 0) snippet = '...' + snippet;
			if (end < text.length) snippet = snippet + '...';

			// Wrap the matching part in <mark> tags
			const matchStart = index - start + (start > 0 ? 3 : 0);
			const matchEnd = matchStart + query.length;

			const before = snippet.slice(0, matchStart);
			const match = snippet.slice(matchStart, matchEnd);
			const after = snippet.slice(matchEnd);

			return `${before}<mark>${match}</mark>${after}`;
		}
	}

	// No match found, return first text truncated
	const firstText = texts.find((t) => t && t.length > 0);
	if (firstText) {
		return firstText.length > 100 ? firstText.slice(0, 100) + '...' : firstText;
	}

	return '';
}
