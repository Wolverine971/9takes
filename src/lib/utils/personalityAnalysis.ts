// src/lib/utils/personalityAnalysis.ts
import personalityImageSlugMap from '$lib/generated/personalityImageSlugMap.json';

export function normalizePersonalitySlug(slug: string | null | undefined): string {
	return slug?.trim().replace(/\s+/g, '-').toLowerCase() ?? '';
}

export function buildPersonalityAnalysisPath(slug: string | null | undefined): string {
	const normalizedSlug = normalizePersonalitySlug(slug);
	return normalizedSlug ? `/personality-analysis/${normalizedSlug}` : '/personality-analysis';
}

export function buildPersonalityAnalysisUrl(slug: string | null | undefined): string {
	return `https://9takes.com${buildPersonalityAnalysisPath(slug)}`;
}

export function normalizePersonalityAnalysisUrl(
	url: string | null | undefined,
	fallbackSlug?: string | null | undefined
): string {
	if (!url?.trim()) {
		return buildPersonalityAnalysisUrl(fallbackSlug);
	}

	return url.replace(
		/(https:\/\/9takes\.com\/personality-analysis\/)([^/?#]+)/i,
		(_, prefix, slug) => `${prefix}${normalizePersonalitySlug(slug)}`
	);
}

export function resolvePersonalityImageSlug(slug: string | null | undefined): string {
	const normalizedSlug = normalizePersonalitySlug(slug);
	if (!normalizedSlug) return '';

	return (personalityImageSlugMap as Record<string, string>)[normalizedSlug] ?? slug?.trim() ?? '';
}

export function formatPersonalityDisplayName(slug: string | null | undefined): string {
	const resolvedSlug = resolvePersonalityImageSlug(slug) || normalizePersonalitySlug(slug);
	if (!resolvedSlug) return '';

	return resolvedSlug
		.split('-')
		.filter(Boolean)
		.map((segment) =>
			segment === segment.toLowerCase()
				? segment.charAt(0).toUpperCase() + segment.slice(1)
				: segment
		)
		.join(' ');
}

export function buildPersonalityImagePath(
	enneagram: string | number | null | undefined,
	slug: string | null | undefined,
	variant: 'full' | 'thumbnail' = 'full'
): string {
	const enneagramValue =
		typeof enneagram === 'number' || typeof enneagram === 'string' ? String(enneagram).trim() : '';
	const resolvedSlug = resolvePersonalityImageSlug(slug);

	if (!enneagramValue || !resolvedSlug) return '';

	const fileName = variant === 'thumbnail' ? `s-${resolvedSlug}.webp` : `${resolvedSlug}.webp`;
	return `/types/${enneagramValue}s/${fileName}`;
}

export function buildPersonalityImageUrl(
	enneagram: string | number | null | undefined,
	slug: string | null | undefined,
	variant: 'full' | 'thumbnail' = 'full'
): string {
	const imagePath = buildPersonalityImagePath(enneagram, slug, variant);
	return imagePath ? `https://9takes.com${imagePath}` : '';
}
