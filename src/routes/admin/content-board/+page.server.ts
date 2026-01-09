// src/routes/admin/content-board/+page.server.ts
import { error, redirect } from '@sveltejs/kit';
import { slugFromPath } from '$lib/slugFromPath';
import matter from 'gray-matter';

import type { Actions } from '@sveltejs/kit';

export const load = async (
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
	const { demo_time } = await event.parent();
	const { data: user, error: findUserError } = await supabase
		.from(demo_time === true ? 'profiles_demo' : 'profiles')
		.select('id, admin, external_id')
		.eq('id', session?.user?.id)
		.single();

	if (findUserError) {
		console.log(findUserError);
		throw redirect(307, '/questions');
	}

	if (!user?.admin) {
		throw redirect(307, '/questions');
	}

	const enneagramModules = import.meta.glob(`/src/blog/enneagram/**/*.{md,svx,svelte.md}`, {
		as: 'raw',
		eager: true
	});

	const enneagramBlogPosts = Object.entries(enneagramModules).map(([path, raw]) => {
		const { data: metadata } = matter(raw as string);
		return {
			...(metadata as App.BlogPost),
			slug: slugFromPath(path)
		};
	});

	const communityModules = import.meta.glob(`/src/blog/community/*.{md,svx,svelte.md}`, {
		as: 'raw',
		eager: true
	});
	const communityBlogPosts = Object.entries(communityModules).map(([path, raw]) => {
		const { data: metadata } = matter(raw as string);
		return {
			...(metadata as App.BlogPost),
			slug: slugFromPath(path)
		};
	});

	const guidesModules = import.meta.glob(`/src/blog/guides/*.{md,svx,svelte.md}`, {
		as: 'raw',
		eager: true
	});
	const guidesBlogPosts = Object.entries(guidesModules).map(([path, raw]) => {
		const { data: metadata } = matter(raw as string);
		return {
			...(metadata as App.BlogPost),
			slug: slugFromPath(path)
		};
	});

	// Execute all promises in parallel
	const [
		enneagramContent,
		communityContent,
		guidesContent,
		peopleContent,
		peopleBlogPosts
	] = await Promise.all([
		supabase.from(`content_enneagram`).select('*'),
		supabase.from(`content_community`).select('*'),
		supabase.from(`content_guides`).select('*'),
		supabase.from(`content_people`).select('*'),
		supabase.from('blogs_famous_people').select('*')
	]);

	// Handle errors
	if (enneagramContent.error) console.log(enneagramContent.error);
	if (communityContent.error) console.log(communityContent.error);
	if (guidesContent.error) console.log(guidesContent.error);
	if (peopleContent.error) console.log(peopleContent.error);
	if (peopleBlogPosts.error) console.log(peopleBlogPosts.error);

	// Create maps using reduce for better performance
	const enneagramMap = (enneagramContent.data || []).reduce((acc, content) => {
		acc[content.loc] = content;
		return acc;
	}, {});

	const communityMap = (communityContent.data || []).reduce((acc, content) => {
		acc[content.loc] = content;
		return acc;
	}, {});

	const guidesMap = (guidesContent.data || []).reduce((acc, content) => {
		acc[content.loc] = content;
		return acc;
	}, {});

	const peopleMap = (peopleContent.data || []).reduce((acc, content) => {
		acc[content.loc] = content;
		return acc;
	}, {});

	// Map posts with stage names
	const enneagramPosts = enneagramBlogPosts.map((post) => {
		const content = enneagramMap[post.loc];
		return {
			...post,
			stageName: content?.stageName
		};
	});

	const communityPosts = communityBlogPosts.map((post) => {
		const content = communityMap[post.loc];
		return {
			...post,
			stageName: content?.stageName
		};
	});

	const guidesPosts = guidesBlogPosts.map((post) => {
		const content = guidesMap[post.loc];
		return {
			...post,
			stageName: content?.stageName
		};
	});

	const peoplePosts = (peopleBlogPosts.data || []).map((post) => {
		const content = peopleMap[post.loc];
		return {
			...post,
			slug: post.person, // Add slug field like in personality-analysis
			stageName: content?.stageName
		};
	});

	return {
		people: peoplePosts,
		enneagram: enneagramPosts,
		community: communityPosts,
		guides: guidesPosts
	};
};

export const actions: Actions = {
	updateStage: async ({ request, locals }) => {
		try {
			const supabase = locals.supabase;
			const body = Object.fromEntries(await request.formData());

			const contentType = body.content_type as string;

			const title = body.title as string;
			const description = body.description as string;
			const author = body.author as string;
			const date = body.date;
			const loc = body.loc as string;
			const lastmod = body.lastmod as string;
			const published = body.published as string;
			const type = body.type as string;
			const stageName = body.stageName as string;

			const { data: existingRecord, error: existingRecordError } = await supabase
				.from(`content_${contentType}`)
				.select('*')
				.eq('loc', loc);

			if (existingRecordError) {
				console.log(existingRecordError);
			}

			if (existingRecord?.length) {
				const { data: record, error: recordError } = await supabase
					.from(`content_${contentType}`)
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
					.select();
				if (recordError) {
					console.log(recordError);
				}

				return record;
			} else {
				const { data: record, error: recordError } = await supabase
					.from(`content_${contentType}`)
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
					.select();
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
};
