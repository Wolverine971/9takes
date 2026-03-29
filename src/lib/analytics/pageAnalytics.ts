// src/lib/analytics/pageAnalytics.ts

export const ANALYTICS_SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
export const ANALYTICS_ACTIVITY_WINDOW_MS = 30 * 1000; // 30 seconds
export const ANALYTICS_PING_INTERVAL_MS = 30 * 1000; // 30 seconds
export const ANALYTICS_MAX_DELTA_MS = 30 * 1000; // 30 seconds

export const BLOG_SCOPE_PREFIXES = [
	'/personality-analysis',
	'/community',
	'/how-to-guides',
	'/enneagram-corner',
	'/pop-culture',
	'/blog'
] as const;

export const UTILITY_ROUTE_EXACT = ['/logout'] as const;
export const UTILITY_ROUTE_PREFIXES = ['/admin', '/api', '/account/unsubscribe'] as const;

export const ANALYTICS_SCOPES = [
	'all',
	'blog',
	'people',
	'community',
	'guides',
	'enneagram',
	'pop-culture',
	'question',
	'other'
] as const;

export type AnalyticsScope = (typeof ANALYTICS_SCOPES)[number];

export interface ClassifiedPath {
	path: string;
	routeId: string | null;
	pathGroup: string;
	contentType: Exclude<AnalyticsScope, 'all' | 'blog'>;
	contentSlug: string | null;
}

function removeQueryAndHash(path: string): string {
	const noHash = path.split('#')[0];
	return noHash.split('?')[0];
}

export function normalizePath(path: string | null | undefined): string {
	const raw = path && path.trim() ? path.trim() : '/';
	const base = removeQueryAndHash(raw);
	const withSlash = base.startsWith('/') ? base : `/${base}`;
	if (withSlash.length > 1 && withSlash.endsWith('/')) {
		return withSlash.slice(0, -1);
	}
	return withSlash;
}

export function isUtilityPath(path: string): boolean {
	const normalized = normalizePath(path);
	if (UTILITY_ROUTE_EXACT.includes(normalized as (typeof UTILITY_ROUTE_EXACT)[number])) {
		return true;
	}

	return UTILITY_ROUTE_PREFIXES.some((prefix) => {
		return normalized === prefix || normalized.startsWith(`${prefix}/`);
	});
}

export function shouldTrackPath(path: string): boolean {
	return !isUtilityPath(path);
}

export function isBlogScopePath(path: string): boolean {
	const normalized = normalizePath(path);
	return BLOG_SCOPE_PREFIXES.some((prefix) => {
		return normalized === prefix || normalized.startsWith(`${prefix}/`);
	});
}

export function inferContentType(path: string): ClassifiedPath['contentType'] {
	const normalized = normalizePath(path);

	if (normalized === '/personality-analysis' || normalized.startsWith('/personality-analysis/')) {
		return 'people';
	}
	if (normalized === '/community' || normalized.startsWith('/community/')) {
		return 'community';
	}
	if (normalized === '/how-to-guides' || normalized.startsWith('/how-to-guides/')) {
		return 'guides';
	}
	if (normalized === '/enneagram-corner' || normalized.startsWith('/enneagram-corner/')) {
		return 'enneagram';
	}
	if (normalized === '/pop-culture' || normalized.startsWith('/pop-culture/')) {
		return 'pop-culture';
	}
	if (normalized === '/questions' || normalized.startsWith('/questions/')) {
		return 'question';
	}

	return 'other';
}

function pathToSegments(path: string): string[] {
	return normalizePath(path).split('/').filter(Boolean);
}

function deriveSlugFromSegments(
	path: string,
	contentType: ClassifiedPath['contentType']
): string | null {
	const segments = pathToSegments(path);
	if (segments.length < 2) {
		return null;
	}

	switch (contentType) {
		case 'people':
			if (segments[1] === 'categories') {
				return segments[2] ?? null;
			}
			if (segments[1] && segments[0] === 'personality-analysis' && segments[1] !== 'type') {
				return segments[1];
			}
			return null;
		case 'community':
		case 'guides':
		case 'pop-culture':
			return segments[1] ?? null;
		case 'enneagram':
			if (segments[0] !== 'enneagram-corner') return null;
			if (segments[1] === 'subtopic' || segments[1] === 'mental-health') {
				return segments[2] ?? null;
			}
			return segments[1] ?? null;
		case 'question':
			if (segments[1] === 'categories') {
				return segments[2] ?? null;
			}
			return segments[1] ?? null;
		default:
			return null;
	}
}

function derivePathGroupFromPath(path: string, contentType: ClassifiedPath['contentType']): string {
	const normalized = normalizePath(path);
	const segments = pathToSegments(normalized);

	switch (contentType) {
		case 'people':
			if (normalized === '/personality-analysis') return '/personality-analysis';
			if (segments[1] === 'categories') {
				return segments.length > 2
					? '/personality-analysis/categories/[slug]'
					: '/personality-analysis/categories';
			}
			if (segments[1] === 'type') {
				return segments.length > 2
					? '/personality-analysis/type/[slug]'
					: '/personality-analysis/type';
			}
			return segments.length > 1 ? '/personality-analysis/[slug]' : '/personality-analysis';
		case 'community':
			return segments.length > 1 ? '/community/[slug]' : '/community';
		case 'guides':
			return segments.length > 1 ? '/how-to-guides/[slug]' : '/how-to-guides';
		case 'enneagram':
			if (segments[1] === 'subtopic') {
				return segments.length > 2
					? '/enneagram-corner/subtopic/[slug]'
					: '/enneagram-corner/subtopic';
			}
			if (segments[1] === 'mental-health') {
				return segments.length > 2
					? '/enneagram-corner/mental-health/[slug]'
					: '/enneagram-corner/mental-health';
			}
			return segments.length > 1 ? '/enneagram-corner/[slug]' : '/enneagram-corner';
		case 'pop-culture':
			return segments.length > 1 ? '/pop-culture/[slug]' : '/pop-culture';
		case 'question':
			if (segments[1] === 'categories') {
				return segments.length > 2 ? '/questions/categories/[slug]' : '/questions/categories';
			}
			return segments.length > 1 ? '/questions/[slug]' : '/questions';
		default:
			return normalized;
	}
}

export function derivePathGroup(path: string, routeId: string | null | undefined): string {
	if (routeId && routeId.startsWith('/')) {
		return routeId;
	}
	const contentType = inferContentType(path);
	return derivePathGroupFromPath(path, contentType);
}

export function classifyPath(path: string, routeId: string | null | undefined): ClassifiedPath {
	const normalizedPath = normalizePath(path);
	const contentType = inferContentType(normalizedPath);
	const normalizedRouteId = routeId && routeId.startsWith('/') ? routeId : null;
	return {
		path: normalizedPath,
		routeId: normalizedRouteId,
		pathGroup: derivePathGroup(normalizedPath, normalizedRouteId),
		contentType,
		contentSlug: deriveSlugFromSegments(normalizedPath, contentType)
	};
}

export function formatDurationMs(value: number): string {
	if (!Number.isFinite(value) || value <= 0) return '0s';
	const totalSeconds = Math.round(value / 1000);
	if (totalSeconds < 60) return `${totalSeconds}s`;
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	if (minutes < 60) return `${minutes}m ${seconds}s`;
	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;
	return `${hours}h ${remainingMinutes}m`;
}
