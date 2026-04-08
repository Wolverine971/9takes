// src/lib/server/blogSearch.ts
import { normalizePersonalitySlug } from '$lib/utils/personalityAnalysis';
import { generateBlogUrl, normalizeTextArray, parseEnneagramParam } from './blogSearchUtils';

export interface BlogSearchFilters {
	enneagram?: number | null;
	category?: string | null;
	type?: string | null;
}

export interface BlogSearchResult {
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

export interface BlogSearchResponse {
	results: BlogSearchResult[];
	total: number;
}

export interface BlogTypeaheadResult {
	id: number;
	source: 'content' | 'famous_people';
	title: string;
	slug: string;
	url: string;
	enneagram: number | null;
	category: string | null;
	headline: string;
	rank: number;
}

function normalizeBlogRow(row: any): BlogSearchResult {
	const slug = row.source === 'famous_people' ? normalizePersonalitySlug(row.slug) : row.slug;

	return {
		id: row.id,
		source: row.source === 'famous_people' ? 'famous_people' : 'content',
		slug,
		title: row.title,
		description: row.description ?? '',
		enneagram: row.enneagram ?? null,
		type: normalizeTextArray(row.type),
		tags: normalizeTextArray(row.tags),
		category: row.category ?? null,
		lastmod: row.lastmod ?? null,
		rank: row.rank ?? 0,
		url: generateBlogUrl(row.source, slug, row.category ?? null)
	};
}

function normalizeBlogTypeaheadRow(row: any): BlogTypeaheadResult {
	const slug = row.source === 'famous_people' ? normalizePersonalitySlug(row.slug) : row.slug;

	return {
		id: row.id,
		source: row.source === 'famous_people' ? 'famous_people' : 'content',
		title: row.title,
		slug,
		url: generateBlogUrl(row.source, slug, row.category ?? null),
		enneagram: row.enneagram ?? null,
		category: row.category ?? null,
		headline: row.headline || row.title,
		rank: row.rank ?? 0
	};
}

function findMatchingSnippet(query: string, ...texts: (string | null | undefined)[]): string {
	const lowerQuery = query.toLowerCase();

	for (const text of texts) {
		if (!text) continue;

		const lowerText = text.toLowerCase();
		const index = lowerText.indexOf(lowerQuery);

		if (index === -1) {
			continue;
		}

		const start = Math.max(0, index - 50);
		const end = Math.min(text.length, index + query.length + 50);
		let snippet = text.slice(start, end);

		if (start > 0) snippet = '...' + snippet;
		if (end < text.length) snippet = snippet + '...';

		const matchStart = index - start + (start > 0 ? 3 : 0);
		const matchEnd = matchStart + query.length;

		return `${snippet.slice(0, matchStart)}<mark>${snippet.slice(matchStart, matchEnd)}</mark>${snippet.slice(matchEnd)}`;
	}

	const firstText = texts.find((text) => text && text.length > 0);
	if (!firstText) {
		return '';
	}

	return firstText.length > 100 ? `${firstText.slice(0, 100)}...` : firstText;
}

export async function searchBlogs(
	supabase: any,
	query: string,
	options: {
		enneagram?: string | number | null;
		category?: string | null;
		type?: string | null;
		limit?: number;
		offset?: number;
	} = {}
): Promise<BlogSearchResponse> {
	const normalizedQuery = query.trim();
	if (normalizedQuery.length < 2) {
		return { results: [], total: 0 };
	}

	const enneagramFilter =
		typeof options.enneagram === 'number'
			? options.enneagram
			: parseEnneagramParam(options.enneagram?.toString() ?? null);
	const category = options.category?.trim() || null;
	const type = options.type?.trim() || null;
	const limit = Math.min(Math.max(options.limit ?? 20, 1), 100);
	const offset = Math.max(options.offset ?? 0, 0);

	const {
		data: rpcResults,
		error: rpcError,
		count: rpcCount
	} = await supabase.rpc(
		'search_all_blogs',
		{
			search_query: normalizedQuery,
			filter_enneagram: enneagramFilter ?? undefined,
			filter_category: category ?? undefined,
			filter_type: type ?? undefined,
			result_limit: limit,
			result_offset: offset
		},
		{ count: 'exact' }
	);

	if (!rpcError && rpcResults) {
		const results = rpcResults.map((row: any) => normalizeBlogRow(row));
		return {
			results,
			total: typeof rpcCount === 'number' ? rpcCount : results.length
		};
	}

	console.warn('Blog search RPC unavailable, using fallback search', rpcError);

	const fallbackLimit = Math.min(limit + offset, 200);
	const allResults: BlogSearchResult[] = [];

	const contentQuery = supabase
		.from('blogs_content')
		.select('id, slug, title, description, enneagram, type, tags, category, lastmod', {
			count: 'exact'
		})
		.eq('published', true)
		.textSearch('search_vector', normalizedQuery, { type: 'websearch' })
		.order('lastmod', { ascending: false, nullsFirst: false })
		.limit(fallbackLimit);

	if (enneagramFilter) contentQuery.eq('enneagram', enneagramFilter);
	if (category) contentQuery.eq('category', category);
	if (type) contentQuery.contains('type', [type]);

	const peopleQuery = supabase
		.from('blogs_famous_people')
		.select('id, person, title, description, enneagram, type, tags, category, lastmod', {
			count: 'exact'
		})
		.eq('published', true)
		.textSearch('search_vector', normalizedQuery, { type: 'websearch' })
		.order('lastmod', { ascending: false, nullsFirst: false })
		.limit(fallbackLimit);

	if (enneagramFilter) peopleQuery.eq('enneagram', String(enneagramFilter));
	if (category) peopleQuery.eq('category', category);
	if (type) peopleQuery.contains('type', [type]);

	const [
		{ data: contentData, count: contentCount, error: contentError },
		{ data: peopleData, count: peopleCount, error: peopleError }
	] = await Promise.all([contentQuery, peopleQuery]);

	if (contentError && peopleError) {
		throw new Error('Fallback blog search failed for both queries');
	}

	if (contentError) {
		console.error('Fallback content search error:', contentError);
	}
	if (peopleError) {
		console.error('Fallback famous people search error:', peopleError);
	}

	if (contentData) {
		for (const row of contentData) {
			allResults.push(
				normalizeBlogRow({
					...row,
					source: 'content',
					type: row.type,
					tags: row.tags
				})
			);
		}
	}

	if (peopleData) {
		for (const row of peopleData) {
			allResults.push(
				normalizeBlogRow({
					id: row.id,
					source: 'famous_people',
					slug: row.person,
					title: row.title,
					description: row.description,
					enneagram: row.enneagram,
					type: row.type,
					tags: row.tags,
					category: row.category,
					lastmod: row.lastmod,
					rank: 0
				})
			);
		}
	}

	allResults.sort((left, right) => {
		const leftDate = left.lastmod ? new Date(left.lastmod).getTime() : 0;
		const rightDate = right.lastmod ? new Date(right.lastmod).getTime() : 0;
		return rightDate - leftDate;
	});

	return {
		results: allResults.slice(offset, offset + limit),
		total: (contentCount || 0) + (peopleCount || 0)
	};
}

export async function searchBlogTypeahead(
	supabase: any,
	query: string,
	limit = 10
): Promise<BlogTypeaheadResult[]> {
	const normalizedQuery = query.trim();
	if (normalizedQuery.length < 2) {
		return [];
	}

	const { data: results, error: rpcError } = await supabase.rpc('typeahead_blog_search', {
		search_query: normalizedQuery,
		result_limit: Math.min(Math.max(limit, 1), 20)
	});

	if (!rpcError && results) {
		return (results || []).map((row: any) => normalizeBlogTypeaheadRow(row));
	}

	console.error('Typeahead blog RPC error:', rpcError);

	const allResults: BlogTypeaheadResult[] = [];

	const { data: contentData } = await supabase
		.from('blogs_content')
		.select('id, slug, title, description, content, enneagram, category')
		.eq('published', true)
		.textSearch('search_vector', normalizedQuery, { type: 'websearch' })
		.order('lastmod', { ascending: false, nullsLast: true })
		.limit(Math.min(limit, 10));

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
				headline: findMatchingSnippet(normalizedQuery, row.title, row.description, row.content),
				rank: 1
			});
		}
	}

	const { data: peopleData } = await supabase
		.from('blogs_famous_people')
		.select('id, person, title, description, content, enneagram, category')
		.eq('published', true)
		.textSearch('search_vector', normalizedQuery, { type: 'websearch' })
		.order('lastmod', { ascending: false, nullsLast: true })
		.limit(Math.min(limit, 10));

	if (peopleData) {
		for (const row of peopleData) {
			allResults.push({
				id: row.id,
				source: 'famous_people',
				title: row.title,
				slug: normalizePersonalitySlug(row.person),
				url: generateBlogUrl('famous_people', row.person, row.category),
				enneagram: row.enneagram ? Number(row.enneagram) : null,
				category: row.category,
				headline: findMatchingSnippet(
					normalizedQuery,
					row.title,
					row.person,
					row.description,
					row.content
				),
				rank: 1
			});
		}
	}

	return allResults.slice(0, Math.min(limit, 10));
}
