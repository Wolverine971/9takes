// scripts/lib/personalitySeo.js
import personalityImageSlugMap from '../../src/lib/generated/personalityImageSlugMap.json' with { type: 'json' };

export function normalizePersonalitySlug(slug) {
	return typeof slug === 'string' ? slug.trim().replace(/\s+/g, '-').toLowerCase() : '';
}

export function normalizePersonalitySuggestions(value) {
	if (!Array.isArray(value)) return [];

	const seen = new Set();
	const normalized = [];

	for (const item of value) {
		const slug = normalizePersonalitySlug(String(item));
		if (!slug || seen.has(slug)) continue;
		seen.add(slug);
		normalized.push(slug);
	}

	return normalized;
}

export function buildPersonalityAnalysisUrl(slug) {
	const normalizedSlug = normalizePersonalitySlug(slug);
	return normalizedSlug
		? `https://9takes.com/personality-analysis/${normalizedSlug}`
		: 'https://9takes.com/personality-analysis';
}

export function normalizePersonalityAnalysisUrl(url, fallbackSlug = '') {
	if (typeof url !== 'string' || url.trim().length === 0) {
		return buildPersonalityAnalysisUrl(fallbackSlug);
	}

	return url.replace(
		/(https:\/\/9takes\.com\/personality-analysis\/)([^/?#]+)/i,
		(_, prefix, slug) => `${prefix}${normalizePersonalitySlug(slug)}`
	);
}

export function resolvePersonalityImageSlug(slug) {
	const normalizedSlug = normalizePersonalitySlug(slug);
	if (!normalizedSlug) return '';

	return personalityImageSlugMap[normalizedSlug] ?? String(slug).trim();
}

export function buildPersonalityImagePath(enneagram, slug, variant = 'full') {
	const enneagramValue =
		typeof enneagram === 'number' || typeof enneagram === 'string' ? String(enneagram).trim() : '';
	const resolvedSlug = resolvePersonalityImageSlug(slug);

	if (!enneagramValue || !resolvedSlug) return '';

	const fileName = variant === 'thumbnail' ? `s-${resolvedSlug}.webp` : `${resolvedSlug}.webp`;
	return `/types/${enneagramValue}s/${fileName}`;
}
