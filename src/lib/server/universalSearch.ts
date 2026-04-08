// src/lib/server/universalSearch.ts
import {
	type BlogSearchFilters,
	type BlogSearchResult,
	type BlogTypeaheadResult,
	searchBlogs,
	searchBlogTypeahead
} from '$lib/server/blogSearch';
import {
	type QuestionSearchResult,
	type QuestionTypeaheadResult,
	searchQuestions,
	searchQuestionsTypeahead
} from '$lib/server/questionSearch';

export type UniversalSearchScope = 'all' | 'library' | 'questions';
export type UniversalSearchSource = 'blog' | 'personality_analysis' | 'question';
export type UniversalSearchSubtype = 'content' | 'famous_people' | 'question';

export interface UniversalSearchResult {
	id: number;
	source: UniversalSearchSource;
	subtype: UniversalSearchSubtype;
	title: string;
	description: string;
	headline: string;
	url: string;
	category: string | null;
	enneagram: number | null;
	rank: number;
	updated_at: string | null;
	comment_count: number | null;
	tags: string[];
}

export interface UniversalSearchResponse {
	results: UniversalSearchResult[];
	query: string;
	scope: UniversalSearchScope;
	total: number;
}

export interface UniversalTypeaheadResponse {
	results: UniversalSearchResult[];
	query: string;
	scope: UniversalSearchScope;
}

const VALID_SCOPES = new Set<UniversalSearchScope>(['all', 'library', 'questions']);

export function parseUniversalSearchScope(value: string | null | undefined): UniversalSearchScope {
	const normalized = (value || '').trim().toLowerCase();
	if (VALID_SCOPES.has(normalized as UniversalSearchScope)) {
		return normalized as UniversalSearchScope;
	}

	if (normalized === 'blogs') {
		return 'library';
	}

	return 'all';
}

function includeLibrary(scope: UniversalSearchScope): boolean {
	return scope === 'all' || scope === 'library';
}

function includeQuestions(scope: UniversalSearchScope): boolean {
	return scope === 'all' || scope === 'questions';
}

function normalizeBlogResult(result: BlogSearchResult): UniversalSearchResult {
	return {
		id: result.id,
		source: result.source === 'famous_people' ? 'personality_analysis' : 'blog',
		subtype: result.source,
		title: result.title,
		description: result.description || '',
		headline: result.description || result.title,
		url: result.url,
		category: result.category,
		enneagram: result.enneagram,
		rank: result.rank,
		updated_at: result.lastmod,
		comment_count: null,
		tags: result.tags
	};
}

function normalizeBlogTypeaheadResult(result: BlogTypeaheadResult): UniversalSearchResult {
	return {
		id: result.id,
		source: result.source === 'famous_people' ? 'personality_analysis' : 'blog',
		subtype: result.source,
		title: result.title,
		description: result.category || '',
		headline: result.headline,
		url: result.url,
		category: result.category,
		enneagram: result.enneagram,
		rank: result.rank,
		updated_at: null,
		comment_count: null,
		tags: []
	};
}

function normalizeQuestionResult(result: QuestionSearchResult): UniversalSearchResult {
	return {
		id: result.id,
		source: 'question',
		subtype: 'question',
		title: result.title,
		description: result.description,
		headline: result.highlighted,
		url: result.url,
		category: result.category_names[0] ?? null,
		enneagram: null,
		rank: result.rank,
		updated_at: result.updated_at,
		comment_count: result.comment_count,
		tags: result.category_names
	};
}

function normalizeQuestionTypeaheadResult(result: QuestionTypeaheadResult): UniversalSearchResult {
	return {
		id: result.id,
		source: 'question',
		subtype: 'question',
		title: result.question,
		description: '',
		headline: result.highlighted,
		url: `/questions/${result.url}`,
		category: null,
		enneagram: null,
		rank: result.comment_count > 0 ? 1 + Math.min(result.comment_count / 100, 1) : 1,
		updated_at: null,
		comment_count: result.comment_count,
		tags: []
	};
}

function compareUniversalResults(
	left: UniversalSearchResult,
	right: UniversalSearchResult
): number {
	if (right.rank !== left.rank) {
		return right.rank - left.rank;
	}

	if ((right.comment_count ?? 0) !== (left.comment_count ?? 0)) {
		return (right.comment_count ?? 0) - (left.comment_count ?? 0);
	}

	const rightDate = right.updated_at ? new Date(right.updated_at).getTime() : 0;
	const leftDate = left.updated_at ? new Date(left.updated_at).getTime() : 0;
	if (rightDate !== leftDate) {
		return rightDate - leftDate;
	}

	return left.title.localeCompare(right.title);
}

export async function searchUniversal(
	supabase: any,
	query: string,
	options: {
		scope?: UniversalSearchScope;
		limit?: number;
		offset?: number;
		enneagram?: number | null;
		category?: string | null;
		type?: string | null;
	} = {}
): Promise<UniversalSearchResponse> {
	const normalizedQuery = query.trim();
	const scope = options.scope ?? 'all';
	const limit = Math.min(Math.max(options.limit ?? 20, 1), 100);
	const offset = Math.max(options.offset ?? 0, 0);
	const fetchLimit = Math.min(limit + offset, 100);

	if (normalizedQuery.length < 2) {
		return { results: [], query: normalizedQuery, scope, total: 0 };
	}

	const blogFilters: BlogSearchFilters = {
		enneagram: options.enneagram ?? null,
		category: options.category ?? null,
		type: options.type ?? null
	};

	const [blogResponse, questionResponse] = await Promise.all([
		includeLibrary(scope)
			? searchBlogs(supabase, normalizedQuery, {
					...blogFilters,
					limit: fetchLimit,
					offset: 0
				})
			: Promise.resolve({ results: [], total: 0 }),
		includeQuestions(scope)
			? searchQuestions(supabase, normalizedQuery, { limit: fetchLimit, offset: 0 })
			: Promise.resolve({ results: [], total: 0 })
	]);

	const mergedResults = [
		...blogResponse.results.map(normalizeBlogResult),
		...questionResponse.results.map(normalizeQuestionResult)
	].sort(compareUniversalResults);

	return {
		results: mergedResults.slice(offset, offset + limit),
		query: normalizedQuery,
		scope,
		total: blogResponse.total + questionResponse.total
	};
}

export async function searchUniversalTypeahead(
	supabase: any,
	query: string,
	options: {
		scope?: UniversalSearchScope;
		limit?: number;
	} = {}
): Promise<UniversalTypeaheadResponse> {
	const normalizedQuery = query.trim();
	const scope = options.scope ?? 'all';
	const limit = Math.min(Math.max(options.limit ?? 10, 1), 20);

	if (normalizedQuery.length < 2) {
		return { results: [], query: normalizedQuery, scope };
	}

	const [blogResults, questionResults] = await Promise.all([
		includeLibrary(scope)
			? searchBlogTypeahead(supabase, normalizedQuery, limit)
			: Promise.resolve([]),
		includeQuestions(scope)
			? searchQuestionsTypeahead(supabase, normalizedQuery, limit)
			: Promise.resolve([])
	]);

	const results = [
		...blogResults.map(normalizeBlogTypeaheadResult),
		...questionResults.map(normalizeQuestionTypeaheadResult)
	]
		.sort(compareUniversalResults)
		.slice(0, limit);

	return {
		results,
		query: normalizedQuery,
		scope
	};
}
