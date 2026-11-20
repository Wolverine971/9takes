// src/routes/personality-analysis/categories/[slug]/+page.server.ts
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getPersonalityCategoryBySlug } from '$lib/personalityCategories';
import {
	getEarliestCategoryDate,
	getEnneagramDistribution,
	getLatestCategoryDate,
	getPersonalityCategoryGroups,
	mapPersonalityCategoryRows,
	sortPeopleForCategory,
	type PersonalityCategoryRow
} from '$lib/server/personalityCategoryData';
import { getPersonalityCategoryStats } from '$lib/server/personalityCategoryStats';
import { FIELD_BY_KEY } from '$lib/peopleTaxonomy';
import { buildTimeline, type TimelinePerson } from '$lib/peopleTimeline';

export const load: PageServerLoad = async ({ locals, params }) => {
	const category = getPersonalityCategoryBySlug(params.slug);

	if (!category) {
		throw error(404, { message: 'Category not found' });
	}

	const supabase = locals.supabase;
	const { data, error: peopleError } = await supabase
		.from('blogs_famous_people')
		.select(
			'person, enneagram, title, description, persona_title, lastmod, date, type, content_quality'
		)
		.eq('published', true);

	if (peopleError) {
		console.log(peopleError);
		throw error(500, { message: 'Error loading category page' });
	}

	const allPeople = mapPersonalityCategoryRows((data ?? []) as PersonalityCategoryRow[]);
	const people = sortPeopleForCategory(
		allPeople.filter((person) =>
			category.slug === 'tech-business'
				? person.categorySlugs.some((slug) => slug === 'technology' || slug === 'business')
				: person.categorySlugs.includes(category.slug)
		)
	);
	// A field with nobody published yet (e.g. Crime & Notoriety) has no page.
	if (!people.length) throw error(404, { message: 'Category not found' });
	const featured = people.slice(0, 4);
	const latestUpdate = getLatestCategoryDate(people);
	const earliestPublish = getEarliestCategoryDate(people);
	const distribution = getEnneagramDistribution(people);
	const groups = getPersonalityCategoryGroups(category.slug, people, { includeSecondary: true });
	const corpusStats = getPersonalityCategoryStats(category.slug);

	const relatedCategories = category.related
		.map((slug) => {
			const relatedCategory = getPersonalityCategoryBySlug(slug);
			if (!relatedCategory) return null;

			return {
				...relatedCategory,
				count: allPeople.filter((person) => person.categorySlugs.includes(slug)).length
			};
		})
		.filter((value): value is NonNullable<typeof value> => value !== null);

	// The field's niches, shown as chips under the hero.
	const nicheLabels = category.fields.flatMap(
		(field) => FIELD_BY_KEY.get(field)?.niches.map((niche) => niche.label) ?? []
	);

	// Birth-year view of everyone on the page, oldest generation on the left.
	const timeline = buildTimeline(
		people.map((person): TimelinePerson => ({
			slug: person.slug,
			name: person.name,
			born: person.born,
			enneagram: person.enneagram,
			personaTitle: person.personaTitle,
			accent: FIELD_BY_KEY.get(person.home?.[0] ?? '')?.accent ?? null
		})),
		(person) => person.born
	);

	return {
		category,
		nicheLabels,
		timeline,
		people,
		groups,
		featured,
		distribution,
		latestUpdate,
		earliestPublish,
		relatedCategories,
		corpusStats
	};
};
