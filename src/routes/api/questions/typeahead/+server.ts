// src/routes/api/questions/typeahead/+server.ts
import { searchCategoriesTypeahead, searchQuestionsTypeahead } from '$lib/server/questionSearch';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

async function handleTypeahead(locals: App.Locals, searchString: string | null): Promise<Response> {
	const normalizedQuery = searchString?.trim() || '';

	if (normalizedQuery.length < 2) {
		return json({ results: [], categories: [] });
	}

	if (normalizedQuery.length > 200) {
		return json({ results: [], categories: [], error: 'Search query too long' }, { status: 400 });
	}

	// Question search stays signed-in only; category suggestions are public
	// (category names are already visible on the questions page).
	const isAuthenticated = Boolean(locals.session?.user?.id);

	try {
		const [results, categories] = await Promise.all([
			isAuthenticated
				? searchQuestionsTypeahead(locals.supabase, normalizedQuery, 10)
				: Promise.resolve([]),
			searchCategoriesTypeahead(locals.supabase, normalizedQuery, 3)
		]);
		return json({ results, categories });
	} catch (error) {
		console.error('Question typeahead search error:', error);
		return json({ results: [], categories: [], error: 'Search failed' }, { status: 500 });
	}
}

export const GET: RequestHandler = async ({ url, locals }) => {
	return handleTypeahead(locals, url.searchParams.get('q'));
};

export const POST: RequestHandler = async ({ request, locals }) => {
	const body = await request.formData();
	return handleTypeahead(locals, body.get('searchString')?.toString() || null);
};
