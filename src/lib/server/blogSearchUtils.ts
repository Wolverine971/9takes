// Shared helpers for blog search endpoints

export const ROUTE_MAP: Record<string, string> = {
	// Main categories
	enneagram: '/enneagram-corner',
	'mental-health': '/enneagram-corner/mental-health',
	community: '/community',
	guides: '/how-to-guides',
	'pop-culture': '/pop-culture',
	topical: '/blog/topical',
	'life-situations': '/enneagram-corner',
	generational: '/enneagram-corner',
	historical: '/enneagram-corner',
	situational: '/enneagram-corner',
	overview: '/enneagram-corner',
	'life-style': '/enneagram-corner'
};

export function generateBlogUrl(source: string, slug: string, category: string | null): string {
	if (source === 'famous_people') {
		return `/personality-analysis/${slug}`;
	}

	// Handle slugs that include nested paths (e.g., mental-health/foo)
	if (slug.includes('/')) {
		const parts = slug.split('/');
		const subdir = parts[0];
		const fileName = parts[parts.length - 1];

		if (ROUTE_MAP[subdir]) {
			return `${ROUTE_MAP[subdir]}/${fileName}`;
		}
	}

	const baseRoute = category && ROUTE_MAP[category] ? ROUTE_MAP[category] : '/enneagram-corner';
	const finalSlug = slug.includes('/') ? slug.split('/').pop() : slug;

	return `${baseRoute}/${finalSlug}`;
}

export function normalizeTextArray(value: unknown): string[] {
	if (Array.isArray(value)) {
		return value.map(String);
	}

	if (value && typeof value === 'object') {
		return Object.values(value).map(String);
	}

	if (typeof value === 'string' && value.trim().length > 0) {
		return value
			.split(',')
			.map((item) => item.trim())
			.filter(Boolean);
	}

	return [];
}

export function parseEnneagramParam(value: string | null): number | null {
	if (!value) return null;

	const parsed = Number(value);
	if (Number.isInteger(parsed) && parsed >= 1 && parsed <= 9) {
		return parsed;
	}

	return null;
}

export function parseLimit(value: string | null, fallback = 20, max = 100): number {
	const parsed = Number(value);
	if (Number.isInteger(parsed) && parsed > 0) {
		return Math.min(parsed, max);
	}
	return fallback;
}

export function parseOffset(value: string | null, fallback = 0): number {
	const parsed = Number(value);
	if (Number.isInteger(parsed) && parsed >= 0) {
		return parsed;
	}
	return fallback;
}
