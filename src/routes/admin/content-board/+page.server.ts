// src/routes/admin/content-board/+page.server.ts
import { error, redirect } from '@sveltejs/kit';
import { slugFromPath } from '$lib/slugFromPath';
import { guardAdminActions } from '$lib/server/adminAuth';
import matter from 'gray-matter';
import { loadRouteDemoTime } from '$lib/server/demoTime';

import type { Actions, PageServerLoad } from './$types';

type ContentEntry = {
	loc: string | null;
	stageName: string | null;
};
type ContentType = 'enneagram' | 'community' | 'guides' | 'people';
type ContentTable = 'content_enneagram' | 'content_community' | 'content_guides' | 'content_people';

// Lazy raw globs: the server entry no longer inlines every Markdown file, and
// each file is read once per server instance (content only changes on deploy).
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
const RAW_COMMUNITY_MODULES = import.meta.glob(
	[`/src/blog/community/*.{md,svx,svelte.md}`, '!**/societal-ticking-time-bombs-fact-check.md'],
	{
		query: '?raw',
		import: 'default'
	}
);
const RAW_GUIDES_MODULES = import.meta.glob(
	[`/src/blog/guides/*.{md,svx,svelte.md}`, '!**/personality-maxing-notes.md'],
	{
		query: '?raw',
		import: 'default'
	}
);

type MarkdownIndex = {
	enneagram: App.BlogPost[];
	community: App.BlogPost[];
	guides: App.BlogPost[];
};

let markdownIndexPromise: Promise<MarkdownIndex> | null = null;

function parseMarkdownModules(
	modules: Record<string, () => Promise<unknown>>
): Promise<App.BlogPost[]> {
	return Promise.all(
		Object.entries(modules).map(async ([path, resolver]) => {
			const { data: metadata } = matter((await resolver()) as string);
			return {
				...(metadata as App.BlogPost),
				slug: slugFromPath(path)
			};
		})
	);
}

/** Frontmatter for every local post, parsed once per server instance. */
function loadMarkdownIndex(): Promise<MarkdownIndex> {
	if (!markdownIndexPromise) {
		markdownIndexPromise = Promise.all([
			parseMarkdownModules(RAW_ENNEAGRAM_MODULES),
			parseMarkdownModules(RAW_COMMUNITY_MODULES),
			parseMarkdownModules(RAW_GUIDES_MODULES)
		]).then(
			([enneagram, community, guides]) => ({ enneagram, community, guides }),
			(err) => {
				// Retry on the next request rather than caching the failure.
				markdownIndexPromise = null;
				throw err;
			}
		);
	}
	return markdownIndexPromise;
}

export const load: PageServerLoad = async (
	event
): Promise<{
	people: App.BlogPost[];
	enneagram: App.BlogPost[];
	community: App.BlogPost[];
	guides: App.BlogPost[];
}> => {
	const session = event.locals.session;
	const supabase = event.locals.supabase;

	if (!session?.user?.id) {
		throw redirect(302, '/questions');
	}
	// Same cached switch the admin layout reads, so the guard, the admin check,
	// and the content reads below can all start together.
	const demo_time = await loadRouteDemoTime(supabase);

	// The layout guard (parent) is the only rejection here, so a non-admin still
	// gets its redirect and every read below is discarded.
	const [
		,
		{ data: user, error: findUserError },
		markdownResult,
		enneagramContent,
		communityContent,
		guidesContent,
		peopleContent,
		peopleBlogPosts
	] = await Promise.all([
		event.parent(),
		supabase
			.from(demo_time === true ? 'profiles_demo' : 'profiles')
			.select('id, admin, external_id')
			.eq('id', session?.user?.id)
			.single(),
		// A parse failure surfaces after the admin checks, as it did before.
		loadMarkdownIndex().then(
			(index) => ({ index, failure: null }),
			(failure: unknown) => ({ index: null, failure })
		),
		supabase.from(`content_enneagram`).select('loc, stageName'),
		supabase.from(`content_community`).select('loc, stageName'),
		supabase.from(`content_guides`).select('loc, stageName'),
		supabase.from(`content_people`).select('loc, stageName'),
		supabase
			.from('blogs_famous_people')
			.select(
				'id, person, title, description, author, date, loc, lastmod, published, type, enneagram, category, twitter, instagram, tiktok'
			)
	]);

	if (findUserError) {
		console.log(findUserError);
		throw redirect(307, '/questions');
	}

	if (!user?.admin) {
		throw redirect(307, '/questions');
	}

	if (!markdownResult.index) throw markdownResult.failure;
	const {
		enneagram: enneagramBlogPosts,
		community: communityBlogPosts,
		guides: guidesBlogPosts
	} = markdownResult.index;

	// Handle errors
	if (enneagramContent.error) console.log(enneagramContent.error);
	if (communityContent.error) console.log(communityContent.error);
	if (guidesContent.error) console.log(guidesContent.error);
	if (peopleContent.error) console.log(peopleContent.error);
	if (peopleBlogPosts.error) console.log(peopleBlogPosts.error);

	// Create maps using reduce for better performance
	const enneagramMap = ((enneagramContent.data || []) as ContentEntry[]).reduce(
		(acc: Record<string, ContentEntry>, content) => {
			if (content.loc) {
				acc[content.loc] = content;
			}
			return acc;
		},
		{}
	);

	const communityMap = ((communityContent.data || []) as ContentEntry[]).reduce(
		(acc: Record<string, ContentEntry>, content) => {
			if (content.loc) {
				acc[content.loc] = content;
			}
			return acc;
		},
		{}
	);

	const guidesMap = ((guidesContent.data || []) as ContentEntry[]).reduce(
		(acc: Record<string, ContentEntry>, content) => {
			if (content.loc) {
				acc[content.loc] = content;
			}
			return acc;
		},
		{}
	);

	const peopleMap = ((peopleContent.data || []) as ContentEntry[]).reduce(
		(acc: Record<string, ContentEntry>, content) => {
			if (content.loc) {
				acc[content.loc] = content;
			}
			return acc;
		},
		{}
	);

	// Map posts with stage names
	const enneagramPosts = enneagramBlogPosts.map((post) => {
		const content = enneagramMap[post.loc];
		return {
			...post,
			stageName: content?.stageName ?? undefined
		};
	});

	const communityPosts = communityBlogPosts.map((post) => {
		const content = communityMap[post.loc];
		return {
			...post,
			stageName: content?.stageName ?? undefined
		};
	});

	const guidesPosts = guidesBlogPosts.map((post) => {
		const content = guidesMap[post.loc];
		return {
			...post,
			stageName: content?.stageName ?? undefined
		};
	});

	const peoplePosts = (peopleBlogPosts.data || []).map((post) => {
		const content = post.loc ? peopleMap[post.loc] : undefined;
		return {
			...post,
			slug: post.person, // Add slug field like in personality-analysis
			stageName: content?.stageName ?? undefined
		};
	});

	return {
		people: peoplePosts as unknown as App.BlogPost[],
		enneagram: enneagramPosts,
		community: communityPosts,
		guides: guidesPosts
	};
};

export const actions: Actions = guardAdminActions({
	updateStage: async ({ request, locals }) => {
		try {
			const supabase = locals.supabase;
			const body = Object.fromEntries(await request.formData());

			const contentType = String(body.content_type ?? '') as ContentType;
			if (!['enneagram', 'community', 'guides', 'people'].includes(contentType)) {
				throw error(400, 'Invalid content type');
			}
			const contentTable = `content_${contentType}` as ContentTable;
			const contentClient = (supabase as any).from(contentTable);

			const title = body.title as string;
			const description = body.description as string;
			const author = body.author as string;
			const date = body.date ? String(body.date) : null;
			const loc = body.loc as string;
			const lastmod = body.lastmod as string;
			const published = String(body.published ?? 'false') === 'true';
			const type = body.type as string;
			const stageName = body.stageName as string;

			const { data: existingRecord, error: existingRecordError } = await contentClient
				.select('id')
				.eq('loc', loc);

			if (existingRecordError) {
				console.log(existingRecordError);
			}

			if (existingRecord?.length) {
				const { data: record, error: recordError } = await contentClient
					.update({
						title,
						description,
						author,
						date,
						loc,
						lastmod,
						published,
						type,
						stageName
					})
					.eq('loc', loc)
					.select('id, title, description, author, date, loc, lastmod, published, type, stageName');
				if (recordError) {
					console.log(recordError);
				}

				return record;
			} else {
				const { data: record, error: recordError } = await contentClient
					.insert({
						title,
						description,
						author,
						date,
						loc,
						lastmod,
						published,
						type,
						stageName
					})
					.select('id, title, description, author, date, loc, lastmod, published, type, stageName');
				if (recordError) {
					console.log(recordError);
				}

				return record;
			}
		} catch (e) {
			throw error(400, {
				message: `error staging content ${JSON.stringify(e)}`
			});
		}
	}
});
