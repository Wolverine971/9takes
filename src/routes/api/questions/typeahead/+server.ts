import { json } from '@sveltejs/kit';
import { elasticClient } from '$lib/elasticSearch';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const searchString = url.searchParams.get('q');

		if (!searchString || searchString.length < 2) {
			return json({ results: [] });
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
			highlighted: hit.highlight?.question?.[0] || hit._source.question
		}));

		return json({ results });
	} catch (error) {
		console.error('Typeahead search error:', error);
		return json({ results: [], error: 'Search failed' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.formData();
		const searchString = body.get('searchString') as string;

		if (!searchString || searchString.length < 2) {
			return json({ results: [] });
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
			highlighted: hit.highlight?.question?.[0] || hit._source.question
		}));

		return json({ results });
	} catch (error) {
		console.error('Typeahead search error:', error);
		return json({ results: [], error: 'Search failed' }, { status: 500 });
	}
};