// src/routes/personality-analysis/[slug]/+page.server.ts
import type { PageServerLoad } from './$types';
import { dev } from '$app/environment';
import type { Actions } from './$types';
import { error, redirect } from '@sveltejs/kit';
import type { Database } from '../../../../database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
	rankSimilarPeople,
	type PersonalitySimilarityRow
} from '$lib/server/personalitySimilarity';
import {
	buildPersonalityAnalysisPath,
	buildPersonalityAnalysisUrl,
	normalizePersonalitySlug
} from '$lib/utils/personalityAnalysis';
import {
	getPersonalityCategorySlugs,
	getPersonalityCategoryBySlug,
	normalizePeopleTypes
} from '$lib/personalityCategories';
import {
	CONTENT_GUARD_CACHE_CONTROL,
	CONTENT_SEARCH_PREVIEW_CACHE_CONTROL
} from '$lib/server/contentAccessGuard';

type FamousPersonRow = Database['public']['Tables']['blogs_famous_people']['Row'];
type BlogCommentRow = Database['public']['Tables']['blog_comments']['Row'];
type ServerSupabaseClient = SupabaseClient<Database>;
type PublicBlogCommentRow = Pick<
	BlogCommentRow,
	'id' | 'blog_link' | 'blog_type' | 'comment' | 'created_at' | 'author_id'
>;
type RelatedPersonalityCard = PersonalitySimilarityRow & { slug: string };
type RelatedPersonalityPayload = {
	sameNichePosts: RelatedPersonalityCard[];
	sameEnneagramPosts: RelatedPersonalityCard[];
};

const PERSONALITY_ENRICHMENT_TIMEOUT_MS = 4_000;

export const load: PageServerLoad = async (event) => {
	const setHeaders = event.setHeaders;
	const session = event.locals.session;
	const user = session?.user;
	const requestedSlug = event.params.slug;
	const canonicalSlugParam = normalizePersonalitySlug(requestedSlug);

	if (canonicalSlugParam && requestedSlug !== canonicalSlugParam) {
		throw redirect(301, buildPersonalityAnalysisPath(canonicalSlugParam) + event.url.search);
	}

	const cookie = event.cookies.get('9tfingerprint');
	const supabase = event.locals.supabase;

	if (!dev) {
		setHeaders({
			// The content guard keeps humans/private states uncached and upgrades
			// recognized search preview bots to this short edge cache policy.
			'Cache-Control': CONTENT_SEARCH_PREVIEW_CACHE_CONTROL
		});
	} else {
		// In dev mode, disable caching so changes appear instantly
		setHeaders({
			'Cache-Control': CONTENT_GUARD_CACHE_CONTROL
		});
	}

	const { data: personDataRaw } = await supabase
		.from('blogs_famous_people')
		.select(
			'id, author, birth_date, birth_place, category, changefreq, chorus_question, chorus_question_url, citations, content, created_at, date, description, enneagram, faqs, first_published_at, imdb_id, instagram, keywords, knows_about, lastmod, loc, meta_title, nationality, occupation, person, persona_title, priority, published, published_at, same_as, suggestions, tags, tiktok, title, twitter, type, wikidata_qid, wikipedia'
		)
		.eq('person', canonicalSlugParam)
		.maybeSingle();
	const personData = personDataRaw as FamousPersonRow | null;

	if (!personData) {
		throw error(404, `Person not found: ${requestedSlug}`);
	}

	if (!personData.published) {
		const { data: adminProfile } = user?.id
			? await supabase.from('profiles').select('admin').eq('id', user.id).maybeSingle()
			: { data: null };
		if (!adminProfile?.admin) {
			throw error(404, `Person not found: ${requestedSlug}`);
		}
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
				.abortSignal(AbortSignal.timeout(PERSONALITY_ENRICHMENT_TIMEOUT_MS))
				.maybeSingle()
		: supabase
				.from('blog_comments')
				.select('id')
				.in('blog_link', commentSlugCandidates)
				.eq('fingerprint', cookie ?? '')
				.abortSignal(AbortSignal.timeout(PERSONALITY_ENRICHMENT_TIMEOUT_MS))
				.maybeSingle();
	const hasCommentedPromise = Promise.resolve(queryPromise)
		.then(({ data: hasCommented, error: commentLookupError }) => {
			if (commentLookupError) {
				console.warn('Failed to check personality comment access', commentLookupError);
			}
			return Boolean(hasCommented);
		})
		.catch((commentLookupError) => {
			console.warn('Failed to check personality comment access', commentLookupError);
			return false;
		});
	const bridgeLinks = buildPersonalityBridgeLinks({
		enneagram: personData.enneagram,
		types: personData.type,
		personSlug: canonicalSlug
	});
	const postTypes = normalizePeopleTypes(personData.type);
	const enneagramNum = parseEnneagramNumber(personData.enneagram);
	const [userHasAnswered, { content, placeholders, headings }, relatedPosts] = await Promise.all([
		hasCommentedPromise,
		processBlogContent(personData.content ?? ''),
		buildRelatedPosts(supabase, canonicalSlug, postTypes, enneagramNum)
	]);
	let comments: PublicBlogCommentRow[] = [];

	// Only fetch comments if user has answered.
	if (userHasAnswered) {
		const { data: blogComments } = await supabase
			.from('blog_comments')
			.select('id, blog_link, blog_type, comment, created_at, author_id')
			.in('blog_link', commentSlugCandidates)
			.order('created_at', { ascending: false })
			.limit(100);

		comments = blogComments || [];
	}

	const wordCount = countRenderableWords(content);
	const publishedAt = personData.published_at ?? personData.date ?? personData.created_at;
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
			word_count: wordCount,
			time_required: buildTimeRequired(wordCount),
			content
		},
		slug: canonicalSlug,
		canonicalSlug,
		placeholders,
		headings,
		comments,
		bridgeLinks,
		relatedPosts
	};
};

const RELATED_POSTS_CACHE_TTL_MS = 5 * 60 * 1000;
type RelatedPostsCacheEntry = { value: RelatedPersonalityPayload; expiresAt: number };
type SimilarityRowsCacheEntry = { value: PersonalitySimilarityRow[]; expiresAt: number };

// Deduplicate cold-instance lookups and keep different personality pages from
// re-fetching the same reference set during a warm serverless invocation.
const relatedPostsCache = new Map<string, RelatedPostsCacheEntry>();
let similarityRowsCache: SimilarityRowsCacheEntry | null = null;
let similarityRowsPromise: Promise<PersonalitySimilarityRow[]> | null = null;

function countRenderableWords(content: string): number {
	const plainText = content
		.replace(/<script[\s\S]*?<\/script>/gi, ' ')
		.replace(/<style[\s\S]*?<\/style>/gi, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/&[a-zA-Z0-9#]+;/g, ' ');

	return plainText.match(/[A-Za-z0-9][A-Za-z0-9'-]*/g)?.length ?? 0;
}

function buildTimeRequired(wordCount: number): string {
	return `PT${Math.max(1, Math.ceil(wordCount / 200))}M`;
}

const TYPE_PILLAR_LABELS: Record<number, string> = {
	1: 'Type 1 — The Perfectionist',
	2: 'Type 2 — The Helper',
	3: 'Type 3 — The Achiever',
	4: 'Type 4 — The Individualist',
	5: 'Type 5 — The Investigator',
	6: 'Type 6 — The Loyalist',
	7: 'Type 7 — The Enthusiast',
	8: 'Type 8 — The Challenger',
	9: 'Type 9 — The Peacemaker'
};

/**
 * Build bridge links for the profile sidebar. Bridges a profile back into
 * the broader 9takes graph: type pillar, category page, corpus-stats anchor,
 * and /enneagram-test. Bucket 3, internal linking and graph bridging.
 */
function buildPersonalityBridgeLinks({
	enneagram,
	types,
	personSlug
}: {
	enneagram: unknown;
	types: unknown;
	personSlug?: string | null;
}): { label: string; href: string }[] {
	const links: { label: string; href: string }[] = [];

	const enneagramNum = (() => {
		if (typeof enneagram === 'number' && Number.isFinite(enneagram)) return enneagram;
		if (typeof enneagram === 'string' && enneagram.trim() !== '') {
			const parsed = Number.parseInt(enneagram, 10);
			return Number.isFinite(parsed) ? parsed : null;
		}
		return null;
	})();

	if (enneagramNum && enneagramNum >= 1 && enneagramNum <= 9) {
		links.push({
			label: TYPE_PILLAR_LABELS[enneagramNum] ?? `Type ${enneagramNum} pillar`,
			href: `/enneagram-corner/enneagram-type-${enneagramNum}`
		});
	}

	const normalizedTypes = normalizePeopleTypes(types);
	const categorySlugs = getPersonalityCategorySlugs(normalizedTypes, personSlug);
	const primaryCategorySlug = categorySlugs[0];

	if (primaryCategorySlug) {
		const category = getPersonalityCategoryBySlug(primaryCategorySlug);
		if (category) {
			links.push({
				label: `${category.shortLabel} category`,
				href: `/personality-analysis/categories/${category.slug}`
			});
		}
	}

	links.push({
		label: 'Corpus stats',
		href: '/corpus-stats'
	});

	links.push({
		label: 'Take the Enneagram test',
		href: '/enneagram-test'
	});

	return links;
}

export const actions: Actions = {
	getRelatedPosts: async ({ request, locals }) => {
		const supabase = locals.supabase;
		const data = await request.formData();
		const slug = data.get('slug')?.toString();
		const postTypes = parsePostTypes(data.get('postTypes'));
		const enneagram = parseEnneagramNumber(data.get('enneagram')?.toString());

		if (!slug || (!postTypes.length && !enneagram)) {
			return { success: false, error: 'Missing required parameters' };
		}
		const result = await buildRelatedPosts(supabase, slug, postTypes, enneagram);

		return {
			success: true,
			...result
		};
	}
};

function parseEnneagramNumber(value: unknown): number | null {
	if (typeof value === 'number' && Number.isFinite(value)) return value;
	if (typeof value === 'string' && value.trim() !== '') {
		const parsed = Number.parseInt(value, 10);
		return Number.isFinite(parsed) ? parsed : null;
	}
	return null;
}

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

function mapSimilarResults(rows: PersonalitySimilarityRow[]): RelatedPersonalityCard[] {
	return rows.map((row) => ({ ...row, slug: normalizePersonalitySlug(row.person) }));
}

async function buildRelatedPosts(
	supabase: ServerSupabaseClient,
	slug: string,
	postTypes: string[],
	enneagram: number | null
): Promise<RelatedPersonalityPayload> {
	const cacheKey = `${normalizePersonalitySlug(slug)}:${JSON.stringify(postTypes)}:${enneagram || ''}`;
	const now = Date.now();
	const cachedResult = relatedPostsCache.get(cacheKey);

	if (cachedResult && cachedResult.expiresAt > now) {
		return cachedResult.value;
	}

	const personData = await getPersonalitySimilarityRows(supabase);
	let sameNichePosts: RelatedPersonalityCard[] = [];
	let sameEnneagramPosts: RelatedPersonalityCard[] = [];

	if (postTypes.length) {
		sameNichePosts = mapSimilarResults(
			rankSimilarPeople({
				currentSlug: slug,
				currentTypes: postTypes,
				currentEnneagram: enneagram,
				rows: personData
			}).map((entry) => entry.row)
		);
	}

	if (enneagram) {
		sameEnneagramPosts = mapSimilarResults(
			rankSimilarPeople({
				currentSlug: slug,
				currentTypes: postTypes,
				currentEnneagram: enneagram,
				rows: personData,
				requireSameEnneagram: true
			}).map((entry) => entry.row)
		).filter((post) => !sameNichePosts.some((candidate) => candidate.slug === post.slug));
	}

	const result = {
		sameNichePosts,
		sameEnneagramPosts
	};

	relatedPostsCache.set(cacheKey, {
		value: result,
		expiresAt: now + RELATED_POSTS_CACHE_TTL_MS
	});
	return result;
}

async function getPersonalitySimilarityRows(
	supabase: ServerSupabaseClient
): Promise<PersonalitySimilarityRow[]> {
	const now = Date.now();
	if (similarityRowsCache && similarityRowsCache.expiresAt > now) {
		return similarityRowsCache.value;
	}

	if (!similarityRowsPromise) {
		similarityRowsPromise = Promise.resolve(
			supabase
				.from('blogs_famous_people')
				.select(
					'person, enneagram, title, description, persona_title, lastmod, date, type, published, content_quality'
				)
				.eq('published', true)
				.abortSignal(AbortSignal.timeout(PERSONALITY_ENRICHMENT_TIMEOUT_MS))
		)
			.then(({ data, error: similarityRowsError }) => {
				if (similarityRowsError) {
					console.error('Failed to load personality similarity rows', similarityRowsError);
					return similarityRowsCache?.value ?? [];
				}

				const value = (data ?? []) as PersonalitySimilarityRow[];
				similarityRowsCache = {
					value,
					expiresAt: Date.now() + RELATED_POSTS_CACHE_TTL_MS
				};
				return value;
			})
			.catch((similarityRowsError) => {
				console.error('Failed to load personality similarity rows', similarityRowsError);
				return similarityRowsCache?.value ?? [];
			})
			.finally(() => {
				similarityRowsPromise = null;
			});
	}

	return similarityRowsPromise;
}

// Server-only blog content processor - keeps marked library out of client bundle
import { processBlogContent } from '$lib/server/blogContentProcessor';
