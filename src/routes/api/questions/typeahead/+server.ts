// src/routes/api/questions/typeahead/+server.ts
import { json } from '@sveltejs/kit';
import { elasticClient } from '$lib/server/elasticSearch';
import type { RequestHandler } from './$types';

/** Strip all HTML except <em> tags used by Elasticsearch highlights */
function sanitizeHighlight(html: string): string {
	// Temporarily replace ES highlight tags with placeholders
	let safe = html.replace(/<em>/gi, '\x00EM_OPEN\x00').replace(/<\/em>/gi, '\x00EM_CLOSE\x00');
	// Escape all remaining HTML
	safe = safe.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	// Restore highlight tags
	return safe.replace(/\x00EM_OPEN\x00/g, '<em>').replace(/\x00EM_CLOSE\x00/g, '</em>');
}

export const GET: RequestHandler = async ({ url, locals }) => {
	// Add authentication check
	if (!locals.session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const searchString = url.searchParams.get('q');

		if (!searchString || searchString.length < 2) {
			return json({ results: [] });
		}

		// Add maximum length validation
		if (searchString.length > 200) {
			return json({ results: [], error: 'Search query too long' }, { status: 400 });
		}

		const {
			hits: { hits }
		} = await elasticClient.search({
			index: 'question',
			body: {
				query: {
					bool: {
						should: [
							{
								match_phrase_prefix: {
									question: {
										query: searchString,
										boost: 2
									}
								}
							},
							{
								match: {
									question: {
										query: searchString,
										fuzziness: 'AUTO',
										boost: 1
									}
								}
							}
						]
					}
				},
				highlight: {
					fields: {
						question: {
							fragment_size: 150,
							number_of_fragments: 1
						}
					}
				},
				size: 10,
				_source: ['question', 'url', 'id', 'comment_count']
			}
		});

		const results = hits.map((hit: any) => ({
			id: hit._source.id,
			question: hit._source.question,
			url: hit._source.url,
			comment_count: hit._source.comment_count || 0,
			highlighted: sanitizeHighlight(hit.highlight?.question?.[0] || hit._source.question)
		}));

		return json({ results });
	} catch (error) {
		console.error('Typeahead search error:', error);
		return json({ results: [], error: 'Search failed' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request, locals }) => {
	// Add authentication check
	if (!locals.session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const body = await request.formData();
		const searchString = body.get('searchString') as string;

		if (!searchString || searchString.length < 2) {
			return json({ results: [] });
		}

		// Add maximum length validation
		if (searchString.length > 200) {
			return json({ results: [], error: 'Search query too long' }, { status: 400 });
		}

		const {
			hits: { hits }
		} = await elasticClient.search({
			index: 'question',
			body: {
				query: {
					bool: {
						should: [
							{
								match_phrase_prefix: {
									question: {
										query: searchString,
										boost: 2
									}
								}
							},
							{
								match: {
									question: {
										query: searchString,
										fuzziness: 'AUTO',
										boost: 1
									}
								}
							}
						]
					}
				},
				highlight: {
					fields: {
						question: {
							fragment_size: 150,
							number_of_fragments: 1
						}
					}
				},
				size: 10,
				_source: ['question', 'url', 'id', 'comment_count']
			}
		});

		const results = hits.map((hit: any) => ({
			id: hit._source.id,
			question: hit._source.question,
			url: hit._source.url,
			comment_count: hit._source.comment_count || 0,
			highlighted: sanitizeHighlight(hit.highlight?.question?.[0] || hit._source.question)
		}));

		return json({ results });
	} catch (error) {
		console.error('Typeahead search error:', error);
		return json({ results: [], error: 'Search failed' }, { status: 500 });
	}
};
