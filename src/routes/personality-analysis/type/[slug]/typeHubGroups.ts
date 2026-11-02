// src/routes/personality-analysis/type/[slug]/typeHubGroups.ts
import {
	PERSONALITY_CATEGORY_DEFINITIONS,
	getPersonalityCategorySlugs,
	normalizePeopleTypes
} from '$lib/personalityCategories';

type GroupablePerson = {
	slug: string;
	type?: unknown;
};

// Specific occupations take precedence over broad celebrity/historical tags.
// Within those tiers, the authored tag order determines a crossover's home.
const BROAD_TYPES = new Set(['celebrity', 'historical']);
const GROUP_DEFINITIONS = [
	...PERSONALITY_CATEGORY_DEFINITIONS.map(({ slug, label }) => ({ slug, label })),
	{ slug: 'athletes', label: 'Athletes & Sports' },
	{ slug: 'other', label: 'Other Public Figures' }
];

function typeKey(type: string): string {
	return type.replace(/[^a-z0-9]/gi, '').toLowerCase();
}

function getGroupSlug(person: GroupablePerson): string {
	const types = normalizePeopleTypes(person.type);
	const orderedTypes = [
		...types.filter((type) => !BROAD_TYPES.has(typeKey(type))),
		...types.filter((type) => BROAD_TYPES.has(typeKey(type)))
	];

	for (const type of orderedTypes) {
		if (typeKey(type) === 'athlete') return 'athletes';
		const categorySlug = getPersonalityCategorySlugs([type], person.slug)[0];
		if (categorySlug) return categorySlug;
	}

	return 'other';
}

/** One section per person, preserving the incoming fame order within each section. */
export function groupPeopleByNiche<T extends GroupablePerson>(people: T[]) {
	const grouped = new Map<string, T[]>();
	for (const person of people) {
		const slug = getGroupSlug(person);
		const members = grouped.get(slug) ?? [];
		members.push(person);
		grouped.set(slug, members);
	}

	return GROUP_DEFINITIONS.map((definition) => ({
		...definition,
		people: grouped.get(definition.slug) ?? []
	})).filter((group) => group.people.length > 0);
}
