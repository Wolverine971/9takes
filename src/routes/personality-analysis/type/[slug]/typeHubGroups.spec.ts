// src/routes/personality-analysis/type/[slug]/typeHubGroups.spec.ts
import { describe, expect, it } from 'vitest';
import {
	fieldsForPerson,
	getTypeHubGroupSlug,
	getTypeHubRoleLabels,
	groupPeopleByNiche
} from './typeHubGroups';
import { getReviewedPersonTypes } from '$lib/reviewedPersonTypes';
import { famousTypes } from '$lib/components/molecules/famousTypes';

describe('groupPeopleByNiche', () => {
	it('groups by occupation while preserving fame order within each group', () => {
		const people = [
			{ slug: 'taylor-swift', type: ['musician', 'entrepreneur'] },
			{ slug: 'donald-trump', type: ['politician'] },
			{ slug: 'tom-cruise', type: ['movieStar'] },
			{ slug: 'sabrina-carpenter', type: ['musician'] },
			{ slug: 'barack-obama', type: ['politician'] },
			{ slug: 'dua-lipa', type: ['musician'] },
			{ slug: 'joe-biden', type: ['politician'] }
		];
		const groups = groupPeopleByNiche(people);

		expect(groups.find((group) => group.slug === 'music')?.people.map((p) => p.slug)).toEqual([
			'taylor-swift',
			'sabrina-carpenter',
			'dua-lipa'
		]);
		expect(
			groups.find((group) => group.slug === 'politics-public')?.people.map((p) => p.slug)
		).toEqual(['donald-trump', 'barack-obama', 'joe-biden']);
		expect(groups.flatMap((group) => group.people)).toHaveLength(people.length);
		expect(people[0].slug).toBe('taylor-swift');
	});

	it('assigns crossovers once, preferring specific authored tags to broad labels', () => {
		const groups = groupPeopleByNiche([
			{ slug: 'britney-spears', type: ['musician', 'celebrity'] },
			{ slug: 'dave-chappelle', type: ['celebrity', 'comedian'] },
			{ slug: 'caitlin-clark', type: ['celebrity', 'athlete'] },
			{ slug: 'agatha-christie', type: ['historical', 'author'] },
			{ slug: 'jack-black', type: ['movieStar', 'musician'] }
		]);
		const assignments = Object.fromEntries(
			groups.flatMap((group) => group.people.map((person) => [person.slug, group.slug]))
		);

		// Every field here has one person, so all of them fold into "More"; the
		// field each was filed under survives as its card label.
		expect(groups).toHaveLength(1);
		expect(groups[0].fieldLabels).toEqual({
			'britney-spears': 'Music',
			'dave-chappelle': 'Comedy',
			'caitlin-clark': 'Athletes',
			'agatha-christie': 'Authors',
			'jack-black': 'Film & TV'
		});
		expect(groups.flatMap((group) => group.people)).toHaveLength(5);
	});

	it('handles stored tag formats and respects existing category exclusions', () => {
		expect(getTypeHubGroupSlug({ slug: 'new-singer', type: 'Musician, pop-star' })).toBe('music');
		expect(
			getTypeHubGroupSlug({ slug: 'new-founder', type: { 0: 'Techie', 1: 'entrepreneur' } })
		).toBe('technology');
		expect(getTypeHubGroupSlug({ slug: 'brene-brown', type: ['creator', 'author'] })).toBe(
			'authors-thinkers'
		);
		expect(getTypeHubGroupSlug({ slug: 'shailene-woodley', type: ['activist', 'movieStar'] })).toBe(
			'film-tv'
		);
	});

	it('folds untagged profiles into one catch-all group and omits empty sections', () => {
		expect(groupPeopleByNiche([])).toEqual([]);
		const people = [
			{ slug: 'unknown', type: ['unrecognized-tag'] },
			{ slug: 'no-tags', type: null },
			{ slug: 'missing-tags' }
		];
		expect(groupPeopleByNiche(people, '8')).toEqual([
			{
				slug: 'more',
				label: 'Everyone',
				shortLabel: 'Everyone',
				accent: null,
				people,
				lanes: [{ slug: 'all', label: '', people }],
				fieldLabels: {}
			}
		]);
	});

	it('puts the largest field first and folds small fields into a last "More" group', () => {
		const groups = groupPeopleByNiche(
			[
				{ slug: 'mystery', type: ['unrecognized-tag'] },
				{ slug: 'tom-cruise', type: ['movieStar'] },
				{ slug: 'taylor-swift', type: ['musician'] },
				{ slug: 'sabrina-carpenter', type: ['musician'] },
				{ slug: 'dua-lipa', type: ['musician'] },
				{ slug: 'barack-obama', type: ['politician'] },
				{ slug: 'joe-biden', type: ['politician'] },
				{ slug: 'kamala-harris', type: ['politician'] },
				{ slug: 'nancy-pelosi', type: ['politician'] }
			],
			'3'
		);

		expect(groups.map((group) => group.slug)).toEqual(['politics-public', 'music', 'more']);
		const more = groups.at(-1);
		expect(more?.label).toBe('More Type 3s');
		// Fame order survives the fold; each folded person keeps their own field label.
		expect(more?.people.map((p) => p.slug)).toEqual(['mystery', 'tom-cruise']);
		expect(more?.fieldLabels).toEqual({ 'tom-cruise': 'Film & TV' });
	});

	it('files athletes with athletes and historical figures in History', () => {
		const groups = groupPeopleByNiche([
			{ slug: 'david-beckham', type: ['celebrity', 'entrepreneur', 'athlete'] },
			{ slug: 'jake-paul', type: ['creator', 'athlete', 'viral-entertainer'] },
			{ slug: 'conor-mcgregor', type: ['celebrity', 'athlete', 'celebrity-image'] },
			{ slug: 'napoleon-bonaparte', type: ['historical', 'historical-leader'] },
			{ slug: 'vincent-van-gogh', type: ['historical', 'historical-artist'] },
			{ slug: 'robert-oppenheimer', type: ['historical', 'historical-scientist'] },
			{ slug: 'ernest-hemingway', type: ['historical', 'author', 'historical-artist'] },
			{ slug: 'winston-churchill', type: ['politician', 'modern-leader'] }
		]);
		const assignments = Object.fromEntries(
			groups.flatMap((group) => group.people.map((person) => [person.slug, group.slug]))
		);

		expect(assignments).toMatchObject({
			'david-beckham': 'athletes',
			'jake-paul': 'athletes',
			'conor-mcgregor': 'athletes',
			'napoleon-bonaparte': 'history',
			'vincent-van-gogh': 'history',
			'robert-oppenheimer': 'history',
			// A historical novelist stays with the authors; a modern leader with politics.
			'ernest-hemingway': 'more',
			'winston-churchill': 'more'
		});
		expect(groups.find((group) => group.slug === 'history')?.label).toBe('History-Makers');
	});
});

describe('field lanes', () => {
	const filmField = [
		{ slug: 'jon-bernthal', type: ['movieStar', 'screen-icon'] },
		{ slug: 'shia-labeouf', type: ['celebrity', 'screen-icon'] },
		{ slug: 'paris-hilton', type: ['celebrity', 'celebrity-image'] },
		{ slug: 'tom-hardy', type: ['celebrity', 'screen-icon'] },
		{ slug: 'gordon-ramsay', type: ['celebrity', 'celebrity-image'] },
		{ slug: 'new-face', type: ['movieStar', 'rising-star'] }
	];

	it('splits the whole field into tagged lanes with readable labels', () => {
		const [film] = groupPeopleByNiche(filmField);

		expect(film.people[0].slug).toBe('jon-bernthal');
		expect(film.accent).toBe('#f59e0b');
		expect(film.lanes.map((lane) => [lane.label, lane.people.map((p) => p.slug)])).toEqual([
			['Screen icons', ['jon-bernthal', 'shia-labeouf', 'tom-hardy']],
			['Beyond acting', ['paris-hilton', 'gordon-ramsay']],
			// A specific role remains visible even with one profile.
			['Rising stars', ['new-face']]
		]);
		expect(film.lanes.flatMap((lane) => lane.people)).toHaveLength(film.people.length);
	});

	it('keeps a smaller named lane discoverable', () => {
		const people = filmField.slice(0, 4);
		const [film] = groupPeopleByNiche(people);

		expect(film.lanes.map((lane) => [lane.label, lane.people.length])).toEqual([
			['Screen icons', 3],
			['Beyond acting', 1]
		]);
	});
});

describe('reviewed Type 3 placements', () => {
	const people = famousTypes[3]
		.filter((person) => person.link)
		.map((person) => ({
			slug: person.name,
			type: getReviewedPersonTypes(person.name, person.types)
		}));
	const groups = groupPeopleByNiche(people, '3', { minFieldSize: 1 });

	it.each([
		['alexandr-wang', 'business', 'operators-business-builders'],
		['tyler-perry', 'film-tv', 'filmmakers'],
		['kris-jenner', 'film-tv', 'reality-tv'],
		['bernard-arnault', 'fashion', 'fashion-executives'],
		['ice-spice', 'music', 'rappers-genre-disruptors'],
		['drake', 'music', 'rappers-genre-disruptors'],
		['jordi-hays', 'creator-media', 'podcasters-interviewers'],
		['ali-abdaal', 'creator-media', 'educational-youtubers'],
		['logan-paul', 'creator-media', 'viral-entertainers']
	])('%s is listed under %s / %s', (slug, field, lane) => {
		const home = groups.find((group) => group.slug === field);
		expect(home?.lanes.find((item) => item.slug === lane)?.people.map((p) => p.slug)).toContain(
			slug
		);
	});

	it('preserves technology, entrepreneurship and podcast work as secondary occupations', () => {
		const person = (slug: string) => people.find((p) => p.slug === slug)!;
		expect(fieldsForPerson(person('alexandr-wang'))).toEqual(['business', 'technology']);
		expect(fieldsForPerson(person('jordi-hays'))).toContain('business');
		for (const slug of [
			'ali-abdaal',
			'logan-paul',
			'jordi-hays',
			'amelia-dimoldenberg',
			'chris-williamson'
		]) {
			expect(getTypeHubRoleLabels(person(slug))).toContain('Podcasters & interview hosts');
		}
		const homeSlugs = groups.flatMap((group) => group.people.map((p) => p.slug));
		expect(homeSlugs).toHaveLength(people.length);
		expect(new Set(homeSlugs).size).toBe(people.length);
	});
});
