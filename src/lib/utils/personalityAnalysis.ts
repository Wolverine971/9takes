// src/lib/utils/personalityAnalysis.ts
import personalityImageSlugMap from '$lib/generated/personalityImageSlugMap.json';

// A profile's canonical URL/image key is occasionally shorter than the public
// name people search for. Keep those identities explicit instead of changing a
// ranking URL or overloading the image-slug compatibility map.
// Names the slug can't spell: accents, apostrophes, initials, internal capitals
// and hyphens. personalityDisplayNames.spec.ts checks every published draft's
// display name against the article's own spelling.
const PERSONALITY_DISPLAY_NAME_OVERRIDES: Record<string, string> = {
	adela: 'Adéla',
	'alexandria-ocasio-cortez': 'Alexandria Ocasio-Cortez',
	'ana-de-armas': 'Ana de Armas',
	'anya-taylor-joy': 'Anya Taylor-Joy',
	ashby: 'Ashby Florence',
	'beyonce-knowles': 'Beyoncé Knowles',
	'charli-damelio': "Charli D'Amelio",
	'charli-xcx': 'Charli XCX',
	'conan-obrien': "Conan O'Brien",
	'dixie-damelio': "Dixie D'Amelio",
	'dr-phil': 'Dr. Phil',
	'ellen-degeneres': 'Ellen DeGeneres',
	'george-h-w-bush': 'George H.W. Bush',
	'george-rr-martin': 'George R.R. Martin',
	'george-w-bush': 'George W. Bush',
	'jk-rowling': 'J.K. Rowling',
	'john-d-rockefeller': 'John D. Rockefeller',
	'john-f-kennedy': 'John F. Kennedy',
	'khloe-kardashian': 'Khloé Kardashian',
	'leonardo-da-vinci': 'Leonardo da Vinci',
	'lupita-nyongo': "Lupita Nyong'o",
	'marcello-hernandez': 'Marcello Hernández',
	'michael-b-jordan': 'Michael B. Jordan',
	'mr-beast': 'MrBeast',
	'mr-rogers': 'Mister Rogers',
	'odessa-azion': "Odessa A'zion",
	'patrick-bet-david': 'Patrick Bet-David',
	'penelope-cruz': 'Penélope Cruz',
	'rachel-mcadams': 'Rachel McAdams',
	'sam-bankman-fried': 'Sam Bankman-Fried',
	'samuel-l-jackson': 'Samuel L. Jackson',
	'stephen-a-smith': 'Stephen A. Smith',
	'timothee-chalamet': 'Timothée Chalamet',
	'tyler-the-creator': 'Tyler, The Creator',
	'vincent-van-gogh': 'Vincent van Gogh',
	'zoe-kravitz': 'Zoë Kravitz'
};

// Version portraits that were added or replaced after their original URLs reached
// production so browsers do not reuse a cached missing or stale response.
const PERSONALITY_IMAGE_CACHE_VERSIONS: Record<string, string> = {
	'demis-hassabis': '20260902d',
	'freddie-mercury': '20260902b',
	'marcus-aurelius': '20260830'
};

export function normalizePersonalitySlug(slug: string | null | undefined): string {
	if (typeof slug !== 'string') return '';
	return slug
		.trim()
		.toLowerCase()
		.normalize('NFD') // decompose accents so diacritics can be stripped: é -> e + combining mark
		.replace(/[̀-ͯ]/g, '') // strip combining diacritics: brené -> brene
		.replace(/['’.]/g, '') // drop apostrophes (straight/curly) and periods: d'amelio -> damelio, j.k. -> jk
		.replace(/[^a-z0-9]+/g, '-') // any other non-alphanumeric run -> single hyphen
		.replace(/^-+|-+$/g, ''); // trim leading/trailing hyphens
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
	const normalizedSlug = normalizePersonalitySlug(slug);
	const displayNameOverride = PERSONALITY_DISPLAY_NAME_OVERRIDES[normalizedSlug];
	if (displayNameOverride) return displayNameOverride;

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
	const imagePath = `/types/${enneagramValue}s/${fileName}`;
	const cacheVersion = PERSONALITY_IMAGE_CACHE_VERSIONS[normalizePersonalitySlug(slug)];

	return cacheVersion ? `${imagePath}?v=${cacheVersion}` : imagePath;
}

export function buildPersonalityImageUrl(
	enneagram: string | number | null | undefined,
	slug: string | null | undefined,
	variant: 'full' | 'thumbnail' = 'full'
): string {
	const imagePath = buildPersonalityImagePath(enneagram, slug, variant);
	return imagePath ? `https://9takes.com${imagePath}` : '';
}
