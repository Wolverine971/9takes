// src/lib/server/relatedBlogPosts.ts
import matter from 'gray-matter';
import { getPopCultureSimilarityScore } from '$lib/data/popCultureTaxonomy';
import { slugFromPath } from '$lib/slugFromPath';

export type RawBlogModules = Record<string, () => Promise<unknown>>;

const metadataCache = new WeakMap<object, Promise<App.BlogPost[]>>();

function getPostSortTime(post: Pick<App.BlogPost, 'lastmod' | 'date'>): number {
	const timestamp = new Date(post.lastmod || post.date).getTime();
	return Number.isFinite(timestamp) ? timestamp : 0;
}

function getEnneagramType(value: App.BlogPost['enneagram']): number | null {
	if (value === null || value === undefined || value === '') return null;
	const numeric = Number(value);
	return Number.isInteger(numeric) && numeric >= 1 && numeric <= 9 ? numeric : null;
}

function getTypeLabels(value: App.BlogPost['type']): string[] {
	if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string');
	return typeof value === 'string' && value ? [value] : [];
}

/**
 * Resolve raw Markdown frontmatter once per server module graph. The raw glob is
 * intentionally owned by +page.server.ts files, so article component chunks
 * never enter the browser just to construct related-post cards.
 */
export function loadBlogPostMetadata(modules: RawBlogModules): Promise<App.BlogPost[]> {
	const cached = metadataCache.get(modules);
	if (cached) return cached;

	const pending = Promise.all(
		Object.entries(modules).map(async ([path, resolver]) => {
			const raw = await resolver();
			if (typeof raw !== 'string') return null;

			const slug = slugFromPath(path);
			if (!slug) return null;

			const { data } = matter(raw);
			return {
				...(data as App.BlogPost),
				slug
			};
		})
	).then((posts) => posts.filter((post): post is App.BlogPost => post !== null));

	metadataCache.set(modules, pending);
	return pending;
}

export function selectHowToRelatedPosts(
	posts: App.BlogPost[],
	currentSlug: string,
	limit = 6
): App.BlogPost[] {
	return posts
		.filter((post) => post.published && post.slug !== currentSlug)
		.sort((a, b) => getPostSortTime(b) - getPostSortTime(a))
		.slice(0, limit);
}

export function selectCommunityRelatedPosts(
	posts: App.BlogPost[],
	currentSlug: string,
	limit = 6
): App.BlogPost[] {
	const currentPost = posts.find((post) => post.slug === currentSlug);
	if (!currentPost) return [];

	const currentEnneagram = getEnneagramType(currentPost.enneagram);
	const currentType = getTypeLabels(currentPost.type)[0];

	return posts
		.filter((post) => post.published && post.slug !== currentSlug)
		.filter((post) => {
			const matchesEnneagram =
				currentEnneagram !== null && getEnneagramType(post.enneagram) === currentEnneagram;
			const matchesType = Boolean(currentType && getTypeLabels(post.type).includes(currentType));
			return matchesEnneagram || matchesType;
		})
		.sort((a, b) => getPostSortTime(b) - getPostSortTime(a))
		.slice(0, limit);
}

export function selectPopCultureRelatedPosts(
	posts: App.BlogPost[],
	currentSlug: string,
	limit = 6
): App.BlogPost[] {
	const currentPost = posts.find((post) => post.slug === currentSlug);
	if (!currentPost) return [];

	return posts
		.filter((post) => post.published && post.slug !== currentSlug)
		.sort((a, b) => {
			const scoreDiff =
				getPopCultureSimilarityScore(currentPost.popCulture, b.popCulture) -
				getPopCultureSimilarityScore(currentPost.popCulture, a.popCulture);

			if (scoreDiff !== 0) return scoreDiff;
			return getPostSortTime(b) - getPostSortTime(a);
		})
		.slice(0, limit);
}
