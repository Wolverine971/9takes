import { parseEnneagramParam } from '$lib/server/blogSearchUtils';
import { parseUniversalSearchScope, searchUniversal } from '$lib/server/universalSearch';
import type { PageServerLoad } from './$types';

const RESULTS_PER_PAGE = 20;

const CATEGORY_OPTIONS = [
	{ value: 'enneagram', label: 'Enneagram Corner' },
	{ value: 'mental-health', label: 'Mental Health' },
	{ value: 'community', label: 'Opinion Pieces' },
	{ value: 'guides', label: 'How-to Guides' },
	{ value: 'pop-culture', label: 'Pop Culture' },
	{ value: 'topical', label: 'Topical' },
	{ value: 'life-situations', label: 'Life Situations' }
];

const TYPE_OPTIONS = [
	{ value: 'nine-types', label: 'Type Guides' },
	{ value: 'relationships', label: 'Relationships' },
	{ value: 'communication', label: 'Communication' },
	{ value: 'dating', label: 'Dating' },
	{ value: 'career', label: 'Career' },
	{ value: 'workplace', label: 'Workplace' },
	{ value: 'mental-health', label: 'Mental Health' },
	{ value: 'stress', label: 'Stress' },
	{ value: 'growth', label: 'Growth' },
	{ value: 'anxiety', label: 'Anxiety' },
	{ value: 'depression', label: 'Depression' },
	{ value: 'therapy', label: 'Therapy' },
	{ value: 'trauma', label: 'Trauma' },
	{ value: 'family', label: 'Family' },
	{ value: 'compatibility', label: 'Compatibility' }
];

export const load: PageServerLoad = async ({ url, locals, setHeaders, depends }) => {
	depends('app:search');
	setHeaders({ 'cache-control': 'private, no-store' });

	const query = (url.searchParams.get('q') || '').trim();
	const scope = parseUniversalSearchScope(url.searchParams.get('scope'));
	const requestedPage = Number(url.searchParams.get('page') || '1');
	const currentPage = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

	const rawCategory = url.searchParams.get('category')?.trim() || '';
	const rawType = url.searchParams.get('type')?.trim() || '';
	const rawEnneagram = url.searchParams.get('enneagram')?.trim() || '';
	const enneagram = parseEnneagramParam(rawEnneagram || null);

	const activeCategory = scope === 'questions' ? '' : rawCategory;
	const activeType = scope === 'questions' ? '' : rawType;
	const activeEnneagram = scope === 'questions' ? '' : rawEnneagram;

	let errorMessage = '';
	let results: Awaited<ReturnType<typeof searchUniversal>>['results'] = [];
	let total = 0;

	if (query.length === 1) {
		errorMessage = 'Search query must be at least 2 characters.';
	} else if (query.length > 200) {
		errorMessage = 'Search query is too long.';
	} else if (rawEnneagram && enneagram === null && scope !== 'questions') {
		errorMessage = 'Invalid Enneagram filter.';
	} else if (query.length >= 2) {
		const response = await searchUniversal(locals.supabase, query, {
			scope,
			limit: RESULTS_PER_PAGE,
			offset: (currentPage - 1) * RESULTS_PER_PAGE,
			enneagram: scope === 'questions' ? null : enneagram,
			category: scope === 'questions' ? null : activeCategory || null,
			type: scope === 'questions' ? null : activeType || null
		});

		results = response.results;
		total = response.total;
	}

	return {
		query,
		scope,
		results,
		total,
		errorMessage,
		searchPerformed: query.length > 0,
		currentPage,
		totalPages: total > 0 ? Math.ceil(total / RESULTS_PER_PAGE) : 0,
		resultsPerPage: RESULTS_PER_PAGE,
		filters: {
			category: activeCategory,
			type: activeType,
			enneagram: activeEnneagram
		},
		categoryOptions: CATEGORY_OPTIONS,
		typeOptions: TYPE_OPTIONS,
		sampleQueries: [
			'Cillian Murphy',
			'Type 4 relationships',
			'How do I stop overthinking',
			'boundaries with friends',
			'attachment styles'
		]
	};
};
