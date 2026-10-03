// src/lib/server/personalityImageRedirect.ts
import { famousTypes, type FamousTypePerson } from '$lib/components/molecules/famousTypes';
import {
	buildPersonalityImagePath,
	normalizePersonalitySlug
} from '$lib/utils/personalityAnalysis';

type FamousTypesByEnneagram = { [index: number]: FamousTypePerson[] };

const TYPE_IMAGE_PATH = /^\/types\/([1-9])s\/([^/]+)\.webp$/i;
const THUMBNAIL_PREFIX = 's-';

/**
 * Portraits live in one folder per Enneagram type, so retyping a person moves
 * their image and strands every old URL (Google Images, shares, embeds). Resolve
 * a stale `/types/{old}s/{Name}.webp` to the person's current folder and filename
 * casing. Already canonical requests stay 404s if the file is genuinely missing.
 */
export function createRetypedPersonalityImageResolver(groups: FamousTypesByEnneagram) {
	const currentTypeBySlug = new Map<string, number>();

	for (let type = 1; type <= 9; type++) {
		for (const person of groups[type] ?? []) {
			if (person.hasImage) {
				currentTypeBySlug.set(normalizePersonalitySlug(person.name), type);
			}
		}
	}

	return (pathname: string): string | null => {
		const match = TYPE_IMAGE_PATH.exec(pathname);
		if (!match) return null;

		const fileSlug = safeDecode(match[2]);
		const candidates: Array<{ imageSlug: string; variant: 'full' | 'thumbnail' }> = [
			{ imageSlug: fileSlug, variant: 'full' }
		];

		if (fileSlug.toLowerCase().startsWith(THUMBNAIL_PREFIX)) {
			candidates.push({
				imageSlug: fileSlug.slice(THUMBNAIL_PREFIX.length),
				variant: 'thumbnail'
			});
		}

		for (const { imageSlug, variant } of candidates) {
			const currentType = currentTypeBySlug.get(normalizePersonalitySlug(imageSlug));
			if (!currentType) continue;
			const canonicalPath = buildPersonalityImagePath(currentType, imageSlug, variant);
			// Compare pathnames without cache-version queries to avoid redirect loops.
			return canonicalPath && canonicalPath.split('?')[0] !== pathname ? canonicalPath : null;
		}

		return null;
	};
}

function safeDecode(value: string): string {
	try {
		return decodeURIComponent(value);
	} catch {
		return value;
	}
}

export const getRetypedPersonalityImagePath = createRetypedPersonalityImageResolver(famousTypes);
