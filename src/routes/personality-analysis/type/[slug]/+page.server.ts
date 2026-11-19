// src/routes/personality-analysis/type/[slug]/+page.server.ts

import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { Database } from '../../../../../database.types';
import { normalizePersonalitySlug } from '$lib/utils/personalityAnalysis';
import { getTypeCorpusInsight } from '$lib/server/typeCorpusStats';
import personalityFame from '$lib/generated/personalityFame.json';
import { sortPeopleByFame, type FameViews } from './typeHubOrder';
import { groupPeopleByNiche, type TypeHubGroup } from './typeHubGroups';
import { descriptionHook, findTitlePatterns } from './typeHubPatterns';
import { buildVennLayout } from './typeHubVenn';

type FamousPersonRow = Database['public']['Tables']['blogs_famous_people']['Row'];
type PersonPost = Pick<
	FamousPersonRow,
	'person' | 'enneagram' | 'title' | 'date' | 'lastmod' | 'type'
> & {
	slug: string;
	personaTitle: string | null;
	/** First sentence of the meta description ("Why does X ...?"). */
	hook: string;
};

export const load: PageServerLoad = async ({ params, locals }) => {
	const supabase = locals.supabase;
	const slug = params.slug;

	const { data: personData, error: personDataError } = await supabase
		.from('blogs_famous_people')
		.select('person,enneagram,title,date,lastmod,type,persona_title,description')
		.eq('published', true)
		.eq('enneagram', slug);

	if (personDataError) {
		console.log(personDataError);

		throw error(404, { message: 'Error getting posts' });
	}
	const posts: PersonPost[] = (personData ?? []).map(
		({ persona_title, description, ...entry }) => ({
			...entry,
			slug: normalizePersonalitySlug(entry.person),
			personaTitle: persona_title?.trim() || null,
			hook: descriptionHook(description)
		})
	);

	// Best-known first (Wikipedia pageview snapshot), then newest first for anyone
	// without fame data. The FAQ's "famous Type N" names read from this order too.
	const publishedPosts = sortPeopleByFame(posts, personalityFame.views as FameViews);
	// Every field gets its own circle on the map, however small.
	const peopleGroups = groupPeopleByNiche(publishedPosts, slug, { minFieldSize: 1 });
	const patterns = findTitlePatterns(publishedPosts);
	// Landscape map for wide screens, portrait for phones.
	const venn = {
		wide: buildVennLayout(peopleGroups, 'wide'),
		tall: buildVennLayout(peopleGroups, 'tall')
	};

	const corpusInsight = getTypeCorpusInsight(slug);

	// `type` only feeds the grouping; the page doesn't need it.
	const people = publishedPosts.map(({ type: _type, ...person }) => person);

	return {
		people,
		peopleGroups: peopleGroups.map(stripGroupTypes),
		patterns,
		venn,
		slug,
		corpusInsight
	};
};

function stripGroupTypes<T extends { type?: unknown }>(group: TypeHubGroup<T>) {
	const strip = ({ type: _type, ...person }: T) => person;
	return {
		...group,
		people: group.people.map(strip),
		lanes: group.lanes.map((lane) => ({ ...lane, people: lane.people.map(strip) }))
	};
}
