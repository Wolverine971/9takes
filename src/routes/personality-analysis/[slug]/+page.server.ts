// src/routes/personality-analysis/[slug]/+page.server.ts
import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabase';
import { dev } from '$app/environment';
import type { Actions } from './$types';
import { error } from '@sveltejs/kit';
import type { Database } from '../../../../database.types';

type FamousPersonRow = Database['public']['Tables']['blogs_famous_people']['Row'];
type BlogCommentRow = Database['public']['Tables']['blog_comments']['Row'];

export const load: PageServerLoad = async (event) => {
	const setHeaders = event.setHeaders;
	const session = event.locals.session;
	const user = session?.user;
	const slug = event.params.slug;
	const cookie = event.cookies.get('9tfingerprint');

	if (!dev) {
		setHeaders({
			// Personalized response (user/session/fingerprint) - do not cache publicly.
			'Cache-Control': 'private, no-store'
		});
	} else {
		// In dev mode, disable caching so changes appear instantly
		setHeaders({
			'Cache-Control': 'no-store'
		});
	}

	const { data: personDataRaw } = await supabase
		.from('blogs_famous_people')
		.select('*')
		.ilike('person', slug)
		.maybeSingle();
	const personData = personDataRaw as FamousPersonRow | null;

	if (!personData) {
		throw error(404, `Person not found: ${slug}`);
	}

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
				.eq('fingerprint', cookie ?? '')
				.maybeSingle();

	const { data: hasCommented } = await queryPromise;
	const userHasAnswered = !!hasCommented;

	let comments: BlogCommentRow[] = [];

	// Only fetch comments if user has answered
	if (userHasAnswered) {
		const { data: blogComments } = await supabase
			.from('blog_comments')
			.select('*')
			.eq('blog_link', slug)
			.order('created_at', { ascending: false })
			.limit(100);

		comments = blogComments || [];
	}

	const { content, placeholders } = await processBlogContent(personData.content ?? '');

	return {
		user: session?.user ? { id: session?.user?.id, email: session?.user?.email } : null, // Pass user info to components
		flags: {
			userHasAnswered,
			userSignedIn: !!event?.locals?.session?.user?.aud
		},
		post: { ...(personData as FamousPersonRow), slug, content },
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

		// Cache the result for the process lifetime (small and non-personalized)
		relatedPostsCache.set(cacheKey, result);

		return {
			success: true,
			...result
		};
	}
};

// Functions to get related posts by niche
async function getNichePosts(currentSlug: string, postType: string) {
	const { data: personDataRaw, error: personDataError } = await supabase
		.from('blogs_famous_people')
		.select('*')
		.filter('type', 'cs', `["${postType}"]`);
	const personData = (personDataRaw ?? []) as FamousPersonRow[];

	if (personDataError) {
		console.log(personDataError);
	}

	// Return at most 3 posts, randomly sorted
	return personData
		.filter((p) => p.published === true && p.person !== currentSlug)
		.sort(() => 0.5 - Math.random())
		.slice(0, 4)
		.map((e) => {
			return { ...e, slug: e.person ?? currentSlug };
		});
}

// Function to get posts by enneagram number
async function getEnneagramPosts(currentSlug: string, enneagramNum: number) {
	// Check celebrities
	const { data: personDataRaw, error: personDataError } = await supabase
		.from('blogs_famous_people')
		.select('*')
		.eq('enneagram', enneagramNum);
	const personData = (personDataRaw ?? []) as FamousPersonRow[];

	if (personDataError) {
		console.log(personDataError);
	}

	// Return at most 3 posts, randomly sorted
	return personData
		.filter((p) => p.published === true && p.person !== currentSlug)
		.sort(() => 0.5 - Math.random())
		.slice(0, 4)
		.map((e) => {
			return { ...e, slug: e.person ?? currentSlug };
		});
}

// Server-only blog content processor - keeps marked library out of client bundle
import { processBlogContent } from '$lib/server/blogContentProcessor';
