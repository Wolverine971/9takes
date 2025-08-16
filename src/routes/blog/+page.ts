// routes/blog/+page.ts
import { error } from '@sveltejs/kit';
// import type { slugFromPath } from './$types';
import { slugFromPath } from '$lib/slugFromPath';
import { supabase } from '$lib/supabase';

const MAX_POSTS = 3;

export const load = async (): Promise<{
	people: App.BlogPost[];
	enneagram: App.BlogPost[];
	community: App.BlogPost[];
	guides: App.BlogPost[];
}> => {
	// const modules = import.meta.glob(`/src/blog/people/*.{md,svx,svelte.md}`);

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

	// const peoplePosts = (await getAllPeoplePosts())
	// 	.filter((post: App.BlogPost) => post.published)
	// 	.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1))
	// 	.slice(0, MAX_POSTS);

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

	// const peoplePosts = posts.filter((post) => post.published); //.slice(0, MAX_POSTS);

	// publishedPosts.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));

	return {
		people: posts,
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
					if (metadata && metadata.published) {
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
		if (p?.published && p?.loc) {
			return true;
		}
	});
};
