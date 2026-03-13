// src/routes/personality-analysis/categories/+page.server.ts
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
	PERSONALITY_CATEGORY_DEFINITIONS,
	PRIMARY_PERSONALITY_CATEGORY_SLUGS,
	SECONDARY_PERSONALITY_CATEGORY_SLUGS,
	type PersonalityCategoryDefinition
} from '$lib/personalityCategories';
import {
	getEnneagramDistribution,
	getLatestCategoryDate,
	mapPersonalityCategoryRows,
	sortPeopleForCategory,
	type PersonalityCategoryRow
} from '$lib/server/personalityCategoryData';

export const load: PageServerLoad = async ({ locals }) => {
	const supabase = locals.supabase;
	const { data, error: peopleError } = await supabase
		.from('blogs_famous_people')
		.select(
			'person, enneagram, title, description, persona_title, lastmod, date, type, content_quality'
		)
		.eq('published', true);

	if (peopleError) {
		console.log(peopleError);
		throw error(500, { message: 'Error loading personality analysis categories' });
	}

	const people = mapPersonalityCategoryRows((data ?? []) as PersonalityCategoryRow[]);

	const categories = PERSONALITY_CATEGORY_DEFINITIONS.map((category) => {
		const categoryPeople = sortPeopleForCategory(
			people.filter((person) => person.categorySlugs.includes(category.slug))
		);

		return {
			...category,
			count: categoryPeople.length,
			featured: categoryPeople.slice(0, 4),
			distribution: getEnneagramDistribution(categoryPeople),
			latestUpdate: getLatestCategoryDate(categoryPeople)
		};
	});

	const categoryMap = new Map(categories.map((category) => [category.slug, category]));
	const isCategory = (
		value: (typeof categories)[number] | undefined
	): value is PersonalityCategoryDefinition & {
		count: number;
		featured: ReturnType<typeof sortPeopleForCategory>;
		distribution: ReturnType<typeof getEnneagramDistribution>;
		latestUpdate: string | null;
	} => value !== undefined;

	return {
		totalPeople: people.length,
		primaryCategories: PRIMARY_PERSONALITY_CATEGORY_SLUGS.map((slug) =>
			categoryMap.get(slug)
		).filter(isCategory),
		secondaryCategories: SECONDARY_PERSONALITY_CATEGORY_SLUGS.map((slug) =>
			categoryMap.get(slug)
		).filter(isCategory)
	};
};
