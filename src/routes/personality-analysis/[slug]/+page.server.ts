// src/routes/personality-analysis/[slug]/+page.server.ts
import type { PageServerLoad } from './$types';
import { dev } from '$app/environment';
import type { Actions } from './$types';
import { error } from '@sveltejs/kit';
import type { Database } from '../../../../database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
	rankSimilarPeople,
	type PersonalitySimilarityRow
} from '$lib/server/personalitySimilarity';
import {
	buildPersonalityAnalysisUrl,
	normalizePersonalitySlug
} from '$lib/utils/personalityAnalysis';

type FamousPersonRow = Database['public']['Tables']['blogs_famous_people']['Row'];
type BlogCommentRow = Database['public']['Tables']['blog_comments']['Row'];
type ServerSupabaseClient = SupabaseClient<Database>;

export const load: PageServerLoad = async (event) => {
	const setHeaders = event.setHeaders;
	const session = event.locals.session;
	const user = session?.user;
	const requestedSlug = event.params.slug;
	const cookie = event.cookies.get('9tfingerprint');
	const supabase = event.locals.supabase;

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
		.ilike('person', requestedSlug)
		.maybeSingle();
	const personData = personDataRaw as FamousPersonRow | null;

	if (!personData) {
		throw error(404, `Person not found: ${requestedSlug}`);
	}

	const legacySlug = personData.person ?? requestedSlug;
	const canonicalSlug = normalizePersonalitySlug(legacySlug);
	const commentSlugCandidates = [...new Set([legacySlug, canonicalSlug].filter(Boolean))];

	const queryPromise = user?.id
		? supabase
				.from('blog_comments')
				.select('id')
				.in('blog_link', commentSlugCandidates)
				.eq('author_id', user?.id)
				.maybeSingle()
		: supabase
				.from('blog_comments')
				.select('id')
				.in('blog_link', commentSlugCandidates)
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
			.in('blog_link', commentSlugCandidates)
			.order('created_at', { ascending: false })
			.limit(100);

		comments = blogComments || [];
	}

	const { content, placeholders, headings } = await processBlogContent(personData.content ?? '');
	const publishedAt = personData.date ?? personData.created_at;
	const modifiedAt = personData.lastmod ?? publishedAt;

	return {
		user: session?.user ? { id: session?.user?.id, email: session?.user?.email } : null, // Pass user info to components
		flags: {
			userHasAnswered,
			userSignedIn: !!event?.locals?.session?.user?.aud
		},
		post: {
			...(personData as FamousPersonRow),
			slug: canonicalSlug,
			title: personData.title ?? '',
			author: personData.author ?? 'DJ Wayne',
			description: personData.description ?? '',
			date: publishedAt,
			loc: buildPersonalityAnalysisUrl(canonicalSlug),
			lastmod: modifiedAt,
			changefreq: personData.changefreq ?? 'weekly',
			priority: personData.priority ?? '0.6',
			published: personData.published ?? false,
			content
		},
		slug: canonicalSlug,
		canonicalSlug,
		placeholders,
		headings,
		comments
	};
};

// In-memory cache for related posts
const relatedPostsCache = new Map();

export const actions: Actions = {
	getRelatedPosts: async ({ request, locals }) => {
		const supabase = locals.supabase;
		const data = await request.formData();
		const slug = data.get('slug')?.toString();
		const postTypes = parsePostTypes(data.get('postTypes'));
		const enneagram = data.get('enneagram')
			? parseInt(data.get('enneagram')?.toString() || '0')
			: null;

		if (!slug || (!postTypes.length && !enneagram)) {
			return { success: false, error: 'Missing required parameters' };
		}

		// Check cache first
		const cacheKey = `${slug}:${JSON.stringify(postTypes)}:${enneagram || ''}`;
		const cachedResult = relatedPostsCache.get(cacheKey);

		if (cachedResult) {
			return { success: true, ...cachedResult };
		}

		// Get related posts
		let sameNichePosts: any[] = [];
		let sameEnneagramPosts: any[] = [];

		// Get similar posts by shared tags/categories
		if (postTypes.length) {
			sameNichePosts = await getSimilarPosts(supabase, slug, postTypes, enneagram);
		}

		// Get posts by enneagram, ranked by overall similarity
		if (enneagram) {
			sameEnneagramPosts = await getEnneagramPosts(
				supabase,
				slug,
				enneagram,
				postTypes
			).then((posts) =>
				posts.filter((post) => !sameNichePosts.some((candidate) => candidate.slug === post.slug))
			);
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

function parsePostTypes(value: FormDataEntryValue | null): string[] {
	if (typeof value !== 'string' || value.trim().length === 0) return [];

	try {
		const parsed = JSON.parse(value);
		return Array.isArray(parsed) ? parsed.map(String) : [];
	} catch {
		return value
			.split(',')
			.map((item) => item.trim())
			.filter(Boolean);
	}
}

function mapSimilarResults(rows: PersonalitySimilarityRow[]) {
	return rows.map((row) => ({ ...row, slug: normalizePersonalitySlug(row.person) }));
}

async function getSimilarPosts(
	supabase: ServerSupabaseClient,
	currentSlug: string,
	postTypes: string[],
	enneagram: number | null
) {
	const { data: personDataRaw, error: personDataError } = await supabase
		.from('blogs_famous_people')
		.select(
			'person, enneagram, title, description, persona_title, lastmod, date, type, published, content_quality'
		)
		.eq('published', true);
	const personData = (personDataRaw ?? []) as PersonalitySimilarityRow[];

	if (personDataError) {
		console.log(personDataError);
	}

	return mapSimilarResults(
		rankSimilarPeople({
			currentSlug,
			currentTypes: postTypes,
			currentEnneagram: enneagram,
			rows: personData
		}).map((entry) => entry.row)
	);
}

// Function to get posts by enneagram number
async function getEnneagramPosts(
	supabase: ServerSupabaseClient,
	currentSlug: string,
	enneagramNum: number,
	postTypes: string[]
) {
	const { data: personDataRaw, error: personDataError } = await supabase
		.from('blogs_famous_people')
		.select(
			'person, enneagram, title, description, persona_title, lastmod, date, type, published, content_quality'
		)
		.eq('published', true)
		.eq('enneagram', String(enneagramNum));
	const personData = (personDataRaw ?? []) as PersonalitySimilarityRow[];

	if (personDataError) {
		console.log(personDataError);
	}

	return mapSimilarResults(
		rankSimilarPeople({
			currentSlug,
			currentTypes: postTypes,
			currentEnneagram: enneagramNum,
			rows: personData,
			requireSameEnneagram: true
		}).map((entry) => entry.row)
	);
}

// Server-only blog content processor - keeps marked library out of client bundle
import { processBlogContent } from '$lib/server/blogContentProcessor';
