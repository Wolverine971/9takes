// src/lib/server/personalityCategoryData.spec.ts
import { describe, expect, it } from 'vitest';

import {
	getPersonalityCategoryGroups,
	type PersonalityCategoryPerson
} from './personalityCategoryData';

function makePerson(
	slug: string,
	types: string[],
	overrides: Partial<PersonalityCategoryPerson> = {}
): PersonalityCategoryPerson {
	return {
		slug,
		name: slug.split('-').join(' '),
		enneagram: '3',
		title: `${slug} title`,
		description: `${slug} description`,
		personaTitle: null,
		lastmod: '2026-03-01',
		date: '2026-02-01',
		types,
		categorySlugs: ['creator-media'],
		primaryCategorySlug: 'creator-media',
		contentQualityScore: 8,
		...overrides
	};
}

describe('getPersonalityCategoryGroups', () => {
	it('clusters creator-media people into curated subgroups', () => {
		const groups = getPersonalityCategoryGroups('creator-media', [
			makePerson('Joe-Rogan', ['creator'], { contentQualityScore: 9 }),
			makePerson('Hasan-Piker', ['creator']),
			makePerson('Tony-Robbins', ['creator', 'entrepreneur']),
			makePerson('Kai-Cenat', ['creator']),
			makePerson('Mr-Beast', ['creator']),
			makePerson('Kylie-Jenner', ['lifestyleInfluencer']),
			makePerson('Unknown-Creator', ['creator'])
		]);

		expect(groups.map((group) => group.slug)).toEqual([
			'podcasters-interviewers',
			'news-commentary',
			'business-self-improvement',
			'streamers-live',
			'viral-entertainers',
			'lifestyle-brand-builders',
			'other-internet-personalities'
		]);

		expect(groups.find((group) => group.slug === 'podcasters-interviewers')?.people[0]?.slug).toBe(
			'Joe-Rogan'
		);
		expect(groups.find((group) => group.slug === 'news-commentary')?.people[0]?.slug).toBe(
			'Hasan-Piker'
		);
		expect(
			groups.find((group) => group.slug === 'business-self-improvement')?.people[0]?.slug
		).toBe('Tony-Robbins');
		expect(groups.find((group) => group.slug === 'streamers-live')?.people[0]?.slug).toBe(
			'Kai-Cenat'
		);
		expect(groups.find((group) => group.slug === 'viral-entertainers')?.people[0]?.slug).toBe(
			'Mr-Beast'
		);
		expect(groups.find((group) => group.slug === 'lifestyle-brand-builders')?.people[0]?.slug).toBe(
			'Kylie-Jenner'
		);
		expect(
			groups.find((group) => group.slug === 'other-internet-personalities')?.people[0]?.slug
		).toBe('Unknown-Creator');
	});

	it('returns no custom groups for non-creator categories', () => {
		const groups = getPersonalityCategoryGroups('film-tv', [
			makePerson('Zendaya', ['movieStar'], {
				categorySlugs: ['film-tv'],
				primaryCategorySlug: 'film-tv'
			})
		]);

		expect(groups).toEqual([]);
	});
});
