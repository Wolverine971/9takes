// src/lib/utils/corpusTypeRanking.ts
// Tie-aware ranking of Enneagram type counts for corpus copy ("most common",
// "rarest", "6th of 9"). Shared by /corpus-stats and the type hubs so no page
// hard-codes a winner or hides a tie (e.g. Types 1 and 2 both at 29 profiles).

export type TypeRankEntry = {
	type: string;
	value: number;
	/** Competition rank: 1 + the number of types with a strictly larger value. */
	rank: number;
	/** Other types with exactly the same value. */
	tiedWith: string[];
};

export type TypeExtremes = {
	most: string[];
	mostValue: number;
	least: string[];
	leastValue: number;
};

const NUMBER_WORDS: Record<number, string> = { 9: 'nine' };

export const defaultTypeLabel = (type: string) => `Type ${type}`;

function finiteEntries(values: Record<string, number>): [string, number][] {
	return Object.entries(values).filter(
		(entry): entry is [string, number] => typeof entry[1] === 'number' && Number.isFinite(entry[1])
	);
}

/** Ranks types by value, largest first, using competition ranking ("1, 2, 2, 4"). */
export function rankTypes(values: Record<string, number>): TypeRankEntry[] {
	const entries = finiteEntries(values);
	return entries
		.map(([type, value]) => ({
			type,
			value,
			rank: 1 + entries.filter(([, other]) => other > value).length,
			tiedWith: entries
				.filter(([key, other]) => key !== type && other === value)
				.map(([key]) => key)
		}))
		.sort((a, b) => a.rank - b.rank || Number(a.type) - Number(b.type));
}

/** Every type sharing the top value and every type sharing the bottom value. */
export function typeExtremes(values: Record<string, number>): TypeExtremes | null {
	const entries = finiteEntries(values);
	if (entries.length === 0) return null;
	const mostValue = Math.max(...entries.map(([, value]) => value));
	const leastValue = Math.min(...entries.map(([, value]) => value));
	const byType = (a: string, b: string) => Number(a) - Number(b);
	return {
		most: entries
			.filter(([, value]) => value === mostValue)
			.map(([type]) => type)
			.sort(byType),
		mostValue,
		least: entries
			.filter(([, value]) => value === leastValue)
			.map(([type]) => type)
			.sort(byType),
		leastValue
	};
}

export function ordinal(n: number): string {
	const mod100 = n % 100;
	if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
	switch (n % 10) {
		case 1:
			return `${n}st`;
		case 2:
			return `${n}nd`;
		case 3:
			return `${n}rd`;
		default:
			return `${n}th`;
	}
}

/** "A", "A and B", "A, B, and C". */
export function joinList(items: string[]): string {
	if (items.length <= 1) return items[0] ?? '';
	if (items.length === 2) return `${items[0]} and ${items[1]}`;
	return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

/**
 * Plain-English position of one type in the distribution:
 *   "the most common of the nine types"
 *   "tied with Type 2 for the least common of the nine types"
 *   "the 6th most common of the nine types"
 * Returns '' when the type has no value.
 */
export function describeTypeRank(
	values: Record<string, number>,
	type: string,
	label: (type: string) => string = defaultTypeLabel
): string {
	const ranked = rankTypes(values);
	const entry = ranked.find((candidate) => candidate.type === type);
	if (!entry) return '';

	const total = ranked.length;
	const of = `of the ${NUMBER_WORDS[total] ?? total} types`;
	const isLeast = !ranked.some((candidate) => candidate.value < entry.value);
	const position =
		entry.rank === 1
			? 'the most common'
			: isLeast
				? 'the least common'
				: `the ${ordinal(entry.rank)} most common`;

	if (entry.tiedWith.length === 0) return `${position} ${of}`;
	const tied = joinList(entry.tiedWith.map(label));
	return entry.rank === 1 || isLeast
		? `tied with ${tied} for ${position} ${of}`
		: `tied with ${tied} as ${position} ${of}`;
}
