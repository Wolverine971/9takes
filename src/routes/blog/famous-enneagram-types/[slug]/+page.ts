import { slugFromPath } from '$lib/slugFromPath';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (
	event: any
): Promise<{
	component: any;
	comments: any[];
	metadata: App.BlogPost;
	slug: string;
	suggestions: {
		niche: { type: string; posts: App.BlogPost[] };
		sameEnneagram: { type: string; posts: App.BlogPost[] };
	};
	flags: {
		userHasAnswered: boolean;
		userSignedIn: boolean;
	};
}> => {
	const params = event.params;

	const pposts: { post: any; posts: any[] } = await getAllPosts(params.slug);
	let group: any = null;
	switch (pposts.post.type[0]) {
		case 'celebrity':
			group = import.meta.glob(`/src/blog/people/celebrities/*.{md,svx,svelte.md}`);
			break;
		case 'comedians':
			group = import.meta.glob(`/src/blog/people/comedians/*.{md,svx,svelte.md}`);
			break;
		case 'creator':
			group = import.meta.glob(`/src/blog/people/creators/*.{md,svx,svelte.md}`);
			break;
		case 'lifestyleInfluencer':
			group = import.meta.glob(`/src/blog/people/lifestyle-influencers/*.{md,svx,svelte.md}`);
			break;
		case 'movieStar':
			group = import.meta.glob(`/src/blog/people/movie-stars/*.{md,svx,svelte.md}`);
			break;
		case 'musician':
			group = import.meta.glob(`/src/blog/people/musicians/*.{md,svx,svelte.md}`);
			break;
		case 'politician':
			group = import.meta.glob(`/src/blog/people/politicians/*.{md,svx,svelte.md}`);
			break;
		case 'techie':
			group = import.meta.glob(`/src/blog/people/techies/*.{md,svx,svelte.md}`);
			break;
		case 'tiktoker':
			group = import.meta.glob(`/src/blog/people/tiktokers/*.{md,svx,svelte.md}`);
			break;
		case 'historical':
			group = import.meta.glob(`/src/blog/people/historical/*.{md,svx,svelte.md}`);
			break;

		default:
			break;
	}

	let match: { path?: string; resolver?: App.MdsvexResolver } = {};
	for (const [path, resolver] of Object.entries(group)) {
		if (slugFromPath(path) === params.slug) {
			match = { path, resolver: resolver as App.MdsvexResolver };
			break;
		}
	}

	const post = await match?.resolver?.();

	if (!post || !post.metadata.published) {
		throw error(404, {
			message: `Couldn't find the blog`
		});
	}

	const sameEnneagramPosts = pposts.posts
		.filter((p) => p.published)
		.filter(
			(p) =>
				post?.metadata.enneagram && p?.enneagram === parseInt(post?.metadata.enneagram as string)
		)
		.filter((p) => params.slug !== p.slug)
		.sort(() => 0.5 - Math.random());

	const sameNichePosts = pposts.posts
		.filter((p) => p.published)
		.filter((p) => post?.metadata.type?.length && p?.type?.includes(post?.metadata.type[0]))
		.filter((p) => params.slug !== p.slug)
		.sort(() => 0.5 - Math.random());

	return {
		component: post.default,
		comments: event.data.comments,
		metadata: post.metadata as App.BlogPost,
		slug: params.slug,
		suggestions: {
			niche: { posts: sameNichePosts, type: post.metadata.type ? post.metadata.type[0] : '' },
			sameEnneagram: {
				posts: sameEnneagramPosts,
				type: post.metadata.enneagram ? post.metadata.enneagram.toString() : ''
			}
		},
		flags: event.data.flags
	};
};

const getAllPosts = async (pslug: any) => {
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
	let post = null;

	for (const category in imports) {
		for (const path in imports[category]) {
			body.push(
				imports[category][path]().then(({ metadata }: any) => {
					const parts = path.split('/');
					const slug = slugFromPath(parts[parts.length - 1]);
					if (slug === pslug) {
						post = {
							...metadata, // may not be required for sitemap
							path,
							slug
						};
					}
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

	return {
		posts: posts.filter((p) => {
			if (p?.published && p?.loc) {
				return true;
			}
		}),
		post
	};
};
