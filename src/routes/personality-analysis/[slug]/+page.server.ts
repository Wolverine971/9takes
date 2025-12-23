// src/routes/personality-analysis/[slug]/+page.server.ts
import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabase';
import { dev } from '$app/environment';
import { slugFromPath } from '$lib/slugFromPath';
import type { Actions } from './$types';

// Cache duration in seconds (5 minutes for non-dev environments)
const CACHE_DURATION = !dev ? 300 : 0;

const MAX_AGE = 60 * 5;

// In-memory cache for user status
const userStatusCache = new Map();
const commentsCache = new Map();

export const load: PageServerLoad = async (event: any) => {
	const setHeaders = event.setHeaders;
	const session = event.locals.session;
	const user = session?.user;
	const slug = event.params.slug;
	const cookie = event.cookies.get('9tfingerprint');

	if (!dev) {
		setHeaders({
			'Cache-Control': `public, max-age=${MAX_AGE}`
			// optional: you could also add `s-maxage` or `stale-while-revalidate`
			// 'Cache-Control': `public, s-maxage=${MAX_AGE}, stale-while-revalidate=300`
		});
	} else {
		// In dev mode, disable caching so changes appear instantly
		setHeaders({
			'Cache-Control': 'no-store'
		});
	}

	const { data: personData } = await supabase
		.from('blogs_famous_people')
		.select('*')
		.eq('person', slug)
		.maybeSingle();

	// Create cache keys
	const userCacheKey = user?.id ? `${slug}:${user.id}` : `${slug}:${cookie}`;

	// Check if we have cached results for user's answer status
	let userHasAnswered = userStatusCache.get(userCacheKey);
	let comments = [];

	// Only perform DB query if not in cache
	if (userHasAnswered === undefined) {
		const queryPromise = user?.id
			? supabase
					.from('blog_comments')
					.select('id')
					.eq('blog_link', slug)
					.eq('author_id', user?.id)
					.maybeSingle()
			: supabase
					.from('blog_comments')
					.select('id')
					.eq('blog_link', slug)
					.eq('fingerprint', cookie)
					.maybeSingle();

		const { data: hasCommented } = await queryPromise;
		userHasAnswered = !!hasCommented;

		// Store in cache
		if (CACHE_DURATION > 0) {
			userStatusCache.set(userCacheKey, userHasAnswered);
			// Set cache expiration
			setTimeout(() => {
				userStatusCache.delete(userCacheKey);
			}, CACHE_DURATION * 1000);
		}
	}

	// Only fetch comments if user has answered - and use caching
	if (userHasAnswered) {
		const commentsCacheKey = `comments:${slug}`;
		const cachedComments = commentsCache.get(commentsCacheKey);

		if (cachedComments) {
			comments = cachedComments;
		} else {
			const { data: blogComments } = await supabase
				.from('blog_comments')
				.select('*')
				.eq('blog_link', slug)
				.order('created_at', { ascending: false })
				.limit(100);

			comments = blogComments || [];

			// Store in cache
			if (CACHE_DURATION > 0) {
				commentsCache.set(commentsCacheKey, comments);
				// Set cache expiration
				setTimeout(() => {
					commentsCache.delete(commentsCacheKey);
				}, CACHE_DURATION * 1000);
			}
		}
	}

	let { content, placeholders } = await processBlogContent(personData.content);

	return {
		user: session?.user ? { id: session?.user?.id, email: session?.user?.email } : null, // Pass user info to components
		flags: {
			userHasAnswered,
			userSignedIn: !!event?.locals?.session?.user?.aud
		},
		post: { ...personData, slug, content },
		slug,
		placeholders,
		comments
	};
};

// In-memory cache for related posts
const relatedPostsCache = new Map();

export const actions: Actions = {
	getRelatedPosts: async ({ request }) => {
		const data = await request.formData();
		const slug = data.get('slug')?.toString();
		const postType = data.get('postType')?.toString();
		const enneagram = data.get('enneagram')
			? parseInt(data.get('enneagram')?.toString() || '0')
			: null;

		if (!slug || (!postType && !enneagram)) {
			return { success: false, error: 'Missing required parameters' };
		}

		// Check cache first
		const cacheKey = `${slug}:${postType || ''}:${enneagram || ''}`;
		const cachedResult = relatedPostsCache.get(cacheKey);

		if (cachedResult) {
			return { success: true, ...cachedResult };
		}

		// Get related posts
		let sameNichePosts: any[] = [];
		let sameEnneagramPosts: any[] = [];

		// Get posts by niche
		if (postType) {
			sameNichePosts = await getNichePosts(slug, postType);
		}

		// Get posts by enneagram
		if (enneagram) {
			sameEnneagramPosts = await getEnneagramPosts(slug, enneagram);
		}

		const result = {
			sameNichePosts,
			sameEnneagramPosts
		};

		// Cache the result
		if (CACHE_DURATION > 0) {
			relatedPostsCache.set(cacheKey, result);

			// Set cache expiration
			setTimeout(() => {
				relatedPostsCache.delete(cacheKey);
			}, CACHE_DURATION * 1000);
		}

		return {
			success: true,
			...result
		};
	}
};

// Functions to get related posts by niche
async function getNichePosts(currentSlug: string, postType: string) {
	const { data: personData, error: personDataError } = await supabase
		.from('blogs_famous_people')
		.select('*')
		.filter('type', 'cs', `["${postType}"]`);

	if (personDataError) {
		console.log(personDataError);
	}

	// Return at most 3 posts, randomly sorted
	return personData
		.filter((p) => p.published && p.person !== currentSlug)
		.sort(() => 0.5 - Math.random())
		.slice(0, 4)
		.map((e) => {
			return { ...e, slug: e.person };
		});
}

// Function to get posts by enneagram number
async function getEnneagramPosts(currentSlug: string, enneagramNum: number) {
	let allPosts: any[] = [];

	// We need to check each category separately to find posts with matching enneagram

	// Check celebrities
	const { data: personData, error: personDataError } = await supabase
		.from('blogs_famous_people')
		.select('*')
		.eq('enneagram', enneagramNum);

	if (personDataError) {
		console.log(personDataError);
	}

	// Return at most 3 posts, randomly sorted
	return personData
		.filter((p) => p.published && p.person !== currentSlug)
		.sort(() => 0.5 - Math.random())
		.slice(0, 4)
		.map((e) => {
			return { ...e, slug: e.person };
		});
}

// Server-only blog content processor - keeps marked library out of client bundle
import { processBlogContent } from '$lib/server/blogContentProcessor';
