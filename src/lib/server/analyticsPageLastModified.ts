// src/lib/server/analyticsPageLastModified.ts
import matter from 'gray-matter';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../../database.types';
import { classifyPath, normalizePath } from '$lib/analytics/pageAnalytics';
import { getPersonalityCategoryBySlug } from '$lib/personalityCategories';
import { buildQuestionCategoryPath } from '$lib/utils/questionCategorySlug';
import {
	getLatestCategoryDate,
	mapPersonalityCategoryRows,
	type PersonalityCategoryRow
} from '$lib/server/personalityCategoryData';
import { slugFromPath } from '$lib/slugFromPath';

type RawMarkdownResolver = () => Promise<unknown>;
type AppSupabaseClient = SupabaseClient<Database>;

/** The frontmatter fields the last-modified index reads. */
export interface BlogLastModifiedFrontmatter {
	published?: unknown;
	lastmod?: unknown;
	date?: unknown;
	loc?: unknown;
}

const ENNEAGRAM_SUBTOPIC_LASTMOD: Record<string, string> = {
	'/enneagram-corner/subtopic/overview': '2025-08-15',
	'/enneagram-corner/subtopic/nine-types': '2025-08-15',
	'/enneagram-corner/subtopic/development': '2025-08-15',
	'/enneagram-corner/subtopic/relationships': '2025-08-15',
	'/enneagram-corner/subtopic/workplace': '2025-08-15',
	'/enneagram-corner/subtopic/resources': '2025-08-15',
	'/enneagram-corner/subtopic/situational': '2025-08-15'
};

let staticContentLastModifiedIndexPromise: Promise<Map<string, string>> | null = null;

function toTimestamp(value: string | null | undefined): number {
	if (!value) return 0;
	const timestamp = new Date(value).getTime();
	return Number.isFinite(timestamp) ? timestamp : 0;
}

function pickLastModified(value: unknown, fallback?: unknown) {
	const primary = typeof value === 'string' && value.trim() ? value.trim() : null;
	if (primary) return primary;
	return typeof fallback === 'string' && fallback.trim() ? fallback.trim() : null;
}

function setIfNewer(
	map: Map<string, string>,
	path: string,
	value: string | null | undefined
): void {
	const normalizedPath = normalizePath(path);
	const nextValue = pickLastModified(value);
	if (!nextValue) return;

	const existingValue = map.get(normalizedPath);
	if (!existingValue || toTimestamp(nextValue) >= toTimestamp(existingValue)) {
		map.set(normalizedPath, nextValue);
	}
}

function updateLatest(current: string | null, candidate: string | null | undefined): string | null {
	const nextValue = pickLastModified(candidate);
	if (!nextValue) return current;
	if (!current || toTimestamp(nextValue) >= toTimestamp(current)) {
		return nextValue;
	}
	return current;
}

function toPublicPath(loc: unknown): string | null {
	if (typeof loc !== 'string' || !loc.trim()) return null;

	try {
		return normalizePath(new URL(loc).pathname);
	} catch {
		return loc.startsWith('/') ? normalizePath(loc) : null;
	}
}

function getFallbackBlogPath(path: string, prefix: string): string {
	return normalizePath(`${prefix}/${slugFromPath(path)}`);
}

/**
 * Read the fields the index needs from a raw Markdown file. MDsvex parses frontmatter with
 * the same js-yaml schema as gray-matter and JSON-serializes it into `metadata`, so the JSON
 * round trip turns an unquoted YAML date into the same ISO string the compiled module exposed.
 */
export function readBlogLastModifiedFrontmatter(raw: unknown): BlogLastModifiedFrontmatter | null {
	if (typeof raw !== 'string') return null;

	try {
		// Passing options skips gray-matter's process-wide cache, which would otherwise keep
		// every file's full text alive after the index is built.
		const { data } = matter(raw, {});
		const { published, lastmod, date, loc } = data as BlogLastModifiedFrontmatter;
		return JSON.parse(JSON.stringify({ published, lastmod, date, loc }));
	} catch (err) {
		console.error('Failed to parse blog frontmatter for analytics last-modified:', err);
		return null;
	}
}

async function indexBlogModules(
	index: Map<string, string>,
	modules: Record<string, RawMarkdownResolver>,
	options: {
		rootPath: string;
		fallbackPrefix: string;
	}
): Promise<string | null> {
	let latest: string | null = null;

	// Load and parse every file concurrently. This used to import each compiled MDsvex
	// component one at a time, so the first request on a cold instance paid for every post.
	const entries = await Promise.all(
		Object.entries(modules).map(async ([path, resolver]) => ({
			path,
			frontmatter: readBlogLastModifiedFrontmatter(await resolver())
		}))
	);

	for (const { path, frontmatter } of entries) {
		if (!frontmatter?.published) continue;

		const lastModified = pickLastModified(frontmatter.lastmod, frontmatter.date);
		if (!lastModified) continue;

		const publicPath =
			toPublicPath(frontmatter.loc) ?? getFallbackBlogPath(path, options.fallbackPrefix);
		setIfNewer(index, publicPath, lastModified);
		latest = updateLatest(latest, lastModified);
	}

	if (latest) {
		setIfNewer(index, options.rootPath, latest);
	}

	return latest;
}

async function buildStaticContentLastModifiedIndex(): Promise<Map<string, string>> {
	const index = new Map<string, string>();

	// Raw text, not compiled components: only frontmatter is needed here.
	const communityModules = import.meta.glob<string>(
		['/src/blog/community/*.{md,svx,svelte.md}', '!**/societal-ticking-time-bombs-fact-check.md'],
		{ query: '?raw', import: 'default' }
	);
	const guidesModules = import.meta.glob<string>(
		['/src/blog/guides/*.{md,svx,svelte.md}', '!**/personality-maxing-notes.md'],
		{ query: '?raw', import: 'default' }
	);
	const popCultureModules = import.meta.glob<string>(
		[
			'/src/blog/pop-culture/*.{md,svx,svelte.md}',
			'!**/*-twitter.md',
			'!**/incel-exit-post.md',
			'!**/template.md'
		],
		{ query: '?raw', import: 'default' }
	);
	const enneagramModules = import.meta.glob<string>(
		[
			'/src/blog/enneagram/**/*.{md,svx,svelte.md}',
			'!**/drafts/**',
			'!**/*.instagram.md',
			'!**/*.twitter.md',
			'!**/*.reddit.md',
			'!**/*.review.md',
			'!**/blog-optimization-strategies.md'
		],
		{ query: '?raw', import: 'default' }
	);

	const [communityLatest, guidesLatest, popCultureLatest, enneagramLatest] = await Promise.all([
		indexBlogModules(index, communityModules, {
			rootPath: '/community',
			fallbackPrefix: '/community'
		}),
		indexBlogModules(index, guidesModules, {
			rootPath: '/how-to-guides',
			fallbackPrefix: '/how-to-guides'
		}),
		indexBlogModules(index, popCultureModules, {
			rootPath: '/pop-culture',
			fallbackPrefix: '/pop-culture'
		}),
		indexBlogModules(index, enneagramModules, {
			rootPath: '/enneagram-corner',
			fallbackPrefix: '/enneagram-corner'
		})
	]);

	for (const [path, value] of Object.entries(ENNEAGRAM_SUBTOPIC_LASTMOD)) {
		setIfNewer(index, path, value);
	}

	const blogLatest = [communityLatest, guidesLatest, popCultureLatest, enneagramLatest].reduce<
		string | null
	>((current, candidate) => updateLatest(current, candidate), null);
	if (blogLatest) {
		setIfNewer(index, '/blog', blogLatest);
	}

	return index;
}

async function getStaticContentLastModifiedIndex(): Promise<Map<string, string>> {
	if (!staticContentLastModifiedIndexPromise) {
		staticContentLastModifiedIndexPromise = buildStaticContentLastModifiedIndex().catch((err) => {
			// Don't memoize a failure for the life of the instance.
			staticContentLastModifiedIndexPromise = null;
			throw err;
		});
	}
	return staticContentLastModifiedIndexPromise;
}

/**
 * Start building the blog last-modified index without waiting for it, so a caller can
 * overlap the build with its own database round trip.
 */
export function primeAnalyticsLastModifiedIndex(): void {
	getStaticContentLastModifiedIndex().catch(() => {
		// The awaiting caller reports the failure.
	});
}

async function resolvePeopleLastModified(
	supabase: AppSupabaseClient,
	paths: Set<string>,
	resolved: Map<string, string | null>
): Promise<void> {
	const relevantPaths = [...paths].filter(
		(path) => classifyPath(path, null).contentType === 'people'
	);
	if (relevantPaths.length === 0) return;

	const { data, error } = await supabase
		.from('blogs_famous_people')
		.select(
			'person, enneagram, title, description, persona_title, lastmod, date, type, content_quality'
		)
		.eq('published', true);

	if (error) {
		console.error('Failed to resolve people last-modified metadata:', error);
		return;
	}

	const people = mapPersonalityCategoryRows((data ?? []) as PersonalityCategoryRow[]);
	const latestPeopleUpdate = getLatestCategoryDate(people);

	if (latestPeopleUpdate && paths.has('/personality-analysis')) {
		resolved.set('/personality-analysis', latestPeopleUpdate);
	}

	if (latestPeopleUpdate && paths.has('/personality-analysis/categories')) {
		resolved.set('/personality-analysis/categories', latestPeopleUpdate);
	}

	for (const person of people) {
		const personLastModified = pickLastModified(person.lastmod, person.date);
		if (!personLastModified) continue;

		const personPath = normalizePath(`/personality-analysis/${person.slug}`);
		if (paths.has(personPath)) {
			resolved.set(personPath, personLastModified);
		}

		if (person.enneagram) {
			const typePath = normalizePath(`/personality-analysis/type/${person.enneagram}`);
			const existingValue = resolved.get(typePath);
			if (
				paths.has(typePath) &&
				(!existingValue || toTimestamp(personLastModified) >= toTimestamp(existingValue))
			) {
				resolved.set(typePath, personLastModified);
			}
		}
	}

	for (const path of relevantPaths) {
		if (!path.startsWith('/personality-analysis/categories/')) continue;

		const slug = path.split('/')[3] ?? '';
		const category = getPersonalityCategoryBySlug(slug);
		if (!category) continue;

		const latestCategoryUpdate = getLatestCategoryDate(
			people.filter((person) => person.categorySlugs.includes(category.slug))
		);
		if (latestCategoryUpdate) {
			resolved.set(path, latestCategoryUpdate);
		}
	}
}

async function resolveQuestionLastModified(
	supabase: AppSupabaseClient,
	paths: Set<string>,
	resolved: Map<string, string | null>
): Promise<void> {
	const relevantPaths = [...paths].filter(
		(path) => classifyPath(path, null).contentType === 'question'
	);
	if (relevantPaths.length === 0) return;

	const questionDetailPaths = relevantPaths.filter((path) => {
		const pathGroup = classifyPath(path, null).pathGroup;
		return pathGroup === '/questions/[slug]';
	});
	const needsQuestionRoot = paths.has('/questions');
	const needsQuestionCategories = relevantPaths.some((path) =>
		path.startsWith('/questions/categories')
	);

	const questionDetailPromise =
		questionDetailPaths.length > 0
			? supabase
					.from('questions')
					.select('url, updated_at, created_at')
					.eq('removed', false)
					.eq('flagged', false)
					.eq('tagged', true)
					.in('url', questionDetailPaths)
			: Promise.resolve({ data: null, error: null });

	const questionLatestPromise = needsQuestionRoot
		? supabase
				.from('questions')
				.select('updated_at, created_at')
				.eq('removed', false)
				.eq('flagged', false)
				.eq('tagged', true)
				.order('updated_at', { ascending: false, nullsFirst: false })
				.limit(1)
		: Promise.resolve({ data: null, error: null });

	const questionCategoriesPromise = needsQuestionCategories
		? supabase.from('question_categories').select('category_name, slug, intro_updated_at')
		: Promise.resolve({ data: null, error: null });

	const [questionDetailResult, questionLatestResult, questionCategoriesResult] = await Promise.all([
		questionDetailPromise,
		questionLatestPromise,
		questionCategoriesPromise
	]);

	if (questionDetailResult.error) {
		console.error(
			'Failed to resolve question detail last-modified metadata:',
			questionDetailResult.error
		);
	} else {
		for (const row of questionDetailResult.data ?? []) {
			const lastModified = pickLastModified(row.updated_at, row.created_at);
			if (row.url && lastModified) {
				resolved.set(normalizePath(row.url), lastModified);
			}
		}
	}

	if (questionLatestResult.error) {
		console.error(
			'Failed to resolve question index last-modified metadata:',
			questionLatestResult.error
		);
	} else if (needsQuestionRoot) {
		const latestQuestion = (questionLatestResult.data ?? [])[0];
		const lastModified = pickLastModified(latestQuestion?.updated_at, latestQuestion?.created_at);
		if (lastModified) {
			resolved.set('/questions', lastModified);
		}
	}

	if (questionCategoriesResult.error) {
		console.error(
			'Failed to resolve question category last-modified metadata:',
			questionCategoriesResult.error
		);
		return;
	}

	let latestCategoryUpdate: string | null = null;
	for (const row of questionCategoriesResult.data ?? []) {
		const lastModified = pickLastModified(row.intro_updated_at);
		if (!lastModified || !row.category_name) continue;

		const categoryPath = normalizePath(buildQuestionCategoryPath(row.slug || row.category_name));
		if (paths.has(categoryPath)) {
			resolved.set(categoryPath, lastModified);
		}

		latestCategoryUpdate = updateLatest(latestCategoryUpdate, lastModified);
	}

	if (latestCategoryUpdate && paths.has('/questions/categories')) {
		resolved.set('/questions/categories', latestCategoryUpdate);
	}
}

export async function resolveAnalyticsPathsLastModified(
	supabase: AppSupabaseClient,
	paths: string[]
): Promise<Map<string, string | null>> {
	const normalizedPaths = [...new Set(paths.map((path) => normalizePath(path)))];
	const pathSet = new Set(normalizedPaths);
	const resolved = new Map<string, string | null>();

	const staticIndex = await getStaticContentLastModifiedIndex();
	for (const path of normalizedPaths) {
		const lastModified = staticIndex.get(path);
		if (lastModified) {
			resolved.set(path, lastModified);
		}
	}

	await Promise.all([
		resolvePeopleLastModified(supabase, pathSet, resolved),
		resolveQuestionLastModified(supabase, pathSet, resolved)
	]);

	for (const path of normalizedPaths) {
		if (!resolved.has(path)) {
			resolved.set(path, null);
		}
	}

	return resolved;
}

export async function attachAnalyticsLastModified<T extends { path: string }>(
	supabase: AppSupabaseClient,
	rows: T[]
): Promise<Array<T & { last_modified_at: string | null }>> {
	if (rows.length === 0) return [];

	const lastModifiedByPath = await resolveAnalyticsPathsLastModified(
		supabase,
		rows.map((row) => row.path)
	);

	return rows.map((row) => ({
		...row,
		last_modified_at: lastModifiedByPath.get(normalizePath(row.path)) ?? null
	}));
}
