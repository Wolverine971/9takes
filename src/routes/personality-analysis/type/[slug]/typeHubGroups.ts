// src/routes/personality-analysis/type/[slug]/typeHubGroups.ts
// Groups one type's people by the v3 people taxonomy (Field → Niche → optional Sub).
// Jev labels facts per person; this file decides what opens on a page:
//  - a field gets its own circle only with MIN_FIELD_SIZE+ people on this page,
//  - inside it a niche (or a sub-niche) becomes a lane only with MIN_LANE_SIZE+ people,
//  - a lane bigger than BIG_LANE splits by generation (each part still MIN_LANE_SIZE+),
//  - small fields fold into one "More" circle, each still labeled with its field.
import {
	FIELD_BY_KEY,
	FIELD_ORDER,
	GENERATIONS,
	alsoFieldsFor,
	generationOf,
	getPersonClassification,
	homePathFor,
	nicheOf,
	pathLabel,
	subOf
} from '$lib/peopleTaxonomy';
import type { GroupablePerson } from '$lib/personNiches';

export type TypeHubLane<T> = {
	slug: string;
	/** Empty when the lane has no name worth showing (leftovers, or a single lane). */
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

/** What the grouping needs to know about one person. */
export type HubPlacement = {
	/** [field, niche?, sub?] or null when nobody has labeled them yet. */
	home: readonly string[] | null;
	/** Fields of sustained second careers (never the home field). */
	alsoFields: string[];
	born: number | null;
};

export type Placer = (person: GroupablePerson) => HubPlacement;

export const placePerson: Placer = (person) => ({
	home: homePathFor(person),
	alsoFields: alsoFieldsFor(person.slug),
	born: getPersonClassification(person.slug)?.born ?? null
});

/** A field with fewer people than this folds into the "More" group at the end. */
export const MIN_FIELD_SIZE = 3;
/** A niche or sub-niche needs this many people on the page to get its own lane. */
export const MIN_LANE_SIZE = 3;
/** A lane with more people than this splits by generation. */
export const BIG_LANE = 10;
export const MORE_GROUP_SLUG = 'more';

const REST_LANE = 'rest';

type Options = {
	minFieldSize?: number;
	minLaneSize?: number;
	bigLane?: number;
	place?: Placer;
};

const GENERATION_SHORT: Record<string, string> = {
	history: 'Pre-1901',
	greatest: 'Greatest Gen',
	silent: 'Silent Gen',
	boomers: 'Boomers',
	'gen-x': 'Gen X',
	millennials: 'Millennials',
	'gen-z': 'Gen Z',
	'gen-alpha': 'Gen Alpha'
};

/** Card labels for a person's second careers ("Pro wrestling", "Stand-up"). */
export function getTypeHubRoleLabels(person: GroupablePerson): string[] {
	const classification = getPersonClassification(person.slug);
	if (!classification) return [];
	const home = classification.home?.[0];
	return [
		...new Set(
			classification.also.filter(({ path }) => path[0] !== home).map(({ path }) => pathLabel(path))
		)
	].filter(Boolean);
}

/**
 * Splits a big lane by generation, oldest first. Generations under minSize merge into
 * their smaller neighbour; people without a birth year join the biggest part.
 */
export function splitByGeneration<T extends GroupablePerson>(
	lane: TypeHubLane<T>,
	bornOf: (person: T) => number | null,
	minSize: number
): TypeHubLane<T>[] {
	type Bucket = { keys: string[]; people: T[] };
	const byKey = new Map<string, T[]>();
	const unknown: T[] = [];
	for (const person of lane.people) {
		const generation = generationOf(bornOf(person));
		if (!generation) unknown.push(person);
		else byKey.set(generation.key, [...(byKey.get(generation.key) ?? []), person]);
	}
	let buckets: Bucket[] = GENERATIONS.filter(({ key }) => byKey.has(key)).map(({ key }) => ({
		keys: [key],
		people: byKey.get(key)!
	}));
	if (buckets.length < 2) return [lane];

	const size = (bucket: Bucket) => bucket.people.length;
	for (;;) {
		const small = buckets.findIndex((bucket) => size(bucket) < minSize);
		if (small === -1 || buckets.length < 2) break;
		const left = buckets[small - 1];
		const right = buckets[small + 1];
		const into = !left
			? small + 1
			: !right
				? small - 1
				: size(left) <= size(right)
					? small - 1
					: small + 1;
		const [a, b] = [Math.min(small, into), Math.max(small, into)];
		const merged = {
			keys: [...buckets[a].keys, ...buckets[b].keys],
			people: [...buckets[a].people, ...buckets[b].people]
		};
		buckets = [...buckets.slice(0, a), merged, ...buckets.slice(b + 1)];
	}
	if (buckets.length < 2) return [lane];

	if (unknown.length) {
		const biggest = buckets.reduce((best, bucket) => (size(bucket) > size(best) ? bucket : best));
		biggest.people.push(...unknown);
	}
	const order = new Map(lane.people.map((person, index) => [person.slug, index]));
	return buckets.map(({ keys, people }) => {
		const first = GENERATION_SHORT[keys[0]];
		const last = GENERATION_SHORT[keys[keys.length - 1]];
		const generation = keys.length === 1 ? first : `${first}–${last}`;
		return {
			slug: `${lane.slug}-${keys.join('-')}`,
			label: lane.label ? `${lane.label} · ${generation}` : generation,
			people: [...people].sort((x, y) => order.get(x.slug)! - order.get(y.slug)!)
		};
	});
}

/** Lanes inside one field: niches (or sub-niches) with minLaneSize+ people, then leftovers. */
export function buildFieldLanes<T extends GroupablePerson>(
	people: T[],
	placements: Map<string, HubPlacement>,
	{ minLaneSize = MIN_LANE_SIZE, bigLane = BIG_LANE }: Pick<Options, 'minLaneSize' | 'bigLane'> = {}
): TypeHubLane<T>[] {
	if (people.length === 0) return [];
	const pathOf = (person: T) => placements.get(person.slug)?.home ?? [];

	const byNiche = new Map<string, T[]>();
	for (const person of people) {
		const niche = pathOf(person)[1];
		if (niche) byNiche.set(niche, [...(byNiche.get(niche) ?? []), person]);
	}

	const named: TypeHubLane<T>[] = [];
	for (const [niche, members] of byNiche) {
		if (members.length < minLaneSize) continue;
		const nicheLabel = nicheOf(pathOf(members[0]))?.label ?? niche;
		const bySub = new Map<string, T[]>();
		for (const person of members) {
			const sub = pathOf(person)[2];
			if (sub && subOf(pathOf(person))) bySub.set(sub, [...(bySub.get(sub) ?? []), person]);
		}
		const openSubs = [...bySub.entries()].filter(([, group]) => group.length >= minLaneSize);
		const inSubs = new Set(openSubs.flatMap(([, group]) => group.map((person) => person.slug)));
		const remainder = members.filter((person) => !inSubs.has(person.slug));
		// Open sub-niches only when nobody is stranded in a lane of one or two.
		if (openSubs.length && (remainder.length === 0 || remainder.length >= minLaneSize)) {
			for (const [sub, group] of openSubs) {
				named.push({ slug: `${niche}-${sub}`, label: pathLabel(pathOf(group[0])), people: group });
			}
			if (remainder.length) named.push({ slug: niche, label: nicheLabel, people: remainder });
		} else {
			named.push({ slug: niche, label: nicheLabel, people: members });
		}
	}

	const fameIndex = new Map(people.map((person, index) => [person.slug, index]));
	const first = (lane: TypeHubLane<T>) => fameIndex.get(lane.people[0].slug) ?? 0;
	named.sort((a, b) => b.people.length - a.people.length || first(a) - first(b));

	const placed = new Set(named.flatMap((lane) => lane.people.map((person) => person.slug)));
	const rest = people.filter((person) => !placed.has(person.slug));
	const lanes: TypeHubLane<T>[] = named.length
		? [...named, ...(rest.length ? [{ slug: REST_LANE, label: '', people: rest }] : [])]
		: [{ slug: 'all', label: '', people }];

	const bornOf = (person: T) => placements.get(person.slug)?.born ?? null;
	return lanes.flatMap((lane) =>
		lane.people.length > bigLane ? splitByGeneration(lane, bornOf, minLaneSize) : [lane]
	);
}

/**
 * One group per field, largest first. Fields under minFieldSize (and anyone with no
 * label yet) fold into one "More" group at the end, where each field keeps its own
 * labeled lane. Incoming fame order is kept everywhere.
 */
export function groupPeopleByNiche<T extends GroupablePerson>(
	people: T[],
	typeNumber?: string,
	{
		minFieldSize = MIN_FIELD_SIZE,
		minLaneSize = MIN_LANE_SIZE,
		bigLane = BIG_LANE,
		place = placePerson
	}: Options = {}
): TypeHubGroup<T>[] {
	const placements = new Map(people.map((person) => [person.slug, place(person)]));
	const byField = new Map<string, T[]>();
	const unplaced: T[] = [];
	for (const person of people) {
		const field = placements.get(person.slug)?.home?.[0];
		if (field && FIELD_BY_KEY.has(field))
			byField.set(field, [...(byField.get(field) ?? []), person]);
		else unplaced.push(person);
	}

	const fields = [...byField.entries()]
		.map(([key, members]) => ({ field: FIELD_BY_KEY.get(key)!, members }))
		.sort(
			(a, b) =>
				b.members.length - a.members.length ||
				(FIELD_ORDER.get(a.field.key) ?? 0) - (FIELD_ORDER.get(b.field.key) ?? 0)
		);

	const kept: TypeHubGroup<T>[] = fields
		.filter(({ members }) => members.length >= minFieldSize)
		.map(({ field, members }) => ({
			slug: field.key,
			label: field.label,
			shortLabel: field.shortLabel,
			accent: field.accent,
			people: members,
			lanes: buildFieldLanes(members, placements, { minLaneSize, bigLane })
		}));

	const folded = fields.filter(({ members }) => members.length < minFieldSize);
	if (folded.length === 0 && unplaced.length === 0) return kept;

	const foldedPeople = new Set([...folded.flatMap(({ members }) => members), ...unplaced]);
	// Keep fame order across the folded fields.
	const morePeople = people.filter((person) => foldedPeople.has(person));
	const fieldLabels: Record<string, string> = {};
	for (const { field, members } of folded) {
		for (const person of members) fieldLabels[person.slug] = field.shortLabel;
	}
	const lanes: TypeHubLane<T>[] = folded.map(({ field, members }) => ({
		slug: `${MORE_GROUP_SLUG}-${field.key}`,
		label: field.shortLabel,
		people: members
	}));
	if (unplaced.length) lanes.push({ slug: REST_LANE, label: '', people: unplaced });

	const everyone = kept.length === 0;
	return [
		...kept,
		{
			slug: MORE_GROUP_SLUG,
			label: everyone ? 'Everyone' : typeNumber ? `More Type ${typeNumber}s` : 'More',
			shortLabel: everyone ? 'Everyone' : 'More',
			accent: null,
			people: morePeople,
			lanes,
			fieldLabels
		}
	];
}
