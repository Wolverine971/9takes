// src/lib/utils/backNavigation.ts
// Where the site's back arrow appears and where it points. Shared by the
// desktop back bar (BackNavigation.svelte) and the mobile header, which puts
// the arrow beside the search field instead of on its own row.

export interface BackNavStep {
	name: string;
	url: string;
}

/** Ancestor pages of `pathname`, nearest last. Empty on top-level pages. */
export function getBackNavSteps(pathname: string): BackNavStep[] {
	if (!pathname) return [];

	const isAdminRoute = pathname.includes('/admin');
	const pathSegments = pathname.split('/').filter((segment) => {
		if (!segment) return false;
		if (['users', 'unsubscribe', 'type', 'subtopic'].includes(segment)) {
			return isAdminRoute;
		}
		return true;
	});

	return pathSegments.slice(0, -1).map((segment, i) => ({
		name: segment === 'questions' ? 'Questions' : segment.replace(/-/g, ' '),
		url: '/' + pathSegments.slice(0, i + 1).join('/')
	}));
}

function isQuestionSlugPath(pathname: string): boolean {
	return (
		/^\/questions\/[^/]+$/.test(pathname) &&
		pathname !== '/questions/create' &&
		pathname !== '/questions/categories'
	);
}

/**
 * The page the back arrow falls back to, or null when the arrow is hidden.
 * Hidden on the home page, category pages, admin, and question detail pages
 * (those render their own breadcrumbs), and on top-level pages with no parent.
 */
export function getBackNavParent(pathname: string): BackNavStep | null {
	if (!pathname || pathname === '/') return null;
	if (pathname.includes('/categories')) return null;
	if (pathname.startsWith('/admin')) return null;
	if (isQuestionSlugPath(pathname)) return null;

	const steps = getBackNavSteps(pathname);
	return steps.length > 0 ? steps[steps.length - 1] : null;
}
