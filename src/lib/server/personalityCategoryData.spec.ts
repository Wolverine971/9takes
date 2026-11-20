// src/lib/server/personalityCategoryData.spec.ts
import { describe, expect, it } from 'vitest';

import snapshot from '$lib/generated/personalitySimilaritySnapshot.json';
import { famousTypes } from '$lib/components/molecules/famousTypes';
import { getPersonClassification } from '$lib/peopleTaxonomy';
import {
	getPersonalityCategoryGroups,
	getPersonalityCategorySlugs,
	getPrimaryPersonalityCategorySlug,
	mapPersonalityCategoryRows,
	type PersonalityCategoryPerson,
	type PersonalityCategoryRow
} from './personalityCategoryData';

/** A person filed at `home` ("field/niche/sub"), optionally ranked by quality. */
function makePerson(slug: string, home: string, quality = 8): PersonalityCategoryPerson {
	return {
		slug,
		name: slug,
		enneagram: '3',
		title: null,
		description: null,
		personaTitle: null,
		lastmod: '2026-03-01',
		date: '2026-02-01',
		types: [],
		categorySlugs: [],
		primaryCategorySlug: null,
		contentQualityScore: quality,
		home: home ? home.split('/') : null,
		born: null
	};
}

const lanesOf = (groups: ReturnType<typeof getPersonalityCategoryGroups>) =>
	groups.map((group) => [group.label, group.people.map((person) => person.slug)]);

describe('getPersonalityCategoryGroups', () => {
	it('opens a niche with 3+ people, in taxonomy order, and pools the rest', () => {
		const groups = getPersonalityCategoryGroups('comedy', [
			makePerson('a', 'comedy/late-night', 9),
			makePerson('b', 'comedy/stand-up'),
			makePerson('c', 'comedy/late-night'),
			makePerson('d', 'comedy/stand-up'),
			makePerson('e', 'comedy/stand-up'),
			makePerson('f', 'comedy/late-night'),
			makePerson('g', 'comedy/internet-comedy')
		]);
		expect(lanesOf(groups)).toEqual([
			['Stand-up', ['b', 'd', 'e']],
			['Late night & satire', ['a', 'c', 'f']],
			['More Comedy', ['g']]
		]);
	});

	it('splits a sub-niche out of its niche once it has 3+ people', () => {
		const groups = getPersonalityCategoryGroups('politics-public', [
			makePerson('a', 'politics/leaders/us-presidents'),
			makePerson('b', 'politics/leaders/us-presidents'),
			makePerson('c', 'politics/leaders/us-presidents'),
			makePerson('d', 'politics/leaders/monarchs'),
			makePerson('e', 'politics/activists')
		]);
		expect(lanesOf(groups)).toEqual([
			['U.S. presidents', ['a', 'b', 'c']],
			['More Politics', ['d', 'e']]
		]);
	});

	it('names a field with no shared niche after the field itself', () => {
		const groups = getPersonalityCategoryGroups('faith-spirituality', [
			makePerson('a', 'faith/saints-founders')
		]);
		expect(lanesOf(groups)).toEqual([['Faith & Spirituality', ['a']]]);
	});

	it('lists second careers last, only on the full category page', () => {
		const people = [
			makePerson('a', 'sports/golf'),
			makePerson('b', 'sports/golf'),
			makePerson('c', 'sports/golf'),
			makePerson('rock', 'screen/actors')
		];
		expect(lanesOf(getPersonalityCategoryGroups('sports', people))).toEqual([
			['Golf', ['a', 'b', 'c']]
		]);
		expect(
			lanesOf(getPersonalityCategoryGroups('sports', people, { includeSecondary: true }))
		).toEqual([
			['Golf', ['a', 'b', 'c']],
			['Also in Sports', ['rock']]
		]);
	});
});

describe('category membership (v3 labels)', () => {
	const published = (snapshot as { person: string }[]).map((row) => row.person);

	it('puts every published person on their home field page first', () => {
		for (const slug of published) {
			const home = getPrimaryPersonalityCategorySlug(slug);
			expect(home, slug).not.toBeNull();
			expect(getPersonalityCategorySlugs(slug)[0], slug).toBe(home);
		}
	});

	it.each([
		['dwayne-johnson', 'film-tv', 'sports'],
		['anna-wintour', 'fashion', null],
		['stephen-colbert', 'comedy', null],
		['joe-rogan', 'hosts-media', null]
	])('%s lives on %s', (slug, home, also) => {
		expect(getPrimaryPersonalityCategorySlug(slug)).toBe(home);
		if (also) expect(getPersonalityCategorySlugs(slug)).toContain(also);
	});

	it('keeps the baked field in famousTypes.ts in step with the labels', () => {
		for (const person of Object.values(famousTypes).flat()) {
			expect(person.field, `${person.name}: run pnpm gen:famous-types`).toBe(
				getPersonClassification(person.name)?.home?.[0] ?? null
			);
		}
	});
});

describe('mapPersonalityCategoryRows', () => {
	it('keeps one person per slug when duplicate rows normalize to the same slug', () => {
		const row = (person: string, title: string): PersonalityCategoryRow => ({
			person,
			enneagram: '4',
			title,
			description: null,
			persona_title: null,
			lastmod: null,
			date: null,
			type: ['creator-media'],
			content_quality: null
		});

		const people = mapPersonalityCategoryRows([
			row('Brene-Brown', 'first'),
			row('Brene-Brown', 'duplicate'),
			row('Mr-Beast', 'other')
		]);

		expect(people.map((p) => p.title)).toEqual(['first', 'other']);
	});
});
