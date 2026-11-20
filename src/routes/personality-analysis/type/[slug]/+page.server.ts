// src/routes/personality-analysis/type/[slug]/+page.server.ts

import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { Database } from '../../../../../database.types';
import { getReviewedPersonTypes } from '$lib/reviewedPersonTypes';
import {
	formatPersonalityDisplayName,
	normalizePersonalitySlug
} from '$lib/utils/personalityAnalysis';
import { getTypeCorpusInsight } from '$lib/server/typeCorpusStats';
import personalityFame from '$lib/generated/personalityFame.json';
import { sortPeopleByFame, type FameViews } from './typeHubOrder';
import { getTypeHubRoleLabels, groupPeopleByNiche } from './typeHubGroups';
import { descriptionHook, findTitlePatterns } from './typeHubPatterns';
import { buildVennLayout, findCrossovers } from './typeHubVenn';
import { FIELD_BY_KEY, bornYearFor, homePathFor } from '$lib/peopleTaxonomy';
import { buildTimeline, type TimelinePerson } from '$lib/peopleTimeline';

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
	const posts: PersonPost[] = (personData ?? []).map(({ persona_title, description, ...entry }) => {
		const slug = normalizePersonalitySlug(entry.person);
		return {
			...entry,
			slug,
			type: getReviewedPersonTypes(slug, entry.type),
			personaTitle: persona_title?.trim() || null,
			hook: descriptionHook(description)
		};
	});

	// Best-known first (Wikipedia pageview snapshot), then newest first for anyone
	// without fame data. The FAQ's "famous Type N" names read from this order too.
	const publishedPosts = sortPeopleByFame(posts, personalityFame.views as FameViews);
	// Fields with 3+ people here get a circle; smaller ones sit as labeled lanes in "More".
	const peopleGroups = groupPeopleByNiche(publishedPosts, slug);
	const memberships = findCrossovers(peopleGroups);
	const patterns = findTitlePatterns(publishedPosts);
	// Landscape map for wide screens, portrait for phones.
	const venn = {
		wide: buildVennLayout(peopleGroups, 'wide', memberships),
		tall: buildVennLayout(peopleGroups, 'tall', memberships)
	};

	const corpusInsight = getTypeCorpusInsight(slug);

	// Share each card across its field, lane and flat list in the page payload.
	const people = publishedPosts.map((post) => {
		const { type: _type, ...person } = post;
		return {
			...person,
			roles: getTypeHubRoleLabels(post),
			secondaryFields: memberships.get(person.slug) ?? []
		};
	});
	const cards = new Map(people.map((person) => [person.slug, person]));

	// Birth-year view: every person of this type, oldest generation on the left.
	const timeline = buildTimeline(
		publishedPosts.map((post): TimelinePerson => ({
			slug: post.slug,
			name: formatPersonalityDisplayName(post.slug),
			born: bornYearFor(post.slug),
			enneagram: post.enneagram == null ? null : String(post.enneagram),
			personaTitle: post.personaTitle,
			accent: FIELD_BY_KEY.get(homePathFor(post)?.[0] ?? '')?.accent ?? null
		})),
		(person) => person.born
	);
	const cardFor = (person: PersonPost) => cards.get(person.slug)!;

	return {
		people,
		peopleGroups: peopleGroups.map((group) => ({
			...group,
			people: group.people.map(cardFor),
			lanes: group.lanes.map((lane) => ({ ...lane, people: lane.people.map(cardFor) }))
		})),
		patterns,
		venn,
		timeline,
		slug,
		corpusInsight
	};
};
