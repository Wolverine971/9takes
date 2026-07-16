// src/routes/enneagram-corner/[slug]/+page.server.ts

import { dev } from '$app/environment';
import { slugFromPath } from '$lib/slugFromPath';
import matter from 'gray-matter';

import { recordStrategicQuestionImpression } from '$lib/server/giveFirstFunnel';
import {
	logBestEffortTelemetryFailure,
	runBestEffortTelemetry
} from '$lib/server/bestEffortTelemetry';

import type { PageServerLoad } from './$types';

const MAX_POSTS = 6;
const RAW_ENNEAGRAM_MODULES = import.meta.glob(
	[
		`/src/blog/enneagram/**/*.{md,svx,svelte.md}`,
		'!**/drafts/**',
		'!**/*.instagram.md',
		'!**/*.twitter.md',
		'!**/*.reddit.md',
		'!**/*.review.md',
		'!**/blog-optimization-strategies.md'
	],
	{
		query: '?raw',
		import: 'default'
	}
);

let cachedPosts: App.BlogPost[] | null = null;
let cachedPostsPromise: Promise<App.BlogPost[]> | null = null;

const getPrimaryType = (value: unknown): string | undefined => {
	if (Array.isArray(value)) {
		return typeof value[0] === 'string' ? value[0] : undefined;
	}
	return typeof value === 'string' ? value : undefined;
};

const loadPostsFromModules = async (): Promise<App.BlogPost[]> => {
	if (cachedPosts) {
		return cachedPosts;
	}

	if (!cachedPostsPromise) {
		cachedPostsPromise = Promise.all(
			Object.entries(RAW_ENNEAGRAM_MODULES).map(async ([path, resolver]) => {
				const raw = (await resolver()) as string;
				const { data: metadata } = matter(raw);
				const slug = slugFromPath(path);

				if (!slug) {
					return null;
				}

				return {
					...(metadata as App.BlogPost),
					slug
				};
			})
		).then((posts) => posts.filter(Boolean) as App.BlogPost[]);
	}

	cachedPosts = await cachedPostsPromise;
	return cachedPosts;
};

const loadPostsFromFs = async (): Promise<App.BlogPost[]> => {
	const { default: fastGlob } = await import('fast-glob');
	const { readFile } = await import('node:fs/promises');

	const cwd = process.cwd();
	const files = await fastGlob(
		[
			'src/blog/enneagram/**/*.{md,svx,svelte.md}',
			'!**/drafts/**',
			'!**/*.instagram.md',
			'!**/*.twitter.md',
			'!**/*.reddit.md',
			'!**/*.review.md',
			'!**/blog-optimization-strategies.md'
		],
		{
			cwd,
			absolute: true
		}
	);

	const posts = await Promise.all(
		files.map(async (file) => {
			const raw = await readFile(file, 'utf8');
			const { data: metadata } = matter(raw);
			const relativePath = file.startsWith(cwd) ? file.slice(cwd.length) : file;
			const normalizedPath = relativePath.replace(/\\/g, '/');
			const slug = slugFromPath(normalizedPath);

			if (!slug) {
				return null;
			}

			return {
				...(metadata as App.BlogPost),
				slug
			};
		})
	);

	return posts.filter(Boolean) as App.BlogPost[];
};

const loadPosts = async (): Promise<App.BlogPost[]> => {
	if (dev) {
		return loadPostsFromFs();
	}

	return loadPostsFromModules();
};

export const load: PageServerLoad = async (event) => {
	const { params } = event;
	const posts = await loadPosts();

	const currentPost = posts.find((post) => post.slug === params.slug);
	const currentType = getPrimaryType(currentPost?.type);

	// Strategic-question widget impression (T-12): when this page embeds the
	// widget (frontmatter strategic_question_url), record a gate_shown funnel
	// event keyed by fingerprint, attributed to this blog via path. Best-effort;
	// the funnel table dedupes to one row per visitor per question.
	const strategicQuestionUrl = (currentPost as { strategic_question_url?: unknown } | undefined)
		?.strategic_question_url;
	if (typeof strategicQuestionUrl === 'string' && strategicQuestionUrl) {
		const fingerprint = event.cookies.get('9tfingerprint');
		if (fingerprint) {
			runBestEffortTelemetry(
				event,
				recordStrategicQuestionImpression({
					questionUrl: strategicQuestionUrl,
					fingerprint,
					path: event.url.pathname,
					userId: event.locals.session?.user?.id ?? null
				}),
				(telemetryError) => {
					logBestEffortTelemetryFailure(
						'Failed to record strategic question impression',
						telemetryError,
						{ questionUrl: strategicQuestionUrl, slug: params.slug }
					);
				}
			);
		}
	}

	const publishedPosts = posts
		.filter((post) => post.published)
		.filter((post) => post.blog)
		.filter((post) => getPrimaryType(post?.type) === currentType)
		.filter((post) => params.slug !== post.slug)
		.sort(() => 0.5 - Math.random())
		.slice(0, MAX_POSTS);

	return {
		posts: publishedPosts
	};
};
