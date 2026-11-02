// src/routes/personality-analysis/type/[slug]/typeHubGroups.spec.ts
import { describe, expect, it } from 'vitest';
import { groupPeopleByNiche } from './typeHubGroups';

describe('groupPeopleByNiche', () => {
	it('groups by occupation while preserving fame order within each group', () => {
		const people = [
			{ slug: 'taylor-swift', type: ['musician', 'entrepreneur'] },
			{ slug: 'donald-trump', type: ['politician'] },
			{ slug: 'tom-cruise', type: ['movieStar'] },
			{ slug: 'sabrina-carpenter', type: ['musician'] },
			{ slug: 'barack-obama', type: ['politician'] }
		];
		const groups = groupPeopleByNiche(people);

		expect(groups.find((group) => group.slug === 'music')?.people.map((p) => p.slug)).toEqual([
			'taylor-swift',
			'sabrina-carpenter'
		]);
		expect(
			groups.find((group) => group.slug === 'politics-public')?.people.map((p) => p.slug)
		).toEqual(['donald-trump', 'barack-obama']);
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

		expect(assignments).toEqual({
			'britney-spears': 'music',
			'dave-chappelle': 'comedy',
			'caitlin-clark': 'athletes',
			'agatha-christie': 'authors-thinkers',
			'jack-black': 'film-tv'
		});
		expect(groups.flatMap((group) => group.people)).toHaveLength(5);
	});

	it('handles stored tag formats and respects existing category exclusions', () => {
		const groups = groupPeopleByNiche([
			{ slug: 'new-singer', type: 'Musician, pop-star' },
			{ slug: 'new-founder', type: { 0: 'Techie', 1: 'entrepreneur' } },
			{ slug: 'brene-brown', type: ['creator', 'author'] },
			{ slug: 'shailene-woodley', type: ['activist', 'movieStar'] }
		]);

		expect(groups.find((group) => group.slug === 'music')?.people[0].slug).toBe('new-singer');
		expect(groups.find((group) => group.slug === 'tech-business')?.people[0].slug).toBe(
			'new-founder'
		);
		expect(groups.find((group) => group.slug === 'authors-thinkers')?.people[0].slug).toBe(
			'brene-brown'
		);
		expect(groups.find((group) => group.slug === 'film-tv')?.people[0].slug).toBe(
			'shailene-woodley'
		);
	});

	it('retains untagged profiles in a fallback and omits empty sections', () => {
		expect(groupPeopleByNiche([])).toEqual([]);
		const people = [
			{ slug: 'unknown', type: ['unrecognized-tag'] },
			{ slug: 'no-tags', type: null },
			{ slug: 'missing-tags' }
		];
		expect(groupPeopleByNiche(people)).toEqual([
			{ slug: 'other', label: 'Other Public Figures', people }
		]);
	});
});
