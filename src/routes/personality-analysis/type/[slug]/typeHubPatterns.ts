// src/routes/personality-analysis/type/[slug]/typeHubPatterns.ts
// The words a type's persona titles keep landing on ("Cinema's Armored Brawler",
// "Rap's Armored Queen" -> Armored). The type hub shows them as chips; tapping one
// lights up every person whose title uses it, which is the type's pattern made
// visible without a paragraph of explanation.

export type TitlePattern = {
	/** Lowercase match key. */
	word: string;
	/** Display form, e.g. "Self-Made". */
	label: string;
	count: number;
	slugs: string[];
};

type TitledPerson = { slug: string; personaTitle?: string | null };

// Filler, field prefixes that survive the possessive filter ("Silicon Valley's"),
// half of a fixed phrase ("Escape Artist"), and the nine type names, which only
// restate the page's own heading.
const IGNORED = new Set([
	...'a an and at by for from in into is it its of on or than that the their his her to who with'.split(
		' '
	),
	...'himself herself itself silicon valley pop star actor artist party act late exit kept center systems mr ms'.split(
		' '
	),
	...'reformer perfectionist helper achiever individualist investigator loyalist enthusiast challenger peacemaker'.split(
		' '
	)
]);

const WORD = /[A-Za-z][A-Za-z'’-]*/g;

/** Distinct pattern words in one title, possessives ("Rap's") and plurals-possessive dropped. */
export function titleWords(title: string): string[] {
	const words = new Set<string>();
	for (const match of title.matchAll(WORD)) {
		const raw = match[0];
		if (/['’](s)?$/i.test(raw)) continue;
		const word = raw.toLowerCase().replace(/-+$/, '');
		if (word.length < 3 || IGNORED.has(word)) continue;
		words.add(word);
	}
	return [...words];
}

/** Title case per hyphen part, whatever case the source title used ("self-made" -> "Self-Made"). */
function displayLabel(word: string): string {
	return word.replace(/(^|-)([a-z])/g, (_, sep: string, ch: string) => sep + ch.toUpperCase());
}

/**
 * Words used by at least `minCount` people, most-used first (ties: alphabetical).
 * When fewer than `minPatterns` words clear `minCount`, words shared by two people
 * fill in, so a small type still gets a strip without a big type's strip filling
 * up with coincidences. People keep their incoming (fame) order inside each pattern.
 */
export function findTitlePatterns(
	people: TitledPerson[],
	{
		limit = 6,
		minCount = 3,
		minPatterns = 3
	}: { limit?: number; minCount?: number; minPatterns?: number } = {}
): TitlePattern[] {
	const slugsByWord = new Map<string, string[]>();
	for (const person of people) {
		if (!person.personaTitle) continue;
		for (const word of titleWords(person.personaTitle)) {
			slugsByWord.set(word, [...(slugsByWord.get(word) ?? []), person.slug]);
		}
	}

	const ranked = [...slugsByWord.entries()]
		.filter(([, slugs]) => slugs.length >= 2)
		.sort(([a, x], [b, y]) => y.length - x.length || a.localeCompare(b));
	const strong = ranked.filter(([, slugs]) => slugs.length >= minCount);
	const chosen = strong.length >= minPatterns ? strong : ranked.slice(0, minPatterns);

	return chosen.slice(0, limit).map(([word, slugs]) => ({
		word,
		label: displayLabel(word),
		count: slugs.length,
		slugs
	}));
}

/**
 * The first sentence of a profile's meta description, the "Why does X ...?" hook.
 * Returns '' when there is nothing short enough to read on a card.
 */
export function descriptionHook(description: string | null | undefined, maxLength = 150): string {
	const text = (description ?? '').replace(/\s+/g, ' ').trim();
	if (!text) return '';
	const sentence = text.match(/^.+?[.?!](?=\s|$)/)?.[0] ?? text;
	if (sentence.length <= maxLength) return sentence;
	const cut = sentence.slice(0, maxLength - 1);
	return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:]$/, '')}…`;
}
