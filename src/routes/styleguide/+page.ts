// src/routes/styleguide/+page.ts
import type { PageLoad } from './$types';

const PORTRAIT_SLUG_PATTERN = /^[A-Za-z0-9][A-Za-z0-9.-]*$/;

export type PortraitPreflight =
	| {
			status: 'ready';
			type: number;
			slug: string;
			name: string;
			fullSrc: string;
			thumbnailSrc: string;
	  }
	| { status: 'invalid'; message: string };

export function _parsePortraitPreflight(url: URL): PortraitPreflight | null {
	const typeValue = url.searchParams.get('portraitType');
	const slug = url.searchParams.get('portraitSlug');
	if (typeValue === null && slug === null) return null;

	const type = Number(typeValue);
	if (!Number.isInteger(type) || type < 1 || type > 9) {
		return {
			status: 'invalid',
			message: 'Portrait preview type must be a number from 1 through 9.'
		};
	}
	if (!slug || slug.startsWith('s-') || !PORTRAIT_SLUG_PATTERN.test(slug)) {
		return {
			status: 'invalid',
			message: 'Portrait preview slug must be filename-safe and must not begin with s-.'
		};
	}

	return {
		status: 'ready',
		type,
		slug,
		name: slug.replaceAll('-', ' '),
		fullSrc: `/types/${type}s/${slug}.webp`,
		thumbnailSrc: `/types/${type}s/s-${slug}.webp`
	};
}

export const load: PageLoad = ({ url }) => ({
	portraitPreflight: _parsePortraitPreflight(url)
});
