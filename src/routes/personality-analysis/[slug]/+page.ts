import { slugFromPath } from '$lib/slugFromPath';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { dev } from '$app/environment';

// Cache duration in seconds (5 minutes for non-dev environments)
const CACHE_DURATION = !dev ? 300 : 0;

// In-memory cache for single posts
const singlePostCache = new Map();

export const load: PageServerLoad = async (
	event: any
): Promise<{
	component: any;
	comments: any[];
	metadata: App.BlogPost;
	slug: string;
	flags: {
		userHasAnswered: boolean;
		userSignedIn: boolean;
	};
}> => {
	const params = event.params;
	const slug = params.slug;

	// Check if we have a cached post
	const cachedPost = singlePostCache.get(slug);
	if (cachedPost) {
		return {
			...cachedPost,
			comments: event.data.comments,
			flags: event.data.flags
		};
	}

	// Get just the current post metadata to determine its type
	const post = await getPostMetadata(slug);

	if (!post || !post.type || !post.type[0]) {
		throw error(404, {
			message: `Couldn't find the blog`
		});
	}

	// Use static glob patterns based on post type - only for the current post type
	let group;
	switch (post.type[0]) {
		case 'celebrity':
			group = import.meta.glob(`/src/blog/people/celebrities/*.{md,svx,svelte.md}`);
			break;
		case 'comedians':
			group = import.meta.glob(`/src/blog/people/comedians/*.{md,svx,svelte.md}`);
			break;
		case 'creator':
			group = import.meta.glob(`/src/blog/people/creators/*.{md,svx,svelte.md}`);
			break;
		case 'lifestyleInfluencer':
			group = import.meta.glob(`/src/blog/people/lifestyle-influencers/*.{md,svx,svelte.md}`);
			break;
		case 'movieStar':
			group = import.meta.glob(`/src/blog/people/movie-stars/*.{md,svx,svelte.md}`);
			break;
		case 'newMovieStar':
			group = import.meta.glob(`/src/blog/people/new-movie-stars/*.{md,svx,svelte.md}`);
			break;
		case 'musician':
			group = import.meta.glob(`/src/blog/people/musicians/*.{md,svx,svelte.md}`);
			break;
		case 'politician':
			group = import.meta.glob(`/src/blog/people/politicians/*.{md,svx,svelte.md}`);
			break;
		case 'techie':
			group = import.meta.glob(`/src/blog/people/techies/*.{md,svx,svelte.md}`);
			break;
		case 'tiktoker':
			group = import.meta.glob(`/src/blog/people/tiktokers/*.{md,svx,svelte.md}`);
			break;
		case 'historical':
			group = import.meta.glob(`/src/blog/people/historical/*.{md,svx,svelte.md}`);
			break;
		default:
			throw error(404, {
				message: `Invalid post type`
			});
	}

	// Find the specific post module
	let match: { path?: string; resolver?: App.MdsvexResolver } = {};
	for (const [path, resolver] of Object.entries(group)) {
		if (slugFromPath(path) === slug) {
			match = { path, resolver: resolver as App.MdsvexResolver };
			break;
		}
	}

	const postModule = await match?.resolver?.();

	if (!postModule || !postModule.metadata.published) {
		throw error(404, {
			message: `Couldn't find the blog`
		});
	}

	const result = {
		component: postModule.default,
		metadata: postModule.metadata as App.BlogPost,
		slug: params.slug,
		comments: event.data.comments,
		flags: event.data.flags
	};

	// Cache the result
	if (CACHE_DURATION > 0) {
		const cachedData = { ...result };
		delete cachedData.comments;
		delete cachedData.flags;

		singlePostCache.set(slug, cachedData);

		// Set cache expiration
		setTimeout(() => {
			singlePostCache.delete(slug);
		}, CACHE_DURATION * 1000);
	}

	return result;
};

// Helper function to get just the metadata for a specific post
async function getPostMetadata(targetSlug: string) {
	// We need to check each category without using dynamic imports

	// First check celebrities
	const celebrityMatch = await checkCategory(
		targetSlug,
		import.meta.glob(`/src/blog/people/celebrities/*.{md,svx,svelte.md}`, { eager: false }),
		'celebrity'
	);
	if (celebrityMatch) return celebrityMatch;

	// Check comedians
	const comediansMatch = await checkCategory(
		targetSlug,
		import.meta.glob(`/src/blog/people/comedians/*.{md,svx,svelte.md}`, { eager: false }),
		'comedians'
	);
	if (comediansMatch) return comediansMatch;

	// Check creators
	const creatorMatch = await checkCategory(
		targetSlug,
		import.meta.glob(`/src/blog/people/creators/*.{md,svx,svelte.md}`, { eager: false }),
		'creator'
	);
	if (creatorMatch) return creatorMatch;

	// Check lifestyle influencers
	const lifestyleInfluencerMatch = await checkCategory(
		targetSlug,
		import.meta.glob(`/src/blog/people/lifestyle-influencers/*.{md,svx,svelte.md}`, {
			eager: false
		}),
		'lifestyleInfluencer'
	);
	if (lifestyleInfluencerMatch) return lifestyleInfluencerMatch;

	// Check movie stars
	const movieStarMatch = await checkCategory(
		targetSlug,
		import.meta.glob(`/src/blog/people/movie-stars/*.{md,svx,svelte.md}`, { eager: false }),
		'movieStar'
	);
	if (movieStarMatch) return movieStarMatch;

	// Check movie stars
	const newMovieStarMatch = await checkCategory(
		targetSlug,
		import.meta.glob(`/src/blog/people/new-movie-stars/*.{md,svx,svelte.md}`, { eager: false }),
		'newMovieStar'
	);
	if (newMovieStarMatch) return newMovieStarMatch;

	// Check historical
	const historicalMatch = await checkCategory(
		targetSlug,
		import.meta.glob(`/src/blog/people/historical/*.{md,svx,svelte.md}`, { eager: false }),
		'historical'
	);
	if (historicalMatch) return historicalMatch;

	// Check musicians
	const musicianMatch = await checkCategory(
		targetSlug,
		import.meta.glob(`/src/blog/people/musicians/*.{md,svx,svelte.md}`, { eager: false }),
		'musician'
	);
	if (musicianMatch) return musicianMatch;

	// Check politicians
	const politicianMatch = await checkCategory(
		targetSlug,
		import.meta.glob(`/src/blog/people/politicians/*.{md,svx,svelte.md}`, { eager: false }),
		'politician'
	);
	if (politicianMatch) return politicianMatch;

	// Check techies
	const techieMatch = await checkCategory(
		targetSlug,
		import.meta.glob(`/src/blog/people/techies/*.{md,svx,svelte.md}`, { eager: false }),
		'techie'
	);
	if (techieMatch) return techieMatch;

	// Check tiktokers
	const tiktokerMatch = await checkCategory(
		targetSlug,
		import.meta.glob(`/src/blog/people/tiktokers/*.{md,svx,svelte.md}`, { eager: false }),
		'tiktoker'
	);
	if (tiktokerMatch) return tiktokerMatch;

	// No match found
	return null;
}

// Helper to check a category for a slug match
async function checkCategory(
	targetSlug: string,
	modules: Record<string, any>,
	categoryType: string
) {
	for (const [path, _] of Object.entries(modules)) {
		const slug = slugFromPath(path.split('/').pop() || '');
		if (slug === targetSlug) {
			// Found the post, return basic metadata
			return {
				type: [categoryType],
				path,
				slug
			};
		}
	}
	return null;
}
