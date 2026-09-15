// src/lib/server/personalityImageRedirect.spec.ts
import { describe, expect, it } from 'vitest';

import type { FamousTypePerson } from '$lib/components/molecules/famousTypes';
import { createRetypedPersonalityImageResolver } from './personalityImageRedirect';

function person(name: string, hasImage = true): FamousTypePerson {
	return {
		name,
		link: true,
		hasImage,
		lastmod: null,
		personaTitle: null,
		contentGrade: null,
		types: []
	};
}

const resolve = createRetypedPersonalityImageResolver({
	1: [person('ben-shapiro')],
	4: [person('miley-cyrus')],
	5: [person('no-portrait', false)]
});

describe('personalityImageRedirect', () => {
	it('redirects a retyped portrait to its current type folder', () => {
		expect(resolve('/types/7s/Miley-Cyrus.webp')).toBe('/types/4s/Miley-Cyrus.webp');
	});

	it('keeps the thumbnail variant when redirecting', () => {
		expect(resolve('/types/6s/s-Ben-Shapiro.webp')).toBe('/types/1s/s-Ben-Shapiro.webp');
	});

	it('leaves requests that already use the current type as 404s', () => {
		expect(resolve('/types/4s/Miley-Cyrus.webp')).toBeNull();
	});

	it('ignores unknown people, people without portraits, and non-portrait paths', () => {
		expect(resolve('/types/7s/Unknown-Person.webp')).toBeNull();
		expect(resolve('/types/3s/No-Portrait.webp')).toBeNull();
		expect(resolve('/types/7s/Miley-Cyrus.png')).toBeNull();
		expect(resolve('/types/dave-approval.jpg')).toBeNull();
		expect(resolve('/types/7s/nested/Miley-Cyrus.webp')).toBeNull();
	});
});
