// src/routes/personality-analysis/[slug]/+page.server.ts
import type { PageServerLoad } from './$types';
import { dev } from '$app/environment';
import type { Actions } from './$types';
import { error, redirect } from '@sveltejs/kit';
import type { Database, Json } from '../../../../database.types';
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
import { isQuestionPubliclyEligible } from '$lib/server/questionEditorial';
import personalitySimilaritySnapshot from '$lib/generated/personalitySimilaritySnapshot.json';
import { waitUntil } from '@vercel/functions';
import { smartQuotesText } from '$lib/utils/smartQuotes';

type FamousPersonRow = Database['public']['Tables']['blogs_famous_people']['Row'];
type ServerSupabaseClient = SupabaseClient<Database>;
type RelatedPersonalityCard = Pick<PersonalitySimilarityRow, 'enneagram'> & { slug: string };
type RelatedPersonalityPayload = {
	sameNichePosts: RelatedPersonalityCard[];
	sameEnneagramPosts: RelatedPersonalityCard[];
};
type PublicChorusQuestion = { question: string | null; questionUrl: string | null };

// The similarity refresh runs after the response, so it can wait longer than
// render-blocking enrichment queries.
const SIMILARITY_REFRESH_TIMEOUT_MS = 10_000;
const SIMILARITY_REFRESH_RETRY_MS = 60 * 1000;
const PERSONALITY_SIMILARITY_SNAPSHOT = personalitySimilaritySnapshot as PersonalitySimilarityRow[];

/**
 * Served from Vercel's ISR cache: one stored copy per path, shared by every
 * visitor and every crawler, refreshed on publish (scripts/revalidate-personality.mjs).
 *
 * That only holds because this payload is visitor-independent. The answer gate
 * and comments moved to /api/personality-analysis/[slug]/discussion, and admin
 * draft preview moved to /admin/content-board/personality-analysis/[slug].
 * Nothing here may read the session, a cookie, or the user agent.
 */
const isrBypassToken = process.env.BYPASS_TOKEN;

export const config = {
	isr: {
		// Content changes land through on-demand revalidation; this is the safety net.
		expiration: 86_400,
		// Ignore utm/fbclid and friends so tagged links reuse one cache entry.
		allowQuery: [],
		...(isrBypassToken && isrBypassToken.length >= 32 ? { bypassToken: isrBypassToken } : {})
	}
};

export const load: PageServerLoad = async (event) => {
	const setHeaders = event.setHeaders;
	const requestedSlug = event.params.slug;
	const canonicalSlugParam = normalizePersonalitySlug(requestedSlug);

	if (canonicalSlugParam && requestedSlug !== canonicalSlugParam) {
		throw redirect(301, buildPersonalityAnalysisPath(canonicalSlugParam) + event.url.search);
	}

	const supabase = event.locals.supabase;

	if (!dev) {
		setHeaders({
			// Identical for every visitor, so it can sit in a shared cache in front
			// of ISR. hooks.server.ts applies the same policy to the response.
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

	// Unpublished people 404 for everyone here, including admins: this response is
	// shared, so a draft fetched by an admin would be replayed to the public.
	// Preview drafts at /admin/content-board/personality-analysis/[slug].
	if (!personData.published) {
		throw error(404, `Person not found: ${requestedSlug}`);
	}

	const legacySlug = personData.person ?? requestedSlug;
	const canonicalSlug = normalizePersonalitySlug(legacySlug);

	const bridgeLinks = buildPersonalityBridgeLinks({
		enneagram: personData.enneagram,
		types: personData.type,
		personSlug: canonicalSlug
	});
	const postTypes = normalizePeopleTypes(personData.type);
	const enneagramNum = parseEnneagramNumber(personData.enneagram);
	const [{ content, placeholders, headings }, relatedPosts, publishedRows, publicChorus] =
		await Promise.all([
			processBlogContent(personData.content ?? '', { popCardImageTreatment: 'personality' }),
			buildRelatedPosts(supabase, canonicalSlug, postTypes, enneagramNum),
			getPersonalitySimilarityRows(supabase),
			resolvePublicChorusQuestion(supabase, personData)
		]);
	const suggestedPeople = buildSuggestedPeople(
		personData.suggestions,
		canonicalSlug,
		publishedRows
	);

	const wordCount = countRenderableWords(content);
	const publishedAt = personData.published_at ?? personData.date ?? personData.created_at;
	const modifiedAt = personData.lastmod ?? publishedAt;

	return {
		post: {
			...(personData as FamousPersonRow),
			chorus_question: publicChorus.question,
			chorus_question_url: publicChorus.questionUrl,
			slug: canonicalSlug,
			title: personData.title ?? '',
			author: personData.author ?? 'DJ Wayne',
			// Visible copy outside the article body gets the same typographic
			// quotes as the body (processBlogContent). FAQ text also feeds the
			// FAQPage JSON-LD, which must match what's on screen.
			description: smartQuotesText(personData.description ?? ''),
			persona_title: personData.persona_title
				? smartQuotesText(personData.persona_title)
				: personData.persona_title,
			faqs: smartQuoteFaqs(personData.faqs),
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
		bridgeLinks,
		suggestedPeople,
		relatedPosts
	};
};

async function resolvePublicChorusQuestion(
	supabase: ServerSupabaseClient,
	person: FamousPersonRow
): Promise<PublicChorusQuestion> {
	const questionUrl = person.chorus_question_url?.trim();
	if (!questionUrl) return { question: null, questionUrl: null };

	const { data: question, error: questionError } = await supabase
		.from('questions')
		.select('question, question_formatted, flagged, removed, data')
		.eq('url', questionUrl)
		.maybeSingle();

	if (questionError || !question || !isQuestionPubliclyEligible(question)) {
		return { question: null, questionUrl: null };
	}

	const publicQuestion = (question.question_formatted || question.question || '').trim();
	return publicQuestion
		? { question: publicQuestion, questionUrl }
		: { question: null, questionUrl: null };
}

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

	// ’ counts as part of a word: content is typographically quoted, and
	// "don’t" must stay one word or read time inflates.
	return plainText.match(/[A-Za-z0-9][A-Za-z0-9'’-]*/g)?.length ?? 0;
}

function smartQuoteFaqs(faqs: FamousPersonRow['faqs']): FamousPersonRow['faqs'] {
	if (!Array.isArray(faqs)) return faqs;
	return faqs.map((faq) => {
		if (!faq || typeof faq !== 'object' || Array.isArray(faq)) return faq;
		const record = faq as { [key: string]: Json | undefined };
		return {
			...record,
			...(typeof record.question === 'string' && { question: smartQuotesText(record.question) }),
			...(typeof record.answer === 'string' && { answer: smartQuotesText(record.answer) })
		};
	});
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
	// Related cards only render a portrait and link, so ship just those fields.
	return rows.map((row) => ({
		slug: normalizePersonalitySlug(row.person),
		enneagram: row.enneagram
	}));
}

/**
 * Hand-curated `suggestions` (jsonb array of person slugs) drive the floating
 * related-personalities rail. Normalize them, drop self-references and dupes,
 * and keep only slugs that resolve to a published page so the rail never links
 * into a 404. When the published-row lookup came back empty (network blip, and
 * the cache is cold) the filter is skipped rather than blanking the rail.
 */
function buildSuggestedPeople(
	rawSuggestions: unknown,
	currentSlug: string,
	publishedRows: PersonalitySimilarityRow[]
): string[] {
	if (!Array.isArray(rawSuggestions)) return [];

	const publishedSlugs = new Set(
		publishedRows.map((row) => normalizePersonalitySlug(row.person)).filter(Boolean)
	);
	const seen = new Set<string>();
	const suggested: string[] = [];

	for (const entry of rawSuggestions) {
		if (typeof entry !== 'string') continue;
		const slug = normalizePersonalitySlug(entry);
		if (!slug || slug === currentSlug || seen.has(slug)) continue;
		if (publishedSlugs.size && !publishedSlugs.has(slug)) continue;
		seen.add(slug);
		suggested.push(slug);
	}

	return suggested;
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
	if (similarityRowsCache && similarityRowsCache.expiresAt > Date.now()) {
		return similarityRowsCache.value;
	}

	const refresh = refreshPersonalitySimilarityRows(supabase);
	const staleRows = similarityRowsCache?.value ?? PERSONALITY_SIMILARITY_SNAPSHOT;

	if (!staleRows.length) {
		return refresh;
	}

	// Never hold a render on the reference-set query: serve the last good rows (or
	// the build-time snapshot on a cold instance) and finish the refresh after the
	// response.
	waitUntil(refresh);
	return staleRows;
}

function refreshPersonalitySimilarityRows(
	supabase: ServerSupabaseClient
): Promise<PersonalitySimilarityRow[]> {
	if (!similarityRowsPromise) {
		similarityRowsPromise = Promise.resolve(
			supabase
				.from('blogs_famous_people')
				.select('person, enneagram, lastmod, date, type, published, content_quality')
				.eq('published', true)
				.abortSignal(AbortSignal.timeout(SIMILARITY_REFRESH_TIMEOUT_MS))
		)
			.then(({ data, error: similarityRowsError }) => {
				if (similarityRowsError) {
					return keepSimilarityRowsAfterFailedRefresh(similarityRowsError);
				}

				const value = (data ?? []) as PersonalitySimilarityRow[];
				similarityRowsCache = {
					value,
					expiresAt: Date.now() + RELATED_POSTS_CACHE_TTL_MS
				};
				return value;
			})
			.catch(keepSimilarityRowsAfterFailedRefresh)
			.finally(() => {
				similarityRowsPromise = null;
			});
	}

	return similarityRowsPromise;
}

function keepSimilarityRowsAfterFailedRefresh(refreshError: unknown): PersonalitySimilarityRow[] {
	const value = similarityRowsCache?.value ?? PERSONALITY_SIMILARITY_SNAPSHOT;
	console.warn('Personality similarity refresh failed; serving cached rows', {
		cachedRows: value.length,
		error: refreshError
	});
	// Back off briefly so a degraded database is not re-queried on every render.
	similarityRowsCache = { value, expiresAt: Date.now() + SIMILARITY_REFRESH_RETRY_MS };
	return value;
}

// Server-only blog content processor - keeps marked library out of client bundle
import { processBlogContent } from '$lib/server/blogContentProcessor';
