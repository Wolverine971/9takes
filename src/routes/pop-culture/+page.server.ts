// src/routes/pop-culture/+page.server.ts
import { slugFromPath } from '$lib/slugFromPath';
import {
	FALLBACK_POP_CULTURE_SUBCATEGORY,
	POP_CULTURE_CATEGORIES,
	getPopCultureSubcategory,
	normalizePopCultureTaxonomy,
	type PopCultureCategoryMeta,
	type PopCultureSubcategoryMeta
} from '$lib/data/popCultureTaxonomy';
import type { PageServerLoad } from './$types';

const MAX_POSTS = 50;

type PopCultureIndexPost = Pick<
	App.BlogPost,
	| 'slug'
	| 'title'
	| 'description'
	| 'date'
	| 'lastmod'
	| 'published'
	| 'type'
	| 'pic'
	| 'popCulture'
>;

type PopCultureCategoryGroup = {
	category: Omit<PopCultureCategoryMeta, 'subcategories'>;
	posts: PopCultureIndexPost[];
	subcategories: Array<{
		subcategory: PopCultureSubcategoryMeta;
		posts: PopCultureIndexPost[];
	}>;
	count: number;
};

function getPostSortTime(post: Pick<App.BlogPost, 'lastmod' | 'date'>): number {
	return new Date(post.lastmod || post.date).getTime();
}

function sortPostsByLastmod(posts: PopCultureIndexPost[]): PopCultureIndexPost[] {
	return [...posts].sort((a, b) => getPostSortTime(b) - getPostSortTime(a));
}

function groupPostsByTaxonomy(posts: PopCultureIndexPost[]): PopCultureCategoryGroup[] {
	return POP_CULTURE_CATEGORIES.map((category) => {
		const categoryPosts = posts.filter((post) => post.popCulture?.category === category.slug);
		if (categoryPosts.length === 0) return null;

		const knownSubcategorySlugs = new Set(
			category.subcategories.map((subcategory) => subcategory.slug)
		);
		const extraSubcategorySlugs = Array.from(
			new Set(
				categoryPosts
					.map((post) => post.popCulture?.subcategory)
					.filter(
						(subcategory): subcategory is string =>
							typeof subcategory === 'string' && !knownSubcategorySlugs.has(subcategory)
					)
			)
		);
		const subcategories = [
			...category.subcategories,
			...extraSubcategorySlugs.map((slug) => getPopCultureSubcategory(slug))
		]
			.map((subcategory) => ({
				subcategory,
				posts: sortPostsByLastmod(
					categoryPosts.filter(
						(post) =>
							(post.popCulture?.subcategory ?? FALLBACK_POP_CULTURE_SUBCATEGORY.slug) ===
							subcategory.slug
					)
				)
			}))
			.filter((group) => group.posts.length > 0);

		return {
			category: {
				slug: category.slug,
				title: category.title,
				descriptor: category.descriptor
			},
			posts: sortPostsByLastmod(categoryPosts),
			subcategories,
			count: categoryPosts.length
		};
	}).filter((group): group is PopCultureCategoryGroup => group !== null);
}

export const load: PageServerLoad = async () => {
	const modules = import.meta.glob([
		`/src/blog/pop-culture/*.{md,svx,svelte.md}`,
		'!**/*-twitter.md',
		'!**/incel-exit-post.md',
		'!**/template.md'
	]);

	const postPromises = Object.entries(modules).map(([path, resolver]) =>
		resolver().then((post) => {
			const metadata = (post as unknown as App.MdsvexFile).metadata;
			return {
				title: metadata.title,
				description: metadata.description,
				date: metadata.date,
				lastmod: metadata.lastmod ?? metadata.date,
				published: Boolean(metadata.published),
				type: Array.isArray(metadata.type) ? metadata.type : [],
				pic: metadata.pic,
				popCulture: normalizePopCultureTaxonomy(metadata.popCulture),
				slug: slugFromPath(path)
			} as PopCultureIndexPost;
		})
	);

	const posts = await Promise.all(postPromises);
	const publishedPosts = sortPostsByLastmod(posts.filter((post) => post.published)).slice(
		0,
		MAX_POSTS
	);

	const sortedByLastmod = sortPostsByLastmod(publishedPosts);
	const featured = sortedByLastmod.slice(0, 1);
	const featuredSlugs = new Set(featured.map((p) => p.slug));
	const recentlyUpdated = sortedByLastmod.filter((p) => !featuredSlugs.has(p.slug)).slice(0, 3);
	const categoryGroups = groupPostsByTaxonomy(publishedPosts);

	return { popCultureBlogs: publishedPosts, featured, recentlyUpdated, categoryGroups };
};
