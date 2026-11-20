// src/lib/personClusterTags.spec.ts
import { describe, expect, it } from 'vitest';
import {
	CLUSTER_FIELDS,
	getClusterLaneShortLabel,
	getMissingClusterField,
	getPrimaryField,
	isClusterTag
} from './personClusterTags.js';

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
