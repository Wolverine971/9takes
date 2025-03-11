import { getServerSession } from '@supabase/auth-helpers-sveltekit';
import { error, redirect } from '@sveltejs/kit';
import { slugFromPath } from '$lib/slugFromPath';
import { supabase } from '$lib/supabase';

import type { Actions } from '@sveltejs/kit';

export const load = async (
	event
): Promise<{
	people: App.BlogPost[];
	enneagram: App.BlogPost[];
	community: App.BlogPost[];
	guides: App.BlogPost[];
}> => {
	const session = await getServerSession(event);

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

	const enneagramModules = import.meta.glob(`/src/blog/enneagram/*.{md,svx,svelte.md}`);

	const enneagramPromises = Object.entries(enneagramModules).map(([path, resolver]) =>
		resolver().then(
			(post) =>
				({
					...(post as unknown as App.MdsvexFile).metadata,
					slug: slugFromPath(path)
				}) as App.BlogPost
		)
	);

	const enneagramBlogPosts = await Promise.all(enneagramPromises);
	const enneagramMap = {};
	const { data: enneagramContent, error: enneagramContentError } = await supabase
		.from(`content_enneagram`)
		.select('*');

	if (enneagramContentError) {
		console.log(enneagramContentError);
	}
	enneagramContent.forEach((content) => {
		enneagramMap[content.loc] = content;
	});
	const enneagramPosts = enneagramBlogPosts.map((post) => {
		const content = enneagramMap[post.loc];
		return {
			...post,
			stageName: content?.stageName
		};
	});

	const communityModules = import.meta.glob(`/src/blog/community/*.{md,svx,svelte.md}`);
	const communityPromises = Object.entries(communityModules).map(([path, resolver]) =>
		resolver().then(
			(post) =>
				({
					...(post as unknown as App.MdsvexFile).metadata,
					slug: slugFromPath(path)
				}) as App.BlogPost
		)
	);

	const communityBlogPosts = await Promise.all(communityPromises);
	const communityMap = {};
	const { data: communityContent, error: communityContentError } = await supabase
		.from(`content_community`)
		.select('*');

	if (communityContentError) {
		console.log(communityContentError);
	}
	communityContent.forEach((content) => {
		communityMap[content.loc] = content;
	});
	const communityPosts = communityBlogPosts.map((post) => {
		const content = communityMap[post.loc];
		return {
			...post,
			stageName: content?.stageName
		};
	});

	const guidesModules = import.meta.glob(`/src/blog/guides/*.{md,svx,svelte.md}`);

	const guidesPromises = Object.entries(guidesModules).map(([path, resolver]) =>
		resolver().then(
			(post) =>
				({
					...(post as unknown as App.MdsvexFile).metadata,
					slug: slugFromPath(path)
				}) as App.BlogPost
		)
	);

	const guidesBlogPosts = await Promise.all(guidesPromises);
	const guidesMap = {};
	const { data: guidesContent, error: guidesContentError } = await supabase
		.from(`content_guides`)
		.select('*');

	if (guidesContentError) {
		console.log(guidesContentError);
	}
	guidesContent.forEach((content) => {
		guidesMap[content.loc] = content;
	});
	const guidesPosts = guidesBlogPosts.map((post) => {
		const content = guidesMap[post.loc];
		return {
			...post,
			stageName: content?.stageName
		};
	});

	const peopleBlogPosts = await getAllPeoplePosts();
	const peopleMap = {};
	const { data: peopleContent, error: peopleContentError } = await supabase
		.from(`content_people`)
		.select('*');

	if (peopleContentError) {
		console.log(peopleContentError);
	}
	peopleContent.forEach((content) => {
		peopleMap[content.loc] = content;
	});
	const peoplePosts = peopleBlogPosts.map((post) => {
		const content = peopleMap[post.loc];
		return {
			...post,
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

const getAllPeoplePosts = async (): Promise<App.BlogPost[]> => {
	const celebrities = import.meta.glob(`/src/blog/people/celebrities/*.{md,svx,svelte.md}`);
	const comedians = import.meta.glob(`/src/blog/people/comedians/*.{md,svx,svelte.md}`);
	const creators = import.meta.glob(`/src/blog/people/creators/*.{md,svx,svelte.md}`);
	const lifestyleInfluencers = import.meta.glob(
		`/src/blog/people/lifestyle-influencers/*.{md,svx,svelte.md}`
	);
	const movieStars = import.meta.glob(`/src/blog/people/movie-stars/*.{md,svx,svelte.md}`);
	const newMovieStars = import.meta.glob(`/src/blog/people/new-movie-stars/*.{md,svx,svelte.md}`);
	const historical = import.meta.glob(`/src/blog/people/historical/*.{md,svx,svelte.md}`);
	const musicians = import.meta.glob(`/src/blog/people/musicians/*.{md,svx,svelte.md}`);
	const politicians = import.meta.glob(`/src/blog/people/politicians/*.{md,svx,svelte.md}`);
	const techies = import.meta.glob(`/src/blog/people/techies/*.{md,svx,svelte.md}`);
	const tiktokers = import.meta.glob(`/src/blog/people/tiktokers/*.{md,svx,svelte.md}`);

	const imports = [
		celebrities,
		comedians,
		creators,
		lifestyleInfluencers,
		movieStars,
		newMovieStars,
		historical,
		musicians,
		politicians,
		techies,
		tiktokers
	];

	const body = [];

	for (const category in imports) {
		for (const path in imports[category]) {
			body.push(
				imports[category][path]().then(({ metadata }) => {
					const parts = path.split('/');
					const slug = slugFromPath(parts[parts.length - 1]);
					if (metadata) {
						return {
							...metadata, // may not be required for sitemap
							path,
							slug
						};
					}
				})
			);
		}
	}
	const posts = await Promise.all(body);

	return posts.filter((p) => {
		if (p?.loc) {
			return true;
		}
	});
};

export const actions: Actions = {
	updateStage: async ({ request }) => {
		try {
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
