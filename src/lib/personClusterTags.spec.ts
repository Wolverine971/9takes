// src/lib/personClusterTags.spec.ts
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
	CLUSTER_FIELDS,
	getClusterLaneShortLabel,
	getMissingClusterField,
	getPrimaryField,
	isClusterTag
} from './personClusterTags.js';
import { PERSONALITY_CATEGORY_DEFINITIONS } from './personalityCategories';
import {
	getPersonalityCategoryGroups,
	type PersonalityCategoryPerson
} from './server/personalityCategoryData';

function candidate(slug: string, types: string[]): PersonalityCategoryPerson {
	return {
		slug,
		name: slug,
		enneagram: null,
		title: null,
		description: null,
		personaTitle: null,
		lastmod: null,
		date: null,
		types,
		categorySlugs: [],
		primaryCategorySlug: null,
		contentQualityScore: null
	};
}

describe('cluster tag catalog stays in step with the site', () => {
	it('lists the same fields, raw types and exclusions as the category definitions', () => {
		expect(
			CLUSTER_FIELDS.map(({ field, rawTypes, excludeSlugs }) => ({ field, rawTypes, excludeSlugs }))
		).toEqual(
			PERSONALITY_CATEGORY_DEFINITIONS.map(({ slug, rawTypes, excludeSlugs }) => ({
				field: slug,
				rawTypes,
				excludeSlugs: excludeSlugs ?? []
			}))
		);
	});

	it('routes every tag to its own lane and covers every lane', () => {
		for (const { field, rawTypes, tags } of CLUSTER_FIELDS) {
			// The most generic raw type, so broad fallbacks can't pick the lane for us.
			const people = tags.map(({ tag }) => candidate(`probe-${tag}`, [rawTypes[0], tag]));
			const lanes = getPersonalityCategoryGroups(
				field as Parameters<typeof getPersonalityCategoryGroups>[0],
				people
			);
			for (const { tag, lane } of tags) {
				const landed = lanes.find((group) => group.people.some((p) => p.slug === `probe-${tag}`));
				expect(landed?.slug, `${field}: ${tag}`).toBe(lane);
			}
			expect(lanes.filter((group) => !group.slug.startsWith('other-'))).toHaveLength(tags.length);
		}
	});

	it('appears in the people profile standard the pipeline writers read', () => {
		const standard = readFileSync('docs/writing-system/people-profile-standard.md', 'utf8');
		for (const { tags } of CLUSTER_FIELDS)
			for (const { tag } of tags) expect(standard, tag).toContain(`\`${tag}\``);
	});
});

describe('primary field and missing tags', () => {
	it('files people the way the type hub does', () => {
		expect(getPrimaryField(['musician', 'celebrity'])).toBe('music');
		expect(getPrimaryField(['celebrity', 'comedian'])).toBe('comedy');
		expect(getPrimaryField(['celebrity', 'athlete'])).toBe('athletes');
		expect(getPrimaryField(['historical', 'author'])).toBe('authors-thinkers');
		expect(getPrimaryField(['creator', 'author'], 'Brene-Brown')).toBe('authors-thinkers');
		expect(getPrimaryField(['unrecognized'])).toBe('other');
		expect(getPrimaryField(['Musician'])).toBe('music');
	});

	it('asks for a tag from the primary field only', () => {
		expect(getMissingClusterField(['musician'])).toBe('music');
		expect(getMissingClusterField(['musician', 'pop-star'])).toBeNull();
		// A tag from another field doesn't count for the primary one.
		expect(getMissingClusterField(['musician', 'celebrity', 'screen-icon'])).toBe('music');
		expect(getMissingClusterField(['celebrity', 'athlete'])).toBeNull();
		expect(getMissingClusterField(['unrecognized'])).toBeNull();
		expect(getMissingClusterField(undefined)).toBeNull();
	});

	it('recognizes tags and short labels', () => {
		expect(isClusterTag('screen-icon')).toBe(true);
		expect(isClusterTag('movieStar')).toBe(false);
		expect(isClusterTag(7)).toBe(false);
		expect(getClusterLaneShortLabel('screen-icons-leading-actors')).toBe('Screen icons');
		expect(getClusterLaneShortLabel('other-music-personalities')).toBeNull();
	});
});
