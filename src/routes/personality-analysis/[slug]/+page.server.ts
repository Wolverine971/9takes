// src/routes/personality-analysis/[slug]/+page.server.ts
import type { PageServerLoad } from './$types';
import { dev } from '$app/environment';
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
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';
import {
	PROVEN_CHORUS_QUESTION_URLS,
	orderProvenChorusCandidates
} from '$lib/server/provenChorusQuestions';
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
/**
 * The give-first question this page renders. `subjectType` is what NineChorus
 * posts to /api/nine/mirror: the person's own chorus ('personality-analysis',
 * keyed by page slug) or a proven fallback question ('question', keyed by url).
 */
type PageChorus = {
	question: string;
	questionUrl: string;
	subjectType: 'personality-analysis' | 'question';
	source: 'person' | 'proven';
};
type ChorusQuestionRow = {
	id?: number;
	url?: string | null;
	question: string | null;
	question_formatted: string | null;
	flagged: boolean | null;
	removed: boolean | null;
	data: Json | null;
};

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

/**
 * A failed query must never surface as a 404: ISR stores a 404 and replays it
 * to every visitor and crawler until expiration or a revalidation. Vercel
 * treats any status other than 200, 301, 302, 307, 308, 404 or 410 as a failed
 * render instead: nothing is stored, the previous good copy keeps serving, and
 * it retries about 30 seconds later. 503 also tells crawlers "come back", not
 * "gone".
 */
function throwTemporarilyUnavailable(
	slug: string,
	query: string,
	cause: { code?: string; message?: string }
): never {
	console.error('Personality page query failed; responding 503 so ISR keeps its last good copy', {
		slug,
		query,
		code: cause.code,
		message: cause.message
	});
	throw error(503, 'This page is temporarily unavailable');
}

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

	// `person` is not unique in the table, and maybeSingle() errors on two rows,
	// so take the published row deterministically: the only error left is a real
	// query failure, never a data duplicate.
	const { data: personDataRaw, error: personError } = await supabase
		.from('blogs_famous_people')
		.select(
			'id, author, birth_date, birth_place, category, changefreq, chorus_question, chorus_question_url, citations, content, content_quality, created_at, date, description, enneagram, faqs, first_published_at, imdb_id, instagram, keywords, knows_about, lastmod, loc, meta_title, nationality, occupation, person, persona_title, priority, published, published_at, same_as, suggestions, tags, tiktok, title, twitter, type, wikidata_qid, wikipedia'
		)
		.eq('person', canonicalSlugParam)
		.order('published', { ascending: false, nullsFirst: false })
		.order('id', { ascending: true })
		.limit(1)
		.maybeSingle();

	if (personError) {
		throwTemporarilyUnavailable(requestedSlug, 'person', personError);
	}

	const personRow = personDataRaw as FamousPersonRow | null;

	if (!personRow) {
		throw error(404, `Person not found: ${requestedSlug}`);
	}

	// content_quality is the pipeline's internal record (grades, gate results).
	// The page needs one fact from it, so derive that here and keep the rest
	// out of the shared payload.
	const { content_quality: contentQuality, ...personData } = personRow;
	const isOpenCase = isOpenCaseProfile(contentQuality);

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
			resolvePublicChorusQuestion(supabase, personRow, canonicalSlug)
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
			...personData,
			// The person's own question, only while it is public. What the page
			// actually renders (own or proven fallback) is `chorus` below.
			chorus_question: publicChorus.own.question,
			chorus_question_url: publicChorus.own.questionUrl,
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
		// Thin-record profile: leading read, live alternatives, what would settle
		// it. Drives the header marker and the closing format note.
		isOpenCase,
		// Visitor-independent (same question for everyone), so it is safe in the
		// ISR copy. Impressions and answers happen in the browser.
		chorus: publicChorus.chorus,
		placeholders,
		headings,
		bridgeLinks,
		suggestedPeople,
		relatedPosts
	};
};

/**
 * The give-first question for this page: the person's own chorus question while
 * it is public and answerable, otherwise a proven live question
 * ($lib/server/provenChorusQuestions). Hidden questions stay hidden; this never
 * unflags anything, it only picks something else to show.
 *
 * Every lookup failure answers 503 rather than rendering without the prompt:
 * ISR would otherwise cache the page minus its answer-first entry point (or
 * with a different question) for a whole day.
 */
async function resolvePublicChorusQuestion(
	supabase: ServerSupabaseClient,
	person: FamousPersonRow,
	pageSlug: string
): Promise<{ own: PublicChorusQuestion; chorus: PageChorus | null }> {
	const own = await resolveOwnChorusQuestion(supabase, person);

	if (own.question && own.questionUrl) {
		// /api/nine/mirror answers the person's chorus from nine_takes keyed by
		// the page slug; without those takes the answer could not be posted.
		const ready = await findReadyChoruses('personality-analysis', [pageSlug], pageSlug);
		if (ready.has(pageSlug)) {
			return {
				own,
				chorus: {
					question: own.question,
					questionUrl: own.questionUrl,
					subjectType: 'personality-analysis',
					source: 'person'
				}
			};
		}
	}

	return { own, chorus: await resolveProvenChorusQuestion(supabase, pageSlug) };
}

async function resolveOwnChorusQuestion(
	supabase: ServerSupabaseClient,
	person: FamousPersonRow
): Promise<PublicChorusQuestion> {
	const questionUrl = person.chorus_question_url?.trim();
	if (!questionUrl) return { question: null, questionUrl: null };

	const { data: question, error: questionError } = await supabase
		.from('questions')
		.select('question, question_formatted, flagged, removed, data')
		.eq('url', questionUrl)
		// `url` is not unique either; a duplicate must not read as a query failure.
		.order('id', { ascending: true })
		.limit(1)
		.maybeSingle();

	// A failed lookup is not "no question": rendering without the chorus prompt
	// would cache the page minus its answer-first entry point for a whole day.
	if (questionError) {
		throwTemporarilyUnavailable(person.person ?? questionUrl, 'chorus question', questionError);
	}

	const publicQuestion = publicQuestionText(question);
	return publicQuestion
		? { question: publicQuestion, questionUrl }
		: { question: null, questionUrl: null };
}

/**
 * First proven question, in this page's stable per-person order, that is still
 * public and still answerable right now. Checked on every render, so a question
 * that gets flagged, removed, or loses its takes drops out at the next
 * revalidation instead of being served from a hard-coded list.
 */
async function resolveProvenChorusQuestion(
	supabase: ServerSupabaseClient,
	pageSlug: string
): Promise<PageChorus | null> {
	const { data: rows, error: poolError } = await supabase
		.from('questions')
		.select('id, url, question, question_formatted, flagged, removed, data')
		.in('url', [...PROVEN_CHORUS_QUESTION_URLS])
		.order('id', { ascending: true });

	if (poolError) {
		throwTemporarilyUnavailable(pageSlug, 'proven chorus questions', poolError);
	}

	// Lowest id wins for a duplicated url, matching the own-question lookup.
	const publicText = new Map<string, string>();
	const seen = new Set<string>();
	for (const row of (rows ?? []) as ChorusQuestionRow[]) {
		const url = row.url?.trim();
		if (!url || seen.has(url)) continue;
		seen.add(url);
		const text = publicQuestionText(row);
		if (text) publicText.set(url, text);
	}
	if (publicText.size === 0) return null;

	const ready = await findReadyChoruses('question', [...publicText.keys()], pageSlug);

	for (const questionUrl of orderProvenChorusCandidates(pageSlug)) {
		const question = publicText.get(questionUrl);
		if (question && ready.has(questionUrl)) {
			return { question, questionUrl, subjectType: 'question', source: 'proven' };
		}
	}
	return null;
}

function publicQuestionText(question: ChorusQuestionRow | null | undefined): string | null {
	if (!question || !isQuestionPubliclyEligible(question)) return null;
	return (question.question_formatted || question.question || '').trim() || null;
}

/**
 * Subject slugs that have the complete nine-take chorus /api/nine/mirror needs
 * before it will accept an answer. nine_takes has no public RLS policy, so this
 * read uses the service-role client; it returns only slugs, never takes.
 */
async function findReadyChoruses(
	subjectType: PageChorus['subjectType'],
	subjectSlugs: string[],
	pageSlug: string
): Promise<Set<string>> {
	if (subjectSlugs.length === 0) return new Set();

	const { data, error: readinessError } = await getSupabaseAdminClient()
		.from('nine_takes')
		.select('subject_slug, takes')
		.eq('subject_type', subjectType)
		.in('subject_slug', subjectSlugs);

	if (readinessError) {
		throwTemporarilyUnavailable(pageSlug, 'chorus readiness', readinessError);
	}

	return new Set(
		((data ?? []) as Array<{ subject_slug: string; takes: Json }>)
			.filter((row) => Array.isArray(row.takes) && row.takes.length === 9)
			.map((row) => row.subject_slug)
	);
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

/**
 * The people pipeline marks thin-record profiles (young, early-career subjects)
 * with `content_quality.profile_format = 'open_case'`. Standard profiles carry
 * no `profile_format` key at all.
 */
function isOpenCaseProfile(contentQuality: FamousPersonRow['content_quality']): boolean {
	if (!contentQuality || typeof contentQuality !== 'object' || Array.isArray(contentQuality)) {
		return false;
	}
	return contentQuality.profile_format === 'open_case';
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

function parseEnneagramNumber(value: unknown): number | null {
	if (typeof value === 'number' && Number.isFinite(value)) return value;
	if (typeof value === 'string' && value.trim() !== '') {
		const parsed = Number.parseInt(value, 10);
		return Number.isFinite(parsed) ? parsed : null;
	}
	return null;
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
