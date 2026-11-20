// src/lib/peopleTimeline.ts
/**
 * Birth-year timeline: people grouped by generation, oldest group on the left,
 * youngest on the right. A generation with fewer than `minSize` people merges
 * into its smaller neighbour (same rule the type hub uses to split big lanes).
 */
import { GENERATIONS, generationOf } from '$lib/peopleTaxonomy';

export const GENERATION_SHORT: Record<string, string> = {
	history: 'Pre-1901',
	greatest: 'Greatest Gen',
	silent: 'Silent Gen',
	boomers: 'Boomers',
	'gen-x': 'Gen X',
	millennials: 'Millennials',
	'gen-z': 'Gen Z',
	'gen-alpha': 'Gen Alpha'
};

export type GenerationBucket<T> = { keys: string[]; people: T[] };

/** "Gen X" or "Boomers–Gen X" for a merged bucket. */
export function generationLabel(keys: string[]): string {
	const first = GENERATION_SHORT[keys[0]];
	const last = GENERATION_SHORT[keys[keys.length - 1]];
	return keys.length === 1 ? first : `${first}–${last}`;
}

/**
 * Buckets people by generation (oldest first) and merges any bucket under
 * minSize into its smaller neighbour. People with no birth year are returned
 * separately; input order is kept inside each bucket.
 */
export function bucketByGeneration<T>(
	people: T[],
	bornOf: (person: T) => number | null | undefined,
	minSize: number
): { buckets: GenerationBucket<T>[]; unknown: T[] } {
	const byKey = new Map<string, T[]>();
	const unknown: T[] = [];
	for (const person of people) {
		const generation = generationOf(bornOf(person));
		if (!generation) unknown.push(person);
		else byKey.set(generation.key, [...(byKey.get(generation.key) ?? []), person]);
	}
	let buckets: GenerationBucket<T>[] = GENERATIONS.filter(({ key }) => byKey.has(key)).map(
		({ key }) => ({ keys: [key], people: byKey.get(key)! })
	);

	const size = (bucket: GenerationBucket<T>) => bucket.people.length;
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
	return { buckets, unknown };
}

export type TimelineGroup<T> = {
	key: string;
	label: string;
	/** Oldest person's birth year in this group. */
	startYear: number;
	/** Youngest person's birth year in this group. */
	endYear: number;
	/** Oldest first. */
	people: T[];
};

export type Timeline<T> = { groups: TimelineGroup<T>[]; unknown: T[] };

/** What PeopleTimeline.svelte renders per face. Build it on the server. */
export type TimelinePerson = {
	slug: string;
	name: string;
	born: number | null;
	enneagram: string | null;
	personaTitle?: string | null;
	/** Home field accent; tints the portrait ring. */
	accent?: string | null;
};

export const TIMELINE_MIN_GROUP = 3;

export function buildTimeline<T>(
	people: T[],
	bornOf: (person: T) => number | null | undefined,
	minSize = TIMELINE_MIN_GROUP
): Timeline<T> {
	const { buckets, unknown } = bucketByGeneration(people, bornOf, minSize);
	const order = new Map(people.map((person, index) => [person, index]));
	const year = (person: T) => bornOf(person) as number;
	const groups = buckets.map(({ keys, people: members }) => {
		const sorted = [...members].sort((a, b) => year(a) - year(b) || order.get(a)! - order.get(b)!);
		return {
			key: keys.join('-'),
			label: generationLabel(keys),
			startYear: year(sorted[0]),
			endYear: year(sorted[sorted.length - 1]),
			people: sorted
		};
	});
	return { groups, unknown };
}

/** "1965–1979", "1965" when one year, "48 BC–1821" for very old figures. */
export function formatYearSpan(start: number, end: number): string {
	const format = (year: number) => (year < 0 ? `${-year} BC` : String(year));
	return start === end ? format(start) : `${format(start)}–${format(end)}`;
}
