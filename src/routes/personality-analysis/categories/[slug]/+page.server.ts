// src/routes/personality-analysis/categories/[slug]/+page.server.ts
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getPersonalityCategoryBySlug } from '$lib/personalityCategories';
import {
	getEnneagramDistribution,
	getLatestCategoryDate,
	getPersonalityCategoryGroups,
	mapPersonalityCategoryRows,
	sortPeopleForCategory,
	type PersonalityCategoryRow
} from '$lib/server/personalityCategoryData';
import { getPersonalityCategoryStats } from '$lib/server/personalityCategoryStats';

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
		allPeople.filter((person) => person.categorySlugs.includes(category.slug))
	);
	const featured = people.slice(0, 4);
	const latestUpdate = getLatestCategoryDate(people);
	const distribution = getEnneagramDistribution(people);
	const groups = getPersonalityCategoryGroups(category.slug, people);
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

	return {
		category,
		people,
		groups,
		featured,
		distribution,
		latestUpdate,
		relatedCategories,
		corpusStats
	};
};
