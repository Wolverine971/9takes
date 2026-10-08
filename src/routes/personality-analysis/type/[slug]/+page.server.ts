// src/routes/personality-analysis/type/[slug]/+page.server.ts

import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { Database } from '../../../../../database.types';
import { normalizePersonalitySlug } from '$lib/utils/personalityAnalysis';
import { getTypeCorpusInsight, type TypeCorpusInsight } from '$lib/server/typeCorpusStats';
import personalityFame from '$lib/generated/personalityFame.json';
import { sortPeopleByFame, type FameViews } from './typeHubOrder';

type FamousPersonRow = Database['public']['Tables']['blogs_famous_people']['Row'];
type PersonPost = Pick<FamousPersonRow, 'person' | 'enneagram' | 'title' | 'date' | 'lastmod'> & {
	slug: string;
};

export const load: PageServerLoad = async ({
	params,
	locals
}): Promise<{ people: App.BlogPost[]; slug: string; corpusInsight: TypeCorpusInsight | null }> => {
	const supabase = locals.supabase;
	const slug = params.slug;

	const { data: personData, error: personDataError } = await supabase
		.from('blogs_famous_people')
		.select('person,enneagram,title,date,lastmod')
		.eq('published', true)
		.eq('enneagram', slug);

	if (personDataError) {
		console.log(personDataError);

		throw error(404, { message: 'Error getting posts' });
	}
	const posts: PersonPost[] = (personData ?? []).map((entry) => ({
		...entry,
		slug: normalizePersonalitySlug(entry.person)
	}));

	// Best-known first (Wikipedia pageview snapshot), then newest first for anyone
	// without fame data. The FAQ's "famous Type N" names read from this order too.
	const publishedPosts = sortPeopleByFame(posts, personalityFame.views as FameViews);

	const corpusInsight = getTypeCorpusInsight(slug);

	return { people: publishedPosts as unknown as App.BlogPost[], slug, corpusInsight };
};
