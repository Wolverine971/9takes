// src/routes/api/questions/typeahead/+server.ts
import { searchQuestionsTypeahead } from '$lib/server/questionSearch';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

async function handleTypeahead(locals: App.Locals, searchString: string | null): Promise<Response> {
	if (!locals.session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const normalizedQuery = searchString?.trim() || '';

	if (normalizedQuery.length < 2) {
		return json({ results: [] });
	}

	if (normalizedQuery.length > 200) {
		return json({ results: [], error: 'Search query too long' }, { status: 400 });
	}

	try {
		const results = await searchQuestionsTypeahead(locals.supabase, normalizedQuery, 10);
		return json({ results });
	} catch (error) {
		console.error('Question typeahead search error:', error);
		return json({ results: [], error: 'Search failed' }, { status: 500 });
	}
}

export const GET: RequestHandler = async ({ url, locals }) => {
	return handleTypeahead(locals, url.searchParams.get('q'));
};

export const POST: RequestHandler = async ({ request, locals }) => {
	const body = await request.formData();
	return handleTypeahead(locals, body.get('searchString')?.toString() || null);
};
