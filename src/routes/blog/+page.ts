// src/routes/blog/+page.ts
import { error } from '@sveltejs/kit';
import { slugFromPath } from '$lib/slugFromPath';
import { supabase } from '$lib/supabase';

const MAX_POSTS = 3;

export const load = async (): Promise<{
	people: App.BlogPost[];
	enneagram: App.BlogPost[];
	community: App.BlogPost[];
	guides: App.BlogPost[];
}> => {
	const enneagramModules = import.meta.glob(`/src/blog/enneagram/**/*.{md,svx,svelte.md}`);

	const enneagramPromises = Object.entries(enneagramModules).map(([path, resolver]) =>
		resolver().then(
			(post) =>
				({
					...(post as unknown as App.MdsvexFile).metadata,
					slug: slugFromPath(path)
				}) as App.BlogPost
		)
	);

	const enneagramPosts = (await Promise.all(enneagramPromises))
		.filter((post) => post.published)
		.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1))
		.slice(0, MAX_POSTS);
	// const publishedPosts = posts.filter((post) => post.published); //.slice(0, MAX_POSTS);

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

	const communityPosts = (await Promise.all(communityPromises))
		.filter((post) => post.published)
		.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1))
		.slice(0, MAX_POSTS);

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

	const guidesPosts = (await Promise.all(guidesPromises))
		.filter((post) => post.published)
		.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1))
		.slice(0, MAX_POSTS);

	const { data: peoplePosts, error: personDataError } = await supabase
		.from('blogs_famous_people')
		.select('*')
		.eq('published', true)
		.limit(MAX_POSTS)
		.order('date', { ascending: false });
	if (personDataError) {
		console.log(personDataError);

		throw error(404, { message: 'Error getting posts' });
	}
	const posts: any = peoplePosts.map((e) => {
		return { ...e, slug: e.person };
	});

	return {
		people: posts,
		enneagram: enneagramPosts,
		community: communityPosts,
		guides: guidesPosts
	};
};
