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
	/** Empty when the field has no lanes worth naming (one unlabeled row). */
	label: string;
	people: T[];
};

export type TypeHubGroup<T> = {
	slug: string;
	label: string;
	/** Chip-sized label for the jump nav. */
	shortLabel: string;
	accent: string | null;
	/** Everyone in the group, best-known first. */
	people: T[];
	/** Every person in exactly one lane, fame order kept inside each lane. */
	lanes: TypeHubLane<T>[];
	/** Only on the catch-all group: each person's own field, so a card can still say it. */
	fieldLabels?: Record<string, string>;
};

type GroupDefinition = { slug: string; label: string; shortLabel: string; accent: string | null };

const GROUP_DEFINITIONS: GroupDefinition[] = [
	...PERSONALITY_CATEGORY_DEFINITIONS.map(({ slug, label, shortLabel, accent }) => ({
		slug,
		label,
		shortLabel,
		accent
	})),
	{ slug: 'athletes', label: 'Athletes & Sports', shortLabel: 'Athletes', accent: '#fb923c' },
	{ slug: 'history', label: 'History-Makers', shortLabel: 'History', accent: '#c4b5fd' },
	{ slug: 'other', label: 'Other Public Figures', shortLabel: 'Other', accent: null }
];

const DEFINITION_BY_SLUG = new Map(GROUP_DEFINITIONS.map((d) => [d.slug, d]));

/** A field with fewer people than this folds into the catch-all group at the end. */
export const MIN_FIELD_SIZE = 3;
export const MORE_GROUP_SLUG = 'more';

// Lanes reuse the category pages' sub-groups (personalityCategoryData.ts), which
// read each person's cluster tags ('screen-icon', 'pop-star', ...). A field splits
// only when at least two lanes would each hold two or more people; smaller lanes
// and untagged people fold into one unlabeled group after the named lanes.
const MIN_LANE_SIZE = 2;
const MIN_NAMED_LANES = 2;
const LEFTOVER_LANE = { slug: 'rest', label: '' };
const SINGLE_LANE = { slug: 'all', label: '' };

// The shared short labels are written for the category pages; a couple read as
// jargon next to faces, so the hub says what they mean.
const HUB_LANE_LABELS: Record<string, string> = {
	'celebrity-image-public-fascination': 'Beyond acting',
	'historical-leaders-power-holders': 'Rulers & generals',
	'historical-scientists-thinkers': 'Scientists & thinkers',
	'historical-artists-writers': 'Artists & writers'
};

// Which category's lane matchers split a group. History reuses the politics
// matchers, whose historical lanes (leaders, scientists, artists) are its lanes.
const LANE_SOURCE: Record<string, PersonalityCategorySlug> = { history: 'politics-public' };

function hasType(types: string[], wanted: string): boolean {
	return types.some((type) => type.replace(/[^a-z0-9]/gi, '').toLowerCase() === wanted);
}

/**
 * The hub's filing rule: the shared primary field (personClusterTags.js), except an
 * athlete always sits with the athletes, and a historical figure whose field would
 * be politics (or nothing) sits in History instead of next to sitting presidents.
 */
export function getTypeHubGroupSlug(person: GroupablePerson): string {
	const types = normalizePeopleTypes(person.type);
	if (hasType(types, 'athlete')) return 'athletes';
	const field = getPrimaryField(types, person.slug);
	if (hasType(types, 'historical') && (field === 'politics-public' || field === 'other')) {
		return 'history';
	}
	return field;
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

function laneLabel(slug: string): string {
	return HUB_LANE_LABELS[slug] ?? getClusterLaneShortLabel(slug) ?? slug;
}

/** Splits a field into lanes, keeping fame order. Every person lands in one lane. */
export function buildLanes<T extends GroupablePerson>(
	groupSlug: string,
	people: T[]
): TypeHubLane<T>[] {
	if (people.length === 0) return [];

	const source = LANE_SOURCE[groupSlug] ?? groupSlug;
	const laneOf = new Map<string, string>();
	if (isCategorySlug(source)) {
		for (const lane of getPersonalityCategoryGroups(source, people.map(toLaneCandidate))) {
			// Category fallbacks ('other-*') are leftovers, not lanes.
			if (lane.slug.startsWith('other-')) continue;
			for (const person of lane.people) laneOf.set(person.slug, lane.slug);
		}
	}

	const members = new Map<string, T[]>();
	for (const person of people) {
		const laneSlug = laneOf.get(person.slug);
		if (!laneSlug) continue;
		members.set(laneSlug, [...(members.get(laneSlug) ?? []), person]);
	}

	const named = [...members.entries()].filter(([, lane]) => lane.length >= MIN_LANE_SIZE);
	if (named.length < MIN_NAMED_LANES) return [{ ...SINGLE_LANE, people }];

	const fameIndex = new Map(people.map((person, index) => [person.slug, index]));
	const firstIndex = (lane: T[]) => fameIndex.get(lane[0].slug) ?? 0;
	const lanes = named
		.sort(([, a], [, b]) => b.length - a.length || firstIndex(a) - firstIndex(b))
		.map(([slug, lane]) => ({ slug, label: laneLabel(slug), people: lane }));

	const placed = new Set(lanes.flatMap((lane) => lane.people.map((person) => person.slug)));
	const rest = people.filter((person) => !placed.has(person.slug));
	if (rest.length > 0) lanes.push({ ...LEFTOVER_LANE, people: rest });

	return lanes;
}

/**
 * One group per field, largest first. Fields under MIN_FIELD_SIZE (and anyone with
 * no recognizable field) fold into one catch-all group at the end, so a single
 * comedian doesn't get a whole section. Incoming fame order is kept everywhere.
 */
export function groupPeopleByNiche<T extends GroupablePerson>(
	people: T[],
	typeNumber?: string,
	{ minFieldSize = MIN_FIELD_SIZE }: { minFieldSize?: number } = {}
): TypeHubGroup<T>[] {
	const grouped = new Map<string, T[]>();
	for (const person of people) {
		const slug = getTypeHubGroupSlug(person);
		grouped.set(slug, [...(grouped.get(slug) ?? []), person]);
	}

	const fields = GROUP_DEFINITIONS.map((definition, order) => ({
		definition,
		order,
		members: grouped.get(definition.slug) ?? []
	})).filter(({ members }) => members.length > 0);

	const isFolded = ({ definition, members }: (typeof fields)[number]) =>
		definition.slug === 'other' || members.length < minFieldSize;

	const kept = fields
		.filter((field) => !isFolded(field))
		.sort((a, b) => b.members.length - a.members.length || a.order - b.order)
		.map(({ definition, members }) => ({
			...definition,
			people: members,
			lanes: buildLanes(definition.slug, members)
		}));

	const folded = fields.filter(isFolded);
	if (folded.length === 0) return kept;

	const foldedPeople = new Set(folded.flatMap(({ members }) => members));
	// Keep fame order across the folded fields.
	const morePeople = people.filter((person) => foldedPeople.has(person));
	const fieldLabels: Record<string, string> = {};
	for (const { definition, members } of folded) {
		for (const person of members) {
			if (definition.slug !== 'other') fieldLabels[person.slug] = definition.shortLabel;
		}
	}

	const onlyOther = folded.length === 1 && folded[0].definition.slug === 'other';
	const label = kept.length === 0 ? 'Everyone' : typeNumber ? `More Type ${typeNumber}s` : 'More';
	return [
		...kept,
		{
			slug: MORE_GROUP_SLUG,
			label:
				onlyOther && kept.length > 0 ? (DEFINITION_BY_SLUG.get('other')?.label ?? label) : label,
			shortLabel: kept.length === 0 ? 'Everyone' : onlyOther ? 'Other' : 'More',
			accent: null,
			people: morePeople,
			lanes: [{ ...SINGLE_LANE, people: morePeople }],
			fieldLabels
		}
	];
}
