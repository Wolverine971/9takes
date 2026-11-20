// src/routes/personality-analysis/type/[slug]/typeHubGroups.spec.ts
import { describe, expect, it } from 'vitest';
import {
	BIG_LANE,
	groupPeopleByNiche,
	getTypeHubRoleLabels,
	splitByGeneration,
	type HubPlacement
} from './typeHubGroups';
import snapshot from '$lib/generated/personalitySimilaritySnapshot.json';
import classifications from '$lib/data/personClassifications.json';
import { PEOPLE_TAXONOMY, getPersonClassification } from '$lib/peopleTaxonomy';
import { normalizePersonalitySlug } from '$lib/utils/personalityAnalysis';

type Person = { slug: string };

/** Builds people plus a placer from compact "field/niche/sub@born" strings. */
function fixture(rows: Record<string, string>) {
	const placements = new Map<string, HubPlacement>(
		Object.entries(rows).map(([slug, value]) => {
			const [path, born] = value.split('@');
			return [
				slug,
				{ home: path ? path.split('/') : null, alsoFields: [], born: born ? Number(born) : null }
			];
		})
	);
	const people: Person[] = Object.keys(rows).map((slug) => ({ slug }));
	return { people, place: (person: Person) => placements.get(person.slug)! };
}

const lanesOf = (group: { lanes: { label: string; people: Person[] }[] }) =>
	group.lanes.map((lane) => [lane.label, lane.people.map((person) => person.slug)]);

describe('groupPeopleByNiche', () => {
	it('opens fields with 3+ people, largest first, and keeps fame order', () => {
		const { people, place } = fixture({
			a: 'music/pop',
			b: 'screen/actors',
			c: 'music/rock',
			d: 'screen/actors',
			e: 'music/pop',
			f: 'screen/actors',
			g: 'music/hip-hop',
			h: 'sports/golf'
		});
		const groups = groupPeopleByNiche(people, '4', { place });
		expect(groups.map((group) => group.slug)).toEqual(['music', 'screen', 'more']);
		expect(groups[0].people.map((person) => person.slug)).toEqual(['a', 'c', 'e', 'g']);
		expect(groups[0].label).toBe('Music');
	});

	it('folds small fields into "More", each as its own labeled lane', () => {
		const { people, place } = fixture({
			a: 'screen/actors',
			b: 'screen/actors',
			c: 'screen/actors',
			d: 'sports/golf',
			e: 'faith/religious-leaders',
			f: 'sports/tennis',
			g: ''
		});
		const more = groupPeopleByNiche(people, '2', { place }).at(-1)!;
		expect(more.slug).toBe('more');
		expect(more.label).toBe('More Type 2s');
		expect(lanesOf(more)).toEqual([
			['Sports', ['d', 'f']],
			['Faith', ['e']],
			['', ['g']]
		]);
		expect(more.fieldLabels).toEqual({ d: 'Sports', e: 'Faith', f: 'Sports' });
	});

	it('names a niche lane only when 3+ people share it; the rest sit unlabeled', () => {
		const { people, place } = fixture({
			a: 'comedy/stand-up',
			b: 'comedy/late-night',
			c: 'comedy/stand-up',
			d: 'comedy/stand-up',
			e: 'comedy/internet-comedy'
		});
		const [comedy] = groupPeopleByNiche(people, '7', { place });
		expect(lanesOf(comedy)).toEqual([
			['Stand-up', ['a', 'c', 'd']],
			['', ['b', 'e']]
		]);
	});

	it('leaves a field with no shared niche as one unlabeled lane', () => {
		const { people, place } = fixture({
			a: 'ideas/artists',
			b: 'ideas/philosophers',
			c: 'ideas/scientists/physical'
		});
		const [ideas] = groupPeopleByNiche(people, '4', { place });
		expect(lanesOf(ideas)).toEqual([['', ['a', 'b', 'c']]]);
	});

	it('opens sub-niches only when nobody is stranded in a lane of one or two', () => {
		const presidents = fixture({
			a: 'politics/leaders/us-presidents',
			b: 'politics/leaders/us-presidents',
			c: 'politics/leaders/us-presidents',
			d: 'politics/leaders/monarchs',
			e: 'politics/leaders/monarchs'
		});
		const [kept] = groupPeopleByNiche(presidents.people, '8', { place: presidents.place });
		expect(lanesOf(kept)).toEqual([['Presidents & rulers', ['a', 'b', 'c', 'd', 'e']]]);

		const split = fixture({
			a: 'politics/leaders/us-presidents',
			b: 'politics/leaders/us-presidents',
			c: 'politics/leaders/us-presidents',
			d: 'politics/leaders/monarchs',
			e: 'politics/leaders/monarchs',
			f: 'politics/leaders/monarchs'
		});
		const [opened] = groupPeopleByNiche(split.people, '8', { place: split.place });
		expect(lanesOf(opened)).toEqual([
			['U.S. presidents', ['a', 'b', 'c']],
			['Kings, queens & emperors', ['d', 'e', 'f']]
		]);
	});

	it('splits a lane bigger than BIG_LANE by generation, oldest first', () => {
		const rows: Record<string, string> = {};
		const births = [1950, 1955, 1960, 1970, 1972, 1975, 1985, 1990, 1992, 2000, 2001, 2003];
		births.forEach((year, index) => (rows[`p${index}`] = `screen/actors@${year}`));
		expect(births.length).toBeGreaterThan(BIG_LANE);
		const { people, place } = fixture(rows);
		const [screen] = groupPeopleByNiche(people, '9', { place });
		expect(screen.lanes.map((lane) => [lane.label, lane.people.length])).toEqual([
			['Actors · Boomers', 3],
			['Actors · Gen X', 3],
			['Actors · Millennials', 3],
			['Actors · Gen Z', 3]
		]);
	});
});

describe('splitByGeneration', () => {
	it('merges a too-small generation into its smaller neighbour and keeps fame order', () => {
		const born: Record<string, number | null> = {
			a: 1990,
			b: 1950,
			c: 1985,
			d: 1975,
			e: 1990,
			f: 1955,
			g: 1960,
			h: null
		};
		const lane = {
			slug: 'actors',
			label: 'Actors',
			people: Object.keys(born).map((slug) => ({ slug }))
		};
		const parts = splitByGeneration(lane, (person) => born[person.slug], 3);
		expect(parts.map((part) => [part.label, part.people.map((person) => person.slug)])).toEqual([
			// h has no birth year, so it joins the biggest part.
			['Actors · Boomers–Gen X', ['b', 'd', 'f', 'g', 'h']],
			['Actors · Millennials', ['a', 'c', 'e']]
		]);
	});

	it('returns the lane untouched when everyone shares one generation', () => {
		const lane = { slug: 'pop', label: 'Pop', people: [{ slug: 'a' }, { slug: 'b' }] };
		expect(splitByGeneration(lane, () => 1999, 3)).toEqual([lane]);
	});
});

describe('person classifications (v3 taxonomy)', () => {
	const fields = new Map(PEOPLE_TAXONOMY.fields.map((field) => [field.key, field]));
	const valid = (path: string[]) => {
		const niche = fields.get(path[0])?.niches.find((item) => item.key === path[1]);
		if (!niche || path.length > 3) return false;
		return path.length < 3 || Boolean(niche.subs?.some((sub) => sub.key === path[2]));
	};
	const entries = Object.entries(
		classifications as unknown as Record<
			string,
			{ home: string[] | null; also: { path: string[] }[]; platforms: string[]; roles: string[] }
		>
	);

	it('uses only vocabulary paths, platforms and roles', () => {
		for (const [slug, record] of entries) {
			if (record.home) expect(valid(record.home), `${slug} home ${record.home}`).toBe(true);
			for (const { path } of record.also) {
				expect(valid(path), `${slug} also ${path}`).toBe(true);
				expect(path[0], `${slug} also repeats its home field`).not.toBe(record.home?.[0]);
			}
			expect(record.also.length).toBeLessThanOrEqual(2);
			for (const platform of record.platforms)
				expect(PEOPLE_TAXONOMY.platforms).toContain(platform);
			for (const role of record.roles) expect(PEOPLE_TAXONOMY.roles).toContain(role);
		}
	});

	it('labels every published person', () => {
		const missing = (snapshot as { person: string }[])
			.map((row) => normalizePersonalitySlug(row.person))
			.filter((slug) => !getPersonClassification(slug));
		expect(missing, 'run pnpm people:classify -- --write').toEqual([]);
	});

	it.each([
		['stephen-colbert', 'comedy', 'late-night'],
		['trevor-noah', 'comedy', 'late-night'],
		['sam-altman', 'tech', 'founders'],
		['sam-bankman-fried', 'tech', 'founders'],
		['anna-wintour', 'style', 'editors'],
		['mother-teresa', 'faith', 'saints-founders'],
		['zendaya', 'screen', 'actors']
	])('%s lives in %s / %s', (slug, field, niche) => {
		expect(getPersonClassification(slug)?.home?.slice(0, 2)).toEqual([field, niche]);
	});

	it('labels second careers on cards', () => {
		expect(getTypeHubRoleLabels({ slug: 'dwayne-johnson' })).toContain('Pro wrestling');
	});
});
