// src/routes/personality-analysis/type/[slug]/typeHubGroups.ts
import {
	PERSONALITY_CATEGORY_DEFINITIONS,
	PERSONALITY_CATEGORY_SLUGS,
	normalizePeopleTypes,
	type PersonalityCategorySlug
} from '$lib/personalityCategories';
import { getClusterLaneShortLabel, getPrimaryField } from '$lib/personClusterTags.js';
import {
	getPersonalityCategoryGroups,
	type PersonalityCategoryPerson
} from '$lib/server/personalityCategoryData';

type GroupablePerson = {
	slug: string;
	type?: unknown;
};

export type TypeHubLane<T> = {
	slug: string;
	/** Empty when the field has no lanes worth naming (one unlabeled crowd). */
	label: string;
	people: T[];
};

export type TypeHubGroup<T> = {
	slug: string;
	label: string;
	accent: string | null;
	/** Everyone in the field, best-known first. people[0] is the spotlight lead. */
	people: T[];
	/** people[1..] split into lanes. Empty when the lead is the whole field. */
	lanes: TypeHubLane<T>[];
};

const GROUP_DEFINITIONS: Array<{ slug: string; label: string; accent: string | null }> = [
	...PERSONALITY_CATEGORY_DEFINITIONS.map(({ slug, label, accent }) => ({ slug, label, accent })),
	{ slug: 'athletes', label: 'Athletes & Sports', accent: '#fb923c' },
	{ slug: 'other', label: 'Other Public Figures', accent: null }
];

// Lanes reuse the category pages' sub-groups (personalityCategoryData.ts), which
// read each person's cluster tags ('screen-icon', 'pop-star', ...). A field splits
// only when at least two lanes would each show two or more faces; smaller lanes
// and untagged people fold into "More".
const MIN_LANE_SIZE = 2;
const MIN_NAMED_LANES = 2;
const MORE_LANE = { slug: 'more', label: 'More' };
const SINGLE_LANE = { slug: 'all', label: '' };

// Specific occupations take precedence over broad celebrity/historical tags; within
// those tiers the authored tag order decides a crossover's home. The blog pipeline's
// cluster-tag check files people the same way (personClusterTags.js).
function getGroupSlug(person: GroupablePerson): string {
	return getPrimaryField(normalizePeopleTypes(person.type), person.slug);
}

function isCategorySlug(slug: string): slug is PersonalityCategorySlug {
	return (PERSONALITY_CATEGORY_SLUGS as readonly string[]).includes(slug);
}

// The lane matchers only read slug + types; the rest is filler for the shared type.
function toLaneCandidate(person: GroupablePerson): PersonalityCategoryPerson {
	return {
		slug: person.slug,
		name: person.slug,
		enneagram: null,
		title: null,
		description: null,
		personaTitle: null,
		lastmod: null,
		date: null,
		types: normalizePeopleTypes(person.type),
		categorySlugs: [],
		primaryCategorySlug: null,
		contentQualityScore: null
	};
}

/** Splits a field's crowd (everyone but the lead) into lanes, keeping fame order. */
export function buildLanes<T extends GroupablePerson>(
	groupSlug: string,
	crowd: T[]
): TypeHubLane<T>[] {
	if (crowd.length === 0) return [];

	const laneOf = new Map<string, string>();
	if (isCategorySlug(groupSlug)) {
		for (const lane of getPersonalityCategoryGroups(groupSlug, crowd.map(toLaneCandidate))) {
			// Category fallbacks ('other-*') are leftovers, not lanes.
			if (lane.slug.startsWith('other-')) continue;
			for (const person of lane.people) laneOf.set(person.slug, lane.slug);
		}
	}

	const members = new Map<string, T[]>();
	for (const person of crowd) {
		const laneSlug = laneOf.get(person.slug);
		if (!laneSlug) continue;
		members.set(laneSlug, [...(members.get(laneSlug) ?? []), person]);
	}

	const named = [...members.entries()].filter(([, people]) => people.length >= MIN_LANE_SIZE);
	if (named.length < MIN_NAMED_LANES) return [{ ...SINGLE_LANE, people: crowd }];

	const fameIndex = new Map(crowd.map((person, index) => [person.slug, index]));
	const firstIndex = (people: T[]) => fameIndex.get(people[0].slug) ?? 0;
	const lanes = named
		.sort(([, a], [, b]) => b.length - a.length || firstIndex(a) - firstIndex(b))
		.map(([slug, people]) => ({ slug, label: getClusterLaneShortLabel(slug) ?? slug, people }));

	const placed = new Set(lanes.flatMap((lane) => lane.people.map((person) => person.slug)));
	const rest = crowd.filter((person) => !placed.has(person.slug));
	if (rest.length > 0) lanes.push({ ...MORE_LANE, people: rest });

	return lanes;
}

/**
 * One section per field, largest first ("Other Public Figures" always last).
 * Incoming fame order is kept within each field, so people[0] is the best-known.
 */
export function groupPeopleByNiche<T extends GroupablePerson>(people: T[]): TypeHubGroup<T>[] {
	const grouped = new Map<string, T[]>();
	for (const person of people) {
		const slug = getGroupSlug(person);
		const members = grouped.get(slug) ?? [];
		members.push(person);
		grouped.set(slug, members);
	}

	return GROUP_DEFINITIONS.map((definition, order) => ({
		definition,
		order,
		members: grouped.get(definition.slug) ?? []
	}))
		.filter(({ members }) => members.length > 0)
		.sort((a, b) => {
			const aLast = a.definition.slug === 'other' ? 1 : 0;
			const bLast = b.definition.slug === 'other' ? 1 : 0;
			return aLast - bLast || b.members.length - a.members.length || a.order - b.order;
		})
		.map(({ definition, members }) => ({
			...definition,
			people: members,
			lanes: buildLanes(definition.slug, members.slice(1))
		}));
}
