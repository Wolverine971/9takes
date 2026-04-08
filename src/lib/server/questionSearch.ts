// src/lib/server/questionSearch.ts
import { appendQuestionSlugSuffix } from '$lib/utils/questionSlug';

interface QuestionSearchRow {
	id: number;
	url: string | null;
	question: string | null;
	question_formatted: string | null;
	comment_count: number | null;
	context?: string | null;
	category_names?: string | null;
	headline?: string | null;
	rank?: number | null;
	created_at?: string | null;
	updated_at?: string | null;
}

export interface QuestionTypeaheadResult {
	id: number;
	question: string;
	url: string;
	comment_count: number;
	highlighted: string;
}

export interface QuestionSearchResult {
	id: number;
	title: string;
	url: string;
	comment_count: number;
	description: string;
	highlighted: string;
	rank: number;
	updated_at: string | null;
	category_names: string[];
}

export interface QuestionSearchResponse {
	results: QuestionSearchResult[];
	total: number;
}

function escapeHtml(value: string): string {
	return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function sanitizeHighlightedHtml(html: string): string {
	let safe = html
		.replace(/<mark>/gi, '\x00MARK_OPEN\x00')
		.replace(/<\/mark>/gi, '\x00MARK_CLOSE\x00');
	safe = escapeHtml(safe);
	return safe.replace(/\x00MARK_OPEN\x00/g, '<mark>').replace(/\x00MARK_CLOSE\x00/g, '</mark>');
}

function normalizeQuestionSlug(url: string | null | undefined): string {
	return (url || '').trim();
}

function buildQuestionPath(url: string | null | undefined): string {
	const normalized = normalizeQuestionSlug(url);
	return normalized ? `/questions/${normalized}` : '';
}

function normalizeCategoryNames(value: string | null | undefined): string[] {
	return (value || '')
		.split(',')
		.map((part) => part.trim())
		.filter(Boolean);
}

function truncateText(value: string | null | undefined, maxLength = 140): string {
	const normalized = (value || '').replace(/\s+/g, ' ').trim();
	if (!normalized) {
		return '';
	}
	if (normalized.length <= maxLength) {
		return normalized;
	}
	return `${normalized.slice(0, maxLength - 3).trimEnd()}...`;
}

export function highlightQuestionSnippet(
	query: string,
	...texts: Array<string | null | undefined>
): string {
	const normalizedQuery = query.trim();
	if (!normalizedQuery) {
		return escapeHtml((texts.find((text) => text && text.trim()) || '').slice(0, 120));
	}

	const queryPattern = new RegExp(escapeRegExp(normalizedQuery), 'i');

	for (const text of texts) {
		if (!text) continue;

		const match = queryPattern.exec(text);
		if (!match || match.index === undefined) continue;

		const start = Math.max(0, match.index - 50);
		const end = Math.min(text.length, match.index + normalizedQuery.length + 50);
		const prefix = start > 0 ? '...' : '';
		const suffix = end < text.length ? '...' : '';
		const before = escapeHtml(text.slice(start, match.index));
		const matched = escapeHtml(text.slice(match.index, match.index + normalizedQuery.length));
		const after = escapeHtml(text.slice(match.index + normalizedQuery.length, end));

		return `${prefix}${before}<mark>${matched}</mark>${after}${suffix}`;
	}

	const fallback = texts.find((text) => text && text.trim()) || '';
	return escapeHtml(fallback.slice(0, 120) + (fallback.length > 120 ? '...' : ''));
}

function mapQuestionTypeaheadRow(
	row: QuestionSearchRow,
	query: string
): QuestionTypeaheadResult | null {
	const question = (row.question_formatted || row.question || '').trim();
	const url = normalizeQuestionSlug(row.url);

	if (!question || !url) {
		return null;
	}

	return {
		id: row.id,
		question,
		url,
		comment_count: row.comment_count ?? 0,
		highlighted: row.headline
			? sanitizeHighlightedHtml(row.headline)
			: highlightQuestionSnippet(query, row.question_formatted, row.question, row.context)
	};
}

function mapQuestionSearchRow(row: QuestionSearchRow, query: string): QuestionSearchResult | null {
	const title = (row.question_formatted || row.question || '').trim();
	const url = buildQuestionPath(row.url);

	if (!title || !url) {
		return null;
	}

	const categoryNames = normalizeCategoryNames(row.category_names);
	const description =
		categoryNames.length > 0 ? categoryNames.join(' · ') : truncateText(row.context);

	return {
		id: row.id,
		title,
		url,
		comment_count: row.comment_count ?? 0,
		description,
		highlighted: row.headline
			? sanitizeHighlightedHtml(row.headline)
			: highlightQuestionSnippet(
					query,
					row.question_formatted,
					row.question,
					row.category_names,
					row.context
				),
		rank: row.rank ?? 0,
		updated_at: row.updated_at ?? row.created_at ?? null,
		category_names: categoryNames
	};
}

async function fallbackQuestionTypeahead(
	supabase: any,
	query: string,
	limit: number
): Promise<QuestionTypeaheadResult[]> {
	const normalized = query
		.trim()
		.replace(/[^a-z0-9\s-]/gi, ' ')
		.trim();
	if (normalized.length < 2) {
		return [];
	}

	const pattern = `%${normalized.replace(/\s+/g, '%')}%`;
	const { data, error } = await supabase
		.from('questions')
		.select('id, url, question, question_formatted, comment_count, context')
		.eq('removed', false)
		.or(`question.ilike.${pattern},question_formatted.ilike.${pattern},context.ilike.${pattern}`)
		.order('comment_count', { ascending: false })
		.limit(limit);

	if (error) {
		throw error;
	}

	return (data || [])
		.map((row: QuestionSearchRow) => mapQuestionTypeaheadRow(row, normalized))
		.filter((row: QuestionTypeaheadResult | null): row is QuestionTypeaheadResult => row !== null);
}

async function fallbackQuestionSearch(
	supabase: any,
	query: string,
	limit: number,
	offset: number
): Promise<QuestionSearchResponse> {
	const normalized = query
		.trim()
		.replace(/[^a-z0-9\s-]/gi, ' ')
		.trim();
	if (normalized.length < 2) {
		return { results: [], total: 0 };
	}

	const pattern = `%${normalized.replace(/\s+/g, '%')}%`;
	const { data, error, count } = await supabase
		.from('questions')
		.select(
			'id, url, question, question_formatted, comment_count, context, created_at, updated_at',
			{ count: 'exact' }
		)
		.eq('removed', false)
		.or(`question.ilike.${pattern},question_formatted.ilike.${pattern},context.ilike.${pattern}`)
		.order('comment_count', { ascending: false })
		.order('updated_at', { ascending: false })
		.range(offset, offset + limit - 1);

	if (error) {
		throw error;
	}

	const results = (data || [])
		.map((row: QuestionSearchRow) => mapQuestionSearchRow(row, normalized))
		.filter((row: QuestionSearchResult | null): row is QuestionSearchResult => row !== null);

	return {
		results,
		total: count ?? results.length
	};
}

export async function searchQuestionsTypeahead(
	supabase: any,
	query: string,
	limit = 10
): Promise<QuestionTypeaheadResult[]> {
	const normalized = query.trim();
	if (normalized.length < 2) {
		return [];
	}

	try {
		const { data, error } = await supabase.rpc('typeahead_question_search', {
			search_query: normalized,
			result_limit: limit
		});

		if (error) {
			console.warn('Question typeahead RPC unavailable, using fallback search', error);
			return fallbackQuestionTypeahead(supabase, normalized, limit);
		}

		return (data || [])
			.map((row: QuestionSearchRow) => mapQuestionTypeaheadRow(row, normalized))
			.filter(
				(row: QuestionTypeaheadResult | null): row is QuestionTypeaheadResult => row !== null
			);
	} catch (error) {
		console.warn('Question typeahead RPC threw, using fallback search', error);
		return fallbackQuestionTypeahead(supabase, normalized, limit);
	}
}

export async function searchQuestions(
	supabase: any,
	query: string,
	options: { limit?: number; offset?: number } = {}
): Promise<QuestionSearchResponse> {
	const normalized = query.trim();
	if (normalized.length < 2) {
		return { results: [], total: 0 };
	}

	const limit = Math.min(Math.max(options.limit ?? 20, 1), 100);
	const offset = Math.max(options.offset ?? 0, 0);

	try {
		const { data, error, count } = await supabase.rpc(
			'search_questions',
			{
				search_query: normalized,
				result_limit: limit,
				result_offset: offset
			},
			{ count: 'exact' }
		);

		if (error) {
			console.warn('Question search RPC unavailable, using fallback search', error);
			return fallbackQuestionSearch(supabase, normalized, limit, offset);
		}

		const results = (data || [])
			.map((row: QuestionSearchRow) => mapQuestionSearchRow(row, normalized))
			.filter((row: QuestionSearchResult | null): row is QuestionSearchResult => row !== null);

		return {
			results,
			total: typeof count === 'number' ? count : results.length
		};
	} catch (error) {
		console.warn('Question search RPC threw, using fallback search', error);
		return fallbackQuestionSearch(supabase, normalized, limit, offset);
	}
}

export function buildUniqueQuestionUrl(baseUrl: string, existingUrls: string[]): string {
	const normalizedBaseUrl = baseUrl.trim();
	if (!normalizedBaseUrl) {
		return normalizedBaseUrl;
	}

	const pattern = new RegExp(`^${escapeRegExp(normalizedBaseUrl)}(?:-(\\d+))?$`);
	const usedSuffixes = new Set<number>();

	for (const existingUrl of existingUrls) {
		const match = pattern.exec(existingUrl.trim());
		if (!match) continue;

		if (!match[1]) {
			usedSuffixes.add(0);
			continue;
		}

		const suffix = Number(match[1]);
		if (Number.isInteger(suffix) && suffix > 0) {
			usedSuffixes.add(suffix);
		}
	}

	if (!usedSuffixes.has(0)) {
		return normalizedBaseUrl;
	}

	let nextSuffix = 1;
	while (usedSuffixes.has(nextSuffix)) {
		nextSuffix += 1;
	}

	return appendQuestionSlugSuffix(normalizedBaseUrl, nextSuffix);
}

export async function findAvailableQuestionUrl(
	supabase: any,
	baseUrl: string,
	table = 'questions'
): Promise<string> {
	const { data, error } = await supabase
		.from(table)
		.select('url')
		.like('url', `${baseUrl}%`)
		.limit(200);

	if (error) {
		throw error;
	}

	const existingUrls = (data || [])
		.map((row: { url: string | null }) => row.url || '')
		.filter((url: string) => url.length > 0);

	return buildUniqueQuestionUrl(baseUrl, existingUrls);
}
