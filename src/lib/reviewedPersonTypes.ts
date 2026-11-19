import reviewed from './generated/reviewedPersonTypes.json';
import { normalizePeopleTypes } from './personalityCategories';
import { normalizePersonalitySlug } from './utils/personalityAnalysis';

export function getReviewedPersonTypes(personSlug: string | null, storedTypes: unknown): string[] {
	const slug = normalizePersonalitySlug(personSlug);
	return Object.hasOwn(reviewed, slug)
		? (reviewed as Record<string, string[]>)[slug]
		: normalizePeopleTypes(storedTypes);
}
